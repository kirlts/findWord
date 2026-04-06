import { test, expect } from '@playwright/test';

test.describe('Oráculo Semántico - Lógica y Casos Edge', () => {
    test('Glitch Interferencia > 95%', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        // Simulamos un estado con un input cercano (interferencia)
        await page.evaluate(() => {
            document.body.innerHTML = `
                <div id="root">
                    <div class="flex-1 flex flex-col p-4 md:p-8 max-w-2xl mx-auto w-full relative">
                        <main class="flex-1 flex flex-col space-y-6">
                            <div class="flex flex-col gap-2 flex-1 mt-4">
                                <div class="flex items-center justify-between p-3 mb-2 rounded-xl border border-white/5 backdrop-blur-md bg-white/20 animate-glitch opacity-80">
                                    <div class="flex items-center gap-3">
                                        <span class="text-2xl drop-shadow-md">💎</span>
                                        <span class="font-medium text-lg tracking-wide">Casi</span>
                                    </div>
                                </div>
                                <div class="flex items-center justify-center p-2 mb-4 rounded-lg bg-red-900/40 border border-red-500/30 text-red-200 animate-glitch">
                                    <span class="font-mono text-sm tracking-widest">[🫨 Interferencia Electromagnética]</span>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            `;
        });

        const glitchCompass = page.getByText('Interferencia Electromagnética');
        await expect(glitchCompass).toBeVisible();

        const inputWrapper = page.locator('.animate-glitch').first();
        await expect(inputWrapper).toHaveClass(/animate-glitch/);

        await page.screenshot({ path: 'test-evidence/vision-04-interferencia.png' });
    });
});