import "./WhyUs.css";

const POINTS = [
  {
    color: "var(--brand-primary)",
    title: "Fast Time to Value",
    desc: "Results in weeks, not months. No endless scoping.",
  },
  {
    color: "var(--brand-secondary)",
    title: "Production-Ready AI",
    desc: "Real systems that run in production — not prototypes.",
  },
  {
    color: "var(--brand-deep)",
    title: "99.9% Uptime SLA",
    desc: "Enterprise-grade reliability with cloud-native infra.",
  },
  {
    color: "var(--brand-primary)",
    title: "No Vendor Lock-in",
    desc: "Open integrations. You own your data and systems.",
  },
  {
    color: "var(--brand-gold)",
    title: "Revenue-Driven Focus",
    desc: "We measure ROI from day one — cost centres → profits.",
  },
  {
    color: "var(--brand-secondary)",
    title: "End-to-End Support",
    desc: "From strategy to deployment to ongoing optimisation.",
  },
];

const BIG_STATS = [
  { num: "68%", label: "Reduction in manual work" },
  { num: "2.4×", label: "Average revenue uplift" },
  { num: "< 3W", label: "Time to first deployment" },
];

export default function WhyUs() {
  return (
    <section className="why-sec">
      <div className="why-bg-glow"></div>

      <div className="why-inner">
        {/* LEFT */}
        <div className="why-left">

          <h2 className="sec-heading">
            Built for
            <br />
            <span className="sec-heading--accent">
              real-world scale
            </span>
          </h2>

          <p className="sec-sub">
            Not prototypes. Not experiments. Production-grade AI
            systems that integrate with your existing stack and
            deliver measurable ROI from the first week.
          </p>

          <div className="why-bigstats">
            {BIG_STATS.map((s) => (
              <div key={s.label} className="why-bigstat">
                <span className="why-bigstat__n">{s.num}</span>

                <span className="why-bigstat__l">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="why-right">
          {POINTS.map((p) => (
            <div
              key={p.title}
              className="why-point"
              style={{ "--c": p.color }}
            >
              <div className="why-point__dot" />

              <div>
                <div className="why-point__title">
                  {p.title}
                </div>

                <div className="why-point__desc">
                  {p.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
