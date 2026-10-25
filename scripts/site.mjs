import { escape as e, date, languages } from './model.mjs';

// Clean single-template CV (design B: dark sidebar), used for locales with experienceSections.
const icons = {
  location: 'M12 2.25c-3.73 0-6.75 3-6.75 6.72 0 4.86 6.14 11.99 6.4 12.27.2.21.52.21.72 0 .26-.28 6.41-7.41 6.41-12.27 0-3.72-3.02-6.72-6.78-6.72zm0 9.21a2.49 2.49 0 1 1 0-4.98 2.49 2.49 0 0 1 0 4.98z',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.09 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.98.35 1.93.66 2.84a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.24-1.23a2 2 0 0 1 2.11-.45c.91.31 1.86.53 2.84.66A2 2 0 0 1 22 16.92z',
  email: 'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z',
  website: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.93 6h-2.95a15.6 15.6 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14a8.2 8.2 0 0 1 0-4h3.38a16.5 16.5 0 0 0 0 4H4.26zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.99 7.99 0 0 1 5.07 16zm2.95-8H5.07a7.99 7.99 0 0 1 4.33-3.56A15.6 15.6 0 0 0 8.02 8zM12 19.96A14.1 14.1 0 0 1 10.09 16h3.82A14.1 14.1 0 0 1 12 19.96zM14.34 14H9.66a14.7 14.7 0 0 1 0-4h4.68a14.7 14.7 0 0 1 0 4zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14a16.5 16.5 0 0 0 0-4h3.38a8.2 8.2 0 0 1 0 4h-3.38z',
  linkedin: 'M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.5 8h4v13.5h-4V8zm7 0h3.8v1.85h.05c.53-1.01 1.84-2.07 3.79-2.07 4.05 0 4.8 2.67 4.8 6.14V21.5h-4V14c0-1.79-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 3.97v7.63h-4V8z',
  github: 'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.49v-1.72c-2.78.61-3.37-1.19-3.37-1.19-.45-1.13-1.11-1.43-1.11-1.43-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.92 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03a9.55 9.55 0 0 1 5.01 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.82-2.34 4.66-4.57 4.9.36.31.68.92.68 1.86v2.75c0 .27.18.59.69.49A10 10 0 0 0 12 2z',
};
const icon = name => '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="' + icons[name] + '"/></svg>';
const range = (start, end) => start === end ? date(start) : date(start) + ' – ' + date(end);
const labels = { sk: 'SK', cs: 'CZ', pl: 'PL', de: 'DE', en: 'EN' };

function contact(person, view) {
  const strip = url => url.replace(/^(https:\/\/|mailto:|tel:)(www\.)?/, '').replace(/\/$/, '');
  const row = (name, href, text) => '<li>' + icon(name) + (href ? '<a href="' + e(href) + '">' + e(text) + '</a>' : e(text)) + '</li>';
  return '<ul class="contacts">' +
    row('location', '', view.location) +
    row('phone', 'tel:' + person.phone.replaceAll(' ', ''), person.phone) +
    row('email', 'mailto:' + person.email, person.email) +
    view.textLinks.map(key => row(key, person[key], strip(person[key]))).join('') +
    '</ul><p class="socials">' + ['linkedin', 'github'].map(key =>
      '<a href="' + e(person[key]) + '" aria-label="' + (key === 'github' ? 'GitHub' : 'LinkedIn') + '">' + icon(key) + '</a>').join('') + '</p>';
}

