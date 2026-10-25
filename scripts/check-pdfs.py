from pathlib import Path
from pypdf import PdfReader
import pdfplumber

for directory in ['work/template-pdfs', 'work/pdf-qa']:
    files = list(Path(directory).glob('*.pdf'))
    if directory.endswith('pdf-qa'):
        files = [p for p in files if p.stem in ['classico','moderno','minimalista','criativo','executivo','primeiro','tecnico','saude','engenharia','servico','long-support'] or p.stem.startswith(('long-', 'en-'))]
    for path in files:
        reader = PdfReader(path)
        if directory.endswith('template-pdfs'):
            xobjects = reader.pages[0]['/Resources'].get('/XObject', {})
            assert any(obj.get_object().get('/Subtype') == '/Image' for obj in xobjects.values()), (path, 'missing portrait')
        text = ' '.join('\n'.join(p.extract_text() for p in reader.pages).split())
        english = path.stem.startswith('en-')
        assert ('EDUCATION' if english else 'FORMAÇÃO ACADÉMICA') in text.upper(), path
        if english:
            assert 'WORK EXPERIENCE' in text.upper(), path
            assert 'SKILLS' in text.upper() and 'LANGUAGES' in text.upper(), path
            assert str(reader.trailer['/Root'].get('/Lang')) == 'en', path
            assert 'João José Mucavele' in text, path
        assert 'Moçambique' in text, path
        assert 'O teu nome' not in text, path
        if path.stem == 'en-long':
            assert len(reader.pages) > 1 and 'FINAL ENGLISH CONTENT.' in text, path
        elif not path.stem.startswith('long-'):
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
