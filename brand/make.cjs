const http=require('http'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const ROOT=__dirname;
const s=http.createServer((q,r)=>{const p=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));fs.readFile(p,(e,b)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':p.endsWith('.html')?'text/html':'text/javascript'});r.end(b);});}).listen(0,async()=>{
 const br=await chromium.launch({executablePath:process.env.PW_CHROME||undefined,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const pg=await br.newPage({viewport:{width:2560,height:1440}});
 pg.on('pageerror',e=>console.log('[err]',e.message));
 await pg.goto(`http://localhost:${s.address().port}/pfp.html`);
 await pg.waitForFunction(()=>window.READY===true);
 for(const v of ['A','B','C','banner']){const d=await pg.evaluate(v=>make(v),v);fs.writeFileSync(v==='banner'?path.join(ROOT,'banner_youtube.png'):path.join(ROOT,`pfp_${v}.png`),Buffer.from(d.split(',')[1],'base64'));}
 await br.close();s.close();});
