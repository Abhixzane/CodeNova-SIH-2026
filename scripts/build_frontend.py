# Frontend generator script
import os
from pathlib import Path

def write_file(rel_path, content):
    p = Path('frontend') / rel_path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content.strip(), encoding='utf-8')
    print(f'Wrote {rel_path}')

print('Script builder ready')
