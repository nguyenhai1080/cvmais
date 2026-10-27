import test from 'node:test';
import assert from 'node:assert/strict';
import {analyticsSummary,dailySeries,maputoDay} from '../src/lib/analytics-report.ts';

const now=new Date('2026-10-27T11:00:00Z');
const rows=[
 {day:'2026-10-27',event:'page_view',page:'/',source:'google',count:10},
 {day:'2026-10-27',event:'page_view',page:'/modelos',source:'internal',count:3},
 {day:'2026-10-27',event:'cv_builder_started',page:'/criar-cv',source:'none',count:2},
 {day:'2026-10-27',event:'cv_pdf_exported',page:'/criar-cv',source:'none',count:1},
 {day:'2026-10-20',event:'page_view',page:'/modelos/para/motorista',source:'direct',count:5},
 {day:'2026-07-01',event:'page_view',page:'/',source:'other',count:500},
];
test('Maputo day and daily continuity',()=>{
 assert.equal(maputoDay(new Date('2026-10-26T22:30:00Z')),'2026-10-27');
 const list=dailySeries(rows,7,now);
 assert.equal(list.length,7);
 assert.equal(list.at(-1)?.views,13);
 assert.equal(list.at(-1)?.pdf,1);
 assert.equal(list[0].views,0);
});
test('correct windows, sources and page ranking without unique-user inference',()=>{
 const seven=analyticsSummary(rows,7,now);
 assert.equal(seven.totals.page_view,13);
 assert.equal(seven.totals.cv_builder_started,2);
 assert.equal(seven.totals.cv_pdf_exported,1);
 assert.deepEqual(seven.topPages.map(x=>x.page),['/','/modelos']);
 assert.equal(seven.sources.find(x=>x.source==='google')?.count,10);
 const thirty=analyticsSummary(rows,30,now);
 assert.equal(thirty.totals.page_view,18);
 assert.equal(thirty.topPages.length,3);
 assert.equal(thirty.sources.find(x=>x.source==='direct')?.count,5);
 assert.equal(analyticsSummary(rows,90,now).totals.page_view,18);
});
test('empty periods retain zero values, no divide by zero',()=>{
 const result=analyticsSummary([],90,now);
 assert.equal(result.daily.length,90);
 assert.equal(result.totals.page_view,0);
 assert.equal(result.totals.cv_pdf_exported,0);
 assert.deepEqual(result.topPages,[]);
});
