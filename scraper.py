import asyncio
from playwright.async_api import async_playwright
import json
import os
from datetime import datetime

async def run_scraper():
    async with async_playwright() as p:
        # Usamos headless=True para que sea más rápido, pero puedes poner False para ver el proceso
        browser = await p.chromium.launch(headless=True) 
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={'width': 1920, 'height': 1080}
        )
        page = await context.new_page()
        
        try:
            print("Accessing Hostinger...")
            # Aumentamos el tiempo de espera por si la red va lenta
            await page.goto("https://www.hostinger.es/hosting-web", wait_until="domcontentloaded", timeout=60000)
            
            # 1. ELIMINACIÓN AGRESIVA DE MODALES (Cookies y Chat)
            print("Clearing page obstacles...")
            # Intentamos aceptar cookies por el método normal primero
            try:
                await page.click("button:has-text('Aceptar todo')", timeout=5000)
            except:
                # Si falla el clic, usamos JS para borrar el banner y el chat Kodee
                await page.evaluate("""() => {
                    const cookieBanner = document.querySelector('.qc-cmp2-container, #hs-eu-cookie-confirmation, [id*="cookie"]');
                    if (cookieBanner) cookieBanner.remove();
                    
                    const kodeeChat = document.querySelector('.kodee-chat-container, [id*="kodee"]');
                    if (kodeeChat) kodeeChat.remove();
                    
                    // Quitar el overlay gris que a veces bloquea los clics
                    document.querySelectorAll('.modal-backdrop, .overlay').forEach(el => el.remove());
                    document.body.style.overflow = 'auto';
                }""")

            # Pequeña pausa para que el DOM se asiente tras borrar elementos
            await page.wait_for_timeout(3000)

            # 2. BÚSQUEDA DEL PRECIO
            print("Searching for price...")
            
            # Definimos el locator (SIN await aquí)
            # Buscamos el contenedor que tiene la clase 'price__amount'
            price_locator = page.locator("span.price__amount").first
            
            try:
                # Esperamos a que el locator esté presente y sea visible
                await price_locator.wait_for(state="visible", timeout=10000)
                
                # Ahora sí usamos await para extraer el texto
                raw_price = await price_locator.inner_text()
                print(f"Captured text: {repr(raw_price)}")
            except Exception as e:
                print(f"Failed to locate main selector, trying alternative...")
                # Alternativa: buscar por texto si el selector de clase falla
                raw_price = await page.get_by_text("2,49").first.inner_text()

            # 3. LIMPIEZA Y GUARDADO
            # Eliminamos cualquier carácter no numérico excepto el punto/coma
            clean_price_str = raw_price.replace('€', '').replace('/mes', '').replace('\n', '').replace(',', '.').strip()
            
            # Si el texto capturado tiene basura, forzamos la limpieza a solo números y punto
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
            
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run_scraper())