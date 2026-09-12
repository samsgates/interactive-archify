export type Confidence = 'verified' | 'inferred' | 'hypothetical' | 'unknown';
export type ComponentType =
  | 'user' | 'browser' | 'frontend' | 'mobile' | 'api' | 'gateway' | 'service' | 'worker'
  | 'function' | 'database' | 'cache' | 'queue' | 'event-bus' | 'storage' | 'external-service'
  | 'identity-provider' | 'monitoring' | 'container' | 'cluster' | 'network' | 'security' | 'cloud-service' | 'unknown';

export interface ProjectMeta { id: string; name: string; description?: string; sourceRevision?: string; createdAt?: string; updatedAt?: string; }
export interface ArchitectureMeta { title: string; description?: string; persona?: string; explanationLevel?: 'quick'|'standard'|'detailed'|'deep'; }
export interface Position { x: number; y: number; }
export interface Component {
  id: string; name: string; type: ComponentType; layer: string; technology?: string; description?: string;
  confidence: Confidence; tags?: string[]; evidenceIds?: string[]; parentId?: string; position?: Position;
  metadata?: Record<string, string | number | boolean | null>;
}
export interface Relationship {
  id: string; source: string; target: string; protocol?: string; direction?: 'request-response'|'one-way'|'bidirectional';
  label?: string; confidence: Confidence; evidenceIds?: string[]; metadata?: Record<string, string | number | boolean | null>;
}
export interface Boundary { id: string; name: string; kind: 'trust'|'network'|'deployment'|'organization'|'custom'; componentIds: string[]; description?: string; confidence?: Confidence; }
export interface Layer { id: string; name: string; order: number; description?: string; visibleByDefault?: boolean; }
export interface FlowStep { componentId: string; relationshipId?: string; note?: string; }
export interface RuntimeFlow { id: string; name: string; description?: string; steps: FlowStep[]; confidence: Confidence; }
export type TimelineActionType = 'show'|'hide'|'focus'|'blur'|'highlight'|'unhighlight'|'animate-edge'|'pulse-node'|'expand'|'collapse'|'camera-fit'|'camera-pan'|'camera-zoom'|'layer-show'|'layer-hide'|'annotation-show'|'annotation-hide'|'audio-play'|'audio-pause';
export interface TimelineEvent { at: number; action: TimelineActionType; targets?: string[]; value?: string | number | boolean; }
export interface Scene { id: string; title?: string; focus?: string[]; highlightEdges?: string[]; visibleLayers?: string[]; camera?: { mode: 'fit-all'|'fit-focus'|'manual'; x?: number; y?: number; zoom?: number }; events?: TimelineEvent[]; narrationId?: string; durationMs?: number; }
export interface StoryChapter { id: string; title: string; sceneIds: string[]; description?: string; }
export interface Story { id: string; title: string; description?: string; chapters: StoryChapter[]; persona?: string; }
export interface Narration { id: string; sceneId: string; text: string; durationMs?: number; audioUrl?: string; timestamps?: Array<{word:string;startMs:number;endMs:number}>; }
export interface Evidence { id: string; type: 'source'|'config'|'manifest'|'infrastructure'|'user-input'; file?: string; lineStart?: number; lineEnd?: number; revision?: string; excerpt?: string; confidence: Confidence; }
export interface ReviewFinding { id: string; category: 'security'|'reliability'|'availability'|'scalability'|'observability'|'performance'|'data-consistency'|'coupling'|'failure-isolation'|'dependency'|'other'; severity: 'critical'|'high'|'medium'|'low'|'info'; title: string; description: string; targets: string[]; confidence: Confidence; recommendation?: string; }
export interface Annotation { id: string; targetId?: string; text: string; kind?: 'note'|'warning'|'info'; }
export interface ArchitectureView { id: string; name: string; visibleLayers?: string[]; focus?: string[]; filters?: string[]; }
export interface IAM {
  schemaVersion: '1.0';
  project: ProjectMeta;
  architecture: ArchitectureMeta;
  layers: Layer[];
  components: Component[];
  relationships: Relationship[];
  boundaries: Boundary[];
  flows: RuntimeFlow[];
  scenes: Scene[];
  stories: Story[];
  narrations: Narration[];
  evidence: Evidence[];
  reviews: ReviewFinding[];
  annotations: Annotation[];
  views: ArchitectureView[];
}
