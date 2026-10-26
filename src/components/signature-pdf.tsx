import React from 'react';
import {Document,Page,Text,View,Image,StyleSheet} from '@react-pdf/renderer';
import {labelsForCV} from '../lib/cv-language';
import {hasEntryContent,type CVData,type Entry} from '../lib/cv';
import {signatureDesign,compactSignature} from '../lib/signature-designs';
import {contacts} from '../lib/resume-design';

const s=StyleSheet.create({
 page:{fontFamily:'Noto Sans',fontSize:9,lineHeight:1.5,padding:36,paddingBottom:42,color:'#233D3E'},
 name:{fontSize:34,fontWeight:700,lineHeight:1.12},role:{fontSize:10,marginTop:8},
 section:{marginTop:16},label:{fontSize:8.5,fontWeight:700,letterSpacing:0,textTransform:'uppercase',marginBottom:8},
 entry:{marginBottom:12},title:{fontSize:10.4,fontWeight:700,lineHeight:1.35},org:{fontSize:8.6,marginTop:4},date:{fontSize:7.4,marginTop:4,marginBottom:7},
 small:{fontSize:7.7,lineHeight:1.7},portrait:{objectFit:'cover',width:82,height:100},rule:{height:1,backgroundColor:'#D7DFDA',marginTop:17,marginBottom:6},
 footer:{position:'absolute',bottom:23,right:36,fontSize:7,color:'#6C7F7C'},
});
function BodyText({value}:{value:string}){const lines=value.trim().split('\n').filter(Boolean);return lines.length>1&&lines.length<13?<>{lines.map((line,i)=><View key={i} style={{flexDirection:'row',marginBottom:4}}><Text style={{width:10}}>•</Text><Text style={{flex:1}} orphans={2} widows={2}>{line.replace(/^[•\-]\s*/,'')}</Text></View>)}</>:<Text orphans={3} widows={3}>{value.trim()}</Text>;}
export default function SignatureDocument({data}:{data:CVData}){
 const d=signatureDesign(data.model)!;const l=labelsForCV(data);const atlas=d.id==='atlas',aurora=d.id==='aurora',folio=d.id==='folio',tech=d.id==='vertice';
 const inlineLanguages=tech&&data.languages.trim().length<=180;
 const compact=compactSignature(data);const side=atlas&&compact&&[data.skills,data.languages,...contacts(data).map(c=>c.text)].join('\n').split('\n').reduce((n,line)=>n+Math.max(1,Math.ceil(line.length/23)),0)<29;
 const contactTitle=data.cvLanguage==='en'?'Contact':'Contacto';
 function Contact({dark=false}:{dark?:boolean}){return <View style={{marginTop:16,...(!side?{flexDirection:'row',flexWrap:'wrap'}:{})}}>{side&&<Text style={[s.label,{color:'#9CD0C1'}]}>{contactTitle}</Text>}{contacts(data).map(item=><Text key={item.key} style={[s.small,{color:dark?'#E9F3EF':d.ink,marginBottom:6},!side?{width:'50%',paddingRight:12}:{}]}>{item.text}</Text>)}{inlineLanguages&&data.languages.trim()&&<Text style={[s.small,{width:'100%',marginTop:4}]}>{l.languages}: {data.languages.trim().replaceAll('\n',' · ')}</Text>}</View>;}
 function SkillValue({value}:{value:string}){const items=value.trim().split(/[\n;]+/).filter(Boolean);return items.length<=12&&items.every(item=>item.length<60)?<View style={{flexDirection:'row',flexWrap:'wrap'}}>{items.map((item,i)=><Text key={i} style={{width:'50%',paddingRight:12,paddingBottom:7,fontSize:8.4}}>{item}</Text>)}</View>:<BodyText value={value}/>;}
 function Block({label,value,number,dark=false}:{label:string;value:string;number?:string;dark?:boolean}){return value.trim()?<View style={s.section}><Text style={[s.label,{color:dark?'#A3D7C5':d.accent},folio?{fontFamily:'Source Serif',textTransform:'none',fontSize:15,letterSpacing:0}:{}]} minPresenceAhead={36}>{number?`${number}  /  `:''}{label}</Text><View style={{color:dark?'#E9F3EF':d.ink}}>{folio&&label===l.skills?<SkillValue value={value}/>:<BodyText value={value}/>}</View></View>:null;}
 function EntryList({entries}:{entries:Entry[]}){return <>{entries.filter(hasEntryContent).map(e=><View style={s.entry} key={e.id}>{(folio||tech)?<View style={{flexDirection:'row'}}><View style={{width:78,paddingRight:12}}>{e.period.trim()&&<Text style={[s.date,{color:d.accent,marginTop:0}]}>{e.period.trim()}</Text>}</View><View style={{flex:1}}><View minPresenceAhead={36}>{e.title.trim()&&<Text style={s.title}>{e.title.trim()}</Text>}{e.organisation.trim()&&<Text style={[s.org,{marginBottom:8}]}>{e.organisation.trim()}</Text>}</View>{e.description.trim()&&<BodyText value={e.description}/>}</View></View>:<><View minPresenceAhead={36}>{e.title.trim()&&<Text style={s.title}>{e.title.trim()}</Text>}{e.organisation.trim()&&<Text style={s.org}>{e.organisation.trim()}</Text>}{e.period.trim()&&<Text style={[s.date,{color:d.accent}]}>{e.period.trim()}</Text>}</View>{e.description.trim()&&<BodyText value={e.description}/>}</>}</View>)}</>;}
 function Career({education=false,number}:{education?:boolean;number:string}){const entries=education?data.education:data.experiences;return entries.some(hasEntryContent)?<View style={s.section}><View style={folio?{borderTop:`1 solid ${d.accent}`,paddingTop:11}:tech?{borderBottom:'1 solid #CBD8D7',paddingBottom:7,marginBottom:12}:{}} minPresenceAhead={48}><Text style={[s.label,{color:d.accent},folio?{fontFamily:'Source Serif',fontSize:16,textTransform:'none',letterSpacing:0}:{}]}>{number}  /  {education?l.study:l.work}</Text></View><EntryList entries={entries}/></View>:null;}
 const portrait=data.photo&&<Image src={data.photo} style={[s.portrait,atlas?{width:112,height:132,borderRadius:5}:aurora?{width:80,height:80,borderRadius:40}:folio?{width:91,height:118}:tech?{width:62,height:70}:{}]}/>;
 const identity=<View><Text style={[s.name,{color:d.ink},folio?{fontFamily:'Source Serif',fontWeight:400,fontSize:46}:aurora?{fontSize:33,fontWeight:400}:{}]}>{data.name.trim()}</Text>{data.role.trim()&&<Text style={[s.role,{color:d.accent},folio?{letterSpacing:0,textTransform:'uppercase',fontSize:8.5}:{}]}>{data.role.trim()}</Text>}</View>;
 const skills=<Block label={l.skills} value={data.skills} dark={side}/>;const languages=!inlineLanguages&&<Block label={l.languages} value={data.languages} dark={side}/>;
 return <Document title={`CV - ${data.name.trim()}`} author={data.name.trim()} language={data.cvLanguage==='en'?'en':'pt-MZ'}><Page size="A4" wrap style={[s.page,{color:d.ink},side?{paddingLeft:220}:folio?{paddingTop:42}:{}]}>
 {side?<><View fixed style={{position:'absolute',left:0,top:0,bottom:0,width:185,backgroundColor:'#173E40'}}/><View style={{position:'absolute',left:29,top:38,width:128,fontSize:8.3,color:'#E9F3EF'}}>{portrait}<Contact dark/>{skills}{languages}</View><View style={{borderBottom:'3 solid #82AF9D',paddingBottom:19}}>{identity}</View></>:<>
 <View style={tech?{backgroundColor:'#23373E',marginTop:-36,marginHorizontal:-36,padding:30,paddingHorizontal:36}:aurora?{backgroundColor:d.pale,marginTop:-36,marginHorizontal:-36,padding:32,paddingHorizontal:36}:folio?{borderBottom:'2 solid #B94F36',paddingBottom:24}:{borderTop:`5 solid ${d.accent}`,paddingTop:18}}>
 <View style={{flexDirection:'row',alignItems:folio?'flex-start':'center',gap:22}}>{aurora&&portrait}<View style={{flex:1}}>{tech?<><Text style={[s.name,{color:'#FFFFFF',fontSize:30}]}>{data.name.trim()}</Text>{data.role.trim()&&<Text style={[s.role,{color:'#A7D6CD'}]}>{data.role.trim()}</Text>}</>:identity}</View>{!aurora&&portrait}</View></View>
 <View style={{borderBottom:'1 solid #D5DEDA',paddingBottom:6}}><Contact/></View></>}
 {tech&&data.skills.trim()&&<View style={{backgroundColor:d.pale,padding:14,marginTop:18}}><Text style={[s.label,{color:d.accent}]}>{l.skills}</Text><SkillValue value={data.skills}/></View>}
 <Block label={l.profile} value={data.profile} number={atlas?'01':undefined}/>
 {aurora&&compact?<View style={{flexDirection:'row',gap:30}}><View style={{width:'47%'}}><Career education number="01"/></View><View style={{width:'47%'}}><Career number="02"/></View></View>:<>{aurora?<><Career education number="01"/><Career number="02"/></>:<><Career number={atlas?'02':'01'}/><Career education number={atlas?'03':'02'}/></>}</>}
 {!side&&<View style={aurora&&compact?{flexDirection:'row',gap:30,borderTop:'2 solid #78917A',marginTop:10}:folio&&compact?{flexDirection:'row',gap:20,borderTop:'1 solid #B94F36'}:{}}>{!tech&&<View style={aurora&&compact?{width:'47%'}:folio&&compact?{width:'62%'}:{}}>{skills}</View>}<View style={aurora&&compact?{width:'47%'}:folio&&compact?{width:'33%'}:{}}>{languages}</View></View>}

 </Page></Document>;
}
