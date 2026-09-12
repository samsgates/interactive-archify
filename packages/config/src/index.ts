export interface AppConfig { aiProvider:string; aiModel:string; ttsProvider:string; ttsVoice?:string; archifyCli:string; }
export function loadConfig(env:NodeJS.ProcessEnv=process.env):AppConfig{return{aiProvider:env.AI_PROVIDER??'openai',aiModel:env.AI_MODEL??'gpt-5.6-luna',ttsProvider:env.TTS_PROVIDER??'browser',ttsVoice:env.TTS_VOICE,archifyCli:env.ARCHIFY_CLI_PATH??'archify'}}
