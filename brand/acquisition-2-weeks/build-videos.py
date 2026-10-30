from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import sys, subprocess, json
sys.path.insert(0,str(Path('work/video-runtime').resolve()))
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parent
OUT=ROOT/'videos'; OUT.mkdir(exist_ok=True)
FRAMES=ROOT/'frames'; FRAMES.mkdir(exist_ok=True)
FONT=Path('public/fonts/NotoSans-Regular.ttf')
BOLD=Path('public/fonts/NotoSans-Bold.ttf')
W,H=720,1280
NAVY='#183B55'; TEAL='#06786F'; MINT='#E9F5F2'

def font(n,bold=False):return ImageFont.truetype(str(BOLD if bold else FONT),n)
def wrap(draw,text,f,width):
    lines=[];line=''
    for word in text.split():
        test=(line+' '+word).strip()
        if draw.textlength(test,font=f)>width and line:lines.append(line);line=word
        else:line=test
    if line:lines.append(line)
    return lines
def textblock(draw,text,xy,f,width,fill,spacing=10):
    x,y=xy
    for line in wrap(draw,text,f,width):
        draw.text((x,y),line,font=f,fill=fill)
        y+=f.size+spacing
    return y

clips=[
 {'id':'01-primeiro-cv','title':'O teu primeiro CV', 'cta':'Começa sem criar conta.', 'url':'https://cvmais.co.mz/criar-cv?utm_source=whatsapp&utm_medium=channel&utm_campaign=launch_01', 'steps':[
 ('01-start.png','1 · Abre o editor','Começa em cvmais.co.mz. O português é o idioma inicial.'),
 ('03-profile.png','2 · Apresenta-te','Preenche o teu nome e título. Usa contactos verdadeiros na tua candidatura.'),
 ('14-profile-framed.png','3 · Escreve o perfil','Resume a tua formação, prática e objectivo. Adapta os exemplos à tua realidade.'),
 ('15-education-framed.png','4 · Adiciona a formação','Inclui o curso, a instituição e as datas correctas.'),
 ('05-preview.png','5 · Pré-visualiza','Confirma como o teu percurso aparece no CV. A fotografia é opcional.')
 ]},
 {'id':'02-mudar-modelo','title':'Um novo estilo. O mesmo percurso.', 'cta':'Escolhe o estilo da tua candidatura.', 'url':'https://cvmais.co.mz/modelos?utm_source=whatsapp&utm_medium=channel&utm_campaign=launch_03', 'steps':[
 ('05-preview.png','1 · Abre a pré-visualização','No editor, selecciona «Pré-visualizar» para veres o teu CV.'),
 ('06-picker.png','2 · Mudar modelo','Abre a escolha de modelos. As miniaturas ajudam a comparar os estilos.'),
 ('07-area.png','3 · Filtra pela tua área','Escolhe uma área profissional para encontrar opções relevantes.'),
 ('08-new-model.png','4 · Escolhe e confirma','O nome, o perfil e a formação mantêm-se. Revê sempre o resultado.')
 ]},
 {'id':'03-descarregar-pdf','title':'Do editor ao PDF', 'cta':'Abre o ficheiro antes de enviar.', 'url':'https://cvmais.co.mz/criar-cv?utm_source=whatsapp&utm_medium=channel&utm_campaign=launch_04', 'steps':[
 ('08-new-model.png','1 · Confere o conteúdo','Lê o CV e confirma a versão que queres enviar.'),
 ('09-review.png','2 · Selecciona «Rever CV»','Confere os avisos. Neste exemplo, falta um contacto.'),
 ('11-reviewed.png','3 · Corrige e volta a rever','Completa o contacto. A revisão automática não substitui a tua leitura.'),
 ('13-pdf.png','4 · Descarrega e abre o PDF','Selecciona «Descarregar PDF». Confirma todas as páginas do ficheiro final.')
 ]}
]

