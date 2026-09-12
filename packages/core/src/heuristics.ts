import { createEmptyIAM } from './defaults.js'; import type { ComponentType, IAM, Layer } from './types.js';
const techMap:Array<[RegExp,string,ComponentType,string]> = [
  [/next(\.js)?/i,'Next.js','frontend','experience'],[/react/i,'React','frontend','experience'],[/vue/i,'Vue','frontend','experience'],[/angular/i,'Angular','frontend','experience'],
  [/fastapi/i,'FastAPI','api','application'],[/express/i,'Express','api','application'],[/nestjs/i,'NestJS','api','application'],[/spring/i,'Spring','service','services'],
  [/postgres|postgresql/i,'PostgreSQL','database','data'],[/mysql/i,'MySQL','database','data'],[/mongo/i,'MongoDB','database','data'],[/redis/i,'Redis','cache','data'],
  [/kafka/i,'Kafka','event-bus','messaging'],[/rabbitmq|amqp/i,'RabbitMQ','queue','messaging'],[/stripe/i,'Stripe','external-service','context'],[/auth0/i,'Auth0','identity-provider','security'],
  [/aws/i,'AWS','cloud-service','infrastructure'],[/azure/i,'Azure','cloud-service','infrastructure'],[/gcp|google cloud/i,'Google Cloud','cloud-service','infrastructure'],[/prometheus/i,'Prometheus','monitoring','observability'],[/grafana/i,'Grafana','monitoring','observability']
];
export function architectureFromText(text:string,name='Generated Architecture'):IAM{
  const iam=createEmptyIAM(name); iam.architecture.description=text; const matches=[] as Array<{name:string,type:ComponentType,layer:string}>;
  for(const [r,n,t,l] of techMap) if(r.test(text)) matches.push({name:n,type:t,layer:l});
  if(!matches.some(x=>x.type==='user')) matches.unshift({name:'User',type:'user',layer:'context'});
  if(matches.length===1) matches.push({name:'Application',type:'service',layer:'application'},{name:'Database',type:'database',layer:'data'});
  const seen=new Set<string>(); for(const m of matches){const id=m.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'); if(seen.has(id)) continue; seen.add(id); iam.components.push({id,name:m.name,type:m.type,layer:m.layer,technology:m.name,confidence:'hypothetical'});}
  const ordered=iam.components; for(let i=1;i<ordered.length;i++){const a=ordered[i-1]!,b=ordered[i]!; iam.relationships.push({id:`${a.id}-to-${b.id}`,source:a.id,target:b.id,protocol:b.type==='database'?'SQL':b.type==='event-bus'||b.type==='queue'?'Event':'HTTPS',confidence:'hypothetical'});}
  if(ordered.length>1) iam.flows.push({id:'primary-flow',name:'Primary Flow',confidence:'hypothetical',steps:ordered.map((c,i)=>({componentId:c.id,relationshipId:i?iam.relationships[i-1]?.id:undefined}))});
  return iam;
}
