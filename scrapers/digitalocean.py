import asyncio
from playwright.async_api import async_playwright
import json
import os
from datetime import datetime
import sys
import re

async def run_digitalocean_scraper():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            viewport={'width': 1440, 'height': 900}
        )
        page = await context.new_page()
        
        try:
            print("Accediendo a DigitalOcean (Normalización de Features)...")
            await page.goto("https://www.digitalocean.com/pricing/droplets", wait_until="domcontentloaded", timeout=60000)
            
            # --- BYPASS DEL MODAL ---
            # (El mismo código de bypass que nos funcionó antes)
            await page.evaluate("""() => {
                const selectors = ['#onetrust-banner-sdk', '.ot-sdk-container', '[id^="onetrust"]'];
                selectors.forEach(s => {
                    const el = document.querySelector(s);
                    if (el) el.remove();
                });
                document.body.style.overflow = 'auto';
            }""")
            await page.wait_for_timeout(2000)

            plans_found = []
            # Localizamos la PRIMERA tabla y sus filas
            first_table = page.locator('table[class*="SimpleTablestyles__StyledSimpleTable"]').first
            rows = await first_table.locator('tbody tr').all()
            
            print(f"Analizando {len(rows)} filas detectadas...")

            for row in rows:
                # Obtenemos celdas directas
                cells = await row.locator('td').all()
                
                # Verificamos que tenga las 6 columnas de la imagen
                if len(cells) >= 6:
                    # Usamos .text_content() que es más resistente que .inner_text()
                    memory = (await cells[0].text_content()).strip() # Memory
                    vcpu_raw = (await cells[1].text_content()).strip() # vCPU (columna 2)
                    transfer = (await cells[2].text_content()).strip() # Transfer (columna 3)
                    ssd = (await cells[3].text_content()).strip() # SSD (columna 4)
                    
                    # Localizamos el botón del precio ($/mo - columna 6)
                    price_btn = cells[5].locator('a, button')
                    if await price_btn.count() > 0:
                        price_text = (await price_btn.first.text_content()).strip()
                        price_match = re.search(r'\$(\d+)', price_text)
                        
                        if price_match:
                            price_value = float(price_match.group(1))
                            
                            # Limpieza de vCPU: "1 vCPU" -> "1"
                            vcpu_value = re.sub(r'[^\d]', '', vcpu_raw)
                            
                            plans_found.append({
                                "plan_id": f"do_basic_{memory.lower().replace(' ', '')}",
                                "name": "DigitalOcean Regular",
                                "price": price_value,
                                "currency": "USD",
                                "is_best_seller": "8 GiB" in memory,
                                "features": [
                                    {"key": "memory", "enabled": True, "value": memory},    # Columna 1
                                    {"key": "vcpu", "enabled": True, "value": vcpu_value},  # Columna 2
                                    {"key": "transfer", "enabled": True, "value": transfer},# Columna 3
                                    {"key": "storage", "enabled": True, "value": ssd},      # Columna 4 (Igual que Hostinger)
                                    {"key": "node_apps", "enabled": True, "value": "Root Access"}
                                ]
                            })
                            print(f"-> {memory} capturado: ${price_value}")

            if not plans_found:
                raise Exception("No se pudieron leer los datos de las filas. La estructura puede ser distinta.")

            # Guardar JSON con ruta absoluta
            current_dir = os.path.dirname(os.path.abspath(__file__))
            output_path = os.path.join(current_dir, '..', 'data', 'digitalocean.json')
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump({
                    "last_update": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "provider": "DigitalOcean",
                    "plans": plans_found
                }, f, indent=4, ensure_ascii=False)
                
            print("¡Éxito! Datos guardados en data/digitalocean.json")

        except Exception as e:
            print(f"Error: {e}")
            # Guardamos captura de pantalla completa para ver la tabla tras el bypass
            await page.screenshot(path="debug_do_bypass.png", full_page=True)
            sys.exit(1)
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run_digitalocean_scraper())