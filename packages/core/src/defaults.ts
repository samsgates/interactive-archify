import type { IAM, Layer } from './types.js';

export const DEFAULT_LAYERS: Layer[] = [
  { id: 'executive', name: 'Executive', order: 0, visibleByDefault: true },
  { id: 'context', name: 'System Context', order: 1, visibleByDefault: true },
  { id: 'experience', name: 'Experience', order: 2, visibleByDefault: true },
  { id: 'application', name: 'Application', order: 3, visibleByDefault: true },
  { id: 'services', name: 'Services', order: 4, visibleByDefault: true },
  { id: 'data', name: 'Data', order: 5, visibleByDefault: true },
  { id: 'messaging', name: 'Messaging', order: 6, visibleByDefault: true },
  { id: 'infrastructure', name: 'Infrastructure', order: 7, visibleByDefault: false },
  { id: 'security', name: 'Security', order: 8, visibleByDefault: false },
  { id: 'observability', name: 'Observability', order: 9, visibleByDefault: false },
  { id: 'evidence', name: 'Source Evidence', order: 10, visibleByDefault: false }
];

export function createEmptyIAM(name = 'Untitled Architecture'): IAM {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'architecture';
  return {
    schemaVersion: '1.0',
    project: { id, name, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    architecture: { title: name, explanationLevel: 'standard' },
    layers: DEFAULT_LAYERS.map(x => ({...x})), components: [], relationships: [], boundaries: [], flows: [], scenes: [], stories: [], narrations: [], evidence: [], reviews: [], annotations: [], views: []
  };
}
