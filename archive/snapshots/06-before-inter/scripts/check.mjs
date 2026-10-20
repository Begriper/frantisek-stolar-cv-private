import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { browser } from './browser.mjs';
import { serve } from './serve.mjs';
import { output } from './build.mjs';
import { readData, root, languages } from './model.mjs';
import { checkTypography } from './typography-check.mjs';
const data=await readData();
const review=new URL('.review/',root);
await mkdir(review,{recursive:true});
const server=await serve(fileURLToPath(output),0);
const base='http://127.0.0.1:'+server.address().port;
const instance=await browser();
const results=[],errors=[],typography=[];
try {
  const context=await instance.newContext({colorScheme:'dark'});
  await context.addInitScript(()=>localStorage.setItem('theme','dark'));
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(String(error)));
  page.on('console',message=>{
    if(message.type()==='error' && !message.location().url.endsWith('/favicon.ico')) errors.push(message.text());
  });
  for(const lang of languages) {
    const expected=data.jobs.filter(job=>data.locales[lang].jobs[job.id]);
    for(const viewport of [{width:1365,height:900},{width:390,height:844}]) {
      await page.emulateMedia({media:'screen'});
      await page.setViewportSize(viewport);
      const response=await page.goto(base+'/'+lang+'/');
      assert.equal(response.status(),200);
      await page.evaluate(()=>document.fonts.ready);
      await page.locator('.avatar__img').evaluate(img=>img.decode());
      assert.equal(await page.locator('html').getAttribute('lang'),lang);
      assert.equal(await page.locator('[data-job]').count(),expected.length);
      assert.equal(await page.locator('.actions,.variants,button,#theme-toggle,.review-note,.draft-stamp,.profile,.eyebrow,#summary,.footer,.availability').count(),0);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Overflow '+lang+'/'+viewport.width);
      assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).colorScheme),'light');
      assert.equal(await page.locator('.section__title').first().evaluate(el=>getComputedStyle(el).color),'rgb(37, 99, 235)');
      assert.equal(await page.locator('.exp-item').evaluateAll(els=>els.filter(el=>getComputedStyle(el).opacity==='0').length),0);
      typography.push({lang,viewport,...await checkTypography(page,'screen')});
      await page.screenshot({path:fileURLToPath(new URL('original-'+lang+'-'+viewport.width+'.png',review))});
      results.push({lang,viewport,jobs:expected.length,lightOnly:true,noOverflow:true});
    }
    // Print the real page before scrolling, using the same @media print as Ctrl+P.
    await page.setViewportSize({width:1365,height:900});
    await page.goto(base+'/'+lang+'/');
    await page.evaluate(()=>document.fonts.ready);
    await page.locator('.avatar__img').evaluate(img=>img.decode());
    await page.emulateMedia({media:'print'});
    typography.push({lang,...await checkTypography(page,'print')});
    assert.equal(await page.locator('.exp-item').evaluateAll(els=>els.filter(el=>getComputedStyle(el).opacity==='0').length),0);
    await page.pdf({path:fileURLToPath(new URL('browser-print-'+lang+'.pdf',review)),format:'A4',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false,tagged:true});
    {
      await page.emulateMedia({media:'screen'});
      await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));
      await page.emulateMedia({media:'print'});
      await page.pdf({path:fileURLToPath(new URL('browser-print-'+lang+'-after-scroll.pdf',review)),format:'A4',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false});
      await page.pdf({path:fileURLToPath(new URL('browser-print-'+lang+'-no-background.pdf',review)),format:'A4',preferCSSPageSize:true,printBackground:false,displayHeaderFooter:false});
    }
  }
  const nojsContext=await instance.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const nojs=await nojsContext.newPage();
  for(const lang of languages) {
  await nojs.goto(base+'/'+lang+'/');
  await nojs.evaluate(()=>document.fonts.ready);
  await nojs.locator('.avatar__img').evaluate(img=>img.decode());
  assert.equal(await nojs.locator('[data-job]').count(),data.jobs.length);
  await nojs.pdf({path:fileURLToPath(new URL('browser-print-'+lang+'-mobile-nojs.pdf',review)),format:'A4',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false});
  }
  await nojsContext.close();
  assert.deepEqual(errors,[]);
  await writeFile(new URL('typography-check.json',review),JSON.stringify(typography,null,2));
  const report={results,runtimeErrors:errors,browserPrint:true,beforeScroll:true,noJavaScript:true,typographyVerified:true};
  await writeFile(new URL('ui-check.json',review),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
} finally {
  await instance.close();
  await new Promise(resolve=>server.close(resolve));
}
