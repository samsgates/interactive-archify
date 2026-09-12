import type { IAM } from './types.js';
export interface ValidationIssue { code: string; message: string; path?: string; severity: 'error'|'warning'; }
export interface ValidationResult { valid: boolean; issues: ValidationIssue[]; }

const pushDupes = (items: {id:string}[], label:string, issues:ValidationIssue[]) => {
  const seen = new Set<string>();
  for (const item of items) {
    if (!item.id || typeof item.id !== 'string') issues.push({code:'missing-id',message:`${label} has a missing id`,severity:'error'});
    else if (seen.has(item.id)) issues.push({code:'duplicate-id',message:`Duplicate ${label} id: ${item.id}`,severity:'error'});
    seen.add(item.id);
  }
};

export function validateIAM(iam: IAM): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (!iam || iam.schemaVersion !== '1.0') issues.push({code:'schema-version', message:'schemaVersion must be 1.0', severity:'error'});
  if (!iam.project?.id || !iam.project?.name) issues.push({code:'project', message:'project.id and project.name are required', severity:'error'});
  if (!iam.architecture?.title) issues.push({code:'title',message:'architecture.title is required',severity:'error'});
  const arrays: Array<[unknown,string]> = [[iam.layers,'layers'],[iam.components,'components'],[iam.relationships,'relationships'],[iam.boundaries,'boundaries'],[iam.flows,'flows'],[iam.scenes,'scenes'],[iam.stories,'stories'],[iam.narrations,'narrations'],[iam.evidence,'evidence'],[iam.reviews,'reviews'],[iam.annotations,'annotations'],[iam.views,'views']];
  for (const [v,n] of arrays) if (!Array.isArray(v)) issues.push({code:'array',message:`${n} must be an array`,severity:'error'});
  if (issues.some(i => i.severity === 'error')) return {valid:false,issues};

  pushDupes(iam.layers,'layer',issues); pushDupes(iam.components,'component',issues); pushDupes(iam.relationships,'relationship',issues);
  pushDupes(iam.boundaries,'boundary',issues); pushDupes(iam.flows,'flow',issues); pushDupes(iam.scenes,'scene',issues);
  pushDupes(iam.stories,'story',issues); pushDupes(iam.narrations,'narration',issues); pushDupes(iam.evidence,'evidence',issues); pushDupes(iam.reviews,'review',issues);

  const comps = new Set(iam.components.map(c => c.id)); const layers = new Set(iam.layers.map(l=>l.id)); const rels = new Set(iam.relationships.map(r=>r.id));
  const scenes = new Set(iam.scenes.map(s=>s.id)); const narr = new Set(iam.narrations.map(n=>n.id)); const ev = new Set(iam.evidence.map(e=>e.id));
  for (const c of iam.components) {
    if (!layers.has(c.layer)) issues.push({code:'unknown-layer',message:`Component ${c.id} references unknown layer ${c.layer}`,severity:'error'});
    if (c.parentId && !comps.has(c.parentId)) issues.push({code:'unknown-parent',message:`Component ${c.id} parent ${c.parentId} does not exist`,severity:'error'});
    for (const e of c.evidenceIds ?? []) if (!ev.has(e)) issues.push({code:'unknown-evidence',message:`Component ${c.id} references unknown evidence ${e}`,severity:'warning'});
  }
  for (const r of iam.relationships) {
    if (!comps.has(r.source) || !comps.has(r.target)) issues.push({code:'relationship-reference',message:`Relationship ${r.id} references missing source or target`,severity:'error'});
  }
  for (const f of iam.flows) {
    for (const s of f.steps) {
      if (!comps.has(s.componentId)) issues.push({code:'flow-component',message:`Flow ${f.id} references missing component ${s.componentId}`,severity:'error'});
      if (s.relationshipId && !rels.has(s.relationshipId)) issues.push({code:'flow-relationship',message:`Flow ${f.id} references missing relationship ${s.relationshipId}`,severity:'error'});
    }
    for (let i=1;i<f.steps.length;i++) {
      const prev=f.steps[i-1]!, cur=f.steps[i]!;
      if (cur.relationshipId) {
        const r=iam.relationships.find(x=>x.id===cur.relationshipId);
        if (r && !(r.source===prev.componentId && r.target===cur.componentId) && !(r.direction==='bidirectional' && r.target===prev.componentId && r.source===cur.componentId)) {
          issues.push({code:'flow-topology',message:`Flow ${f.id} step ${i} does not match authored relationship ${r.id}`,severity:'error'});
        }
      }
    }
  }
  for (const s of iam.scenes) {
    for (const id of s.focus ?? []) if (!comps.has(id)) issues.push({code:'scene-focus',message:`Scene ${s.id} focuses missing component ${id}`,severity:'error'});
    for (const id of s.highlightEdges ?? []) if (!rels.has(id)) issues.push({code:'scene-edge',message:`Scene ${s.id} highlights missing relationship ${id}`,severity:'error'});
    for (const id of s.visibleLayers ?? []) if (!layers.has(id)) issues.push({code:'scene-layer',message:`Scene ${s.id} references missing layer ${id}`,severity:'error'});
    if (s.narrationId && !narr.has(s.narrationId)) issues.push({code:'scene-narration',message:`Scene ${s.id} references missing narration ${s.narrationId}`,severity:'error'});
  }
  for (const story of iam.stories) for (const ch of story.chapters) for (const id of ch.sceneIds) if (!scenes.has(id)) issues.push({code:'story-scene',message:`Story ${story.id} references missing scene ${id}`,severity:'error'});
  for (const b of iam.boundaries) for (const id of b.componentIds) if (!comps.has(id)) issues.push({code:'boundary-component',message:`Boundary ${b.id} references missing component ${id}`,severity:'error'});
  return {valid: !issues.some(i=>i.severity==='error'), issues};
}

export function assertValidIAM(iam:IAM): IAM {
  const result=validateIAM(iam); if (!result.valid) throw new Error(result.issues.map(i=>`${i.code}: ${i.message}`).join('\n')); return iam;
}
