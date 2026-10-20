import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
export function serve(directory, port = 4173) {
  const root=path.resolve(directory);
  const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.pdf':'application/pdf','.jpg':'image/jpeg','.png':'image/png','.txt':'text/plain'};
  const server=createServer(async(req,res)=>{
    try {
      if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
      const route=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      const target=path.resolve(root,'.'+route);
      if(target!==root && !target.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
      let file=target;
      if((await stat(file)).isDirectory()) file=path.join(file,'index.html');
      const bytes=await readFile(file);
      res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
      res.end(req.method==='HEAD'?undefined:bytes);
    } catch(error) {res.writeHead(error.code==='ENOENT'?404:400);res.end('Not found');}
  });
  return new Promise(resolve=>server.listen(port,'127.0.0.1',()=>resolve(server)));
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  const server=await serve(fileURLToPath(new URL('../dist/',import.meta.url)));
  console.log('Preview: http://127.0.0.1:'+server.address().port+'/sk/');
}
