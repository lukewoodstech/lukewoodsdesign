/*
 * Luke AI's face: a 48×48 pixel portrait of Luke and the little acts it
 * plays (wave, type, shoot, lift, listen, yawn, sleep). Pure data and pure
 * functions — components/luke-ai/LukeSprite.tsx owns the clock and the
 * SVG; this module turns "which act, which tick" into filled pixels.
 *
 * The portrait sits on a 64×56 stage (offset OX, OY) so arms, the hoop,
 * the barbell and the music notes have somewhere to go. Every frame is
 * composed into one buffer and emitted as one <path> per colour, so a
 * frame is ~25 DOM nodes, not 2,000 rects.
 *
 * Each character in a map is a palette key; '.' is transparent.
 */

export const W = 64
export const H = 56
export const OX = 8
export const OY = 8

/* Drawn by hand from a photo of Luke: middle part, wavy hair swept back
   and flicking out at the jaw, heavy straight brows, hooded eyes, square
   jaw, charcoal hoodie. */
export const BUST = [
  '................................................',
  '..............KKKKKKKKKKKKKKKKKKKK..............',
  '...........KKKHHHHHHHHHHHHHHHHHHHHKKK...........',
  '.........KKHHHHHHHHHHHHddHHHHHHHHHHHHKK.........',
  '........KHHHHHHHHHHHHHHddHHHHHHHHHHHHHHK........',
  '.......KHHHHHHHHHHhhHHHddHHHhhHHHHHHHHHHK.......',
  '......KHHHHHHHHHhhHHHHHddHHHHHhhHHHHHHHHHK......',
  '.....KHHHHHHHHhhHHHHHHHddHHHHHHHhhHHHHHHHHK.....',
  '.....KHHHHHHHhHHHHHHHHHddHHHHHHHHHhHHHHHHHK.....',
  '.....KHHHHHHhHHHHHHHHHHddHHHHHHHHHHhHHHHHHK.....',
  '.....KHHHHHHHHHHHHHHKSSSSSSKHHHHHHHHHHHHHHK.....',
  '.....KHHHHHHHHHHHKSSSSSSSSSSSSKHHHHHHHHHHHK.....',
  '.....KHHHHHHHHHKSSSSSSSSSSSSSSSSKHHHHHHHHHK.....',
  '.....KHHHHHHHKSSSSSSSSSSSSSSSSSSSSKHHHHHHHK.....',
  '.....KHHHHHHKSSSSSSSSSSSSSSSSSSSSSSKHHHHHHK.....',
  '.....KHHHHHKSSSSSSSSSSSSSSSSSSSSSSSSKHHHHHK.....',
  '.....KHHHHKSSSSSSSSSSSSSSSSSSSSSSSSSSKHHHHK.....',
  '.....KHHHKSSBBBBBBBSSSSSSSSSSBBBBBBBSSKHHHK.....',
  '.....KHHHKSSBBBBBBBSSSSSSSSSSBBBBBBBSSKHHHK.....',
  '.....KHHHKSSSSSSSSSSSSSSSSSSSSSSSSSSSSKHHHK.....',
  '.....KHHKSSSKKKKKKKSSSSSSSSSSKKKKKKKSSSKHHK.....',
  '..KKKKSSSSSKwwwEEwwKSSSSSSSSKwwwEEwwKSSSSSKKKK..',
  '..KSsSSSSSSKwwEEEwwKSSSSSSSSKwwEEEwwKSSSSSSsSK..',
  '..KSsSSSSSSKwwEEEwwKSSSSSSSSKwwEEEwwKSSSSSSsSK..',
  '..KSsSSSSSSSKKKKKKKSSSSSSSSSSKKKKKKKSSSSSSSsSK..',
  '...KSSSbbbSSSSSSSSSSSSSSSSSSSSSSSSSSSSbbbSSSK...',
  '....KSSSbbbSSSSSSSSSSSSSSSSSSSSSSSSSSbbbSSSK....',
  '.....KSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSK.....',
  '.....KSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSK.....',
  '.....KSSSSSSSSSSSSSSSSssssSSSSSSSSSSSSSSSSK.....',
  '......KSSSSSSSSSSSSSSSssssSSSSSSSSSSSSSSSK......',
  '......KSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSK......',
  '.......KSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSK.......',
  '.......KSSSSSSSSSSSSMMMMMMMMSSSSSSSSSSSSK.......',
  '........KSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSK........',
  '.........KSSSSSSSSSSSSSSSSSSSSSSSSSSSSK.........',
  '..........KSSSSSSSSSSSSSSSSSSSSSSSSSSK..........',
  '...........KKSSSSSSSSSSSSSSSSSSSSSSKK...........',
  '.............KKKSSSSSSSSSSSSSSSSKKK.............',
  '................KKKNNNNNNNNNNKKK................',
  '..................KNNNNNNNNNNK..................',
  '..................KNNNNNNNNNNK..................',
  '.........KKKKKKKKKgNNNNNNNNNNgKKKKKKKKK.........',
  '.......KKGGGGGGGGGgNNNNNNNNNNgGGGGGGGGGKK.......',
  '......KGGGGGGGGGGGGggNNNNNNggGGGGGGGGGGGGK......',
  '.....KGGGGGGGGGGGGGGGggggggGGGGGGGGGGGGGGGK.....',
  '....KGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGK....',
  '....KGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGK....',
]

