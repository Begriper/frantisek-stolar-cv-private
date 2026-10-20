import re, html, json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
ids=['telemarcom','muller-2021','baur','rewe','mytoys','muller-2019','lidl','muller-2018','hermes','muller-2017','zibura','siluma','isometall','pellets','dairy','roofing','onyx','taminet']
def plain(s): return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>','',s))).strip()
def field(cls,s): return plain(re.search('class="'+cls+r'"[^>]*>(.*?)</',s,re.S)[1])
def iso(s):
    m,y=s.split('/')
    return y+'-'+m
data={'schemaVersion':1,'person':{'name':'František Stolár','city':'Poprad','phone':'+421 907 407 968','email':'fero.stolar@gmail.com','website':'https://frantisek-stolar.cv','github':'https://github.com/Begriper','linkedin':'https://linkedin.com/in/frantisek-stolar'},'jobs':[],'locales':{},'review':{'slovakContentApproved':False,'slovakLayoutApproved':False,'deltrianDatesConfirmed':False,'translationsApproved':[],'publishApproved':False}}
for lang in ['sk','cs','pl','de','en']:
    source=(root/lang/'index.html').read_text(encoding='utf-8')
    articles=re.findall(r'<article class="exp-item">(.*?)</article>',source,re.S)
    assert len(articles)==len(ids),lang
    locale={'jobs':{},'legacySections':{}}
    for id,article in zip(ids,articles):
        start,end=field('exp-item__date',article).split(' – ')
        facts={'id':id,'employer':field('exp-item__company',article),'start':iso(start),'end':iso(end)}
        if lang=='sk': data['jobs'].append(facts)
        else:
            old=next(j for j in data['jobs'] if j['id']==id)
            assert (old['start'],old['end'])==(facts['start'],facts['end']),(lang,id)
        locale['jobs'][id]={'role':field('exp-item__role',article),'bullets':[plain(li) for li in re.findall(r'<li>(.*?)</li>',article,re.S)]}
    for id in ['summary','projects','hobby','skills','education','certificates','languages','additional-info']:
        found=re.search(r'<section id="'+id+r'"[^>]*>(.*?)</section>',source,re.S)
        if found: locale['legacySections'][id]=found[1].strip()
    data['locales'][lang]=locale
data['jobs'].insert(0,{'id':'deltrian','employer':'Deltrian','start':'2025-10','end':'2026-04','dateStatus':'needs-confirmation'})
sk=data['locales']['sk']
sk['jobs']['deltrian']={'role':'Pracovník výroby','bullets':['Rezanie, skladanie a vŕtanie hliníkových dielov.','Laserové označovanie dielov logom.']}
sk['jobs']['muller-2021']['bullets']=['Vychystávanie objednávok pomocou skenera, balenie a etiketovanie zásielok.','Príjem a výdaj tovaru, paletizácia, udržiavanie poriadku a plnenie výkonových noriem.']
sk['jobs']['lidl']['bullets']=['Balenie a triedenie zásielok pomocou skenera; pomocné skladové práce.']
sk['jobs']['telemarcom']['role']='Pracovník zákazníckej podpory a reklamácií (SZČO)'
sk['profiles']={
'general':'Pracovník so skúsenosťami z výroby, kovovýroby, skladovej logistiky v Nemecku a zákazníckej podpory. Prax zahŕňa spracovanie hliníkových dielov, vychystávanie objednávok so skenerom a telefonické aj e-mailové vybavovanie reklamácií.',
'production':'Skúsenosti s rezaním, skladaním a vŕtaním hliníkových dielov a laserovým označovaním. Predchádzajúca prax v kovovýrobe zahŕňa zváranie CO₂, brúsenie, sústruh a montáže.',
'support':'Skúsenosti s telefonickou a e-mailovou zákazníckou podporou a spracovaním produktových reklamácií. Slovenčina je môj materinský jazyk; ovládam aj češtinu a poľštinu.',
'logistics':'Viacročná prax v skladovej logistike v Nemecku. Skúsenosti s vychystávaním pomocou skenera, balením, etiketovaním, príjmom a výdajom tovaru a paletizáciou.'}
sk['availability']='Plánovaný nástup do práce: 2027, presný termín podľa dohody.'
sk['skills']=[
{'name':'Výroba a dielenské práce','text':'Rezanie, skladanie a vŕtanie hliníkových dielov; laserové označovanie. Skúsenosti s brúsením, zváraním CO₂, sústruhom a montážami.'},
{'name':'Logistika a sklad','text':'Vychystávanie objednávok, skener, balenie, etiketovanie, príjem a výdaj tovaru, paletizácia a inventúra.'},
{'name':'Zákaznícka podpora','text':'Telefonická a e-mailová komunikácia, produktové reklamácie, komunikácia s obchodnými reťazcami.'},
{'name':'Digitálne zručnosti','text':'Excel, Power Query, Power BI, SQL a Python — vzdelávanie a vlastné projekty.'}]
sk['languages']=['Slovenčina — materinský jazyk','Čeština — pokročilá znalosť','Poľština — pokročilá znalosť','Angličtina — základy']
sk['education']=[{'school':'Stredná odborná škola, Kežmarok','field':'Mechanik počítačových sietí','start':'2010','end':'2014'}]
sk['courses']=[{'name':'Data Analyst — Skillmea (RePass)','start':'07/2025','end':'08/2025'}]
sk['driving']='Vodičský preukaz: skupina B.'
sk['labels']={'title':'Životopis','profile':'Pracovný profil','experience':'Pracovné skúsenosti','earlier':'Predchádzajúce pracovné skúsenosti','skills':'Zručnosti','education':'Vzdelanie a vybrané kurzy','languages':'Jazyky','additional':'Ďalšie informácie','download':'Stiahnuť životopis (PDF)','print':'Vytlačiť životopis','variants':'Ďalšie verzie CV','contact':'Kontakt','review':'Návrh na kontrolu','back':'Späť na webový životopis','archive':'Projekty a ďalšie vzdelávanie','skip':'Prejsť na obsah'}
recent=['deltrian','muller-2021','telemarcom','baur','rewe','mytoys','muller-2019','lidl']
earlier=['muller-2018','hermes','muller-2017','zibura','isometall','siluma','pellets']
data['documents']=[
{'id':'general','label':'Všeobecný životopis','pages':[recent,earlier],'details':{'deltrian':2,'muller-2021':2,'telemarcom':2},'skills':[0,1,2,3]},
{'id':'production','label':'Výroba a montáž','pages':[recent,earlier],'details':{'deltrian':2,'muller-2021':1,'zibura':1,'isometall':1,'siluma':1,'pellets':1},'skills':[0,1]},
{'id':'support','label':'Zákaznícka podpora','pages':[recent,earlier],'details':{'deltrian':1,'telemarcom':2,'muller-2021':1},'skills':[2,3,1]},
{'id':'logistics','label':'Sklad a logistika','pages':[recent,earlier],'details':{'deltrian':1,'muller-2021':2,'rewe':1,'hermes':1,'lidl':1},'skills':[1,0]}]
target=root/'data'/'cv.json'
target.parent.mkdir(exist_ok=True)
if target.exists(): raise SystemExit('Refusing to overwrite editorial data.')
target.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Imported',len(data['jobs']),'jobs in',len(data['locales']),'languages.')
