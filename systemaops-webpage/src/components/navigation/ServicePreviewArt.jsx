import {
  Activity,
  BellRing,
  BookOpen,
  Bot,
  Boxes,
  CircleCheck,
  Cog,
  Database,
  FileText,
  Inbox,
  Landmark,
  MessageSquareText,
  Network,
  Package,
  Radar,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Workflow as WorkflowIcon,
} from "lucide-react";
import "./ServicePreviewArt.css";

function rgbChannels(hex) {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex || "");
  if (!match) return "21, 154, 156";
  const value = match[1];
  return [0, 2, 4]
    .map((start) =>
      parseInt(value.slice(start, start + 2), 16)
    )
    .join(", ");
}

const DEFAULT_LABELS = {
  odoo: {
    label:
      "Odoo customization: sales, inventory and finance connected through customized Odoo into one unified workflow",
    sales: "Sales",
    salesSub: "Orders & revenue",
    inventory: "Inventory",
    inventorySub: "Stock & fulfilment",
    finance: "Finance",
    financeSub: "Invoices & books",
    core: "Customized Odoo",
    coreSub: "aligned to your workflow",
    outcome: "Unified workflow",
    outcomeSub: "one connected operation",
  },
  workflow: {
    label:
      "Workflow automation: a new enquiry triggers an automated workflow and completes the task",
    trigger: "Trigger",
    triggerSub: "New enquiry",
    automate: "Automate",
    automateSub: "Process workflow",
    complete: "Complete",
    completeSub: "Task completed",
  },
  ai: {
    label:
      "AI automation: context and a request enter an AI agent that produces a human-reviewed business action",
    context: "Context",
    contextSub: "Knowledge & data",
    request: "Request",
    requestSub: "User prompt",
    core: "AI Agent",
    coreSub: "rules, tools & context",
    outcome: "Business Action",
    outcomeSub: "human-reviewed result",
  },
  integration: {
    label:
      "System integration: CRM and ERP synchronize through an API and webhook layer with shared database records",
    systems: "CRM / ERP",
    systemsSub: "business systems",
    layer: "API & Webhooks",
    layerSub: "validate & sync",
    data: "Database",
    dataSub: "shared records",
  },
  devops: {
    label:
      "AIOps monitoring: monitor, detect, respond and recover, with continuous monitoring",
    monitor: "Monitor",
    monitorSub: "Metrics & logs",
    detect: "Detect",
    detectSub: "Find anomalies",
    respond: "Respond",
    respondSub: "Alert or fix",
    recover: "Recover",
    recoverSub: "Confirm recovery",
    continuous: "Continuous monitoring",
  },
  consulting: {
    label:
      "AI consulting: understand, recommend, implement and improve",
    understand: "Understand",
    recommend: "Recommend",
    implement: "Implement",
    improve: "Improve",
  },
};

function DiagramFrame({ label, accent, children }) {
  return (
    <svg
      viewBox="0 0 640 300"
      role="img"
      aria-label={label}
      className="spa-svg"
      preserveAspectRatio="xMidYMid meet"
      style={{
        "--c": accent || "#159A9C",
        "--c-rgb": rgbChannels(accent),
      }}
    >
      {children}
    </svg>
  );
}

function Glyph({
  icon: Icon,
  x,
  y,
  size = 20,
  accent = false,
  muted = false,
}) {
  const className = accent
    ? "spa-icon spa-icon--accent"
    : muted
      ? "spa-icon spa-icon--muted"
      : "spa-icon";

  return (
    <Icon
      x={x}
      y={y}
      width={size}
      height={size}
      strokeWidth={1.8}
      className={className}
      aria-hidden="true"
    />
  );
}

