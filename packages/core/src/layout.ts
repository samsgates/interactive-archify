import type { IAM, Position } from './types.js';
export interface LayoutOptions { width?: number; layerGap?: number; rowGap?: number; margin?: number; }
export function computeLayeredLayout(iam:IAM, options:LayoutOptions={}): Record<string,Position>{
  const width=options.width??1200, layerGap=options.layerGap??210,rowGap=options.rowGap??190,margin=options.margin??100;
  const ordered=[...iam.layers].sort((a,b)=>a.order-b.order); const out:Record<string,Position>={}; let row=0;
  for(const layer of ordered){ const nodes=iam.components.filter(c=>c.layer===layer.id && !c.parentId); if(!nodes.length) continue; const usable=width-margin*2; const spacing=nodes.length===1?0:Math.min(240,usable/(nodes.length-1)); const total=spacing*(nodes.length-1); const start=(width-total)/2; nodes.forEach((c,i)=>{out[c.id]=c.position??{x:start+i*spacing,y:margin+row*rowGap}; const children=iam.components.filter(x=>x.parentId===c.id); children.forEach((child,ci)=>out[child.id]=child.position??{x:out[c.id]!.x+(ci-(children.length-1)/2)*120,y:out[c.id]!.y+95});}); row++; }
  // unknown-layer orphan fallback
  for(const c of iam.components) if(!out[c.id]) out[c.id]=c.position??{x:margin+(Object.keys(out).length%5)*220,y:margin+row*rowGap};
  return out;
}
