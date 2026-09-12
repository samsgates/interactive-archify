import test from 'node:test'; import assert from 'node:assert/strict'; import {architectureFromText,validateIAM,shortestPath} from './index.js';
test('heuristic generation validates',()=>{const x=architectureFromText('Next.js API PostgreSQL Redis');assert.equal(validateIAM(x).valid,true);});
test('shortest path returns authored path',()=>{const x=architectureFromText('Next.js PostgreSQL'); const p=shortestPath(x,x.components[0]!.id,x.components.at(-1)!.id);assert.ok(p.length>=2);});
