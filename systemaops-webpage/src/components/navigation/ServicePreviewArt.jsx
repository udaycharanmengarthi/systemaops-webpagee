/* ================================================================
   SERVICE PREVIEW ART — static service architecture diagrams
   Each service gets a distinct topology that communicates its real
   process: what goes in, what moves where, where decisions happen,
   and what comes out. One shared visual language (neutral nodes +
   connector lines, accent only on the semantically central node),
   theme-aware through CSS tokens + the per-service accent prop.

   No animation anywhere in this file: connectors are static, status
   is conveyed by structure and labels alone, and every diagram reads
   fully without motion.
================================================================ */

const N = {
  surface: "var(--bg-surface)",
  border: "var(--border-strong)",
  borderSoft: "var(--border)",
  text: "var(--text-primary)",
  sub: "var(--text-muted)",
};

/* Readable ink for any solid accent fill (teal depths + gold).
   Center fills vary per service, so luminance decides the ink. */
function inkFor(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex || "");
  if (!m) return "#0A1120";
  const c = m[1];
  const lum =
    (0.2126 * parseInt(c.slice(0, 2), 16) +
      0.7152 * parseInt(c.slice(2, 4), 16) +
      0.0722 * parseInt(c.slice(4, 6), 16)) /
    255;
  return lum > 0.3 ? "#0A1120" : "#FFFFFF";
}

function Node({ x, y, w, h, title, sub, fill, tSize, items, dashed }) {
  const cx = x + w / 2;
  const isAccent = Boolean(fill);
  const ink = isAccent ? inkFor(fill) : N.text;
  const titleSize = tSize || 13.5;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="12"
        fill={isAccent ? fill : N.surface}
        stroke={isAccent ? "none" : N.borderSoft}
        strokeWidth={isAccent ? 0 : 1.5}
        strokeDasharray={dashed ? "6 5" : undefined}
      />
      {title && !items && (
        <text
          x={cx}
          y={y + h / 2 + (sub ? -4 : 5)}
          textAnchor="middle"
          fill={ink}
          fontSize={titleSize}
          fontWeight="700"
          letterSpacing="-0.2"
        >
          {title}
        </text>
      )}
      {sub && !items && (
        <text
          x={cx}
          y={y + h / 2 + 15}
          textAnchor="middle"
          fill={ink}
          opacity={isAccent ? 0.85 : 1}
          fontSize="10"
          fontWeight="500"
        >
          {sub}
        </text>
      )}
      {items && (
        <g>
          <text
            x={cx}
            y={y + 22}
            textAnchor="middle"
            fill={ink}
            fontSize={titleSize}
            fontWeight="700"
            letterSpacing="-0.2"
          >
            {title}
          </text>
          {items.map((line, i) => (
            <g key={i}>
              <rect
                x={x + 16}
                y={y + 38 + i * 20 - 4}
                width="5"
                height="5"
                fill={ink}
                opacity="0.55"
              />
              <text
                x={x + 27}
                y={y + 43 + i * 20}
                fill={ink}
                opacity={isAccent ? 0.9 : 1}
                fontSize="9.5"
                fontWeight="500"
              >
                {line}
              </text>
            </g>
          ))}
        </g>
      )}
      {isAccent && (
        <circle cx={x + 8} cy={y + 8} r="3" fill={ink} opacity="0.7" />
      )}
    </g>
  );
}

/* Decision diamond. Title only — sub text stays out to keep the
   diamond legible at preview size. */
