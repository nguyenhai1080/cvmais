import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { CVDocument, prepareFonts } from '../src/components/pdf-document';
import { templates, templateSample } from '../src/lib/templates';
await mkdir('work/template-pdfs', { recursive: true });
prepareFonts(path.resolve('public/fonts').replaceAll('\\', '/'));
for (const template of templates) {
  await writeFile(`work/template-pdfs/${template.id}.pdf`, await renderToBuffer(<CVDocument data={templateSample(template.id)} />));
  process.stdout.write(`${template.name}: PDF rendered\n`);
}
