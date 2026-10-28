import React from 'react';
import {Document,Page,Text,View,Image,StyleSheet} from '@react-pdf/renderer';
import {hasEntryContent,type CVData} from '../lib/cv';
import {sectorDesign,sectorCompact,type SectorBlock,type SectorNode} from '../lib/sector-designs';
import {labelsForCV} from '../lib/cv-language';
import {contacts} from '../lib/resume-design';
const s=StyleSheet.create({
 page:{fontFamily:'Noto Sans',fontSize:9,lineHeight:1.45,padding:36,paddingBottom:42},
 header:{marginBottom:9},row:{flexDirection:'row',alignItems:'center',gap:20},identity:{flexGrow:1,flexShrink:1},name:{fontSize:31,fontWeight:700,lineHeight:1.12},role:{fontSize:10,marginTop:8},
 portrait:{width:72,height:90,objectFit:'cover'},contact:{marginTop:13,flexDirection:'row',flexWrap:'wrap'},contactItem:{width:'50%',fontSize:7.5,paddingRight:12,marginBottom:5},
 section:{marginTop:15},label:{fontSize:8,fontWeight:700,textTransform:'uppercase',marginBottom:8},text:{fontSize:9,lineHeight:1.5},entry:{marginBottom:13},entryTitle:{fontSize:10,fontWeight:700,lineHeight:1.35},org:{fontSize:8.3,marginTop:3,marginBottom:5},date:{fontSize:7.4,marginBottom:6},
 grid:{flexDirection:'row',gap:20},footer:{position:'absolute',bottom:21,right:36,fontSize:6.5,color:'#67736F'},
 ledger:{borderTop:'3 solid #30445B',borderBottom:'1 solid #30445B',paddingVertical:15},
 terminal:{backgroundColor:'#203640',padding:22,marginHorizontal:-36,marginTop:-36,paddingHorizontal:36,paddingTop:29},
 clinical:{flexDirection:'row',gap:22,alignItems:'center',backgroundColor:'#EFF6F1',padding:20,borderRadius:12},
 academic:{alignItems:'center',textAlign:'center',borderBottom:'2 solid #62527D',paddingBottom:18},
 blueprint:{borderLeft:'7 solid #35516E',borderTop:'1 solid #35516E',paddingLeft:20,paddingTop:17,paddingBottom:12},
 dispatch:{borderBottom:'3 solid #81612D',paddingBottom:12},
 spotlight:{backgroundColor:'#43352F',padding:25,marginTop:-36,marginHorizontal:-36,paddingHorizontal:36},
 concierge:{flexDirection:'row',gap:24,alignItems:'center',borderBottom:'1 solid #7B5964',paddingBottom:20},
 magazine:{borderTop:'6 solid #B34F3D',paddingTop:12,paddingBottom:15,borderBottom:'1 solid #B34F3D'},
 field:{flexDirection:'row',gap:0,backgroundColor:'#F0F4E8',alignItems:'stretch',marginBottom:10},
 community:{marginTop:-36,marginHorizontal:-36,backgroundColor:'#EAF5F4'},
 index:{border:'1 solid #2C6075',padding:20},
});
export default function SectorDocument({data}:{data:CVData}){
 const d=sectorDesign(data.model)!;const l=labelsForCV(data);const compact=sectorCompact(data);
 const dark=d.header==='terminal'||d.header==='spotlight';const contactItems=contacts(data);
 const labels:Record<SectorBlock,string>={profile:l.profile,work:l.work,study:l.study,skills:l.skills,languages:l.languages,contact:data.cvLanguage==='en'?'Contact':'Contacto'};
 const identity=<View style={s.identity}><Text style={[s.name,{color:dark?'#FFFFFF':d.ink},d.serif?{fontFamily:'Source Serif',fontWeight:400,fontSize:d.header==='magazine'?41:34}:{}]}>{data.name.trim()}</Text>{data.role.trim()&&<Text style={[s.role,{color:dark?'#D3E5E5':d.accent}]}>{data.role.trim()}</Text>}</View>;
 const portrait=data.photo&&<Image src={data.photo} style={[s.portrait,d.header==='clinical'?{width:86,height:116,borderRadius:7}:d.header==='academic'?{width:68,height:68,borderRadius:34,marginBottom:12}:d.header==='dispatch'?{width:65,height:65,borderRadius:33}:d.header==='concierge'?{width:88,height:126}:d.header==='field'?{width:106,height:145}:d.header==='community'?{width:108,height:132}:{}]}/>;
 function Contact(){return contactItems.length?<View style={s.contact}>{contactItems.map(item=><Text key={item.key} style={[s.contactItem,{color:dark?'#DFE9E8':d.ink}]}>{item.text}</Text>)}</View>:null;}
 let header;
 switch(d.header){
  case 'ledger':header=<><View style={s.row}>{identity}{portrait}</View><Contact/></>;break;
  case 'terminal':header=<><Text style={{color:'#9FCED2',fontSize:6.5,marginBottom:14,letterSpacing:1.5}}>CURRICULUM VITAE</Text><View style={s.row}>{identity}{portrait}</View></>;break;
  case 'clinical':header=<>{portrait}<View style={{flex:1}}>{identity}<Contact/></View></>;break;
  case 'academic':header=<>{portrait}{identity}</>;break;
  case 'blueprint':header=<View style={s.row}>{identity}{portrait}</View>;break;
  case 'dispatch':header=<><View style={s.row}>{portrait}{identity}</View><View style={{backgroundColor:d.pale,paddingHorizontal:12,paddingBottom:5}}><Contact/></View></>;break;
  case 'spotlight':header=<><View style={s.row}>{identity}{portrait}</View><Contact/></>;break;
  case 'concierge':header=<>{portrait}<View style={{flex:1}}>{identity}<Contact/></View></>;break;
  case 'magazine':header=<><Text style={{fontSize:6.5,letterSpacing:2,marginBottom:11,color:d.accent}}>CURRICULUM VITAE</Text><View style={s.row}>{identity}{portrait}</View></>;break;
  case 'field':header=<>{portrait}<View style={{padding:19,flex:1}}>{identity}<Contact/></View></>;break;
  case 'community':header=<><View style={{flexDirection:'row',alignItems:'center'}}>{portrait}<View style={{flex:1,padding:22}}>{identity}</View></View><View style={{paddingHorizontal:36,paddingBottom:8}}><Contact/></View></>;break;
  case 'index':header=<><View style={s.row}>{identity}{portrait}</View><Contact/></>;break;
 }
 function present(kind:SectorBlock){return kind==='work'?data.experiences.some(hasEntryContent):kind==='study'?data.education.some(hasEntryContent):kind==='contact'?contactItems.length>0:!!data[kind].trim();}
 function block(kind:SectorBlock){
  if(!present(kind))return null;
  const entries=kind==='work'?data.experiences:kind==='study'?data.education:null;
  const value=kind==='contact'?contactItems.map(item=>item.text).join('\n'):kind==='profile'?data.profile:kind==='skills'?data.skills:kind==='languages'?data.languages:'';
  const margin=d.label==='margin';const narrowDate=d.id==='impulso'&&kind==='study'&&compact;
  const labelStyle=d.label==='soft'?{backgroundColor:d.pale,padding:7,borderRadius:4}:d.label==='academic'?{fontFamily:'Source Serif',fontSize:14,textTransform:'none' as const,borderBottom:`0.6 solid ${d.accent}`,paddingBottom:6}:d.label==='editorial'?{fontFamily:'Source Serif',fontSize:17,textTransform:'none' as const}:d.label==='pill'?{borderLeft:`3 solid ${d.accent}`,paddingLeft:9}:d.label==='field'?{backgroundColor:d.pale,padding:6,borderLeft:`3 solid ${d.accent}`}:d.label==='index'?{borderBottom:`2 solid ${d.accent}`,paddingBottom:6}:d.label==='project'?{borderTop:`1 solid ${d.accent}`,paddingTop:8}:d.label==='hospitality'?{fontFamily:'Source Serif',fontSize:13,textTransform:'none' as const,letterSpacing:0.3}:d.label==='code'?{borderBottom:`1 solid ${d.accent}`,paddingBottom:5,letterSpacing:1}:d.label==='ledger'?{borderBottom:'1 solid #C9D1DA',paddingBottom:6}:{};
  return <View key={kind} style={[s.section,margin?{flexDirection:'row',gap:16}:{}]}><View minPresenceAhead={42} style={margin?{width:86,paddingRight:5,borderTop:`2 solid ${d.accent}`,paddingTop:6}:{}}><Text style={[s.label,{color:d.accent},labelStyle]}>{labels[kind]}</Text></View><View style={margin?{flex:1}:{}}>{entries?entries.filter(hasEntryContent).map(entry=><View key={entry.id} style={[s.entry,d.entry==='ledger'||d.entry==='timeline'?{flexDirection:'row',gap:14}:d.entry==='card'?{borderLeft:`2 solid ${d.accent}`,paddingLeft:12,paddingBottom:7}:{}]}>{(d.entry==='ledger'||d.entry==='timeline')&&<View style={[{width:69,paddingRight:7},d.entry==='timeline'?{borderRight:`1 solid ${d.accent}`}:{}]}><Text style={[s.date,{color:d.accent}]}>{entry.period.trim()}</Text></View>}<View style={d.entry==='ledger'||d.entry==='timeline'?{flex:1}:{}}><View minPresenceAhead={36}><View style={d.entry==='date-right'&&!narrowDate?{flexDirection:'row',gap:12}:{}}>{entry.title.trim()&&<Text style={[s.entryTitle,d.entry==='date-right'&&!narrowDate?{flex:1}:{}]}>{entry.title.trim()}</Text>}{d.entry==='date-right'&&entry.period.trim()&&<Text style={[s.date,narrowDate?{marginTop:4,color:d.accent}:{width:75,textAlign:'right',color:d.accent}]}>{entry.period.trim()}</Text>}</View>{entry.organisation.trim()&&<Text style={s.org}>{entry.organisation.trim()}</Text>}{!['ledger','timeline','date-right'].includes(d.entry)&&entry.period.trim()&&<Text style={[s.date,{color:d.accent}]}>{entry.period.trim()}</Text>}</View>{entry.description.trim()&&<Text style={s.text} orphans={2} widows={2}>{entry.description.trim()}</Text>}</View></View>):<Text style={s.text} orphans={2} widows={2}>{value.trim()}</Text>}</View></View>;
 }
 function nodes(items:readonly SectorNode[],width=523,prefix='body'):React.ReactNode{return items.map((node,i)=>{
  if(typeof node==='string')return block(node);
  const columns=node.columns.map((column,index)=>({column,index})).filter(({column})=>column.some(item=>typeof item!=='string'||present(item)));
  if(!compact||columns.length<2)return <View key={`${prefix}-${i}`}>{columns.map(({column,index})=><View key={index}>{nodes(column,width,`${prefix}-${i}-${index}`)}</View>)}</View>;
  const total=columns.reduce((sum,{index})=>sum+node.widths[index],0),available=width-20*(columns.length-1);
  return <View key={`${prefix}-${i}`} style={s.grid}>{columns.map(({column,index},order)=>{const columnWidth=available*node.widths[index]/total;const panel=node.tone==='panel'&&order===columns.length-1;return <View key={index} style={[{width:columnWidth},panel?{backgroundColor:d.pale,paddingHorizontal:12,paddingBottom:12}:node.tone==='rule'&&order>0?{borderLeft:`0.6 solid ${d.accent}`,paddingLeft:12}:{}]}>{nodes(column,columnWidth-(panel?24:node.tone==='rule'&&order>0?12:0),`${prefix}-${i}-${index}`)}</View>;})}</View>;
 });}
 return <Document title={`CV - ${data.name.trim()}`} author={data.name.trim()} language={data.cvLanguage==='en'?'en':'pt-MZ'}><Page size="A4" wrap style={[s.page,{color:d.ink}]}><View style={[s.header,s[d.header]]}>{header}</View>{nodes(d.body)}</Page></Document>;
}