export const PAL: Record<string, string> = {
  // outline, hair
  K: '#1b1210', H: '#4b2e20', h: '#74492f', d: '#2d1a12',
  // skin, blush, stubble, neck
  S: '#efc1a0', s: '#d99e7f', t: '#b97a60', b: '#e4a992', j: '#e0b192',
  N: '#c98c6f', n: '#a8715a',
  // brows, eyes, mouth
  B: '#54463c', E: '#46291a', e: '#8a5636', w: '#fff6ec', M: '#8f5249', m: '#c48a7b',
  // hoodie
  G: '#4a4249', g: '#332d35', c: '#8d8691',
  // props: accent, ball, rim, light, metal, dark, zzz, tear, sweat
  A: '#3794ff', O: '#e0792b', o: '#9c4a17', R: '#e8452c', L: '#dcdce2',
  V: '#9a9aa6', D: '#6b6b78', z: '#d4dbe8', T: '#9fd0ff', P: '#8fd0ff',
}

export type Layer = { x: number; y: number; rows: string[] }

export type EyeKind = 'closed' | 'happy' | 'down'
export type MouthKind = 'smile' | 'yawnS' | 'yawnL' | 'o' | 'grit'

export type Frame = {
  bob?: number
  eyes?: EyeKind
  mouth?: MouthKind
  /* bust-relative: moves with the head when it bobs */
  face?: Layer[]
  /* stage-relative, drawn over the bust in order */
  layers?: Layer[]
  /* the laptop screen's light on the face, 0–1 */
  glow?: number
}

/* ── Face patches (bust coords). Eyes are 9×5 at cols 11 and 28, row 20;
   the right eye is the left one mirrored, like the portrait itself. ── */

const mirror = (rows: string[]) => rows.map((r) => [...r].reverse().join(''))

const EYE_SHAPES: Record<EyeKind, string[]> = {
  closed: ['SSSSSSSSS', 'SSSSSSSSS', 'SKKKKKKKS', 'SSSSSSSSS', 'SSSSSSSSS'],
  happy: ['SSSSSSSSS', 'SSKKKKKSS', 'SKSSSSSKS', 'SSSSSSSSS', 'SSSSSSSSS'],
  down: ['SSSSSSSSS', 'SKKKKKKKS', 'KKKKKKKKK', 'KwwEEEwwK', 'SKKKKKKKS'],
}

const EYES = Object.fromEntries(
  Object.entries(EYE_SHAPES).map(([k, l]) => [k, { l, r: mirror(l) }]),
) as Record<EyeKind, { l: string[]; r: string[] }>

