import kithBmw1 from '../assets/works/kith-bmw/IMG_3423.JPEG'
import kithBmw2 from '../assets/works/kith-bmw/IMG_3425.JPEG'
import kithBmw3 from '../assets/works/kith-bmw/IMG_3426.JPEG'
import kithBmw4 from '../assets/works/kith-bmw/IMG_3427.JPEG'
import kithCinelli1 from '../assets/works/kith-cinelli/IMG_3428.JPEG'
import kithCinelli2 from '../assets/works/kith-cinelli/IMG_3429.JPEG'
import kithCinelli3 from '../assets/works/kith-cinelli/IMG_3430.JPEG'
import kithCinelli4 from '../assets/works/kith-cinelli/IMG_3432.JPEG'
import kithOn1 from '../assets/works/kith-on/IMG_3436.JPEG'
import kithOn2 from '../assets/works/kith-on/IMG_3437.JPEG'
import kithOn3 from '../assets/works/kith-on/IMG_3438.JPEG'
import kithOn4 from '../assets/works/kith-on/IMG_3440.JPEG'
import noctaManor1 from '../assets/works/nocta-manor/IMG_3446.JPG'
import noctaManor2 from '../assets/works/nocta-manor/IMG_3447.JPG'
import noctaManor3 from '../assets/works/nocta-manor/IMG_3448.JPG'
import noctaManor4 from '../assets/works/nocta-manor/IMG_3449.JPG'
import kithMessiAdidas1 from '../assets/works/kith-messi-adidas/IMG_3455.JPG'
import kithMessiAdidas2 from '../assets/works/kith-messi-adidas/IMG_3456.JPG'
import kithMessiAdidas3 from '../assets/works/kith-messi-adidas/IMG_3457.JPG'
import kithMessiAdidas4 from '../assets/works/kith-messi-adidas/IMG_3458.JPG'

export interface Project {
  id: string
  name: string
  shots: string[]
}

export const projects: Project[] = [
  {
    id: 'kith-bmw',
    name: 'Kith x BMW',
    shots: [kithBmw1, kithBmw2, kithBmw3, kithBmw4],
  },
  {
    id: 'kith-cinelli',
    name: 'Kith x Cinelli',
    shots: [kithCinelli1, kithCinelli2, kithCinelli3, kithCinelli4],
  },
  {
    id: 'kith-on-running',
    name: 'Kith x On Running',
    shots: [kithOn1, kithOn2, kithOn3, kithOn4],
  },
  {
    id: 'nocta-manor',
    name: 'Nocta Manor',
    shots: [noctaManor1, noctaManor2, noctaManor3, noctaManor4],
  },
  {
    id: 'kith-messi-adidas',
    name: 'Kith x Messi x Adidas',
    shots: [kithMessiAdidas1, kithMessiAdidas2, kithMessiAdidas3, kithMessiAdidas4],
  },
]

export interface Capability {
  num: string
  title: string
  copy: string
}

export const capabilitiesFull: Capability[] = [
  {
    num: '01',
    title: 'Footwear & Apparel Design',
    copy: 'Silhouettes, colorways, and tech packs a factory can actually run with.',
  },
  {
    num: '02',
    title: 'Brand & Business Strategy',
    copy: 'Positioning, pricing, and go-to-market plans built for the shelf, not the deck.',
  },
  {
    num: '03',
    title: 'Athlete & Entertainment Partnerships',
    copy: 'Seeding, sponsorships, and the relationships that get product seen.',
  },
  {
    num: '04',
    title: 'Culture Curation',
    copy: 'Reading a scene early and building the platform that lets a brand belong in it.',
  },
]

export interface ExperienceItem {
  range: string
  role: string
}

export const experience: ExperienceItem[] = [
  { range: '2023 — Now', role: 'Independent — Design & Strategy Consultant' },
  { range: '2020 — 2023', role: 'Northstate FC — Head of Product & Partnerships' },
  { range: '2018 — 2020', role: 'Gravel & Bone — Senior Footwear Designer' },
  { range: '2016 — 2018', role: 'Studio Form — Footwear Designer' },
]
