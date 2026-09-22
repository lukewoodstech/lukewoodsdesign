import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ACT_NAMES, ACTS, BUST, PAL, compose, idleFrame, pickAct, type ActName } from '../lib/lukeSprite'

/* The sprite is hand-typed pixel maps: these catch the typo classes —
   a ragged row, a palette key that doesn't exist, an act that throws. */

test('the portrait is a clean 48×48 grid of known colours', () => {
  assert.equal(BUST.length, 48)
  for (const row of BUST) {
    assert.equal(row.length, 48, row)
    for (const c of row) assert.ok(c === '.' || PAL[c], `unknown colour ${c}`)
  }
})

test('every frame of every act composes to real colours', () => {
  const known = new Set(Object.values(PAL))
  for (const name of Object.keys(ACTS) as ActName[]) {
    for (let t = 0; t < ACTS[name].len; t++) {
      const paths = compose(ACTS[name].frame(t))
      assert.ok(paths.length > 5, `${name}@${t} drew almost nothing`)
      for (const [fill] of paths) assert.ok(known.has(fill), `${name}@${t}: unknown colour ${fill}`)
    }
  }
})

test('idle still draws a face, blinking on cue', () => {
  for (let t = 0; t < 80; t++) assert.ok(compose(idleFrame(t, 20)).length > 5)
  assert.equal(idleFrame(20, 20).eyes, 'closed')
  assert.equal(idleFrame(7, 20).eyes, undefined)
})

test('the next act is random but never a repeat', () => {
  for (const prev of [...ACT_NAMES, null] as (ActName | null)[]) {
    for (const r of [0, 0.25, 0.5, 0.99, 1]) {
      const next = pickAct(prev, r)
      assert.ok(ACT_NAMES.includes(next), `picked ${next}`)
      if (prev) assert.notEqual(next, prev)
    }
  }
})
