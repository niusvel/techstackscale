import asyncio
from playwright.async_api import async_playwright
import json
import os
import sys
from datetime import datetime

async def run_scraper():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True) 
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={'width': 1920, 'height': 1080}
        )
        page = await context.new_page()
        
        try:
            print("Accessing Hostinger...")
            await page.goto("https://www.hostinger.es/hosting-web", wait_until="networkidle", timeout=60000)
            await page.mouse.wheel(0, 500) 
            await page.wait_for_timeout(5000)
            
            print("Clearing page obstacles...")
            try:
                await page.click("button:has-text('Aceptar todo')", timeout=5000)
            except:
                await page.evaluate("""() => {
                    const cookieBanner = document.querySelector('.qc-cmp2-container, #hs-eu-cookie-confirmation, [id*="cookie"]');
                    if (cookieBanner) cookieBanner.remove();
                    
                    const kodeeChat = document.querySelector('.kodee-chat-container, [id*="kodee"]');
                    if (kodeeChat) kodeeChat.remove();
                    
                    document.querySelectorAll('.modal-backdrop, .overlay').forEach(el => el.remove());
                    document.body.style.overflow = 'auto';
                }""")

            await page.wait_for_timeout(3000)

            print("Searching for price...")
            
            price_locator = page.locator("span.price__amount").first
            
            try:
                await price_locator.wait_for(state="visible", timeout=10000)
                
                raw_price = await price_locator.inner_text()
                print(f"Captured text: {repr(raw_price)}")
            except Exception as e:
                print(f"Failed to locate main selector, trying alternative...")
                raw_price = await page.get_by_text("2,49").first.inner_text()

            clean_price_str = raw_price.replace('€', '').replace('/mes', '').replace('\n', '').replace(',', '.').strip()
            
            import re
            clean_price_str = re.sub(r'[^\d.]', '', clean_price_str)
            
            current_price = float(clean_price_str)
            
            new_data = {
                "last_update": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "providers": [
                    {
                        "id": "hostinger",
                        "name": "Hostinger",
                        "base_price": current_price,
                        "currency": "EUR",
                        "affiliate_link": "https://www.hostinger.com/techstackscale"
                    }
                ]
            }
            
            os.makedirs('data', exist_ok=True)
            with open('data/providers.json', 'w', encoding='utf-8') as f:
                json.dump(new_data, f, indent=4, ensure_ascii=False)
                
            print(f"Success! providers.json updated: {current_price}€")

        except Exception as e:
            print(f"Critical error: {e}")
            await page.screenshot(path="error_debug.png")
            print("Check error_debug.png to see why it failed.")
            sys.exit(1)
            
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run_scraper())