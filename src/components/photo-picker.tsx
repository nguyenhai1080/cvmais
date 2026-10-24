'use client';
import { useEffect, useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { normalisePhoto } from '@/lib/cv';
export default function PhotoPicker({ photo, onChange }: { photo: string; onChange: (photo: string) => void }) {
  const [source, setSource] = useState('');
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(1.5);
  const [x, setX] = useState(50);
  const [y, setY] = useState(25);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!source) return;
    let cancelled = false;
    const picture = new window.Image();
    picture.onload = () => {
      if (cancelled) return;
      if (picture.naturalWidth * picture.naturalHeight > 24_000_000 || Math.min(picture.naturalWidth,picture.naturalHeight) < 48) { setError('Escolhe uma imagem entre 48 píxeis e 24 megapíxeis.'); return; }
      setImage(picture);
    };
    picture.onerror = () => { if (!cancelled) setError('Não foi possível abrir esta imagem. Tenta outro ficheiro.'); };
    picture.src = source;
    return () => { cancelled = true; URL.revokeObjectURL(source); };
  }, [source]);
  useEffect(() => {
    if (!image || !canvas.current) return;
    const context = canvas.current.getContext('2d');
    if (!context) return;
    const edge = Math.min(image.naturalWidth,image.naturalHeight) / zoom;
    context.fillStyle = '#FFFFFF'; context.fillRect(0,0,256,256);
    context.drawImage(image,(image.naturalWidth-edge)*x/100,(image.naturalHeight-edge)*y/100,edge,edge,0,0,256,256);
  }, [image,zoom,x,y]);
  function apply() {
    if (!image || !canvas.current) return;
    try {
      const result = normalisePhoto(canvas.current.toDataURL('image/jpeg',0.86));
      if (!result) throw new Error();
      onChange(result); setSource(''); setImage(null); setError('');
    } catch { setError('Não foi possível preparar a fotografia. Tenta outra imagem.'); }
  }
  return <div className="photo-picker"><div className="photo-picker-heading"><div className="photo-avatar">{photo ? <img src={photo} alt="A tua fotografia no CV" /> : <Camera size={26} />}</div><div><h3>Fotografia (opcional)</h3><p>Adiciona um retrato e ajusta o enquadramento. O teu CV também funciona sem fotografia.</p><label className="photo-file-button">{photo ? 'Alterar fotografia' : 'Adicionar fotografia'}<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Escolher fotografia" onChange={e => {
      const file = e.target.files?.[0]; e.target.value = ''; if (!file) return;
      setError(''); setImage(null); setSource('');
      if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 8_000_000) { setError('Escolhe JPG, PNG ou WebP até 8 MB.'); return; }
      setZoom(1.5); setX(50); setY(25); setSource(URL.createObjectURL(file));
    }} /></label>{photo && <button className="photo-remove" type="button" onClick={() => onChange('')}><X size={13} /> Remover</button>}</div></div>
    {source && <div className="photo-crop"><canvas ref={canvas} width={256} height={256} aria-label="Pré-visualização do enquadramento da fotografia" /><div><label>Aproximar<input type="range" min="1" max="3" step="0.05" value={zoom} onChange={e => setZoom(Number(e.target.value))} /></label><label>Posição horizontal<input type="range" min="0" max="100" value={x} onChange={e => setX(Number(e.target.value))} /></label><label>Posição vertical<input type="range" min="0" max="100" value={y} onChange={e => setY(Number(e.target.value))} /></label><div><button className="button small" type="button" disabled={!image} onClick={apply}>Usar fotografia</button><button className="text-link" type="button" onClick={() => { setSource(''); setImage(null); }}>Cancelar</button></div></div></div>}
    {error && <p className="save-error" role="alert">{error}</p>}<small>A imagem é recortada e reduzida no teu dispositivo. Só a versão preparada é incluída no CV.</small>
  </div>;
}
