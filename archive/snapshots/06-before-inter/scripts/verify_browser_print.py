import json,re,unicodedata
from pathlib import Path
from pypdf import PdfReader
import pypdfium2 as pdfium
from PIL import Image
from html.parser import HTMLParser
root=Path.cwd();review=root/'.review'
data=json.loads((root/'data/cv.json').read_text(encoding='utf-8'))
normalize=lambda s: re.sub(r'\s+','',unicodedata.normalize('NFKC',s).replace('\u00ad','')).casefold()
reports=[]
for lang in ['sk','cs','pl','de','en']:
 path=review/('browser-print-'+lang+'.pdf');reader=PdfReader(path)
 view=data['locales'][lang].get('generalWeb')
 if view: assert len(reader.pages)<=view['maxPrintPages'],('Too many pages',lang,len(reader.pages))
 texts=[p.extract_text() for p in reader.pages];combined='\n'.join(texts);alltext=normalize(combined)
 assert data['person']['name'] in texts[0]
 assert data['person']['email'] in texts[0]
 assert data['person']['phone'] in texts[0]
 assert '\ufffd' not in combined
 assert not re.search(r'Návrh na kontrolu|čakajú na schválenie|obdobie na potvrdenie',combined)
 for job in data['jobs']:
  wording=data['locales'][lang]['jobs'].get(job['id'])
  if not wording: continue
  stamp=lambda d:d[5:]+'/'+d[:4]
  group=next((g for g in data['generalGroups'] if any(job['id'] in entry['jobIds'] for entry in g['entries'])),None)
  dates=stamp(job['start'])+' – '+stamp(job['end'])
  if group:
   entry=next(entry for entry in group['entries'] if job['id'] in entry['jobIds'])
   text=view['entryTexts'][entry['id']]
   employer=entry.get('employer',data['locales'][lang].get('employerDisplay',{}).get(job['id'],job['employer']))
   required=[employer,dates,text['description']]+([text['note']] if text.get('note') else [])
   assert normalize(view['groupTitles'][group['id']]) in alltext
  else:
   bullets=wording['bullets'][:view['details'].get(job['id'],0)]
   required=[wording['role'],data['locales'][lang].get('employerDisplay',{}).get(job['id'],job['employer']),dates]+bullets
  for text in required: assert normalize(text) in alltext, (lang,job['id'],'missing',text)
  assert any(all(normalize(t) in normalize(page) for t in required) for page in texts),(lang,job['id'],'split across pages')
 class Text(HTMLParser):
  def __init__(self):super().__init__();self.parts=[]
  def handle_data(self,s):
   if s.strip():self.parts.append(s)
 for section in ['projects','hobby','skills','education','certificates','languages','additional-info']:
  content=view['sections'][section] if view and section in view['sections'] else data['locales'][lang]['legacySections'][section]
  if content is None: continue
  parser=Text();parser.feed(content)
  for part in parser.parts:assert normalize(part) in alltext,(lang,section,'missing',part)
 if view:
  for unwanted in ['ProStore','React','Základná škola','súčasnosť','Veľmi dobrá adaptabilita']:
   assert normalize(unwanted) not in alltext,('Unwanted text',unwanted)
  assert '2027' not in combined and '©' not in combined
  if lang=='sk': assert normalize('turistika v horách') in alltext
 courses=data['locales'][lang]['generalWeb']['sections']['certificates']
 for course in re.findall(r'<li>(.*?)</li>',courses,re.S):
  parser=Text();parser.feed(course)
  assert any(all(normalize(t) in normalize(page) for t in parser.parts) for page in texts),(lang,'split course')
 for page in reader.pages:
  assert abs(float(page.mediabox.width)-595.28)<2 and abs(float(page.mediabox.height)-841.89)<2
  assert len(page.extract_text().strip())>100,'Near-blank page'
 doc=pdfium.PdfDocument(str(path));images=[]
 for i in range(len(doc)):
  image=doc[i].render(scale=1.2).to_pil().convert('RGB');image.save(review/f'print-{lang}-{i+1}.png');images.append(image)
 cols=min(3,len(images));rows=(len(images)+cols-1)//cols
 montage=Image.new('RGB',(images[0].width*cols+20*(cols-1),images[0].height*rows+20*(rows-1)),'#dbe2ed')
 for i,img in enumerate(images):montage.paste(img,((i%cols)*(img.width+20),(i//cols)*(img.height+20)))
 montage.thumbnail((1600,1600));montage.save(review/f'print-{lang}-overview.png')
 (review/f'print-{lang}-text.txt').write_text(combined,encoding='utf-8')
 reports.append({'lang':lang,'pages':len(texts),'characters':[len(t) for t in texts],'allContentPresent':True,'jobsNotSplit':True,'contactOnFirstPage':True})
for lang in ['sk','cs','pl','de','en']:
 base=normalize('\n'.join(p.extract_text() for p in PdfReader(review/f'browser-print-{lang}.pdf').pages))
 for suffix in ['after-scroll','mobile-nojs','no-background']:
  pages=PdfReader(review/f'browser-print-{lang}-{suffix}.pdf').pages
  assert len(pages)<=2,(lang,suffix,'too many pages')
  texts=[p.extract_text() for p in pages]
  assert normalize('\n'.join(texts))==base,('Different content in',lang,suffix)
(review/'browser-print-check.json').write_text(json.dumps(reports,indent=2),encoding='utf-8')
print(json.dumps(reports,indent=2))