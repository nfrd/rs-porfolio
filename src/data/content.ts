import noctaManor from '../assets/works/nocta-manor.png'
import noctaManor2 from '../assets/works/nocta-manor-2.avif'
import noctaManor3 from '../assets/works/nocta-manor-3.avif'
import noctaManor4 from '../assets/works/nocta-manor-4.avif'
import cinelli from '../assets/works/cinelli.jpeg'
import cinelli2 from '../assets/works/cinelli-2.webp'
import pearledIvory from '../assets/works/pearled-ivory.png'
import pearledIvory2 from '../assets/works/pearled-ivory-2.webp'
import aritzia from '../assets/works/aritzia.jpeg'
import aritzia2 from '../assets/works/aritzia-2.jpg'

export interface Project {
  id: string
  name: string
  tags: string
  year: string
  blurb: string
  shots: string[]
}

export const projects: Project[] = [
  {
    id: 'noctamanor',
    name: 'Nocta Manor',
    tags: 'Apparel Design · Retail Concept',
    year: '2026',
    blurb:
      'A lifestyle capsule and pop-up concept built around a slower, after-hours read on performance wear.',
    shots: [noctaManor, noctaManor2, noctaManor3, noctaManor4],
  },
  {
    id: 'cinelli',
    name: 'Cinelli',
    tags: 'Apparel Design · Brand Partnership',
    year: '2025',
    blurb:
      'A road-cycling apparel collection bridging track heritage with modern performance fabrics.',
    shots: [cinelli, cinelli2],
  },
  {
    id: 'pearledivory',
    name: 'Pearled Ivory',
    tags: 'Footwear Design · Colorway System',
    year: '2025',
    blurb:
      'A limited colorway release exploring quiet luxury materials for everyday footwear.',
    shots: [pearledIvory, pearledIvory2],
  },
  {
    id: 'aritzia',
    name: 'Aritzia',
    tags: 'Brand Collaboration · Apparel Design',
    year: '2024',
    blurb:
      "A capsule collaboration bringing performance-informed silhouettes to Aritzia's ready-to-wear line.",
    shots: [aritzia, aritzia2],
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
