import { escape as e, date } from './model.mjs';
import { renderSite } from './site.mjs';
const list = items => '<ul>' + items.map(item => '<li>' + e(item) + '</li>').join('') + '</ul>';
function contact(person) {
  return '<p class="contact-line">' + e(person.city) + ' · <a href="tel:' + e(person.phone.replaceAll(' ','')) + '">' + e(person.phone) +
    '</a> · <a href="mailto:' + e(person.email) + '">' + e(person.email) + '</a></p>' +
    '<p class="contact-line"><a href="' + e(person.website) + '">' + e(person.website.replace('https://','')) + '</a></p>';
}
function job(data, locale, id, count = 0, web = false) {
  const fact = data.jobs.find(item => item.id === id);
  const text = locale.jobs[id];
  const bullets = web ? text.bullets : text.bullets.slice(0, count);
  return '<article class="job' + (!bullets.length ? ' compact' : '') + '" data-job="' + e(id) + '">' +
    '<h3>' + e(text.role) + '</h3><p class="job-meta"><strong>' + e(fact.employer) +
    '</strong><span> · ' + e(date(fact.start)) + ' – ' + e(date(fact.end)) + '</span></p>' +
    (bullets.length ? list(bullets) : '') + '</article>';
}
function education(locale) {
  return locale.education.map(item => '<p><strong>' + e(item.school) + '</strong> · ' +
    e(item.start) + ' – ' + e(item.end) + '<br>' + e(item.field) + '</p>').join('') +
    locale.courses.map(item => '<p>' + e(item.name) + ' · ' + e(item.start) + ' – ' + e(item.end) + '</p>').join('');
}
function skills(locale, indices) {
  return indices.map(i => '<p><strong>' + e(locale.skills[i].name) + ':</strong> ' + e(locale.skills[i].text) + '</p>').join('');
}
function head(lang, title, css, draft = true) {
  return '<!doctype html><html lang="' + e(lang) + '"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1"><title>' + e(title) +
    '</title>' + (draft ? '<meta name="robots" content="noindex">' : '') + '<link rel="stylesheet" href="' + css + '"></head>';
}
export function renderDocument(data, lang, doc, draft = true) {
  const locale = data.locales[lang], l = locale.labels;
  const jobs = page => doc.pages[page].map(id => job(data,locale,id,doc.details[id] || 0)).join('');
  const footer = number => '<footer class="page-footer"><span>' + e(data.person.name) +
    '</span><span>' + number + ' / 2</span></footer>';
  return head(lang,data.person.name + ' — ' + l.title,'../../css/document.css',draft) +
    '<body class="document"><nav class="document-nav"><a href="../../' + lang + '/">' + e(l.back) + '</a></nav>' +
    '<main><section class="sheet" aria-label="1"><header class="document-header"><h1>' + e(data.person.name) + '</h1>' +
    contact(data.person) + '</header><section><h2>' + e(l.experience) + '</h2>' + jobs(0) +
    '</section>' + footer(1) + '</section>' +
    '<section class="sheet" aria-label="2"><section><h2>' + e(l.earlier) + '</h2>' + jobs(1) +
    '</section><section class="skills"><h2>' + e(l.skills) + '</h2>' + skills(locale,doc.skills) +
    '</section><section><h2>' + e(l.languages) + '</h2><p>' + locale.languages.map(e).join(' · ') +
    '</p></section><section><h2>' + e(l.education) + '</h2>' + education(locale) +
    '</section><section><h2>' + e(l.additional) + '</h2><p>' + e(locale.driving) +
    '</p></section>' +
    footer(2) + '</section></main></body></html>';
}
// Every locale uses the clean template in site.mjs; the original HTML files stay as historical sources.
export function renderWeb(data, lang, available = [], draft = true) {
  return renderSite(data, lang, draft);
}
