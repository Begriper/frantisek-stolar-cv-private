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
  if ((lang !== 'sk' || variant !== 'general') &&
      (!review.slovakContentApproved || !review.slovakLayoutApproved))
    throw new Error('First approve Slovak general content and layout before generating translations/variants.');
  const locale = data.locales[lang];
  const doc = data.documents.find(item => item.id === variant);
  if (!locale.labels || !locale.skills ||
      !locale.languages || !locale.education || !locale.courses || !locale.availability)
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
