import { useCallback, useEffect, useRef } from 'react'
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
/** Time constants for easing the belt up to speed and back down to a stop. */
const TAU_CRUISE = 350
const TAU_COAST = 700
/** Ceiling on a flick, in px/ms, so a fast drag cannot fling the belt. */
const MAX_FLICK = 3.5
/** Below this, in px/ms, a coast is over and the frame loop shuts down. */
const MIN_VEL = 0.0005
/** scrollLeft moving further than this behind our back is the user, not us. */
const USER_SCROLL = 4

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
  /**
   * The belt cruises on its own until the first deliberate move, then stays
   * where it is left. Coming back on its own would take the belt out from under
   * whoever just put it where they wanted it.
   */
  const autoRef = useRef(true)
  const runningRef = useRef(false)
  const rafRef = useRef(0)
  const lastRef = useRef(0)
  const cruiseRef = useRef(speed / 1000)
  cruiseRef.current = speed / 1000

  const count = projects.length

  // Single writer for scrollLeft, shared by the mouse drag, the frame loop and
  // the wrapping below.
  const applyScroll = useCallback((el: HTMLElement, left: number) => {
    const next = normalize(el, loopRef.current, left)
    el.scrollLeft = next
    posRef.current = next
    return next
  }, [])

  const stopAuto = useCallback(() => {
    autoRef.current = false
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
      stopAuto()
    },
    onEnd: (velocity) => {
      draggingRef.current = false
      // Pointer velocity is rightward-positive; scrollLeft runs the other way.
      velRef.current = Math.max(-MAX_FLICK, Math.min(MAX_FLICK, -velocity))
      // Nothing is cruising any more, so this run is purely the flick coasting
      // to a stop.
      ensureFrame()
    },
  })

  /**
   * One loop for both jobs: easing the belt up to its cruising speed, and
   * letting a released drag coast down to nothing. It shuts itself off as soon
   * as there is no motion left to render.
   */
  const frame: FrameRequestCallback = useCallback(
    (t) => {
      const el = trackRef.current
      // The drag writes scrollLeft itself; there is nothing to animate until it
      // lets go, and onEnd starts the loop again.
      if (!el || draggingRef.current) {
        runningRef.current = false
        return
      }
      const dt = Math.min(64, t - lastRef.current)
      lastRef.current = t

      const target = autoRef.current && !hoverRef.current ? cruiseRef.current : 0
      const tau = target === 0 ? TAU_COAST : TAU_CRUISE
      velRef.current += (target - velRef.current) * (1 - Math.exp(-dt / tau))
      if (target === 0 && Math.abs(velRef.current) < MIN_VEL) {
        velRef.current = 0
        runningRef.current = false
        return
      }
      applyScroll(el, posRef.current + velRef.current * dt)
      rafRef.current = requestAnimationFrame(frame)
    },
    [applyScroll, trackRef],
  )

  const ensureFrame = useCallback(() => {
    if (runningRef.current) return
    runningRef.current = true
    lastRef.current = performance.now()
    rafRef.current = requestAnimationFrame(frame)
  }, [frame])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

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
    ensureFrame()

    let settle: ReturnType<typeof setTimeout> | undefined
    const onScroll = () => {
      // Anything that moved the belt further than our own frame did is the
      // user — a swipe, the wheel, an arrow — so the cruise is over and the
      // new position is now the truth.
      if (!draggingRef.current && Math.abs(el.scrollLeft - posRef.current) > USER_SCROLL) {
        stopAuto()
        velRef.current = 0
        posRef.current = el.scrollLeft
      }
      clearTimeout(settle)
      // Shifting the belt mid-fling cuts iOS momentum short, so it waits for
      // the scrolling to go quiet. Both ends of the wrap show the same cards,
      // so the shift itself is invisible.
      settle = setTimeout(() => {
        if (el.dataset.dragging) return
        applyScroll(el, el.scrollLeft)
      }, SETTLE_MS)
    }
    // A finger landing takes the belt over, and the momentum it kills makes
    // this a free moment to wrap. The mouse is skipped on both counts: the drag
    // records scrollLeft on pointerdown and would replay any shift made
    // underneath it, and a plain click should not end the cruise.
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return
      stopAuto()
      velRef.current = 0
      applyScroll(el, el.scrollLeft)
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
  }, [applyScroll, count, ensureFrame, stopAuto, trackRef])

  const setHover = (value: boolean) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    hoverRef.current = value
    if (!value) ensureFrame()
  }

  /** Steps one card along. The scroll event that follows does the rest. */
  const nudge = (dir: number) => () => {
    const el = trackRef.current
    if (!el) return
    stopAuto()
    velRef.current = 0
    const kids = el.children
    const card =
      kids.length > 1
        ? (kids[1] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft
        : el.clientWidth
    el.scrollBy({ left: dir * card, behavior: 'smooth' })
  }

  return (
    <div className="works-belt-frame">
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
      <button
        type="button"
        aria-label="Previous project"
        className="works-belt-nav prev"
        onClick={nudge(-1)}
      >
        ←
      </button>
      <button
        type="button"
        aria-label="Next project"
        className="works-belt-nav next"
        onClick={nudge(1)}
      >
        →
      </button>
    </div>
  )
}
