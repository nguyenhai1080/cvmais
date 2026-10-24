from pathlib import Path
from pypdf import PdfReader
import pdfplumber

for directory in ['work/template-pdfs', 'work/pdf-qa']:
    files = list(Path(directory).glob('*.pdf'))
    if directory.endswith('pdf-qa'):
        files = [p for p in files if p.stem in ['classico','moderno','minimalista','criativo','executivo','primeiro','long-support'] or p.stem.startswith('long-')]
    for path in files:
        reader = PdfReader(path)
        text = ' '.join('\n'.join(p.extract_text() for p in reader.pages).split())
        assert 'FORMAÇÃO ACADÉMICA' in text, path
        assert 'Moçambique' in text, path
        assert 'O teu nome' not in text, path
        if not path.stem.startswith('long-'):
            assert len(reader.pages) == 1, (path, len(reader.pages))
        elif path.stem == 'long-support':
            assert 'FIM DAS COMPETÊNCIAS.' in text, path
        else:
            assert len(reader.pages) > 1, path
            assert 'FIM DA PRIMEIRA EXPERIÊNCIA.' in text and 'FIM DA SEGUNDA EXPERIÊNCIA.' in text, path
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                assert all(c['x0'] >= 22 and c['x1'] <= page.width - 20 and c['top'] >= 28 and c['bottom'] <= page.height - 25 for c in page.chars), (path, 'text outside bounds')
        for font in reader.pages[0]['/Resources']['/Font'].values():
            font = font.get_object()
            for desc in font.get('/DescendantFonts', []):
                assert '/FontFile2' in desc.get_object()['/FontDescriptor'].get_object(), (path, 'font not embedded')
        print(f'{path.name}: {len(reader.pages)} pages; accents, content, fonts and bounds passed')
