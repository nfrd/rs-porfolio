import { useEffect, useRef } from 'react'
import useDragScroll from '../hooks/useDragScroll'
import type { Project } from '../data/content'

interface WorksBeltProps {
  projects: Project[]
  speed?: number
}

/** How long the belt stays put after the user lets go. */
const HOLD_AFTER_DRAG = 1200
/** Time constants for easing the belt back to its cruising speed. */
const TAU_CRUISE = 350
const TAU_COAST = 700
/** Ceiling on a flick, in px/ms, so a fast swipe cannot fling the belt. */
const MAX_FLICK = 3.5

/**
 * Width of one copy of the (doubled) project list — the distance the belt can
 * travel before it can be wrapped back seamlessly. Returns 0 when a single copy
 * does not overflow the viewport, in which case wrapping would fight scrollLeft
 * clamping and the belt degrades to a plain slider.
 */
function loopWidth(el: HTMLElement) {
  const kids = el.children
  if (kids.length < 2) return 0
  const half =
    (kids[Math.floor(kids.length / 2)] as HTMLElement).offsetLeft -
    (kids[0] as HTMLElement).offsetLeft
  return half > 0 && el.scrollWidth - el.clientWidth >= half ? half : 0
}

export default function WorksBelt({ projects, speed = 28 }: WorksBeltProps) {
  const posRef = useRef(0)
  const velRef = useRef(0)
  const draggingRef = useRef(false)
  const hoverRef = useRef(false)
  const holdUntilRef = useRef(0)

  // Single writer for scrollLeft, shared by the drag and the auto-scroll loop.
  const applyScroll = (el: HTMLElement, left: number) => {
    const loop = loopWidth(el)
    const next = loop
      ? ((left % loop) + loop) % loop
      : Math.max(0, Math.min(left, el.scrollWidth - el.clientWidth))
    el.scrollLeft = next
    posRef.current = next
    return next
  }

  const trackRef = useDragScroll<HTMLDivElement>({
    apply: applyScroll,
    onStart: () => {
      draggingRef.current = true
      velRef.current = 0
    },
    onEnd: (velocity) => {
      draggingRef.current = false
      // Pointer velocity is rightward-positive; scrollLeft runs the other way.
      velRef.current = Math.max(-MAX_FLICK, Math.min(MAX_FLICK, -velocity))
      holdUntilRef.current = performance.now() + HOLD_AFTER_DRAG
    },
  })

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const base = speed / 1000
    let last = performance.now()
    let raf = requestAnimationFrame(function frame(t) {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(64, t - last)
      last = t

      // The drag owns scrollLeft while it is live.
      if (draggingRef.current) {
        posRef.current = el.scrollLeft
        velRef.current = 0
        return
      }

      const coasting = t < holdUntilRef.current
      const target = coasting || hoverRef.current ? 0 : base
      const tau = coasting ? TAU_COAST : TAU_CRUISE
      velRef.current += (target - velRef.current) * (1 - Math.exp(-dt / tau))
      if (target === 0 && Math.abs(velRef.current) < 0.0005) {
        velRef.current = 0
        return
      }
      applyScroll(el, posRef.current + velRef.current * dt)
    })

    // Trackpad / wheel scrolling moves the belt behind our back: adopt the new
    // position instead of yanking it back on the next frame.
    const onScroll = () => {
      if (draggingRef.current) return
      if (Math.abs(el.scrollLeft - posRef.current) <= 2) return
      posRef.current = el.scrollLeft
      velRef.current = 0
      holdUntilRef.current = performance.now() + HOLD_AFTER_DRAG
    }
    el.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', onScroll)
    }
  }, [speed, trackRef])

  const setHover = (value: boolean) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    hoverRef.current = value
  }

  return (
    <div
      className="works-belt"
      ref={trackRef}
      onPointerEnter={setHover(true)}
      onPointerLeave={setHover(false)}
    >
      {projects.map((p, i) => (
        <div className="works-belt-item" key={`${p.id}-${i}`}>
          <img src={p.shots[0]} alt={p.name} draggable={false} />
          <h3>{p.name}</h3>
          <span>{p.tags}</span>
        </div>
      ))}
    </div>
  )
}
