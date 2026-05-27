import { test } from '@playwright/test';

test('debug auth flow and console logs', async ({ page, context }) => {
  // Listen to browser console logs
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
  });

  // Listen to all network requests
  page.on('request', request => {
    console.log(`[REQUEST] ${request.method()} ${request.url()}`);
  });

  page.on('response', response => {
    console.log(`[RESPONSE] ${response.status()} ${response.url()}`);
  });

  page.on('pageerror', exception => {
    console.log(`[BROWSER EXCEPTION] ${exception.message}`);
  });

  // Set cookies
  await context.addCookies([
    {
      name: 'access_token',
      value: 'dummy-access-token',
      domain: 'localhost',
      path: '/',
    },
    {
      name: 'refresh_token',
      value: 'dummy-refresh-token',
      domain: 'localhost',
      path: '/',
    },
    {
      name: 'user_role',
      value: 'OWNER',
      domain: 'localhost',
      path: '/',
    }
  ]);

  console.log('Navigating to /dashboard...');
  await page.goto('/dashboard');
  
  console.log('Waiting 8 seconds to capture all async tasks...');
  await page.waitForTimeout(8000);
});
