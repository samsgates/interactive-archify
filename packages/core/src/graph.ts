import type { IAM, Component, Relationship } from './types.js';
export function adjacency(iam:IAM, reverse=false): Map<string, Relationship[]> {
  const m=new Map<string,Relationship[]>(); for (const c of iam.components) m.set(c.id,[]);
  for (const r of iam.relationships) { const key=reverse?r.target:r.source; const arr=m.get(key)??[]; arr.push(r); m.set(key,arr); if(r.direction==='bidirectional'){ const k2=reverse?r.source:r.target; const a2=m.get(k2)??[]; a2.push({...r,source:r.target,target:r.source}); m.set(k2,a2);} }
  return m;
}
export function shortestPath(iam:IAM, from:string, to:string): string[] {
  if(from===to) return [from]; const adj=adjacency(iam); const q=[from]; const prev=new Map<string,string>(); const seen=new Set([from]);
  while(q.length){const cur=q.shift()!; for(const r of adj.get(cur)??[]){ if(seen.has(r.target)) continue; seen.add(r.target); prev.set(r.target,cur); if(r.target===to){const p=[to]; let x=to; while(prev.has(x)){x=prev.get(x)!; p.push(x);} return p.reverse();} q.push(r.target); }} return [];
}
export function reachable(iam:IAM, start:string, reverse=false): string[] { const adj=adjacency(iam,reverse); const out:string[]=[]; const q=[start]; const seen=new Set([start]); while(q.length){const cur=q.shift()!; for(const r of adj.get(cur)??[]){const n=reverse?r.source:r.target; if(!seen.has(n)){seen.add(n);out.push(n);q.push(n)}}} return out; }
export function componentById(iam:IAM,id:string):Component|undefined{return iam.components.find(c=>c.id===id)}
export function relationshipsFor(iam:IAM,id:string){return iam.relationships.filter(r=>r.source===id||r.target===id)}
