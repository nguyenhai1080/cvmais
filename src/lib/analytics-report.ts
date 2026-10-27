export type MetricRow={day:string;event:string;page:string;source:string;count:number};
export type MetricWindow=7|30|90;
export const metricEvents=['page_view','cv_builder_started','cv_template_selected','cv_pdf_exported'] as const;
export const metricSources=['direct','internal','google','bing','duckduckgo','social','other'] as const;
const dayFormat=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Maputo',year:'numeric',month:'2-digit',day:'2-digit'});
export function maputoDay(date:Date){return dayFormat.format(date);}
export function dailySeries(rows:MetricRow[],days:MetricWindow,now=new Date()){
  const calendar=Array.from({length:days},(_,i)=> {
    const date=new Date(now.getTime()-(days-1-i)*86_400_000);
    return {day:maputoDay(date),views:0,pdf:0,builder:0};
  });
  const lookup=new Map(calendar.map((r,i)=>[r.day,i]));
  for(const row of rows){const i=lookup.get(row.day);if(i===undefined)continue;
    if(row.event==='page_view')calendar[i].views+=row.count;
    if(row.event==='cv_pdf_exported')calendar[i].pdf+=row.count;
    if(row.event==='cv_builder_started')calendar[i].builder+=row.count;
  }
  return calendar;
}
export function analyticsSummary(rows:MetricRow[],days:MetricWindow,now=new Date()){
 const first=dailySeries([],days,now)[0]?.day || '';
 const chosen=rows.filter(row=>row.day>=first);
 const totals=Object.fromEntries(metricEvents.map(event=>[event,chosen.filter(row=>row.event===event).reduce((n,row)=>n+row.count,0)])) as Record<(typeof metricEvents)[number],number>;
 const sources=metricSources.map(source=>({source,count:chosen.filter(row=>row.event==='page_view'&&row.source===source).reduce((n,row)=>n+row.count,0)}));
 const pages=new Map<string,number>();
 for(const row of chosen){if(row.event!=='page_view')continue;pages.set(row.page,(pages.get(row.page)||0)+row.count);}
 const topPages=[...pages].map(([page,count])=>({page,count})).sort((a,b)=>b.count-a.count||a.page.localeCompare(b.page));
 return {totals,sources,topPages,daily:dailySeries(chosen,days,now)};
}

// Axis labels are deliberately sparse so 30/90-day charts remain legible.
// The daily data and bars are never downsampled.
export function chartAxisTick(index:number,days:MetricWindow):boolean {
 if(!Number.isInteger(index)||index<0||index>=days)return false;
 const interval=days===7?1:days===30?5:15;
 return index===0||index===days-1||index%interval===0;
}
