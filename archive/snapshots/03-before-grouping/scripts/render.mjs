import { readFileSync } from 'node:fs';
import { escape as e, date, root } from './model.mjs';
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
    '</p><p class="availability">' + e(locale.availability) + '</p></section>' +
    footer(2) + '</section></main></body></html>';
}
// Preserve the original site's markup and design; only inject current CV data.
export function renderWeb(data, lang, available = [], draft = true) {
  const locale = data.locales[lang];
  let html = readFileSync(new URL(lang+'/index.html',root),'utf8');
  const allJobs = [...data.jobs].filter(item => locale.jobs[item.id])
    .sort((a,b) => b.end.localeCompare(a.end) || b.start.localeCompare(a.start));
  const view=locale.generalWeb;
  const emitted=new Set();
  const articles = allJobs.map(fact => {
    const group=view?.groups.find(item=>item.jobIds.includes(fact.id));
    if(group) {
      if(emitted.has(group.id)) return '';
      emitted.add(group.id);
      const periods=group.jobIds.map(id=>{
        const item=data.jobs.find(job=>job.id===id);
        return '<span class="employment-period" data-job="'+e(id)+'">'+e(date(item.start))+' – '+e(date(item.end))+'</span>';
      }).join('');
      return '<article class="exp-item employment-group" data-group="'+e(group.id)+'"><h3 class="exp-item__role">'+e(group.role)+
        '</h3><div class="exp-item__meta"><span class="exp-item__company">'+e(group.workplace)+'</span></div>'+
        '<div class="employment-periods">'+periods+'</div><p class="employment-note">'+e(group.note)+'</p>'+
        '<ul class="list">'+group.bullets.map(t=>'<li>'+e(t)+'</li>').join('')+'</ul></article>';
    }
    const text=locale.jobs[fact.id];
    const bullets=view?text.bullets.slice(0,view.details[fact.id]||0):text.bullets;
    return '<article class="exp-item'+(view&&!bullets.length?' exp-item--compact':'')+'" data-job="'+e(fact.id)+'"><h3 class="exp-item__role">'+e(text.role)+
      '</h3><div class="exp-item__meta"><span class="exp-item__company">'+e(fact.employer)+
      '</span><span class="exp-item__date">'+e(date(fact.start))+' – '+e(date(fact.end))+
      '</span></div>'+(bullets.length?'<ul class="list">'+bullets.map(t=>'<li>'+e(t)+'</li>').join('')+'</ul>':'')+'</article>';
  }).join('\n');
  html=html.replace(/(<section id="experience"[^>]*>\s*<h2[^>]*>[\s\S]*?<\/h2>)[\s\S]*?<\/section>/,
    (_,heading)=>heading+'\n'+articles+'\n</section>');
  for(const id of ['projects','hobby','skills','education','certificates','languages','additional-info']) {
    const content=view&&Object.hasOwn(view.sections,id)?view.sections[id]:locale.legacySections[id];
    if(content!==undefined) html=html.replace(new RegExp('<section id="'+id+'"[^>]*>[\\s\\S]*?<\\/section>'),
      ()=>content===null?'':'<section id="'+id+'" class="section">'+content+'</section>');
  }
  html=html.replace(/<h3[^>]*>\s*<\/h3>/g,'');
  html=html.replace(/(<h1 class="hero__name">)[^<]*(<\/h1>)/,(_,a,b)=>a+e(data.person.name)+b);
  html=html.replace('<link rel="stylesheet" href="/css/print.css" media="print" />',
    '<link rel="stylesheet" href="/css/web-refinements.css" />\n<link rel="stylesheet" href="/css/print.css" media="print" />');
  html=html.replace(/<meta name="robots" content="[^"]*" \/>/,
    '<meta name="robots" content="'+(draft?'noindex':'index, follow')+'" />');
  if(view) html=html.replace('<body>','<body class="compact-general">');
  html=html.replace('loading="lazy"','loading="eager"');
  html=html.replace('</head>','<meta name="cv-layout" content="original" /></head>');
  return html;
}
