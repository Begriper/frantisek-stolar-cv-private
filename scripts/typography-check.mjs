import assert from 'node:assert/strict';

// Check computed browser styles, including inheritance and stylesheet order.
export async function checkTypography(page, media) {
  await page.evaluate(async()=>{
    for(const weight of [400,500,600,700]) await document.fonts.load(`${weight} 16px Inter`);
    await document.fonts.ready;
  });
  const print=media==='print';
  const roles=[
    ['companies','.exp-item__company,.employment-company',print?14:16,'600',16],
    ['positions','.exp-item__role',print?14:18,'700',8],
    ['sectionHeadings','.section__title',print?16:20,'600',8],
    ['dates','.exp-item__date,.employment-period,.edu__meta',print?9.5*4/3:14,'400',20],
    ['skillHeadings','.col-aside .sub',print?10*4/3:16,'700',4],
  ];
  const report={media};
  assert.equal(await page.evaluate(()=>document.fonts.check('16px Inter')),true,'Inter must load');
  for(const [role,selector,size,weight,count] of roles) {
    const values=await page.locator(selector).evaluateAll(elements=>elements.map(el=>{
      const s=getComputedStyle(el);
      return {text:el.textContent.trim(),size:parseFloat(s.fontSize),weight:s.fontWeight,
        style:s.fontStyle,family:s.fontFamily,leading:s.lineHeight,spacing:s.letterSpacing};
    }));
    assert.equal(values.length,count,role+' missing elements');
    for(const value of values) {
      assert.ok(Math.abs(value.size-size)<0.001,role+'/'+value.text+' font size');
      assert.equal(value.weight,weight,role+'/'+value.text+' weight');
      assert.equal(value.style,'normal',role+'/'+value.text+' unexpected italic');
      assert.ok(value.family.startsWith('Inter'),role+'/'+value.text+' must use Inter');
      for(const property of ['family','leading','spacing'])
        assert.equal(value[property],values[0][property],role+'/'+value.text+'/'+property);
    }
    report[role]={count,sizePx:values[0].size,weight,style:'normal',lineHeight:values[0].leading};
  }
  return report;
}
