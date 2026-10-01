import { useEffect, useRef, useState } from 'react'

/**
 * Reveal — wraps any section and fades it in when scrolled into view.
 *
 * Fixes:
 * 1. Uses CSS classes instead of inline styles so nothing fights specificity.
 * 2. Waits one rAF after mount before observing — ensures the element is
 *    fully painted before the IntersectionObserver snapshot is taken.
 *    This is what broke on mobile / route-change: the observer fired
 *    immediately while the element was still off-screen during hydration,
 *    got "not intersecting", and never re-fired.
 * 3. rootMargin: '0px' + threshold: 0 — fires as soon as even 1px is visible.
 *    The previous tight threshold caused misses on small mobile viewports.
 * 4. If the element is already in the viewport on mount (e.g. top of page),
 *    it becomes visible immediately without waiting for a scroll event.
 */

export default function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // One rAF ensures the browser has painted the element into its
    // final position before we take an intersection snapshot.
    let rafId = requestAnimationFrame(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        },
        {
          threshold: 0,           // fire as soon as 1px is visible
          rootMargin: '0px 0px -30px 0px', // small bottom offset — natural feel
        }
      )

      observer.observe(el)

      // Cleanup
      rafId = null
      return () => observer.disconnect()
    })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(40px)',
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
