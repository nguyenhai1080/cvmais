"""Inspect the 72 fictional sector fixtures and render the actual PDF previews.
Run with the bundled Python and a Poppler pdftoppm path as the first argument.
"""
import json, re, subprocess, sys
from pathlib import Path
from pypdf import PdfReader
import pdfplumber
from PIL import Image, ImageDraw

root=Path('work/sector-qa')
poppler=sys.argv[1]
def folded(value): return ''.join(c for c in value.casefold() if c.isalnum())
models=[p.stem for p in sorted(root.glob('*.json')) if (root/f'{p.stem}-short.pdf').exists()]
assert len(models)==12
page_counts={}
for model in models:
    sample=json.loads((root/f'{model}.json').read_text(encoding='utf-8'))
    for kind in ['short','no-photo','en','long','support','sparse']:
        path=root/f'{model}-{kind}.pdf'
        reader=PdfReader(path)
        text='\n'.join(page.extract_text() for page in reader.pages)
        assert sample['name'] in text, path.name
        assert folded(sample['education'][0]['title']) in folded(text), path.name
        assert 'O teu nome' not in text, path.name
        if kind=='short': assert len(reader.pages)==1,(path.name,len(reader.pages))
        if kind=='en': assert 'education' in folded(text) and folded('formação académica') not in folded(text),path.name
        if kind=='long':
            assert len(reader.pages)>1,path.name
            assert 'END-CAREER-'+model in text and 'END-STUDY-'+model in text,path.name
        if kind=='support': assert 'END-SKILLS-'+model in text and 'END-LANGUAGES-'+model in text,path.name
        if kind not in ['sparse','support']:
            for field in ['profile','skills','languages']:
                assert folded(sample[field]) in folded(text),(path.name,field)
            for entry in sample['experiences']+sample['education']:
                for field in ['title','organisation','description']:
                    assert folded(entry[field]) in folded(text),(path.name,field)
        with pdfplumber.open(path) as document:
            for page in document.pages:
                assert 594<page.width<596 and 841<page.height<843,path.name
                assert all(c['x0']>=18 and c['x1']<=page.width-18 and c['top']>=15 and c['bottom']<=page.height-12 for c in page.chars),(path.name,'out-of-page text')
                # Catch collapsed entry heights that paint headings over their organisations.
                chars=sorted([c for c in page.chars if c['text'].strip() and c['x1']>c['x0']],key=lambda c:c['top'])
                for index,a in enumerate(chars):
                    for b in chars[index+1:]:
                        if b['top']>=a['bottom']: break
                        overlap_x=min(a['x1'],b['x1'])-max(a['x0'],b['x0'])
                        overlap_y=min(a['bottom'],b['bottom'])-max(a['top'],b['top'])
                        assert not (overlap_x>.55*min(a['x1']-a['x0'],b['x1']-b['x0']) and overlap_y>.55*min(a['bottom']-a['top'],b['bottom']-b['top'])),(path.name,'overlapping glyphs',a['text'],b['text'])
        fonts=reader.pages[0]['/Resources'].get('/Font',{})
        assert fonts,path.name
        for font in fonts.values():
            obj=font.get_object()
            for descendant in obj.get('/DescendantFonts',[]):
                descriptor=descendant.get_object().get('/FontDescriptor').get_object()
                assert '/FontFile2' in descriptor or '/FontFile3' in descriptor,(path.name,'font not embedded')
        page_counts[f'{model}-{kind}']=len(reader.pages)
    output=Path('public/template-previews')/model
    subprocess.run([poppler,'-f','1','-singlefile','-scale-to-x','595','-scale-to-y','842','-png',str(root/f'{model}-short.pdf'),str(output)],check=True,capture_output=True)
    # Render every stress-test page for visual review, independently of text checks.
    for kind in ['long','support']:
        for stale in root.glob(f'{model}-{kind}-[0-9]*.png'):
            assert stale.parent.resolve()==root.resolve()
            stale.unlink()
        subprocess.run([poppler,'-scale-to','600','-png',str(root/f'{model}-{kind}.pdf'),str(root/f'{model}-{kind}')],check=True,capture_output=True)

def contact_sheet(paths,target,columns=3,width=360):
    rows=(len(paths)+columns-1)//columns
    height=round(width*842/595)
    sheet=Image.new('RGB',(columns*(width+20)+20,rows*(height+42)+20),'#e9eeed')
    draw=ImageDraw.Draw(sheet)
    for i,(label,path) in enumerate(paths):
        image=Image.open(path).convert('RGB');image.thumbnail((width,height))
        x=20+(i%columns)*(width+20);y=20+(i//columns)*(height+42)
        sheet.paste(image,(x,y));draw.text((x,y+height+8),label,fill='#183B55')
    sheet.save(target)
contact_sheet([(model,Path('public/template-previews')/f'{model}.png') for model in models],root/'all-twelve.png')
stress=[(path.stem,path) for path in sorted(root.glob('*-long-*.png'))+sorted(root.glob('*-support-*.png'))]
for stale in root.glob('stress-[0-9]*.png'):
    assert stale.parent.resolve()==root.resolve()
    stale.unlink()
for start in range(0,len(stress),12): contact_sheet(stress[start:start+12],root/f'stress-{start//12+1}.png')
(root/'acceptance.json').write_text(json.dumps(page_counts,indent=2))
print(f'PASS: {len(page_counts)} PDFs; content, language, A4 bounds and embedded fonts; 12 previews and stress sheets rendered.')
