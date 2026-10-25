import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { CVDocument, prepareFonts } from '../src/components/pdf-document';
import { templates, templateSample, templatePortrait } from '../src/lib/templates';
await mkdir('work/template-pdfs', { recursive: true });
prepareFonts(path.resolve('public/fonts').replaceAll('\\', '/'));
for (const template of templates.filter(t=>!process.env.QA_MODELS||process.env.QA_MODELS.split(',').includes(t.id))) {
  const photo = await readFile(`public/images/demo-portrait-${templatePortrait(template.id)}.jpg`);
  const sample = { ...templateSample(template.id), photo: `data:image/jpeg;base64,${photo.toString('base64')}` };
  await writeFile(`work/template-pdfs/${template.id}.pdf`, await renderToBuffer(<CVDocument data={sample} />));
  process.stdout.write(`${template.name}: PDF rendered\n`);
}
