import { test, expect } from '@playwright/test';

test.describe('Oráculo Semántico - Verificación CQA Visual', () => {

  test('FOUC - Pantalla negra inmediata', async ({ page }) => {
    // Interceptar para retrasar hidratación un poco y ver el HTML desnudo
    await page.route('**/*.js', async route => {
        await new Promise(r => setTimeout(r, 200));
        await route.continue();
    });

    await page.goto('http://localhost:5173/');
    const bgColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bgColor).toBe('rgb(10, 10, 10)'); // #0A0A0A

    await page.screenshot({ path: 'test-evidence/vision-01-fouc.png' });
  });

  test('UI Render y Glassmorphism', async ({ page }) => {
      await page.addInitScript(() => {
        window.__BYPASS_WORKER__ = true;
      });
      await page.goto('http://localhost:5173/');

      // Esperar a que renderice o bien esperar al boton si por alguna razon el bypass fallo
      try {
          await page.waitForSelector('input[type="text"]', { timeout: 5000 });
      } catch (e) {
          const btn = await page.waitForSelector('button', { timeout: 5000 });
          if (btn) await btn.click();
          await page.waitForSelector('input[type="text"]', { timeout: 30000 });
      }

      const inputWrapper = page.locator('input[type="text"]').locator('..');
      await expect(inputWrapper).toHaveClass(/glass/);

      await page.screenshot({ path: 'test-evidence/vision-02-glassmorphism.png' });
  });

  test('Viewport Móvil (Zero Overflow)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });

      await page.addInitScript(() => {
        window.__BYPASS_WORKER__ = true;
      });
      await page.goto('http://localhost:5173/');

      try {
          await page.waitForSelector('input[type="text"]', { timeout: 5000 });
      } catch (e) {
          const btn = await page.waitForSelector('button', { timeout: 5000 });
          if (btn) await btn.click();
          await page.waitForSelector('input[type="text"]', { timeout: 30000 });
      }

      const hasHorizontalScroll = await page.evaluate(() => {
          return document.body.scrollWidth > document.body.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);

      await page.screenshot({ path: 'test-evidence/vision-07-mobile-bounds.png' });
  });

});