import React from 'react';
import { Document, Page, Text, View, Font, StyleSheet, pdf } from '@react-pdf/renderer';
import { contactLine, hasEntryContent, type CVData, type Entry } from '../lib/cv';

let registeredBase = '';
export function prepareFonts(base = '/fonts') {
  if (registeredBase === base) return;
  Font.register({ family: 'Noto Sans', fonts: [
    { src: `${base}/NotoSans-Regular.ttf`, fontWeight: 400 },
    { src: `${base}/NotoSans-Bold.ttf`, fontWeight: 700 },
  ] });
  Font.registerHyphenationCallback(word => word.length > 32 ? word.match(/.{1,24}/gu) || [word] : [word]);
  registeredBase = base;
}

const styles = StyleSheet.create({
  page: { fontFamily: 'Noto Sans', fontSize: 9.5, lineHeight: 1.6, color: '#183B55', paddingTop: 40, paddingBottom: 52, paddingHorizontal: 44 },
  stripe: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 8, backgroundColor: '#183B55' },
  header: { paddingBottom: 17, marginBottom: 9, borderBottom: '1 solid #D8E5E1' },
  name: { fontSize: 26, fontWeight: 700, lineHeight: 1.25 },
  role: { fontSize: 12, color: '#06786F', marginTop: 6 },
  contact: { fontSize: 8, color: '#5A6C78', marginTop: 10, lineHeight: 1.6 },
  section: { marginTop: 15 },
  sectionTitle: { fontSize: 9.5, fontWeight: 700, color: '#06786F', letterSpacing: 1, marginBottom: 7, textTransform: 'uppercase' },
  body: { marginBottom: 3 },
  entry: { marginBottom: 11 },
  entryTitle: { fontSize: 10.5, fontWeight: 700, lineHeight: 1.5 },
  entryMeta: { fontSize: 8.5, color: '#5A6C78', marginTop: 2, marginBottom: 5 },
});

function PDFSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <View style={styles.section}>
    <Text style={styles.sectionTitle} minPresenceAhead={35}>{title}</Text>
    {children}
  </View>;
}
function Entries({ entries }: { entries: Entry[] }) {
  return <>{entries.filter(hasEntryContent).map(entry => <View key={entry.id} style={styles.entry}>
    {(entry.title.trim() || entry.organisation.trim() || entry.period.trim()) && <View minPresenceAhead={30}>
      {entry.title.trim() && <Text style={styles.entryTitle}>{entry.title.trim()}</Text>}
      {(entry.organisation.trim() || entry.period.trim()) && <Text style={styles.entryMeta}>
        {[entry.organisation.trim(), entry.period.trim()].filter(Boolean).join(' · ')}
      </Text>}
    </View>}
    {entry.description.trim() && <Text style={styles.body} orphans={3} widows={3}>{entry.description.trim()}</Text>}
  </View>)}</>;
}

export function CVDocument({ data }: { data: CVData }) {
  const executive = data.model === 'executivo';
  const modern = data.model === 'moderno';
  const creative = data.model === 'criativo';
  const minimal = data.model === 'minimalista';
  const contact = contactLine(data);
  const work = data.experiences.filter(hasEntryContent);
  const study = data.education.filter(hasEntryContent);
  return <Document title={`CV - ${data.name.trim()}`} author={data.name.trim()} language="pt-MZ">
    <Page size="A4" style={styles.page} wrap>
      {!minimal && <View fixed style={[styles.stripe, { backgroundColor: modern || creative ? '#079C91' : '#183B55' }]} />}
      {creative && <View fixed style={{ position: 'absolute', top: 0, left: 8, right: 0, height: 7, backgroundColor: '#DAB35B' }} />}
      <View style={[styles.header, executive ? { backgroundColor: '#183B55', padding: 21, marginTop: -4, borderBottomWidth: 0 } :
        modern ? { backgroundColor: '#EBF6F1', padding: 18, borderBottomWidth: 0 } : minimal ? { borderBottomColor: '#183B55', borderBottomWidth: 1 } : {}]}>
        <Text style={[styles.name, executive ? { color: '#FFFFFF' } : creative ? { color: '#06786F' } : {}]}>{data.name.trim()}</Text>
        {data.role.trim() && <Text style={[styles.role, executive ? { color: '#B4E4DA' } : {}]}>{data.role.trim()}</Text>}
        {contact && <Text style={[styles.contact, executive ? { color: '#D9E8ED' } : {}]}>{contact}</Text>}
      </View>
      {data.profile.trim() && <PDFSection title="Perfil profissional"><Text orphans={3} widows={3}>{data.profile.trim()}</Text></PDFSection>}
      {work.length > 0 && <PDFSection title="Experiência profissional"><Entries entries={work} /></PDFSection>}
      {study.length > 0 && <PDFSection title="Formação académica"><Entries entries={study} /></PDFSection>}
      {data.skills.trim() && <PDFSection title="Competências"><Text orphans={3} widows={3}>{data.skills.trim()}</Text></PDFSection>}
      {data.languages.trim() && <PDFSection title="Línguas"><Text orphans={3} widows={3}>{data.languages.trim()}</Text></PDFSection>}
    </Page>
  </Document>;
}

/** Loaded only on export. Fonts and CV data are processed in the visitor's browser. */
export async function createPDFBlob(data: CVData): Promise<Blob> {
  prepareFonts();
  return pdf(<CVDocument data={data} />).toBlob();
}