const MOUTHS: Record<MouthKind, Layer> = {
  smile: { x: 18, y: 32, rows: ['SSSSSSSSSSSS', 'MSSSSSSSSSSM', 'SMMMMMMMMMMS', 'SSSSSSSSSSSS'] },
  yawnS: { x: 20, y: 32, rows: ['SSSSSSSS', 'SKKKKKKS', 'SKddddKS', 'SSKKKKSS'] },
  yawnL: { x: 20, y: 31, rows: ['SKKKKKKS', 'KddddddK', 'KdMMMMdK', 'KdMMMMdK', 'KddddddK', 'SKKKKKKS'] },
  o: { x: 21, y: 32, rows: ['SSSSSS', 'SKKKKS', 'SKddKS', 'SSKKSS'] },
  grit: { x: 19, y: 32, rows: ['SSSSSSSSSS', 'SKKKKKKKKS', 'SKLLLLLLKS', 'SKKKKKKKKS'] },
}

const TEARS: Layer[] = [
  { x: 9, y: 23, rows: ['T'] },
  { x: 38, y: 23, rows: ['T'] },
]
const SWEAT = ['.P', 'PP']

/* Headphones, traced 1px outside the hair outline so they fit the head
   they sit on; cups over the ears. Bust coords, starting one row above. */
const HEADPHONES: Layer = (() => {
  const rows = Array.from({ length: 30 }, () => Array<string>(48).fill('.'))
  const set = (x: number, r: number, c: string) => {
    if (x >= 0 && x < 48) rows[r + 1][x] = c
  }
  for (let x = 13; x <= 34; x++) set(x, -1, 'D')
  for (let x = 13; x <= 34; x++) set(x, 0, 'A')
  set(12, 0, 'D')
  set(35, 0, 'D')
  for (let r = 1; r <= 18; r++) {
    const l = BUST[r].indexOf('K')
    const rt = BUST[r].lastIndexOf('K')
    set(l - 1, r, 'A')
    set(l - 2, r, 'D')
    set(rt + 1, r, 'A')
    set(rt + 2, r, 'D')
  }
  const cup = ['.DDD.', 'DDDDD', 'DDADD', 'DDADD', 'DDADD', 'DDADD', 'DDADD', 'DDADD', 'DDDDD', '.DDD.']
  cup.forEach((row, j) => {
    for (let i = 0; i < 5; i++) {
      if (row[i] === '.') continue
      set(1 + i, 19 + j, row[i])
      set(42 + i, 19 + j, row[i])
    }
  })
  return { x: 0, y: -1, rows: rows.map((r) => r.join('')) }
})()

/* ── Props (stage coords) ── */

const OPEN_HAND = [
  '.K.K.K...',
  'KSKSKSK..',
  'KSKSKSK.K',
  'KSSSSSKKS',
  'KSSSSSSSK',
  'KSSSSSSK.',
  'KSSSSSSK.',
  '.KSSSSK..',
  '..KKKK...',
]
const FIST = ['.KKKK.', 'KSSSSK', 'KSsSsK', 'KSSSSK', '.KKKK.']
const BALL = ['..KKK..', '.KOoOK.', 'KOOoOOK', 'KoooooK', 'KOOoOOK', '.KOoOK.', '..KKK..']
const BOARD = ['KKKKKKKKKKKK', 'KLLLKKKKLLLK', 'KLLLKLLKLLLK', 'KKKKKKKKKKKK']
const RIM = ['RRRRRRRRRR', '.LKLKLKLK.', '..LKLKLK..', '...LKLK...']
const NOTE = ['..AAA', '..A.A', '..A..', '.AA..', 'AAA..', '.A...']
const Z_SMALL = ['zzzz', '..z.', '.z..', 'zzzz']
const Z_BIG = ['zzzzz', '...z.', '..z..', '.z...', 'zzzzz']

const LID = Array.from({ length: 10 }, (_, j) => {
  if (j === 0) return 'K'.repeat(36)
  const fill = (j === 1 ? 'L' : 'V').repeat(34).split('')
  if (j === 4 || j === 5) fill[16] = fill[17] = 'A'
  return 'K' + fill.join('') + 'K'
})

