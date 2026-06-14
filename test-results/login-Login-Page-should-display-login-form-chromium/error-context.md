# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.ts >> Login Page >> should display login form
- Location: tests\e2e\login.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByLabel('Email')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByLabel('Email')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e6]:
        - img "Hero Background" [ref=e8]
        - img "Mindware Logo" [ref=e11]
        - generic [ref=e12]:
          - heading "MindGest - O futuro da gestão empresarial." [level=1] [ref=e13]
          - paragraph [ref=e14]: Um ERP inovador para gestão da sua empresa de forma simples e robusta.
          - generic [ref=e17]: MINDWARE - Comércio & Serviços
      - generic [ref=e20]:
        - generic [ref=e21]:
          - img "Logo" [ref=e22]
          - heading "Bem-vindo(a) ao MindGest" [level=1] [ref=e23]
        - generic [ref=e24]:
          - generic [ref=e25]:
            - generic [ref=e26]: Email
            - generic [ref=e27]:
              - img [ref=e28]
              - textbox "Endereço de email" [ref=e31]
          - generic [ref=e32]:
            - generic [ref=e33]:
              - generic [ref=e34]: Senha
              - generic [ref=e35]:
                - img [ref=e36]
                - textbox "Insira a senha" [ref=e39]
                - button [ref=e40]:
                  - img [ref=e41]
            - link "Esqueceu sua senha?" [ref=e44] [cursor=pointer]:
              - /url: /auth/forgot-password
          - button "Entrar" [ref=e45] [cursor=pointer]
        - generic [ref=e46]:
          - text: Não tem uma conta?
          - link "Crie nova" [ref=e47] [cursor=pointer]:
            - /url: /auth/register
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e53] [cursor=pointer]:
    - generic [ref=e56]:
      - text: Compiling
      - generic [ref=e57]:
        - generic [ref=e58]: .
        - generic [ref=e59]: .
        - generic [ref=e60]: .
  - alert [ref=e61]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Login Page', () => {
  4  |   test('should display login form', async ({ page }) => {
  5  |     await page.goto('/auth/login');
  6  |     
  7  |     // Check for the heading
  8  |     await expect(page.getByRole('heading', { name: 'Bem-vindo(a) ao MindGest' })).toBeVisible();
  9  |     
  10 |     // Check for email input
> 11 |     await expect(page.getByLabel('Email')).toBeVisible();
     |                                            ^ Error: expect(locator).toBeVisible() failed
  12 |     
  13 |     // Check for password input
  14 |     await expect(page.getByLabel('Senha')).toBeVisible();
  15 |     
  16 |     // Check for login button
  17 |     await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  18 |   });
  19 | 
  20 |   test('should show error on empty submission', async ({ page }) => {
  21 |     await page.goto('/auth/login');
  22 |     await page.getByRole('button', { name: 'Entrar' }).click();
  23 |     
  24 |     // Check if validation messages appear (assuming zod/hook-form default behavior)
  25 |     // You might need to adjust selectors based on how errors are rendered
  26 |     // await expect(page.getByText('Email é obrigatório')).toBeVisible();
  27 |   });
  28 | });
  29 | 
```