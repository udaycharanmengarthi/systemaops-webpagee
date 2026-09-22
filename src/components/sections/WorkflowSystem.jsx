import './WorkflowSystem.css'
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../../i18n/LanguageContext';
import {
  BrainCircuit,
  Workflow,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  FileText,
  Database,
  Bell,
  BarChart3,
} from 'lucide-react'

const WorkflowSystem = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <section className="workflow-section">
      <div className="workflow-container">
        {/* LEFT */}
        <div className="workflow-left">
          <span className="workflow-pill">
            {t("workflow.pill")}
          </span>

          <h2 className="workflow-heading">
            {t("workflow.heading1")}
            <br />
            {t("workflow.heading2")}
            <br />
            <span>{t("workflow.headingAccent")}</span>
          </h2>

          <p className="workflow-desc">
            {t("workflow.desc")}
          </p>

          <div className="workflow-points">
            <div className="workflow-point">
              <Workflow size={18} />
              {t("workflow.points")[0]}
            </div>

            <div className="workflow-point">
              <BrainCircuit size={18} />
              {t("workflow.points")[1]}
            </div>

            <div className="workflow-point">
              <ShieldCheck size={18} />
              {t("workflow.points")[2]}
            </div>
          </div>
<button
  className="workflow-btn"
  onClick={() =>
    navigate("/n8n-development")
  }
>
  {t("workflow.cta")}
  <ArrowRight size={18} />
</button>
        </div>

        {/* RIGHT */}
        <div className="workflow-right">
          <div className="workflow-flow">

            {/* SVG FLOW LINES — drawn over the whole grid */}
            <svg
              className="flow-svg-connector"
              viewBox="0 0 700 420"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Gradient for glowing line */}
                <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "rgba(var(--accent-rgb), 0)" }} />
                  <stop offset="40%" style={{ stopColor: "var(--accent-secondary)" }} />
                  <stop offset="70%" style={{ stopColor: "var(--accent-primary)" }} />
                  <stop offset="100%" stopColor="rgba(82,168,255,0)" />
                </linearGradient>

                {/* Glow filter */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/*
                Layout approximation (viewBox 700×420):
                  BEFORE card: x 0–220
                  ENGINE center: x ~350
                  AFTER card: x 480–700
                  Card vertical center: y ~210

                Top path: exits right side of BEFORE (220, 130) → curves up → enters engine top (350, 80) → curves → exits engine right (430, 80) → curves down → enters AFTER top (480, 130)
                Bottom path: exits right side of BEFORE (220, 290) → curves down → enters engine bottom (350, 340) → curves → exits engine right (430, 340) → curves up → enters AFTER bottom (480, 290)
              */}

              {/* TOP TRACK — faint base line */}
              <path
                className="flow-track"
                d="M 220 130 C 280 130, 310 80, 350 80 C 390 80, 420 80, 480 130"
              />

              {/* BOTTOM TRACK — faint base line */}
              <path
                className="flow-track"
                d="M 220 290 C 280 290, 310 340, 350 340 C 390 340, 420 290, 480 290"
              />

              {/* TOP GLOW — animated light traveling left→right */}
              <path
                className="flow-glow-line flow-glow-line-left"
                d="M 220 130 C 280 130, 310 80, 350 80 C 390 80, 420 80, 480 130"
                filter="url(#glow)"
              />

              {/* BOTTOM GLOW — animated light traveling left→right, delayed */}
              <path
                className="flow-glow-line flow-glow-line-right"
                d="M 220 290 C 280 290, 310 340, 350 340 C 390 340, 420 290, 480 290"
                filter="url(#glow)"
              />
            </svg>

            {/* BEFORE */}
            <div className="workflow-box">
              <span className="workflow-tag before">
                {t("workflow.before")}
              </span>

              <h3>
                {t("workflow.beforeTitle1")}
                <br />
                {t("workflow.beforeTitle2")}
              </h3>

              <div className="flow-list">
                <div className="flow-chip">
                  <MessageSquare size={18} />
                  {t("workflow.beforeChips")[0]}
                </div>

                <div className="flow-chip">
                  <FileText size={18} />
                  {t("workflow.beforeChips")[1]}
                </div>

                <div className="flow-chip">
                  <Workflow size={18} />
                  {t("workflow.beforeChips")[2]}
                </div>

                <div className="flow-chip">
                  <Database size={18} />
                  {t("workflow.beforeChips")[3]}
                </div>
              </div>
            </div>

            {/* ENGINE */}
            <div className="automation-engine">
              <div className="engine-ring">
                <BrainCircuit size={52} />
              </div>

              <h4>{t("workflow.engine")}</h4>

              <p>
                {t("workflow.engineSub")}
              </p>
            </div>

            {/* AFTER */}
            <div className="workflow-box">
              <span className="workflow-tag after">
                {t("workflow.after")}
              </span>

              <h3>
                {t("workflow.afterTitle1")}
                <br />
                {t("workflow.afterTitle2")}
              </h3>

              <div className="flow-list">
                <div className="flow-chip">
                  <Bell size={18} />
                  {t("workflow.afterChips")[0]}
                </div>

                <div className="flow-chip">
                  <BarChart3 size={18} />
                  {t("workflow.afterChips")[1]}
                </div>

                <div className="flow-chip">
                  <ShieldCheck size={18} />
                  {t("workflow.afterChips")[2]}
                </div>

                <div className="flow-chip">
                  <Workflow size={18} />
                  {t("workflow.afterChips")[3]}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default WorkflowSystem
