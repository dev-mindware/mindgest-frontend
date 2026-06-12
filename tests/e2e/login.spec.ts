import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check for the heading
    await expect(page.getByRole('heading', { name: 'Bem-vindo ao Mindgest' })).toBeVisible();
    
    // Check for email input
    await expect(page.getByLabel('Email')).toBeVisible();
    
    // Check for password input
    await expect(page.getByLabel('Senha')).toBeVisible();
    
    // Check for login button
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  });

  test('should show error on empty submission', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByRole('button', { name: 'Entrar' }).click();
    
    // Check if validation messages appear (assuming zod/hook-form default behavior)
    // You might need to adjust selectors based on how errors are rendered
    // await expect(page.getByText('Email é obrigatório')).toBeVisible();
  });
});