function Diamond({ cx, cy, w, h, title, sub }) {
  return (
    <g>
      <polygon
        points={`${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`}
        fill={N.surface}
        stroke={N.border}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {title && (
        <text
          x={cx}
          y={cy + (sub ? -1 : 4.5)}
          textAnchor="middle"
          fill={N.text}
          fontSize="12.5"
          fontWeight="700"
          letterSpacing="-0.2"
        >
          {title}
        </text>
      )}
      {sub && (
        <text
          x={cx}
          y={cy + 15}
          textAnchor="middle"
          fill={N.sub}
          fontSize="9.5"
          fontWeight="500"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

/* Small satellite chip for supporting concepts. Single short label. */
function Chip({ x, y, w, h, title, dashed }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="9"
        fill={N.surface}
        stroke={N.borderSoft}
        strokeWidth="1.5"
        strokeDasharray={dashed ? "6 5" : undefined}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 3.5}
        textAnchor="middle"
        fill={N.sub}
        fontSize="10.5"
        fontWeight="600"
      >
        {title}
      </text>
    </g>
  );
}

/* Small-caps section label inside a diagram region. */
function GroupLabel({ x, y, text }) {
  return (
    <text
      x={x}
      y={y}
      fill={N.sub}
      fontSize="9.5"
      fontWeight="700"
      letterSpacing="1.5"
    >
      {text}
    </text>
  );
}

function Arrow({ x1, y1, x2, y2, color, dashed, both }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const head = (hx, hy, sx, sy) => (
    <polygon
      points={`${hx},${hy} ${hx - sx * 10 - sy * 5},${hy - sy * 10 + sx * 5} ${hx - sx * 10 + sy * 5},${hy - sy * 10 - sx * 5}`}
      fill={color || N.border}
    />
  );
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color || N.border}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={dashed ? "6 5" : undefined}
      />
      {head(x2, y2, ux, uy)}
      {both ? head(x1, y1, -ux, -uy) : null}
    </g>
  );
}

/* Arrowhead triangle pointing along `angle` (degrees, 0 = +x).
   Used at the end of curved Flow paths whose tangent is designed
   horizontal or vertical, so the angle is always exact. */
function Head({ x, y, angle, color }) {
  const rad = (angle * Math.PI) / 180;
  const ux = Math.cos(rad);
  const uy = Math.sin(rad);
  const nx = -uy;
  const ny = ux;
  const L = 11;
  const W = 5.5;
  return (
    <polygon
      points={`${x},${y} ${x - ux * L - nx * W},${y - uy * L - ny * W} ${x - ux * L + nx * W},${y - uy * L + ny * W}`}
      fill={color || N.border}
    />
  );
}

/* Curved connector with an arrowhead. The path is drawn first and
   must enter (ex, ey) along `angle` so the head sits flush. */
function Flow({ d, ex, ey, angle, color, width, dashed }) {
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color || N.border}
        strokeWidth={width || 2.5}
        strokeLinecap="round"
        strokeDasharray={dashed ? "6 5" : undefined}
      />
      <Head x={ex} y={ey} angle={angle} color={color} />
    </g>
  );
}

function Art({ label, children }) {
  return (
    <svg
      viewBox="0 0 640 340"
      role="img"
      aria-label={label}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        fontFamily:
          "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
      }}
    >
      {children}
    </svg>
  );
}

/* Safe label access: missing keys fall back to EN strings so NL/DE
   never crash when a key is absent. No animation, no hooks. */
function tt(node, fbT, fbS) {
  if (!node) return { t: fbT || "", s: fbS || "" };
  if (typeof node === "string") return { t: node, s: fbS || "" };
  return { t: node.t || fbT || "", s: node.s || fbS || "" };
}
function arr(v, fb) {
  return Array.isArray(v) && v.length ? v : fb;
}

/* Previews take translated `labels` (megaMenu.preview.<id>); geometry fixed. */

/* AI AUTOMATION — an agent executing a controlled business task.
   Left inputs feed the dominant central agent; the agent proposes a
   business action; human review gates exceptions; approved work flows
   through execution into results. Asymmetric by design. */
