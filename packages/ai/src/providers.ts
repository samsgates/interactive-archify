import { structuredViaChat, type ChatRequest, type LLMProvider, type StructuredRequest } from './provider.js';

async function jsonFetch(url:string, init:RequestInit){ const r=await fetch(url,init); if(!r.ok) throw new Error(`${r.status} ${r.statusText}: ${await r.text()}`); return r.json() as Promise<any>; }
class OpenAIProvider implements LLMProvider{
  name='openai'; constructor(private apiKey:string,private baseUrl='https://api.openai.com/v1',private defaultModel='gpt-5.6-luna'){}
  async chat(r:ChatRequest){const x=await jsonFetch(`${this.baseUrl}/chat/completions`,{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${this.apiKey}`},body:JSON.stringify({model:r.model??this.defaultModel,messages:r.messages,temperature:r.temperature??0.2,max_tokens:r.maxTokens})}); return x.choices?.[0]?.message?.content??'';}
  generateStructured<T>(r:StructuredRequest<T>){return structuredViaChat<T>(this,r)}
}
class AnthropicProvider implements LLMProvider{
  name='anthropic'; constructor(private apiKey:string,private defaultModel='claude-sonnet-4-5'){}
  async chat(r:ChatRequest){const system=r.messages.filter(m=>m.role==='system').map(m=>m.content).join('\n'); const messages=r.messages.filter(m=>m.role!=='system').map(m=>({role:m.role,content:m.content})); const x=await jsonFetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':this.apiKey,'anthropic-version':'2023-06-01'},body:JSON.stringify({model:r.model??this.defaultModel,max_tokens:r.maxTokens??4096,system,messages})}); return x.content?.map((c:any)=>c.text??'').join('')??'';}
  generateStructured<T>(r:StructuredRequest<T>){return structuredViaChat<T>(this,r)}
}
class GeminiProvider implements LLMProvider{
  name='gemini'; constructor(private apiKey:string,private defaultModel='gemini-2.5-pro'){}
  async chat(r:ChatRequest){const prompt=r.messages.map(m=>`${m.role.toUpperCase()}: ${m.content}`).join('\n\n'); const x=await jsonFetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(r.model??this.defaultModel)}:generateContent?key=${encodeURIComponent(this.apiKey)}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:r.temperature??0.2}})}); return x.candidates?.[0]?.content?.parts?.map((p:any)=>p.text??'').join('')??'';}
  generateStructured<T>(r:StructuredRequest<T>){return structuredViaChat<T>(this,r)}
}
export function createProvider(env:NodeJS.ProcessEnv=process.env):LLMProvider|null{
  const p=(env.AI_PROVIDER??'openai').toLowerCase();
  if(p==='openai'&&env.OPENAI_API_KEY) return new OpenAIProvider(env.OPENAI_API_KEY,'https://api.openai.com/v1',env.AI_MODEL??'gpt-5.6-luna');
  if(p==='anthropic'&&env.ANTHROPIC_API_KEY) return new AnthropicProvider(env.ANTHROPIC_API_KEY,env.AI_MODEL??'claude-sonnet-4-5');
  if(p==='gemini'&&env.GEMINI_API_KEY) return new GeminiProvider(env.GEMINI_API_KEY,env.AI_MODEL??'gemini-2.5-pro');
  if((p==='openai-compatible'||p==='local')&&env.OPENAI_COMPATIBLE_BASE_URL) return new OpenAIProvider(env.OPENAI_COMPATIBLE_API_KEY??'local',env.OPENAI_COMPATIBLE_BASE_URL,env.AI_MODEL??'local-model');
  return null;
}
