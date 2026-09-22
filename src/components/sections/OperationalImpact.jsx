import './OperationalImpact.css'
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react"
import { useLanguage } from "../../i18n/LanguageContext"
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Link2,
  ShieldCheck,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react"


const FLOW = ["Manual chaos", "Automated", "Scale freely"]


/* =================================================
   COUNT UP
================================================= */

function useCountUp(target, duration = 1800, start = false) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!start) return

    let raf

    const t0 = performance.now()

    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1)

      setVal(
        Math.round(
          (1 - Math.pow(1 - p, 4)) * target
        )
      )

      if (p < 1) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [start, target, duration])

  return val
}


/* =================================================
   INTERSECTION OBSERVER
================================================= */

function useInView(threshold = 0.2) {
  const ref = useRef(null)

  const [vis, setVis] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true)
          io.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      io.observe(ref.current)
    }

    return () => io.disconnect()
  }, [threshold])

  return [ref, vis]
}


/* =================================================
   METRIC TILE
================================================= */

function MetricTile({
  icon,
  val,
  title,
  desc,
  accent,
  delay
}) {
  const [ref, vis] = useInView(0.05)

  return (
    <div
      ref={ref}
      className="mtile"
      style={{
        '--ac': accent,

        opacity: vis ? 1 : 0,

        transform: vis
          ? 'none'
          : 'translateY(32px)',

        transition:
          `opacity .65s ease ${delay}ms,
           transform .65s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >

      <div className="mtile-top">

        <span className="mtile-icon">
          {icon}
        </span>

        <span className="mtile-val">
          {val}
        </span>

      </div>

      <h4>
        {title}
      </h4>

      <p>
        {desc}
      </p>

      <div className="mtile-glow" />

    </div>
  )
}


/* =================================================
   MAIN COMPONENT
================================================= */

export default function OperationalImpact() {

  const navigate = useNavigate()

  const { t } = useLanguage()

  const flow = t("impact.flow")

  const metrics = t("impact.metrics")

  const [root, inView] = useInView(0.08)

  const count = useCountUp(
    70,
    1800,
    inView
  )

  const [active, setActive] = useState(1)


  /* =================================================
     DIAL
  ================================================= */

  const R = 76

  const C = 2 * Math.PI * R

  const pct = inView
    ? count / 100
    : 0


  /* =================================================
     FLOW AUTO CHANGE
  ================================================= */

  useEffect(() => {

    const id = setInterval(
      () =>
        setActive(
          p => (p + 1) % flow.length
        ),
      2400
    )

    return () => clearInterval(id)

  }, [flow.length])


  /* =================================================
     FADE UP
  ================================================= */

  const fadeUp = (delay = 0) => ({
    opacity: inView ? 1 : 0,

    transform: inView
      ? 'none'
      : 'translateY(28px)',

    transition:
      `opacity .75s ease ${delay}ms,
       transform .75s cubic-bezier(.22,1,.36,1) ${delay}ms`,
  })


  /* =================================================
     FADE LEFT
  ================================================= */

  const fadeLeft = (delay = 0) => ({
    opacity: inView ? 1 : 0,

    transform: inView
      ? 'none'
      : 'translateX(-36px)',

    transition:
      `opacity .8s ease ${delay}ms,
       transform .8s cubic-bezier(.22,1,.36,1) ${delay}ms`,
  })


  return (

    <section
      className="oi"
      ref={root}
    >

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="oi-bg">

        <div className="oi-orb oi-orb1" />

        <div className="oi-orb oi-orb2" />

        <div className="oi-orb oi-orb3" />

        <div className="oi-grid" />

      </div>


      <div className="oi-wrap">


        {/* =================================================
            TOP LABEL ROW
        ================================================= */}

        <div
          className="oi-toprow"
          style={fadeUp(0)}
        >

          <div className="oi-pill">

            <Zap
              size={11}
              strokeWidth={3}
            />

            {t("impact.pill")}

          </div>


          <div className="flow-track">

            {flow.map((label, i) => (

              <div
                key={label}
                className="flow-item"
              >

                <button
                  className={
                    `flow-node${
                      active === i
                        ? ' flow-node--on'
                        : ''
                    }`
                  }

                  onClick={() =>
                    setActive(i)
                  }
                >

                  {i === 1 && (
                    <Workflow size={12} />
                  )}

                  {label}

                </button>


                {i < FLOW.length - 1 && (

                  <div
                    className={
                      `flow-wire${
                        active > i
                          ? ' flow-wire--lit'
                          : ''
                      }`
                    }
                  />

                )}

              </div>

            ))}

          </div>

        </div>


        {/* =================================================
            MAIN 3 COLUMN
        ================================================= */}

        <div className="oi-main">


          {/* =================================================
              COLUMN 1 — HEADLINE
          ================================================= */}

          <div
            className="oi-col-headline"
            style={fadeLeft(80)}
          >

            <h2 className="oi-h2">

              {t("impact.headline")[0]}
              <br />

              {t("impact.headline")[1]}
              <br />

              {t("impact.headline")[2]}
              <br />

              {t("impact.headline")[3]}{" "}

              <span className="grad-text">

                {t("impact.headlineAccent")[0]}
                <br />

                {t("impact.headlineAccent")[1]}

              </span>

            </h2>


            <div className="oi-vline" />

          </div>


          {/* =================================================
              COLUMN 2 — KPI CARD
          ================================================= */}

          <div
            className="oi-col-kpi"
            style={fadeUp(160)}
          >

            <div className="kpi-card">

              <div className="kpi-noise" />

              <div className="kpi-glow-top" />


              {/* KPI BADGE */}

              <div className="kpi-badge">

                <span className="kpi-dot" />

                {t("impact.badge")}

              </div>


              {/* =================================================
                  KPI DIAL
              ================================================= */}

              <div className="kpi-dial-wrap">

                <svg
                  className="kpi-dial"
                  viewBox="0 0 180 180"
                  fill="none"
                >

                  {/* Track */}

                  <circle
                    cx="90"
                    cy="90"
                    r={R}
                    strokeWidth="7"
                    stroke="var(--border-soft)"
                  />


                  {/* Tick marks */}

                  {Array
                    .from({ length: 20 })
                    .map((_, k) => {

                      const a =
                        (k / 20) *
                          2 *
                          Math.PI -
                        Math.PI / 2

                      const x1 =
                        90 +
                        (R + 14) *
                          Math.cos(a)

                      const y1 =
                        90 +
                        (R + 14) *
                          Math.sin(a)

                      const x2 =
                        90 +
                        (R + 20) *
                          Math.cos(a)

                      const y2 =
                        90 +
                        (R + 20) *
                          Math.sin(a)

                      return (

                        <line
                          key={k}

                          x1={x1}
                          y1={y1}

                          x2={x2}
                          y2={y2}

                          stroke="var(--border)"

                          strokeWidth="1.5"
                        />

                      )

                    })}


                  {/* =================================================
                      PROGRESS ARC
                  ================================================= */}

                  <circle
                    cx="90"
                    cy="90"
                    r={R}

                    strokeWidth="7"

                    stroke="var(--accent-primary)"

                    strokeDasharray={C}

                    strokeDashoffset={
                      C * (1 - pct)
                    }

                    strokeLinecap="round"

                    style={{
                      transition:
                        'stroke-dashoffset 1.9s cubic-bezier(.22,1,.36,1) .3s',

                      transform:
                        'rotate(-90deg)',

                      transformOrigin:
                        'center'
                    }}
                  />


                  {/* =================================================
                      SOFT GREEN GLOW
                  ================================================= */}

                  <circle
                    cx="90"
                    cy="90"
                    r={R}

                    strokeWidth="14"

                    stroke="var(--accent-primary)"

                    strokeDasharray={C}

                    strokeDashoffset={
                      C * (1 - pct)
                    }

                    strokeLinecap="round"

                    opacity=".10"

                    style={{
                      transition:
                        'stroke-dashoffset 1.9s cubic-bezier(.22,1,.36,1) .3s',

                      transform:
                        'rotate(-90deg)',

                      transformOrigin:
                        'center',

                      filter:
                        'blur(4px)'
                    }}
                  />

                </svg>


                {/* =================================================
                    NUMBER
                ================================================= */}

                <div className="kpi-numbox">

                  <span className="kpi-n">

                    {inView
                      ? count
                      : 0}

                  </span>

                  <span className="kpi-p">
                    %
                  </span>

                </div>

              </div>


              {/* KPI TEXT */}

              <h3 className="kpi-label">
                {t("impact.kpiTitle")}
              </h3>


              <p className="kpi-sub">
                {t("impact.kpiSub")}
              </p>


              <div className="kpi-footer">

                <TrendingUp
                  size={14}
                />

                {t("impact.kpiFooter")}

              </div>

            </div>

          </div>


          {/* =================================================
              COLUMN 3
          ================================================= */}

          <div
            className="oi-col-right"

            style={{
              opacity: inView ? 1 : 0,

              transform: inView
                ? 'none'
                : 'translateX(36px)',

              transition:
                'opacity .8s ease 240ms, transform .8s cubic-bezier(.22,1,.36,1) 240ms',
            }}
          >

            <p className="oi-desc">

              {t("impact.desc")}

            </p>


            {/* CHECK LIST */}

            <ul className="oi-checks">

              {t("impact.checks").map(
                pt => (

                  <li key={pt}>

                    <CheckCircle2
                      size={15}
                    />

                    {pt}

                  </li>

                )
              )}

            </ul>


            {/* CTA */}

            <button
              className="oi-btn"

              onClick={() =>
                navigate(
                  "/n8n-development"
                )
              }
            >

              {t("impact.cta")}

              <ArrowRight
                size={15}
              />

            </button>


            {/* =================================================
                MINI STAT STRIP
            ================================================= */}

            <div className="oi-strip">

              <div className="strip-item">

                <span className="strip-num">
                  98%
                </span>

                <span className="strip-lbl">
                  {t("impact.strip")[0]}
                </span>

              </div>


              <div className="strip-div" />


              <div className="strip-item">

                <span className="strip-num">
                  40+
                </span>

                <span className="strip-lbl">
                  {t("impact.strip")[1]}
                </span>

              </div>


              <div className="strip-div" />


              <div className="strip-item">

                <span className="strip-num">
                  12×
                </span>

                <span className="strip-lbl">
                  {t("impact.strip")[2]}
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            METRICS ROW
        ================================================= */}

        <div className="oi-metrics">

          {[
            {
              icon: <Clock3 size={18} />,
              val: '3x',
              title: 'Faster execution',
              desc:
                'Cut delays, approvals and repetitive ops.',
              accent: 'var(--accent-primary)',
              delay: 0
            },

            {
              icon: <Link2 size={18} />,
              val: '24/7',
              title: 'Connected systems',
              desc:
                'CRM, ERP, WhatsApp and internal tools synced.',
              accent: 'var(--accent-primary)',
              delay: 70
            },

            {
              icon: <Activity size={18} />,
              val: 'Live',
              title: 'Real-time visibility',
              desc:
                'Dashboards, alerts and reporting always on.',
              accent: 'var(--accent-primary)',
              delay: 140
            },

            {
              icon: <ShieldCheck size={18} />,
              val: '↓99%',
              title: 'Lower errors',
              desc:
                'Less manual work means far fewer mistakes.',
              accent: 'var(--accent-primary)',
              delay: 210
            },

          ].map(m => (

            <MetricTile
              key={m.title}
              {...m}
            />

          ))}

        </div>

      </div>

    </section>

  )
}