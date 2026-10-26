"""Build web-only Latin WOFF2 assets; original full TTFs remain for PDF export.
Requires fonttools[woff]. Preserves PT/EN and extended Latin diacritics.
"""
from pathlib import Path
from fontTools import subset
root = Path(__file__).resolve().parents[1] / 'public' / 'fonts'
for family in ['NotoSans', 'SourceSerif4']:
    for weight in ['Regular', 'Bold']:
        source = root / f'{family}-{weight}.ttf'
        options = subset.Options()
        options.flavor = 'woff2'
        font = subset.load_font(str(source), options)
        worker = subset.Subsetter(options=options)
        worker.populate(unicodes=subset.parse_unicodes('U+0000-024F,U+1E00-1EFF,U+2000-206F,U+20A0-20CF,U+2100-214F,U+2190-21FF,U+FEFF,U+FFFD'))
        worker.subset(font)
        # Rename modified web faces; Adobe reserves the original "Source" name.
        web_family = 'CVMaisSerif' if family == 'SourceSerif4' else 'CVMaisSans'
        for record in font['name'].names:
            if record.nameID in (1, 2, 3, 4, 6, 16, 17):
                value = {1:web_family, 2:weight, 3:f'{web_family}-{weight}-Latin',
                         4:f'{web_family} {weight}', 6:f'{web_family}-{weight}',
                         16:web_family,17:weight}[record.nameID]
                record.string = value.encode(record.getEncoding())
        target = source.with_name(f'{web_family}-{weight}-latin.woff2')
        subset.save_font(font, str(target), options)
        print(f'{target.name}: {source.stat().st_size} -> {target.stat().st_size} bytes')
