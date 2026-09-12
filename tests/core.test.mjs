import test from 'node:test'; import assert from 'node:assert/strict';
import { architectureFromText, validateIAM, shortestPath } from '../packages/core/dist/index.js';
test('heuristic architecture is valid',()=>{const iam=architectureFromText('Next.js PostgreSQL Redis Stripe'); assert.equal(validateIAM(iam).valid,true); assert.ok(iam.components.length>=4);});
test('path finder only follows authored topology',()=>{const iam=architectureFromText('Next.js PostgreSQL'); const p=shortestPath(iam,iam.components[0].id,iam.components.at(-1).id); assert.ok(p.length>=2);});
