import test from 'node:test';
import assert from 'node:assert/strict';
import { readData, validateData, validateTarget } from '../scripts/model.mjs';
import { renderDocument, renderWeb } from '../scripts/render.mjs';
const data=await readData();
// Approval gates are tested on a copy reset to the unapproved review state.
const pending=structuredClone(data);
Object.assign(pending.review,{slovakContentApproved:false,slovakLayoutApproved:false,translationsApproved:[],publishApproved:false});
test('review stage allows requested translation drafts but blocks variants and release',()=>{
  assert.doesNotThrow(()=>validateTarget(pending,'sk','general'));
  for(const lang of ['cs','pl','de','en']) assert.doesNotThrow(()=>validateTarget(pending,lang,'general'));
  assert.throws(()=>validateTarget(pending,'de','general',true),/approval/);
  assert.throws(()=>validateTarget(pending,'sk','production'),/approve/);
  assert.throws(()=>validateTarget(pending,'sk','general',true),/approval/);
});

test('approved general CV can be released in all five languages',()=>{
  for(const lang of ['sk','cs','pl','de','en']) assert.doesNotThrow(()=>validateTarget(data,lang,'general',true));
});
test('duplicate employment and reversed dates fail before rendering',()=>{
  const duplicate=structuredClone(data); duplicate.jobs.push(duplicate.jobs[0]);
  assert.throws(()=>validateData(duplicate),/Duplicate/);
  const reversed=structuredClone(data); reversed.jobs[0].start='2027-01';
  assert.throws(()=>validateData(reversed),/dates/);
});
test('older jobs retain their separate dates and all included job IDs occur exactly once',()=>{
  const doc=data.documents[0],html=renderDocument(data,'sk',doc);
  for(const id of doc.pages.flat()) assert.equal(html.split('data-job="'+id+'"').length-1,1);
  assert.match(html,/02\/2021 – 03\/2024/);
  assert.match(html,/10\/2019 – 12\/2019/);
  assert.match(html,/05\/2018 – 12\/2018/);
  assert.doesNotMatch(html,/<img|<svg|<table|iframe/);
});
test('no invented German level, CNC experience or medical details enter the draft',()=>{
  const html=renderDocument(data,'sk',data.documents[0]);
  assert.doesNotMatch(html,/\bB1\b|CNC|operáci|PN-ke|práceneschop|členk/);
  assert.match(html,/Laserové označovanie dielov logom/);
});
test('all five languages use the clean light-only template without scripts, buttons or theme switching',()=>{
  for(const lang of ['sk','cs','pl','de','en']) {
    const html=renderWeb(data,lang);
    assert.match(html,/href="\/css\/cv\.css"/);
    assert.match(html,/<meta name="color-scheme" content="light">/);
    assert.doesNotMatch(html,/<script|<button|theme|dark|🌙|resume-card|href="\/downloads\/|window.print/);
    assert.match(html,new RegExp('aria-current="page">'+(lang==='cs'?'CZ':lang.toUpperCase())+'<'));
    assert.equal((html.match(/<h1/g)||[]).length,1,lang);
    assert.ok(html.includes('<html lang="'+lang+'">'),lang);
  }
});

test('editorial HTML is escaped in generated text fields',()=>{
  const hostile=structuredClone(data); hostile.person.name='<script>alert(1)</script>';
  const html=renderDocument(hostile,'sk',hostile.documents[0]);
  assert.doesNotMatch(html,/<script>alert/);
  assert.match(html,/&lt;script&gt;/);
});


test('public output has no profile or editorial notices while approval gates remain active',()=>{
  assert.equal(data.review.deltrianDatesConfirmed,true);
  const clean=structuredClone(pending);
  delete clean.locales.sk.profiles;
  assert.doesNotThrow(()=>validateTarget(clean,'sk','general'));
  for(const doc of clean.documents) {
    const html=renderDocument(clean,'sk',doc);
    assert.doesNotMatch(html,/Pracovný profil|Návrh na kontrolu|schválen|draft-stamp|review-note|undefined/);
    assert.doesNotMatch(html,/2027|availability/);
  }
  const html=renderWeb(clean,'sk');
  assert.doesNotMatch(html,/Pracovný profil|Návrh na kontrolu|schválen|eyebrow|class="profile"|undefined/);
  assert.match(html,/name="robots" content="noindex"/);
  assert.throws(()=>validateTarget(clean,'sk','general',true),/approval/);
});


test('Slovak CV uses field sections and one-line short jobs without profile or projects',()=>{
  const html=renderWeb(data,'sk'),web=data.locales.sk.generalWeb;
  for(const fact of data.jobs) assert.equal(html.split('data-job="'+fact.id+'"').length-1,web.hiddenJobs.includes(fact.id)?0:1,fact.id);
  let previous=-1;
  for(const section of web.experienceSections) {
    const index=html.indexOf('data-section="'+section.id+'"');
    assert.ok(index>previous,section.id+' order');previous=index;
  }
  assert.equal((html.match(/class="short-job"/g)||[]).length,3);
  assert.doesNotMatch(html,/Tatranská mliekareň|03\/2020 – 03\/2020|10\/2015 – 10\/2015/);
  assert.match(html,/10\/2025 – 10\/2026/);
  assert.match(html,/class="headline"/);
  assert.doesNotMatch(html,/id="about"|ProStore/);
  assert.match(html,/analýza nákladov na auto/);
  assert.match(html,/07.07.2025 – 18.08.2025/);
  assert.match(html,/Nemčina<\/span><span>základy/);
  assert.match(html,/s maturitou/);
  assert.match(html,/frantisek-stolar\.cv<\/a>/);
  assert.match(html,/<\/svg><a href="https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=Lendak%2C\+Slovakia">Lendak, Slovensko<\/a><\/li>/);
  assert.match(html,/class="socials">[\s\S]*href="https:\/\/github\.com\/Begriper"/);
  assert.match(html,/class="socials">[\s\S]*href="https:\/\/linkedin\.com\/in\/frantisek-stolar"/);
  assert.doesNotMatch(html,/Nemčina – A1|Základná škola|súčasnosť|Veľmi dobrá adaptabilita|operáci|členk|maród/);
  assert.equal(data.jobs.length,19);
  assert.ok(data.locales.sk.legacySections.projects.includes('ProStore'));
});

test('experience sections reject missing or duplicated items',()=>{
  const missing=structuredClone(data);
  missing.locales.sk.generalWeb.hiddenJobs=[];
  assert.throws(()=>validateData(missing),/experience sections/);
  const duplicate=structuredClone(data);
  duplicate.locales.sk.generalWeb.experienceSections[0].items.push('warehouse');
  assert.throws(()=>validateData(duplicate),/experience sections/);
});

test('employment groups reject duplicate and unknown period references',()=>{
  const duplicate=structuredClone(data);
  duplicate.generalGroups[0].entries[0].jobIds.push('muller-2021');
  assert.throws(()=>validateData(duplicate),/employment group/);
  const unknown=structuredClone(data);
  unknown.generalGroups[0].entries[0].jobIds.push('made-up');
  assert.throws(()=>validateData(unknown),/employment group/);
});


test('all five languages share sections, grouped employers and periods without stale content',()=>{
  for(const lang of ['sk','cs','pl','de','en']) {
    const html=renderWeb(data,lang),web=data.locales[lang].generalWeb;
    for(const fact of data.jobs) assert.equal(html.split('data-job="'+fact.id+'"').length-1,web.hiddenJobs.includes(fact.id)?0:1,lang+'/'+fact.id);
    assert.equal((html.match(/data-group=/g)||[]).length,2);
    assert.equal((html.match(/data-entry=/g)||[]).length,10);
    assert.equal((html.match(/class="short-job"/g)||[]).length,3);
    assert.doesNotMatch(html,/2027|©|<footer|ProStore|id="projects"|availability|undefined|<\/svg>Poprad|– A1/);
    let previous=-1;
    for(const section of web.experienceSections) {
      const index=html.indexOf('data-section="'+section.id+'"');
      assert.ok(index>previous,lang+'/'+section.id+' order');previous=index;
    }
    assert.match(html,/Drogerie Dienst Müller/);
    assert.match(html,/10\/2025 – 10\/2026/);
    assert.match(html,/07.07.2025 – 18.08.2025/);
    assert.equal(web.sidebar.find(section=>section.id==='languages').items.length,5,lang+' languages');
  }
});

test('mobile layout rules are limited to screens so they never leak into print or PDF',async()=>{
  const { readFile } = await import('node:fs/promises');
  const css=await readFile(new URL('../css/cv.css',import.meta.url),'utf8');
  for(const query of css.match(/@media[^{]*\{/g)) assert.ok(/print|screen/.test(query),query);
});
