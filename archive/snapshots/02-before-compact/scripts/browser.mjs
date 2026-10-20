import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export async function browser() {
  let chromium;
  try { ({chromium}=require('playwright')); }
  catch { throw new Error('Playwright is unavailable. Run npm install or set NODE_PATH to the bundled Node packages.'); }
  if(process.env.CV_BROWSER) return chromium.launch({headless:true,channel:process.env.CV_BROWSER});
  try { return await chromium.launch({headless:true}); }
  catch (error) {
    if(process.platform==='win32') return chromium.launch({headless:true,channel:'msedge'});
    throw error;
  }
}
