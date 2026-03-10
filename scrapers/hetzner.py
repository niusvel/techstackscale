import asyncio
from playwright.async_api import async_playwright
import json
import os
from datetime import datetime
import re

async def run_hetzner_final_fixed():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={'width': 1920, 'height': 1080}
        )
        page = await context.new_page()
        
        try:
            print("Accediendo a Hetzner Cloud (Extracción de Celdas)...")
            await page.goto("https://www.hetzner.com/cloud", wait_until="networkidle", timeout=90000)

            # 1. Aceptar cookies para limpiar el DOM
            await page.evaluate("""() => {
                const btn = document.querySelector('cf-root')?.shadowRoot?.querySelector('button.cf-button-accept-all');
                if (btn) btn.click();
            }""")
            
            # 2. Esperar a que los precios se "hidraten"
            print("Esperando hidratación de precios...")
            await page.wait_for_selector("ho-price-container[eurprice]", timeout=20000)

            # 3. EXTRACCIÓN QUIRÚRGICA: Buscamos filas y perforamos sus Shadow DOMs
            print("Extrayendo filas de la tabla...")
            plans_raw = await page.evaluate("""() => {
                const results = [];
                // Buscamos todas las filas de la tabla de precios
                const rows = document.querySelectorAll('tr');
                
                rows.forEach(row => {
                    // Buscamos el componente de precio dentro de esta fila
                    const priceTag = row.querySelector('ho-price-container.ipv4');
                    if (priceTag) {
                        const price = priceTag.getAttribute('eurprice');
                        // Obtenemos el texto de todas las celdas de esta fila específica
                        const rowText = row.innerText; 
                        if (price && rowText.length > 10) {
                            results.push({ p: price, txt: rowText });
                        }
                    }
                });
                return results;
            }""")

            plans_found = []
            seen_rams = set()

            for item in plans_raw:
                # Hetzner suele poner: "Nombre | vCPU | RAM | SSD | Tráfico | Precio"
                # Usamos una limpieza agresiva del texto
                text = item['txt'].replace('\t', ' ').replace('\n', ' ')
                
                # Buscamos patrones claros
                ram_match = re.search(r'(\d+)\s*GB', text)
                cpu_match = re.search(r'(\d+)\s*vCPU', text)
                
                if ram_match and cpu_match:
                    ram = ram_match.group(1)
                    price = float(item['p'])
                    
                    # Filtramos duplicados y nos quedamos con los planes Cloud Standard (precios bajos)
                    if ram not in seen_rams and price < 60:
                        seen_rams.add(ram)
                        plans_found.append({
                            "plan_id": f"hetzner_cx{ram}",
                            "name": f"Hetzner CX{ram}",
                            "price": price,
                            "currency": "EUR",
                            "features": [
                                {"key": "memory", "enabled": True, "value": f"{ram} GB"},
                                {"key": "vcpu", "enabled": True, "value": f"{cpu_match.group(1)} vCPU"},
                                {"key": "storage", "enabled": True, "value": "NVMe SSD"},
                                {"key": "transfer", "enabled": True, "value": "20 TB"}
                            ]
                        })
                        print(f"✅ ¡Plan Emparejado!: {ram}GB -> {price}€")

            if plans_found:
                # Guardar el JSON
                output_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'hetzner.json')
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                with open(output_path, 'w', encoding='utf-8') as f:
                    json.dump({
                        "last_update": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "provider": "Hetzner",
                        "plans": sorted(plans_found, key=lambda x: x['price'])[:4]
                    }, f, indent=4)
                print(f"--- ¡LO LOGRAMOS! {len(plans_found)} planes guardados ---")
            else:
                print("No se pudieron emparejar los datos. El texto de la fila no contenía los patrones GB/vCPU.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run_hetzner_final_fixed())