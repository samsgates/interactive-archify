import fs from 'node:fs'; import path from 'node:path';
const dirs=fs.readdirSync('examples',{withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>x.name);
let ok=true;
for(const d of dirs){
  const f=path.join('examples',d,'architecture.iam.json');
  if(!fs.existsSync(f)) continue;
  const j=JSON.parse(fs.readFileSync(f,'utf8'));
  const required=['schemaVersion','project','architecture','layers','components','relationships','flows'];
  let fileOk=true;
  for(const k of required){ if(!(k in j)){ console.error(`${f}: missing ${k}`); ok=false; fileOk=false; } }
  if(fileOk) console.log(`✓ ${f}`);
}
if(!ok) process.exit(1);
