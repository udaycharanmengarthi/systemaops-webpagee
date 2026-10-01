/* ================================================================
   SERVICE PREVIEW ART — technical product diagrams
   One shared visual language: neutral nodes + connector lines,
   with only the important semantic nodes carrying the service
   accent. Colors: accent props + theme tokens.
=============================================================== */

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

function Node({ x, y, w, h, title, sub, fill }) {
  const cx = x + w / 2;
  const isAccent = Boolean(fill);
  const ink = isAccent ? inkFor(fill) : N.text;
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
      />
      {title && (
        <text
          x={cx}
          y={y + h / 2 + (sub ? -4 : 5)}
          textAnchor="middle"
          fill={ink}
          fontSize="13.5"
          fontWeight="700"
          letterSpacing="-0.2"
        >
          {title}
        </text>
      )}
      {sub && (
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
      {isAccent && (
        <circle cx={x + 8} cy={y + 8} r="3" fill={ink} opacity="0.7" />
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
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
      />
      <polygon
        points={`${x2},${y2} ${x2 - ux * 10 - uy * 5},${y2 - uy * 10 + ux * 5} ${x2 - ux * 10 + uy * 5},${y2 - uy * 10 - ux * 5}`}
        fill={color || N.border}
      />
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

/* Previews take translated `labels` (megaMenu.preview.<id>); geometry fixed. */

function OdooPreview({ accent, labels }) {
  const sats = labels.sats || [];
  const pos = [
    { x: 52, y: 60 },
    { x: 52, y: 150 },
    { x: 52, y: 240 },
    { x: 468, y: 60 },
    { x: 468, y: 150 },
    { x: 468, y: 240 },
  ];
  return (
    <Art label={labels.label}>
      {pos.map((p, i) => (
        <Node key={sats[i]} x={p.x} y={p.y} w={120} h={52} title={sats[i]} />
      ))}
      <Arrow x1={172} y1={86} x2={250} y2={136} />
      <Arrow x1={172} y1={176} x2={250} y2={170} />
      <Arrow x1={172} y1={266} x2={250} y2={204} />
      <Arrow x1={468} y1={86} x2={390} y2={136} />
      <Arrow x1={468} y1={176} x2={390} y2={170} />
      <Arrow x1={468} y1={266} x2={390} y2={204} />
      <Node
        x={250}
        y={120}
        w={140}
        h={100}
        title={labels.center}
        sub={labels.centerSub}
        accent={accent}
        fill={accent}
      />
    </Art>
  );
}

function WorkflowPreview({ accent, labels }) {
  return (
    <Art label={labels.label}>
      <Node x={48} y={108} w={118} h={60} title={labels.trigger.t} sub={labels.trigger.s} />
      <Arrow x1={166} y1={138} x2={204} y2={138} />
      <Node x={204} y={108} w={118} h={60} title={labels.process.t} sub={labels.process.s} />
      <Arrow x1={322} y1={138} x2={360} y2={138} />
      <Node
        x={360}
        y={108}
        w={128}
        h={60}
        title={labels.condition.t}
        sub={labels.condition.s}
      />
      <Arrow x1={488} y1={122} x2={488} y2={96} />
      <Arrow x1={488} y1={96} x2={280} y2={96} />
      <Arrow x1={488} y1={168} x2={488} y2={226} />
      <Node
        x={400}
        y={226}
        w={176}
        h={62}
        title={labels.action.t}
        sub={labels.action.s}
        accent={accent}
        fill={accent}
      />
      <Node
        x={196}
        y={226}
        w={152}
        h={62}
        title={labels.review.t}
        sub={labels.review.s}
      />
      <Arrow x1={348} y1={257} x2={400} y2={257} />
      <Arrow x1={488} y1={257} x2={576} y2={257} />
    </Art>
  );
}

function AIPreview({ accent, labels }) {
  return (
    <Art label={labels.label}>
      <Node
        x={52}
        y={118}
        w={116}
        h={60}
        title={labels.request.t}
        sub={labels.request.s}
      />
      <Arrow x1={168} y1={148} x2={222} y2={148} />
      <Node
        x={222}
        y={90}
        w={170}
        h={116}
        title={labels.agent.t}
        sub={labels.agent.s}
        accent={accent}
        fill={accent}
      />
      <Node x={300} y={36} w={130} h={38} title={labels.reasoning} />
      <Arrow x1={365} y1={74} x2={307} y2={90} />
      <Arrow x1={392} y1={148} x2={446} y2={148} />
      <Node
        x={446}
        y={118}
        w={116}
        h={60}
        title={labels.response.t}
        sub={labels.response.s}
      />
      <Node x={252} y={238} w={140} h={52} title={labels.tools.t} sub={labels.tools.s} />
      <Arrow x1={322} y1={238} x2={307} y2={206} />
    </Art>
  );
}

function IntegrationPreview({ accent, labels }) {
  const sats = labels.sats || [];
  const pos = [
    { x: 52, y: 52 },
    { x: 52, y: 240 },
    { x: 468, y: 52 },
    { x: 468, y: 240 },
  ];
  return (
    <Art label={labels.label}>
      {pos.map((p, i) => (
        <Node key={sats[i]} x={p.x} y={p.y} w={120} h={56} title={sats[i]} />
      ))}
      <Arrow x1={172} y1={80} x2={252} y2={146} />
      <Arrow x1={172} y1={268} x2={252} y2={194} />
      <Arrow x1={468} y1={80} x2={388} y2={146} />
      <Arrow x1={468} y1={268} x2={388} y2={194} />
      <circle cx="320" cy="170" r="58" fill="none" stroke={N.borderSoft} strokeWidth="1.5" />
      <Node
        x={262}
        y={128}
        w={116}
        h={84}
        title={labels.center}
        sub={labels.centerSub}
        accent={accent}
        fill={accent}
      />
    </Art>
  );
}

function DataPreview({ accent, labels }) {
  return (
    <Art label={labels.label}>
      <Node x={40} y={118} w={104} h={64} title={labels.document.t} sub={labels.document.s} />
      <Arrow x1={144} y1={150} x2={186} y2={150} />
      <Node
        x={186}
        y={118}
        w={112}
        h={64}
        title={labels.extraction.t}
        sub={labels.extraction.s}
        accent={accent}
        fill={accent}
      />
      <Arrow x1={298} y1={150} x2={340} y2={150} />
      <Node x={340} y={118} w={108} h={64} title={labels.validation.t} sub={labels.validation.s} />
      <Arrow x1={448} y1={150} x2={490} y2={150} />
      <Node x={490} y={118} w={112} h={64} title={labels.structured} />
      <Node
        x={300}
        y={228}
        w={140}
        h={54}
        title={labels.destination.t}
        sub={labels.destination.s}
        accent={accent}
        fill={accent}
      />
      <Arrow x1={546} y1={182} x2={546} y2={214} />
      <Arrow x1={546} y1={214} x2={440} y2={255} />
    </Art>
  );
}

function DevOpsPreview({ accent, labels }) {
  return (
    <Art label={labels.label}>
      <Node x={48} y={96} w={110} h={56} title={labels.deploy.t} sub={labels.deploy.s} />
      <Arrow x1={158} y1={124} x2={200} y2={124} />
      <Node x={200} y={96} w={110} h={56} title={labels.runtime.t} sub={labels.runtime.s} />
      <Arrow x1={310} y1={124} x2={352} y2={124} />
      <Node
        x={352}
        y={96}
        w={130}
        h={56}
        title={labels.monitor.t}
        sub={labels.monitor.s}
        accent={accent}
        fill={accent}
      />
      <Arrow x1={482} y1={124} x2={524} y2={124} />
      <Node x={524} y={96} w={70} h={56} title={labels.alert} />
      <Node
        x={352}
        y={216}
        w={140}
        h={58}
        title={labels.resolve.t}
        sub={labels.resolve.s}
        accent={accent}
        fill={accent}
      />
      <Arrow x1={559} y1={152} x2={559} y2={202} />
      <Arrow x1={559} y1={202} x2={492} y2={245} />
      <Arrow x1={352} y1={245} x2={158} y2={245} />
      <Arrow x1={158} y1={245} x2={103} y2={152} />
    </Art>
  );
}

const ART = {
  odoo: OdooPreview,
  workflow: WorkflowPreview,
  ai: AIPreview,
  integration: IntegrationPreview,
  data: DataPreview,
  devops: DevOpsPreview,
};

export default function ServicePreviewArt({ id, accent, labels }) {
  const Preview = ART[id] || OdooPreview;
  if (!labels || typeof labels !== "object") return null;
  return <Preview accent={accent} labels={labels} />;
}
