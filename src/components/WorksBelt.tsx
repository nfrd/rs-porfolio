import { useCallback, useEffect, useRef, useState } from 'react'
import useDragScroll from '../hooks/useDragScroll'
import type { Project } from '../data/content'

interface WorksBeltProps {
  /** Repeated internally to build the loop, so pass the list once. */
  projects: Project[]
  speed?: number
}

/**
 * Copies of the list laid end to end. Scrolling is wrapped back into copy
 * BASE_COPY whenever it settles, so the copies on either side are the runway a
 * fling can cross before that happens.
 */
const COPIES = 6
const BASE_COPY = 2

/** Quiet time after the last scroll event before the belt is wrapped. */
const SETTLE_MS = 160
/** How long the belt stays put after the user lets go. */
const HOLD_AFTER_DRAG = 1200
/** Time constants for easing the belt back to its cruising speed. */
const TAU_CRUISE = 350
const TAU_COAST = 700
/** Ceiling on a flick, in px/ms, so a fast drag cannot fling the belt. */
const MAX_FLICK = 3.5

/**
 * Width of one copy of the list — the distance the belt can be shifted by
 * without the shift being visible. Returns 0 when there is not enough overflow
 * to sit in copy BASE_COPY, in which case wrapping would fight the scrollLeft
 * clamp and the belt degrades to a plain slider.
 */
function measureLoop(el: HTMLElement, count: number) {
  const kids = el.children
  if (kids.length <= count) return 0
  const loop = (kids[count] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft
  if (loop <= 0) return 0
  return el.scrollWidth - el.clientWidth >= (BASE_COPY + 1) * loop ? loop : 0
}

/** Wraps `left` into copy BASE_COPY, or clamps it when the belt cannot loop. */
function normalize(el: HTMLElement, loop: number, left: number) {
  if (!loop) return Math.max(0, Math.min(left, el.scrollWidth - el.clientWidth))
  const anchor = loop * BASE_COPY
  return anchor + ((((left - anchor) % loop) + loop) % loop)
}

export default function WorksBelt({ projects, speed = 28 }: WorksBeltProps) {
  const posRef = useRef(0)
  const velRef = useRef(0)
  const loopRef = useRef(0)
  const draggingRef = useRef(false)
  const hoverRef = useRef(false)
  const holdUntilRef = useRef(0)
  const [fine, setFine] = useState(() => window.matchMedia('(pointer: fine)').matches)

  const count = projects.length

  // Single writer for scrollLeft, shared by the mouse drag, the drift loop and
  // the wrapping below.
  const applyScroll = useCallback((el: HTMLElement, left: number) => {
    const next = normalize(el, loopRef.current, left)
    el.scrollLeft = next
    posRef.current = next
    return next
  }, [])

  const trackRef = useDragScroll<HTMLDivElement>({
    // Touch belongs to the browser. Its scrolling is smoother than anything we
    // can drive from pointer events, and on iOS the JS drag never engages at
    // all — the belt just sat there.
    mouseOnly: true,
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

    const remeasure = () => {
      loopRef.current = measureLoop(el, count)
      applyScroll(el, el.scrollLeft)
    }

    // Start inside copy BASE_COPY so the first fling has runway either way.
    loopRef.current = measureLoop(el, count)
    applyScroll(el, loopRef.current * BASE_COPY)

    let settle: ReturnType<typeof setTimeout> | undefined
    const onScroll = () => {
      clearTimeout(settle)
      // Shifting the belt mid-fling cuts iOS momentum short, so it waits for
      // the scrolling to go quiet. Both ends of the wrap show the same cards,
      // so the shift itself is invisible.
      settle = setTimeout(() => {
        if (el.dataset.dragging) return
        applyScroll(el, el.scrollLeft)
      }, SETTLE_MS)
    }
    // A finger landing stops momentum dead, which makes it another free moment
    // to wrap. The mouse is skipped: the drag records scrollLeft on pointerdown
    // and would replay any shift made underneath it.
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') applyScroll(el, el.scrollLeft)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', remeasure)

    return () => {
      clearTimeout(settle)
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', remeasure)
    }
  }, [applyScroll, count, trackRef])

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const onChange = () => setFine(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    // Only pointer-driven devices drift. On a phone the loop fights the
    // momentum of a swipe, there is no cursor to park on to stop it, and it
    // burns battery for an effect nobody asked to keep watching.
    if (!el || !fine) return

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
  }, [applyScroll, fine, speed, trackRef])

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
      {Array.from({ length: COPIES }, (_, copy) =>
        projects.map((p) => (
          // Only the first copy is real as far as assistive tech is concerned;
          // the rest exist to make the loop seamless.
          <div
            className="works-belt-item"
            key={`${copy}-${p.id}`}
            aria-hidden={copy > 0 || undefined}
          >
            <img src={p.shots[0]} alt={p.name} draggable={false} />
            <h3>{p.name}</h3>
            <span>{p.tags}</span>
          </div>
        )),
      )}
    </div>
  )
}