/* A barbell centred on row y: 2px plates at the stage edges, a 1px bar. */
const barbell = (y: number): Layer => ({
  x: 0,
  y: y - 3,
  rows: Array.from({ length: 7 }, (_, j) => {
    const mid = j === 2 ? 'K' : j === 3 ? 'V' : j === 4 ? 'K' : '.'
    return 'DD' + mid.repeat(60) + 'DD'
  }),
})

/* A hand with its sleeve running off the bottom of the stage. */
const arm = (hand: string[], x: number, y: number): Layer[] => {
  const top = y + hand.length - 1
  const w = Math.min(hand[0].length, 7)
  const sleeve = (j: number) => 'K' + (j < 2 ? 'c' : 'G').repeat(w - 2) + 'K'
  return [
    { x, y: top, rows: Array.from({ length: H - top }, (_, j) => sleeve(j)) },
    { x, y, rows: hand },
  ]
}

/* ── The acts. Each is a length in ticks and a frame for each tick. ── */

export type ActName =
  | 'wave'
  | 'computer'
  | 'basketball'
  | 'headphones'
  | 'weights'
  | 'yawn'
  | 'sleep'

type Act = { len: number; frame: (t: number) => Frame }

const BALL_PATH: [number, number][] = [
  [46, 2], [39, -1], [32, -3], [25, -4], [18, -4], [12, -3], [7, -1],
  [3, 1], [3, 4], [3, 7], [3, 12], [3, 19], [3, 27], [3, 36],
]
const SHOT_HAND = [34, 28, 22, 16, 14, 14, 14, 20, 28]
const REP = [16, 13, 9, 6, 6, 9, 13, 16]

export const ACTS: Record<ActName, Act> = {
  wave: {
    len: 24,
    frame: (t) => ({
      mouth: 'smile',
      eyes: t >= 6 && t < 14 ? 'happy' : undefined,
      layers: arm(OPEN_HAND, t % 4 < 2 ? 53 : 54, 16),
    }),
  },

  computer: {
    len: 40,
    frame: (t) => ({
      eyes: t === 20 ? 'closed' : 'down',
      mouth: t >= 30 && t < 36 ? 'smile' : undefined,
      glow: t % 8 === 0 ? 0.09 : 0.06,
      layers: [
        { x: 12, y: t % 2 ? 42 : 43, rows: FIST },
        { x: 46, y: t % 2 ? 43 : 42, rows: FIST },
        { x: 14, y: 46, rows: LID },
      ],
    }),
  },

  basketball: {
    len: 26,
    frame: (t) => {
      const layers: Layer[] = [{ x: 0, y: 0, rows: BOARD }]
      const hy = SHOT_HAND[t]
      if (hy !== undefined) layers.push(...arm(FIST, 54, hy))
      if (t <= 4) layers.push({ x: 53, y: hy - 7, rows: BALL })
      else if (BALL_PATH[t - 5]) {
        const [x, y] = BALL_PATH[t - 5]
        layers.push({ x, y, rows: BALL })
      }
      layers.push({ x: 1, y: 4, rows: RIM })
      return {
        mouth: t >= 13 && t < 24 ? 'smile' : undefined,
        eyes: t >= 14 && t < 20 ? 'happy' : undefined,
        layers,
      }
    },
  },

  headphones: {
    len: 48,
    frame: (t) => {
      const on = t >= 6
      const layers: Layer[] = []
      for (let k = 0; 6 + 6 * k < 44; k++) {
        const age = t - (6 + 6 * k)
        if (age < 0 || age >= 10) continue
        layers.push({ x: k % 2 ? 57 : 1, y: 30 - 2 * age, rows: NOTE })
      }
      return {
        bob: on && t % 4 >= 2 ? 1 : 0,
        eyes: on ? 'happy' : undefined,
        mouth: on ? 'smile' : undefined,
        face: [{ ...HEADPHONES, y: HEADPHONES.y + (on ? 0 : (t - 5) * 2) }],
        layers,
      }
    },
  },

  weights: {
    len: 24,
    frame: (t) => {
      const hy = REP[t % 8]
      const strain = hy <= 9
      return {
        eyes: strain ? 'closed' : undefined,
        mouth: strain ? 'grit' : undefined,
        face: t >= 8 ? [{ x: 41, y: 14 + (t % 8 >= 4 ? 1 : 0), rows: SWEAT }] : undefined,
        layers: [barbell(hy + 2), ...arm(FIST, 2, hy), ...arm(FIST, 56, hy)],
      }
    },
  },

  yawn: {
    len: 20,
    frame: (t) => ({
      bob: t >= 4 && t <= 10 ? -1 : 0,
      eyes: t >= 3 && t <= 14 ? 'closed' : t === 16 ? 'closed' : undefined,
      mouth: t < 3 || (t >= 12 && t <= 14) ? 'yawnS' : t <= 11 ? 'yawnL' : undefined,
      face: t >= 8 && t <= 14 ? TEARS : undefined,
    }),
  },

  sleep: {
    len: 48,
    frame: (t) => {
      const layers: Layer[] = []
      for (const s of [0, 12, 24, 36]) {
        const age = t - s
        if (age < 0 || age >= 14) continue
        layers.push({ x: 40 + (age >> 1), y: 26 - age, rows: age < 7 ? Z_SMALL : Z_BIG })
      }
      return {
        bob: t % 16 < 8 ? 0 : 1,
        eyes: 'closed',
        mouth: t % 16 >= 8 ? 'o' : undefined,
        layers,
      }
    },
  },
}

