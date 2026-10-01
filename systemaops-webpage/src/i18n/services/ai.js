/* Centralized content for the AI Automation service page (/ai-automation).
   Consumed via t("serviceDetail.ai.*"). Icons stay in the component.
   - diagram.arch feeds the shared hero visual `AIAgentArchitecture`
     (exactly these keys: aria, ariaCompact, input, context{t,s}, agent{t,s},
     tools{t,s}, data{t,s}, rules{t,s}, decision, action, review{t,s},
     complete{t,s}, toolsRow, captionPre, captionCore, captionPost).
   - diagram.visual feeds the inline page visual `ArchitectureVisual`:
     { aria, tabsLabel, paths[{id,label,desc}],
       nodes: { user1, user2, context{t,s}, agent{t,s1,s2},
                tools{t,s}, data{t,s}, rules{t,s}, action{t}, review{t} } }.
   - problem.before/after are DERIVED (the page has a problem list, not a
     before/after block): condensed from the five problem bullets, same meaning.
   - problem.items preserves the visible 5-bullet problem list {lead,text}. */

const en = {
  meta: {
    title: "AI Automation Services",
    description:
      "Build AI agents and intelligent workflows that work with the systems your team already uses, handling repeatable tasks with people in the loop where judgment matters.",
    keywords:
      "AI automation, AI agents, business automation, intelligent workflows, AI automation services, human in the loop",
    schemaName: "AI Automation",
    schemaDesc:
      "AI automation services that help businesses automate repetitive operations, improve workflows, and scale efficiently.",
  },
  hero: {
    eyebrow: "AI Automation & Agents",
    title: "Give AI the context,",
    highlight: "tools and boundaries to act.",
    description:
      "Build AI agents that understand business context, use connected tools, follow defined rules, and escalate decisions when human judgment is required.",
    primaryCta: "Discuss an AI workflow",
    secondaryCta: "See an agent in action",
  },
  problem: {
    eyebrow: "The problem",
    title: "AI is useful",
    highlight: "when it fits the workflow.",
    items: [
      {
        lead: "Repetitive internal requests",
        text: "the same questions arrive daily and someone types the same answers.",
      },
      {
        lead: "Document handling",
        text: "files arrive faster than anyone can read, extract and file them.",
      },
      {
        lead: "Recurring decisions",
        text: "routine approvals and classifications wait on busy people.",
      },
      {
        lead: "Structured responses",
        text: "quotes, confirmations and follow-ups assembled by hand each time.",
      },
      {
        lead: "Manual system actions",
        text: "copying decisions into tools, updating records, sending the next message.",
      },
    ],
    beforeLabel: "WITHOUT GROUNDED AGENTS",
    beforeItems: [
      "Same internal requests answered by hand every day",
      "Files arriving faster than anyone can read and file",
      "Routine approvals and classifications waiting on busy people",
      "Quotes, follow-ups and system updates assembled manually",
    ],
    afterLabel: "WITH GROUNDED AGENTS",
    afterItems: [
      "Repeat requests handled consistently, with handoff when cases do not fit",
      "Incoming documents become validated records in ERP or CRM",
      "Routine decisions prepared for fast human approval",
      "Reminders, reports and updates sent on time, exceptions reviewed by people",
    ],
  },
  capabilities: {
    eyebrow: "Capabilities",
    title: "What the agents actually do.",
    items: [
      {
        title: "AI agents",
        desc: "Agents that understand requests, make bounded decisions and execute tasks inside your tools, scoped to jobs you define.",
      },
      {
        title: "Tool calling & integrations",
        desc: "Agents act through APIs and workflows: updating records, triggering flows and moving information between systems.",
      },
      {
        title: "Document workflows",
        desc: "Capture, extraction and validation turn incoming files into structured values the rest of the operation can use.",
      },
      {
        title: "Task automation",
        desc: "Follow-ups, notifications, data entry and routine administration handled consistently, every time.",
      },
      {
        title: "Human-in-the-loop",
        desc: "Approval checkpoints where judgment matters. People decide; the system prepares everything around the decision.",
      },
      {
        title: "Workflow orchestration",
        desc: "Agents run as steps inside larger n8n workflows, with retries, branches and exception paths around them.",
      },
    ],
  },
  architecture: {
    eyebrow: "Architecture",
    title: "Grounded agents, visible paths.",
    desc: "Every agent sits between context and action. A user or event enters through context, the agent reasons with tools, data and rules, the result becomes an action, and uncertain cases stop at a human check.",
  },
  narrative: {
    problem: {
      title: "When something changes,",
      highlight: "your team should know why.",
      areas: [
        { t: "Signals get lost", d: "Events are spread across systems, logs and operational tools." },
        { t: "Decisions lack context", d: "Teams see symptoms but not always the full chain behind them." },
      ],
    },
    capabilities: {
      title: "Visibility across the stack.",
      desc: "See what changed, where it changed, and what needs attention.",
      items: [
        { t: "Application", d: "Application behavior and events." },
        { t: "Automation", d: "Workflow execution and failures." },
        { t: "Data", d: "Data movement and state changes." },
        { t: "Integrations", d: "External systems and API activity." },
        { t: "Workflows", d: "Process execution and bottlenecks." },
        { t: "Alerts", d: "Important changes that require attention." },
      ],
    },
    signal: {
      title: "Every signal has somewhere to go.",
      desc: "From detection to a controlled outcome.",
      steps: [
        { t: "Event", d: "Something changed" },
        { t: "Context", d: "What is affected?" },
        { t: "Analysis", d: "Is this expected?" },
        { t: "Decision", d: "What should happen?" },
        { t: "Action", d: "Automate or escalate" },
      ],
    },
    visual: {
      title: "One layer watching everything.",
      desc: "AI connects signals, context and actions across your systems.",
    },
    cases: {
      title: "Where AI automation fits.",
      desc: "Use AI where context, decisions and system actions need to work together.",
      items: [
        { t: "Incident response", flow: "Detect → understand → respond" },
        { t: "Document processing", flow: "Extract → classify → route" },
        { t: "System monitoring", flow: "Observe → correlate → alert" },
        { t: "Workflow decisions", flow: "Evaluate → decide → execute" },
        { t: "Operations assistance", flow: "Collect → summarize → surface" },
        { t: "Exception handling", flow: "Detect → escalate → resolve" },
      ],
    },
    operating: {
      title: "The AI operating model.",
      items: [
        { t: "Observe", d: "Capture signals from systems." },
        { t: "Understand", d: "Add context from data and history." },
        { t: "Decide", d: "Apply rules, context and AI reasoning." },
        { t: "Respond", d: "Take action or escalate." },
      ],
    },
    actions: {
      title: "What the automation actually does.",
      items: [
        { t: "Detect", d: "Identify meaningful changes." },
        { t: "Correlate", d: "Connect events across systems." },
        { t: "Summarize", d: "Turn operational signals into useful context." },
        { t: "Classify", d: "Determine what type of event or request occurred." },
        { t: "Route", d: "Send work to the right system or person." },
        { t: "Act", d: "Execute approved low-risk actions." },
      ],
    },
    control: {
      title: "Automation with boundaries.",
      desc: "Not every decision should be fully automated. We define where the AI can act, where approval is required, and where work should return to a person.",
      items: [
        { t: "Automated", d: "Defined low-risk actions execute automatically." },
        { t: "Controlled", d: "Rules, permissions and validation constrain what the AI can do." },
        { t: "Human Review", d: "Important or exceptional decisions can be routed to a person." },
      ],
    },
    outcomes: {
      title: "From signals to operational clarity.",
      items: [
        { t: "Faster detection", d: "Know about important changes sooner." },
        { t: "Less manual monitoring", d: "Reduce repetitive observation work." },
        { t: "Better context", d: "Understand what happened before deciding what to do." },
        { t: "Controlled actions", d: "Automate only within defined boundaries." },
        { t: "Faster response", d: "Move from detection to action without unnecessary handoffs." },
        { t: "Auditable operations", d: "Keep decisions and actions traceable." },
      ],
    },
    implementation: {
      title: "What the implementation includes.",
      items: [
        { t: "Signal mapping", d: "Identify useful events and data sources." },
        { t: "System connections", d: "Connect required APIs, tools and systems." },
        { t: "Context + knowledge", d: "Provide the information the automation needs." },
        { t: "AI logic", d: "Define reasoning, classification and decision paths." },
        { t: "Guardrails", d: "Define permissions, validation and escalation." },
        { t: "Monitoring", d: "Observe behavior after deployment." },
      ],
    },
  },
  diagram: {
    arch: {
      aria: "AI agent architecture: input flows through context into an AI agent connected to tools, data and rules, producing a decision and action checked by a human",
      ariaCompact: "AI agent flow: input to agent to action with human check",
      input: "INPUT",
      context: { t: "CONTEXT", s: "docs and history" },
      agent: { t: "AI AGENT", s: "bounded, grounded" },
      tools: { t: "TOOLS", s: "APIs and flows" },
      data: { t: "DATA", s: "records" },
      rules: { t: "RULES", s: "boundaries" },
      decision: "DECISION",
      action: "ACTION",
      review: { t: "HUMAN CHECK", s: "approval" },
      complete: { t: "DONE", s: "delivered" },
      toolsRow: "TOOLS, DATA, RULES",
      captionPre: "Every run moves from",
      captionCore: "input to reviewed action",
      captionPost: "with context, tools and rules grounding each step.",
    },
    visual: {
      aria: "Agent architecture: user or event flows through context into an AI agent connected to tools, data and rules, producing actions checked by a human",
      tabsLabel: "Architecture paths",
      paths: [
        {
          id: "tools",
          label: "Tools path",
          desc: "The agent calls approved APIs and workflow steps to change things in real systems.",
        },
        {
          id: "context",
          label: "Context path",
          desc: "Documents, records and business rules ground every decision in your reality.",
        },
        {
          id: "action",
          label: "Execution path",
          desc: "Decisions become workflow actions, with a human checkpoint where judgment matters.",
        },
      ],
      nodes: {
        user1: "USER /",
        user2: "EVENT",
        context: { t: "CONTEXT", s: "docs, history" },
        agent: { t: "AI AGENT", s1: "bounded", s2: "grounded" },
        tools: { t: "TOOLS", s: "APIs, flows" },
        data: { t: "DATA", s: "records" },
        rules: { t: "RULES", s: "boundaries" },
        action: { t: "ACTION" },
        review: { t: "HUMAN CHECK" },
      },
      run: {
        button: "Run example",
        stages: [
          "Understanding request",
          "Selecting tool",
          "Calling CRM",
          "Processing response",
          "Completed",
        ],
      },
    },
  },
  lifecycle: {
    eyebrow: "How an agent works",
    title: "Six steps, one controlled run.",
    desc: "Select a step to see what the agent does and which systems it touches.",
    tabsLabel: "Agent steps",
    steps: [
      {
        title: "Understand",
        desc: "The agent reads the request and its intent.",
        points: ["Request text and channel", "Intent and entities", "History of this case"],
      },
      {
        title: "Gather",
        desc: "The agent pulls together everything it may need.",
        points: ["Customer data and records", "Documents and attachments", "Previous interactions"],
      },
      {
        title: "Decide",
        desc: "The agent weighs options against your rules.",
        points: ["Business rules and limits", "Permissions for this case", "Available actions ranked"],
      },
      {
        title: "Act",
        desc: "The agent executes through connected tools.",
        points: ["API calls and updates", "Database writes", "Messages and notifications"],
      },
      {
        title: "Verify",
        desc: "The agent checks the result before moving on.",
        points: ["Result against expectation", "System state confirmed", "Policy still satisfied"],
      },
      {
        title: "Escalate",
        desc: "Uncertain cases go to a person, with context.",
        points: ["Low confidence or high risk", "Full case handed over", "Nothing stalls silently"],
      },
    ],
  },
  guardrails: {
    eyebrow: "Guardrails",
    title: "Automation needs boundaries.",
    desc: "Every agent action passes three checks before anything executes. Confidence decides whether the run continues alone or waits for a person.",
    checks: [
      { title: "Policy check", desc: "Is this action allowed at all?" },
      { title: "Permission check", desc: "May this agent touch this system?" },
      { title: "Business rule", desc: "Does the case fit the defined limits?" },
    ],
    highLabel: "High confidence",
    highAction: "Execute",
    lowLabel: "Low confidence",
    lowAction: "Human review",
  },
  approval: {
    eyebrow: "Human in the loop",
    title: "People decide where it counts.",
    desc: "The agent prepares the full picture. A person approves with one action, and the workflow continues.",
    recommendation: "Approve supplier invoice",
    confidenceLabel: "Confidence",
    confidenceValue: "High",
    policyNote: "Policy requires human approval above €1,000.",
    approve: "Approve",
    reject: "Reject",
    approved: "Approved. The workflow continues to payment.",
    rejected: "Rejected. The case returns to the requester.",
  },
  example: {
    eyebrow: "In practice",
    title: "Document, decision, action.",
    desc: "An incoming request for quotation travels from file to structured result. Anything unclear stops at a person.",
    tabsLabel: "RFQ flow",
    yes: "Yes",
    no: "No",
    branchQ: "Missing information?",
  },
  compare: {
    eyebrow: "Controlled AI",
    title: "More than prompt and response.",
    genericTitle: "Generic AI",
    prompt: "Prompt",
    response: "Response",
    sysTitle: "SystemaOps AI automation",
    steps: ["Context", "Rules", "Tools", "Agent", "Validation", "Action", "Audit"],
  },
  workspace: {
    aria: "AI agent executing a business workflow with context, tools, data, rules and human review orbiting the agent",
    consoleTitle: "Live execution",
    coreTitle: "AI agent",
    coreSub: "Understands, plans, acts",
    nodes: {
      context: { t: "Context", s: "Documents, history, business state", d: ["Documents", "Business state", "Conversation history"] },
      tools: { t: "Tools", s: "CRM, Odoo, APIs", d: ["CRM", "Odoo", "Internal APIs"] },
      data: { t: "Data", s: "Records and responses", d: ["Customer records", "Query results", "Workflow outputs"] },
      rules: { t: "Rules", s: "Policies and permissions", d: ["Business policies", "Permissions", "Confidence limits"] },
      review: { t: "Human review", s: "Approvals and escalations", d: ["Approval checks", "Escalations", "Exception cases"] },
    },
    steps: [
      { title: "Understanding request", detail: "Analyzing user input and intent..." },
      { title: "Reading business context", detail: "Fetching relevant data..." },
      { title: "Selecting best tool", detail: "Choosing CRM based on intent..." },
      { title: "Calling CRM", detail: "Retrieving customer information..." },
      { title: "Processing response", detail: "Validating and applying rules..." },
      { title: "Rules validation", detail: "Checking policies and permissions..." },
      { title: "Human review", detail: "Waiting for human approval..." },
      { title: "Completed", detail: "Task finished successfully." },
    ],
    result: {
      title: "Result",
      desc: "Customer information retrieved and ready for next action.",
    },
    features: [
      { t: "Enterprise ready", d: "Secure & governed" },
      { t: "Works with your tools", d: "Odoo, APIs and more" },
      { t: "Human in control", d: "When it matters" },
      { t: "Built for real operations", d: "Not just chat" },
    ],
    explain: [
      { t: "Understands context", d: "Connects to your data, documents and business state." },
      { t: "Uses the right tools", d: "Works with Odoo, APIs and internal systems." },
      { t: "Follows your rules", d: "Respects policies, permissions and decision limits." },
      { t: "Escalates when needed", d: "Hands over to humans for important decisions." },
    ],
    controls: {
      ready: "Agent is ready",
      hint: "Click to see it in action",
      play: "Run",
      pause: "Pause",
      again: "Run again",
      running: "Running",
      paused: "Paused",
      readyStatus: "Ready",
    },
  },
  process: {
    eyebrow: "How we implement it",
    title: "Identify, ground, act, review.",
    steps: [
      {
        title: "Identify",
        desc: "We find the repeatable work: recurring requests, decisions and manual system actions worth handing over.",
      },
      {
        title: "Ground",
        desc: "The agent gets what it needs, context from your data, tools it may call, and rules it must follow.",
      },
      {
        title: "Act",
        desc: "The agent executes the appropriate workflow action: updating systems, sending responses, moving work forward.",
      },
      {
        title: "Review",
        desc: "A human checkpoint stands where appropriate. Approved work continues; exceptions come back with context.",
      },
    ],
  },
  tech: {
    eyebrow: "Technology",
    title: "AI connected to real systems.",
    desc: "Agents are only useful inside the operation, grouped here by role, from the models that reason to the systems they act on.",
    groups: [
      {
        role: "AI / Models",
        items: ["LLM agents", "Classification", "Summarization", "Decision support"],
      },
      {
        role: "Tools",
        items: ["API actions", "Tool calling", "n8n steps", "Notifications"],
      },
      {
        role: "Data / Context",
        items: ["Documents", "Databases", "Email", "Google Sheets", "Slack"],
      },
      {
        role: "Integrations",
        items: ["Odoo ERP", "CRM systems", "Webhooks", "REST APIs"],
      },
      {
        role: "Workflow",
        items: ["Approvals", "Exception paths", "Monitoring", "Review queues"],
      },
    ],
  },
  useCases: {
    eyebrow: "Use cases",
    title: "Repeatable work, handled.",
    items: [
      {
        title: "Recurring internal requests",
        flow: ["Request arrives", "Agent classifies & prepares", "Structured response sent"],
        desc: "Repeat questions and standard requests get consistent, grounded answers, with handoff to a person when the case doesn't fit.",
      },
      {
        title: "Document intake to record",
        flow: ["File captured", "Fields extracted & checked", "Record created in ERP"],
        desc: "Incoming documents become structured records in Odoo or your CRM, validated before anything is written.",
      },
      {
        title: "Follow-ups that never slip",
        flow: ["Event detected", "Agent drafts & sends", "Human reviews exceptions"],
        desc: "Quotes, reminders and status updates go out on time, while anything unusual waits for a person.",
      },
      {
        title: "Reporting without the grind",
        flow: ["Data collected", "AI summarizes", "Report delivered"],
        desc: "Operational data from your systems becomes readable summaries and reports on a schedule your team sets.",
      },
    ],
  },
  engagement: {
    eyebrow: "Engagement",
    title: "What the implementation includes.",
    items: [
      "Discovery, where repeatable work and decisions live today",
      "Agent design, scope, context sources, tools and boundaries",
      "Integration, connections to Odoo, CRM, n8n and everyday tools",
      "Workflow implementation, agents running inside monitored flows",
      "Testing, edge cases, failure paths and quality checks",
      "Monitoring, visibility into what agents do and where they stop",
      "Human review, checkpoints designed around judgment, not habit",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "AI automation, answered directly.",
    items: [
      {
        q: "Where should AI be used first?",
        a: "Where work repeats with clear patterns: recurring requests, document handling, follow-ups and structured responses. We look for high-frequency tasks with verifiable outputs, those pay back fastest and fail safest.",
      },
      {
        q: "Can AI work with our existing systems?",
        a: "Yes. Agents act through the tools you already run, Odoo, CRMs, n8n workflows, databases, email and chat, via APIs and webhooks. Nothing needs replacing for AI to start helping.",
      },
      {
        q: "How do you handle human approval?",
        a: "Approval checkpoints are designed into the workflow wherever judgment matters. The agent prepares everything, context, draft, recommendation, and a person approves with one action.",
      },
      {
        q: "What happens when an agent cannot complete a task?",
        a: "It stops instead of guessing. The case routes to a human with everything the agent gathered so far, so no work is lost and the failure is visible.",
      },
      {
        q: "How do agents stay grounded in our reality?",
        a: "They work from your data and documents, call only the tools you allow, and follow rules defined during design. Anything outside those boundaries goes to a person.",
      },
    ],
  },
  related: {
    eyebrow: "Keep exploring",
    title: "Related services.",
    linkLabel: "Explore",
    items: [
      {
        title: "Odoo Solutions",
        desc: "ERP, CRM and business applications tailored to how you operate.",
        href: "/odoo-customization",
      },
      {
        title: "Workflow Automation",
        desc: "Automate repetitive operations across the tools you already use.",
        href: "/workflow-automation",
      },
      {
        title: "Data & Document Automation",
        desc: "Process, route and sync documents and data automatically.",
        href: "/data-document-automation",
      },
    ],
  },
  ctaOrbit: {
    eyebrow: "Ready to automate?",
    title: "Give your operations",
    highlight: "an AI advantage.",
    desc: "Connect your business context, tools and rules into intelligent workflows that act when work needs to move.",
    button: "Discuss an AI workflow",
    diagram: {
      center: "AI Agent",
      centerSub: "Understands, plans, acts",
      nodes: [
        { t: "Context", s: "Business data" },
        { t: "Tools", s: "APIs, Odoo, CRM" },
        { t: "Rules", s: "Policies and guardrails" },
        { t: "Action", s: "Execute and escalate" },
      ],
    },
  },
  cta: {
    eyebrow: "Ready when you are",
    title: "Have a process where AI",
    highlight: "could do more than answer?",
    desc: "Let's design an agent that can understand, act and operate within your business rules.",
    button: "Discuss an AI workflow",
  },
};

const nl = {
  meta: {
    title: "AI-automatiseringsdiensten",
    description:
      "Bouw AI-agents en intelligente workflows die werken met de systemen die uw team al gebruikt, voor terugkerend werk, met mensen in de loop waar oordeel telt.",
    keywords:
      "AI-automatisering, AI-agents, bedrijfsautomatisering, intelligente workflows, AI-automatiseringsdiensten, human in the loop",
    schemaName: "AI-automatisering",
    schemaDesc:
      "AI-automatiseringsdiensten die bedrijven helpen terugkerende operatie te automatiseren, workflows te verbeteren en efficiënt te schalen.",
  },
  hero: {
    eyebrow: "AI-automatisering & agents",
    title: "Geef AI de context,",
    highlight: "tools en grenzen om te handelen.",
    description:
      "Bouw AI-agents die bedrijfscontext begrijpen, gekoppelde tools gebruiken, gedefinieerde regels volgen en beslissingen escaleren waar menselijk oordeel nodig is.",
    primaryCta: "Bespreek een AI-workflow",
    secondaryCta: "Zie een agent in actie",
  },
  problem: {
    eyebrow: "Het probleem",
    title: "AI is nuttig",
    highlight: "als het in de workflow past.",
    items: [
      {
        lead: "Terugkerende interne verzoeken",
        text: "dagelijks dezelfde vragen en iemand typt steeds dezelfde antwoorden.",
      },
      {
        lead: "Documentafhandeling",
        text: "bestanden komen sneller binnen dan iemand kan lezen, extraheren en archiveren.",
      },
      {
        lead: "Terugkerende beslissingen",
        text: "routinematige goedkeuringen en classificaties wachten op drukke mensen.",
      },
      {
        lead: "Gestructureerde antwoorden",
        text: "offertes, bevestigingen en opvolging telkens met de hand opgebouwd.",
      },
      {
        lead: "Handmatige systeemacties",
        text: "beslissingen overtypen in tools, records bijwerken, het volgende bericht sturen.",
      },
    ],
    beforeLabel: "ZONDER GEGRONDE AGENTS",
    beforeItems: [
      "Dezelfde interne verzoeken dagelijks met de hand beantwoord",
      "Bestanden die sneller binnenkomen dan iemand kan verwerken",
      "Routinematige goedkeuringen die op drukke mensen wachten",
      "Offertes, opvolging en systeemupdates handmatig opgebouwd",
    ],
    afterLabel: "MET GEGRONDE AGENTS",
    afterItems: [
      "Terugkerende verzoeken consistent afgehandeld, met overdracht als een zaak niet past",
      "Binnenkomende documenten worden gevalideerde records in ERP of CRM",
      "Routinematige beslissingen voorbereid voor snelle menselijke goedkeuring",
      "Herinneringen, rapporten en updates op tijd verstuurd, uitzonderingen door mensen beoordeeld",
    ],
  },
  capabilities: {
    eyebrow: "Mogelijkheden",
    title: "Wat de agents echt doen.",
    items: [
      {
        title: "AI-agents",
        desc: "Agents die verzoeken begrijpen, begrensde beslissingen nemen en taken uitvoeren in uw tools, afgebakend op taken die u definieert.",
      },
      {
        title: "Toolaanroepen & integraties",
        desc: "Agents handelen via API's en workflows: records bijwerken, stromen triggeren en informatie tussen systemen verplaatsen.",
      },
      {
        title: "Documentworkflows",
        desc: "Vastlegging, extractie en validatie maken van binnenkomende bestanden gestructureerde waarden voor de rest van de operatie.",
      },
      {
        title: "Taakautomatisering",
        desc: "Opvolging, meldingen, data-invoer en routinematige administratie consistent afgehandeld, elke keer weer.",
      },
      {
        title: "Mens in de loop",
        desc: "Goedkeuringsmomenten waar oordeel telt. Mensen beslissen; het systeem bereidt alles rond de beslissing voor.",
      },
      {
        title: "Workfloworkestratie",
        desc: "Agents draaien als stappen in grotere n8n-workflows, met retries, vertakkingen en uitzonderingspaden eromheen.",
      },
    ],
  },
  architecture: {
    eyebrow: "Architectuur",
    title: "Gegronde agents, zichtbare paden.",
    desc: "Elke agent zit tussen context en actie. Een gebruiker of event komt binnen via context, de agent redeneert met tools, data en regels, het resultaat wordt een actie, en onzekere zaken stoppen bij een menselijke controle.",
  },
  narrative: {
    problem: {
      title: "Als er iets verandert,",
      highlight: "moet uw team weten waarom.",
      areas: [
        { t: "Signalen raken kwijt", d: "Events liggen verspreid over systemen, logs en operationele tools." },
        { t: "Beslissingen missen context", d: "Teams zien symptomen, maar niet altijd de hele keten erachter." },
      ],
    },
    capabilities: {
      title: "Zichtbaarheid door de hele stack.",
      desc: "Zie wat er veranderde, waar het veranderde, en wat aandacht nodig heeft.",
      items: [
        { t: "Applicatie", d: "Applicatiegedrag en events." },
        { t: "Automatisering", d: "Workflowuitvoering en fouten." },
        { t: "Data", d: "Databeweging en statuswijzigingen." },
        { t: "Integraties", d: "Externe systemen en API-activiteit." },
        { t: "Workflows", d: "Procesuitvoering en knelpunten." },
        { t: "Alerts", d: "Belangrijke veranderingen die aandacht vereisen." },
      ],
    },
    signal: {
      title: "Elk signaal heeft ergens naartoe te gaan.",
      desc: "Van detectie naar een gecontroleerd resultaat.",
      steps: [
        { t: "Event", d: "Er is iets veranderd" },
        { t: "Context", d: "Wat is er geraakt?" },
        { t: "Analyse", d: "Is dit verwacht?" },
        { t: "Beslissing", d: "Wat moet er gebeuren?" },
        { t: "Actie", d: "Automatiseren of escaleren" },
      ],
    },
    visual: {
      title: "Eén laag die alles in de gaten houdt.",
      desc: "AI verbindt signalen, context en acties door uw systemen heen.",
    },
    cases: {
      title: "Waar AI-automatisering past.",
      desc: "Gebruik AI waar context, beslissingen en systeemacties moeten samenwerken.",
      items: [
        { t: "Incidentrespons", flow: "Detecteren → begrijpen → reageren" },
        { t: "Documentverwerking", flow: "Extraheren → classificeren → routeren" },
        { t: "Systeemmonitoring", flow: "Observeren → correleren → alerteren" },
        { t: "Workflowbeslissingen", flow: "Evalueren → beslissen → uitvoeren" },
        { t: "Operationele ondersteuning", flow: "Verzamelen → samenvatten → tonen" },
        { t: "Uitzonderingsafhandeling", flow: "Detecteren → escaleren → oplossen" },
      ],
    },
    operating: {
      title: "Het AI-bedrijfsmodel.",
      items: [
        { t: "Observeren", d: "Signalen uit systemen opvangen." },
        { t: "Begrijpen", d: "Context toevoegen uit data en historie." },
        { t: "Beslissen", d: "Regels, context en AI-redenering toepassen." },
        { t: "Reageren", d: "Actie ondernemen of escaleren." },
      ],
    },
    actions: {
      title: "Wat de automatisering daadwerkelijk doet.",
      items: [
        { t: "Detecteren", d: "Betekenisvolle veranderingen identificeren." },
        { t: "Correleren", d: "Events door systemen heen verbinden." },
        { t: "Samenvatten", d: "Operationele signalen omzetten in bruikbare context." },
        { t: "Classificeren", d: "Bepalen welk type event of verzoek plaatsvond." },
        { t: "Routeren", d: "Werk naar het juiste systeem of de juiste persoon sturen." },
        { t: "Handelen", d: "Goedgekeurde laagrisico-acties uitvoeren." },
      ],
    },
    control: {
      title: "Automatisering met grenzen.",
      desc: "Niet elke beslissing moet volledig geautomatiseerd worden. Wij bepalen waar de AI mag handelen, waar goedkeuring nodig is, en waar werk terug moet naar een mens.",
      items: [
        { t: "Geautomatiseerd", d: "Gedefinieerde laagrisico-acties worden automatisch uitgevoerd." },
        { t: "Gecontroleerd", d: "Regels, rechten en validatie beperken wat de AI mag doen." },
        { t: "Menselijke controle", d: "Belangrijke of afwijkende beslissingen kunnen naar een persoon worden gerouteerd." },
      ],
    },
    outcomes: {
      title: "Van signalen naar operationele helderheid.",
      items: [
        { t: "Snellere detectie", d: "Weet eerder van belangrijke veranderingen." },
        { t: "Minder handmatige monitoring", d: "Verminder repetitief observatiewerk." },
        { t: "Betere context", d: "Begrijp wat er gebeurde vóór u beslist wat te doen." },
        { t: "Gecontroleerde acties", d: "Automatiseer alleen binnen gedefinieerde grenzen." },
        { t: "Snellere respons", d: "Van detectie naar actie zonder onnodige overdrachten." },
        { t: "Controleerbare operatie", d: "Beslissingen en acties blijven traceerbaar." },
      ],
    },
    implementation: {
      title: "Wat de implementatie omvat.",
      items: [
        { t: "Signalen in kaart brengen", d: "Nuttige events en databronnen identificeren." },
        { t: "Systeemkoppelingen", d: "Benodigde API's, tools en systemen verbinden." },
        { t: "Context + kennis", d: "De informatie leveren die de automatisering nodig heeft." },
        { t: "AI-logica", d: "Redenering, classificatie en beslispaden definiëren." },
        { t: "Guardrails", d: "Rechten, validatie en escalatie definiëren." },
        { t: "Monitoring", d: "Gedrag na de uitrol observeren." },
      ],
    },
  },
  diagram: {
    arch: {
      aria: "AI-agentarchitectuur: invoer stroomt via context naar een AI-agent verbonden met tools, data en regels, met een beslissing en actie gecontroleerd door een mens",
      ariaCompact: "AI-agentstroom: van invoer via agent naar actie met menselijke controle",
      input: "INVOER",
      context: { t: "CONTEXT", s: "docs en historie" },
      agent: { t: "AI-AGENT", s: "begrensd, gegrond" },
      tools: { t: "TOOLS", s: "API's en stromen" },
      data: { t: "DATA", s: "records" },
      rules: { t: "REGELS", s: "grenzen" },
      decision: "BESLISSING",
      action: "ACTIE",
      review: { t: "MENSELIJKE CONTROLE", s: "goedkeuring" },
      complete: { t: "KLAAR", s: "opgeleverd" },
      toolsRow: "TOOLS, DATA, REGELS",
      captionPre: "Elke run beweegt van",
      captionCore: "invoer naar beoordeelde actie",
      captionPost: "met context, tools en regels als gronding voor elke stap.",
    },
    visual: {
      aria: "Agentarchitectuur: gebruiker of event stroomt via context naar een AI-agent verbonden met tools, data en regels, met acties gecontroleerd door een mens",
      tabsLabel: "Architectuurpaden",
      paths: [
        {
          id: "tools",
          label: "Toolspad",
          desc: "De agent roept goedgekeurde API's en workflowstappen aan om dingen in echte systemen te wijzigen.",
        },
        {
          id: "context",
          label: "Contextpad",
          desc: "Documenten, records en bedrijfsregels gronden elke beslissing in uw werkelijkheid.",
        },
        {
          id: "action",
          label: "Uitvoerpad",
          desc: "Beslissingen worden workflowacties, met een menselijk controlemoment waar oordeel telt.",
        },
      ],
      nodes: {
        user1: "GEBRUIKER /",
        user2: "EVENT",
        context: { t: "CONTEXT", s: "docs, historie" },
        agent: { t: "AI-AGENT", s1: "begrensd", s2: "gegrond" },
        tools: { t: "TOOLS", s: "API's, stromen" },
        data: { t: "DATA", s: "records" },
        rules: { t: "REGELS", s: "grenzen" },
        action: { t: "ACTIE" },
        review: { t: "MENSELIJKE CONTROLE" },
      },
      run: {
        button: "Voorbeeld uitvoeren",
        stages: [
          "Verzoek begrijpen",
          "Tool selecteren",
          "CRM aanroepen",
          "Antwoord verwerken",
          "Voltooid",
        ],
      },
    },
  },
  lifecycle: {
    eyebrow: "Hoe een agent werkt",
    title: "Zes stappen, één gecontroleerde run.",
    desc: "Selecteer een stap om te zien wat de agent doet en welke systemen hij raakt.",
    tabsLabel: "Agentstappen",
    steps: [
      {
        title: "Begrijpen",
        desc: "De agent leest het verzoek en de intentie.",
        points: ["Verzoektekst en kanaal", "Intentie en entiteiten", "Historie van deze zaak"],
      },
      {
        title: "Verzamelen",
        desc: "De agent haalt alles op wat hij nodig kan hebben.",
        points: ["Klantdata en records", "Documenten en bijlagen", "Eerdere interacties"],
      },
      {
        title: "Beslissen",
        desc: "De agent weegt opties af tegen uw regels.",
        points: ["Bedrijfsregels en limieten", "Rechten voor deze zaak", "Beschikbare acties gerangschikt"],
      },
      {
        title: "Handelen",
        desc: "De agent voert uit via gekoppelde tools.",
        points: ["API-aanroepen en updates", "Database-schrijfacties", "Berichten en notificaties"],
      },
      {
        title: "Verifiëren",
        desc: "De agent controleert het resultaat vooraf.",
        points: ["Resultaat tegen verwachting", "Systeemstatus bevestigd", "Beleid nog steeds voldaan"],
      },
      {
        title: "Escaleren",
        desc: "Onzekere zaken gaan naar een mens, met context.",
        points: ["Lage zekerheid of hoog risico", "Volledige zaak overgedragen", "Niets valt stil zonder spoor"],
      },
    ],
  },
  guardrails: {
    eyebrow: "Waarborgen",
    title: "Automatisering heeft grenzen nodig.",
    desc: "Elke agentactie doorloopt drie controles voordat iets wordt uitgevoerd. Zekerheid bepaalt of de run zelfstandig doorgaat of op een mens wacht.",
    checks: [
      { title: "Beleidscontrole", desc: "Is deze actie überhaupt toegestaan?" },
      { title: "Rechtencontrole", desc: "Mag deze agent dit systeem aanraken?" },
      { title: "Bedrijfsregel", desc: "Past de zaak binnen de gedefinieerde limieten?" },
    ],
    highLabel: "Hoge zekerheid",
    highAction: "Uitvoeren",
    lowLabel: "Lage zekerheid",
    lowAction: "Menselijke review",
  },
  approval: {
    eyebrow: "Mens in de lus",
    title: "Mensen beslissen waar het telt.",
    desc: "De agent bereidt het volledige beeld voor. Een mens keurt goed met één actie, en de workflow gaat verder.",
    recommendation: "Leveranciersfactuur goedkeuren",
    confidenceLabel: "Zekerheid",
    confidenceValue: "Hoog",
    policyNote: "Beleid vereist menselijke goedkeuring boven € 1.000.",
    approve: "Goedkeuren",
    reject: "Afwijzen",
    approved: "Goedgekeurd. De workflow gaat verder naar betaling.",
    rejected: "Afgewezen. De zaak gaat terug naar de aanvrager.",
  },
  example: {
    eyebrow: "In de praktijk",
    title: "Document, beslissing, actie.",
    desc: "Een binnenkomende offerteaanvraag reist van bestand naar gestructureerd resultaat. Alles wat onduidelijk is, stopt bij een mens.",
    tabsLabel: "Offerte-stroom",
    yes: "Ja",
    no: "Nee",
    branchQ: "Informatie ontbreekt?",
  },
  compare: {
    eyebrow: "Gecontroleerde AI",
    title: "Meer dan prompt en antwoord.",
    genericTitle: "Generieke AI",
    prompt: "Prompt",
    response: "Antwoord",
    sysTitle: "SystemaOps AI-automatisering",
    steps: ["Context", "Regels", "Tools", "Agent", "Validatie", "Actie", "Audit"],
  },
  workspace: {
    aria: "AI-agent die een bedrijfsworkflow uitvoert, met context, tools, data, regels en menselijke review rond de agent",
    consoleTitle: "Live uitvoering",
    coreTitle: "AI-agent",
    coreSub: "Begrijpt, plant, handelt",
    nodes: {
      context: { t: "Context", s: "Documenten, historie, bedrijfsstatus", d: ["Documenten", "Bedrijfsstatus", "Gesprekshistorie"] },
      tools: { t: "Tools", s: "CRM, Odoo, API's", d: ["CRM", "Odoo", "Interne API's"] },
      data: { t: "Data", s: "Records en antwoorden", d: ["Klantrecords", "Queryresultaten", "Workflowuitvoer"] },
      rules: { t: "Regels", s: "Beleid en rechten", d: ["Bedrijfsbeleid", "Rechten", "Zekerheidslimieten"] },
      review: { t: "Menselijke review", s: "Goedkeuringen en escalaties", d: ["Goedkeuringscontroles", "Escalaties", "Uitzonderingszaken"] },
    },
    steps: [
      { title: "Verzoek begrijpen", detail: "Gebruikersinvoer en intentie analyseren..." },
      { title: "Bedrijfscontext lezen", detail: "Relevante data ophalen..." },
      { title: "Beste tool selecteren", detail: "CRM kiezen op basis van intentie..." },
      { title: "CRM aanroepen", detail: "Klantinformatie ophalen..." },
      { title: "Antwoord verwerken", detail: "Valideren en regels toepassen..." },
      { title: "Regels valideren", detail: "Beleid en rechten controleren..." },
      { title: "Menselijke review", detail: "Wachten op menselijke goedkeuring..." },
      { title: "Voltooid", detail: "Taak succesvol afgerond." },
    ],
    result: {
      title: "Resultaat",
      desc: "Klantinformatie opgehaald en klaar voor de volgende actie.",
    },
    features: [
      { t: "Enterprise-klaar", d: "Veilig & beheerst" },
      { t: "Werkt met uw tools", d: "Odoo, API's en meer" },
      { t: "Mens aan het roer", d: "Waar het telt" },
      { t: "Gebouwd voor echte operatie", d: "Meer dan chat" },
    ],
    explain: [
      { t: "Begrijpt context", d: "Verbindt met uw data, documenten en bedrijfsstatus." },
      { t: "Gebruikt de juiste tools", d: "Werkt met Odoo, API's en interne systemen." },
      { t: "Volgt uw regels", d: "Respecteert beleid, rechten en beslissingslimieten." },
      { t: "Escaleert wanneer nodig", d: "Draagt over aan mensen voor belangrijke beslissingen." },
    ],
    controls: {
      ready: "Agent is klaar",
      hint: "Klik om het in actie te zien",
      play: "Starten",
      pause: "Pauzeren",
      again: "Opnieuw uitvoeren",
      running: "Actief",
      paused: "Gepauzeerd",
      readyStatus: "Klaar",
    },
  },
  process: {
    eyebrow: "Zo implementeren wij",
    title: "Identificeren, gronden, handelen, beoordelen.",
    steps: [
      {
        title: "Identificeren",
        desc: "Wij vinden het herhaalbare werk: terugkerende verzoeken, beslissingen en handmatige systeemacties die overgedragen kunnen worden.",
      },
      {
        title: "Gronden",
        desc: "De agent krijgt wat hij nodig heeft, context uit uw data, tools die hij mag aanroepen, en regels die hij moet volgen.",
      },
      {
        title: "Handelen",
        desc: "De agent voert de passende workflowactie uit: systemen bijwerken, antwoorden sturen, werk vooruitbrengen.",
      },
      {
        title: "Beoordelen",
        desc: "Een menselijk controlemoment staat waar passend. Goedgekeurd werk loopt door; uitzonderingen komen terug met context.",
      },
    ],
  },
  tech: {
    eyebrow: "Technologie",
    title: "AI verbonden met echte systemen.",
    desc: "Agents zijn alleen nuttig binnen de operatie, hier gegroepeerd per rol, van de modellen die redeneren tot de systemen waarop ze handelen.",
    groups: [
      {
        role: "AI / Modellen",
        items: ["LLM-agents", "Classificatie", "Samenvatting", "Beslissingsondersteuning"],
      },
      {
        role: "Tools",
        items: ["API-acties", "Toolaanroepen", "n8n-stappen", "Meldingen"],
      },
      {
        role: "Data / Context",
        items: ["Documenten", "Databases", "E-mail", "Google Sheets", "Slack"],
      },
      {
        role: "Integraties",
        items: ["Odoo ERP", "CRM-systemen", "Webhooks", "REST-API's"],
      },
      {
        role: "Workflow",
        items: ["Goedkeuringen", "Uitzonderingspaden", "Monitoring", "Beoordelingswachtrijen"],
      },
    ],
  },
  useCases: {
    eyebrow: "Gebruiksgevallen",
    title: "Herhaalbaar werk, afgehandeld.",
    items: [
      {
        title: "Terugkerende interne verzoeken",
        flow: ["Verzoek komt binnen", "Agent classificeert en bereidt voor", "Gestructureerd antwoord verstuurd"],
        desc: "Terugkerende vragen en standaardverzoeken krijgen consistente, gegronde antwoorden, met overdracht aan een mens als de zaak niet past.",
      },
      {
        title: "Documentinname naar record",
        flow: ["Bestand vastgelegd", "Velden geëxtraheerd en gecontroleerd", "Record aangemaakt in ERP"],
        desc: "Binnenkomende documenten worden gestructureerde records in Odoo of uw CRM, gevalideerd voordat iets wordt weggeschreven.",
      },
      {
        title: "Opvolging die nooit verslapt",
        flow: ["Event gedetecteerd", "Agent stelt op en verstuurt", "Mens beoordeelt uitzonderingen"],
        desc: "Offertes, herinneringen en statusupdates gaan op tijd de deur uit, terwijl alles wat afwijkt op een mens wacht.",
      },
      {
        title: "Rapportage zonder sleur",
        flow: ["Data verzameld", "AI vat samen", "Rapport opgeleverd"],
        desc: "Operationele data uit uw systemen wordt leesbare samenvattingen en rapporten op een schema dat uw team bepaalt.",
      },
    ],
  },
  engagement: {
    eyebrow: "Aanpak",
    title: "Wat de implementatie omvat.",
    items: [
      "Discovery, waar herhaalbaar werk en beslissingen vandaag leven",
      "Agentontwerp, scope, contextbronnen, tools en grenzen",
      "Integratie, koppelingen met Odoo, CRM, n8n en dagelijkse tools",
      "Workflowimplementatie, agents draaiend in gemonitorde stromen",
      "Tests, randgevallen, faalpaden en kwaliteitscontroles",
      "Monitoring, zicht op wat agents doen en waar ze stoppen",
      "Menselijke beoordeling, controlemomenten rond oordeel ontworpen, niet rond gewoonte",
    ],
  },
  faq: {
    eyebrow: "Vragen",
    title: "AI-automatisering, direct beantwoord.",
    items: [
      {
        q: "Waar moet AI het eerst worden ingezet?",
        a: "Waar werk zich herhaalt met duidelijke patronen: terugkerende verzoeken, documentafhandeling, opvolging en gestructureerde antwoorden. Wij zoeken hoogfrequente taken met verifieerbare output, die verdienen zich het snelst terug en falen het veiligst.",
      },
      {
        q: "Kan AI met onze bestaande systemen werken?",
        a: "Ja. Agents handelen via de tools die u al gebruikt, Odoo, CRM's, n8n-workflows, databases, e-mail en chat, via API's en webhooks. Niets hoeft vervangen voor AI om te helpen.",
      },
      {
        q: "Hoe regelen jullie menselijke goedkeuring?",
        a: "Goedkeuringsmomenten worden in de workflow ontworpen waar oordeel telt. De agent bereidt alles voor, context, concept, aanbeveling, en een mens keurt goed met één actie.",
      },
      {
        q: "Wat gebeurt er als een agent een taak niet kan voltooien?",
        a: "Hij stopt in plaats van te gokken. De zaak gaat naar een mens met alles wat de agent tot dan toe verzamelde, zodat geen werk verloren gaat en de fout zichtbaar is.",
      },
      {
        q: "Hoe blijven agents gegrond in onze werkelijkheid?",
        a: "Ze werken vanuit uw data en documenten, roepen alleen toegestane tools aan en volgen regels uit het ontwerp. Alles buiten die grenzen gaat naar een mens.",
      },
    ],
  },
  related: {
    eyebrow: "Blijf ontdekken",
    title: "Gerelateerde diensten.",
    linkLabel: "Bekijk",
    items: [
      {
        title: "Odoo-oplossingen",
        desc: "ERP, CRM en bedrijfsapplicaties passend bij uw werkwijze.",
        href: "/odoo-customization",
      },
      {
        title: "Workflowautomatisering",
        desc: "Automatiseer terugkerende operatie in de tools die u al gebruikt.",
        href: "/workflow-automation",
      },
      {
        title: "Data- & documentautomatisering",
        desc: "Verwerk, routeer en synchroniseer documenten en data automatisch.",
        href: "/data-document-automation",
      },
    ],
  },
  ctaOrbit: {
    eyebrow: "Klaar om te automatiseren?",
    title: "Geef uw operatie",
    highlight: "een AI-voordeel.",
    desc: "Verbind uw bedrijfscontext, tools en regels in intelligente workflows die handelen wanneer werk moet bewegen.",
    button: "Bespreek een AI-workflow",
    diagram: {
      center: "AI-agent",
      centerSub: "Begrijpt, plant, handelt",
      nodes: [
        { t: "Context", s: "Bedrijfsdata" },
        { t: "Tools", s: "API's, Odoo, CRM" },
        { t: "Regels", s: "Beleid en waarborgen" },
        { t: "Actie", s: "Uitvoeren en escaleren" },
      ],
    },
  },
  cta: {
    eyebrow: "Klaar wanneer u dat bent",
    title: "Heeft u een proces waar AI",
    highlight: "meer kan dan antwoorden?",
    desc: "Laten we een agent ontwerpen die kan begrijpen, handelen en opereren binnen uw bedrijfsregels.",
    button: "Bespreek een AI-workflow",
  },
};

const de = {
  meta: {
    title: "KI-Automatisierungsdienste",
    description:
      "KI-Agenten und intelligente Workflows aufbauen, die mit den Systemen arbeiten, die Ihr Team bereits nutzt, für wiederkehrende Aufgaben, mit Menschen im Loop, wo Urteil zählt.",
    keywords:
      "KI-Automatisierung, KI-Agenten, Business-Automatisierung, intelligente Workflows, KI-Automatisierungsdienste, Human in the Loop",
    schemaName: "KI-Automatisierung",
    schemaDesc:
      "KI-Automatisierungsdienste, die Unternehmen helfen, wiederkehrende Operationen zu automatisieren, Workflows zu verbessern und effizient zu skalieren.",
  },
  hero: {
    eyebrow: "KI-Automatisierung & Agenten",
    title: "Geben Sie KI den Kontext,",
    highlight: "die Tools und Grenzen zum Handeln.",
    description:
      "Bauen Sie KI-Agenten, die Geschäftskontext verstehen, verbundene Tools nutzen, definierten Regeln folgen und Entscheidungen eskalieren, wenn menschliches Urteil gefragt ist.",
    primaryCta: "KI-Workflow besprechen",
    secondaryCta: "Agenten in Aktion sehen",
  },
  problem: {
    eyebrow: "Das Problem",
    title: "KI ist nützlich",
    highlight: "wenn sie in den Workflow passt.",
    items: [
      {
        lead: "Wiederkehrende interne Anfragen",
        text: "täglich dieselben Fragen und jemand tippt dieselben Antworten.",
      },
      {
        lead: "Dokumentenhandling",
        text: "Dateien kommen schneller an, als jemand lesen, extrahieren und ablegen kann.",
      },
      {
        lead: "Wiederkehrende Entscheidungen",
        text: "routinemäßige Freigaben und Klassifizierungen warten auf beschäftigte Menschen.",
      },
      {
        lead: "Strukturierte Antworten",
        text: "Angebote, Bestätigungen und Follow-ups jedes Mal von Hand zusammengestellt.",
      },
      {
        lead: "Manuelle Systemaktionen",
        text: "Entscheidungen in Tools übertragen, Datensätze pflegen, die nächste Nachricht senden.",
      },
    ],
    beforeLabel: "OHNE GEGROUNDETE AGENTEN",
    beforeItems: [
      "Dieselben internen Anfragen täglich von Hand beantwortet",
      "Dateien, die schneller ankommen, als jemand verarbeiten kann",
      "Routinemäßige Freigaben, die auf beschäftigte Menschen warten",
      "Angebote, Follow-ups und Systemupdates manuell zusammengestellt",
    ],
    afterLabel: "MIT GEGROUNDETEN AGENTEN",
    afterItems: [
      "Wiederkehrende Anfragen konsistent bearbeitet, mit Übergabe, wenn ein Fall nicht passt",
      "Eingehende Dokumente werden validierte Datensätze in ERP oder CRM",
      "Routinemäßige Entscheidungen für schnelle menschliche Freigabe vorbereitet",
      "Erinnerungen, Berichte und Updates pünktlich versendet, Ausnahmen von Menschen geprüft",
    ],
  },
  capabilities: {
    eyebrow: "Leistungen",
    title: "Was die Agenten wirklich tun.",
    items: [
      {
        title: "KI-Agenten",
        desc: "Agenten, die Anfragen verstehen, begrenzte Entscheidungen treffen und Aufgaben in Ihren Tools ausführen, abgegrenzt auf Jobs, die Sie definieren.",
      },
      {
        title: "Tool-Calling und Integrationen",
        desc: "Agenten handeln über APIs und Workflows: Datensätze pflegen, Abläufe triggern und Informationen zwischen Systemen bewegen.",
      },
      {
        title: "Dokumentenworkflows",
        desc: "Erfassung, Extraktion und Validierung machen aus eingehenden Dateien strukturierte Werte für den Rest der Operation.",
      },
      {
        title: "Task-Automatisierung",
        desc: "Follow-ups, Benachrichtigungen, Datenerfassung und Routineadministration konsistent erledigt, jedes Mal.",
      },
      {
        title: "Mensch im Loop",
        desc: "Freigabepunkte, wo Urteil zählt. Menschen entscheiden; das System bereitet alles rund um die Entscheidung vor.",
      },
      {
        title: "Workflow-Orchestrierung",
        desc: "Agenten laufen als Schritte in größeren n8n-Workflows, mit Retries, Verzweigungen und Ausnahmepfaden darum.",
      },
    ],
  },
  architecture: {
    eyebrow: "Architektur",
    title: "Fundierte Agenten, sichtbare Pfade.",
    desc: "Jeder Agent sitzt zwischen Kontext und Aktion. Ein Nutzer oder Event kommt über Kontext herein, der Agent schlussfolgert mit Tools, Daten und Regeln, das Ergebnis wird eine Aktion, und unsichere Fälle stoppen bei einem menschlichen Check.",
  },
  narrative: {
    problem: {
      title: "Wenn sich etwas ändert,",
      highlight: "sollte Ihr Team wissen, warum.",
      areas: [
        { t: "Signale gehen verloren", d: "Events liegen verstreut über Systeme, Logs und operative Tools." },
        { t: "Entscheidungen fehlt Kontext", d: "Teams sehen Symptome, aber nicht immer die ganze Kette dahinter." },
      ],
    },
    capabilities: {
      title: "Sichtbarkeit über den ganzen Stack.",
      desc: "Sehen Sie, was sich geändert hat, wo es sich geändert hat und was Aufmerksamkeit braucht.",
      items: [
        { t: "Anwendung", d: "Anwendungsverhalten und Events." },
        { t: "Automatisierung", d: "Workflow-Ausführung und Fehler." },
        { t: "Daten", d: "Datenbewegung und Zustandsänderungen." },
        { t: "Integrationen", d: "Externe Systeme und API-Aktivität." },
        { t: "Workflows", d: "Prozessausführung und Engpässe." },
        { t: "Alerts", d: "Wichtige Änderungen, die Aufmerksamkeit erfordern." },
      ],
    },
    signal: {
      title: "Jedes Signal hat irgendwo hinzugehen.",
      desc: "Von der Erkennung zu einem kontrollierten Ergebnis.",
      steps: [
        { t: "Event", d: "Etwas hat sich geändert" },
        { t: "Kontext", d: "Was ist betroffen?" },
        { t: "Analyse", d: "Ist das erwartet?" },
        { t: "Entscheidung", d: "Was soll geschehen?" },
        { t: "Aktion", d: "Automatisieren oder eskalieren" },
      ],
    },
    visual: {
      title: "Eine Schicht, die alles beobachtet.",
      desc: "KI verbindet Signale, Kontext und Aktionen über Ihre Systeme hinweg.",
    },
    cases: {
      title: "Wo KI-Automatisierung passt.",
      desc: "Setzen Sie KI dort ein, wo Kontext, Entscheidungen und Systemaktionen zusammenarbeiten müssen.",
      items: [
        { t: "Incident-Response", flow: "Erkennen → verstehen → reagieren" },
        { t: "Dokumentenverarbeitung", flow: "Extrahieren → klassifizieren → routen" },
        { t: "System-Monitoring", flow: "Beobachten → korrelieren → alarmieren" },
        { t: "Workflow-Entscheidungen", flow: "Bewerten → entscheiden → ausführen" },
        { t: "Betriebsunterstützung", flow: "Sammeln → zusammenfassen → anzeigen" },
        { t: "Ausnahmebehandlung", flow: "Erkennen → eskalieren → lösen" },
      ],
    },
    operating: {
      title: "Das KI-Betriebsmodell.",
      items: [
        { t: "Beobachten", d: "Signale aus Systemen erfassen." },
        { t: "Verstehen", d: "Kontext aus Daten und Verlauf ergänzen." },
        { t: "Entscheiden", d: "Regeln, Kontext und KI-Schlussfolgerung anwenden." },
        { t: "Reagieren", d: "Handeln oder eskalieren." },
      ],
    },
    actions: {
      title: "Was die Automatisierung tatsächlich tut.",
      items: [
        { t: "Erkennen", d: "Bedeutsame Änderungen identifizieren." },
        { t: "Korrelieren", d: "Events über Systeme hinweg verbinden." },
        { t: "Zusammenfassen", d: "Betriebssignale in nutzbaren Kontext verwandeln." },
        { t: "Klassifizieren", d: "Bestimmen, welcher Event- oder Anfrage-Typ vorliegt." },
        { t: "Routen", d: "Arbeit an das richtige System oder die richtige Person senden." },
        { t: "Handeln", d: "Freigegebene risikoarme Aktionen ausführen." },
      ],
    },
    control: {
      title: "Automatisierung mit Grenzen.",
      desc: "Nicht jede Entscheidung sollte voll automatisiert werden. Wir definieren, wo die KI handeln darf, wo Freigabe nötig ist und wo Arbeit zurück an einen Menschen geht.",
      items: [
        { t: "Automatisiert", d: "Definierte risikoarme Aktionen werden automatisch ausgeführt." },
        { t: "Kontrolliert", d: "Regeln, Berechtigungen und Validierung begrenzen, was die KI tun darf." },
        { t: "Menschliche Prüfung", d: "Wichtige oder außergewöhnliche Entscheidungen können an einen Menschen geroutet werden." },
      ],
    },
    outcomes: {
      title: "Von Signalen zu operativer Klarheit.",
      items: [
        { t: "Schnellere Erkennung", d: "Früher von wichtigen Änderungen erfahren." },
        { t: "Weniger manuelles Monitoring", d: "Wiederkehrende Beobachtungsarbeit reduzieren." },
        { t: "Besserer Kontext", d: "Verstehen, was geschah, bevor entschieden wird." },
        { t: "Kontrollierte Aktionen", d: "Nur innerhalb definierter Grenzen automatisieren." },
        { t: "Schnellere Reaktion", d: "Von Erkennung zu Aktion ohne unnötige Übergaben." },
        { t: "Auditierbare Abläufe", d: "Entscheidungen und Aktionen bleiben nachvollziehbar." },
      ],
    },
    implementation: {
      title: "Was die Implementierung umfasst.",
      items: [
        { t: "Signal-Mapping", d: "Nützliche Events und Datenquellen identifizieren." },
        { t: "Systemanbindungen", d: "Nötige APIs, Tools und Systeme verbinden." },
        { t: "Kontext + Wissen", d: "Die Informationen liefern, die die Automatisierung braucht." },
        { t: "KI-Logik", d: "Schlussfolgerung, Klassifizierung und Entscheidungspfade definieren." },
        { t: "Leitplanken", d: "Berechtigungen, Validierung und Eskalation definieren." },
        { t: "Monitoring", d: "Verhalten nach dem Deployment beobachten." },
      ],
    },
  },
  diagram: {
    arch: {
      aria: "KI-Agentenarchitektur: Eingaben fließen über Kontext in einen KI-Agenten verbunden mit Tools, Daten und Regeln, mit Entscheidung und Aktion geprüft von einem Menschen",
      ariaCompact: "KI-Agentenfluss: von Eingabe über Agent zu Aktion mit menschlichem Check",
      input: "EINGABE",
      context: { t: "KONTEXT", s: "Docs und Verlauf" },
      agent: { t: "KI-AGENT", s: "begrenzt, fundiert" },
      tools: { t: "TOOLS", s: "APIs und Abläufe" },
      data: { t: "DATEN", s: "Datensätze" },
      rules: { t: "REGELN", s: "Grenzen" },
      decision: "ENTSCHEIDUNG",
      action: "AKTION",
      review: { t: "MENSCHLICHER CHECK", s: "Freigabe" },
      complete: { t: "FERTIG", s: "geliefert" },
      toolsRow: "TOOLS, DATEN, REGELN",
      captionPre: "Jeder Lauf bewegt sich von",
      captionCore: "Eingabe zu geprüfter Aktion",
      captionPost: "mit Kontext, Tools und Regeln als Fundierung für jeden Schritt.",
    },
    visual: {
      aria: "Agentenarchitektur: Nutzer oder Event fließt über Kontext in einen KI-Agenten verbunden mit Tools, Daten und Regeln, mit Aktionen geprüft von einem Menschen",
      tabsLabel: "Architekturpfade",
      paths: [
        {
          id: "tools",
          label: "Tools-Pfad",
          desc: "Der Agent ruft freigegebene APIs und Workflowschritte auf, um Dinge in echten Systemen zu ändern.",
        },
        {
          id: "context",
          label: "Kontext-Pfad",
          desc: "Dokumente, Datensätze und Geschäftsregeln fundieren jede Entscheidung in Ihrer Realität.",
        },
        {
          id: "action",
          label: "Ausführungspfad",
          desc: "Entscheidungen werden Workflow-Aktionen, mit menschlichem Checkpoint, wo Urteil zählt.",
        },
      ],
      nodes: {
        user1: "NUTZER /",
        user2: "EVENT",
        context: { t: "KONTEXT", s: "Docs, Verlauf" },
        agent: { t: "KI-AGENT", s1: "begrenzt", s2: "fundiert" },
        tools: { t: "TOOLS", s: "APIs, Abläufe" },
        data: { t: "DATEN", s: "Datensätze" },
        rules: { t: "REGELN", s: "Grenzen" },
        action: { t: "AKTION" },
        review: { t: "MENSCHLICHER CHECK" },
      },
      run: {
        button: "Beispiel ausführen",
        stages: [
          "Anfrage verstehen",
          "Tool wählen",
          "CRM aufrufen",
          "Antwort verarbeiten",
          "Abgeschlossen",
        ],
      },
    },
  },
  lifecycle: {
    eyebrow: "So arbeitet ein Agent",
    title: "Sechs Schritte, ein kontrollierter Lauf.",
    desc: "Wählen Sie einen Schritt, um zu sehen, was der Agent tut und welche Systeme er berührt.",
    tabsLabel: "Agentenschritte",
    steps: [
      {
        title: "Verstehen",
        desc: "Der Agent liest Anfrage und Absicht.",
        points: ["Anfragetext und Kanal", "Absicht und Entitäten", "Verlauf dieses Falls"],
      },
      {
        title: "Sammeln",
        desc: "Der Agent holt alles, was er brauchen könnte.",
        points: ["Kundendaten und Datensätze", "Dokumente und Anhänge", "Frühere Interaktionen"],
      },
      {
        title: "Entscheiden",
        desc: "Der Agent wägt Optionen an Ihren Regeln ab.",
        points: ["Geschäftsregeln und Limits", "Rechte für diesen Fall", "Verfügbare Aktionen gereiht"],
      },
      {
        title: "Handeln",
        desc: "Der Agent führt über verbundene Tools aus.",
        points: ["API-Aufrufe und Updates", "Datenbank-Schreibzugriffe", "Nachrichten und Hinweise"],
      },
      {
        title: "Prüfen",
        desc: "Der Agent kontrolliert das Ergebnis vorab.",
        points: ["Ergebnis gegen Erwartung", "Systemstatus bestätigt", "Richtlinie weiter erfüllt"],
      },
      {
        title: "Eskalieren",
        desc: "Unsichere Fälle gehen an einen Menschen, mit Kontext.",
        points: ["Geringe Sicherheit oder hohes Risiko", "Voller Fall übergeben", "Nichts bleibt lautlos stehen"],
      },
    ],
  },
  guardrails: {
    eyebrow: "Leitplanken",
    title: "Automatisierung braucht Grenzen.",
    desc: "Jede Agentenaktion durchläuft drei Prüfungen, bevor etwas ausgeführt wird. Die Sicherheit entscheidet, ob der Lauf allein weitergeht oder auf einen Menschen wartet.",
    checks: [
      { title: "Richtlinienprüfung", desc: "Ist diese Aktion überhaupt erlaubt?" },
      { title: "Berechtigungsprüfung", desc: "Darf dieser Agent dieses System anfassen?" },
      { title: "Geschäftsregel", desc: "Passt der Fall in die definierten Limits?" },
    ],
    highLabel: "Hohe Sicherheit",
    highAction: "Ausführen",
    lowLabel: "Geringe Sicherheit",
    lowAction: "Menschliches Review",
  },
  approval: {
    eyebrow: "Mensch in der Schleife",
    title: "Menschen entscheiden, wo es zählt.",
    desc: "Der Agent bereitet das volle Bild vor. Ein Mensch gibt mit einer Aktion frei, und der Workflow läuft weiter.",
    recommendation: "Lieferantenrechnung freigeben",
    confidenceLabel: "Sicherheit",
    confidenceValue: "Hoch",
    policyNote: "Die Richtlinie verlangt menschliche Freigabe über 1.000 €.",
    approve: "Genehmigen",
    reject: "Ablehnen",
    approved: "Genehmigt. Der Workflow läuft weiter zur Zahlung.",
    rejected: "Abgelehnt. Der Fall geht zurück an den Anfragenden.",
  },
  example: {
    eyebrow: "In der Praxis",
    title: "Dokument, Entscheidung, Aktion.",
    desc: "Eine eingehende Angebotsanfrage wandert von der Datei zum strukturierten Ergebnis. Alles Unklare stoppt bei einem Menschen.",
    tabsLabel: "Angebotsfluss",
    yes: "Ja",
    no: "Nein",
    branchQ: "Informationen fehlen?",
  },
  compare: {
    eyebrow: "Kontrollierte KI",
    title: "Mehr als Prompt und Antwort.",
    genericTitle: "Generische KI",
    prompt: "Prompt",
    response: "Antwort",
    sysTitle: "SystemaOps-KI-Automatisierung",
    steps: ["Kontext", "Regeln", "Tools", "Agent", "Validierung", "Aktion", "Audit"],
  },
  workspace: {
    aria: "KI-Agent, der einen Geschäftsworkflow ausführt, mit Kontext, Tools, Daten, Regeln und menschlicher Prüfung um den Agenten",
    consoleTitle: "Live-Ausführung",
    coreTitle: "KI-Agent",
    coreSub: "Versteht, plant, handelt",
    nodes: {
      context: { t: "Kontext", s: "Dokumente, Verlauf, Geschäftsstatus", d: ["Dokumente", "Geschäftsstatus", "Gesprächsverlauf"] },
      tools: { t: "Tools", s: "CRM, Odoo, APIs", d: ["CRM", "Odoo", "Interne APIs"] },
      data: { t: "Daten", s: "Datensätze und Antworten", d: ["Kundendatensätze", "Abfrageergebnisse", "Workflow-Ausgaben"] },
      rules: { t: "Regeln", s: "Richtlinien und Berechtigungen", d: ["Geschäftsrichtlinien", "Berechtigungen", "Sicherheitslimits"] },
      review: { t: "Menschliche Prüfung", s: "Freigaben und Eskalationen", d: ["Freigabeprüfungen", "Eskalationen", "Ausnahmefälle"] },
    },
    steps: [
      { title: "Anfrage verstehen", detail: "Benutzereingabe und Absicht analysieren..." },
      { title: "Geschäftskontext lesen", detail: "Relevante Daten holen..." },
      { title: "Bestes Tool wählen", detail: "CRM nach Absicht wählen..." },
      { title: "CRM aufrufen", detail: "Kundeninformationen abrufen..." },
      { title: "Antwort verarbeiten", detail: "Validieren und Regeln anwenden..." },
      { title: "Regeln prüfen", detail: "Richtlinien und Rechte prüfen..." },
      { title: "Menschliche Prüfung", detail: "Warten auf menschliche Freigabe..." },
      { title: "Abgeschlossen", detail: "Aufgabe erfolgreich abgeschlossen." },
    ],
    result: {
      title: "Ergebnis",
      desc: "Kundeninformationen abgerufen und bereit für den nächsten Schritt.",
    },
    features: [
      { t: "Enterprise-bereit", d: "Sicher & verwaltet" },
      { t: "Funktioniert mit Ihren Tools", d: "Odoo, APIs und mehr" },
      { t: "Mensch behält Kontrolle", d: "Wo es zählt" },
      { t: "Für echten Betrieb gebaut", d: "Mehr als Chat" },
    ],
    explain: [
      { t: "Versteht Kontext", d: "Verbindet sich mit Ihren Daten, Dokumenten und Geschäftsstatus." },
      { t: "Nutzt die richtigen Tools", d: "Arbeitet mit Odoo, APIs und internen Systemen." },
      { t: "Folgt Ihren Regeln", d: "Respektiert Richtlinien, Rechte und Entscheidungsgrenzen." },
      { t: "Eskaliert bei Bedarf", d: "Übergibt an Menschen bei wichtigen Entscheidungen." },
    ],
    controls: {
      ready: "Agent ist bereit",
      hint: "Klicken, um ihn in Aktion zu sehen",
      play: "Starten",
      pause: "Pausieren",
      again: "Erneut ausführen",
      running: "Aktiv",
      paused: "Pausiert",
      readyStatus: "Bereit",
    },
  },
  process: {
    eyebrow: "So setzen wir um",
    title: "Identifizieren, fundieren, handeln, prüfen.",
    steps: [
      {
        title: "Identifizieren",
        desc: "Wir finden die wiederkehrende Arbeit: wiederholte Anfragen, Entscheidungen und manuelle Systemaktionen, die sich zur Übergabe eignen.",
      },
      {
        title: "Fundieren",
        desc: "Der Agent bekommt, was er braucht, Kontext aus Ihren Daten, Tools, die er rufen darf, und Regeln, denen er folgen muss.",
      },
      {
        title: "Handeln",
        desc: "Der Agent führt die passende Workflow-Aktion aus: Systeme pflegen, Antworten senden, Arbeit voranbringen.",
      },
      {
        title: "Prüfen",
        desc: "Ein menschlicher Checkpoint steht, wo angebracht. Freigegebene Arbeit läuft weiter; Ausnahmen kommen mit Kontext zurück.",
      },
    ],
  },
  tech: {
    eyebrow: "Technologie",
    title: "KI verbunden mit echten Systemen.",
    desc: "Agenten sind nur innerhalb der Operation nützlich, hier nach Rolle gruppiert, von den Modellen, die schlussfolgern, bis zu den Systemen, auf die sie wirken.",
    groups: [
      {
        role: "KI / Modelle",
        items: ["LLM-Agenten", "Klassifizierung", "Zusammenfassung", "Entscheidungsunterstützung"],
      },
      {
        role: "Tools",
        items: ["API-Aktionen", "Tool-Calling", "n8n-Schritte", "Benachrichtigungen"],
      },
      {
        role: "Daten / Kontext",
        items: ["Dokumente", "Datenbanken", "E-Mail", "Google Sheets", "Slack"],
      },
      {
        role: "Integrationen",
        items: ["Odoo ERP", "CRM-Systeme", "Webhooks", "REST-APIs"],
      },
      {
        role: "Workflow",
        items: ["Freigaben", "Ausnahmepfade", "Monitoring", "Review-Queues"],
      },
    ],
  },
  useCases: {
    eyebrow: "Anwendungsfälle",
    title: "Wiederkehrende Arbeit, erledigt.",
    items: [
      {
        title: "Wiederkehrende interne Anfragen",
        flow: ["Anfrage kommt an", "Agent klassifiziert und bereitet vor", "Strukturierte Antwort versendet"],
        desc: "Wiederholte Fragen und Standardanfragen erhalten konsistente, fundierte Antworten, mit Übergabe an einen Menschen, wenn der Fall nicht passt.",
      },
      {
        title: "Dokumenteneingang zu Datensatz",
        flow: ["Datei erfasst", "Felder extrahiert und geprüft", "Datensatz in ERP angelegt"],
        desc: "Eingehende Dokumente werden strukturierte Datensätze in Odoo oder Ihrem CRM, validiert, bevor etwas geschrieben wird.",
      },
      {
        title: "Follow-ups, die nie liegen bleiben",
        flow: ["Event erkannt", "Agent entwirft und sendet", "Mensch prüft Ausnahmen"],
        desc: "Angebote, Erinnerungen und Statusupdates gehen pünktlich raus, während alles Ungewöhnliche auf einen Menschen wartet.",
      },
      {
        title: "Reporting ohne Mühle",
        flow: ["Daten gesammelt", "KI fasst zusammen", "Bericht geliefert"],
        desc: "Operative Daten aus Ihren Systemen werden lesbare Zusammenfassungen und Berichte nach einem Plan, den Ihr Team setzt.",
      },
    ],
  },
  engagement: {
    eyebrow: "Umfang",
    title: "Was die Implementierung enthält.",
    items: [
      "Discovery, wo wiederkehrende Arbeit und Entscheidungen heute leben",
      "Agent-Design, Scope, Kontextquellen, Tools und Grenzen",
      "Integration, Anbindungen an Odoo, CRM, n8n und Alltagstools",
      "Workflow-Implementierung, Agenten laufend in überwachten Abläufen",
      "Tests, Edge Cases, Fehlerpfade und Qualitätschecks",
      "Monitoring, Sichtbarkeit, was Agenten tun und wo sie stoppen",
      "Menschliche Prüfung, Checkpoints rund um Urteil designed, nicht um Gewohnheit",
    ],
  },
  faq: {
    eyebrow: "Fragen",
    title: "KI-Automatisierung, direkt beantwortet.",
    items: [
      {
        q: "Wo sollte KI zuerst eingesetzt werden?",
        a: "Wo sich Arbeit mit klaren Mustern wiederholt: wiederkehrende Anfragen, Dokumentenhandling, Follow-ups und strukturierte Antworten. Wir suchen hochfrequente Aufgaben mit verifizierbarem Output, die zahlen sich am schnellsten aus und scheitern am sichersten.",
      },
      {
        q: "Funktioniert KI mit unseren bestehenden Systemen?",
        a: "Ja. Agenten handeln über Ihre bestehenden Tools, Odoo, CRMs, n8n-Workflows, Datenbanken, E-Mail und Chat, per API und Webhook. Nichts muss ersetzt werden, damit KI hilft.",
      },
      {
        q: "Wie handhaben Sie menschliche Freigaben?",
        a: "Freigabepunkte werden dort in den Workflow designed, wo Urteil zählt. Der Agent bereitet alles vor, Kontext, Entwurf, Empfehlung, und ein Mensch gibt mit einer Aktion frei.",
      },
      {
        q: "Was passiert, wenn ein Agent eine Aufgabe nicht schafft?",
        a: "Er stoppt, statt zu raten. Der Fall geht an einen Menschen mit allem, was der Agent bisher sammelte, sodass keine Arbeit verloren geht und der Fehler sichtbar ist.",
      },
      {
        q: "Wie bleiben Agenten in unserer Realität fundiert?",
        a: "Sie arbeiten aus Ihren Daten und Dokumenten, rufen nur erlaubte Tools und folgen Design-Regeln. Alles außerhalb dieser Grenzen geht an einen Menschen.",
      },
    ],
  },
  related: {
    eyebrow: "Weiter entdecken",
    title: "Verwandte Leistungen.",
    linkLabel: "Entdecken",
    items: [
      {
        title: "Odoo-Lösungen",
        desc: "ERP, CRM und Geschäftsanwendungen passend zu Ihrer Arbeitsweise.",
        href: "/odoo-customization",
      },
      {
        title: "Workflow-Automatisierung",
        desc: "Wiederkehrende Operationen in Ihren bestehenden Tools automatisieren.",
        href: "/workflow-automation",
      },
      {
        title: "Daten- & Dokumentenautomatisierung",
        desc: "Dokumente und Daten automatisch verarbeiten, routen und syncen.",
        href: "/data-document-automation",
      },
    ],
  },
  ctaOrbit: {
    eyebrow: "Bereit zu automatisieren?",
    title: "Geben Sie Ihrer Operation",
    highlight: "einen KI-Vorteil.",
    desc: "Verbinden Sie Geschäftskontext, Tools und Regeln in intelligenten Workflows, die handeln, wenn Arbeit fließen muss.",
    button: "KI-Workflow besprechen",
    diagram: {
      center: "KI-Agent",
      centerSub: "Versteht, plant, handelt",
      nodes: [
        { t: "Kontext", s: "Geschäftsdaten" },
        { t: "Tools", s: "APIs, Odoo, CRM" },
        { t: "Regeln", s: "Richtlinien und Leitplanken" },
        { t: "Aktion", s: "Ausführen und eskalieren" },
      ],
    },
  },
  cta: {
    eyebrow: "Bereit, wenn Sie es sind",
    title: "Haben Sie einen Prozess, in dem KI",
    highlight: "mehr kann als antworten?",
    desc: "Entwerfen wir einen Agenten, der versteht, handelt und innerhalb Ihrer Geschäftsregeln operiert.",
    button: "KI-Workflow besprechen",
  },
};

export const aiContent = { en, nl, de };