def frame(clip,step,index,total,out):
    image=Image.new('RGB',(W,H),MINT);d=ImageDraw.Draw(image)
    d.text((40,24),'CV',font=font(38,True),fill=NAVY)
    offset=d.textlength('CV',font=font(38,True)); d.text((40+offset,24),'Mais',font=font(38,True),fill=TEAL)
    d.text((400,41),'GUIA NO TELEMÓVEL',font=font(17,True),fill=TEAL)
    name,head,caption=step
    y=textblock(d,head,(40,90),font(31,True),640,NAVY,7)
    if name:
        screenshot=Image.open(ROOT/'captures'/name).convert('RGB')
        screenshot=ImageOps.contain(screenshot,(500,850),Image.Resampling.LANCZOS)
        x=(W-screenshot.width)//2;top=190+(850-screenshot.height)//2
        d.rounded_rectangle((x-8,top-8,x+screenshot.width+8,top+screenshot.height+8),radius=20,fill='#CEDFD9')
        image.paste(screenshot,(x,top))
    else:
        d.rounded_rectangle((40,255,680,890),radius=32,fill=NAVY)
        textblock(d,clip['title'],(78,310),font(58,True),560,'#FFFFFF',16)
        textblock(d,clip['cta'],(78,645),font(29),560,'#C8E9E1',12)
        d.text((78,810),'cvmais.co.mz',font=font(33,True),fill='#FFFFFF')
    d.rectangle((0,1060,W,H),fill=NAVY)
    textblock(d,caption,(40,1080),font(24),640,'#FFFFFF',7)
    d.text((40,1226),'Demonstração · Dados fictícios',font=font(17),fill='#C8DDD9')
    d.text((490,1226),'cvmais.co.mz',font=font(19,True),fill='#FFFFFF')
    d.rectangle((0,1269,int(W*index/total),1280),fill='#079C91')
    image.save(out)

def stamp(t):
    sec=int(t);return f'00:{sec//60:02}:{sec%60:02},000'
summary=[]
for clip in clips:
    parts=[(None,'CVMais · Passo a passo',clip['title'],4)]+[(a,b,c,6) for a,b,c in clip['steps']]+[(None,'Agora é a tua vez',clip['cta']+' Visita cvmais.co.mz.',4)]
    concat=[];subs=[];current=0
    for i,(name,head,caption,duration) in enumerate(parts):
        path=FRAMES/f"{clip['id']}-{i:02}.png"
        frame(clip,(name,head,caption),i+1,len(parts),path)
        concat.extend(["file '"+path.as_posix()+"'",f'duration {duration}'])
        subs.append(f'{i+1}\n{stamp(current)} --> {stamp(current+duration)}\n{head}\n{caption}\n')
        current+=duration
    concat.append("file '"+path.as_posix()+"'")
    manifest=FRAMES/f"{clip['id']}.txt";manifest.write_text('\n'.join(concat),encoding='utf-8')
    (OUT/f"{clip['id']}.srt").write_text('\n'.join(subs),encoding='utf-8')
    output=OUT/f"{clip['id']}.mp4"
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(manifest),'-t',str(current),'-vf','fps=15,format=yuv420p','-c:v','libx264','-preset','veryfast','-crf','24','-movflags','+faststart','-an',str(output)],check=True)
    summary.append({'file':output.name,'seconds':current,'width':W,'height':H,'bytes':output.stat().st_size,'audio':False,'campaign_url':clip['url']})
    print(summary[-1],flush=True)
(ROOT/'videos.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
# A contact sheet of actual final video frames for visual QA.
thumbs=[]
for clip in clips:
    for i in [0,2,len(clip['steps'])+1]:
        p=FRAMES/f"{clip['id']}-{i:02}.png";thumbs.append(Image.open(p).resize((216,384)))
sheet=Image.new('RGB',(216*3,384*3),'white')
for i,thumb in enumerate(thumbs):sheet.paste(thumb,((i%3)*216,(i//3)*384))
sheet.save(ROOT/'video-preview.jpg',quality=92)
