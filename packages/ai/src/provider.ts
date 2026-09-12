export interface ChatMessage { role:'system'|'user'|'assistant'; content:string; }
export interface ChatRequest { model?:string; messages:ChatMessage[]; temperature?:number; maxTokens?:number; }
export interface StructuredRequest<T> extends ChatRequest { schemaName:string; jsonSchema?:unknown; validate?:(value:unknown)=>value is T; }
export interface LLMProvider { name:string; chat(request:ChatRequest):Promise<string>; generateStructured<T>(request:StructuredRequest<T>):Promise<T>; }

function extractJson(text:string):unknown{ const trimmed=text.trim(); try{return JSON.parse(trimmed)}catch{} const fence=trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i); if(fence) return JSON.parse(fence[1]!); const a=trimmed.indexOf('{'),b=trimmed.lastIndexOf('}'); if(a>=0&&b>a) return JSON.parse(trimmed.slice(a,b+1)); throw new Error('Provider returned no JSON object'); }
export async function structuredViaChat<T>(provider:LLMProvider, req:StructuredRequest<T>):Promise<T>{ const raw=await provider.chat({...req,messages:[...req.messages,{role:'system',content:'Return ONLY valid JSON. Do not use markdown fences.'}]}); const parsed=extractJson(raw); if(req.validate&&!req.validate(parsed)) throw new Error(`Structured output failed ${req.schemaName} validation`); return parsed as T; }
