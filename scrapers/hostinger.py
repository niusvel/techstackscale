import asyncio
from playwright.async_api import async_playwright
import json
import os
from datetime import datetime
import re
import sys

async def run_hostinger_scraper():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        
        try:
            print("Accessing Hostinger...")
            await page.goto("https://www.hostinger.es/hosting-web", wait_until="networkidle", timeout=60000)
            
            cards_locator = page.locator(".h-pricing-card")
            count = await cards_locator.count()
            
            plans_data = {}
            # Definimos las claves para internacionalización según el orden que comentaste
            feature_keys = ["websites", "node_apps", "storage", "emails", "domain"]

            for i in range(count):
                card = cards_locator.nth(i)
                
                title_el = card.locator(".h-pricing-card__title")
                if await title_el.count() == 0: continue
                title = (await title_el.first.inner_text()).strip()
                
                if title in plans_data: continue

                # IDENTIFICACIÓN DEL MÁS VENDIDO (Best Seller)
                # Buscamos el div del badge y verificamos si contiene el texto bold
                badge_locator = card.locator(".h-pricing-card__badge .h-t-body-2-bold")
                is_best_seller = await badge_locator.count() > 0

                # Precio y Features (mantenemos tu lógica precisa)
                current_price = await card.locator(".h-dynamic-size-price").first.get_attribute("price")
                
                features_status = []
                feature_keys = ["websites", "node_apps", "storage", "emails", "domain"]
                feature_elements = await card.locator(".h-plan-feature__content .h-t-body-2").all()
                
                features_status = []
                for idx in range(min(4, len(feature_elements))):
                    feat_el = feature_elements[idx]
                    is_disabled = await feat_el.evaluate("el => el.classList.contains('h-plan-feature__content--disabled')")
                    
                    # Extraer solo el valor numérico/clave
                    text = (await feat_el.inner_text()).strip()
                    value_match = re.search(r'(\d+)', text)
                    value = value_match.group(1) if value_match else text

                    features_status.append({
                        "key": feature_keys[idx],
                        "enabled": not is_disabled,
                        "value": value if not is_disabled else None
                    })

                plans_data[title] = {
                    "plan_id": title.lower().replace(" ", "_"),
                    "name": title,
                    "price": float(current_price) if current_price else 0.0,
                    "is_best_seller": is_best_seller, # Nueva propiedad clave
                    "features": features_status
                }
                if is_best_seller: print(f"[BEST SELLER] {title} identified")

            output = {
                "last_update": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "provider": "Hostinger",
                "plans": list(plans_data.values())
            }

            current_dir = os.path.dirname(os.path.abspath(__file__))
            output_path = os.path.join(current_dir, '..', 'data', 'hostinger.json')
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(output, f, indent=4, ensure_ascii=False)
                
            print("Success! Data ready for internationalization.")

        except Exception as e:
            print(f"Scraper error: {e}")
            sys.exit(1)
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run_hostinger_scraper())