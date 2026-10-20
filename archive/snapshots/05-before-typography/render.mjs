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
    '</p></section>' +
    footer(2) + '</section></main></body></html>';
}
// Preserve the original site's markup and design; only inject current CV data.
export function renderWeb(data, lang, available = [], draft = true) {
  const locale = data.locales[lang];
  let html = readFileSync(new URL(lang+'/index.html',root),'utf8');
  const view=locale.generalWeb;
  html=html.replace(/(<meta\s+(?:name="description"|property="(?:og|twitter):description")\s+content=")[^"]*(")/g,
    (_,a,b)=>a+e(view.ui.description)+b);
  html=html.replace(/(<a href="#main" class="skip-link">)[^<]*(<\/a>)/,(_,a,b)=>a+e(view.ui.skip)+b);
  html=html.replace('aria-label="Language"','aria-label="'+e(view.ui.language)+'"');

  const employer = fact => locale.employerDisplay?.[fact.id] || fact.employer;
  const period = id => {
    const fact=data.jobs.find(item=>item.id===id);
    return '<span class="employment-period" data-job="'+e(id)+'">'+e(date(fact.start))+' – '+e(date(fact.end))+'</span>';
  };
  const articles=data.generalOrder.map(id=>{
    const group=data.generalGroups.find(item=>item.id===id);
    if(group) {
      const entries=group.entries.map(entry=>{
        const fact=data.jobs.find(item=>item.id===entry.jobIds[0]);
        const text=view.entryTexts[entry.id];
        return '<div class="employment-entry" data-entry="'+e(entry.id)+'">'+
          '<h4 class="employment-company">'+e(entry.employer || employer(fact))+'</h4>'+
          '<div class="employment-periods">'+entry.jobIds.map(period).join('')+'</div>'+
          (text.note?'<p class="employment-note">'+e(text.note)+'</p>':'')+
          '<p class="employment-description">'+e(text.description)+'</p></div>';
      }).join('');
      return '<article class="exp-item employment-group" data-group="'+e(group.id)+'">'+
        '<h3 class="exp-item__role">'+e(view.groupTitles[group.id])+'</h3>'+entries+'</article>';
    }
    const fact=data.jobs.find(item=>item.id===id),text=locale.jobs[id];
    const bullets=text.bullets.slice(0,view.details[id]||0);
    return '<article class="exp-item'+(!bullets.length?' exp-item--compact':'')+'" data-job="'+e(id)+'">'+
      '<h3 class="exp-item__role">'+e(text.role)+'</h3><div class="exp-item__meta"><span class="exp-item__company">'+
      e(employer(fact))+'</span><span class="exp-item__date">'+e(date(fact.start))+' – '+e(date(fact.end))+
      '</span></div>'+(bullets.length?list(bullets).replace('<ul>','<ul class="list">'):'')+'</article>';
  }).join('\n');
  html=html.replace(/(<section id="experience"[^>]*>)[\s\S]*?<\/section>/,
    (_,opening)=>opening+'<h2 class="section__title">'+e(view.experience)+'</h2>\n'+articles+'\n</section>');
  html=html.replace(/(<section id="contact"[^>]*>\s*<h2[^>]*>)[\s\S]*?(<\/h2>)/,
    (_,a,b)=>a+e(view.contact)+b);
  html=html.replace(/\s*<footer class="footer">[\s\S]*?<\/footer>/,'');
  for(const id of ['projects','hobby','skills','education','certificates','languages','additional-info']) {
    const content=view&&Object.hasOwn(view.sections,id)?view.sections[id]:locale.legacySections[id];
    if(content!==undefined) html=html.replace(new RegExp('<section id="'+id+'"[^>]*>[\\s\\S]*?<\\/section>'),
      ()=>content===null?'':'<section id="'+id+'" class="section">'+content+'</section>');
  }
  // Keep supplemental content in the actual sidebar for screen, print and reading order.
  const hobbies=html.match(/<section id="hobby"[^>]*>[\s\S]*?<\/section>/)?.[0];
  if(hobbies) {
    html=html.replace(hobbies,'');
    html=html.replace('</aside>',hobbies+'\n</aside>');
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
