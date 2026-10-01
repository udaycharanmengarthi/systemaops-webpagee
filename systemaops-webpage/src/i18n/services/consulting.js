/* Centralized content for the AI Consulting service page (/ai-consulting).
   Consumed via t("serviceDetail.consulting.*"). Icons stay in the component. */

const en = {
  meta: {
    title: "AI Consulting",
    description:
      "Identify practical AI opportunities, assess feasibility and build a phased roadmap around measurable business value.",
    keywords:
      "AI consulting, AI strategy, AI opportunity discovery, AI roadmap, automation strategy, AI implementation planning",
    schemaName: "AI Consulting",
    schemaDesc:
      "AI consulting: opportunity discovery, feasibility assessment, roadmap and implementation planning around measurable business value.",
  },
  hero: {
    eyebrow: "AI Consulting",
    title: "Know where AI",
    highlight: "actually pays off.",
    description:
      "Identify practical AI opportunities, prioritize the right workflows, and connect them to the systems your business already uses.",
    primaryCta: "Discuss AI strategy",
    secondaryCta: "See how it works",
  },
  problem: {
    eyebrow: "Why consulting",
    title: "Most AI projects stall",
    highlight: "before they start.",
    beforeLabel: "Without a roadmap",
    beforeItems: [
      "Pilots chosen by novelty instead of business value",
      "No clear owner for data, tools or outcomes",
      "ROI discussed after the build, not before it",
      "One big-bang project instead of phased delivery",
    ],
    afterLabel: "With a clear roadmap",
    afterItems: [
      "Opportunities ranked by impact and feasibility",
      "Scope, owners and success metrics defined up front",
      "Business value estimated before anything is built",
      "A phased path from first win to full rollout",
    ],
  },
  capabilities: {
    eyebrow: "Capabilities",
    title: "What the engagement covers.",
    items: [
      {
        title: "AI opportunity discovery",
        desc: "We map repeatable work and decisions to find where AI removes real hours, not where it demos well.",
      },
      {
        title: "Feasibility assessment",
        desc: "Data availability, integration effort and operating risk checked before a single model is picked.",
      },
      {
        title: "AI roadmap",
        desc: "A phased plan ranked by impact and difficulty, with owners, milestones and success metrics.",
      },
      {
        title: "Architecture planning",
        desc: "Models, tools, guardrails and human checkpoints designed into a system that stays controllable.",
      },
      {
        title: "ROI estimation",
        desc: "Conservative value estimates per opportunity so leadership can compare options on numbers.",
      },
      {
        title: "Implementation planning",
        desc: "A delivery path that connects to your existing systems, teams and operations from day one.",
      },
    ],
  },
  process: {
    eyebrow: "How we work",
    title: "Assess, rank, roadmap, deliver.",
    steps: [
      {
        title: "Assess",
        desc: "We map the operation: workflows, data, decisions and where time actually goes.",
      },
      {
        title: "Rank",
        desc: "Opportunities are scored by business value, feasibility and risk, then compared side by side.",
      },
      {
        title: "Roadmap",
        desc: "The chosen opportunities become a phased plan with owners, milestones and metrics.",
      },
      {
        title: "Deliver",
        desc: "Implementation starts with the highest-value use case and grows from proven results.",
      },
    ],
  },
  tech: {
    eyebrow: "Technology",
    title: "Grounded in real systems.",
    desc: "Consulting outputs map directly onto the systems and automation stack your teams run today.",
    groups: [
      {
        role: "Assessment",
        items: ["Process mapping", "Data inventory", "Decision audit", "Tooling review"],
      },
      {
        role: "Planning",
        items: ["Opportunity scoring", "Feasibility checks", "ROI estimation", "Phased roadmaps"],
      },
      {
        role: "Architecture",
        items: ["AI agents", "n8n workflows", "Odoo ERP", "APIs and integrations"],
      },
      {
        role: "Governance",
        items: ["Guardrails", "Human checkpoints", "Monitoring", "Success metrics"],
      },
    ],
  },
  useCases: {
    eyebrow: "In practice",
    title: "Where consulting pays off.",
    items: [
      {
        title: "Before an AI investment",
        flow: ["Operation mapped", "Opportunities ranked", "Roadmap delivered"],
        desc: "Leadership gets a ranked, costed plan before committing budget to any build.",
      },
      {
        title: "When pilots keep stalling",
        flow: ["Blockers identified", "Scope resized", "Ownership defined"],
        desc: "Existing AI pilots get unstuck by narrowing scope and naming owners and metrics.",
      },
      {
        title: "Scaling one success",
        flow: ["Winning case audited", "Pattern generalized", "Next cases prioritized"],
        desc: "A working use case becomes a repeatable pattern applied to the next opportunities.",
      },
    ],
  },
  engagement: {
    eyebrow: "Delivery",
    title: "What you get.",
    items: [
      "Operation map with where AI fits and where it does not",
      "Ranked opportunity list with value and feasibility scores",
      "Phased roadmap with owners, milestones and metrics",
      "Architecture sketch with tools, guardrails and checkpoints",
      "ROI estimates for each recommended opportunity",
      "Implementation path that connects to your existing systems",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "AI consulting, answered directly.",
    items: [
      {
        q: "Is this only for companies without any AI today?",
        a: "No. We work with teams starting from zero, teams with stalled pilots, and teams ready to scale one success into a program.",
      },
      {
        q: "How do you decide where AI fits?",
        a: "We map where work repeats and where decisions follow patterns, then score each opportunity on value, feasibility and risk. AI is recommended only where the numbers support it.",
      },
      {
        q: "Do we have to commit to building with SystemaOps afterwards?",
        a: "No. The roadmap and assessment are yours. Many clients continue with us for implementation, but the engagement stands on its own.",
      },
      {
        q: "How long does an assessment take?",
        a: "A focused discovery typically runs a few weeks depending on the number of teams involved. You get a ranked roadmap at the end, not a document nobody reads.",
      },
    ],
  },
  related: {
    eyebrow: "Keep exploring",
    title: "Related services.",
    linkLabel: "Explore",
    items: [
      {
        title: "AI Automation",
        desc: "AI agents and intelligent workflows that remove manual work.",
        href: "/ai-automation",
      },
      {
        title: "Workflow Automation",
        desc: "Automate repetitive operations across the tools you already use.",
        href: "/workflow-automation",
      },
      {
        title: "System Integrations",
        desc: "Connect CRM, ERP, databases and internal systems into one ecosystem.",
        href: "/system-integrations",
      },
    ],
  },
  problem3: {
    eyebrow: "The real problem",
    title: "Most AI projects stall before they start.",
    desc: "The problem is rarely the availability of AI tools. The harder problem is knowing where AI should actually be applied.",
    cards: [
      {
        title: "No clear business case",
        desc: "AI gets introduced because it is available, not because it solves a meaningful operational problem.",
      },
      {
        title: "Disconnected systems",
        desc: "Data, workflows and business systems are often fragmented across tools and teams.",
      },
      {
        title: "No path to production",
        desc: "A successful prototype does not automatically become a reliable production system.",
      },
    ],
  },
  framework: {
    eyebrow: "What we do",
    title: "From AI ideas to an executable roadmap.",
    desc: "We work with your team to identify opportunities, validate feasibility and define the path from concept to production.",
    steps: [
      {
        title: "Understand",
        desc: "Map the current operation.",
        points: ["Workflows", "Systems", "Data", "Teams", "Bottlenecks", "Repetitive work"],
      },
      {
        title: "Identify",
        desc: "Find where AI can create meaningful leverage.",
        points: ["Automation", "Document intelligence", "AI agents", "Forecasting", "Decision support", "Knowledge systems"],
      },
      {
        title: "Prioritize",
        desc: "Evaluate opportunities using:",
        points: ["Business impact", "Implementation complexity", "Data readiness", "Integration requirements", "Risk", "Expected ROI"],
      },
      {
        title: "Plan",
        desc: "Create a practical roadmap:",
        points: ["Architecture", "Technology", "Integrations", "Implementation phases", "Governance", "Measurement"],
      },
    ],
  },
  oppmap: {
    eyebrow: "Opportunity map",
    title: "Where could AI create leverage?",
    desc: "Six AI capabilities connected to one business operation. Each capability supports the operation it improves.",
    tabsLabel: "AI capabilities",
    center: "Business operations",
    nodes: [
      {
        id: "agents",
        title: "AI agents",
        desc: "Agents that understand context, use tools and act within defined boundaries.",
        example: "Request to context to tool to action to reviewed result",
      },
      {
        id: "docs",
        title: "Document intelligence",
        desc: "Extract, validate and route information from business documents.",
        example: "RFQs to extraction to validation to structured data to business system",
      },
      {
        id: "workflow",
        title: "Workflow automation",
        desc: "Connect business systems and automate repetitive operational processes.",
        example: "CRM to workflow to approval to ERP to notification",
      },
      {
        id: "knowledge",
        title: "Knowledge systems",
        desc: "Turn internal documentation and business knowledge into usable AI-powered answers.",
        example: "Documents to index to grounded answer to employee",
      },
      {
        id: "decisions",
        title: "Decision support",
        desc: "Help teams analyze information and make faster, more informed operational decisions.",
        example: "Data to analysis to recommendation to decision",
      },
      {
        id: "predictive",
        title: "Predictive systems",
        desc: "Use business data to identify patterns, risks and opportunities.",
        example: "History to patterns to forecast to action",
      },
    ],
  },
  areas: {
    eyebrow: "Opportunity areas",
    title: "Where we help businesses apply AI.",
  },
  timeline6: {
    eyebrow: "Consulting process",
    title: "A practical path from idea to implementation.",
    steps: [
      { title: "Discovery", desc: "Understand the business problem." },
      { title: "Assessment", desc: "Evaluate processes, systems and data." },
      { title: "Opportunity mapping", desc: "Identify high-value AI opportunities." },
      { title: "Prioritization", desc: "Rank opportunities by impact and feasibility." },
      { title: "Roadmap", desc: "Define architecture and implementation phases." },
      { title: "Execution", desc: "Move selected initiatives into production." },
    ],
  },
  deliverables: {
    eyebrow: "Deliverables",
    title: "What you leave with.",
    items: [
      { title: "AI opportunity map", desc: "A structured view of where AI can create value." },
      { title: "Prioritized AI roadmap", desc: "A practical sequence of initiatives." },
      { title: "Solution architecture", desc: "Technical direction for implementation." },
      { title: "Integration plan", desc: "How AI connects with existing systems." },
      { title: "Business case", desc: "Expected impact, effort and measurable outcomes." },
      { title: "Implementation plan", desc: "Clear next steps for moving into execution." },
    ],
  },
  whyus: {
    eyebrow: "Why SystemaOps",
    title: "Strategy is useful only when it can be implemented.",
    desc: "We combine business understanding with engineering capability so recommendations can move beyond presentations and into real systems.",
    cards: [
      { title: "Business-first", desc: "We start with the operational problem, not the technology." },
      { title: "Engineering-led", desc: "Recommendations are grounded in real implementation constraints." },
      { title: "Integration-ready", desc: "AI must work with the systems your business already uses." },
      { title: "Built for execution", desc: "The roadmap can directly become an implementation plan." },
    ],
  },
  systems: {
    eyebrow: "Systems architecture",
    title: "Intelligence connected to your operation.",
    desc: "AI does not replace the business system. It connects intelligence to the existing operating system of the business.",
    center: "AI layer",
    nodes: ["CRM", "ERP", "Databases", "Documents", "APIs", "Internal tools", "Messaging", "Business users"],
  },
  narrative: {
    problem: {
      title: "Most AI projects stall before they start.",
      desc: "The challenge is rarely finding an AI model. It is finding the right problem, data, workflow, and operating boundary.",
      items: [
        { t: "Wrong problem", d: "AI gets applied where the workflow is unclear or the business value is difficult to measure." },
        { t: "Disconnected data", d: "Useful context is spread across documents, databases, applications, and people." },
        { t: "No operating path", d: "A successful prototype still needs ownership, controls, integrations, and a path into production." },
      ],
    },
    framework: {
      title: "From AI ideas to an executable roadmap.",
      desc: "We evaluate AI opportunities against business value, operational fit, data availability, and implementation effort.",
      steps: [
        { t: "Identify", points: ["Business problem", "Workflow friction", "Manual decisions"] },
        { t: "Evaluate", points: ["Data availability", "AI suitability", "Risk boundaries"] },
        { t: "Prioritize", points: ["Business value", "Effort", "Dependencies"] },
        { t: "Plan", points: ["Architecture", "Pilot", "Production path"] },
      ],
    },
    arch: {
      title: "How AI fits into your operation.",
      desc: "Business needs flow through an AI strategy into connected systems, ending in operational outcomes.",
      needs: { label: "BUSINESS NEEDS", items: ["Manual work", "Slow decisions", "Knowledge scattered", "Repetitive processes"] },
      core: { label: "AI STRATEGY", sub: "AI layer", items: ["Opportunity mapping", "Architecture", "Governance"] },
      systems: { label: "CONNECTED SYSTEMS", items: ["CRM", "ERP", "Documents", "Databases", "Internal tools", "Messaging"] },
      outcomes: { label: "OPERATIONAL OUTCOMES", items: ["Less manual work", "Faster decisions", "Better consistency", "Controlled automation"] },
    },
    cases: {
      title: "Where AI can create leverage.",
      desc: "Six areas where AI connects to real operations.",
      items: [
        { t: "Document intelligence", d: "Extract, classify, summarize, and route information from business documents." },
        { t: "Workflow automation", d: "Connect decisions and actions across existing business systems." },
        { t: "Knowledge systems", d: "Make internal knowledge easier to retrieve and use." },
        { t: "Decision support", d: "Give teams structured context before important decisions." },
        { t: "AI agents", d: "Handle defined, controlled tasks across approved tools." },
        { t: "Process intelligence", d: "Identify repetitive work and opportunities for improvement." },
      ],
    },
    path: {
      title: "A practical path from idea to implementation.",
      desc: "A fixed delivery sequence, from discovery to scale.",
      steps: [
        { t: "Discover", d: "Map workflows, systems and where time actually goes." },
        { t: "Assess", d: "Check data, feasibility and risk for each opportunity." },
        { t: "Design", d: "Shape the architecture, tools and boundaries." },
        { t: "Pilot", d: "Prove the highest-value case in production." },
        { t: "Integrate", d: "Connect to existing systems and workflows." },
        { t: "Scale", d: "Turn the proven pattern into a program." },
      ],
    },
    outcomes: {
      title: "What you leave with.",
      items: [
        { t: "AI opportunity map", d: "Where AI fits and where it does not" },
        { t: "Prioritized use cases", d: "Ranked by value and feasibility" },
        { t: "Architecture direction", d: "Tools, guardrails and checkpoints" },
        { t: "Data requirements", d: "What exists and what is missing" },
        { t: "Implementation roadmap", d: "Phases, owners and milestones" },
        { t: "Governance boundaries", d: "Controls and human checkpoints" },
      ],
    },
    strategy: {
      title: "Strategy is useful only when it can be implemented.",
      desc: "Every recommendation is checked against the operation it must run in.",
      items: [
        { t: "Business case", d: "Why this matters" },
        { t: "Data readiness", d: "What information is available" },
        { t: "Technical fit", d: "How it connects" },
        { t: "Implementation path", d: "How it reaches production" },
      ],
    },
    ecosystem: {
      title: "Intelligence connected to your operation.",
      desc: "The AI layer sits between your sources and the tools your teams use.",
      top: ["CRM", "ERP", "Databases", "Documents"],
      core: "AI LAYER",
      bottom: ["Internal tools", "Messaging", "APIs", "Business applications"],
    },
    grounded: {
      title: "Grounded in real systems.",
      desc: "Strategy that maps onto the stack you already run.",
      chips: ["Existing applications", "APIs", "Databases", "Documents", "Business workflows", "Internal tools", "Permissions", "Human review"],
    },
  },
  ctaOrbit: {
    eyebrow: "Ready to find the right AI opportunity?",
    title: "Know where AI can create",
    highlight: "real business value.",
    desc: "Assess your operations, identify practical AI opportunities and build a roadmap around measurable outcomes.",
    button: "Discuss AI strategy",
    diagram: {
      center: "AI Strategy",
      centerSub: "Assess to roadmap",
      nodes: [
        { t: "Assess", s: "Current operations" },
        { t: "Identify", s: "AI opportunities" },
        { t: "Prioritize", s: "Impact and effort" },
        { t: "Roadmap", s: "Phased execution" },
      ],
    },
  },
  cta: {
    eyebrow: "Ready when you are",
    title: "Know where AI could",
    highlight: "create the most impact?",
    desc: "Identify practical AI opportunities and build a roadmap around measurable business value.",
    button: "Discuss AI strategy",
  },
};

const nl = {
  meta: {
    title: "AI-consulting",
    description:
      "Identificeer praktische AI-kansen, beoordeel haalbaarheid en bouw een gefaseerde roadmap rond meetbare bedrijfswaarde.",
    keywords:
      "AI-consulting, AI-strategie, AI-kansdetectie, AI-roadmap, automatiseringsstrategie, AI-implementatieplanning",
    schemaName: "AI-consulting",
    schemaDesc:
      "AI-consulting: kansdetectie, haalbaarheid, roadmap en implementatieplanning rond meetbare bedrijfswaarde.",
  },
  hero: {
    eyebrow: "AI-consulting",
    title: "Weet waar AI",
    highlight: "echt rendeert.",
    description:
      "Identificeer praktische AI-kansen, prioriteer de juiste workflows en verbind ze met de systemen die uw bedrijf al gebruikt.",
    primaryCta: "Bespreek AI-strategie",
    secondaryCta: "Bekijk hoe het werkt",
  },
  problem: {
    eyebrow: "Waarom consulting",
    title: "De meeste AI-projecten stranden",
    highlight: "voordat ze beginnen.",
    beforeLabel: "Zonder roadmap",
    beforeItems: [
      "Pilots gekozen op nieuwigheid in plaats van bedrijfswaarde",
      "Geen duidelijke eigenaar voor data, tools of resultaten",
      "ROI besproken na de bouw, niet ervoor",
      "Eén groot project in plaats van gefaseerde oplevering",
    ],
    afterLabel: "Met een duidelijke roadmap",
    afterItems: [
      "Kansen gerangschikt op impact en haalbaarheid",
      "Scope, eigenaren en succesmetrieken vooraf vastgelegd",
      "Bedrijfswaarde geschat vóór er iets gebouwd wordt",
      "Een gefaseerd pad van eerste winst naar volledige uitrol",
    ],
  },
  capabilities: {
    eyebrow: "Mogelijkheden",
    title: "Wat het traject omvat.",
    items: [
      {
        title: "AI-kansdetectie",
        desc: "Wij brengen herhaalbaar werk en beslissingen in kaart om te zien waar AI echte uren weghaalt.",
      },
      {
        title: "Haalbaarheidsbeoordeling",
        desc: "Databeschikbaarheid, integratie-inspanning en risico gecheckt vóór er een model gekozen wordt.",
      },
      {
        title: "AI-roadmap",
        desc: "Een gefaseerd plan gerangschikt op impact en complexiteit, met eigenaren, mijlpalen en metrieken.",
      },
      {
        title: "Architectuurplanning",
        desc: "Modellen, tools, waarborgen en menselijke controles in een beheersbaar systeem ontworpen.",
      },
      {
        title: "ROI-schatting",
        desc: "Conservatieve waardeschattingen per kans, zodat leiderschap op cijfers kan vergelijken.",
      },
      {
        title: "Implementatieplanning",
        desc: "Een leverpad dat vanaf dag één aansluit op uw bestaande systemen, teams en operatie.",
      },
    ],
  },
  process: {
    eyebrow: "Zo werken wij",
    title: "Beoordelen, rangschikken, plannen, leveren.",
    steps: [
      {
        title: "Beoordelen",
        desc: "Wij brengen de operatie in kaart: workflows, data, beslissingen en waar tijd naartoe gaat.",
      },
      {
        title: "Rangschikken",
        desc: "Kansen scoren op bedrijfswaarde, haalbaarheid en risico, en worden naast elkaar gelegd.",
      },
      {
        title: "Plannen",
        desc: "De gekozen kansen worden een gefaseerd plan met eigenaren, mijlpalen en metrieken.",
      },
      {
        title: "Leveren",
        desc: "Implementatie start met de use case met de hoogste waarde en groeit vanuit bewezen resultaten.",
      },
    ],
  },
  tech: {
    eyebrow: "Technologie",
    title: "Gegrond in echte systemen.",
    desc: "Consulting-output sluit direct aan op de systemen en automatiseringsstack die uw teams vandaag draaien.",
    groups: [
      {
        role: "Beoordeling",
        items: ["Procesmapping", "Data-inventaris", "Beslissingsaudit", "Toolingreview"],
      },
      {
        role: "Planning",
        items: ["Kansenscores", "Haalbaarheidschecks", "ROI-schatting", "Gefaseerde roadmaps"],
      },
      {
        role: "Architectuur",
        items: ["AI-agents", "n8n-workflows", "Odoo ERP", "API's en koppelingen"],
      },
      {
        role: "Governance",
        items: ["Waarborgen", "Menselijke controles", "Monitoring", "Succesmetrieken"],
      },
    ],
  },
  useCases: {
    eyebrow: "In de praktijk",
    title: "Waar consulting rendeert.",
    items: [
      {
        title: "Vóór een AI-investering",
        flow: ["Operatie in kaart", "Kansen gerangschikt", "Roadmap opgeleverd"],
        desc: "Leiderschap krijgt een gerangschikt, gekost plan voordat er budget aan een build wordt vastgelegd.",
      },
      {
        title: "Als pilots blijven steken",
        flow: ["Blokkades gevonden", "Scope verkleind", "Eigenaren bepaald"],
        desc: "Bestaande AI-pilots komen los door scope te verkleinen en eigenaren en metrieken te benoemen.",
      },
      {
        title: "Eén succes opschalen",
        flow: ["Winnende case geaudit", "Patroon gegeneraliseerd", "Volgende kansen geprioriteerd"],
        desc: "Een werkende use case wordt een herhaalbaar patroon voor de volgende kansen.",
      },
    ],
  },
  engagement: {
    eyebrow: "Oplevering",
    title: "Wat u krijgt.",
    items: [
      "Operationele kaart met waar AI past en waar niet",
      "Gerangschikte kansenlijst met waarde- en haalbaarheidsscores",
      "Gefaseerde roadmap met eigenaren, mijlpalen en metrieken",
      "Architectuurschets met tools, waarborgen en controles",
      "ROI-schattingen voor elke aanbevolen kans",
      "Implementatiepad dat aansluit op uw bestaande systemen",
    ],
  },
  faq: {
    eyebrow: "Vragen",
    title: "AI-consulting, direct beantwoord.",
    items: [
      {
        q: "Is dit alleen voor bedrijven zonder AI?",
        a: "Nee. Wij werken met teams die vanaf nul starten, teams met vastgelopen pilots en teams die één succes willen opschalen.",
      },
      {
        q: "Hoe bepaalt u waar AI past?",
        a: "Wij brengen in kaart waar werk herhaalt en beslissingen patronen volgen, en scoren elke kans op waarde, haalbaarheid en risico. AI wordt alleen aangeraden waar de cijfers het ondersteunen.",
      },
      {
        q: "Moeten wij daarna met SystemaOps bouwen?",
        a: "Nee. De roadmap en beoordeling zijn van u. Veel klanten vervolgen met ons voor implementatie, maar het traject staat op zichzelf.",
      },
      {
        q: "Hoe lang duurt een assessment?",
        a: "Een gerichte discovery duurt doorgaans enkele weken, afhankelijk van het aantal teams. U krijgt een gerangschikte roadmap, geen document dat niemand leest.",
      },
    ],
  },
  related: {
    eyebrow: "Blijf ontdekken",
    title: "Gerelateerde diensten.",
    linkLabel: "Bekijk",
    items: [
      {
        title: "AI-automatisering",
        desc: "AI-agents en intelligente workflows die handmatig werk wegnemen.",
        href: "/ai-automation",
      },
      {
        title: "Workflowautomatisering",
        desc: "Automatiseer terugkerende operatie in de tools die u al gebruikt.",
        href: "/workflow-automation",
      },
      {
        title: "Systeemintegraties",
        desc: "Verbind CRM, ERP, databases en interne systemen in één ecosysteem.",
        href: "/system-integrations",
      },
    ],
  },
  problem3: {
    eyebrow: "Het echte probleem",
    title: "De meeste AI-projecten stranden voordat ze beginnen.",
    desc: "Het probleem is zelden de beschikbaarheid van AI-tools. Het moeilijkere probleem is weten waar AI werkelijk moet worden toegepast.",
    cards: [
      {
        title: "Geen duidelijke businesscase",
        desc: "AI wordt geïntroduceerd omdat het beschikbaar is, niet omdat het een betekenisvol operationeel probleem oplost.",
      },
      {
        title: "Losgekoppelde systemen",
        desc: "Data, workflows en bedrijfssystemen zijn vaak versnipperd over tools en teams.",
      },
      {
        title: "Geen pad naar productie",
        desc: "Een succesvol prototype wordt niet automatisch een betrouwbaar productiesysteem.",
      },
    ],
  },
  framework: {
    eyebrow: "Wat wij doen",
    title: "Van AI-ideeën naar een uitvoerbare roadmap.",
    desc: "Wij werken met uw team om kansen te identificeren, haalbaarheid te valideren en het pad van concept naar productie te definiëren.",
    steps: [
      {
        title: "Begrijpen",
        desc: "Breng de huidige operatie in kaart.",
        points: ["Workflows", "Systemen", "Data", "Teams", "Knelpunten", "Herhalend werk"],
      },
      {
        title: "Identificeren",
        desc: "Vind waar AI betekenisvolle hefboom kan creëren.",
        points: ["Automatisering", "Documentintelligentie", "AI-agents", "Forecasting", "Beslissingsondersteuning", "Kennissystemen"],
      },
      {
        title: "Prioriteren",
        desc: "Evalueer kansen aan de hand van:",
        points: ["Bedrijfsimpact", "Implementatiecomplexiteit", "Datareadiness", "Integratievereisten", "Risico", "Verwachte ROI"],
      },
      {
        title: "Plannen",
        desc: "Maak een praktische roadmap:",
        points: ["Architectuur", "Technologie", "Integraties", "Implementatiefasen", "Governance", "Meting"],
      },
    ],
  },
  oppmap: {
    eyebrow: "Kansdetectiekaart",
    title: "Waar kan AI hefboom creëren?",
    desc: "Zes AI-mogelijkheden verbonden met één bedrijfsoperatie. Elke mogelijkheid ondersteunt de operatie die zij verbetert.",
    tabsLabel: "AI-mogelijkheden",
    center: "Bedrijfsoperatie",
    nodes: [
      {
        id: "agents",
        title: "AI-agents",
        desc: "Agents die context begrijpen, tools gebruiken en handelen binnen gedefinieerde grenzen.",
        example: "Verzoek naar context naar tool naar actie naar beoordeeld resultaat",
      },
      {
        id: "docs",
        title: "Documentintelligentie",
        desc: "Extraheer, valideer en routeer informatie uit bedrijfsdocumenten.",
        example: "RFQ's naar extractie naar validatie naar gestructureerde data naar bedrijfssysteem",
      },
      {
        id: "workflow",
        title: "Workflowautomatisering",
        desc: "Verbind bedrijfssystemen en automatiseer terugkerende operationele processen.",
        example: "CRM naar workflow naar goedkeuring naar ERP naar notificatie",
      },
      {
        id: "knowledge",
        title: "Kennissystemen",
        desc: "Maak van interne documentatie bruikbare AI-ondersteunde antwoorden.",
        example: "Documenten naar index naar gegrond antwoord naar medewerker",
      },
      {
        id: "decisions",
        title: "Beslissingsondersteuning",
        desc: "Help teams informatie analyseren en snellere, beter geïnformeerde beslissingen nemen.",
        example: "Data naar analyse naar aanbeveling naar beslissing",
      },
      {
        id: "predictive",
        title: "Voorspellende systemen",
        desc: "Gebruik bedrijfsdata om patronen, risico's en kansen te identificeren.",
        example: "Historie naar patronen naar forecast naar actie",
      },
    ],
  },
  areas: {
    eyebrow: "Kansgebieden",
    title: "Waar wij bedrijven helpen AI toe te passen.",
  },
  timeline6: {
    eyebrow: "Consultingproces",
    title: "Een praktisch pad van idee naar implementatie.",
    steps: [
      { title: "Discovery", desc: "Begrijp het bedrijfsprobleem." },
      { title: "Beoordeling", desc: "Evalueer processen, systemen en data." },
      { title: "Kansdetectie", desc: "Identificeer AI-kansen met hoge waarde." },
      { title: "Prioritering", desc: "Rangschik kansen op impact en haalbaarheid." },
      { title: "Roadmap", desc: "Definieer architectuur en implementatiefasen." },
      { title: "Uitvoering", desc: "Breng geselecteerde initiatieven in productie." },
    ],
  },
  deliverables: {
    eyebrow: "Opleveringen",
    title: "Waar u mee weggaat.",
    items: [
      { title: "AI-kansdetectiekaart", desc: "Een gestructureerd beeld van waar AI waarde kan creëren." },
      { title: "Geprioriteerde AI-roadmap", desc: "Een praktische reeks initiatieven." },
      { title: "Oplossingsarchitectuur", desc: "Technische richting voor implementatie." },
      { title: "Integratieplan", desc: "Hoe AI verbindt met bestaande systemen." },
      { title: "Businesscase", desc: "Verwachte impact, inspanning en meetbare resultaten." },
      { title: "Implementatieplan", desc: "Duidelijke vervolgstappen naar uitvoering." },
    ],
  },
  whyus: {
    eyebrow: "Waarom SystemaOps",
    title: "Strategie is alleen nuttig als ze kan worden geïmplementeerd.",
    desc: "Wij combineren bedrijfsbegrip met engineeringcapaciteit, zodat aanbevelingen verder reiken dan presentaties en in echte systemen belanden.",
    cards: [
      { title: "Business eerst", desc: "Wij starten met het operationele probleem, niet met de technologie." },
      { title: "Engineering-gedreven", desc: "Aanbevelingen zijn gegrond in echte implementatiebeperkingen." },
      { title: "Integratieklaar", desc: "AI moet werken met de systemen die uw bedrijf al gebruikt." },
      { title: "Gebouwd voor uitvoering", desc: "De roadmap kan direct een implementatieplan worden." },
    ],
  },
  systems: {
    eyebrow: "Systeemarchitectuur",
    title: "Intelligentie verbonden met uw operatie.",
    desc: "AI vervangt het bedrijfssysteem niet. Het verbindt intelligentie met het bestaande besturingssysteem van het bedrijf.",
    center: "AI-laag",
    nodes: ["CRM", "ERP", "Databases", "Documenten", "API's", "Interne tools", "Messaging", "Zakelijke gebruikers"],
  },
  narrative: {
    problem: {
      title: "De meeste AI-projecten stranden voordat ze beginnen.",
      desc: "De uitdaging is zelden het vinden van een AI-model. Het is het vinden van het juiste probleem, de juiste data, workflow en operationele grens.",
      items: [
        { t: "Verkeerd probleem", d: "AI wordt toegepast waar de workflow onduidelijk is of de bedrijfswaarde moeilijk te meten is." },
        { t: "Losgekoppelde data", d: "Nuttige context ligt verspreid over documenten, databases, applicaties en mensen." },
        { t: "Geen operationeel pad", d: "Een succesvol prototype heeft nog eigenaarschap, controles, integraties en een pad naar productie nodig." },
      ],
    },
    framework: {
      title: "Van AI-ideeën naar een uitvoerbare roadmap.",
      desc: "Wij beoordelen AI-kansen op bedrijfswaarde, operationele fit, databeschikbaarheid en implementatie-inspanning.",
      steps: [
        { t: "Identificeren", points: ["Bedrijfsprobleem", "Workflowfrictie", "Handmatige beslissingen"] },
        { t: "Evalueren", points: ["Databeschikbaarheid", "AI-geschiktheid", "Risicogrenzen"] },
        { t: "Prioriteren", points: ["Bedrijfswaarde", "Inspanning", "Afhankelijkheden"] },
        { t: "Plannen", points: ["Architectuur", "Pilot", "Productiepad"] },
      ],
    },
    arch: {
      title: "Hoe AI in uw operatie past.",
      desc: "Bedrijfsbehoeften stromen via een AI-strategie naar gekoppelde systemen en eindigen in operationele resultaten.",
      needs: { label: "BEDRIJFSBEHOEFTEN", items: ["Handmatig werk", "Trage beslissingen", "Verspreide kennis", "Herhaalde processen"] },
      core: { label: "AI-STRATEGIE", sub: "AI-laag", items: ["Kansenkaart", "Architectuur", "Governance"] },
      systems: { label: "GEKOPPELDE SYSTEMEN", items: ["CRM", "ERP", "Documenten", "Databases", "Interne tools", "Messaging"] },
      outcomes: { label: "OPERATIONELE RESULTATEN", items: ["Minder handwerk", "Snellere beslissingen", "Betere consistentie", "Gecontroleerde automatisering"] },
    },
    cases: {
      title: "Waar AI hefboomwerking kan creëren.",
      desc: "Zes gebieden waar AI aansluit op echte operaties.",
      items: [
        { t: "Documentintelligentie", d: "Extraheer, classificeer, vat samen en routeer informatie uit bedrijfsdocumenten." },
        { t: "Workflowautomatisering", d: "Verbind beslissingen en acties door bestaande bedrijfssystemen heen." },
        { t: "Kennissystemen", d: "Maak interne kennis makkelijker terug te vinden en te gebruiken." },
        { t: "Beslissingsondersteuning", d: "Geef teams gestructureerde context vóór belangrijke beslissingen." },
        { t: "AI-agents", d: "Voer gedefinieerde, gecontroleerde taken uit via goedgekeurde tools." },
        { t: "Procesintelligentie", d: "Identificeer herhalend werk en verbeterkansen." },
      ],
    },
    path: {
      title: "Een praktisch pad van idee naar implementatie.",
      desc: "Een vaste leveringsreeks, van discovery tot schaal.",
      steps: [
        { t: "Ontdekken", d: "Breng workflows, systemen en waar tijd echt naartoe gaat in kaart." },
        { t: "Beoordelen", d: "Controleer data, haalbaarheid en risico per kans." },
        { t: "Ontwerpen", d: "Vorm de architectuur, tools en grenzen." },
        { t: "Piloten", d: "Bewijs de kans met de hoogste waarde in productie." },
        { t: "Integreren", d: "Verbind met bestaande systemen en workflows." },
        { t: "Schalen", d: "Maak van het bewezen patroon een programma." },
      ],
    },
    outcomes: {
      title: "Waarmee u vertrekt.",
      items: [
        { t: "AI-kansenkaart", d: "Waar AI past en waar niet" },
        { t: "Geprioriteerde use cases", d: "Gerangschikt op waarde en haalbaarheid" },
        { t: "Architectuurrichting", d: "Tools, guardrails en checkpoints" },
        { t: "Datavereisten", d: "Wat er is en wat ontbreekt" },
        { t: "Implementatieroadmap", d: "Fases, eigenaren en mijlpalen" },
        { t: "Governancegrenzen", d: "Controles en menselijke checkpoints" },
      ],
    },
    strategy: {
      title: "Strategie is pas nuttig als ze implementeerbaar is.",
      desc: "Elke aanbeveling wordt getoetst aan de operatie waarin ze moet draaien.",
      items: [
        { t: "Businesscase", d: "Waarom dit ertoe doet" },
        { t: "Datareedheid", d: "Welke informatie beschikbaar is" },
        { t: "Technische fit", d: "Hoe het aansluit" },
        { t: "Implementatiepad", d: "Hoe het productie bereikt" },
      ],
    },
    ecosystem: {
      title: "Intelligentie verbonden met uw operatie.",
      desc: "De AI-laag zit tussen uw bronnen en de tools die uw teams gebruiken.",
      top: ["CRM", "ERP", "Databases", "Documenten"],
      core: "AI-LAAG",
      bottom: ["Interne tools", "Messaging", "API's", "Bedrijfsapplicaties"],
    },
    grounded: {
      title: "Gegrond in echte systemen.",
      desc: "Strategie die aansluit op de stack die u al draait.",
      chips: ["Bestaande applicaties", "API's", "Databases", "Documenten", "Bedrijfsworkflows", "Interne tools", "Rechten", "Menselijke controle"],
    },
  },
  ctaOrbit: {
    eyebrow: "Klaar om de juiste AI-kans te vinden?",
    title: "Weet waar AI echte",
    highlight: "bedrijfswaarde kan creëren.",
    desc: "Beoordeel uw operatie, identificeer praktische AI-kansen en bouw een roadmap rond meetbare resultaten.",
    button: "Bespreek AI-strategie",
    diagram: {
      center: "AI-strategie",
      centerSub: "Van beoordeling naar roadmap",
      nodes: [
        { t: "Beoordelen", s: "Huidige operatie" },
        { t: "Identificeren", s: "AI-kansen" },
        { t: "Prioriteren", s: "Impact en inspanning" },
        { t: "Roadmap", s: "Gefaseerde uitvoering" },
      ],
    },
  },
  cta: {
    eyebrow: "Klaar wanneer u dat bent",
    title: "Weet waar AI de",
    highlight: "meeste impact kan maken?",
    desc: "Identificeer praktische AI-kansen en bouw een roadmap rond meetbare bedrijfswaarde.",
    button: "Bespreek AI-strategie",
  },
};

const de = {
  meta: {
    title: "KI-Beratung",
    description:
      "Praktische KI-Chancen identifizieren, Machbarkeit prüfen und eine phasenweise Roadmap um messbaren Geschäftswert bauen.",
    keywords:
      "KI-Beratung, KI-Strategie, KI-Chancen, KI-Roadmap, Automatisierungsstrategie, KI-Implementierungsplanung",
    schemaName: "KI-Beratung",
    schemaDesc:
      "KI-Beratung: Chancenfindung, Machbarkeit, Roadmap und Umsetzungsplanung rund um messbaren Geschäftswert.",
  },
  hero: {
    eyebrow: "KI-Beratung",
    title: "Wissen, wo KI",
    highlight: "wirklich zahlt.",
    description:
      "Identifizieren Sie praktische KI-Chancen, priorisieren Sie die richtigen Workflows und verbinden Sie sie mit den Systemen, die Ihr Unternehmen bereits nutzt.",
    primaryCta: "KI-Strategie besprechen",
    secondaryCta: "Sehen, wie es funktioniert",
  },
  problem: {
    eyebrow: "Warum Beratung",
    title: "Die meisten KI-Projekte scheitern",
    highlight: "bevor sie starten.",
    beforeLabel: "Ohne Roadmap",
    beforeItems: [
      "Piloten nach Neuheit statt Geschäftswert gewählt",
      "Kein klarer Owner für Daten, Tools oder Ergebnisse",
      "ROI erst nach dem Bau besprochen, nicht davor",
      "Ein Großprojekt statt phasenweiser Lieferung",
    ],
    afterLabel: "Mit klarer Roadmap",
    afterItems: [
      "Chancen nach Wirkung und Machbarkeit gereiht",
      "Scope, Owner und Erfolgsmetriken vorab definiert",
      "Geschäftswert geschätzt, bevor gebaut wird",
      "Phasenweiser Pfad vom ersten Erfolg zum Rollout",
    ],
  },
  capabilities: {
    eyebrow: "Leistungen",
    title: "Was das Engagement umfasst.",
    items: [
      {
        title: "KI-Chancenfindung",
        desc: "Wir mappen wiederkehrende Arbeit und Entscheidungen, um zu sehen, wo KI echte Stunden spart.",
      },
      {
        title: "Machbarkeitsprüfung",
        desc: "Datenverfügbarkeit, Integrationsaufwand und Risiko geprüft, bevor ein Modell gewählt wird.",
      },
      {
        title: "KI-Roadmap",
        desc: "Ein phasenweiser Plan nach Wirkung und Komplexität gereiht, mit Ownern, Meilensteinen und Metriken.",
      },
      {
        title: "Architekturplanung",
        desc: "Modelle, Tools, Leitplanken und menschliche Checks in einem kontrollierbaren System.",
      },
      {
        title: "ROI-Schätzung",
        desc: "Konservative Wertschätzungen je Chance, damit Führung auf Zahlenbasis vergleichen kann.",
      },
      {
        title: "Umsetzungsplanung",
        desc: "Ein Lieferpfad, der ab Tag eins an Ihre bestehenden Systeme und Teams anschließt.",
      },
    ],
  },
  process: {
    eyebrow: "So arbeiten wir",
    title: "Bewerten, reihen, planen, liefern.",
    steps: [
      {
        title: "Bewerten",
        desc: "Wir mappen die Operation: Workflows, Daten, Entscheidungen und wohin Zeit fließt.",
      },
      {
        title: "Reihen",
        desc: "Chancen werden nach Geschäftswert, Machbarkeit und Risiko bewertet und verglichen.",
      },
      {
        title: "Planen",
        desc: "Die gewählten Chancen werden ein phasenweiser Plan mit Ownern, Meilensteinen und Metriken.",
      },
      {
        title: "Liefern",
        desc: "Umsetzung startet mit dem Use Case mit höchstem Wert und wächst aus bewiesenen Ergebnissen.",
      },
    ],
  },
  tech: {
    eyebrow: "Technologie",
    title: "In echten Systemen verankert.",
    desc: "Beratungsergebnisse schließen direkt an die Systeme und den Automatisierungsstack Ihrer Teams an.",
    groups: [
      {
        role: "Bewertung",
        items: ["Prozessmapping", "Dateninventar", "Entscheidungsaudit", "Tooling-Review"],
      },
      {
        role: "Planung",
        items: ["Chancen-Scoring", "Machbarkeitschecks", "ROI-Schätzung", "Phasen-Roadmaps"],
      },
      {
        role: "Architektur",
        items: ["KI-Agenten", "n8n-Workflows", "Odoo ERP", "APIs und Integrationen"],
      },
      {
        role: "Governance",
        items: ["Leitplanken", "Menschliche Checks", "Monitoring", "Erfolgsmetriken"],
      },
    ],
  },
  useCases: {
    eyebrow: "In der Praxis",
    title: "Wo Beratung zahlt.",
    items: [
      {
        title: "Vor einer KI-Investition",
        flow: ["Operation gemappt", "Chancen gereiht", "Roadmap geliefert"],
        desc: "Führung erhält einen gereihten, kalkulierten Plan, bevor Budget festgelegt wird.",
      },
      {
        title: "Wenn Piloten stocken",
        flow: ["Blocker gefunden", "Scope verkleinert", "Owner definiert"],
        desc: "Bestehende KI-Piloten kommen los, indem Scope verkleinert und Owner und Metriken benannt werden.",
      },
      {
        title: "Einen Erfolg skalieren",
        flow: ["Erfolgsfall auditiert", "Muster verallgemeinert", "Nächste Chancen priorisiert"],
        desc: "Ein funktionierender Use Case wird ein wiederholbares Muster für die nächsten Chancen.",
      },
    ],
  },
  engagement: {
    eyebrow: "Lieferumfang",
    title: "Was Sie bekommen.",
    items: [
      "Operationskarte mit dem Ort, an dem KI passt und wo nicht",
      "Gereihte Chancenliste mit Wert- und Machbarkeitswerten",
      "Phasenweise Roadmap mit Ownern, Meilensteinen und Metriken",
      "Architekturskizze mit Tools, Leitplanken und Checks",
      "ROI-Schätzungen für jede empfohlene Chance",
      "Umsetzungspfad, der an Ihre bestehenden Systeme anschließt",
    ],
  },
  faq: {
    eyebrow: "Fragen",
    title: "KI-Beratung, direkt beantwortet.",
    items: [
      {
        q: "Ist das nur für Unternehmen ohne KI?",
        a: "Nein. Wir arbeiten mit Teams ab null, mit Teams mit festgefahrenen Piloten und mit Teams, die einen Erfolg skalieren wollen.",
      },
      {
        q: "Wie entscheiden Sie, wo KI passt?",
        a: "Wir mappen, wo Arbeit wiederkehrt und Entscheidungen Mustern folgen, und bewerten jede Chance nach Wert, Machbarkeit und Risiko. KI wird nur empfohlen, wo die Zahlen es tragen.",
      },
      {
        q: "Müssen wir danach mit SystemaOps bauen?",
        a: "Nein. Roadmap und Bewertung gehören Ihnen. Viele Kunden setzen mit uns um, aber das Engagement steht für sich.",
      },
      {
        q: "Wie lange dauert ein Assessment?",
        a: "Eine fokussierte Discovery dauert je nach Teamanzahl meist einige Wochen. Am Ende steht eine gereihte Roadmap, kein Dokument, das niemand liest.",
      },
    ],
  },
  related: {
    eyebrow: "Weiter entdecken",
    title: "Verwandte Leistungen.",
    linkLabel: "Entdecken",
    items: [
      {
        title: "KI-Automatisierung",
        desc: "KI-Agenten und intelligente Workflows, die Handarbeit abnehmen.",
        href: "/ai-automation",
      },
      {
        title: "Workflow-Automatisierung",
        desc: "Wiederkehrende Operationen in Ihren bestehenden Tools automatisieren.",
        href: "/workflow-automation",
      },
      {
        title: "Systemintegrationen",
        desc: "CRM, ERP, Datenbanken und interne Systeme in einem Ökosystem verbinden.",
        href: "/system-integrations",
      },
    ],
  },
  problem3: {
    eyebrow: "Das echte Problem",
    title: "Die meisten KI-Projekte scheitern, bevor sie starten.",
    desc: "Das Problem ist selten die Verfügbarkeit von KI-Tools. Das schwierigere Problem ist zu wissen, wo KI wirklich angewendet werden sollte.",
    cards: [
      {
        title: "Kein klarer Business Case",
        desc: "KI wird eingeführt, weil sie verfügbar ist, nicht weil sie ein bedeutendes operatives Problem löst.",
      },
      {
        title: "Getrennte Systeme",
        desc: "Daten, Workflows und Geschäftssysteme sind oft über Tools und Teams fragmentiert.",
      },
      {
        title: "Kein Weg in die Produktion",
        desc: "Ein erfolgreicher Prototyp wird nicht automatisch ein verlässliches Produktionssystem.",
      },
    ],
  },
  framework: {
    eyebrow: "Was wir tun",
    title: "Von KI-Ideen zur umsetzbaren Roadmap.",
    desc: "Wir arbeiten mit Ihrem Team, um Chancen zu identifizieren, Machbarkeit zu validieren und den Pfad vom Konzept zur Produktion zu definieren.",
    steps: [
      {
        title: "Verstehen",
        desc: "Die aktuelle Operation erfassen.",
        points: ["Workflows", "Systeme", "Daten", "Teams", "Engpässe", "Wiederkehrende Arbeit"],
      },
      {
        title: "Identifizieren",
        desc: "Finden, wo KI bedeutende Hebelwirkung schafft.",
        points: ["Automatisierung", "Dokumentenintelligenz", "KI-Agenten", "Forecasting", "Entscheidungsunterstützung", "Wissenssysteme"],
      },
      {
        title: "Priorisieren",
        desc: "Chancen bewerten anhand von:",
        points: ["Geschäftswirkung", "Umsetzungskomplexität", "Datenbereitschaft", "Integrationsanforderungen", "Risiko", "Erwarteter ROI"],
      },
      {
        title: "Planen",
        desc: "Eine praktische Roadmap erstellen:",
        points: ["Architektur", "Technologie", "Integrationen", "Umsetzungsphasen", "Governance", "Messung"],
      },
    ],
  },
  oppmap: {
    eyebrow: "Chancenkarte",
    title: "Wo könnte KI Hebelwirkung schaffen?",
    desc: "Sechs KI-Fähigkeiten verbunden mit einem Geschäftsbetrieb. Jede Fähigkeit unterstützt den Betrieb, den sie verbessert.",
    tabsLabel: "KI-Fähigkeiten",
    center: "Geschäftsbetrieb",
    nodes: [
      {
        id: "agents",
        title: "KI-Agenten",
        desc: "Agenten, die Kontext verstehen, Tools nutzen und innerhalb definierter Grenzen handeln.",
        example: "Anfrage zu Kontext zu Tool zu Aktion zu geprüftem Ergebnis",
      },
      {
        id: "docs",
        title: "Dokumentenintelligenz",
        desc: "Informationen aus Geschäftsdokumenten extrahieren, validieren und routen.",
        example: "RFQs zu Extraktion zu Validierung zu strukturierten Daten zu Geschäftssystem",
      },
      {
        id: "workflow",
        title: "Workflow-Automatisierung",
        desc: "Geschäftssysteme verbinden und wiederkehrende operative Prozesse automatisieren.",
        example: "CRM zu Workflow zu Freigabe zu ERP zu Benachrichtigung",
      },
      {
        id: "knowledge",
        title: "Wissenssysteme",
        desc: "Interne Dokumentation in nutzbare KI-gestützte Antworten verwandeln.",
        example: "Dokumente zu Index zu fundierter Antwort zu Mitarbeiter",
      },
      {
        id: "decisions",
        title: "Entscheidungsunterstützung",
        desc: "Teams helfen, Informationen zu analysieren und schnellere, fundierte Entscheidungen zu treffen.",
        example: "Daten zu Analyse zu Empfehlung zu Entscheidung",
      },
      {
        id: "predictive",
        title: "Prädiktive Systeme",
        desc: "Geschäftsdaten nutzen, um Muster, Risiken und Chancen zu erkennen.",
        example: "Historie zu Mustern zu Forecast zu Aktion",
      },
    ],
  },
  areas: {
    eyebrow: "Chancenbereiche",
    title: "Wo wir Unternehmen bei KI helfen.",
  },
  timeline6: {
    eyebrow: "Beratungsprozess",
    title: "Ein praktischer Pfad von der Idee zur Umsetzung.",
    steps: [
      { title: "Discovery", desc: "Das Geschäftsproblem verstehen." },
      { title: "Bewertung", desc: "Prozesse, Systeme und Daten evaluieren." },
      { title: "Chancenmapping", desc: "Hochwertige KI-Chancen identifizieren." },
      { title: "Priorisierung", desc: "Chancen nach Wirkung und Machbarkeit reihen." },
      { title: "Roadmap", desc: "Architektur und Umsetzungsphasen definieren." },
      { title: "Umsetzung", desc: "Ausgewählte Initiativen in Produktion bringen." },
    ],
  },
  deliverables: {
    eyebrow: "Liefergegenstände",
    title: "Womit Sie gehen.",
    items: [
      { title: "KI-Chancenkarte", desc: "Eine strukturierte Sicht, wo KI Wert schaffen kann." },
      { title: "Priorisierte KI-Roadmap", desc: "Eine praktische Abfolge von Initiativen." },
      { title: "Lösungsarchitektur", desc: "Technische Richtung für die Umsetzung." },
      { title: "Integrationsplan", desc: "Wie KI an bestehende Systeme anschließt." },
      { title: "Business Case", desc: "Erwartete Wirkung, Aufwand und messbare Ergebnisse." },
      { title: "Umsetzungsplan", desc: "Klare nächste Schritte in die Ausführung." },
    ],
  },
  whyus: {
    eyebrow: "Warum SystemaOps",
    title: "Strategie nützt nur, wenn sie umsetzbar ist.",
    desc: "Wir verbinden Geschäftsverständnis mit Engineering-Kompetenz, damit Empfehlungen über Präsentationen hinaus in echte Systeme gelangen.",
    cards: [
      { title: "Business zuerst", desc: "Wir starten mit dem operativen Problem, nicht mit der Technologie." },
      { title: "Engineering-geführt", desc: "Empfehlungen gründen auf echten Umsetzungsgrenzen." },
      { title: "Integrationsbereit", desc: "KI muss mit den Systemen arbeiten, die Ihr Business nutzt." },
      { title: "Für Ausführung gebaut", desc: "Die Roadmap kann direkt ein Umsetzungsplan werden." },
    ],
  },
  systems: {
    eyebrow: "Systemarchitektur",
    title: "Intelligenz verbunden mit Ihrer Operation.",
    desc: "KI ersetzt das Geschäftssystem nicht. Sie verbindet Intelligenz mit dem bestehenden Betriebssystem des Unternehmens.",
    center: "KI-Schicht",
    nodes: ["CRM", "ERP", "Datenbanken", "Dokumente", "APIs", "Interne Tools", "Messaging", "Fachanwender"],
  },
  narrative: {
    problem: {
      title: "Die meisten KI-Projekte scheitern, bevor sie starten.",
      desc: "Die Herausforderung ist selten ein KI-Modell. Es ist das richtige Problem, die richtigen Daten, der richtige Workflow und die richtige Betriebsgrenze.",
      items: [
        { t: "Falsches Problem", d: "KI wird dort eingesetzt, wo der Workflow unklar oder der Geschäftswert schwer messbar ist." },
        { t: "Getrennte Daten", d: "Nützlicher Kontext liegt verstreut über Dokumente, Datenbanken, Anwendungen und Menschen." },
        { t: "Kein Betriebspfad", d: "Ein erfolgreicher Prototyp braucht noch Ownership, Kontrollen, Integrationen und einen Weg in Produktion." },
      ],
    },
    framework: {
      title: "Von KI-Ideen zu einer umsetzbaren Roadmap.",
      desc: "Wir bewerten KI-Chancen nach Geschäftswert, operativer Passung, Datenverfügbarkeit und Umsetzungsaufwand.",
      steps: [
        { t: "Identifizieren", points: ["Geschäftsproblem", "Workflow-Reibung", "Manuelle Entscheidungen"] },
        { t: "Bewerten", points: ["Datenverfügbarkeit", "KI-Eignung", "Risikogrenzen"] },
        { t: "Priorisieren", points: ["Geschäftswert", "Aufwand", "Abhängigkeiten"] },
        { t: "Planen", points: ["Architektur", "Pilot", "Produktionspfad"] },
      ],
    },
    arch: {
      title: "Wie KI in Ihren Betrieb passt.",
      desc: "Geschäftsbedürfnisse fließen durch eine KI-Strategie in verbundene Systeme und enden in operativen Ergebnissen.",
      needs: { label: "GESCHÄFTSBEDÜRFNISSE", items: ["Manuelle Arbeit", "Langsame Entscheidungen", "Verstreutes Wissen", "Wiederkehrende Prozesse"] },
      core: { label: "KI-STRATEGIE", sub: "KI-Schicht", items: ["Chancen-Mapping", "Architektur", "Governance"] },
      systems: { label: "VERBUNDENE SYSTEME", items: ["CRM", "ERP", "Dokumente", "Datenbanken", "Interne Tools", "Messaging"] },
      outcomes: { label: "OPERATIVE ERGEBNISSE", items: ["Weniger Handarbeit", "Schnellere Entscheidungen", "Bessere Konsistenz", "Kontrollierte Automatisierung"] },
    },
    cases: {
      title: "Wo KI Hebelwirkung erzeugen kann.",
      desc: "Sechs Bereiche, in denen KI an echte Abläufe anschließt.",
      items: [
        { t: "Dokumentenintelligenz", d: "Extrahiert, klassifiziert, fasst zusammen und routet Informationen aus Geschäftsdokumenten." },
        { t: "Workflow-Automatisierung", d: "Verbindet Entscheidungen und Aktionen über bestehende Geschäftssysteme." },
        { t: "Wissenssysteme", d: "Macht internes Wissen leichter auffindbar und nutzbar." },
        { t: "Entscheidungsunterstützung", d: "Gibt Teams strukturierten Kontext vor wichtigen Entscheidungen." },
        { t: "KI-Agenten", d: "Erledigt definierte, kontrollierte Aufgaben über freigegebene Tools." },
        { t: "Prozessintelligenz", d: "Identifiziert wiederkehrende Arbeit und Verbesserungschancen." },
      ],
    },
    path: {
      title: "Ein praktischer Weg von der Idee zur Umsetzung.",
      desc: "Eine feste Liefersequenz, von Discovery bis Skalierung.",
      steps: [
        { t: "Entdecken", d: "Bildet Workflows, Systeme und wo Zeit wirklich hingeht ab." },
        { t: "Bewerten", d: "Prüft Daten, Machbarkeit und Risiko je Chance." },
        { t: "Designen", d: "Formt Architektur, Tools und Grenzen." },
        { t: "Pilotieren", d: "Beweist den wertvollsten Fall in Produktion." },
        { t: "Integrieren", d: "Verbindet mit bestehenden Systemen und Workflows." },
        { t: "Skalieren", d: "Macht aus dem bewährten Muster ein Programm." },
      ],
    },
    outcomes: {
      title: "Womit Sie gehen.",
      items: [
        { t: "KI-Chancenkarte", d: "Wo KI passt und wo nicht" },
        { t: "Priorisierte Use Cases", d: "Nach Wert und Machbarkeit gereiht" },
        { t: "Architekturrichtung", d: "Tools, Leitplanken und Checkpoints" },
        { t: "Datenanforderungen", d: "Was vorhanden ist und was fehlt" },
        { t: "Umsetzungs-Roadmap", d: "Phasen, Owner und Meilensteine" },
        { t: "Governance-Grenzen", d: "Kontrollen und menschliche Checkpoints" },
      ],
    },
    strategy: {
      title: "Strategie nützt nur, wenn sie umsetzbar ist.",
      desc: "Jede Empfehlung wird am Betrieb geprüft, in dem sie laufen muss.",
      items: [
        { t: "Business Case", d: "Warum es zählt" },
        { t: "Datenreife", d: "Welche Informationen verfügbar sind" },
        { t: "Technische Passung", d: "Wie es anschließt" },
        { t: "Umsetzungspfad", d: "Wie es in Produktion geht" },
      ],
    },
    ecosystem: {
      title: "Intelligenz verbunden mit Ihrem Betrieb.",
      desc: "Die KI-Schicht sitzt zwischen Ihren Quellen und den Tools Ihrer Teams.",
      top: ["CRM", "ERP", "Datenbanken", "Dokumente"],
      core: "KI-SCHICHT",
      bottom: ["Interne Tools", "Messaging", "APIs", "Geschäftsanwendungen"],
    },
    grounded: {
      title: "In echten Systemen verankert.",
      desc: "Strategie, die auf den Stack passt, den Sie bereits betreiben.",
      chips: ["Bestehende Anwendungen", "APIs", "Datenbanken", "Dokumente", "GeschäftsWorkflows", "Interne Tools", "Berechtigungen", "Menschliche Prüfung"],
    },
  },
  ctaOrbit: {
    eyebrow: "Bereit, die richtige KI-Chance zu finden?",
    title: "Wissen, wo KI echten",
    highlight: "Geschäftswert schafft.",
    desc: "Bewerten Sie Ihre Operation, identifizieren Sie praktische KI-Chancen und bauen Sie eine Roadmap um messbare Ergebnisse.",
    button: "KI-Strategie besprechen",
    diagram: {
      center: "KI-Strategie",
      centerSub: "Von Bewertung zu Roadmap",
      nodes: [
        { t: "Bewerten", s: "Aktueller Betrieb" },
        { t: "Identifizieren", s: "KI-Chancen" },
        { t: "Priorisieren", s: "Wirkung und Aufwand" },
        { t: "Roadmap", s: "Phasenweise Umsetzung" },
      ],
    },
  },
  cta: {
    eyebrow: "Bereit, wenn Sie es sind",
    title: "Wissen, wo KI die",
    highlight: "größte Wirkung erzielen kann?",
    desc: "Identifizieren Sie praktische KI-Chancen und bauen Sie eine Roadmap um messbaren Geschäftswert.",
    button: "KI-Strategie besprechen",
  },
};

export const consultingContent = { en, nl, de };