function Node({
  x,
  y,
  w,
  h,
  title,
  sub,
  icon,
  accent = false,
  layout = "center",
}) {
  const isRow = layout === "row";

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={14}
        className={`spa-node${
          accent ? " spa-node--accent" : ""
        }`}
      />
      {isRow ? (
        <>
          <Glyph
            icon={icon}
            x={x + 20}
            y={y + h / 2 - 10}
            accent={accent}
          />
          <text
            x={x + 44}
            y={y + h / 2 - 2}
            className="spa-title"
          >
            {title}
          </text>
          {sub && (
            <text
              x={x + 44}
              y={y + h / 2 + 15}
              className="spa-sub"
            >
              {sub}
            </text>
          )}
        </>
      ) : (
        <>
          <Glyph
            icon={icon}
            x={x + w / 2 - 10}
            y={y + 24}
            accent={accent}
          />
          <text
            x={x + w / 2}
            y={y + h / 2 + 13}
            textAnchor="middle"
            className="spa-title"
          >
            {title}
          </text>
          {sub && (
            <text
              x={x + w / 2}
              y={y + h / 2 + 30}
              textAnchor="middle"
              className="spa-sub"
            >
              {sub}
            </text>
          )}
        </>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, both = false, stroke }) {
  const head = 7.5;
  const wing = 0.42;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const lineStartX = both ? x1 + head * cos : x1;
  const lineStartY = both ? y1 + head * sin : y1;
  const lineEndX = x2 - head * cos;
  const lineEndY = y2 - head * sin;

  const endWingA = {
    x: x2 - head * Math.cos(angle - wing),
    y: y2 - head * Math.sin(angle - wing),
  };
  const endWingB = {
    x: x2 - head * Math.cos(angle + wing),
    y: y2 - head * Math.sin(angle + wing),
  };
  const startWingA = {
    x: x1 + head * Math.cos(angle - wing),
    y: y1 + head * Math.sin(angle - wing),
  };
  const startWingB = {
    x: x1 + head * Math.cos(angle + wing),
    y: y1 + head * Math.sin(angle + wing),
  };

  return (
    <g>
      <line
        x1={lineStartX}
        y1={lineStartY}
        x2={lineEndX}
        y2={lineEndY}
        className="spa-arrow-line"
        stroke={stroke || "var(--c)"}
      />
      <polygon
        points={`${x2},${y2} ${endWingA.x},${endWingA.y} ${endWingB.x},${endWingB.y}`}
        className="spa-arrow-head"
        fill={stroke || "var(--c)"}
      />
      {both && (
        <polygon
          points={`${x1},${y1} ${startWingA.x},${startWingA.y} ${startWingB.x},${startWingB.y}`}
          className="spa-arrow-head"
          fill={stroke || "var(--c)"}
        />
      )}
    </g>
  );
}

function Note({ x, y, w, text }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={36}
        rx={18}
        className="spa-note"
      />
      <Glyph
        icon={RefreshCw}
        x={x + 14}
        y={y + 10}
        size={16}
        muted
      />
      <text
        x={x + 38}
        y={y + 23}
        className="spa-note-text"
      >
        {text}
      </text>
    </g>
  );
}

function OdooDiagram({ accent, D }) {
  const inputs = [
    { key: "sales", icon: ShoppingCart, y: 40 },
    { key: "inventory", icon: Package, y: 118 },
    { key: "finance", icon: Landmark, y: 196 },
  ];
  const targets = [126, 150, 174];

  return (
    <DiagramFrame label={D.label} accent={accent}>
      {inputs.map(({ key, icon, y }) => (
        <Node
          key={key}
          x={24}
          y={y}
          w={172}
          h={64}
          layout="row"
          icon={icon}
          title={D[key]}
          sub={D[`${key}Sub`]}
        />
      ))}
      {inputs.map(({ key, y }, index) => (
        <Arrow
          key={`arrow-${key}`}
          x1={196}
          y1={y + 32}
          x2={246}
          y2={targets[index]}
        />
      ))}
      <Node
        x={246}
        y={96}
        w={154}
        h={108}
        icon={Boxes}
        title={D.core}
        sub={D.coreSub}
        accent
      />
      <Arrow x1={400} y1={150} x2={444} y2={150} />
      <Node
        x={444}
        y={102}
        w={172}
        h={96}
        icon={WorkflowIcon}
        title={D.outcome}
        sub={D.outcomeSub}
      />
    </DiagramFrame>
  );
}

function WorkflowDiagram({ accent, D }) {
  const nodes = [
    {
      x: 38,
      icon: Inbox,
      title: D.trigger,
      sub: D.triggerSub,
    },
    {
      x: 240,
      icon: Cog,
      title: D.automate,
      sub: D.automateSub,
      accent: true,
    },
    {
      x: 442,
      icon: CircleCheck,
      title: D.complete,
      sub: D.completeSub,
    },
  ];

  return (
    <DiagramFrame label={D.label} accent={accent}>
      {nodes.map(({ x, icon, title, sub, accent: isAccent }) => (
        <Node
          key={title}
          x={x}
          y={98}
          w={160}
          h={104}
          icon={icon}
          title={title}
          sub={sub}
          accent={isAccent}
        />
      ))}
      <Arrow x1={198} y1={150} x2={240} y2={150} />
      <Arrow x1={400} y1={150} x2={442} y2={150} />
    </DiagramFrame>
  );
}

