'use client';
import { useEffect, useRef, useState } from 'react';
import { DRAFT_KEY, emptyCV, isModel, readDraft, normaliseCV, type CVData } from './cv';
import { api, APIError, errorMessage, type Account, type CloudCV } from './client-api';

export function useCVStorage() {
  const [data, setData] = useState<CVData>(emptyCV);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('A abrir o CV…');
  const [saveError, setSaveError] = useState(false);
  const [cloud, setCloud] = useState(false);
  const [pending, setPending] = useState<CVData | null>(null);
  const latest = useRef(data);
  const dirty = useRef(false);
  const record = useRef<CloudCV | null>(null);
  const key = useRef(DRAFT_KEY);
  const saving = useRef(false);
  const conflict = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let cancelled = false;
    async function load() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      try {
        let restored: CVData;
        if (id) {
          setCloud(true);
          const { user } = await api<{ user: Account | null }>('session');
          if (!user) throw new Error('Entra na tua conta para abrir este CV.');
          const cv = await api<CloudCV>(`cvs/${id}`);
          if (cv.deleted) throw new Error('Este CV está no lixo. Restaura-o em Os meus CVs.');
          if (cancelled) return;
          record.current = cv;
          key.current = `cvmais-pending:${user.id}:${id}`;
          restored = normaliseCV(cv.data);
          try {
            const local = localStorage.getItem(key.current);
            if (local) setPending(readDraft(local));
          } catch { /* Server version remains available. */ }
          setStatus('CV carregado da tua conta. As alterações serão sincronizadas.');
        } else {
          let raw: string | null = null;
          try { raw = localStorage.getItem(DRAFT_KEY) || sessionStorage.getItem('cvmais-draft'); } catch { /* Allow editing without browser storage. */ }
          restored = readDraft(raw);
          const model = params.get('modelo');
          if (isModel(model)) restored.model = model;
          setStatus('Modo visitante · O rascunho fica apenas neste navegador.');
        }
        if (cancelled) return;
        latest.current = restored; setData(restored); setReady(true);
      } catch (error) { if (!cancelled) { setSaveError(true); setStatus(errorMessage(error)); } }
    }
    void load();
    const flush = (event?: BeforeUnloadEvent) => {
      if (!dirty.current) return;
      try { localStorage.setItem(key.current, JSON.stringify(latest.current)); if (!record.current) dirty.current = false; }
      catch { /* Keep the unload warning when storage cannot be written. */ }
      if (record.current || dirty.current) event?.preventDefault();
    };
    window.addEventListener('beforeunload', flush);
    return () => { cancelled = true; mounted.current = false; window.removeEventListener('beforeunload', flush); flush(); };
  }, []);

  async function save() {
    if (!ready || saving.current) return;
    if (conflict.current) { setStatus('Existe uma versão mais recente na conta. Descarrega a cópia de segurança antes de voltar a abrir o CV.'); return; }
    saving.current = true;
    try {
      do {
        const snapshot = latest.current;
        // Keep unsynced account changes recoverable even after a network failure.
        let localSaved = false;
        try { localStorage.setItem(key.current, JSON.stringify(snapshot)); localSaved = true; } catch { /* A successful cloud save is still valid. */ }
        if (record.current) {
          const saved = await api<CloudCV>(`cvs/${record.current.id}`, 'PUT', { ...record.current, data: snapshot, deleted: false });
          record.current = saved;
          if (!mounted.current) return;
          if (latest.current === snapshot) {
            dirty.current = false;
            try { localStorage.removeItem(key.current); } catch { /* Harmless pending copy. */ }
            setStatus('Guardado na tua conta. Disponível noutros dispositivos.');
          }
        } else {
          if (!localSaved) throw new Error('Não foi possível guardar neste navegador. Mantém a página aberta e descarrega uma cópia.');
          dirty.current = false; setStatus('Rascunho guardado neste dispositivo.');
        }
      } while (dirty.current && mounted.current);
      setSaveError(false);
    } catch (error) {
      if (error instanceof APIError && error.status === 409) conflict.current = true;
      if (mounted.current) { setSaveError(true); setStatus(`${errorMessage(error)} As alterações ainda não foram sincronizadas.`); }
    } finally { saving.current = false; }
  }
  useEffect(() => {
    if (!ready || !dirty.current) return;
    const timer = setTimeout(() => void save(), 900);
    return () => clearTimeout(timer);
    // save reads refs, so an in-flight save can finish with the newest snapshot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, ready]);
  function change(next: CVData) {
    latest.current = next; dirty.current = true; setData(next); setStatus('A guardar alterações…');
  }
  function restorePending() { if (pending) { change(pending); setPending(null); } }
  return { data, ready, status, saveError, cloud, pending, restorePending, change, save };
}