function AIPreview({ accent, labels }) {
  const L = labels || {};
  const inp = L.inputs || {};
  const cIn = tt(inp.context, "Context", "information");
  const tIn = tt(inp.tools, "Tools & Data", "approved APIs");
  const rIn = tt(inp.rules, "Business Rules", "permissions");
  const ag = tt(L.agent, "AI Agent", "applies business rules");
  const steps = arr(L.steps, ["Analyze", "Plan", "Use Tools", "Make Decision"]);
  const rev = tt(L.review, "Human Review", "exceptions / approval");
  const act = tt(L.action, "Business Action", "agent proposes");
  const exe = tt(L.execute, "Execute Task");
  const upd = tt(L.update, "Update Systems");
  const res = tt(L.result, "Result");
  const outs = arr(L.outcomes, ["Task Completed", "Systems Updated", "Business Outcome"]);
  return (
    <Art label={L.label}>
      <Node x={20} y={40} w={118} h={58} title={cIn.t} sub={cIn.s} tSize={12} />
      <Node x={20} y={139} w={118} h={58} title={tIn.t} sub={tIn.s} tSize={12} />
      <Node x={20} y={238} w={118} h={58} title={rIn.t} sub={rIn.s} tSize={12} />
      <Arrow x1={138} y1={69} x2={178} y2={140} />
      <Arrow x1={138} y1={168} x2={178} y2={168} both />
      <Arrow x1={138} y1={267} x2={178} y2={215} />
      <Node
        x={178}
        y={96}
        w={152}
        h={154}
        title={ag.t}
        items={steps}
      />
      <Node x={372} y={20} w={232} h={48} title={rev.t} sub={rev.s} />
      <Flow
        d="M 260 96 C 300 60, 350 55, 400 60"
        ex={400}
        ey={60}
        angle={8}
        dashed
      />
      <Arrow x1={540} y1={68} x2={505} y2={92} dashed />
      <Node x={372} y={92} w={232} h={44} title={act.t} sub={act.s} tSize={12} />
      <Arrow x1={330} y1={171} x2={372} y2={114} color={accent} />
      <Node x={372} y={150} w={110} h={44} title={exe.t} tSize={11.5} />
      <Node x={494} y={150} w={110} h={44} title={upd.t} tSize={11.5} />
      <Arrow x1={427} y1={136} x2={427} y2={150} color={accent} />
      <Arrow x1={482} y1={172} x2={494} y2={172} color={accent} />
      <Arrow x1={559} y1={194} x2={559} y2={206} color={accent} />
      <Node x={372} y={206} w={232} h={44} title={res.t} tSize={12} />
      {outs.map((line, i) => (
        <g key={i}>
          <circle cx={384 + i * 78} cy={272} r={3} fill={accent} />
          <text
            x={392 + i * 78}
            y={275}
            fill={N.text}
            fontSize="9"
            fontWeight="600"
          >
            {line}
          </text>
        </g>
      ))}
    </Art>
  );
}

/* ODOO ERP — five business modules sharing records through the ERP
   hub. Double-headed spokes show records flowing both ways; the
   dashed ring is the shared-record circulation layer. */
function OdooPreview({ accent, labels }) {
  const L = labels || {};
  const fbMods = [
    { t: "CRM", s: "Leads & Customers" },
    { t: "Sales", s: "Orders & Revenue" },
    { t: "Inventory", s: "Stock & Fulfillment" },
    { t: "Finance", s: "Accounting & Financials" },
    { t: "HR", s: "People & Operations" },
  ];
  const mods = arr(L.modules, fbMods);
  const pos = [
    { x: 45, y: 36 },
    { x: 455, y: 36 },
    { x: 45, y: 252 },
    { x: 455, y: 252 },
    { x: 250, y: 256 },
  ];
  const hub = { x: 255, y: 115, w: 130, h: 110 };
  const hubCx = hub.x + hub.w / 2;
  return (
    <Art label={L.label}>
      <path
        d="M 200 170 a 120 78 0 1 1 240 0 a 120 78 0 1 1 -240 0"
        fill="none"
        stroke={N.borderSoft}
        strokeWidth="1.5"
        strokeDasharray="7 6"
      />
      {pos.map((p, i) => (
        <Node
          key={(mods[i] && mods[i].t) || i}
          x={p.x}
          y={p.y}
          w={140}
          h={52}
          title={mods[i] ? mods[i].t : ""}
          sub={mods[i] ? mods[i].s : ""}
          tSize={12.5}
        />
      ))}
      <Arrow x1={185} y1={62} x2={270} y2={120} both />
      <Arrow x1={455} y1={62} x2={370} y2={120} both />
      <Arrow x1={185} y1={278} x2={270} y2={220} both />
      <Arrow x1={455} y1={278} x2={370} y2={220} both />
      <Arrow x1={320} y1={256} x2={hubCx} y2={225} both />
      <Node
        x={hub.x}
        y={hub.y}
        w={hub.w}
        h={hub.h}
        title={L.center || "ODOO ERP"}
        sub={L.centerSub || "ERP core"}
        tSize={13}
        accent={accent}
        fill={accent}
      />
      <rect x={250} y={78} width={140} height={28} rx="9" fill={N.surface} />
      <text
        x={320}
        y={96}
        textAnchor="middle"
        fill={N.sub}
        fontSize="10.5"
        fontWeight="600"
      >
        {L.shared || "Shared records"}
      </text>
    </Art>
  );
}

/* WORKFLOW AUTOMATION — trigger to completion with a real decision:
   an approved branch executes, a review branch loops back, and a
   rejected branch is visibly distinct and returns to the start. */