function AIDiagram({ accent, D }) {
  const inputs = [
    {
      key: "context",
      icon: BookOpen,
      y: 64,
    },
    {
      key: "request",
      icon: MessageSquareText,
      y: 160,
    },
  ];

  return (
    <DiagramFrame label={D.label} accent={accent}>
      {inputs.map(({ key, icon, y }) => (
        <Node
          key={key}
          x={30}
          y={y}
          w={172}
          h={76}
          layout="row"
          icon={icon}
          title={D[key]}
          sub={D[`${key}Sub`]}
        />
      ))}
      <Arrow x1={202} y1={102} x2={252} y2={124} />
      <Arrow x1={202} y1={198} x2={252} y2={176} />
      <Node
        x={252}
        y={92}
        w={148}
        h={116}
        icon={Bot}
        title={D.core}
        sub={D.coreSub}
        accent
      />
      <Arrow x1={400} y1={150} x2={452} y2={150} />
      <Node
        x={452}
        y={102}
        w={158}
        h={96}
        icon={CircleCheck}
        title={D.outcome}
        sub={D.outcomeSub}
      />
    </DiagramFrame>
  );
}

function IntegrationDiagram({ accent, D }) {
  return (
    <DiagramFrame label={D.label} accent={accent}>
      <Node
        x={30}
        y={98}
        w={160}
        h={104}
        icon={Boxes}
        title={D.systems}
        sub={D.systemsSub}
      />
      <Arrow x1={190} y1={150} x2={240} y2={150} both />
      <Node
        x={240}
        y={98}
        w={160}
        h={104}
        icon={Network}
        title={D.layer}
        sub={D.layerSub}
        accent
      />
      <Arrow x1={400} y1={150} x2={450} y2={150} both />
      <Node
        x={450}
        y={98}
        w={160}
        h={104}
        icon={Database}
        title={D.data}
        sub={D.dataSub}
      />
    </DiagramFrame>
  );
}

function AIOpsDiagram({ accent, D }) {
  const nodes = [
    {
      x: 30,
      icon: Activity,
      title: D.monitor,
      sub: D.monitorSub,
    },
    {
      x: 181,
      icon: Radar,
      title: D.detect,
      sub: D.detectSub,
      accent: true,
    },
    {
      x: 332,
      icon: BellRing,
      title: D.respond,
      sub: D.respondSub,
    },
    {
      x: 483,
      icon: ShieldCheck,
      title: D.recover,
      sub: D.recoverSub,
    },
  ];

  return (
    <DiagramFrame label={D.label} accent={accent}>
      {nodes.map(({ x, icon, title, sub, accent: isAccent }) => (
        <Node
          key={title}
          x={x}
          y={98}
          w={126}
          h={104}
          icon={icon}
          title={title}
          sub={sub}
          accent={isAccent}
        />
      ))}
      <Arrow x1={156} y1={150} x2={181} y2={150} />
      <Arrow x1={307} y1={150} x2={332} y2={150} />
      <Arrow x1={458} y1={150} x2={483} y2={150} />
      <Note x={190} y={226} w={260} text={D.continuous} />
    </DiagramFrame>
  );
}

function ConsultingDiagram({ accent, D }) {
  const steps = [
    {
      title: D.understand || "Understand",
      icon: Search,
    },
    {
      title: D.recommend || "Recommend",
      icon: FileText,
    },
    {
      title: D.implement || "Implement",
      icon: Settings,
    },
    {
      title: D.improve || "Improve",
      icon: CircleCheck,
    },
  ];

  const nodeW = 132;
  const gap = 24;
  const totalWidth = steps.length * nodeW + (steps.length - 1) * gap;
  const startX = (640 - totalWidth) / 2;

  return (
    <DiagramFrame label={D.label} accent={accent}>
      {steps.map(({ title, icon }, i) => {
        const x = startX + i * (nodeW + gap);
        return (
          <g key={title}>
            <Node
              x={x}
              y={98}
              w={nodeW}
              h={104}
              title={title}
              icon={icon}
              accent={i === 2}
            />
            {i < steps.length - 1 && (
              <Arrow
                x1={x + nodeW}
                y1={150}
                x2={x + nodeW + gap}
                y2={150}
              />
            )}
          </g>
        );
      })}
    </DiagramFrame>
  );
}

const ART = {
  odoo: OdooDiagram,
  workflow: WorkflowDiagram,
  ai: AIDiagram,
  integration: IntegrationDiagram,
  devops: AIOpsDiagram,
  consulting: ConsultingDiagram,
};

export default function ServicePreviewArt({
  id,
  accent,
  labels,
}) {
  const Diagram = ART[id] || OdooDiagram;
  const base = DEFAULT_LABELS[id] || DEFAULT_LABELS.odoo;
  const translated =
    labels &&
    labels.diagram &&
    typeof labels.diagram === "object" &&
    !Array.isArray(labels.diagram)
      ? labels.diagram
      : {};
  const D = { ...base, ...translated };

  return <Diagram accent={accent} D={D} />;
}
