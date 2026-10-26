import test from 'node:test';
import assert from 'node:assert/strict';
import {letterIndustries,industryLetter} from '../src/lib/industry-letters.ts';
import {templateAreas} from '../src/lib/templates.ts';
import {guides} from '../src/lib/guides.ts';
import {letterGuide,letterGuideEnglish,letterTranslationPairs} from '../src/lib/letter-guide.ts';
test('every professional field offers PT/EN letters for first-job and experienced candidates with honest placeholders',()=>{
 assert.deepEqual(new Set(letterIndustries.map(item=>item.id)),new Set(templateAreas.map(item=>item.id)));
 for(const industry of letterIndustries){assert.equal(industry.tipsPT.length,3);assert.equal(industry.tipsEN.length,3);
  for(const lang of ['pt','en']){const first=industryLetter(industry.id,'first',lang),experienced=industryLetter(industry.id,'experienced',lang);assert.notEqual(first,experienced);assert.ok(first.includes(lang==='pt'?'curso, projecto ou voluntariado real':'a real course, project or volunteering activity'));assert.ok(experienced.includes(lang==='pt'?'organização ou contexto real':'actual organisation or context'));for(const letter of [first,experienced]){assert.ok(letter.length<10000);assert.match(letter,/\[[^\]]+\]/);assert.ok(letter.includes(lang==='pt'?industry.focusPT:industry.focusEN));assert.ok(!/\d+%/.test(letter));}}
 }
});
test('new guide is reachable, translated and linked to a valid template without removing previous guidance',()=>{
 assert.equal(guides.length,6);assert.equal(guides.filter(g=>g.slug===letterGuide.slug).length,1);assert.equal(new Set(guides.map(g=>g.slug)).size,6);assert.equal(letterGuide.model,'atlas');assert.equal(letterGuide.sections.length,letterGuideEnglish.sections.length);assert.ok(letterTranslationPairs.every(([pt,en])=>pt&&en));assert.ok(letterGuide.sections.some(s=>s.text.includes('temporário')));
});
