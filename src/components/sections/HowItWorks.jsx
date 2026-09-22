import "./HowItWorks.css";
import { useLanguage } from "../../i18n/LanguageContext";


const STEPS = [
  {
    num: "01",
    color: "var(--accent-primary)",
    title: "Understand",
    desc: "We map your workflows, data and pain points to find exactly where AI creates immediate business value.",
  },
  {
    num: "02",
    color: "var(--accent-primary)",
    title: "Identify",
    desc: "We surface high-impact automation opportunities that save time, cut costs and increase team efficiency.",
  },
  {
    num: "03",
    color: "var(--accent-primary)",
    title: "Build & Integrate",
    desc: "Production-ready AI solutions wired seamlessly into your existing stack — no disruption to operations.",
  },
  {
    num: "04",
    color: "var(--accent-primary)",
    title: "Monitor & Scale",
    desc: "Continuous performance tracking and model refinement to ensure long-term ROI as your business grows.",
  },
];


export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = t("how.steps");


  return (
    <section className="hiw-sec">

      <div className="hiw-inner">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="hiw-header">

          <span className="hiw-eyebrow">
            {t("how.eyebrow")}
          </span>


          <h2 className="hiw-heading">

            {t("how.heading")}{" "}

            <span className="hiw-heading-accent">
              {t("how.accent")}
            </span>

          </h2>


          <p className="hiw-sub">
            {t("how.sub")}
          </p>

        </div>


        {/* =================================================
            STEPS
        ================================================= */}

        <div className="hiw-steps">

          {STEPS.map((step, i) => (

            <div
              key={step.num}
              className="hiw-step"
              style={{
                "--c": "var(--accent-primary)",
              }}
            >

              {/* Connector line */}

              {i < STEPS.length - 1 && (
                <div className="hiw-connector">

                  <div className="hiw-connector__line" />

                  <div className="hiw-connector__dot" />

                </div>
              )}


              {/* Step number */}

              <div className="hiw-step__num">
                {step.num}
              </div>


              {/* Step content */}

              <div className="hiw-step__body">

                <h3 className="hiw-step__title">
                  {steps[i][0]}
                </h3>


                <p className="hiw-step__desc">
                  {steps[i][1]}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}