function WorkflowPreview({ accent, labels }) {
  const L = labels || {};
  const trg = tt(L.trigger, "Event / Trigger", "starts the run");
  const prc = tt(L.process, "Process", "runs the steps");
  const dec = tt(L.decision, "Decision", "rules pass?");
  const aut = tt(L.auto, "Automatic", "no approval needed");
  const cmp = tt(L.completed || L.complete, "Completed", "done");
  const apr = tt(L.approval, "Human Approval", "conditional review");
  const ok = tt(L.approved, "Approved", "continue");
  const cnt = tt(L.continueNode, "Continue Process", "resume flow");
  const rej = tt(L.rejected, "Rejected");
  const ret = tt(L.returnNode, "Return / Exception");
  return (
    <Art label={L.label}>
      <Node x={16} y={143} w={104} h={54} title={trg.t} sub={trg.s} tSize={11.5} />
      <Arrow x1={120} y1={170} x2={132} y2={170} />
      <Node x={132} y={143} w={100} h={54} title={prc.t} sub={prc.s} tSize={12} />
      <Arrow x1={232} y1={170} x2={244} y2={170} />
      <Diamond
        cx={304}
        cy={170}
        w={120}
        h={112}
        title={dec.t}
        sub={dec.s}
      />
      <Arrow x1={364} y1={140} x2={390} y2={84} color={accent} />
      <Node x={390} y={56} w={180} h={52} title={aut.t} sub={aut.s} tSize={12} />
      <Arrow x1={480} y1={108} x2={480} y2={124} color={accent} />
      <Node x={390} y={124} w={180} h={52} title={cmp.t} sub={cmp.s} tSize={12} />
      <Arrow x1={304} y1={226} x2={205} y2={246} />
      <Node x={120} y={246} w={130} h={52} title={apr.t} sub={apr.s} tSize={11.5} />
      <Arrow x1={250} y1={272} x2={270} y2={272} />
      <Node x={270} y={246} w={100} h={52} title={ok.t} sub={ok.s} tSize={12} />
      <Arrow x1={370} y1={272} x2={390} y2={272} />
      <Node x={390} y={246} w={180} h={52} title={cnt.t} sub={cnt.s} tSize={12} />
      <Arrow x1={364} y1={185} x2={390} y2={176} dashed color={accent} />
      <Node x={390} y={150} w={100} h={46} title={rej.t} tSize={11.5} dashed />
      <Arrow x1={490} y1={173} x2={520} y2={173} dashed />
      <Chip x={520} y={150} w={104} h={46} title={ret.t} dashed />
      <Flow
        d="M 572 196 L 572 300 L 60 300 L 60 205"
        ex={60}
        ey={205}
        angle={-90}
        dashed
      />
    </Art>
  );
}

/* AIOPS MONITORING — Observe, Detect, Respond lifecycle.
   Systems & Apps feed Metrics/Logs/Health signals; Detection &
   Investigation drives Alert -> Response -> Recovery Verification;
   a static Continuous Monitoring connector loops back. Main path
   uses the service accent; the feedback loop stays visually separate. */
