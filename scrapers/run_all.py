import os
import subprocess
import sys

def run_all_scrapers():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    files = os.listdir(current_dir)
    scrapers = [
        f for f in files 
        if f.endswith('.py') 
        and f != '__init__.py' 
        and f != os.path.basename(__file__)
    ]
    
    print(f"--- Found {len(scrapers)} scrapers to run ---")
    failed_scrapers = []

    for scraper in scrapers:
        scraper_path = os.path.join(current_dir, scraper)
        print(f"\n>> Executing: {scraper}...")
        result = subprocess.run(
            [sys.executable, scraper_path], 
            capture_output=True, 
            text=True,
            cwd=current_dir
        )
        if result.returncode == 0:
            print(f"SUCCESS: {scraper}")
            print(result.stdout)
        else:
            print(f"ERROR in {scraper}:")
            print("--- STDOUT ---")
            print(result.stdout)
            print("--- STDERR ---")
            print(result.stderr)
            failed_scrapers.append(scraper)

    print("\n" + "="*30)
    if not failed_scrapers:
        print("All scrapers finished successfully!")
    else:
        print(f"Failed scrapers: {', '.join(failed_scrapers)}")
        sys.exit(1)

if __name__ == "__main__":
    run_all_scrapers()