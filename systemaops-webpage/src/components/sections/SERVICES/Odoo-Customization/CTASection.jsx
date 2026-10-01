import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'

import { useNavigate } from 'react-router-dom'

const HIDE_DIST = 130
const TIP_STOP = 45

const S = {
  section: {
    padding: '120px 24px',
    position: 'relative',
    cursor: 'default',
    background: 'var(--bg-primary)',
  },

  card: {
    position: 'relative',
    overflow: 'hidden',
    maxWidth: '1300px',
    margin: 'auto',
    padding: '120px 60px',
    borderRadius: '42px',
    textAlign: 'center',

    border: '1px solid var(--border)',

    background: 'var(--accent-soft-2)',

    boxShadow:
      '0 18px 50px rgba(var(--shadow-rgb),.055)',
  },

  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',

    padding: '12px 24px',

    borderRadius: '999px',

    background: 'var(--bg-surface)',

    border: '1px solid var(--border)',

    color: 'var(--accent-primary)',

    fontFamily:
      "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",

    fontSize: '.95rem',

    fontWeight: 600,

    letterSpacing: '-.015em',

    lineHeight: 1.4,

    boxShadow:
      '0 4px 14px rgba(var(--shadow-rgb),.035)',
  },

  heading: {
    marginTop: '30px',

    fontFamily:
      "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",

    fontSize:
      'clamp(3rem, 5vw, 5.8rem)',

    fontWeight: 700,

    letterSpacing: '-.055em',

    lineHeight: 1.05,

    color: 'var(--text-primary)',

    maxWidth: '1100px',

    marginInline: 'auto',
  },

  headingSpan: {
    background:
      'linear-gradient(90deg,var(--text-primary),var(--accent-primary))',

    WebkitBackgroundClip: 'text',

    WebkitTextFillColor: 'transparent',

    backgroundClip: 'text',
  },

  sub: {
    margin: '28px auto 54px',

    maxWidth: '820px',

    color: 'var(--text-secondary)',

    fontFamily:
      "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",

    fontSize: '1.08rem',

    fontWeight: 400,

    letterSpacing: '-.015em',

    lineHeight: 1.7,

    paddingInline: '8px',
  },

  btn: {
    position: 'relative',

    zIndex: 10,

    border: 'none',

    outline: 'none',

    cursor: 'pointer',

    padding: '22px 48px',

    borderRadius: '999px',

    fontFamily:
      "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",

    fontSize: '1.08rem',

    fontWeight: 700,

    letterSpacing: '-.015em',

    lineHeight: 1.4,

    color: 'var(--text-inverse)',

    background: 'var(--accent-primary)',

    boxShadow:
      '0 12px 30px rgba(var(--accent-rgb),.16)',

    transition:
      'transform .25s ease, box-shadow .25s ease, background .25s ease',

    width: 'auto',

    maxWidth: 'none',
  },

  svg: {
    position: 'absolute',

    top: 0,
    left: 0,

    width: '100%',
    height: '100%',

    pointerEvents: 'none',

    overflow: 'visible',

    zIndex: 30,
  },
}


