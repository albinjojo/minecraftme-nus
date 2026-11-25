import {test} from 'node:test';import assert from 'node:assert/strict';
import {isBlocked,groundHeight} from '../src/player/collision.ts';
test('finite boundaries prevent leaving the garden',()=>{assert.equal(isBlocked(18.1,0,1.72,[]),true);assert.equal(isBlocked(0,-22.1,1.72,[]),true);assert.equal(isBlocked(17.7,21.7,1.72,[]),false);});
test('player footprint stops at trunk and slides past outside bounds',()=>{const trunk={min:{x:2,y:0,z:2},max:{x:3,y:5,z:3}};assert.equal(isBlocked(1.8,2.5,1.72,[trunk]),true);assert.equal(isBlocked(1.6,2.5,1.72,[trunk]),false);});
test('pond banks stop entry while bridge corridor stays open',()=>{const pond=[{min:{x:-7,y:0,z:-4.5},max:{x:-1.9,y:2,z:3.5}},{min:{x:1.9,y:0,z:-4.5},max:{x:7,y:2,z:3.5}}];assert.equal(isBlocked(4,0,1.72,pond),true);assert.equal(isBlocked(0,0,2,pond),false);});
test('bridge height follows its arch and outside ground is level',()=>{assert.ok(groundHeight(0,-.5)>.8);assert.equal(groundHeight(4,0),0);assert.equal(groundHeight(0,10),0);});
