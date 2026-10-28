import React from 'react';
import {Document,Page,Text,View,Image,StyleSheet} from '@react-pdf/renderer';
import {hasEntryContent,type CVData} from '../lib/cv';
import {compositionDesign,compositionCompact,compositionPresent,type CompositionNode,type CompositionBlock} from '../lib/milestone-designs';
import {labelsForCV} from '../lib/cv-language';
import {contacts} from '../lib/resume-design';
const s=StyleSheet.create({page:{fontFamily:'Noto Sans',fontSize:9,lineHeight:1.5,padding:36,paddingBottom:42},identity:{marginBottom:13},name:{fontSize:30,fontWeight:700,lineHeight:1.12},role:{fontSize:10,lineHeight:1.5,marginTop:8},portrait:{objectFit:'cover'},section:{marginTop:15},label:{fontSize:8,fontWeight:700,lineHeight:1.35,textTransform:'uppercase',paddingBottom:6,borderBottomWidth:.6,marginBottom:8},text:{fontSize:9,lineHeight:1.5},entry:{marginBottom:13},entryTitle:{fontSize:10,fontWeight:700,lineHeight:1.35},org:{fontSize:8.3,lineHeight:1.5,marginTop:3,marginBottom:5},date:{fontSize:7.5,lineHeight:1.5,marginBottom:6}});
export default function CompositionDocument({data}:{data:CVData}){
 const d=compositionDesign(data.model)!;const l=labelsForCV(data);const compact=compositionCompact(data);
 const labels={profile:l.profile,work:l.work,study:l.study,skills:l.skills,languages:l.languages,contact:data.cvLanguage==='en'?'Contact':'Contacto'};
 function block(kind:CompositionBlock,width:number,dark=false):React.ReactNode{
  if(!compositionPresent(kind,data))return null;const ink=dark?'#FFFFFF':d.ink,accent=dark?'#D5E7E8':d.accent;
  if(kind==='identity')return <View key={kind} style={[s.identity,d.nameStyle==='center'?{textAlign:'center'}:{},d.nameStyle==='display'?{borderBottom:`2 solid ${accent}`,paddingBottom:12}:{}]}><Text style={[s.name,{color:ink,fontSize:!compact?28:width<200?24:d.nameStyle==='display'?39:d.nameStyle==='serif'?33:30},['display','serif'].includes(d.nameStyle)?{fontFamily:'Source Serif',fontWeight:400}:{}]}>{data.name.trim()}</Text>{data.role.trim()&&<Text style={[s.role,{color:accent}]}>{data.role.trim()}</Text>}</View>;
  if(kind==='portrait'){const photoWidth=Math.min(width,!compact?60:d.photoShape==='wide'?180:d.photoShape==='round'?76:86),height=!compact?photoWidth:d.photoShape==='wide'?photoWidth*.6:d.photoShape==='tall'?photoWidth*4/3:photoWidth;return <View key={kind} style={{marginBottom:12}}><Image src={data.photo} style={[s.portrait,{width:photoWidth,height},d.photoShape==='round'?{borderRadius:photoWidth/2}:{}]}/></View>;}
  const entries=kind==='work'?data.experiences:kind==='study'?data.education:null;
  const value=kind==='contact'?contacts(data).map(c=>c.text).join('\n'):kind==='profile'?data.profile:kind==='skills'?data.skills:kind==='languages'?data.languages:'';
  const margin=d.heading==='margin'&&width>=330;const side=['ledger','timeline'].includes(d.entry)&&width>=240;
  const labelStyle=d.heading==='serif'?{fontFamily:'Source Serif',fontWeight:400 as const,fontSize:14,lineHeight:1.2,textTransform:'none' as const}:d.heading==='tab'?{borderBottomWidth:0,borderLeftWidth:3,padding:6,paddingLeft:8,backgroundColor:dark?'transparent':d.pale}:d.heading==='capsule'?{borderBottomWidth:0,padding:6,paddingLeft:8,borderRadius:4,backgroundColor:dark?'transparent':d.pale}:{};
  return <View key={kind} style={[s.section,!compact?{marginTop:11}:d.id==='narrativa'?{marginTop:10}:{},margin?{flexDirection:'row',gap:14}:{}]}><View minPresenceAhead={42} style={margin?{width:80}:{}}><Text style={[s.label,{color:accent,borderColor:accent},labelStyle,margin?{borderBottomWidth:0,borderTopWidth:2,paddingTop:6}:{}]}>{labels[kind]}</Text></View><View style={margin?{flex:1}:{}}>{entries?entries.filter(hasEntryContent).map(e=><View key={e.id} style={[s.entry,!compact?{marginBottom:9}:d.id==='narrativa'?{marginBottom:9}:{},side?{flexDirection:'row',gap:14}:d.entry==='boxed'?{border:`0.6 solid ${dark?'#A7C1C2':'#CBD7D4'}`,padding:9,borderRadius:4}:{}]}>{side&&<View style={[{width:69,paddingRight:7},d.entry==='timeline'?{borderRight:`1 solid ${accent}`} :{}]}><Text style={[s.date,{color:accent}]}>{e.period.trim()}</Text></View>}<View style={side?{flex:1}:{}}><View minPresenceAhead={36} style={d.entry==='ribbon'?{borderTop:`2 solid ${accent}`,paddingTop:7}:{}}>{e.title.trim()&&<Text style={[s.entryTitle,{color:ink}]}>{e.title.trim()}</Text>}{e.organisation.trim()&&<Text style={[s.org,{color:ink}]}>{e.organisation.trim()}</Text>}{!side&&e.period.trim()&&<Text style={[s.date,{color:accent}]}>{e.period.trim()}</Text>}</View>{e.description.trim()&&<Text style={[s.text,{color:ink}]} orphans={2} widows={2}>{e.description.trim()}</Text>}</View></View>):<Text style={[s.text,{color:ink}]} orphans={2} widows={2}>{value.trim()}</Text>}</View></View>;
 }
 function present(node:CompositionNode):boolean{return typeof node==='string'?compositionPresent(node,data):node.columns.some(c=>c.some(present));}
 function nodes(items:readonly CompositionNode[],width=523,prefix='page',dark=false):React.ReactNode{return items.map((node,i)=>{
  if(typeof node==='string')return block(node,width,dark);
  const columns=node.columns.map((column,index)=>({column,index})).filter(({column})=>column.some(present));if(!columns.length)return null;
  if(!compact)return <View key={`${prefix}-${i}`} style={{marginBottom:5}}>{columns.map(({column,index})=><View key={index}>{nodes(column,width,`${prefix}-${i}-${index}`,false)}</View>)}</View>;
  const tone=node.tone||'plain',total=columns.reduce((n,c)=>n+node.widths[c.index],0),available=width-18*(columns.length-1);
  return <View key={`${prefix}-${i}`} style={{flexDirection:'row',gap:18,marginBottom:10}}>{columns.map(({column,index},order)=>{
   const colWidth=available*node.widths[index]/total,pale=tone==='band'||tone==='panel'&&order===columns.length-1,childDark=tone==='accent'||tone==='rail'&&order===0,padded=pale||childDark||tone==='outline',rule=tone==='rule'&&order>0;
   return <View key={index} style={[{width:colWidth,alignSelf:'stretch'},padded?{padding:12}:rule?{paddingLeft:12}:{},pale?{backgroundColor:d.pale}:childDark?{backgroundColor:d.accent}:{},tone==='outline'?{border:`1 solid ${d.accent}`} :rule?{borderLeft:`0.6 solid ${d.accent}`} :{}]}>{nodes(column,colWidth-(padded?24:rule?12:0),`${prefix}-${i}-${index}`,childDark||dark)}</View>;
  })}</View>;
 });}
 return <Document title={`CV - ${data.name.trim()}`} author={data.name.trim()} language={data.cvLanguage==='en'?'en':'pt-MZ'}><Page size="A4" wrap style={[s.page,{color:d.ink}]}>{nodes(d.layout)}</Page></Document>;
}