const CTASection = () => {
  const navigate = useNavigate()

  const sectionRef = useRef(null)
  const cardRef = useRef(null)
  const buttonRef = useRef(null)
  const rafRef = useRef(null)

  const [arrow, setArrow] = useState(null)
  const [opacity, setOpacity] = useState(0)
  const [btnHover, setBtnHover] = useState(false)


  const compute = useCallback(
    (clientX, clientY) => {
      const section = sectionRef.current
      const button = buttonRef.current

      if (!section || !button) return

      const sR =
        section.getBoundingClientRect()

      const bR =
        button.getBoundingClientRect()


      // Button center relative to section
      const bCX =
        bR.left -
        sR.left +
        bR.width / 2

      const bCY =
        bR.top -
        sR.top +
        bR.height / 2


      // Mouse position relative to section
      const mX =
        clientX - sR.left

      const mY =
        clientY - sR.top


      const dx =
        bCX - mX

      const dy =
        bCY - mY

      const dist =
        Math.hypot(dx, dy)


      // Smooth arrow fade
      const fade =
        Math.min(
          1,
          Math.max(
            0,
            (dist - HIDE_DIST) / 80
          )
        )

      setOpacity(fade)


      // Hide arrow when mouse is close to button
      if (dist < HIDE_DIST) {
        setArrow(null)
        return
      }


      const ux =
        dx / dist

      const uy =
        dy / dist


      const x1 = mX
      const y1 = mY


      const x2 =
        bCX - ux * TIP_STOP

      const y2 =
        bCY - uy * TIP_STOP


      const bow =
        Math.min(
          dist * 0.18,
          90
        )


      const ctrlX =
        (x1 + x2) / 2 +
        (-uy) * bow

      const ctrlY =
        (y1 + y2) / 2 +
        ux * bow


      const angle =
        Math.atan2(
          y2 - ctrlY,
          x2 - ctrlX
        ) *
        (180 / Math.PI)


      setArrow({
        d:
          `M${x1} ${y1} ` +
          `Q${ctrlX} ${ctrlY} ${x2} ${y2}`,

        x2,
        y2,
        angle,
      })
    },
    []
  )


  useEffect(() => {
    const card =
      cardRef.current

    if (!card) return


    const onMove = ({
      clientX,
      clientY,
    }) => {

      if (rafRef.current) {
        cancelAnimationFrame(
          rafRef.current
        )
      }

      rafRef.current =
        requestAnimationFrame(() =>
          compute(
            clientX,
            clientY
          )
        )
    }


    const onLeave = () => {
      setArrow(null)
      setOpacity(0)
    }


    card.addEventListener(
      'mousemove',
      onMove
    )

    card.addEventListener(
      'mouseleave',
      onLeave
    )


    return () => {

      card.removeEventListener(
        'mousemove',
        onMove
      )

      card.removeEventListener(
        'mouseleave',
        onLeave
      )


      if (rafRef.current) {
        cancelAnimationFrame(
          rafRef.current
        )
      }
    }
  }, [compute])


  return (
    <section
      ref={sectionRef}
      style={S.section}
    >

      {/* Animated Arrow */}

      <svg
        style={{
          ...S.svg,

          opacity,

          transition:
            'opacity .2s ease',
        }}

        aria-hidden="true"
      >

        {arrow && (
          <>
            <path
              d={arrow.d}

              fill="none"

              stroke="rgba(var(--accent-rgb),0.48)"

              strokeWidth="2"

              strokeLinecap="round"

              strokeDasharray="7 10"
            />

            <g
              transform={
                `translate(${arrow.x2},${arrow.y2}) ` +
                `rotate(${arrow.angle})`
              }
            >

              <polyline
                points="-13,-6 0,0 -13,6"

                fill="none"

                stroke="rgba(var(--accent-rgb),0.85)"

                strokeWidth="2.2"

                strokeLinecap="round"

                strokeLinejoin="round"
              />

            </g>
          </>
        )}

      </svg>


      {/* CTA Card */}

      <div
        ref={cardRef}
        style={S.card}
      >

        {/* Pill */}

        <span style={S.pill}>
          Start Building
        </span>


        {/* Heading */}

        <h2 style={S.heading}>

          Ready to customize your{' '}

          <span style={S.headingSpan}>
            Odoo ERP?
          </span>

        </h2>


        {/* Description */}

        <p style={S.sub}>

          Transform workflows, automate
          operations and scale your
          business with tailored ERP
          systems.

        </p>


        {/* Button */}

        <button
          ref={buttonRef}

          style={{
            ...S.btn,

            ...(btnHover
              ? {
                  transform:
                    'translateY(-4px)',

                  background:
                    'var(--accent-hover)',

                  boxShadow:
                    '0 20px 45px rgba(var(--accent-rgb),.22)',
                }
              : {}),
          }}

          onMouseEnter={() =>
            setBtnHover(true)
          }

          onMouseLeave={() =>
            setBtnHover(false)
          }

          onClick={() =>
            navigate('/contact')
          }
        >

          Start Your Project

        </button>

      </div>

    </section>
  )
}


export default CTASection