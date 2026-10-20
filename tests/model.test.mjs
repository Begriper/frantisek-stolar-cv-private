import test from 'node:test';
import assert from 'node:assert/strict';
import { readData, validateData, validateTarget } from '../scripts/model.mjs';
import { renderDocument, renderWeb } from '../scripts/render.mjs';
const data=await readData();
test('review stage allows requested translation drafts but blocks variants and release',()=>{
  assert.doesNotThrow(()=>validateTarget(data,'sk','general'));
  for(const lang of ['cs','pl','de','en']) assert.doesNotThrow(()=>validateTarget(data,lang,'general'));
  assert.throws(()=>validateTarget(data,'de','general',true),/approval/);
  assert.throws(()=>validateTarget(data,'sk','production'),/approve/);
  assert.throws(()=>validateTarget(data,'sk','general',true),/approval/);
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
test('website preserves the original design and uses native browser print without document buttons',()=>{
  const html=renderWeb(data,'sk',[{id:'general',label:'Všeobecný životopis'}]);
  assert.doesNotMatch(html,/class="actions"|class="variants"|href="\/downloads\/|window.print|<button/);
  for(const cls of ['hero__name','avatar__img','resume-card','resume-grid','exp-item','col-aside'])
    assert.ok(html.includes(cls));
  assert.match(html,/href="\/css\/print.css" media="print"/);
  assert.match(html,/href="\/cs\/"/);
  assert.equal((html.match(/data-job=/g)||[]).length,data.jobs.length);
  assert.doesNotMatch(html,/id="projects"/);
});

test('editorial HTML is escaped in generated text fields',()=>{
  const hostile=structuredClone(data); hostile.person.name='<script>alert(1)</script>';
  const html=renderDocument(hostile,'sk',hostile.documents[0]);
  assert.doesNotMatch(html,/<script>alert/);
  assert.match(html,/&lt;script&gt;/);
});


test('public output has no profile or editorial notices while approval gates remain active',()=>{
  assert.equal(data.review.deltrianDatesConfirmed,true);
  const clean=structuredClone(data);
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


test('compact general CV preserves every period and old job without rewriting source facts',()=>{
  const html=renderWeb(data,'sk');
  for(const fact of data.jobs) assert.equal(html.split('data-job="'+fact.id+'"').length-1,1);
  assert.equal(html.split('data-group="warehouse"').length-1,1);
  assert.equal((html.match(/class="employment-period"/g)||[]).length,13);
  assert.match(html,/Agentúrne pridelenia aj priamy pracovný pomer/);
  assert.match(html,/turistika v horách/);
  assert.doesNotMatch(html,/ProStore|React|Základná škola|súčasnosť|Veľmi dobrá adaptabilita/);
  assert.match(html,/07.07.2025 – 18.08.2025/);
  assert.match(html,/2019 – 2021/);
  assert.match(html,/2024 – 2025/);
  assert.equal(data.jobs.length,19);
  assert.ok(data.locales.sk.jobs['muller-2018'].bullets.length);
  assert.ok(data.locales.sk.legacySections.projects.includes('ProStore'));
});

test('employment groups reject duplicate and unknown period references',()=>{
  const duplicate=structuredClone(data);
  duplicate.generalGroups[0].entries[0].jobIds.push('muller-2021');
  assert.throws(()=>validateData(duplicate),/employment group/);
  const unknown=structuredClone(data);
  unknown.generalGroups[0].entries[0].jobIds.push('made-up');
  assert.throws(()=>validateData(unknown),/employment group/);
});


test('all five public versions share order, grouped employers and periods without stale content',()=>{
  for(const lang of ['sk','cs','pl','de','en']) {
    const html=renderWeb(data,lang);
    for(const fact of data.jobs) assert.equal(html.split('data-job="'+fact.id+'"').length-1,1,lang+'/'+fact.id);
    assert.equal((html.match(/data-group=/g)||[]).length,2);
    assert.equal((html.match(/data-entry=/g)||[]).length,10);
    assert.doesNotMatch(html,/2027|©|<footer|ProStore|id="projects"|availability|undefined/);
    let previous=-1;
    for(const id of data.generalOrder) {
      const index=html.indexOf((data.generalGroups.some(g=>g.id===id)?'data-group':'data-job')+'="'+id+'"');
      assert.ok(index>previous,lang+'/'+id+' order');previous=index;
    }
    assert.match(html,/Drogerie Dienst Müller/);
    assert.match(html,/07.07.2025 – 18.08.2025/);
  }
});
