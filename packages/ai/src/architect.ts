import { architectureFromText, validateIAM, type IAM } from '@interactive-archify/core'; import type { LLMProvider } from './provider.js';
const SYSTEM=`You are the architecture modelling engine for interactive-archify. Return a complete IAM JSON object with schemaVersion 1.0. Preserve uncertainty. Use verified only for evidence explicitly provided, inferred for strong deductions, hypothetical for requested designs. Never invent fallback paths, security controls, replicas, protocols, or runtime relations. IDs must be stable kebab-case. Include layers, components, relationships, flows, scenes, stories, narrations, evidence, reviews, annotations and views arrays.`;
export async function generateArchitecture(prompt:string, provider:LLMProvider|null, name='Generated Architecture'):Promise<IAM>{
  if(!provider) return architectureFromText(prompt,name);
  const iam=await provider.generateStructured<IAM>({schemaName:'IAM',messages:[{role:'system',content:SYSTEM},{role:'user',content:`Project name: ${name}\n\nRequirements:\n${prompt}`}],maxTokens:9000});
  const v=validateIAM(iam); if(!v.valid) throw new Error('AI produced invalid IAM:\n'+v.issues.map(i=>i.message).join('\n')); return iam;
}