/* ── Which act comes next ── */

export type Variant = 'hero' | 'chip'

export const ACT_NAMES = Object.keys(ACTS) as ActName[]

/* Random, never the same act twice running: the loop should feel like
   catching someone mid-moment, not like a playlist on repeat. */
export function pickAct(prev: ActName | null, r: number = Math.random()): ActName {
  const pool = ACT_NAMES.filter((n) => n !== prev)
  return pool[Math.min(pool.length - 1, Math.floor(r * pool.length))]
}

/* Between acts: a still face that blinks once or twice. */
export const IDLE_MIN = 24
export const IDLE_MAX = 72

export function idleFrame(t: number, blinkAt: number): Frame {
  return { eyes: t === blinkAt || t === blinkAt + 12 ? 'closed' : undefined }
}

/* ── Compose a frame into one path per colour. ── */

export function compose(f: Frame): [string, string][] {
  const buf: (string | undefined)[] = new Array(W * H)
  const blit = (rows: string[], x: number, y: number) => {
    rows.forEach((row, j) => {
      const yy = y + j
      if (yy < 0 || yy >= H) return
      for (let i = 0; i < row.length; i++) {
        const c = row[i]
        const xx = x + i
        if (c !== '.' && xx >= 0 && xx < W) buf[yy * W + xx] = c
      }
    })
  }

  const by = OY + (f.bob ?? 0)
  blit(BUST, OX, by)
  /* A head bob upward mustn't open a gap under the hoodie. */
  for (let y = by + BUST.length; y < H; y++) blit([BUST[BUST.length - 1]], OX, y)
  if (f.eyes) {
    blit(EYES[f.eyes].l, OX + 11, by + 20)
    blit(EYES[f.eyes].r, OX + 28, by + 20)
  }
  if (f.mouth) {
    const m = MOUTHS[f.mouth]
    blit(m.rows, OX + m.x, by + m.y)
  }
  for (const l of f.face ?? []) blit(l.rows, OX + l.x, by + l.y)
  for (const l of f.layers ?? []) blit(l.rows, l.x, l.y)

  const paths = new Map<string, string>()
  for (let y = 0; y < H; y++) {
    let x = 0
    while (x < W) {
      const c = buf[y * W + x]
      if (!c) {
        x++
        continue
      }
      let w = 1
      while (x + w < W && buf[y * W + x + w] === c) w++
      paths.set(c, (paths.get(c) ?? '') + `M${x} ${y}h${w}v1h-${w}z`)
      x += w
    }
  }
  return [...paths].map(([c, d]) => [PAL[c], d])
}

/* Where the laptop's light falls: the face, not the hair. */
export const GLOW_RECT = { x: OX + 8, y: OY + 16, w: 32, h: 22 }
