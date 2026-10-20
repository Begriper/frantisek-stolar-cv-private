import { readFile } from 'node:fs/promises';
export const languages = ['sk', 'cs', 'pl', 'de', 'en'];
export const variants = ['general', 'production', 'support', 'logistics'];
export const root = new URL('../', import.meta.url);
export async function readData() {
  const data = JSON.parse(await readFile(new URL('data/cv.json', root), 'utf8'));
  validateData(data);
  return data;
}
export function validateData(data) {
  const seen = new Set();
  for (const job of data.jobs) {
    if (seen.has(job.id)) throw new Error('Duplicate job: ' + job.id);
    seen.add(job.id);
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(job.start) ||
        !/^\d{4}-(0[1-9]|1[0-2])$/.test(job.end) || job.start > job.end)
      throw new Error('Invalid employment dates: ' + job.id);
    if (!job.employer?.trim()) throw new Error('Missing employer: ' + job.id);
  }
  const groupIds=new Set(data.generalGroups.map(group=>group.id));
  const referenced=[];
  if(new Set(data.generalOrder).size!==data.generalOrder.length) throw new Error('Duplicate display order');
  for(const id of data.generalOrder) {
    const group=data.generalGroups.find(item=>item.id===id);
    if(group) {
      if(!group.entries.length) throw new Error('Empty employment group');
      let previous='9999-12';
      for(const entry of group.entries) {
        if(!entry.jobIds.length) throw new Error('Empty employment group entry');
        let periodPrevious='9999-12';
        for(const jobId of entry.jobIds) {
          const fact=data.jobs.find(job=>job.id===jobId);
          if(!fact || referenced.includes(jobId)) throw new Error('Invalid employment group: '+jobId);
          if(fact.end>periodPrevious) throw new Error('Employment group dates out of order');
          periodPrevious=fact.end;referenced.push(jobId);
        }
        const latest=data.jobs.find(job=>job.id===entry.jobIds[0]).end;
        if(latest>previous) throw new Error('Employment group entries out of order');
        previous=latest;
      }
    } else {
      if(!seen.has(id)||referenced.includes(id)) throw new Error('Invalid employment reference: '+id);
      referenced.push(id);
    }
  }
  if(referenced.length!==seen.size || groupIds.size!==data.generalGroups.length ||
     [...groupIds].some(id=>!data.generalOrder.includes(id))) throw new Error('Incomplete general CV');
  for(const locale of Object.values(data.locales)) {
    if(!locale.generalWeb) throw new Error('Missing localized general CV');
    for(const id of referenced) if(!locale.jobs[id]) throw new Error('Missing job translation: '+id);
    for(const group of data.generalGroups) {
      if(!locale.generalWeb.groupTitles[group.id]) throw new Error('Missing group title');
      for(const entry of group.entries)
        if(!locale.generalWeb.entryTexts[entry.id]?.description) throw new Error('Missing employment description');
    }
  }
  for (const doc of data.documents) {
    if (!variants.includes(doc.id) || doc.pages.length !== 2) throw new Error('Invalid document');
    const ids = doc.pages.flat();
    if (new Set(ids).size !== ids.length || ids.some(id => !seen.has(id)))
      throw new Error('Invalid document references: ' + doc.id);
    const selected = ids.map(id => data.jobs.find(job => job.id === id));
    if (selected.some((job, i) => i && job.end > selected[i - 1].end))
      throw new Error('Document must retain reverse chronology: ' + doc.id);
  }
}
export function validateTarget(data, lang, variant, release = false) {
  if (!languages.includes(lang) || !variants.includes(variant)) throw new Error('Unknown language/variant');
  const review = data.review;
  if ((variant !== 'general' || (lang !== 'sk' && !review.translationDraftsRequested)) &&
      (!review.slovakContentApproved || !review.slovakLayoutApproved))
    throw new Error('First approve Slovak general content and layout before generating translations/variants.');
  const locale = data.locales[lang];
  const doc = data.documents.find(item => item.id === variant);
  if (variant !== 'general' && (!locale.labels || !locale.skills ||
      !locale.languages || !locale.education || !locale.courses))
    throw new Error('Complete and review localized document content for ' + lang);
  for (const id of doc.pages.flat())
    if (!locale.jobs[id]) throw new Error('Missing translation: ' + lang + '/' + id);
  if (release && (!review.slovakContentApproved || !review.slovakLayoutApproved ||
      !review.deltrianDatesConfirmed || !review.publishApproved ||
      (lang !== 'sk' && !review.translationsApproved.includes(lang))))
    throw new Error('Publication approval or factual confirmation missing.');
  return { locale, doc };
}
export function args(argv = process.argv.slice(2)) {
  const result = { lang: 'sk', variant: 'general', release: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--release') result.release = true;
    else if (argv[i] === '--lang') result.lang = argv[++i];
    else if (argv[i] === '--variant') result.variant = argv[++i];
    else throw new Error('Unknown argument: ' + argv[i]);
  }
  return result;
}
export const escape = value => String(value).replace(/[&<>"']/g,
  c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
export const date = value => value.slice(5) + '/' + value.slice(0,4);
export const filename = (lang, variant) => 'Frantisek_Stolar_CV_' + variant + '_' + lang.toUpperCase() + '.pdf';
