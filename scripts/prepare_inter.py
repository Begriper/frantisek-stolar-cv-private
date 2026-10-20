"""Remove Inter's optional PUA aliases so Chromium exports real Unicode text.

Usage: python scripts/prepare_inter.py INPUT_DIRECTORY OUTPUT_DIRECTORY
Requires fonttools[woff]. Input: original Inter v4.1 static WOFF2 files.
Outlines, metrics, glyphs and OpenType features remain unchanged.
"""
from pathlib import Path
import sys
from fontTools.ttLib import TTFont

source, destination = map(Path, sys.argv[1:])
destination.mkdir(parents=True, exist_ok=True)
for weight in ('Regular', 'Medium', 'SemiBold', 'Bold'):
    name = f'Inter-{weight}.woff2'
    font = TTFont(source / name)
    removed = 0
    for table in font['cmap'].tables:
        if table.isUnicode():
            for code in list(table.cmap):
                if 0xE000 <= code <= 0xF8FF or 0xF0000 <= code <= 0x10FFFF:
                    del table.cmap[code]
                    removed += 1
    font.save(destination / name)
    print(f'{name}: removed {removed} private-use aliases')
