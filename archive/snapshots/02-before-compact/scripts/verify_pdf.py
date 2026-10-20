"""Validate and render the actual exported document, not just its HTML."""
import json
import re
import unicodedata
from pathlib import Path
from pypdf import PdfReader
import pypdfium2 as pdfium
from PIL import Image
root = Path(__file__).resolve().parent.parent
data = json.loads((root/'data/cv.json').read_text(encoding='utf-8'))
manifest = json.loads((root/'dist/manifest.json').read_text(encoding='utf-8'))
review = root/'.review'
review.mkdir(exist_ok=True)
reports=[]
for item in manifest['documents']:
    path=root/'dist/downloads'/item['filename']
    reader=PdfReader(path)
    assert len(reader.pages)>=1
    if item['id']!='general': assert len(reader.pages)<=2, 'More than two pages'
    texts=[page.extract_text() for page in reader.pages]
    combined='\n'.join(texts)
    assert all(len(t.strip()) > 100 for t in texts), 'Blank page'
    assert '\ufffd' not in combined, 'Replacement glyphs in extraction'
    assert not re.search(r'Pracovný profil|Návrh na kontrolu|čakajú na schválenie|obdobie na potvrdenie',combined)
    normalize=lambda text: re.sub(r'\s+','',unicodedata.normalize('NFKC',text))
    assert data['person']['name'] in texts[0]
    assert data['person']['email'] in texts[0]
    assert data['person']['phone'] in texts[0]
    selected=next(d for d in data['documents'] if d['id']==item['id'])
    position=-1
    for job_id in selected['pages'][0]+selected['pages'][1]:
        fact=next(j for j in data['jobs'] if j['id']==job_id)
        stamp=lambda value:value[5:]+'/'+value[:4]
        dates=stamp(fact['start'])+' – '+stamp(fact['end'])
        found=combined.find(dates,position+1)
        assert found>position, 'Missing or unordered job: '+job_id
        position=found
        assert fact['employer'] in combined, 'Missing employer: '+job_id
    locale=data['locales'][item['lang']]
    if item['id']=='general':
        reference=PdfReader(review/('browser-print-'+item['lang']+'.pdf'))
        reference_text='\n'.join(p.extract_text() for p in reference.pages)
        assert normalize(reference_text)==normalize(combined), 'Export differs from native website print'
    else:
        for index,job_ids in enumerate(selected['pages']):
            page_text=normalize(texts[index])
            for job_id in job_ids:
                fact=next(j for j in data['jobs'] if j['id']==job_id)
                wording=locale['jobs'][job_id]
                required=[fact['employer'],wording['role']]+wording['bullets'][:selected['details'].get(job_id,0)]
                for text in required:
                    assert normalize(text) in page_text, 'Missing or split content: '+job_id
    for page in reader.pages:
        width,height=float(page.mediabox.width),float(page.mediabox.height)
        assert abs(width-595.28)<2 and abs(height-841.89)<2, 'Not A4'
        if item['id']!='general': assert not page.images, 'Targeted document template should contain text'
    doc=pdfium.PdfDocument(str(path))
    rendered=[]
    for i in range(len(doc)):
        image=doc[i].render(scale=1.25).to_pil().convert('RGB')
        image.save(review/(item['id']+'-'+item['lang']+'-page-'+str(i+1)+'.png'))
        rendered.append(image)
    montage=Image.new('RGB',(sum(i.width for i in rendered)+20*(len(rendered)-1),max(i.height for i in rendered)), '#dfe5eb')
    offset=0
    for image in rendered:
        montage.paste(image,(offset,0));offset+=image.width+20
    montage.thumbnail((1450,1100))
    montage.save(review/(item['id']+'-'+item['lang']+'-overview.png'))
    (review/(item['id']+'-'+item['lang']+'-extracted.txt')).write_text(combined,encoding='utf-8')
    reports.append({'file':item['filename'],'pages':len(texts),'characters':[len(t) for t in texts],
                    'a4':True,'imageFree':not any(page.images for page in reader.pages),'contactOnFirstPage':True,'chronologyVerified':True})
(review/'pdf-check.json').write_text(json.dumps(reports,indent=2)+'\n',encoding='utf-8')
print(json.dumps(reports,indent=2))
