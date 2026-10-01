/**
 * components/service/DevOpsControlRoom.jsx
 *
 * Interactive observability demo for the DevOps service page.
 * A compact control-room view: watched services, live metrics
 * with sparklines, a log stream, a timestamped incident
 * timeline and an incident side panel with the engineering
 * response.
 *
 * "Simulate incident" runs a scripted ~5s incident in phases:
 * latency 42 → 91 → 184 ms, error rate 0.2 → 1.7 → 4.8%,
 * detection, correlation, response, then recovery
 * 184 → 96 → 61 ms and 4.8 → 1.2 → 0.3%. "Reset" returns to
 * the healthy idle state. All copy comes from
 * t("serviceDetail.devops.demo.*").
 */

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../i18n/useLanguage";
import { useReducedMotion } from "./useReducedMotion";
import "./ServiceDemo.css";
import "./DevOpsControlRoom.css";

const IDLE_LATENCY = 42;
const MID_LATENCY = 91;
const PEAK_LATENCY = 184;
const RECOVER_LATENCY = 96;
const FIXED_LATENCY = 61;
const IDLE_ERROR = 0.2;
const MID_ERROR = 1.7;
const PEAK_ERROR = 4.8;
const RECOVER_ERROR = 1.2;
const FIXED_ERROR = 0.3;
const IDLE_REQ = 1284;
const DIP_REQ = 1190;
const SERIES_LEN = 14;
const MAX_LOGS = 5;

/* Deterministic event clock: incident opens at 10:42:01. */
const STEP_TIMES = ["10:42:02", "10:42:03", "10:42:04", "10:42:06"];

const baseLatSeries = () => [
  42, 44, 41, 45, 43, 42, 44, 41, 43, 42, 44, 42, 43, 42,
];
const baseErrSeries = () => new Array(SERIES_LEN).fill(IDLE_ERROR);
const baseReqSeries = () => new Array(SERIES_LEN).fill(IDLE_REQ);

function approach(value, target, minStep) {
  const diff = target - value;
  if (Math.abs(diff) <= minStep) return target;
  return (
    value + Math.sign(diff) * Math.max(Math.abs(diff) * 0.16, minStep)
  );
}

