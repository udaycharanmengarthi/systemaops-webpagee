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
  onAccent: "#0A1120",
};

function Node({ x, y, w, h, title, sub, fill }) {
  const cx = x + w / 2;
  const isAccent = Boolean(fill);
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
          fill={isAccent ? N.onAccent : N.text}
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
          fill={isAccent ? N.onAccent : N.sub}
          opacity={isAccent ? 0.85 : 1}
          fontSize="10"
          fontWeight="500"
        >
          {sub}
        </text>
      )}
      {isAccent && (
        <circle cx={x + 8} cy={y + 8} r="3" fill={N.onAccent} opacity="0.7" />
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

/* ── ODOO: satellite modules around the ERP hub (violet) ── */
function OdooPreview({ accent }) {
  return (
    <Art label="Odoo ERP hub diagram">
      {[
        { x: 52, y: 60, t: "CRM" },
        { x: 52, y: 150, t: "Sales" },
        { x: 52, y: 240, t: "Inventory" },
        { x: 468, y: 60, t: "Invoicing" },
        { x: 468, y: 150, t: "HR / Payroll" },
        { x: 468, y: 240, t: "Accounting" },
      ].map((n) => (
        <Node key={n.t} x={n.x} y={n.y} w={120} h={52} title={n.t} />
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
        title="ODOO ERP"
        sub="one system"
        accent={accent}
        fill={accent}
      />
    </Art>
  );
}

/* ── WORKFLOW: trigger → process → condition → action (amber) ── */
function WorkflowPreview({ accent }) {
  return (
    <Art label="Workflow automation pipeline diagram">
      <Node x={48} y={108} w={118} h={60} title="Trigger" sub="event fires" />
      <Arrow x1={166} y1={138} x2={204} y2={138} />
      <Node x={204} y={108} w={118} h={60} title="Process" sub="enrich data" />
      <Arrow x1={322} y1={138} x2={360} y2={138} />
      <Node
        x={360}
        y={108}
        w={128}
        h={60}
        title="Condition"
        sub="approved?"
      />
      <Arrow x1={488} y1={122} x2={488} y2={96} />
      <Arrow x1={488} y1={96} x2={280} y2={96} />
      <Arrow x1={488} y1={168} x2={488} y2={226} />
      <Node
        x={400}
        y={226}
        w={176}
        h={62}
        title="Action"
        sub="sync systems · notify"
        accent={accent}
        fill={accent}
      />
      <Node
        x={196}
        y={226}
        w={152}
        h={62}
        title="Review"
        sub="exception path"
      />
      <Arrow x1={348} y1={257} x2={400} y2={257} />
      <Arrow x1={488} y1={257} x2={576} y2={257} />
    </Art>
  );
}

/* ── AI: request → agent → tools → response (cyan) ── */
function AIPreview({ accent }) {
  return (
    <Art label="AI agent workflow diagram">
      <Node
        x={52}
        y={118}
        w={116}
        h={60}
        title="Request"
        sub="input arrives"
      />
      <Arrow x1={168} y1={148} x2={222} y2={148} />
      <Node
        x={222}
        y={90}
        w={170}
        h={116}
        title="AI Agent"
        sub="reasoning · decisions"
        accent={accent}
        fill={accent}
      />
      <Node x={300} y={36} w={130} h={38} title="Reasoning" />
      <Arrow x1={365} y1={74} x2={307} y2={90} />
      <Arrow x1={392} y1={148} x2={446} y2={148} />
      <Node
        x={446}
        y={118}
        w={116}
        h={60}
        title="Response"
        sub="action taken"
      />
      <Node x={252} y={238} w={140} h={52} title="Tools" sub="APIs · docs" />
      <Arrow x1={322} y1={238} x2={307} y2={206} />
    </Art>
  );
}

/* ── INTEGRATION: systems around the API layer (blue) ── */
function IntegrationPreview({ accent }) {
  return (
    <Art label="System integration architecture diagram">
      {[
        { x: 52, y: 52, t: "CRM" },
        { x: 52, y: 240, t: "ERP" },
        { x: 468, y: 52, t: "Database" },
        { x: 468, y: 240, t: "External System" },
      ].map((n) => (
        <Node key={n.t} x={n.x} y={n.y} w={120} h={56} title={n.t} />
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
        title="API Layer"
        sub="webhooks"
        accent={accent}
        fill={accent}
      />
    </Art>
  );
}

/* ── DATA: document pipeline (orange) ── */
function DataPreview({ accent }) {
  return (
    <Art label="Document automation pipeline diagram">
      <Node x={40} y={118} w={104} h={64} title="Document" sub="invoice · form" />
      <Arrow x1={144} y1={150} x2={186} y2={150} />
      <Node
        x={186}
        y={118}
        w={112}
        h={64}
        title="Extraction"
        sub="OCR + AI"
        accent={accent}
        fill={accent}
      />
      <Arrow x1={298} y1={150} x2={340} y2={150} />
      <Node x={340} y={118} w={108} h={64} title="Validation" sub="rules · checks" />
      <Arrow x1={448} y1={150} x2={490} y2={150} />
      <Node x={490} y={118} w={112} h={64} title="Structured Data" />
      <Node
        x={300}
        y={228}
        w={140}
        h={54}
        title="Destination"
        sub="ERP · CRM"
        accent={accent}
        fill={accent}
      />
      <Arrow x1={546} y1={182} x2={546} y2={214} />
      <Arrow x1={546} y1={214} x2={440} y2={255} />
    </Art>
  );
}

/* ── DEVOPS: deploy → runtime → monitor → alert → resolve (pink) ── */
function DevOpsPreview({ accent }) {
  return (
    <Art label="DevOps observability loop diagram">
      <Node x={48} y={96} w={110} h={56} title="Deploy" sub="release" />
      <Arrow x1={158} y1={124} x2={200} y2={124} />
      <Node x={200} y={96} w={110} h={56} title="Runtime" sub="production" />
      <Arrow x1={310} y1={124} x2={352} y2={124} />
      <Node
        x={352}
        y={96}
        w={130}
        h={56}
        title="Monitor"
        sub="logs · metrics"
        accent={accent}
        fill={accent}
      />
      <Arrow x1={482} y1={124} x2={524} y2={124} />
      <Node x={524} y={96} w={70} h={56} title="Alert" />
      <Node
        x={352}
        y={216}
        w={140}
        h={58}
        title="Resolve"
        sub="remediate · improve"
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

export default function ServicePreviewArt({ id, accent }) {
  const Preview = ART[id] || OdooPreview;
  return <Preview accent={accent} />;
}