function DevOpsPreview({ accent, labels }) {
  const L = labels || {};
  const sys = tt(L.systems, "Systems & Apps", "monitored stack");
  const sig = arr(L.signals, [
    { t: "Metrics", s: "performance / usage" },
    { t: "Logs", s: "events / errors" },
    { t: "Health", s: "availability checks" },
  ]);
  const det = tt(L.detectNode || L.detect, "Detection", "identify + investigate");
  const alr = tt(L.alertNode || L.alert, "Alert", "notify team · incident");
  const rsp = tt(L.response, "Response", "auto / manual fix");
  const vfy = tt(L.verifyNode || L.verify, "Recovery Check", "confirm + monitor");
  const fb = typeof L.feedback === "string" ? L.feedback : "Continuous Monitoring";
  const sigPos = [
    { x: 186, y: 36 },
    { x: 186, y: 143 },
    { x: 186, y: 250 },
  ];
  return (
    <Art label={L.label}>
      <Node x={16} y={143} w={130} h={54} title={sys.t} sub={sys.s} tSize={12} />
      <Arrow x1={146} y1={160} x2={186} y2={60} />
      <Arrow x1={146} y1={170} x2={186} y2={167} />
      <Arrow x1={146} y1={180} x2={186} y2={274} />
      {sigPos.map((p, i) => (
        <Node
          key={(sig[i] && sig[i].t) || i}
          x={p.x}
          y={p.y}
          w={110}
          h={48}
          title={sig[i] ? sig[i].t : ""}
          sub={sig[i] ? sig[i].s : ""}
          tSize={12}
        />
      ))}
      <Arrow x1={296} y1={60} x2={340} y2={125} />
      <Arrow x1={296} y1={167} x2={316} y2={160} />
      <Arrow x1={296} y1={274} x2={340} y2={195} />
      <Node
        x={316}
        y={110}
        w={148}
        h={100}
        title={det.t}
        sub={det.s}
        tSize={12.5}
        accent={accent}
        fill={accent}
      />
      <Arrow x1={440} y1={125} x2={484} y2={62} color={accent} />
      <Node x={484} y={36} w={130} h={52} title={alr.t} sub={alr.s} tSize={12} />
      <Arrow x1={549} y1={88} x2={549} y2={140} color={accent} />
      <Node x={484} y={140} w={130} h={52} title={rsp.t} sub={rsp.s} tSize={12} />
      <Arrow x1={549} y1={192} x2={549} y2={244} color={accent} />
      <Node x={484} y={244} w={130} h={52} title={vfy.t} sub={vfy.s} tSize={11.5} />
      <Flow
        d="M 484 270 C 370 318, 190 318, 91 200 L 91 116"
        ex={91}
        ey={116}
        angle={-90}
      />
      <text
        x={282}
        y={326}
        textAnchor="middle"
        fill={N.sub}
        fontSize="9.5"
        fontWeight="600"
        letterSpacing="0.5"
      >
        {fb}
      </text>
    </Art>
  );
}

/* AI CONSULTING — Business Problem to Roadmap (strategy, not a
   flowchart). Five staged deliverables left-to-right; Feasibility &
   Value Assessment carries the strongest emphasis (accent fill);
   a small static prioritization matrix (Business Value x Feasibility)
   with neutral markers sits below. Implementation Plan is labeled a
   consulting deliverable and implies no build commitment. */
function ConsultingPreview({ accent, labels }) {
  const L = labels || {};
  const fbStages = [
    { t: "Business Needs", s: "goals · challenges" },
    { t: "AI Opportunities", s: "use cases · potential" },
    { t: "Feasibility & Value", s: "assessment · priority" },
    { t: "Prioritized Roadmap", s: "phases · initiatives" },
    { t: "Implementation Plan", s: "KPIs · outcomes" },
  ];
  const stages = arr(L.stages, fbStages);
  const s = (i) => tt(stages[i], fbStages[i].t, fbStages[i].s);
  const xs = [12, 136, 260, 392, 512];
  const s0 = s(0);
  const s1 = s(1);
  const s2 = s(2);
  const s3 = s(3);
  const s4 = s(4);
  const mTitle = L.matrixTitle || "PRIORITIZATION";
  const mX = L.matrixX || "Feasibility";
  const mY = L.matrixY || "Business Value";
  const planNote = L.planNote || "consulting deliverable";
  return (
    <Art label={L.label}>
      <Node x={xs[0]} y={36} w={112} h={60} title={s0.t} sub={s0.s} tSize={11} />
      <Arrow x1={124} y1={66} x2={136} y2={66} />
      <Node x={xs[1]} y={36} w={112} h={60} title={s1.t} sub={s1.s} tSize={11} />
      <Arrow x1={248} y1={66} x2={260} y2={66} />
      <Node x={xs[2]} y={28} w={120} h={76} title={s2.t} sub={s2.s} tSize={11.5} fill={accent} />
      <Arrow x1={380} y1={66} x2={392} y2={66} color={accent} />
      <Node x={xs[3]} y={36} w={112} h={60} title={s3.t} sub={s3.s} tSize={11} />
      <Arrow x1={504} y1={66} x2={512} y2={66} />
      <Node x={xs[4]} y={36} w={116} h={60} title={s4.t} sub={s4.s} tSize={11} />
      <text x={570} y={112} textAnchor="middle" fill={N.sub} fontSize="8.5" fontWeight="600" fontStyle="italic">
        {planNote}
      </text>
      <GroupLabel x={16} y={140} text={mTitle} />
      <g>
        <line x1={64} y1={288} x2={300} y2={288} stroke={N.border} strokeWidth="1.5" />
        <polygon points="300,288 290,284 290,292" fill={N.border} />
        <line x1={64} y1={288} x2={64} y2={152} stroke={N.border} strokeWidth="1.5" />
        <polygon points="64,152 60,162 68,162" fill={N.border} />
        <text x={182} y={306} textAnchor="middle" fill={N.sub} fontSize="9.5" fontWeight="600">
          {mX}
        </text>
        <text
          x={40}
          y={220}
          textAnchor="middle"
          fill={N.sub}
          fontSize="9.5"
          fontWeight="600"
          transform="rotate(-90 40 220)"
        >
          {mY}
        </text>
        <circle cx={238} cy={182} r={6} fill={accent} />
        <circle cx={150} cy={188} r={5} fill="none" stroke={N.border} strokeWidth="1.5" />
        <circle cx={238} cy={252} r={5} fill="none" stroke={N.border} strokeWidth="1.5" />
        <circle cx={120} cy={250} r={4.5} fill="none" stroke={N.borderSoft} strokeWidth="1.5" />
      </g>
      <g>
        <rect x={360} y={160} width={260} height={140} rx="12" fill="none" stroke={N.borderSoft} strokeWidth="1.5" strokeDasharray="6 5" />
        <text x={490} y={184} textAnchor="middle" fill={N.text} fontSize="11.5" fontWeight="700">
          {s2.t}
        </text>
        <text x={490} y={200} textAnchor="middle" fill={N.sub} fontSize="9.5" fontWeight="500">
          {s2.s}
        </text>
        <text x={380} y={228} fill={N.sub} fontSize="9.5" fontWeight="500">{"· Understand goals"}</text>
        <text x={380} y={246} fill={N.sub} fontSize="9.5" fontWeight="500">{"· Assess potential"}</text>
        <text x={380} y={264} fill={N.sub} fontSize="9.5" fontWeight="500">{"· Define phases + KPIs"}</text>
        <Flow d="M 320 66 L 320 120 L 360 120" ex={360} ey={120} angle={0} dashed />
      </g>
    </Art>
  );
}

