/* Centralized content for the DevOps & Observability service page (/devops-observability).
   Consumed via t("serviceDetail.devops.*"). Icons stay in the component.
   NOTE: useCases items carry {tag,title,desc}, the page renders tag pills,
   not Odoo-style flow strips, so no flow[] keys are stored here. */

const en = {
  meta: {
    title: "DevOps & Observability",
    description:
      "Bring deployment, runtime visibility, monitoring and alerts together so teams understand system behavior and respond with context.",
    keywords:
      "observability, application monitoring, logs, metrics, health checks, alerts, devops services",
    schemaName: "DevOps & Observability",
    schemaDesc:
      "Observability services: deployment visibility, monitoring, logs, metrics, health checks and contextual alerts.",
  },
  hero: {
    eyebrow: "DevOps & Observability",
    title: "Know what your systems are doing",
    highlight: "before something breaks.",
    description:
      "Bring deployment, runtime visibility, monitoring and alerts together, so teams understand system behavior and respond to issues with context, not guesswork.",
    primaryCta: "Discuss observability",
    secondaryCta: "See the loop",
  },
  problem: {
    eyebrow: "Why observability",
    title: "When something changes,",
    highlight: "your team should know why.",
    beforeLabel: "WITHOUT OBSERVABILITY",
    beforeItems: [
      "Runtime failures surface through customer reports",
      "Logs scattered across systems nobody reads together",
      "No clear answer on what is healthy, or what else breaks with it",
      "Alerts arrive with no logs, changes or next step",
    ],
    afterLabel: "WITH OBSERVABILITY",
    afterItems: [
      "Failures detected before customers notice them",
      "Logs collected in one searchable place",
      "Health and impact visible at a glance",
      "Every alert carries context and a next step",
    ],
  },
  capabilities: {
    eyebrow: "Capabilities",
    title: "Visibility, layer by layer.",
    items: [
      {
        title: "Deployment visibility",
        desc: "See what is running, which version went out, and when, so a new problem can be traced back to a specific change.",
      },
      {
        title: "Application monitoring",
        desc: "Runtime behavior of applications and services watched continuously, with the signals that matter surfaced first.",
      },
      {
        title: "Logs",
        desc: "Application and workflow logs collected in one place, searchable when something needs explaining.",
      },
      {
        title: "Metrics",
        desc: "Key numbers tracked over time, throughput, errors, durations, so unusual behavior stands out early.",
      },
      {
        title: "Health checks",
        desc: "Simple, regular checks that answer one question: is this system doing what it should right now?",
      },
      {
        title: "Alerts with context",
        desc: "Notifications that arrive with the relevant logs, metrics and recent changes attached, not just a red light.",
      },
    ],
  },
  architecture: {
    eyebrow: "Architecture",
    title: "One layer watching everything.",
    desc: "Applications, services, databases and workers all feed the same observability layer. Signals are collected together, so an alert about one part of the system arrives with the state of the rest attached.",
  },
  diagram: {
    hero: {
      aria: "Observability loop: deploy flows to runtime, signals from metrics, logs and health feed detection, alerts notify the team, response leads to improvement which loops back",
      steps: [
        { t: "DEPLOY" },
        { t: "RUNTIME" },
        { t: "SIGNALS", chips: ["METRICS", "LOGS", "HEALTH"] },
        { t: "DETECT", s: "unusual behavior" },
        { t: "ALERT", s: "notify team" },
        { t: "RESPOND" },
        { t: "IMPROVE" },
      ],
    },
    flow: {
      aria: "Observability flow: deployment leads to runtime, signals feed detection, and response improves the system",
      steps: [
        {
          title: "Deployment",
          desc: "Releases tracked by version, so new behavior traces to a change.",
        },
        {
          title: "Runtime",
          desc: "Applications and services watched continuously in production.",
        },
        {
          title: "Signals",
          desc: "Logs, metrics and health checks collected in one place.",
        },
        {
          title: "Detection",
          desc: "Thresholds and checks flag unusual behavior as it happens.",
        },
        {
          title: "Response",
          desc: "Alerts arrive with context, and responses improve the system.",
        },
      ],
    },
  },
  demo: {
    aria: "Interactive observability demo: simulate an incident and watch latency, error rate, logs and the engineering response",
    services: { api: "API", worker: "Worker", database: "Database" },
    metrics: {
      latency: "API latency",
      errorRate: "Error rate",
      requests: "Requests",
      health: "Health",
    },
    panel: {
      statusLabel: "Status",
      open: "Investigating",
      resolved: "Resolved",
    },
    status: {
      healthy: "Healthy",
      warning: "Warning",
      incident: "Incident",
      recovered: "Recovered",
    },
    simulate: "Simulate incident",
    reset: "Reset",
    timeline: ["Detected", "Correlated", "Responded", "Recovered"],
    idleLogs: [
      "GET /orders 200 in 42 ms",
      "worker: queue drained, 14 jobs done",
      "health check: database ok",
    ],
    eventLogs: [
      "GET /orders p99 in 91 ms",
      "GET /orders p99 in 184 ms",
      "API timeout on POST /payments",
      "Request failed, retry threshold reached",
      "error budget burn at 4.8%",
      "incident INC-2041 opened",
      "runbook: deploy v2.14.2 diff attached",
      "GET /orders 200 in 96 ms",
      "GET /orders 200 in 61 ms",
      "incident INC-2041 resolved",
    ],
    incidentTitle: "Incident correlated",
    incidentDesc:
      "Error rate crossed threshold on the API. Recent deploy and failing endpoint attached.",
    responseTitle: "Engineering response triggered",
    responseDesc:
      "Runbook opened with logs, metrics and the failing service. Rollback prepared.",
    recoveredNote:
      "Service recovered. Latency and error rate are back within threshold.",
  },
  loop: {
    eyebrow: "The loop",
    title: "Every signal has somewhere to go.",
    desc: "Observability is not a dashboard, it is a loop. Systems emit signals, the team observes them, unusual behavior raises an alert, the response improves the system, and the loop starts again.",
  },
  process: {
    eyebrow: "How it works",
    title: "Instrument, observe, detect, respond.",
    steps: [
      {
        title: "Instrument",
        desc: "We expose the signals that matter: logs, metrics and health endpoints on the systems being watched.",
      },
      {
        title: "Observe",
        desc: "Metrics, logs and health information are collected where the team can see them together.",
      },
      {
        title: "Detect",
        desc: "Thresholds and checks identify unusual behavior or outright failures as they happen.",
      },
      {
        title: "Respond",
        desc: "Alerts arrive with enough context, what changed, what broke, where to look, to act on.",
      },
    ],
  },
  tech: {
    eyebrow: "Technology",
    title: "Signals, grouped by job.",
    desc: "Observability is assembled from watched systems, collected signals and response tooling, each group has one clear responsibility.",
    groups: [
      {
        role: "Watched systems",
        items: ["Applications", "Services", "Databases", "Workers", "n8n workflows", "API integrations"],
      },
      {
        role: "Signals",
        items: ["Logs", "Metrics", "Health checks", "Deployment events"],
      },
      {
        role: "Detection",
        items: ["Thresholds", "Failure checks", "Unusual-behavior review"],
      },
      {
        role: "Response",
        items: ["Contextual alerts", "Incident context", "Handover notes"],
      },
    ],
  },
  useCases: {
    eyebrow: "Use cases",
    title: "What stays visible.",
    items: [
      {
        tag: "Production",
        title: "Application health monitoring",
        desc: "Business applications and customer-facing tools watched continuously, with health checks confirming they behave as expected.",
      },
      {
        tag: "Automation",
        title: "Workflow monitoring",
        desc: "n8n and automation workflows observed for failures, stuck runs and unusual durations, before users notice.",
      },
      {
        tag: "Connectivity",
        title: "API & integration visibility",
        desc: "The integrations from the rest of the stack stay observable: call volumes, errors and latency trends in view.",
      },
      {
        tag: "Background work",
        title: "Background worker monitoring",
        desc: "Queues, schedulers and background jobs checked for progress and failure, with alerts that carry the job context.",
      },
    ],
  },
  engagement: {
    eyebrow: "Delivery",
    title: "What the implementation includes.",
    items: [
      "Signal inventory, what gets logged, measured and checked",
      "Health endpoints on applications and key workflows",
      "Log collection with searchable, centralized access",
      "Alert rules with thresholds tuned to real behavior",
      "Incident context, recent changes attached to every alert",
      "Handover notes your team can maintain",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Observability, answered directly.",
    items: [
      {
        q: "Does this replace our hosting or deployment process?",
        a: "No. Observability sits alongside how you already deploy, it adds visibility, health signals and alerts over your existing applications, services and workflows.",
      },
      {
        q: "What signals do you actually collect?",
        a: "Logs, metrics, health-check status and deployment events, scoped to what your team needs to understand behavior and find failures, not everything measurable.",
      },
      {
        q: "How do you avoid alert fatigue?",
        a: "Thresholds are tuned to real behavior, and every alert carries context, the relevant logs, metrics and recent changes, so notifications mean something actionable.",
      },
      {
        q: "What happens after an alert fires?",
        a: "The team gets the failure plus its context: what changed recently, where to look, and which system is affected. Responses feed back into better checks.",
      },
      {
        q: "Is this only for large engineering teams?",
        a: "No. Smaller teams start with the critical systems, the workflows and applications the business depends on, and expand coverage as needed.",
      },
    ],
  },
  related: {
    eyebrow: "Keep exploring",
    title: "Related services.",
    linkLabel: "Explore",
    items: [
      {
        title: "Workflow Automation",
        desc: "Automate repetitive operations across the tools you already use.",
        href: "/workflow-automation",
      },
      {
        title: "System Integration & APIs",
        desc: "Connect Odoo, CRMs and business systems into one flow.",
        href: "/system-integrations",
      },
      {
        title: "AI Automation & Agents",
        desc: "AI agents and intelligent workflows that remove manual work.",
        href: "/ai-automation",
      },
    ],
  },
  ctaOrbit: {
    eyebrow: "Ready to see what's happening?",
    title: "Make your systems easier",
    highlight: "to observe and operate.",
    desc: "Detect anomalies, understand system behavior and respond before operational issues become larger problems.",
    button: "Discuss AIOps",
    diagram: {
      center: "AIOps",
      centerSub: "Live system monitor",
      nodes: [
        { t: "Observe", s: "Logs and metrics" },
        { t: "Detect", s: "Anomalies" },
        { t: "Analyze", s: "AI correlation" },
        { t: "Respond", s: "Alert and remediate" },
      ],
    },
  },
  cta: {
    eyebrow: "Ready when you are",
    title: "Visibility is",
    highlight: "part of the system.",
    desc: "Build systems your team can understand, monitor and improve, instead of systems you hope are working.",
    button: "Plan observability",
  },
};

const nl = {
  meta: {
    title: "DevOps & Observability",
    description:
      "Breng deployment, runtime-inzicht, monitoring en alarmen samen, zodat teams systeemgedrag begrijpen en met context reageren.",
    keywords:
      "observability, applicatiemonitoring, logs, metrieken, healthchecks, alarmen, devops-diensten",
    schemaName: "DevOps & Observability",
    schemaDesc:
      "Observability-diensten: deployment-inzicht, monitoring, logs, metrieken, healthchecks en alarmen met context.",
  },
  hero: {
    eyebrow: "DevOps & Observability",
    title: "Weet wat uw systemen doen",
    highlight: "voordat er iets breekt.",
    description:
      "Breng deployment, runtime-inzicht, monitoring en alarmen samen, zodat teams systeemgedrag begrijpen en met context reageren, niet op gevoel.",
    primaryCta: "Bespreek observability",
    secondaryCta: "Bekijk de lus",
  },
  problem: {
    eyebrow: "Waarom observability",
    title: "Als er iets verandert,",
    highlight: "moet uw team weten waarom.",
    beforeLabel: "ZONDER OBSERVABILITY",
    beforeItems: [
      "Runtimefouten komen pas via klantmeldingen aan het licht",
      "Logs verspreid over systemen die niemand samen leest",
      "Geen helder antwoord op wat gezond is, of wat mee breekt",
      "Alarmen zonder logs, wijzigingen of vervolgstap",
    ],
    afterLabel: "MET OBSERVABILITY",
    afterItems: [
      "Fouten gedetecteerd voordat klanten ze merken",
      "Logs verzameld op één doorzoekbare plek",
      "Gezondheid en impact in één oogopslag zichtbaar",
      "Elk alarm met context en een vervolgstap",
    ],
  },
  capabilities: {
    eyebrow: "Mogelijkheden",
    title: "Zichtbaarheid, laag voor laag.",
    items: [
      {
        title: "Deployment-inzicht",
        desc: "Zie wat draait, welke versie is uitgerold en wanneer, zodat een nieuw probleem naar een specifieke wijziging te herleiden is.",
      },
      {
        title: "Applicatiemonitoring",
        desc: "Runtimegedrag van applicaties en services continu bewaakt, met de belangrijkste signalen eerst.",
      },
      {
        title: "Logs",
        desc: "Applicatie- en workflowlogs verzameld op één plek, doorzoekbaar wanneer iets uitleg nodig heeft.",
      },
      {
        title: "Metrieken",
        desc: "Kerncijfers gevolgd in de tijd, doorvoer, fouten, doorlooptijden, zodat afwijkend gedrag vroeg opvalt.",
      },
      {
        title: "Healthchecks",
        desc: "Eenvoudige, regelmatige controles die één vraag beantwoorden: doet dit systeem nu wat het moet doen?",
      },
      {
        title: "Alarmen met context",
        desc: "Meldingen met relevante logs, metrieken en recente wijzigingen erbij, niet alleen een rood lampje.",
      },
    ],
  },
  architecture: {
    eyebrow: "Architectuur",
    title: "Eén laag die alles bewaakt.",
    desc: "Applicaties, services, databases en workers voeden dezelfde observability-laag. Signalen worden samen verzameld, zodat een alarm over één deel van het systeem arriveert met de status van de rest erbij.",
  },
  diagram: {
    hero: {
      aria: "Observability-lus: uitrol stroomt naar runtime, signalen uit metrieken, logs en health voeden detectie, alarmen informeren het team, respons leidt tot verbetering en de lus begint opnieuw",
      steps: [
        { t: "UITROL" },
        { t: "RUNTIME" },
        { t: "SIGNALEN", chips: ["METRIEKEN", "LOGS", "HEALTH"] },
        { t: "DETECTIE", s: "afwijkend gedrag" },
        { t: "ALARM", s: "informeer team" },
        { t: "RESPONS" },
        { t: "VERBETERING" },
      ],
    },
    flow: {
      aria: "Observability-stroom: uitrol leidt naar runtime, signalen voeden detectie, en respons verbetert het systeem",
      steps: [
        {
          title: "Uitrol",
          desc: "Releases gevolgd per versie, zodat nieuw gedrag naar een wijziging te herleiden is.",
        },
        {
          title: "Runtime",
          desc: "Applicaties en services continu bewaakt in productie.",
        },
        {
          title: "Signalen",
          desc: "Logs, metrieken en healthchecks samen op één plek.",
        },
        {
          title: "Detectie",
          desc: "Drempels en controles signaleren afwijkend gedrag zodra het gebeurt.",
        },
        {
          title: "Respons",
          desc: "Alarmen arriveren met context, en respons verbetert het systeem.",
        },
      ],
    },
  },
  demo: {
    aria: "Interactieve observability-demo: simuleer een incident en bekijk latency, foutpercentage, logs en de engineeringrespons",
    services: { api: "API", worker: "Worker", database: "Database" },
    metrics: {
      latency: "API-latency",
      errorRate: "Foutpercentage",
      requests: "Aanvragen",
      health: "Status",
    },
    panel: {
      statusLabel: "Status",
      open: "Onderzoek loopt",
      resolved: "Opgelost",
    },
    status: {
      healthy: "Gezond",
      warning: "Waarschuwing",
      incident: "Incident",
      recovered: "Hersteld",
    },
    simulate: "Simuleer incident",
    reset: "Opnieuw",
    timeline: ["Gedetecteerd", "Gecorreleerd", "Gereageerd", "Hersteld"],
    idleLogs: [
      "GET /orders 200 in 42 ms",
      "worker: wachtrij geleegd, 14 jobs klaar",
      "healthcheck: database ok",
    ],
    eventLogs: [
      "GET /orders p99 in 91 ms",
      "GET /orders p99 in 184 ms",
      "API-timeout op POST /payments",
      "Aanvraag mislukt, retry-drempel bereikt",
      "foutbudget op 4,8%",
      "incident INC-2041 geopend",
      "runbook: diff van deploy v2.14.2 bijgevoegd",
      "GET /orders 200 in 96 ms",
      "GET /orders 200 in 61 ms",
      "incident INC-2041 opgelost",
    ],
    incidentTitle: "Incident gecorreleerd",
    incidentDesc:
      "Foutpercentage overschreed de drempel op de API. Recente deploy en falend endpoint bijgevoegd.",
    responseTitle: "Engineeringrespons gestart",
    responseDesc:
      "Runbook geopend met logs, metrieken en de falende service. Rollback voorbereid.",
    recoveredNote:
      "Service hersteld. Latency en foutpercentage weer binnen de drempel.",
  },
  loop: {
    eyebrow: "De lus",
    title: "Elk signaal heeft een bestemming.",
    desc: "Observability is geen dashboard, het is een lus. Systemen zenden signalen uit, het team observeert ze, afwijkend gedrag wekt een alarm, de respons verbetert het systeem, en de lus begint opnieuw.",
  },
  process: {
    eyebrow: "Hoe het werkt",
    title: "Instrumenteren, observeren, detecteren, reageren.",
    steps: [
      {
        title: "Instrumenteren",
        desc: "Wij leggen de signalen bloot die ertoe doen: logs, metrieken en health-eindpunten op de bewaakte systemen.",
      },
      {
        title: "Observeren",
        desc: "Metrieken, logs en health-informatie worden verzameld waar het team ze samen ziet.",
      },
      {
        title: "Detecteren",
        desc: "Drempels en controles herkennen afwijkend gedrag of regelrechte fouten zodra ze gebeuren.",
      },
      {
        title: "Reageren",
        desc: "Alarmen arriveren met voldoende context, wat veranderde, wat brak, waar te kijken, om op te handelen.",
      },
    ],
  },
  tech: {
    eyebrow: "Technologie",
    title: "Signalen, gegroepeerd per taak.",
    desc: "Observability is opgebouwd uit bewaakte systemen, verzamelde signalen en responstooling, elke groep met één duidelijke verantwoordelijkheid.",
    groups: [
      {
        role: "Bewaakte systemen",
        items: ["Applicaties", "Services", "Databases", "Workers", "n8n-workflows", "API-koppelingen"],
      },
      {
        role: "Signalen",
        items: ["Logs", "Metrieken", "Healthchecks", "Deploymentevents"],
      },
      {
        role: "Detectie",
        items: ["Drempels", "Foutcontroles", "Beoordeling afwijkend gedrag"],
      },
      {
        role: "Respons",
        items: ["Contextuele alarmen", "Incidentcontext", "Overdrachtsnotities"],
      },
    ],
  },
  useCases: {
    eyebrow: "Gebruiksgevallen",
    title: "Wat zichtbaar blijft.",
    items: [
      {
        tag: "Productie",
        title: "Healthmonitoring van applicaties",
        desc: "Bedrijfsapplicaties en klantgerichte tools continu bewaakt, met healthchecks die bevestigen dat ze zich gedragen zoals verwacht.",
      },
      {
        tag: "Automatisering",
        title: "Workflowmonitoring",
        desc: "n8n- en automatiseringsworkflows bewaakt op fouten, vastgelopen runs en ongebruikelijke doorlooptijden, voordat gebruikers het merken.",
      },
      {
        tag: "Connectiviteit",
        title: "Zichtbaarheid op API's en koppelingen",
        desc: "De koppelingen uit de rest van de stack blijven observeerbaar: volumes, fouten en latencytrends in beeld.",
      },
      {
        tag: "Achtergrondwerk",
        title: "Monitoring van achtergrondworkers",
        desc: "Wachtrijen, planners en achtergrondtaken gecontroleerd op voortgang en fouten, met alarmen die de taakcontext meedragen.",
      },
    ],
  },
  engagement: {
    eyebrow: "Oplevering",
    title: "Wat de implementatie omvat.",
    items: [
      "Signaalinventarisatie: wat wordt gelogd, gemeten en gecontroleerd",
      "Health-eindpunten op applicaties en kernworkflows",
      "Logverzameling met doorzoekbare, centrale toegang",
      "Alarmregels met drempels afgestemd op echt gedrag",
      "Incidentcontext: recente wijzigingen bij elk alarm",
      "Overdrachtsnotities die uw team kan onderhouden",
    ],
  },
  faq: {
    eyebrow: "Vragen",
    title: "Observability, direct beantwoord.",
    items: [
      {
        q: "Vervangt dit onze hosting of deployment?",
        a: "Nee. Observability staat naast hoe u al uitrolt, het voegt zichtbaarheid, healthsignalen en alarmen toe over uw bestaande applicaties, services en workflows.",
      },
      {
        q: "Welke signalen verzamelen jullie concreet?",
        a: "Logs, metrieken, healthcheckstatus en deploymentevents, toegespitst op wat uw team nodig heeft om gedrag te begrijpen en fouten te vinden, niet alles wat meetbaar is.",
      },
      {
        q: "Hoe voorkomen jullie alarmmoeheid?",
        a: "Drempels zijn afgestemd op echt gedrag, en elk alarm draagt context, de relevante logs, metrieken en recente wijzigingen, zodat meldingen iets betekenen waarop te handelen valt.",
      },
      {
        q: "Wat gebeurt er nadat een alarm afgaat?",
        a: "Het team krijgt de fout plus context: wat recent veranderde, waar te kijken, en welk systeem geraakt is. Responses voeden betere controles.",
      },
      {
        q: "Is dit alleen voor grote engineeringteams?",
        a: "Nee. Kleinere teams beginnen bij de kritieke systemen, de workflows en applicaties waarvan het bedrijf afhangt, en breiden dekking uit waar nodig.",
      },
    ],
  },
  related: {
    eyebrow: "Blijf ontdekken",
    title: "Gerelateerde diensten.",
    linkLabel: "Bekijk",
    items: [
      {
        title: "Workflowautomatisering",
        desc: "Automatiseer terugkerende operatie in de tools die u al gebruikt.",
        href: "/workflow-automation",
      },
      {
        title: "Systeemkoppelingen & API's",
        desc: "Koppel Odoo, CRM's en bedrijfssystemen in één stroom.",
        href: "/system-integrations",
      },
      {
        title: "AI-automatisering & Agents",
        desc: "AI-agents en intelligente workflows die handmatig werk wegnemen.",
        href: "/ai-automation",
      },
    ],
  },
  ctaOrbit: {
    eyebrow: "Klaar om te zien wat er gebeurt?",
    title: "Maak uw systemen makkelijker",
    highlight: "te observeren en bedienen.",
    desc: "Detecteer afwijkingen, begrijp systeemgedrag en reageer voordat operationele problemen groter worden.",
    button: "Bespreek AIOps",
    diagram: {
      center: "AIOps",
      centerSub: "Live systeemmonitor",
      nodes: [
        { t: "Observeren", s: "Logs en metrieken" },
        { t: "Detecteren", s: "Afwijkingen" },
        { t: "Analyseren", s: "AI-correlatie" },
        { t: "Reageren", s: "Alarm en herstel" },
      ],
    },
  },
  cta: {
    eyebrow: "Klaar wanneer u dat bent",
    title: "Zichtbaarheid is",
    highlight: "onderdeel van het systeem.",
    desc: "Bouw systemen die uw team kan begrijpen, monitoren en verbeteren, in plaats van systemen waarvan u hoopt dat ze werken.",
    button: "Plan observability",
  },
};

const de = {
  meta: {
    title: "DevOps & Observability",
    description:
      "Deployment, Runtime-Einblick, Monitoring und Alarme zusammenbringen, damit Teams Systemverhalten verstehen und mit Kontext reagieren.",
    keywords:
      "Observability, Anwendungsmonitoring, Logs, Metriken, Healthchecks, Alarme, DevOps-Leistungen",
    schemaName: "DevOps & Observability",
    schemaDesc:
      "Observability-Leistungen: Deployment-Einblick, Monitoring, Logs, Metriken, Healthchecks und Alarme mit Kontext.",
  },
  hero: {
    eyebrow: "DevOps & Observability",
    title: "Wissen, was Ihre Systeme tun,",
    highlight: "bevor etwas bricht.",
    description:
      "Deployment, Runtime-Einblick, Monitoring und Alarme zusammenbringen, damit Teams Systemverhalten verstehen und mit Kontext statt Bauchgefühl reagieren.",
    primaryCta: "Observability besprechen",
    secondaryCta: "Die Schleife ansehen",
  },
  problem: {
    eyebrow: "Warum Observability",
    title: "Wenn sich etwas ändert,",
    highlight: "sollte Ihr Team wissen, warum.",
    beforeLabel: "OHNE OBSERVABILITY",
    beforeItems: [
      "Laufzeitfehler fallen erst durch Kundenmeldungen auf",
      "Logs verstreut über Systeme, die niemand gemeinsam liest",
      "Keine klare Antwort, was gesund ist oder was mit ausfällt",
      "Alarme ohne Logs, Änderungen oder nächsten Schritt",
    ],
    afterLabel: "MIT OBSERVABILITY",
    afterItems: [
      "Fehler erkannt, bevor Kunden sie bemerken",
      "Logs gesammelt an einem durchsuchbaren Ort",
      "Gesundheit und Auswirkung auf einen Blick",
      "Jeder Alarm mit Kontext und nächstem Schritt",
    ],
  },
  capabilities: {
    eyebrow: "Leistungen",
    title: "Sichtbarkeit, Schicht für Schicht.",
    items: [
      {
        title: "Deployment-Einblick",
        desc: "Sehen, was läuft, welche Version rauskam und wann, sodass ein neues Problem auf eine konkrete Änderung rückführbar ist.",
      },
      {
        title: "Anwendungsmonitoring",
        desc: "Laufzeitverhalten von Applikationen und Services kontinuierlich überwacht, mit den wichtigsten Signalen zuerst.",
      },
      {
        title: "Logs",
        desc: "Anwendungs- und Workflow-Logs an einem Ort gesammelt, durchsuchbar, wenn etwas Erklärung braucht.",
      },
      {
        title: "Metriken",
        desc: "Kennzahlen über Zeit verfolgt, Durchsatz, Fehler, Laufzeiten, sodass ungewöhnliches Verhalten früh auffällt.",
      },
      {
        title: "Healthchecks",
        desc: "Einfache, regelmäßige Prüfungen mit einer Frage: tut dieses System gerade, was es soll?",
      },
      {
        title: "Alarme mit Kontext",
        desc: "Benachrichtigungen mit relevanten Logs, Metriken und letzten Änderungen, nicht nur ein rotes Licht.",
      },
    ],
  },
  architecture: {
    eyebrow: "Architektur",
    title: "Eine Schicht, die alles beobachtet.",
    desc: "Applikationen, Services, Datenbanken und Worker speisen dieselbe Observability-Schicht. Signale werden gemeinsam gesammelt, sodass ein Alarm zu einem Systemteil mit dem Zustand des Rests ankommt.",
  },
  diagram: {
    hero: {
      aria: "Observability-Schleife: Deployment fließt in Laufzeit, Signale aus Metriken, Logs und Health speisen Erkennung, Alarme informieren das Team, Reaktion führt zu Verbesserung und die Schleife beginnt von vorn",
      steps: [
        { t: "DEPLOYMENT" },
        { t: "LAUFZEIT" },
        { t: "SIGNALE", chips: ["METRIKEN", "LOGS", "HEALTH"] },
        { t: "ERKENNUNG", s: "ungewöhnliches Verhalten" },
        { t: "ALARM", s: "Team benachrichtigen" },
        { t: "REAKTION" },
        { t: "VERBESSERUNG" },
      ],
    },
    flow: {
      aria: "Observability-Fluss: Deployment führt zu Laufzeit, Signale speisen Erkennung, und Reaktion verbessert das System",
      steps: [
        {
          title: "Deployment",
          desc: "Releases per Version verfolgt, sodass neues Verhalten auf eine Änderung rückführbar ist.",
        },
        {
          title: "Laufzeit",
          desc: "Applikationen und Services in Produktion kontinuierlich überwacht.",
        },
        {
          title: "Signale",
          desc: "Logs, Metriken und Healthchecks gemeinsam an einem Ort.",
        },
        {
          title: "Erkennung",
          desc: "Schwellen und Checks melden ungewöhnliches Verhalten, sobald es passiert.",
        },
        {
          title: "Reaktion",
          desc: "Alarme kommen mit Kontext, und jede Reaktion verbessert das System.",
        },
      ],
    },
  },
  demo: {
    aria: "Interaktive Observability-Demo: Incident simulieren und Latenz, Fehlerrate, Logs und Engineering-Reaktion verfolgen",
    services: { api: "API", worker: "Worker", database: "Datenbank" },
    metrics: {
      latency: "API-Latenz",
      errorRate: "Fehlerrate",
      requests: "Anfragen",
      health: "Status",
    },
    panel: {
      statusLabel: "Status",
      open: "Untersuchung läuft",
      resolved: "Behoben",
    },
    status: {
      healthy: "Gesund",
      warning: "Warnung",
      incident: "Incident",
      recovered: "Behoben",
    },
    simulate: "Incident simulieren",
    reset: "Zurücksetzen",
    timeline: ["Erkannt", "Korreliert", "Reagiert", "Behoben"],
    idleLogs: [
      "GET /orders 200 in 42 ms",
      "Worker: Queue geleert, 14 Jobs fertig",
      "Healthcheck: Datenbank ok",
    ],
    eventLogs: [
      "GET /orders p99 in 91 ms",
      "GET /orders p99 in 184 ms",
      "API-Timeout bei POST /payments",
      "Anfrage fehlgeschlagen, Retry-Schwelle erreicht",
      "Fehlerbudget bei 4,8%",
      "Incident INC-2041 geöffnet",
      "Runbook: Diff von Deploy v2.14.2 angehängt",
      "GET /orders 200 in 96 ms",
      "GET /orders 200 in 61 ms",
      "Incident INC-2041 behoben",
    ],
    incidentTitle: "Incident korreliert",
    incidentDesc:
      "Fehlerrate überschritt den Schwellenwert der API. Letztes Deploy und fehlerhafter Endpoint angehängt.",
    responseTitle: "Engineering-Reaktion ausgelöst",
    responseDesc:
      "Runbook geöffnet mit Logs, Metriken und fehlerhaftem Service. Rollback vorbereitet.",
    recoveredNote:
      "Service wiederhergestellt. Latenz und Fehlerrate zurück im Schwellenbereich.",
  },
  loop: {
    eyebrow: "Die Schleife",
    title: "Jedes Signal hat ein Ziel.",
    desc: "Observability ist kein Dashboard, sondern eine Schleife. Systeme senden Signale, das Team beobachtet sie, ungewöhnliches Verhalten löst Alarm aus, die Reaktion verbessert das System, und die Schleife beginnt von vorn.",
  },
  process: {
    eyebrow: "So funktioniert es",
    title: "Instrumentieren, beobachten, erkennen, reagieren.",
    steps: [
      {
        title: "Instrumentieren",
        desc: "Wir legen die Signale offen, die zählen: Logs, Metriken und Health-Endpunkte auf den beobachteten Systemen.",
      },
      {
        title: "Beobachten",
        desc: "Metriken, Logs und Health-Informationen gesammelt, wo das Team sie gemeinsam sieht.",
      },
      {
        title: "Erkennen",
        desc: "Schwellen und Checks erkennen ungewöhnliches Verhalten oder echte Ausfälle, sobald sie passieren.",
      },
      {
        title: "Reagieren",
        desc: "Alarme kommen mit genug Kontext, was sich änderte, was brach, wo zu schauen ist, um zu handeln.",
      },
    ],
  },
  tech: {
    eyebrow: "Technologie",
    title: "Signale, nach Aufgabe gruppiert.",
    desc: "Observability aus beobachteten Systemen, gesammelten Signalen und Reaktions-Tooling, jede Gruppe mit klarer Verantwortung.",
    groups: [
      {
        role: "Beobachtete Systeme",
        items: ["Applikationen", "Services", "Datenbanken", "Worker", "n8n-Workflows", "API-Integrationen"],
      },
      {
        role: "Signale",
        items: ["Logs", "Metriken", "Healthchecks", "Deployment-Events"],
      },
      {
        role: "Erkennung",
        items: ["Schwellen", "Fehlerchecks", "Prüfung ungewöhnlichen Verhaltens"],
      },
      {
        role: "Reaktion",
        items: ["Kontext-Alarme", "Incident-Kontext", "Übergabenotizen"],
      },
    ],
  },
  useCases: {
    eyebrow: "Anwendungsfälle",
    title: "Was sichtbar bleibt.",
    items: [
      {
        tag: "Produktion",
        title: "Health-Monitoring von Applikationen",
        desc: "Geschäftsapplikationen und kundennahe Tools kontinuierlich überwacht, mit Healthchecks, die erwartetes Verhalten bestätigen.",
      },
      {
        tag: "Automatisierung",
        title: "Workflow-Monitoring",
        desc: "n8n- und Automatisierungs-Workflows auf Fehler, hängende Runs und ungewöhnliche Laufzeiten beobachtet, bevor Nutzer es merken.",
      },
      {
        tag: "Konnektivität",
        title: "Sichtbarkeit auf APIs und Integrationen",
        desc: "Die Integrationen des Stacks bleiben beobachtbar: Volumen, Fehler und Latenztrends im Blick.",
      },
      {
        tag: "Hintergrundarbeit",
        title: "Monitoring von Hintergrund-Workern",
        desc: "Queues, Scheduler und Hintergrundjobs auf Fortschritt und Fehler geprüft, mit Alarmen samt Job-Kontext.",
      },
    ],
  },
  engagement: {
    eyebrow: "Lieferumfang",
    title: "Was die Implementierung enthält.",
    items: [
      "Signalinventar: was geloggt, gemessen und geprüft wird",
      "Health-Endpunkte auf Applikationen und Kern-Workflows",
      "Log-Sammlung mit durchsuchbarem, zentralem Zugriff",
      "Alarmregeln mit Schwellen abgestimmt auf reales Verhalten",
      "Incident-Kontext: letzte Änderungen an jedem Alarm",
      "Übergabenotizen, die Ihr Team pflegen kann",
    ],
  },
  faq: {
    eyebrow: "Fragen",
    title: "Observability, direkt beantwortet.",
    items: [
      {
        q: "Ersetzt das unser Hosting oder Deployment?",
        a: "Nein. Observability liegt neben Ihrem Deployment, es legt Sichtbarkeit, Health-Signale und Alarme über bestehende Applikationen, Services und Workflows.",
      },
      {
        q: "Welche Signale erfassen Sie konkret?",
        a: "Logs, Metriken, Healthcheck-Status und Deployment-Events, zugeschnitten auf das, was Ihr Team braucht, um Verhalten zu verstehen und Fehler zu finden, nicht alles Messbare.",
      },
      {
        q: "Wie vermeiden Sie Alarmmüdigkeit?",
        a: "Schwellen sind auf reales Verhalten abgestimmt, und jeder Alarm trägt Kontext, relevante Logs, Metriken und letzte Änderungen, sodass Meldungen handlungsrelevant sind.",
      },
      {
        q: "Was passiert nach einem Alarm?",
        a: "Das Team erhält den Fehler samt Kontext: was sich zuletzt änderte, wo zu schauen ist und welches System betroffen ist. Reaktionen speisen bessere Checks.",
      },
      {
        q: "Ist das nur für große Engineering-Teams?",
        a: "Nein. Kleinere Teams starten mit den kritischen Systemen, den Workflows und Applikationen, von denen das Business abhängt, und erweitern bei Bedarf.",
      },
    ],
  },
  related: {
    eyebrow: "Weiter entdecken",
    title: "Verwandte Leistungen.",
    linkLabel: "Entdecken",
    items: [
      {
        title: "Workflow-Automatisierung",
        desc: "Wiederkehrende Operationen in Ihren bestehenden Tools automatisieren.",
        href: "/workflow-automation",
      },
      {
        title: "Systemintegration & APIs",
        desc: "Odoo, CRMs und Geschäftssysteme in einem Fluss verbinden.",
        href: "/system-integrations",
      },
      {
        title: "KI-Automatisierung & Agenten",
        desc: "KI-Agenten und intelligente Workflows, die Handarbeit abnehmen.",
        href: "/ai-automation",
      },
    ],
  },
  ctaOrbit: {
    eyebrow: "Bereit zu sehen, was passiert?",
    title: "Machen Sie Ihre Systeme einfacher",
    highlight: "zu beobachten und zu betreiben.",
    desc: "Erkennen Sie Anomalien, verstehen Sie Systemverhalten und reagieren Sie, bevor Betriebsprobleme größer werden.",
    button: "AIOps besprechen",
    diagram: {
      center: "AIOps",
      centerSub: "Live-Systemmonitor",
      nodes: [
        { t: "Beobachten", s: "Logs und Metriken" },
        { t: "Erkennen", s: "Anomalien" },
        { t: "Analysieren", s: "KI-Korrelation" },
        { t: "Reagieren", s: "Alarm und Behebung" },
      ],
    },
  },
  cta: {
    eyebrow: "Bereit, wenn Sie es sind",
    title: "Sichtbarkeit ist",
    highlight: "Teil des Systems.",
    desc: "Systeme bauen, die Ihr Team verstehen, überwachen und verbessern kann, statt Systeme, die hoffentlich laufen.",
    button: "Observability planen",
  },
};

export const devopsContent = { en, nl, de };
