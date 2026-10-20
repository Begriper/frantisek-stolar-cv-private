import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { args, filename } from './model.mjs';
import { build, output, readManifest, updateWeb, hashData } from './build.mjs';
import { browser } from './browser.mjs';
import { serve } from './serve.mjs';
const options = args();
const {data,doc,documentUrl} = await build(options);
const instance = await browser();
let server;
try {
  const page = await instance.newPage({ reducedMotion:'reduce' });
  if(doc.id==='general') server=await serve(fileURLToPath(output),0);
  await page.goto(server?'http://127.0.0.1:'+server.address().port+'/'+options.lang+'/':documentUrl.href);
  if(server) await page.locator('.avatar__img').evaluate(img=>img.decode());
  await page.evaluate(()=>document.fonts.ready);
  await page.emulateMedia({media:'print'});
  await page.evaluate(async()=>{
    for(const weight of [400,500,600,700]) await document.fonts.load(`${weight} 16px Inter`);
    await document.fonts.ready;
  });
  const measurements = await page.locator('.sheet').evaluateAll(sheets => sheets.map(sheet => {
    const box = sheet.getBoundingClientRect();
    return { height:box.height, maxHeight:(297-26)*96/25.4 };
  }));
  if(measurements.some(sheet => sheet.height>sheet.maxHeight+1))
    throw new Error('Document overflows the two-page A4 layout: '+JSON.stringify(measurements));
  const name=filename(options.lang,doc.id);
  await page.pdf({path:fileURLToPath(new URL('downloads/'+name,output)),format:'A4',
    preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false,tagged:true});
  const manifest=await readManifest();
  manifest.documents=manifest.documents.filter(item=>!(item.lang===options.lang && item.id===doc.id));
  manifest.documents.push({id:doc.id,label:doc.label,lang:options.lang,filename:name,
    dataHash:hashData(data),draft:!options.release});
  await writeFile(new URL('manifest.json',output),JSON.stringify(manifest,null,2)+'\n');
  await updateWeb(data,options.lang,!options.release);
  console.log('PDF: '+fileURLToPath(new URL('downloads/'+name,output)));
  console.log(server?'Exported the website using native print CSS.':'Printable heights (px): '+JSON.stringify(measurements));
} finally {
  await instance.close();
  if(server) await new Promise(resolve=>server.close(resolve));
}
