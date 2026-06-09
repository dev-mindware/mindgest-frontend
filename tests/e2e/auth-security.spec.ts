import { test, expect } from '@playwright/test';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function getSessionSecret(): string {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  try {
    const envPath = path.resolve(__dirname, '../../.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/SESSION_SECRET\s*=\s*["']?([^"'\r\n]+)["']?/);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch (e) {
    console.error('Error reading .env in E2E tests:', e);
  }
  return 'dev-session-secret-change-me';
}

const secretKey = getSessionSecret();

function signRole(role: string): string {
  const signature = crypto.createHmac('sha256', secretKey).update(role).digest('hex');
  return `${role}.${signature}`;
}

const MOCK_USER = {
  id: "user-123",
  email: "test@mindgest.com",
  name: "Test User",
  role: "OWNER",
  phone: "999999999",
  company: {
    id: "company-123",
    name: "Test Company",
    email: "company@test.com",
    phone: "999999999",
    address: "Rua Teste",
    taxNumber: "500000000",
    isActive: true,
    subscription: {
      id: "sub-123",
      status: "ACTIVE",
      trialEndsAt: "2026-12-31T00:00:00Z",
      periodStartsAt: "2026-01-01T00:00:00Z",
      periodEndsAt: "2026-12-31T00:00:00Z",
      canceledAt: "",
      billingInterval: "monthly",
      paymentProvider: "stripe",
      providerClientId: "cus_123",
      providerSubscriptionId: "sub_123",
      billingPeriodInMonths: null,
      plan: {
        id: "plan-123",
        name: "Pro",
        priceMonthly: "29.99",
        isPublic: true,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
        order: 2,
        maxUsers: 10,
        maxStores: 5,
        features: {
          hasPos: true,
          canExportSaft: true,
          hasStock: true,
          hasInvoices: true,
          hasReporting: true,
          hasSuppliers: true
        }
      }
    }
  }
};

test.describe('E2E Authentication Security Tests', () => {

  test.beforeEach(async ({ page }) => {
    test.slow();

    page.on('console', msg => {
      console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
    });
    page.on('request', request => {
      console.log(`[BROWSER REQUEST] ${request.method()} ${request.url()}`);
    });
    page.on('response', response => {
      console.log(`[BROWSER RESPONSE] ${response.status()} ${response.url()}`);
    });
    page.on('pageerror', exception => {
      console.log(`[BROWSER EXCEPTION] ${exception.message}`);
    });
  });

  test('Cenário 1: Apagar o cookie refresh_token força redirecionamento para o login', async ({ page, context }) => {
    // 1. Configura cookies válidos iniciais (com assinatura na role)
    await context.addCookies([
      { name: 'access_token', value: 'valid-access-token', domain: 'localhost', path: '/' },
      { name: 'refresh_token', value: 'valid-refresh-token', domain: 'localhost', path: '/' },
      { name: 'user_role', value: signRole('OWNER'), domain: 'localhost', path: '/' }
    ]);

    // Mock do profile de sucesso
    await page.route('**/auth/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_USER)
      });
    });

    // Navega ao dashboard e aguarda carregar
    await page.goto('/dashboard');
    await page.waitForResponse(response => 
      response.url().includes('/auth/profile') && response.status() === 200
    );
    await expect(page).toHaveURL(/\/dashboard/);

    // 2. Apaga o cookie refresh_token simulando ação do atacante / expiração
    await context.clearCookies({ name: 'refresh_token' });

    // 3. Tenta recarregar a página ou navegar para rota privada
    await page.reload();

    // 4. Deve ser redirecionado para a página de login
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('Cenário 2: Apagar apenas access_token ativa refresh transparente e mantém usuário logado', async ({ page, context }) => {
    // 1. Configura refresh_token e role, mas deixa access_token em branco (expirado/deletado)
    await context.addCookies([
      { name: 'refresh_token', value: 'valid-refresh-token', domain: 'localhost', path: '/' },
      { name: 'user_role', value: signRole('OWNER'), domain: 'localhost', path: '/' }
    ]);

    // Mock da rota interna de refresh para colocar novos cookies e responder sucesso
    await page.route('**/api/auth/refresh', async (route) => {
      await context.addCookies([
        { name: 'access_token', value: 'new-refreshed-access-token', domain: 'localhost', path: '/' },
        { name: 'refresh_token', value: 'new-refreshed-refresh-token', domain: 'localhost', path: '/' },
        { name: 'user_role', value: signRole('OWNER'), domain: 'localhost', path: '/' }
      ]);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'Set-Cookie': `access_token=new-refreshed-access-token; Path=/, refresh_token=new-refreshed-refresh-token; Path=/, user_role=${signRole('OWNER')}; Path=/`
        },
        body: JSON.stringify({ success: true, accessToken: 'new-refreshed-access-token' })
      });
    });

    // Mock do profile: a primeira chamada retorna 401 (para simular token expirado), a segunda retorna 200 sucesso
    let profileCallCount = 0;
    await page.route('**/auth/profile', async (route) => {
      profileCallCount++;
      if (profileCallCount === 1) {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Token expired' })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_USER)
        });
      }
    });

    // 2. Entra no dashboard
    await page.goto('/dashboard');

    // 3. Aguarda o request do profile ter sucesso (sinal de que o refresh correu bem e o retentou)
    await page.waitForResponse(response => 
      response.url().includes('/auth/profile') && response.status() === 200
    );

    // O refresh transparente deve rodar, validar os cookies e renderizar a dashboard sem travar
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Inspeciona se os cookies foram atualizados
    const cookies = await context.cookies();
    const accessToken = cookies.find(c => c.name === 'access_token');
    expect(accessToken?.value).toBe('new-refreshed-access-token');
  });

  test('Cenário 3 & 7: Manipulação de user_role no cookie de CASHIER para OWNER (bypass de middleware) bloqueia acesso na página real do dashboard', async ({ page, context }) => {
    // 1. Configura cookies simulando que o usuário obteve uma role OWNER assinada (para passar no middleware)
    await context.addCookies([
      { name: 'access_token', value: 'valid-access-token', domain: 'localhost', path: '/' },
      { name: 'refresh_token', value: 'valid-refresh-token', domain: 'localhost', path: '/' },
      { name: 'user_role', value: signRole('OWNER'), domain: 'localhost', path: '/' }
    ]);

    // 2. Mock do profile retorna a role real do backend (CASHIER)
    const cashierUser = {
      ...MOCK_USER,
      role: 'CASHIER',
    };

    await page.route('**/auth/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(cashierUser)
      });
    });

    // 3. Tenta acessar rota restrita de owner (/dashboard)
    await page.goto('/dashboard');

    // 4. Aguarda o redirecionamento automático
    await page.waitForURL(/\/unauthorized/);

    // 5. Deve ser rejeitado pelo RouteProtector e mandado para /unauthorized
    await expect(page).toHaveURL(/\/unauthorized/);
  });

  test('Cenário 4: Cookies manipulados com assinatura inválida causam logout forçado pelo middleware', async ({ page, context }) => {
    // 1. Configura cookies com role OWNER mas com uma assinatura completamente inválida
    await context.addCookies([
      { name: 'access_token', value: 'valid-access-token', domain: 'localhost', path: '/' },
      { name: 'refresh_token', value: 'valid-refresh-token', domain: 'localhost', path: '/' },
      { name: 'user_role', value: 'OWNER.invalid-signature-value-here', domain: 'localhost', path: '/' }
    ]);

    // 2. Acessa o dashboard
    await page.goto('/dashboard');

    // 3. O middleware deve detectar a assinatura inválida, apagar todos os cookies e redirecionar para o login
    await expect(page).toHaveURL(/\/auth\/login/);

    const cookies = await context.cookies();
    expect(cookies.find(c => c.name === 'refresh_token')).toBeUndefined();
    expect(cookies.find(c => c.name === 'user_role')).toBeUndefined();
  });

  test('Cenário 5: Apagar apenas o cookie de role mantendo os tokens faz middleware limpar a sessão e forçar login', async ({ page, context }) => {
    // 1. Configura cookies sem o cookie user_role
    await context.addCookies([
      { name: 'access_token', value: 'valid-access-token', domain: 'localhost', path: '/' },
      { name: 'refresh_token', value: 'valid-refresh-token', domain: 'localhost', path: '/' }
    ]);

    // 2. Acessa o dashboard
    await page.goto('/dashboard');

    // 3. O middleware deve detectar cookies corrompidos (refresh mas sem role), apagar os remanescentes e forçar login
    await expect(page).toHaveURL(/\/auth\/login/);

    const cookies = await context.cookies();
    expect(cookies.find(c => c.name === 'refresh_token')).toBeUndefined();
  });

});
