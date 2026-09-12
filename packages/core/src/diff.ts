import { shortestPath } from './graph.js'; import type { IAM } from './types.js';
export interface ArchitectureDiff { addedComponents:string[]; removedComponents:string[]; changedComponents:string[]; addedRelationships:string[]; removedRelationships:string[]; changedRelationships:string[]; }
export function diffArchitectures(before:IAM,after:IAM):ArchitectureDiff{
  const bC=new Map(before.components.map(c=>[c.id,c])),aC=new Map(after.components.map(c=>[c.id,c])),bR=new Map(before.relationships.map(r=>[r.id,r])),aR=new Map(after.relationships.map(r=>[r.id,r]));
  const changed=(a:any,b:any)=>JSON.stringify(a)!==JSON.stringify(b);
  return {addedComponents:[...aC.keys()].filter(x=>!bC.has(x)),removedComponents:[...bC.keys()].filter(x=>!aC.has(x)),changedComponents:[...aC.keys()].filter(x=>bC.has(x)&&changed(bC.get(x),aC.get(x))),addedRelationships:[...aR.keys()].filter(x=>!bR.has(x)),removedRelationships:[...bR.keys()].filter(x=>!aR.has(x)),changedRelationships:[...aR.keys()].filter(x=>bR.has(x)&&changed(bR.get(x),aR.get(x)))};
}
export interface FailureSimulation { failed:string; affectedRelationships:string[]; affectedFlows:string[]; alternateAuthoredRoutes:Array<{from:string;to:string;path:string[]}>; statement:string; }
export function simulateFailure(iam:IAM,componentId:string):FailureSimulation{
  const affectedRelationships=iam.relationships.filter(r=>r.source===componentId||r.target===componentId).map(r=>r.id); const affectedFlows=iam.flows.filter(f=>f.steps.some(s=>s.componentId===componentId)).map(f=>f.id); const reduced={...iam,components:iam.components.filter(c=>c.id!==componentId),relationships:iam.relationships.filter(r=>r.source!==componentId&&r.target!==componentId)} as IAM; const alt:FailureSimulation['alternateAuthoredRoutes']=[];
  for(const flow of iam.flows.filter(f=>affectedFlows.includes(f.id))){const idx=flow.steps.findIndex(s=>s.componentId===componentId);if(idx>0&&idx<flow.steps.length-1){const from=flow.steps[idx-1]!.componentId,to=flow.steps[idx+1]!.componentId;const path=shortestPath(reduced,from,to);if(path.length)alt.push({from,to,path});}}
  return {failed:componentId,affectedRelationships,affectedFlows,alternateAuthoredRoutes:alt,statement:alt.length?'Alternate authored routes exist in the model. They are not claimed to be automatic failover unless explicitly documented.':'No alternate authored route around the failed component is represented.'};
}
