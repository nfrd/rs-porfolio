import { useEffect, useRef } from 'react'

const DEFAULT_THRESHOLD = 4
/** A pointer that sat still this long before release is a stop, not a flick. */
const STALE_MS = 80

export interface DragScrollOptions {
  /**
   * Writes `left` onto the track and returns the value actually applied, so the
   * caller can wrap or clamp. Defaults to a plain `scrollLeft` assignment.
   */
  apply?: (el: HTMLElement, left: number) => number
  /** Runs once the pointer has travelled past the threshold. */
  onStart?: () => void
  /** Runs when the gesture ends. `velocity` is pointer px/ms, positive = rightward. */
  onEnd?: (velocity: number) => void
  /** Leave touch and pen to the browser's own scrolling. */
  mouseOnly?: boolean
  threshold?: number
}

/**
 * Drag-to-scroll for an overflow container. Returns the ref to put on the track.
 *
 * While a drag is live the element carries `data-dragging="true"` so CSS can
 * swap the cursor and switch scroll snapping off.
 */
export default function useDragScroll<T extends HTMLElement>(options: DragScrollOptions = {}) {
  const ref = useRef<T>(null)
  const opts = useRef(options)
  opts.current = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let drag: {
      id: number
      startX: number
      startLeft: number
      lastX: number
      lastT: number
      velocity: number
      active: boolean
    } | null = null
    let suppressClick = false

    const write = (left: number) => {
      const applied = opts.current.apply
        ? opts.current.apply(el, left)
        : ((el.scrollLeft = left), el.scrollLeft)
      // Wrapped or clamped: rebase so the next move keeps tracking the pointer
      // instead of replaying the difference. Sub-pixel noise is not a rebase.
      if (drag && Math.abs(applied - left) > 1) drag.startLeft += applied - left
    }

    const detach = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }

    const end = (velocity: number) => {
      const wasActive = drag?.active ?? false
      drag = null
      detach()
      delete el.dataset.dragging
      if (!wasActive) return
      suppressClick = true
      opts.current.onEnd?.(velocity)
    }

    const onDown = (e: PointerEvent) => {
      if (opts.current.mouseOnly && e.pointerType !== 'mouse') return
      if (e.pointerType === 'mouse' && e.button !== 0) return
      if (drag) end(0)
      suppressClick = false
      drag = {
        id: e.pointerId,
        startX: e.clientX,
        startLeft: el.scrollLeft,
        lastX: e.clientX,
        lastT: e.timeStamp,
        velocity: 0,
        active: false,
      }
      // Stops the native image-drag ghost and text selection, which otherwise
      // swallow the gesture halfway through. Click still fires.
      if (e.pointerType === 'mouse') e.preventDefault()
      try {
        el.setPointerCapture(e.pointerId)
      } catch {
        // capture is a nicety; the window listeners below carry the drag
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
    }

    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      if (!drag.active) {
        if (Math.abs(e.clientX - drag.startX) < (opts.current.threshold ?? DEFAULT_THRESHOLD)) return
        drag.active = true
        // Re-anchor at the moment of engagement so the track does not jump.
        drag.startX = e.clientX
        drag.startLeft = el.scrollLeft
        el.dataset.dragging = 'true'
        opts.current.onStart?.()
      }
      const dt = Math.max(1, e.timeStamp - drag.lastT)
      drag.velocity = drag.velocity * 0.7 + ((e.clientX - drag.lastX) / dt) * 0.3
      drag.lastX = e.clientX
      drag.lastT = e.timeStamp
      write(drag.startLeft - (e.clientX - drag.startX))
    }

    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      const stale = e.type === 'pointercancel' || e.timeStamp - drag.lastT > STALE_MS
      const velocity = stale ? 0 : drag.velocity
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {
        // already released
      }
      end(velocity)
    }

    // Capture loss (another element grabs the pointer, the tab is switched away)
    // used to leave the drag stuck on, so every exit ends it.
    const onLostCapture = () => {
      if (drag) end(0)
    }
    const onBlur = () => {
      if (drag) end(0)
    }
    const onDragStart = (e: Event) => e.preventDefault()
    const onClick = (e: MouseEvent) => {
      if (!suppressClick) return
      suppressClick = false
      e.preventDefault()
      e.stopPropagation()
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('lostpointercapture', onLostCapture)
    el.addEventListener('dragstart', onDragStart)
    el.addEventListener('click', onClick, true)
    window.addEventListener('blur', onBlur)

    return () => {
      detach()
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('lostpointercapture', onLostCapture)
      el.removeEventListener('dragstart', onDragStart)
      el.removeEventListener('click', onClick, true)
      window.removeEventListener('blur', onBlur)
      delete el.dataset.dragging
    }
  }, [])

  return ref
}
