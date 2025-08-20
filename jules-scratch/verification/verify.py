import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Get the absolute path to the index.html file
        html_file_path = os.path.abspath('index.html')

        await page.goto(f'file://{html_file_path}')

        # Screenshot in Portuguese (default)
        await page.screenshot(path="jules-scratch/verification/verification-pt.png")

        # Change to English and take a screenshot
        await page.select_option('#language-select', 'en')
        await page.wait_for_timeout(500) # Wait for the language to load
        await page.screenshot(path="jules-scratch/verification/verification-en.png")

        # Change to Japanese and take a screenshot
        await page.select_option('#language-select', 'ja')
        await page.wait_for_timeout(500) # Wait for the language to load
        await page.screenshot(path="jules-scratch/verification/verification-ja.png")

        # Change to Chinese and take a screenshot
        await page.select_option('#language-select', 'zh')
        await page.wait_for_timeout(500) # Wait for the language to load
        await page.screenshot(path="jules-scratch/verification/verification-zh.png")

        # Scroll to projects and take a screenshot of the carousel
        await page.goto(f'file://{html_file_path}#projects')
        await page.wait_for_timeout(500) # Wait for scroll and animations
        await page.screenshot(path="jules-scratch/verification/verification-carousel.png")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
