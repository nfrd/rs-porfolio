import useDragScroll from '../hooks/useDragScroll'

interface ProjectShotsProps {
  shots: string[]
  alt: string
}

/** Pointer speed, px/ms, above which a release counts as a flick to the next shot. */
const FLICK = 0.35

export default function ProjectShots({ shots, alt }: ProjectShotsProps) {
  // Touch is left to native scrolling so it keeps the browser's own snapping
  // and momentum; the mouse gets the JS drag.
  const trackRef = useDragScroll<HTMLDivElement>({
    mouseOnly: true,
    onEnd: (velocity) => {
      const el = trackRef.current
      if (!el || !el.clientWidth) return
      const raw = el.scrollLeft / el.clientWidth
      if (velocity <= -FLICK) goTo(Math.ceil(raw))
      else if (velocity >= FLICK) goTo(Math.floor(raw))
      else goTo(Math.round(raw))
    },
  })

  const goTo = (index: number) => {
    const el = trackRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(index, shots.length - 1))
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' })
  }

  const step = (dir: number) => {
    const el = trackRef.current
    if (!el || !el.clientWidth) return
    goTo(Math.round(el.scrollLeft / el.clientWidth) + dir)
  }

  if (shots.length <= 1) {
    return (
      <div className="project-shots">
        <img src={shots[0]} alt={alt} />
      </div>
    )
  }

  return (
    <div className="project-shots">
      <div className="project-shots-track" ref={trackRef}>
        {shots.map((src, i) => (
          <img src={src} alt={`${alt} ${i + 1}`} key={src} draggable={false} />
        ))}
      </div>
      <button type="button" aria-label="Previous image" className="project-shots-nav prev" onClick={() => step(-1)}>
        ←
      </button>
      <button type="button" aria-label="Next image" className="project-shots-nav next" onClick={() => step(1)}>
        →
      </button>
    </div>
  )
}