/* SYSTEM INTEGRATIONS — sources and targets exchanging data through
   the API layer on distinct request and response lanes, with error
   handling attached to the layer. */
function IntegrationPreview({ accent, labels }) {
  const L = labels || {};
  const fbCrm = { t: "CRM", items: ["Customers", "Leads", "Sales Data"] };
  const fbLayer = {
    t: "Integration / API Layer",
    items: [
      "API & Connectors",
      "Secure Integration",
      "Data Exchange",
      "Mapping & Validation",
      "Transform Data",
      "Validate Rules",
      "Synchronization",
      "Keep Systems in Sync",
      "Two-way Exchange",
    ],
  };
  const fbErp = { t: "ERP", items: ["Orders", "Inventory", "Financial Data"] };
  const crm = { t: (L.crm && L.crm.t) || fbCrm.t, items: arr(L.crm && L.crm.items, fbCrm.items) };
  const layer = { t: (L.layer && L.layer.t) || fbLayer.t, items: arr(L.layer && L.layer.items, fbLayer.items) };
  const erp = { t: (L.erp && L.erp.t) || fbErp.t, items: arr(L.erp && L.erp.items, fbErp.items) };
  const err = tt(L.errors, "Errors");
  return (
    <Art label={L.label}>
      <Node x={24} y={90} w={140} h={180} title={crm.t} items={crm.items} tSize={12} />
      <Node
        x={200}
        y={60}
        w={240}
        h={220}
        title={layer.t}
        items={layer.items}
        tSize={12}
      />
      <Node x={476} y={90} w={140} h={180} title={erp.t} items={erp.items} tSize={12} />
      <Arrow x1={164} y1={130} x2={200} y2={130} color={accent} />
      <Arrow x1={200} y1={170} x2={164} y2={170} />
      <Arrow x1={440} y1={130} x2={476} y2={130} color={accent} />
      <Arrow x1={476} y1={170} x2={440} y2={170} />
      <Node x={270} y={288} w={100} h={36} title={err.t} tSize={11} dashed />
      <Arrow x1={320} y1={280} x2={320} y2={288} dashed />
    </Art>
  );
}

const ART = {
  odoo: OdooPreview,
  workflow: WorkflowPreview,
  ai: AIPreview,
  integration: IntegrationPreview,
  consulting: ConsultingPreview,
  devops: DevOpsPreview,
};

export default function ServicePreviewArt({ id, accent, labels }) {
  const Preview = ART[id] || OdooPreview;
  if (!labels || typeof labels !== "object") return null;
  return <Preview accent={accent} labels={labels} />;
}