function Sparkline({ values, max }) {
  const w = 120;
  const h = 36;
  const list = values && values.length ? values : [0];
  const pts = list
    .map((v, i) => {
      const x = (i / Math.max(list.length - 1, 1)) * w;
      const y = h - 4 - (Math.min(v, max) / max) * (h - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="dc-spark"
      aria-hidden="true"
    >
      <polyline
        points={pts}
        fill="none"
        stroke="var(--brand-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DevOpsControlRoom() {
  const { t, language } = useLanguage();
  const demo = t("serviceDetail.devops.demo") || {};
  const services = demo.services || {};
  const metrics = demo.metrics || {};
  const status = demo.status || {};
  const panel = demo.panel || {};
  const timeline = demo.timeline || [];
  const idleLogs = demo.idleLogs || [];
  const eventLogs = demo.eventLogs || [];

  const reduced = useReducedMotion();
  const [phase, setPhase] = useState("idle");
  const [latency, setLatency] = useState(IDLE_LATENCY);
  const [errorRate, setErrorRate] = useState(IDLE_ERROR);
  const [requests, setRequests] = useState(IDLE_REQ);
  const [target, setTarget] = useState({
    latency: IDLE_LATENCY,
    error: IDLE_ERROR,
    req: IDLE_REQ,
  });
  const [latSeries, setLatSeries] = useState(baseLatSeries);
  const [errSeries, setErrSeries] = useState(baseErrSeries);
  const [reqSeries, setReqSeries] = useState(baseReqSeries);
  const [logs, setLogs] = useState(() => idleLogs.slice(0, 3));
  const [touched, setTouched] = useState(false);

  const timers = useRef([]);
  const latRef = useRef(IDLE_LATENCY);
  const errRef = useRef(IDLE_ERROR);
  const reqRef = useRef(IDLE_REQ);

  const running =
    phase === "latency" || phase === "warning" || phase === "incident";

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  /* Cleanup on unmount only. */
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    []
  );

  /* Ease metric numbers + sparklines toward the active target.
     Reduced motion skips the easing: run()/reset() already set
     refs and state to their final values synchronously. */
  useEffect(() => {
    if (reduced) return undefined;
    const iv = setInterval(() => {
      const nl = approach(latRef.current, target.latency, 1);
      const ne = approach(errRef.current, target.error, 0.1);
      const nr = approach(reqRef.current, target.req, 4);
      latRef.current = nl;
      errRef.current = ne;
      reqRef.current = nr;
      setLatency(nl);
      setErrorRate(Math.round(ne * 10) / 10);
      setRequests(Math.round(nr));
      setLatSeries((prev) => [...prev.slice(-(SERIES_LEN - 1)), nl]);
      setErrSeries((prev) => [
        ...prev.slice(-(SERIES_LEN - 1)),
        Math.round(ne * 10) / 10,
      ]);
      setReqSeries((prev) => [
        ...prev.slice(-(SERIES_LEN - 1)),
        Math.round(nr),
      ]);
      if (
        nl === target.latency &&
        ne === target.error &&
        nr === target.req
      ) {
        clearInterval(iv);
      }
    }, 90);
    return () => clearInterval(iv);
  }, [target, reduced]);

  const pushLogs = (indexes) => {
    const lines = indexes
      .map((i) => eventLogs[i])
      .filter(Boolean);
    if (!lines.length) return;
    setLogs((prev) => [...prev, ...lines].slice(-MAX_LOGS));
  };

  const at = (ms, fn) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const run = () => {
    clearTimers();
    setTouched(true);
    if (reduced) {
      latRef.current = FIXED_LATENCY;
      errRef.current = FIXED_ERROR;
      reqRef.current = IDLE_REQ;
      setLatency(FIXED_LATENCY);
      setErrorRate(FIXED_ERROR);
      setRequests(IDLE_REQ);
      setTarget({
        latency: FIXED_LATENCY,
        error: FIXED_ERROR,
        req: IDLE_REQ,
      });
      setPhase("recovered");
      setLogs([...idleLogs, ...eventLogs].slice(-MAX_LOGS));
      return;
    }
    setPhase("latency");
    setTarget({ latency: MID_LATENCY, error: IDLE_ERROR, req: IDLE_REQ });
    pushLogs([0]);
    at(800, () => {
      setTarget({ latency: PEAK_LATENCY, error: IDLE_ERROR, req: IDLE_REQ });
      pushLogs([1]);
    });
    at(1600, () => {
      setPhase("warning");
      setTarget({ latency: PEAK_LATENCY, error: MID_ERROR, req: IDLE_REQ });
      pushLogs([2]);
    });
    at(2400, () => {
      setTarget({ latency: PEAK_LATENCY, error: PEAK_ERROR, req: DIP_REQ });
      pushLogs([3, 4]);
    });
    at(3200, () => {
      setPhase("incident");
      pushLogs([5, 6]);
    });
    at(4200, () => {
      setPhase("recovered");
      setTarget({
        latency: RECOVER_LATENCY,
        error: RECOVER_ERROR,
        req: DIP_REQ,
      });
      pushLogs([7]);
    });
    at(5000, () => {
      setTarget({ latency: FIXED_LATENCY, error: FIXED_ERROR, req: IDLE_REQ });
      pushLogs([8, 9]);
    });
  };

  const reset = () => {
    clearTimers();
    latRef.current = IDLE_LATENCY;
    errRef.current = IDLE_ERROR;
    reqRef.current = IDLE_REQ;
    setPhase("idle");
    setTarget({ latency: IDLE_LATENCY, error: IDLE_ERROR, req: IDLE_REQ });
    setLatency(IDLE_LATENCY);
    setErrorRate(IDLE_ERROR);
    setRequests(IDLE_REQ);
    setLatSeries(baseLatSeries());
    setErrSeries(baseErrSeries());
    setReqSeries(baseReqSeries());
    setLogs(idleLogs.slice(0, 3));
    setTouched(false);
  };

  const statusKey =
    phase === "idle" || phase === "latency"
      ? "healthy"
      : phase;
  const statusWord = status[statusKey] || status.healthy || phase;

  const apiDot =
    phase === "incident"
      ? "dc-dot--bad"
      : phase === "warning"
        ? "dc-dot--warn"
        : "";

  const doneSteps =
    phase === "recovered"
      ? 4
      : phase === "incident"
        ? 3
        : phase === "warning"
          ? 1
          : 0;

  const showPanel = phase === "incident" || phase === "recovered";

  return (
    <div
      className="dc-room"
      role="region"
      aria-label={demo.aria}
    >
      <div className="dc-top">
        <div className="dc-services">
          {[
            { label: services.api || "API", dot: apiDot },
            { label: services.worker || "Worker", dot: "" },
            { label: services.database || "Database", dot: "" },
          ].map((s) => (
            <span key={s.label} className="dc-svc">
              <span
                className={`dc-dot ${s.dot} ${running && !s.dot ? "dc-dot--live" : ""}`}
                aria-hidden="true"
              />
              {s.label}
            </span>
          ))}
        </div>
        <span
          className={`dc-badge dc-badge--${statusKey}`}
          role="status"
        >
          <span
            className={`dc-dot ${running ? "dc-dot--live" : ""}`}
            aria-hidden="true"
          />
          {statusWord}
        </span>
      </div>

      <div className={`dc-main${showPanel ? " dc-main--split" : ""}`}>
        <div className="dc-left">
          <div className="dc-metrics">
            <div className="dc-metric">
              <span className="dc-metric-label">{metrics.latency}</span>
              <span className="dc-metric-value">
                {Math.round(latency)} ms
              </span>
              <Sparkline values={latSeries} max={220} />
            </div>
            <div className="dc-metric">
              <span className="dc-metric-label">{metrics.errorRate}</span>
              <span className="dc-metric-value">
                {errorRate.toFixed(1)}%
              </span>
              <Sparkline values={errSeries} max={6} />
            </div>
            <div className="dc-metric">
              <span className="dc-metric-label">{metrics.requests}</span>
              <span className="dc-metric-value">
                {requests.toLocaleString(language)}
                /min
              </span>
              <Sparkline values={reqSeries} max={1400} />
            </div>
            <div className="dc-metric">
              <span className="dc-metric-label">{metrics.health}</span>
              <span
                className={`dc-metric-value dc-health--${statusKey}`}
              >
                {statusWord}
              </span>
              <ol className="dc-timeline">
                {timeline.map((step, i) => (
                  <li
                    key={step || i}
                    className={i < doneSteps ? "dc-tl--done" : ""}
                  >
                    <span aria-hidden="true" />
                    {step}
                    {i < doneSteps && STEP_TIMES[i] && (
                      <time>{STEP_TIMES[i]}</time>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <ol className="dc-logs" aria-label="logs">
            {logs.map((line, i) => (
              <li
                key={`${i}-${line}`}
                className={
                  phase !== "idle" && i === logs.length - 1
                    ? "dc-log--fresh"
                    : ""
                }
              >
                {line}
              </li>
            ))}
          </ol>
        </div>

        {showPanel && (
          <aside className="dc-side" aria-live="polite">
            <div className="dc-card dc-card--incident">
              <strong>{demo.incidentTitle}</strong>
              <p>{demo.incidentDesc}</p>
              <p className="dc-status-row">
                <span>{panel.statusLabel}</span>
                <strong>
                  {phase === "recovered" ? panel.resolved : panel.open}
                </strong>
              </p>
            </div>
            <div className="dc-card dc-card--response">
              <strong>{demo.responseTitle}</strong>
              <p>{demo.responseDesc}</p>
            </div>
          </aside>
        )}
      </div>

      {phase === "recovered" && (
        <>
          <p className="dc-banner" role="status">
            {status.recovered}
          </p>
          <p className="dc-recovered">{demo.recoveredNote}</p>
        </>
      )}

      <div className="demo-controls">
        <button
          type="button"
          className="demo-btn"
          onClick={run}
          disabled={running}
        >
          {demo.simulate}
        </button>
        <button
          type="button"
          className="demo-btn demo-btn--ghost"
          onClick={reset}
          disabled={!touched && phase === "idle"}
        >
          {demo.reset}
        </button>
      </div>
    </div>
  );
}
