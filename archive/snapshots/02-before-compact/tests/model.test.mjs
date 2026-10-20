import test from 'node:test';
import assert from 'node:assert/strict';
import { readData, validateData, validateTarget } from '../scripts/model.mjs';
import { renderDocument, renderWeb } from '../scripts/render.mjs';
const data=await readData();
test('review stage allows Slovak general draft but blocks premature variants, translations and release',()=>{
  assert.doesNotThrow(()=>validateTarget(data,'sk','general'));
  assert.throws(()=>validateTarget(data,'de','general'),/approve/);
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
  assert.match(html,/id="projects"/);
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
    assert.ok(html.indexOf('2027')>html.indexOf(clean.locales.sk.labels.additional));
  }
  const html=renderWeb(clean,'sk');
  assert.doesNotMatch(html,/Pracovný profil|Návrh na kontrolu|schválen|eyebrow|class="profile"|undefined/);
  assert.match(html,/name="robots" content="noindex"/);
  assert.throws(()=>validateTarget(clean,'sk','general',true),/approval/);
});