function experience(data, locale, view) {
  const fact = id => data.jobs.find(job => job.id === id);
  const employer = job => locale.employerDisplay?.[job.id] || job.employer;
  const single = id => {
    const job = fact(id), text = locale.jobs[id];
    const bullets = text.bullets.slice(0, view.details[id] || 0);
    return '<article class="job" data-job="' + e(id) + '"><div class="job-head"><h4>' + e(text.role) + '</h4>' +
      '<span class="date">' + e(range(job.start, job.end)) + '</span></div><p class="org">' + e(employer(job)) + '</p>' +
      (bullets.length ? '<ul class="bullets">' + bullets.map(item => '<li>' + e(item) + '</li>').join('') + '</ul>' : '') + '</article>';
  };
  const group = item => {
    const jobs = item.entries.flatMap(entry => entry.jobIds.map(fact));
    const start = jobs.map(job => job.start).sort()[0], end = jobs.map(job => job.end).sort().at(-1);
    const entries = item.entries.map(entry => {
      const text = view.entryTexts[entry.id], first = fact(entry.jobIds[0]);
      const periods = entry.jobIds.map(id => '<span class="period" data-job="' + e(id) + '">' + e(range(fact(id).start, fact(id).end)) + '</span>');
      return '<li data-entry="' + e(entry.id) + '"><div class="row"><span class="org">' + e(entry.employer || employer(first)) + '</span>' +
        (periods.length === 1 ? periods[0].replace('class="period"', 'class="date"') : '') + '</div>' +
        (periods.length > 1 ? '<p class="periods">' + periods.join(' · ') + '</p>' : '') +
        (text.note ? '<p class="note">' + e(text.note) + '</p>' : '') + '<p>' + e(text.description) + '</p></li>';
    }).join('');
    return '<article class="job" data-group="' + e(item.id) + '"><div class="job-head"><h4>' + e(view.groupTitles[item.id]) + '</h4>' +
      '<span class="date">' + e(range(start, end)) + '</span></div><ul class="orgs">' + entries + '</ul></article>';
  };
  const short = id => {
    const job = fact(id);
    return '<li class="short-job" data-job="' + e(id) + '"><span><b>' + e(view.shortJobTexts?.[id] || locale.jobs[id].role) + '</b>, ' +
      e(employer(job)) + '</span><span class="date">' + e(range(job.start, job.end)) + '</span></li>';
  };
  return view.experienceSections.map(section => '<div class="field" data-section="' + e(section.id) + '"><h3 class="field-title">' +
    e(section.title) + '</h3>' + (section.compact ? '<ul class="short">' + section.items.map(short).join('') + '</ul>' :
      section.items.map(id => { const item = data.generalGroups.find(g => g.id === id); return item ? group(item) : single(id); }).join('')) +
    '</div>').join('');
}

function sidebar(view) {
  return view.sidebar.map(section => '<section class="sec" id="' + e(section.id) + '"><h2>' + e(section.title) + '</h2>' +
    (section.text ? '<p class="side-text">' + e(section.text) + '</p>' :
      '<ul class="' + (section.rows ? 'rows' : 'items') + '">' + section.items.map(item => section.rows ?
        '<li><span>' + e(item.name) + '</span><span>' + e(item.text) + '</span></li>' :
        '<li><h3>' + e(item.name) + '</h3>' + (item.dates ? '<p class="when">' + e(item.dates) + '</p>' : '') + '<p>' + e(item.text) + '</p></li>').join('') + '</ul>') +
    '</section>').join('');
}

export function renderSite(data, lang, draft = true) {
  const locale = data.locales[lang], view = locale.generalWeb, person = data.person;
  const switcher = '<nav class="langs" aria-label="' + e(view.ui.language) + '">' + languages.map(code =>
    '<a href="/' + code + '/"' + (code === lang ? ' aria-current="page"' : '') + '>' + labels[code] + '</a>').join('') + '</nav>';
  return '<!doctype html>\n<html lang="' + e(lang) + '"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1"><title>' + e(view.ui.title) + '</title>' +
    '<meta name="description" content="' + e(view.ui.description) + '">' +
    '<meta name="robots" content="' + (draft ? 'noindex' : 'index, follow') + '">' +
    '<meta name="color-scheme" content="light">' +
    '<link rel="canonical" href="' + e(person.website) + '/' + e(lang) + '/">' +
    '<link rel="preload" href="/fonts/inter/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>' +
    '<link rel="stylesheet" href="/css/cv.css"></head>' +
    '<body><a href="#main" class="skip-link">' + e(view.ui.skip) + '</a>' +
    '<div class="cv">' +
    '<img class="photo" src="/img/portrait.jpg" width="480" height="480" alt="' + e(person.name) + '">' +
    '<header class="id"><h1 class="name">' + e(person.name) + '</h1><p class="headline">' + e(view.headline) + '</p></header>' +
    switcher +
    '<div class="contact-wrap">' + contact(person, view) + '</div>' +
    '<aside class="side">' + sidebar(view) + '</aside>' +
    '<main class="main" id="main"><section class="sec" id="experience"><h2>' + e(view.experience) + '</h2>' +
    experience(data, locale, view) + '</section></main>' +
    '</div></body></html>\n';
}
