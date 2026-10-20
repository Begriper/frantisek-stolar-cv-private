import { mkdir, copyFile, cp, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { readData, validateTarget, args, root, languages } from './model.mjs';
import { renderDocument, renderWeb } from './render.mjs';
export const output = new URL('dist/',root);
export const hashData = data => createHash('sha256').update(JSON.stringify(data)).digest('hex');
export async function readManifest() {
  try { return JSON.parse(await readFile(new URL('manifest.json',output),'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return { documents: [] }; throw error; }
}
export async function updateWeb(data, lang, draft = true) {
  await mkdir(new URL(lang+'/',output),{recursive:true});
  await writeFile(new URL(lang+'/index.html',output),renderWeb(data,lang,[],draft));
}
export async function build(options = args()) {
  const data = await readData();
  if(options.release) {
    for(const language of languages) for(const document of data.documents)
      validateTarget(data,language,document.id,true);
  }
  const { doc } = validateTarget(data,options.lang,options.variant,options.release);
  for (const dir of ['css/','downloads/','documents/'+options.lang+'/']) await mkdir(new URL(dir,output),{recursive:true});
  for (const dir of ['css','js','img','fonts']) await cp(new URL(dir+'/',root),new URL(dir+'/',output),{recursive:true});
  await copyFile(new URL('index.html',root),new URL('index.html',output));
  await copyFile(new URL('CNAME',root),new URL('CNAME',output));
  await writeFile(new URL('robots.txt',output),options.release?'User-agent: *\nAllow: /\n':'User-agent: *\nDisallow: /\n');
  const documentUrl = new URL('documents/'+options.lang+'/'+doc.id+'.html',output);
  if(doc.id!=='general') await writeFile(documentUrl,renderDocument(data,options.lang,doc,!options.release));
  for (const lang of languages) await updateWeb(data,lang,!options.release);
  console.log('Built '+options.lang+'/'+doc.id+' ('+(options.release?'release':'review')+')');
  return { data,doc,documentUrl };
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) await build();
