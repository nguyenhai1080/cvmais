import SignatureDocument from './signature-pdf';
import { signatureDesign } from '../lib/signature-designs';
import { designModel } from '../lib/industry-catalogue';
import { labelsForCV } from '../lib/cv-language';
import React from 'react';
import { Document, Page, Text, View, Image, Svg, Path, Font, StyleSheet, pdf } from '@react-pdf/renderer';
import { hasEntryContent, usesSidebar, type CVData, type Entry } from '../lib/cv';
import { themes, contacts, chips, iconPaths, type IconKind } from '../lib/resume-design';
let registeredBase = '';
export function prepareFonts(base = '/fonts') {
  if (registeredBase === base) return;
  Font.register({ family: 'Noto Sans', fonts: [{ src: `${base}/NotoSans-Regular.ttf`, fontWeight: 400 }, { src: `${base}/NotoSans-Bold.ttf`, fontWeight: 700 }] });
  Font.register({ family: 'Source Serif', fonts: [{ src: `${base}/SourceSerif4-Regular.ttf`, fontWeight: 400 }, { src: `${base}/SourceSerif4-Bold.ttf`, fontWeight: 700 }] });
  Font.registerHyphenationCallback(word => word.length > 32 ? word.match(/.{1,24}/gu) || [word] : [word]);
  registeredBase = base;
}
const s = StyleSheet.create({
  page: { fontFamily: 'Noto Sans', fontSize: 9, lineHeight: 1.52, padding: 34, paddingBottom: 40, color: '#263D49' },
  header: { position: 'relative', paddingBottom: 20 },
  identity: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 31, lineHeight: 1.12, fontWeight: 700 },
  role: { fontSize: 11, marginTop: 7 },
  portrait: { width: 82, height: 82, objectFit: 'cover', borderRadius: 9 },
  contactBar: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#F1F5F4', padding: 10, marginBottom: 2 },
  contact: { flexDirection: 'row', width: '50%', paddingVertical: 3, paddingRight: 10, alignItems: 'flex-start' },
  contactText: { fontSize: 7.6, flex: 1, marginLeft: 6, lineHeight: 1.55 },
  summary: { fontSize: 9.2, lineHeight: 1.6, marginTop: 12 },
  section: { marginTop: 19 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', paddingBottom: 6, marginBottom: 10, borderBottom: '1 solid #DDE7E7' },
  sectionTitle: { fontSize: 10.5, fontWeight: 700, letterSpacing: 0.35, marginLeft: 7, textTransform: 'uppercase' },
  entry: { paddingLeft: 14, borderLeft: '0.7 solid #DCE7E7', marginLeft: 3, paddingBottom: 15, position: 'relative' },
  dot: { width: 6, height: 6, position: 'absolute', left: -3.4, top: 5, borderRadius: 3 },
  entryTitle: { fontSize: 10.8, lineHeight: 1.35, fontWeight: 700 },
  organisation: { fontSize: 9, marginTop: 3, lineHeight: 1.4 },
  period: { fontSize: 7.5, marginTop: 3, marginBottom: 7 },
  bullet: { flexDirection: 'row', marginBottom: 4 },
  bulletMark: { width: 9, fontSize: 8 },
  bulletText: { flex: 1 },
  chipList: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { paddingVertical: 4, paddingHorizontal: 6, fontSize: 7.6, marginRight: 5, marginBottom: 5, borderRadius: 3, lineHeight: 1.35 },
  language: { paddingVertical: 6, borderBottom: '0.6 solid #DBE4E5', fontSize: 8.1 },
});
function Icon({ kind, color, size = 13 }: { kind: IconKind; color: string; size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d={iconPaths[kind]} stroke={color} fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
}
function Paragraphs({ text, color }: { text: string; color: string }) {
  const lines = text.trim().split('\n').filter(line => line.trim());
  if (lines.length > 1 && lines.length <= 12 && lines.every(line => line.length < 400)) return <>{lines.map((line,i) => <View style={s.bullet} key={i}><Text style={[s.bulletMark,{color}]}>•</Text><Text style={s.bulletText} orphans={3} widows={3}>{line.replace(/^[•\-]\s*/, '')}</Text></View>)}</>;
  return <Text orphans={3} widows={3}>{text.trim()}</Text>;
}
function Entries({ entries, accent, timeline, compact=false }: { entries: Entry[]; accent: string; timeline: boolean; compact?:boolean }) {
  return <>{entries.filter(hasEntryContent).map(entry => <View key={entry.id} style={timeline ? s.entry : { marginBottom: compact?8:11 }}>
    {timeline && <View style={[s.dot,{backgroundColor:accent}]} />}
    <View minPresenceAhead={35}>{entry.title.trim() && <Text style={s.entryTitle}>{entry.title.trim()}</Text>}{entry.organisation.trim() && <Text style={s.organisation}>{entry.organisation.trim()}</Text>}{entry.period.trim() && <Text style={[s.period,{color:accent}]}>{entry.period.trim()}</Text>}</View>
    {entry.description.trim() && <Paragraphs text={entry.description} color={accent} />}
  </View>)}</>;
}
export function CVDocument({ data }: { data: CVData }) {
  if(signatureDesign(data.model))return <SignatureDocument data={data}/>;
  const family=designModel(data.model);
  const labels = labelsForCV(data);
  const t = themes[data.model];
  const classic = family === 'classico', modern = family === 'moderno', creative = family === 'criativo', first = family === 'primeiro', executive = family === 'executivo', minimal = family === 'minimalista';
  const tech=family==='tecnico', health=family==='saude', engineering=family==='engenharia', service=family==='servico';
  const educationFirst=first||health;const portraitFirst=modern||first||health||service;
  const split = usesSidebar(data);
  const studySide = split && (modern || executive);
  const inlineProfile = classic && data.profile.trim().length > 0 && data.profile.trim().length < 520;
  function Section({ title, kind, children, firstSide = false }: { title: string; kind: IconKind; children: React.ReactNode; firstSide?: boolean }) {
    return <View style={[s.section,firstSide?{marginTop:0}:minimal?{marginTop:13}:engineering?{marginTop:10}:tech?{marginTop:12}:{}]}><View style={[s.sectionHeading, { borderBottomColor: executive ? '#CDB68F' : t.accent + '55' },minimal?{marginBottom:8,paddingBottom:5}:engineering?{backgroundColor:t.pale,borderBottomWidth:0,borderLeft:`3 solid ${t.accent}`,padding:5,marginBottom:7}:tech?{marginBottom:7}:{}]} minPresenceAhead={40}><Icon kind={kind} color={t.accent} /><Text style={[s.sectionTitle,{color:t.accent},executive || minimal || service ? {fontFamily:'Source Serif',fontSize:12.5,textTransform:'none',letterSpacing:0} : {}]}>{title}</Text></View>{children}</View>;
  }
  const study = data.education.some(hasEntryContent) && <Section title={labels.study} kind="study"><Entries entries={data.education} accent={t.accent} timeline={!executive && !minimal && !engineering && !tech} compact={tech||engineering} /></Section>;
  const work = data.experiences.some(hasEntryContent) && <Section title={labels.work} kind="work"><Entries entries={data.experiences} accent={t.accent} timeline={!executive && !minimal && !engineering && !tech} compact={tech||engineering} /></Section>;
  const skills = chips(data.skills);
  const support = <>{data.skills.trim() && <Section title={labels.skills} kind="skills" firstSide={split && (classic || creative || first)}>{skills ? <View style={s.chipList}>{skills.map((skill,i) => <Text key={i} style={[s.chip,{backgroundColor: modern || classic ? t.accent : t.pale,color:modern || classic ? '#FFFFFF' : t.accent,border: `0.5 solid ${t.accent}44`}]}>{skill}</Text>)}</View> : <Text orphans={3} widows={3}>{data.skills.trim()}</Text>}</Section>}{studySide && study}{data.languages.trim() && <Section title={labels.languages} kind="languages" firstSide={split && (classic || creative || first) && !data.skills.trim()}>{minimal ? <Text>{data.languages.trim().replaceAll('\n',' · ')}</Text> : data.languages.trim().split('\n').length <= 12 ? data.languages.trim().split('\n').map((line,i)=><Text key={i} style={[s.language,tech||engineering?{paddingVertical:4}:{}]}>{line}</Text>) : <Text orphans={3} widows={3}>{data.languages.trim()}</Text>}</Section>}</>;
  const portrait = data.photo && <Image src={data.photo} style={[s.portrait,classic || creative || first || service ? {borderRadius:45,border:`3 solid ${classic ? '#8AD8CC' : '#FFFFFF'}`,width:90,height:90} : health ? {width:82,height:94,borderRadius:8,border:'2 solid #C5DECE',padding:3} : tech ? {width:65,height:65,borderRadius:6} : engineering ? {width:65,height:72,borderRadius:0} : executive ? {borderRadius:0,border:'2 solid #CDB68F',padding:3} : minimal ? {width:61,height:61,borderRadius:31} : {}]} />;
  return <Document title={`CV - ${data.name.trim()}`} author={data.name.trim()} language={data.cvLanguage==='en'?'en':'pt-MZ'}><Page size="A4" style={[s.page,{color:t.ink},minimal?{fontSize:8.7,lineHeight:1.48}:{}]} wrap>
    <View style={[s.header,classic || creative || first ? {backgroundColor:classic ? '#183B55' : t.pale,marginTop:-34,marginHorizontal:-34,padding:28,paddingHorizontal:34} : executive ? {borderTop:'4 solid #967238',paddingTop:20} : modern ? {borderBottom:'3 solid #087F82'} : tech ? {backgroundColor:'#182E3E',marginTop:-34,marginHorizontal:-34,padding:28,paddingHorizontal:34,borderBottom:'4 solid #62C7D2'} : health ? {backgroundColor:t.pale,marginTop:-34,marginHorizontal:-34,padding:26,paddingHorizontal:34} : engineering ? {borderTop:'5 solid #CF9C46',borderBottom:'1 solid #2556A0',paddingTop:18} : service ? {borderBottom:'2 solid #C6A56C',paddingBottom:20} : {borderBottom:'1 solid #394550'}]}>
      <View style={[s.identity,service?{flexDirection:'column',alignItems:'center'}:{}]}>{portraitFirst && portrait && <View style={service?{marginBottom:12}:{marginRight:18}}>{portrait}</View>}<View style={service?{width:'100%',textAlign:'center'}:{flex:1}}><Text style={[s.name,{color:classic||tech?'#FFFFFF':creative?t.accent:t.ink},minimal || executive || service ? {fontFamily:'Source Serif',fontSize:service?32:34} : engineering||tech ? {fontSize:28} : {}]}>{data.name.trim()}</Text>{data.role.trim() && <Text style={[s.role,{color:classic?'#8AD8CC':tech?'#81DAE1':t.accent},executive||engineering?{textTransform:'uppercase',fontSize:9,letterSpacing:1.6}:{}]}>{data.role.trim()}</Text>}{inlineProfile && <Text style={[s.summary,{color:'#E0EDF0',fontSize:8.5}]}>{data.profile.trim()}</Text>}</View>{!portraitFirst && portrait && <View style={{marginLeft:20}}>{portrait}</View>}</View>
    </View>
    {contacts(data).length > 0 && <View style={[s.contactBar,classic?{backgroundColor:'#102B3D',marginHorizontal:-34,paddingHorizontal:34}:creative?{backgroundColor:'#FFFFFF',borderBottom:'2 solid #BB5343'}:executive||health?{backgroundColor:t.pale}:tech?{backgroundColor:'#EAF3F6'}:service?{backgroundColor:'#FBF7F2'}:minimal?{backgroundColor:'#FFFFFF',paddingHorizontal:0}:{}]}>{contacts(data).map(item=><View key={item.key} style={s.contact}><Icon kind={item.kind} color={classic?'#8AD8CC':t.accent} size={10}/><Text style={[s.contactText,{color:classic?'#E0EDF0':t.ink}]}>{item.text}</Text></View>)}</View>}
    {!inlineProfile && data.profile.trim() && <Section title={labels.profile} kind="profile"><Text orphans={3} widows={3}>{data.profile.trim()}</Text></Section>}
    {split ? <View style={{flexDirection:service?'row-reverse':'row'}}><View style={{width:'63%'}}>{educationFirst?<>{study}{work}</>:<>{work}{!studySide&&study}</>}</View><View style={{width:'33%',...(service?{marginRight:'4%'}:{marginLeft:'4%'}),...(classic || creative || first || health || service ? {backgroundColor:t.pale,paddingHorizontal:12,paddingTop:14,paddingBottom:15,marginTop:5,borderRadius:first?8:0}: {})}}>{support}</View></View> : <>{educationFirst?<>{study}{work}</>:<>{work}{study}</>}{support}</>}
  </Page></Document>;
}
export async function createPDFBlob(data: CVData): Promise<Blob> { prepareFonts(); return pdf(<CVDocument data={data} />).toBlob(); }
