import React from 'react';
import { Document, Page, Text, View, Font, StyleSheet, pdf } from '@react-pdf/renderer';
import { contactLine, hasEntryContent, usesSidebar, type CVData, type Entry } from '../lib/cv';
let registeredBase = '';
export function prepareFonts(base = '/fonts') {
  if (registeredBase === base) return;
  Font.register({ family: 'Noto Sans', fonts: [
    { src: `${base}/NotoSans-Regular.ttf`, fontWeight: 400 },
    { src: `${base}/NotoSans-Bold.ttf`, fontWeight: 700 },
  ] });
  Font.register({ family: 'Source Serif', fonts: [
    { src: `${base}/SourceSerif4-Regular.ttf`, fontWeight: 400 },
    { src: `${base}/SourceSerif4-Bold.ttf`, fontWeight: 700 },
  ] });
  Font.registerHyphenationCallback(word => word.length > 32 ? word.match(/.{1,24}/gu) || [word] : [word]);
  registeredBase = base;
}
const styles = StyleSheet.create({
  page: { fontFamily: 'Noto Sans', fontSize: 9, lineHeight: 1.6, color: '#243C4C', paddingTop: 40, paddingBottom: 42, paddingHorizontal: 40 },
  header: { paddingBottom: 20, marginBottom: 8, borderBottom: '1 solid #DCE5E5' },
  name: { fontSize: 29, fontWeight: 700, lineHeight: 1.15 },
  role: { fontSize: 10.5, color: '#087F82', marginTop: 9 },
  contact: { fontSize: 8, color: '#5A6C78', marginTop: 12, lineHeight: 1.8 },
  section: { marginTop: 19 },
  sectionTitle: { fontSize: 9, fontWeight: 700, letterSpacing: 1.1, marginBottom: 9, textTransform: 'uppercase' },
  entry: { marginBottom: 13 },
  entryTitle: { fontSize: 10, fontWeight: 700, lineHeight: 1.5 },
  entryMeta: { fontSize: 8, color: '#6C7B86', marginTop: 3, marginBottom: 6 },
});
function Entries({ entries }: { entries: Entry[] }) {
  return <>{entries.filter(hasEntryContent).map(entry => <View key={entry.id} style={styles.entry}>
    {(entry.title.trim() || entry.organisation.trim() || entry.period.trim()) && <View minPresenceAhead={30}>
      {entry.title.trim() && <Text style={styles.entryTitle}>{entry.title.trim()}</Text>}
      {(entry.organisation.trim() || entry.period.trim()) && <Text style={styles.entryMeta}>{[entry.organisation.trim(), entry.period.trim()].filter(Boolean).join(' · ')}</Text>}
    </View>}
    {entry.description.trim() && <Text orphans={3} widows={3}>{entry.description.trim()}</Text>}
  </View>)}</>;
}
export function CVDocument({ data }: { data: CVData }) {
  const classic = data.model === 'classico';
  const modern = data.model === 'moderno';
  const creative = data.model === 'criativo';
  const first = data.model === 'primeiro';
  const executive = data.model === 'executivo';
  const minimal = data.model === 'minimalista';
  const split = usesSidebar(data);
  const accent = creative ? '#BB5A48' : first ? '#69578C' : executive ? '#967238' : minimal ? '#363B40' : '#087F82';
  const serif = executive || minimal;
  function Section({ title, children, side = false }: { title: string; children: React.ReactNode; side?: boolean }) {
    return <View style={styles.section}><Text style={[styles.sectionTitle, { color: side && classic ? '#A6DDD5' : accent }, executive || minimal ? { borderBottom: `0.6 solid ${executive ? '#C8B189' : '#CFD1D2'}`, paddingBottom: 6 } : {}]} minPresenceAhead={35}>{title}</Text>{children}</View>;
  }
  const support = (side: boolean) => <>{data.skills.trim() && <Section title="Competências" side={side}><Text orphans={3} widows={3}>{data.skills.trim()}</Text></Section>}{data.languages.trim() && <Section title="Línguas" side={side}><Text orphans={3} widows={3}>{data.languages.trim()}</Text></Section>}</>;
  const work = data.experiences.some(hasEntryContent) && <Section title="Experiência profissional"><Entries entries={data.experiences} /></Section>;
  const study = data.education.some(hasEntryContent) && <Section title="Formação académica"><Entries entries={data.education} /></Section>;
  return <Document title={`CV - ${data.name.trim()}`} author={data.name.trim()} language="pt-MZ">
    <Page size="A4" style={[styles.page, split ? classic ? { paddingLeft: 207 } : { paddingRight: 202 } : {}, minimal ? { color: '#363B40' } : {}]} wrap>
      {split && <View fixed style={{ position: 'absolute', top: 0, bottom: 0, width: 170, ...(classic ? { left: 0 } : { right: 0 }), backgroundColor: classic ? '#183B55' : creative ? '#FAEDE7' : first ? '#F0EDF6' : '#EAF5F2' }} />}
      {(modern || first || creative) && <View fixed style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, backgroundColor: accent }} />}
      {split && <View style={{ position: 'absolute', top: 38, ...(classic ? { left: 26 } : { right: 24 }), width: 120, fontSize: 8, lineHeight: 1.8, color: classic ? '#FFFFFF' : '#425365' }}>
        {classic && <View style={{ width: 64, height: 64, border: '1 solid #6D929F', borderRadius: 32, marginBottom: 18, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 24, color: '#FFFFFF' }}>{data.name.split(' ').filter(Boolean).map(n => n[0]).slice(0,2).join('')}</Text></View>}
        {contactLine(data) && <Section title="Contacto" side><Text>{[data.city, data.phone, data.email, data.website].filter(Boolean).join('\n')}</Text></Section>}
        {support(true)}
      </View>}
      <View style={[styles.header, executive ? { textAlign: 'center', borderBottomColor: '#B69862', borderBottomWidth: 2, paddingBottom: 24 } : creative ? { paddingTop: 15, paddingBottom: 24, borderBottomColor: '#BB5A48', borderBottomWidth: 3 } : minimal ? { borderBottomColor: '#363B40' } : first ? { padding: 24, backgroundColor: '#F0EDF6', borderBottomWidth: 0, borderRadius: 8 } : modern ? { padding: 22, backgroundColor: '#087F82', borderBottomWidth: 0 } : {}]}>
        <Text style={[styles.name, { ...(serif ? { fontFamily: 'Source Serif', fontSize: 35 } : {}), color: modern ? '#FFFFFF' : creative || first ? accent : '#183B55' }]}>{data.name.trim()}</Text>
        {data.role.trim() && <Text style={[styles.role, { color: modern ? '#D8F2EA' : accent }, executive ? { textTransform: 'uppercase', letterSpacing: 2, fontSize: 9 } : {}]}>{data.role.trim()}</Text>}
        {!split && contactLine(data) && <Text style={styles.contact}>{contactLine(data)}</Text>}
      </View>
      {data.profile.trim() && <Section title="Perfil profissional"><Text orphans={3} widows={3}>{data.profile.trim()}</Text></Section>}
      {first ? <>{study}{work}</> : <>{work}{study}</>}
      {!split && support(false)}
    </Page>
  </Document>;
}
export async function createPDFBlob(data: CVData): Promise<Blob> {
  prepareFonts();
  return pdf(<CVDocument data={data} />).toBlob();
}
