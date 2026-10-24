'use client';
import { t as ui, useUILanguage } from '@/lib/ui-language';
import { useRef, useState } from 'react';
import { parseCVBackup } from '@/lib/cv-backup';
import { normaliseCV, type CVData } from '@/lib/cv';
export default function GuestBackupImport({ disabled, current, onImport }: { disabled: boolean; current: CVData; onImport: (data: CVData) => void }) {const {translate:ui}=useUILanguage();
  const file = useRef<HTMLInputElement>(null);
  const [candidate, setCandidate] = useState<CVData | null>(null);
  const [previous, setPrevious] = useState<CVData | null>(null);
  const [error, setError] = useState('');
  return <div><button className="text-link" type="button" disabled={disabled} onClick={() => file.current?.click()}>{ui("Importar cópia de segurança")}</button><input ref={file} type="file" accept="application/json,.json" className="visually-hidden" aria-label={ui("Importar ficheiro de cópia de segurança")} disabled={disabled} onChange={async event => {
    const selected = event.target.files?.[0]; event.target.value = ''; if (!selected) return;
    setError(''); setCandidate(null);
    try { if (selected.size > 512_000) throw new Error('O ficheiro é demasiado grande.'); setCandidate(normaliseCV(parseCVBackup(await selected.text()))); }
    catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível abrir o ficheiro.'); }
  }} />{candidate && <section className="import-review" aria-label={ui("Rever cópia de segurança")}><h2>{ui("Importar este CV?")}</h2><p><strong>{candidate.name || ui("CV sem nome")}</strong> · {candidate.experiences.length}{ui(" experiências · ")}{candidate.education.length}{ui(" formações")}</p><p>{ui("Esta cópia vai substituir o rascunho de visitante aberto neste navegador. Descarrega primeiro uma cópia do rascunho actual se precisares dele. O ficheiro é lido no teu dispositivo.")}</p><button type="button" className="button small" disabled={disabled} onClick={() => { setPrevious(current); onImport(candidate); setCandidate(null); }}>{ui("Confirmar importação")}</button><button type="button" className="text-link" onClick={() => setCandidate(null)}>{ui("Cancelar")}</button></section>}{previous && <p role="status">{ui("Cópia importada. ")}<button type="button" className="text-link" disabled={disabled} onClick={() => { onImport(previous); setPrevious(null); }}>{ui("Anular importação")}</button></p>}{error && <p className="save-error" role="alert">{ui(error)}</p>}</div>;
}
