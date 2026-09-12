import type { IAM, Scene, Story, TimelineEvent } from '@interactive-archify/core';
export interface RuntimeBridge { focusNode(id:string):void; focusNodes(ids:string[]):void; highlightNode(id:string):void; highlightEdge(id:string):void; showLayer(id:string):void; hideLayer(id:string):void; animateEdge(id:string):void; pulseNode(id:string):void; expandNode(id:string):void; collapseNode(id:string):void; fitView(ids?:string[]):void; resetView():void; }
export interface NarrationBridge { speak(text:string):Promise<void>|void; stop():void; pause?():void; resume?():void; }
export class StoryRuntime{
  private timers:ReturnType<typeof setTimeout>[]=[]; private story?:Story; private scenes:Scene[]=[]; private index=0; private playing=false;
  constructor(private iam:IAM,private bridge:RuntimeBridge,private narration?:NarrationBridge,private onChange?:(state:{index:number;scene?:Scene;playing:boolean})=>void){}
  load(story:Story){this.stop();this.story=story; const ids=story.chapters.flatMap(c=>c.sceneIds);this.scenes=ids.map(id=>this.iam.scenes.find(s=>s.id===id)).filter(Boolean) as Scene[];this.index=0;this.emit();}
  current(){return this.scenes[this.index]}
  async play(){if(!this.current())return;this.playing=true;this.emit(); await this.run(this.current()!); if(this.playing&&this.index<this.scenes.length-1){this.index++;await this.play()}else{this.playing=false;this.emit();}}
  pause(){this.playing=false;this.clear();this.narration?.pause?.();this.emit()}
  resume(){this.narration?.resume?.();return this.play()}
  stop(){this.playing=false;this.clear();this.narration?.stop();this.index=0;this.emit()}
  next(){this.pause();if(this.index<this.scenes.length-1)this.index++;return this.showCurrent()}
  previous(){this.pause();if(this.index>0)this.index--;return this.showCurrent()}
  seek(i:number){this.pause();this.index=Math.max(0,Math.min(this.scenes.length-1,i));return this.showCurrent()}
  private clear(){for(const t of this.timers)clearTimeout(t);this.timers=[]}
  private emit(){this.onChange?.({index:this.index,scene:this.current(),playing:this.playing})}
  private showCurrent(){const s=this.current();if(s)this.applyScene(s,false);this.emit()}
  private async run(s:Scene){this.applyScene(s,true); const n=s.narrationId?this.iam.narrations.find(x=>x.id===s.narrationId):undefined; if(n)this.narration?.speak(n.text); await new Promise<void>(resolve=>this.timers.push(setTimeout(resolve,s.durationMs??n?.durationMs??4000)));}
  private applyScene(s:Scene,schedule:boolean){for(const l of this.iam.layers)this.bridge.hideLayer(l.id);for(const l of s.visibleLayers??[])this.bridge.showLayer(l);if(s.focus?.length)this.bridge.focusNodes(s.focus);for(const e of s.highlightEdges??[])this.bridge.highlightEdge(e);if(s.camera?.mode==='fit-focus')this.bridge.fitView(s.focus); else if(s.camera?.mode==='fit-all')this.bridge.fitView(); for(const ev of s.events??[]){if(schedule)this.timers.push(setTimeout(()=>this.applyEvent(ev),ev.at));else if(ev.at===0)this.applyEvent(ev)}}
  private applyEvent(e:TimelineEvent){for(const t of e.targets??[]){switch(e.action){case'highlight':this.bridge.highlightNode(t);break;case'animate-edge':this.bridge.animateEdge(t);break;case'pulse-node':this.bridge.pulseNode(t);break;case'expand':this.bridge.expandNode(t);break;case'collapse':this.bridge.collapseNode(t);break;case'layer-show':this.bridge.showLayer(t);break;case'layer-hide':this.bridge.hideLayer(t);break;case'focus':this.bridge.focusNode(t);break;}}}
}
