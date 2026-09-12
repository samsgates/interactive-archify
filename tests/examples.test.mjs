import test from 'node:test'; import assert from 'node:assert/strict'; import fs from 'node:fs';
test('SaaS example has an authored flow',()=>{const x=JSON.parse(fs.readFileSync('examples/saas/architecture.iam.json','utf8'));assert.equal(x.schemaVersion,'1.0');assert.ok(x.flows[0].steps.length>=4);});
