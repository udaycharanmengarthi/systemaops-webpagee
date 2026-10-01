/* Centralized content for the Workflow Automation service page (/workflow-automation).
   Consumed via t("serviceDetail.workflow.*"). Icons stay in the component. */

const en = {
  meta: {
    title: "Business Workflow Automation",
    description:
      "Intelligent business automation systems that reduce operational friction, triggers, logic, approvals, actions and monitoring built in n8n.",
    keywords:
      "workflow automation, business automation, n8n workflows, process automation, approval workflows, operations automation",
    schemaName: "Business Workflow Automation",
    schemaDesc:
      "Workflow automation services: triggers, business logic, approvals, API actions and monitored execution across business tools.",
  },
  hero: {
    eyebrow: "Business Workflow Automation",
    title: "Turn repetitive operations",
    highlight: "into workflows that run themselves.",
    description:
      "Connect the tools your teams already use, automate repetitive steps, and keep people involved where decisions actually matter.",
    primaryCta: "Discuss your workflow",
    secondaryCta: "Explore how it works",
  },
  problem: {
    eyebrow: "The problem",
    title: "Manual handoffs are",
    highlight: "where work slows down.",
    areas: [
      { t: "Manual handoffs", d: "Work moves between people, spreadsheets and systems — retyped, delayed, and error-prone at every step." },
      { t: "Repeated operations", d: "Teams perform the same triggers, checks and updates every day instead of doing the work that matters." },
    ],
    beforeLabel: "WITH MANUAL HANDOFFS",
    beforeItems: [
      "Same information retyped between tools, with error at every step",
      "Decisions waiting in inboxes and chats without context",
      "Status updates assembled by hand, late or forgotten",
      "Records updated manually, long after the work",
    ],
    afterLabel: "WITH ORCHESTRATION",
    afterItems: [
      "Information flows automatically between tools, without retyping",
      "Decisions routed to the right person with full context",
      "Status updates sent on time, consistently and automatically",
      "Records updated as the work happens",
    ],
  },
  capabilities: {
    eyebrow: "Capabilities",
    title: "Every part of an orchestrated flow.",
    items: [
      {
        title: "Triggers",
        desc: "Events that start work: new records, status changes, schedules and incoming messages.",
      },
      {
        title: "Business logic",
        desc: "Conditions, branches and rules that route each case down the right path.",
      },
      {
        title: "Approvals",
        desc: "Human sign-off steps with full context, timeouts and escalation when nobody responds.",
      },
      {
        title: "API actions",
        desc: "Reads and writes across Odoo, CRMs, sheets, chat and databases inside the flow.",
      },
      {
        title: "Notifications",
        desc: "The right message to the right person at the right step, never noise.",
      },
      {
        title: "Exception handling",
        desc: "Retries where safe, review queues where not, and no silent failures.",
      },
      {
        title: "Scheduling",
        desc: "Recurring runs, follow-up timing and SLAs the workflow enforces itself.",
      },
      {
        title: "Monitoring",
        desc: "Every run visible: what fired, what succeeded, what needs attention.",
      },
    ],
  },
  architecture: {
    eyebrow: "Orchestration",
    title: "Trigger, decide, act, and handle the rest.",
    desc: "The standard route runs from trigger through workflow and decision to action. Exceptions divert to human review, and monitoring watches every run.",
  },
  automation: {
    title: "Automate the work between systems.",
    desc: "SystemaOps connects triggers, decisions, actions and system updates into controlled workflows.",
    items: [
      { t: "Triggers", d: "Events that start a workflow: new records, status changes, schedules and incoming messages." },
      { t: "Data transfer", d: "Move information between systems: reads and writes across Odoo, CRMs, sheets, chat and databases." },
      { t: "Validation", d: "Check rules and conditions before action: each case is routed down the right path." },
      { t: "Approvals", d: "Route work to people when required, with full context, timeouts and escalation." },
      { t: "System updates", d: "Create, update or synchronize records as the work happens." },
      { t: "Notifications", d: "Send messages, alerts or follow-ups automatically to the right person at the right step." },
    ],
  },
  cases: {
    title: "Where workflow automation creates leverage.",
    desc: "Practical business scenarios we automate — each one a repeatable flow with clear triggers and outcomes.",
    items: [
      { t: "Lead / request intake", d: "Capture a request, validate information and route it to the correct workflow.", flow: ["Request arrives", "Validated", "Routed"] },
      { t: "Approval workflows", d: "Move requests through defined approval steps before execution.", flow: ["Request submitted", "Reviewer notified", "Decision recorded"] },
      { t: "Document processing", d: "Receive documents, extract relevant information and trigger downstream actions.", flow: ["Document received", "Data extracted", "Systems updated"] },
      { t: "System synchronization", d: "Keep information aligned across business systems.", flow: ["Change detected", "Records matched", "All systems updated"] },
      { t: "Employee / operations requests", d: "Automate repetitive internal requests and routing.", flow: ["Request logged", "Routed", "Resolved"] },
      { t: "Reporting / notifications", d: "Collect events and automatically notify the right people.", flow: ["Event collected", "Report built", "Team notified"] },
    ],
  },
  systems: {
    title: "One workflow layer across your systems.",
    desc: "Automation coordinates the systems you already use — no rip-and-replace. One engine sits between your tools and the process you want to run.",
  },
  control: {
    title: "Automation does not remove control.",
    desc: "Automation handles repeatable work. People handle exceptions, approvals and decisions that require judgment.",
    items: [
      { t: "Automated", d: "Repeatable, rule-based work runs on its own." },
      { t: "Human review", d: "Exceptions and approvals route to a person with full context." },
      { t: "Continue", d: "The workflow resumes after the human decision, with a record." },
    ],
  },
  scope: {
    title: "What the implementation includes.",
    desc: "What SystemaOps actually does when implementing your workflow.",
    items: [
      { t: "Workflow discovery", d: "Map the current process and identify automation opportunities." },
      { t: "Integration", d: "Connect the required systems and APIs." },
      { t: "Logic + rules", d: "Implement triggers, conditions and actions." },
      { t: "Exception handling", d: "Define approval and human-review paths." },
      { t: "Testing", d: "Validate real operating scenarios." },
      { t: "Deployment", d: "Release and monitor the workflow." },
    ],
  },
  scenarios: {
    eyebrow: "In practice",
    title: "One engine, many workflows.",
    desc: "Select a scenario to see how the same engine runs different business processes.",
    tabsLabel: "Workflow scenarios",
  },
  exception: {
    eyebrow: "Exceptions by design",
    title: "The exception path is part of the flow.",
    desc: "Automation does not mean everything is automatic. When a check fails, the run diverts to a person and rejoins with a record.",
    approve: "Approve",
    reject: "Reject",
    resume: "Workflow resumes",
  },
  ecosystem: {
    eyebrow: "Connections",
    title: "Your systems, one engine.",
    desc: "The workflow engine sits between the tools you already use and the process you want to run.",
    engine: "SystemaOps workflow engine",
    output: "Business process",
  },
  outcome: {
    eyebrow: "Outcome",
    title: "What changes in the operation.",
    items: [
      "Less manual work",
      "Fewer handoffs",
      "Consistent processes",
      "Visible execution",
      "Controlled exceptions",
      "Auditable operations",
    ],
  },
  diagram: {
    arch: {
      aria: "Workflow orchestration: event leads to trigger, process and condition, branching to approval or review, then action and completion",
      ariaCompact: "Workflow pipeline: event to trigger to decision to action",
      event: "EVENT",
      trigger: "TRIGGER",
      process: "PROCESS",
      condition: "CONDITION",
      approve: "APPROVE",
      approveSub: "standard path",
      review: "REVIEW",
      reviewSub: "exception path",
      action: "ACTION",
      complete: "COMPLETE",
      pathApprove: "approved",
      pathReview: "review",
      captionPre: "Every run flows from event to decision, then",
      captionApprove: "approval",
      captionMid: "or",
      captionReview: "human review",
      captionPost: ", ending in action and a complete record.",
    },
    tech: {
      aria: "Workflow orchestration: trigger leads to workflow, decision, action and monitored runs, with exceptions routing to human review",
      tabsLabel: "Workflow paths",
      paths: [
        {
          id: "happy",
          label: "Standard path",
          desc: "Trigger fires, the workflow processes, the decision passes, and the action executes across connected systems.",
        },
        {
          id: "exception",
          label: "Exception path",
          desc: "When a check fails or a case doesn't fit, the run diverts to human review, then rejoins or closes with a record.",
        },
        {
          id: "monitor",
          label: "Monitoring",
          desc: "Every run emits status: what fired, what succeeded, how long it took, and what needs attention.",
        },
      ],
      nodes: {
        trigger: { t: "TRIGGER", s: "event, time" },
        workflow: { t: "WORKFLOW", s: "n8n steps" },
        decision: { t: "DECISION", s: "rules, approval" },
        action: { t: "ACTION", s: "sync, notify" },
        review: { t: "HUMAN REVIEW", s: "exception" },
        runlog: { t: "RUN LOG", s: "status, timing" },
      },
    },
  },
  process: {
    eyebrow: "How we implement it",
    title: "Discover to optimize, in five steps.",
    steps: [
      {
        title: "Discover",
        desc: "We map repetitive operations, handoffs and bottlenecks to find the workflows worth automating first.",
      },
      {
        title: "Design",
        desc: "Triggers, logic, approvals and exception paths are designed around the real process, the automation blueprint.",
      },
      {
        title: "Build",
        desc: "Production workflows are built in n8n with APIs, webhooks and orchestration connecting every system involved.",
      },
      {
        title: "Deploy",
        desc: "Launch happens safely: tested against real scenarios, with monitoring and safeguards from day one.",
      },
      {
        title: "Optimize",
        desc: "Runs are watched, failures reviewed and flows improved as the business and its edge cases evolve.",
      },
    ],
  },
  tech: {
    eyebrow: "Technology",
    title: "Orchestration around your tools.",
    desc: "Grouped by role, orchestration, connected systems, execution and reliability, so each part's job stays visible.",
    groups: [
      {
        role: "Orchestration",
        items: ["n8n", "Event triggers", "Conditional logic", "Schedules"],
      },
      {
        role: "Business systems",
        items: ["Odoo ERP", "CRMs", "Databases", "Google Sheets", "Slack", "Email"],
      },
      {
        role: "Execution",
        items: ["Approvals", "Notifications", "Record updates", "Follow-ups"],
      },
      {
        role: "Reliability",
        items: ["Failure handling", "Monitoring", "Exception paths"],
      },
    ],
  },
  useCases: {
    eyebrow: "Use cases",
    title: "Flows that run themselves.",
    items: [
      {
        title: "New request to resolved record",
        flow: ["Request arrives", "Validated & enriched", "ERP updated", "Team notified"],
        desc: "Incoming requests travel from inbox to system of record with validation, enrichment and notifications handled along the way.",
      },
      {
        title: "Approvals without chasing",
        flow: ["Approval needed", "Reviewer notified", "Decision recorded", "Flow continues"],
        desc: "Quotes, expenses and exceptions route to the right approver with context, and escalate instead of stalling.",
      },
      {
        title: "Systems kept in sync",
        flow: ["Change detected", "Records matched", "All systems updated"],
        desc: "A change in one tool propagates to the others on a schedule or trigger your team controls.",
      },
      {
        title: "Follow-ups on rails",
        flow: ["Deadline set", "Reminder sent", "Overdue escalated"],
        desc: "Time-based follow-ups fire automatically, with overdue cases routed to a person instead of forgotten.",
      },
    ],
  },
  engagement: {
    eyebrow: "Engagement",
    title: "What the implementation includes.",
    items: [
      "Workflow discovery, repetitive operations, handoffs and bottlenecks",
      "Automation architecture, triggers, logic, approvals and exception paths",
      "Implementation in n8n with APIs, webhooks and orchestration",
      "Integration with CRMs, sheets, chat, ERP, databases and email",
      "Testing against real operating scenarios",
      "Deployment with monitoring and operational safeguards",
      "Optimization, watched runs, reviewed failures, evolving flows",
      "Handover notes your team can maintain",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Workflow automation, answered directly.",
    items: [
      {
        q: "Which workflows should be automated first?",
        a: "Repetitive, rule-based work with clear triggers, data entry, notifications, follow-ups, approvals and record sync. Discovery ranks candidates by frequency and failure cost.",
      },
      {
        q: "Do you use n8n?",
        a: "Yes. Production workflows are typically built in n8n with APIs, webhooks and process orchestration, it gives self-hosted control with visibility into every run.",
      },
      {
        q: "What happens if a workflow fails?",
        a: "Failures are handled by design: safe retries, exception queues for the rest, and monitoring so nothing fails silently. Every run leaves a trace.",
      },
      {
        q: "Can humans approve certain steps?",
        a: "Yes, approvals are first-class steps with context, timeouts and escalation. The workflow waits where judgment is needed and flows where it isn't.",
      },
      {
        q: "Do we need to replace existing systems?",
        a: "No. Workflows connect your CRMs, sheets, chat tools, ERP systems, databases and email, automation wraps around the tools you already use.",
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
        title: "Odoo Solutions",
        desc: "ERP, CRM and business applications tailored to how you operate.",
        href: "/odoo-customization",
      },
      {
        title: "System Integration & APIs",
        desc: "Connect Odoo, CRMs and business systems into one flow.",
        href: "/system-integrations",
      },
    ],
  },
  ctaOrbit: {
    eyebrow: "Ready to connect the work?",
    title: "Turn repetitive workflows",
    highlight: "into automated systems.",
    desc: "Connect your tools, trigger the right actions and move work across your business without manual handoffs.",
    button: "Map a workflow",
    diagram: {
      center: "Workflow",
      centerSub: "Automated process",
      nodes: [
        { t: "Trigger", s: "Event or request" },
        { t: "Process", s: "Rules and logic" },
        { t: "Connect", s: "CRM, ERP, APIs" },
        { t: "Execute", s: "Action and update" },
      ],
    },
  },
  cta: {
    eyebrow: "Ready when you are",
    title: "Have a process your team",
    highlight: "repeats every day?",
    desc: "Let's turn it into a workflow that runs consistently.",
    button: "Discuss your workflow",
  },
};

const nl = {
  meta: {
    title: "Workflowautomatisering voor bedrijven",
    description:
      "Intelligente bedrijfsautomatisering die operationele frictie vermindert: triggers, logica, goedkeuringen, acties en monitoring gebouwd in n8n.",
    keywords:
      "workflowautomatisering, bedrijfsautomatisering, n8n-workflows, procesautomatisering, goedkeuringsworkflows, operatieautomatisering",
    schemaName: "Workflowautomatisering voor bedrijven",
    schemaDesc:
      "Workflowautomatiseringsdiensten: triggers, bedrijfslogica, goedkeuringen, API-acties en gemonitorde uitvoering in bedrijfstools.",
  },
  hero: {
    eyebrow: "Workflowautomatisering voor bedrijven",
    title: "Maak van terugkerende operatie",
    highlight: "workflows die zichzelf uitvoeren.",
    description:
      "Verbind de tools die uw teams al gebruiken, automatiseer terugkerende stappen en houd mensen betrokken waar beslissingen echt tellen.",
    primaryCta: "Bespreek uw workflow",
    secondaryCta: "Ontdek hoe het werkt",
  },
  problem: {
    eyebrow: "Het probleem",
    title: "Handmatige overdrachten zijn",
    highlight: "waar werk vertraagt.",
    areas: [
      { t: "Handmatige overdrachten", d: "Werk beweegt tussen mensen, spreadsheets en systemen — overgetypt, vertraagd en foutgevoelig bij elke stap." },
      { t: "Herhaalde operaties", d: "Teams voeren dagelijks dezelfde triggers, controles en updates uit in plaats van het werk dat ertoe doet." },
    ],
    beforeLabel: "MET HANDMATIGE OVERDRACHTEN",
    beforeItems: [
      "Dezelfde informatie steeds opnieuw ingetypt tussen tools, met fouten bij elke stap",
      "Beslissingen die wachten in inboxen en chats zonder context",
      "Statusupdates met de hand gemaakt, te laat of vergeten",
      "Records handmatig bijgewerkt, lang nadat het werk al gebeurd is",
    ],
    afterLabel: "MET ORKESTRATIE",
    afterItems: [
      "Informatie stroomt automatisch tussen tools, zonder overtypen",
      "Beslissingen gerouteerd naar de juiste persoon met volledige context",
      "Statusupdates op tijd, consistent en automatisch verstuurd",
      "Records bijgewerkt terwijl het werk gebeurt",
    ],
  },
  capabilities: {
    eyebrow: "Mogelijkheden",
    title: "Elk onderdeel van een georkestreerde flow.",
    items: [
      {
        title: "Triggers",
        desc: "Events die werk starten: nieuwe records, statuswijzigingen, schema's en binnenkomende berichten.",
      },
      {
        title: "Bedrijfslogica",
        desc: "Condities, vertakkingen en regels die elke zaak naar het juiste pad leiden.",
      },
      {
        title: "Goedkeuringen",
        desc: "Menselijke accordering met volledige context, time-outs en escalatie als niemand reageert.",
      },
      {
        title: "API-acties",
        desc: "Lezen en schrijven in Odoo, CRM's, sheets, chat en databases binnen de flow.",
      },
      {
        title: "Notificaties",
        desc: "Het juiste bericht aan de juiste persoon bij de juiste stap, nooit ruis.",
      },
      {
        title: "Uitzonderingsafhandeling",
        desc: "Retries waar veilig, reviewwachtrijen waar niet, en geen stille fouten.",
      },
      {
        title: "Planning",
        desc: "Terugkerende runs, opvolgtiming en SLA's die de workflow zelf afdwingt.",
      },
      {
        title: "Monitoring",
        desc: "Elke run zichtbaar: wat startte, wat lukte, wat aandacht nodig heeft.",
      },
    ],
  },
  architecture: {
    eyebrow: "Orkestratie",
    title: "Trigger, beslis, handel, en vang de rest op.",
    desc: "De standaardroute loopt van trigger via workflow en beslissing naar actie. Uitzonderingen gaan naar menselijke review, en monitoring bewaakt elke run.",
  },
  automation: {
    title: "Automatiseer het werk tussen systemen.",
    desc: "SystemaOps verbindt triggers, beslissingen, acties en systeemupdates in gecontroleerde workflows.",
    items: [
      { t: "Triggers", d: "Events die een workflow starten: nieuwe records, statuswijzigingen, schema's en binnenkomende berichten." },
      { t: "Dataoverdracht", d: "Verplaats informatie tussen systemen: lezen en schrijven in Odoo, CRM's, sheets, chat en databases." },
      { t: "Validatie", d: "Controleer regels en voorwaarden vóór actie: elke zaak gaat het juiste pad op." },
      { t: "Goedkeuringen", d: "Routeer werk naar mensen waar nodig, met volledige context, time-outs en escalatie." },
      { t: "Systeemupdates", d: "Maak records aan, werk ze bij of synchroniseer ze terwijl het werk gebeurt." },
      { t: "Notificaties", d: "Verstuur berichten, alerts of opvolging automatisch naar de juiste persoon bij de juiste stap." },
    ],
  },
  cases: {
    title: "Waar workflowautomatisering hefboomwerking creëert.",
    desc: "Praktische bedrijfsscenario's die wij automatiseren — elk een herhaalbare flow met duidelijke triggers en resultaten.",
    items: [
      { t: "Lead- / verzoekintake", d: "Leg een verzoek vast, valideer informatie en routeer het naar de juiste workflow.", flow: ["Verzoek komt binnen", "Gevalideerd", "Gerouteerd"] },
      { t: "Goedkeuringsworkflows", d: "Beweeg verzoeken vóór uitvoering door gedefinieerde goedkeuringsstappen.", flow: ["Verzoek ingediend", "Beoordelaar genotificeerd", "Beslissing vastgelegd"] },
      { t: "Documentverwerking", d: "Ontvang documenten, extraheer relevante informatie en trigger vervolgacties.", flow: ["Document ontvangen", "Data geëxtraheerd", "Systemen bijgewerkt"] },
      { t: "Systeemsynchronisatie", d: "Houd informatie in lijn tussen bedrijfssystemen.", flow: ["Wijziging gedetecteerd", "Records gematcht", "Alle systemen bijgewerkt"] },
      { t: "Medewerker- / operationele verzoeken", d: "Automatiseer herhaalbare interne verzoeken en routering.", flow: ["Verzoek gelogd", "Gerouteerd", "Opgelost"] },
      { t: "Rapportage / notificaties", d: "Verzamel events en notificeer automatisch de juiste mensen.", flow: ["Event verzameld", "Rapport gebouwd", "Team genotificeerd"] },
    ],
  },
  systems: {
    title: "Eén workflowlaag over uw systemen.",
    desc: "Automatisering coördineert de systemen die u al gebruikt — geen rip-and-replace. Eén engine zit tussen uw tools en het proces dat u wilt uitvoeren.",
  },
  control: {
    title: "Automatisering neemt controle niet weg.",
    desc: "Automatisering handelt herhaalbaar werk af. Mensen behandelen uitzonderingen, goedkeuringen en beslissingen die oordeel vereisen.",
    items: [
      { t: "Geautomatiseerd", d: "Herhaalbaar, regelgebaseerd werk loopt zelfstandig." },
      { t: "Menselijke review", d: "Uitzonderingen en goedkeuringen gaan met volledige context naar een mens." },
      { t: "Vervolg", d: "De workflow wordt na de menselijke beslissing hervat, met een verslag." },
    ],
  },
  scope: {
    title: "Wat de implementatie omvat.",
    desc: "Wat SystemaOps daadwerkelijk doet bij het implementeren van uw workflow.",
    items: [
      { t: "Workflowdiscovery", d: "Breng het huidige proces in kaart en identificeer automatiseringskansen." },
      { t: "Integratie", d: "Verbind de benodigde systemen en API's." },
      { t: "Logica + regels", d: "Implementeer triggers, condities en acties." },
      { t: "Uitzonderingsafhandeling", d: "Definieer goedkeurings- en menselijke reviewpaden." },
      { t: "Testen", d: "Valideer echte operationele scenario's." },
      { t: "Uitrol", d: "Release en bewaak de workflow." },
    ],
  },
  scenarios: {
    eyebrow: "In de praktijk",
    title: "Eén engine, veel workflows.",
    desc: "Selecteer een scenario om te zien hoe dezelfde engine verschillende bedrijfsprocessen uitvoert.",
    tabsLabel: "Workflowscenario's",
  },
  exception: {
    eyebrow: "Uitzonderingen door ontwerp",
    title: "Het uitzonderingspad hoort bij de stroom.",
    desc: "Automatisering betekent niet dat alles automatisch gaat. Als een controle faalt, gaat de run naar een mens en komt met een verslag terug.",
    approve: "Goedkeuren",
    reject: "Afwijzen",
    resume: "Workflow wordt vervolgd",
  },
  ecosystem: {
    eyebrow: "Koppelingen",
    title: "Uw systemen, één engine.",
    desc: "De workflowengine zit tussen de tools die u al gebruikt en het proces dat u wilt uitvoeren.",
    engine: "SystemaOps-workflowengine",
    output: "Bedrijfsproces",
  },
  outcome: {
    eyebrow: "Resultaat",
    title: "Wat verandert in de operatie.",
    items: [
      "Minder handwerk",
      "Minder overdrachten",
      "Consistente processen",
      "Zichtbare uitvoering",
      "Gecontroleerde uitzonderingen",
      "Controleerbare operatie",
    ],
  },
  diagram: {
    arch: {
      aria: "Workfloworkestratie: event leidt naar trigger, proces en conditie, met vertakking naar goedkeuring of review, dan actie en afronding",
      ariaCompact: "Workflowpijplijn: van event via trigger en beslissing naar actie",
      event: "EVENT",
      trigger: "TRIGGER",
      process: "PROCES",
      condition: "CONDITIE",
      approve: "GOEDKEUREN",
      approveSub: "standaardpad",
      review: "REVIEW",
      reviewSub: "uitzonderingspad",
      action: "ACTIE",
      complete: "KLAAR",
      pathApprove: "goedgekeurd",
      pathReview: "review",
      captionPre: "Elke run stroomt van event naar beslissing, dan via",
      captionApprove: "goedkeuring",
      captionMid: "of",
      captionReview: "menselijke review",
      captionPost: ", eindigend in actie en een volledig record.",
    },
    tech: {
      aria: "Workfloworkestratie: trigger leidt naar workflow, beslissing, actie en gemonitorde runs, met uitzonderingen naar menselijke review",
      tabsLabel: "Workflowpaden",
      paths: [
        {
          id: "happy",
          label: "Standaardpad",
          desc: "Trigger vuurt, de workflow verwerkt, de beslissing slaagt, en de actie voert uit in gekoppelde systemen.",
        },
        {
          id: "exception",
          label: "Uitzonderingspad",
          desc: "Als een controle faalt of een zaak niet past, wijkt de run uit naar menselijke review, en voegt daarna weer in of sluit af met een record.",
        },
        {
          id: "monitor",
          label: "Monitoring",
          desc: "Elke run geeft status: wat startte, wat lukte, hoe lang het duurde, en wat aandacht nodig heeft.",
        },
      ],
      nodes: {
        trigger: { t: "TRIGGER", s: "event, tijd" },
        workflow: { t: "WORKFLOW", s: "n8n-stappen" },
        decision: { t: "BESLISSING", s: "regels, goedkeuring" },
        action: { t: "ACTIE", s: "sync, melding" },
        review: { t: "MENSELIJKE REVIEW", s: "uitzondering" },
        runlog: { t: "RUNLOG", s: "status, timing" },
      },
    },
  },
  process: {
    eyebrow: "Zo implementeren wij",
    title: "Van ontdekken tot optimaliseren, in vijf stappen.",
    steps: [
      {
        title: "Ontdekken",
        desc: "Wij brengen terugkerende operaties, overdrachten en knelpunten in kaart om te vinden welke workflows eerst automatisering waard zijn.",
      },
      {
        title: "Ontwerpen",
        desc: "Triggers, logica, goedkeuringen en uitzonderingspaden ontworpen rond het echte proces: de blauwdruk voor automatisering.",
      },
      {
        title: "Bouwen",
        desc: "Productieworkflows gebouwd in n8n met API's, webhooks en orkestratie die elk betrokken systeem verbindt.",
      },
      {
        title: "Uitrollen",
        desc: "Lancering gebeurt veilig: getest aan echte scenario's, met monitoring en waarborgen vanaf dag één.",
      },
      {
        title: "Optimaliseren",
        desc: "Runs bewaakt, fouten beoordeeld en flows verbeterd naarmate het bedrijf en de randgevallen evolueren.",
      },
    ],
  },
  tech: {
    eyebrow: "Technologie",
    title: "Orkestratie rond uw tools.",
    desc: "Gegroepeerd per rol: orkestratie, verbonden systemen, uitvoering en betrouwbaarheid, zodat elke taak zichtbaar blijft.",
    groups: [
      {
        role: "Orkestratie",
        items: ["n8n", "Event-triggers", "Conditionele logica", "Schema's"],
      },
      {
        role: "Bedrijfssystemen",
        items: ["Odoo ERP", "CRM's", "Databases", "Google Sheets", "Slack", "E-mail"],
      },
      {
        role: "Uitvoering",
        items: ["Goedkeuringen", "Notificaties", "Recordupdates", "Opvolging"],
      },
      {
        role: "Betrouwbaarheid",
        items: ["Foutafhandeling", "Monitoring", "Uitzonderingspaden"],
      },
    ],
  },
  useCases: {
    eyebrow: "Gebruiksgevallen",
    title: "Flows die zichzelf runnen.",
    items: [
      {
        title: "Van nieuwe aanvraag tot opgelost record",
        flow: ["Aanvraag komt binnen", "Gevalideerd en verrijkt", "ERP bijgewerkt", "Team genotificeerd"],
        desc: "Binnenkomende aanvragen reizen van inbox naar systeem met validatie, verrijking en notificaties onderweg.",
      },
      {
        title: "Goedkeuringen zonder najagen",
        flow: ["Goedkeuring nodig", "Beoordelaar genotificeerd", "Besluit vastgelegd", "Flow gaat verder"],
        desc: "Offertes, uitgaven en uitzonderingen routeren naar de juiste fiatteur met context, en escaleren in plaats van stil te vallen.",
      },
      {
        title: "Systemen synchroon gehouden",
        flow: ["Wijziging gedetecteerd", "Records gematcht", "Alle systemen bijgewerkt"],
        desc: "Een wijziging in één tool propageert naar de andere op een schema of trigger dat uw team beheert.",
      },
      {
        title: "Opvolging op rails",
        flow: ["Deadline gezet", "Herinnering verstuurd", "Achterstand geëscaleerd"],
        desc: "Tijdgebonden opvolging vuurt automatisch, met achterstallige zaken naar een persoon in plaats van vergeten.",
      },
    ],
  },
  engagement: {
    eyebrow: "Aanpak",
    title: "Wat de implementatie omvat.",
    items: [
      "Workflowdiscovery: terugkerende operaties, overdrachten en knelpunten",
      "Automatisearchitectuur: triggers, logica, goedkeuringen en uitzonderingspaden",
      "Implementatie in n8n met API's, webhooks en orkestratie",
      "Integratie met CRM's, sheets, chat, ERP, databases en e-mail",
      "Tests aan echte operationele scenario's",
      "Uitrol met monitoring en operationele waarborgen",
      "Optimalisatie: bewaakte runs, beoordeelde fouten, evoluerende flows",
      "Overdrachtsnotities die uw team kan onderhouden",
    ],
  },
  faq: {
    eyebrow: "Vragen",
    title: "Workflowautomatisering, direct beantwoord.",
    items: [
      {
        q: "Welke workflows eerst automatiseren?",
        a: "Repeterend, regelgebaseerd werk met duidelijke triggers: data-invoer, notificaties, opvolging, goedkeuringen en recordsync. Discovery rangschikt kandidaten op frequentie en faalkosten.",
      },
      {
        q: "Werken jullie met n8n?",
        a: "Ja. Productieworkflows bouwen wij typisch in n8n met API's, webhooks en procesorkestratie: self-hosted controle met zicht op elke run.",
      },
      {
        q: "Wat gebeurt er als een workflow faalt?",
        a: "Fouten zijn ontworpen opgevangen: veilige retries, uitzonderingswachtrijen voor de rest, en monitoring zodat niets stil faalt. Elke run laat een spoor na.",
      },
      {
        q: "Kunnen mensen bepaalde stappen goedkeuren?",
        a: "Ja: goedkeuringen zijn volwaardige stappen met context, time-outs en escalatie. De workflow wacht waar oordeel nodig is en stroomt waar niet.",
      },
      {
        q: "Moeten wij bestaande systemen vervangen?",
        a: "Nee. Workflows verbinden uw CRM's, sheets, chattools, ERP-systemen, databases en e-mail: automatisering wikkelt zich rond de tools die u al gebruikt.",
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
        title: "Odoo-oplossingen",
        desc: "ERP, CRM en bedrijfsapplicaties passend bij uw werkwijze.",
        href: "/odoo-customization",
      },
      {
        title: "Systeemkoppelingen & API's",
        desc: "Koppel Odoo, CRM's en bedrijfssystemen in één stroom.",
        href: "/system-integrations",
      },
    ],
  },
  ctaOrbit: {
    eyebrow: "Klaar om het werk te verbinden?",
    title: "Maak van terugkerende workflows",
    highlight: "geautomatiseerde systemen.",
    desc: "Verbind uw tools, trigger de juiste acties en beweeg werk door uw bedrijf zonder handmatige overdrachten.",
    button: "Breng een workflow in kaart",
    diagram: {
      center: "Workflow",
      centerSub: "Geautomatiseerd proces",
      nodes: [
        { t: "Trigger", s: "Event of verzoek" },
        { t: "Proces", s: "Regels en logica" },
        { t: "Verbinden", s: "CRM, ERP, API's" },
        { t: "Uitvoeren", s: "Actie en update" },
      ],
    },
  },
  cta: {
    eyebrow: "Klaar wanneer u dat bent",
    title: "Heeft u een proces dat uw team",
    highlight: "elke dag herhaalt?",
    desc: "Laten we er een workflow van maken die consistent draait.",
    button: "Bespreek uw workflow",
  },
};

const de = {
  meta: {
    title: "Workflow-Automatisierung für Unternehmen",
    description:
      "Intelligente Business-Automatisierung, die Reibung reduziert: Trigger, Logik, Freigaben, Aktionen und Monitoring, gebaut in n8n.",
    keywords:
      "Workflow-Automatisierung, Business-Automatisierung, n8n-Workflows, Prozessautomatisierung, Freigabe-Workflows, Operations-Automatisierung",
    schemaName: "Workflow-Automatisierung für Unternehmen",
    schemaDesc:
      "Workflow-Automatisierung: Trigger, Geschäftslogik, Freigaben, API-Aktionen und überwachte Ausführung über Business-Tools.",
  },
  hero: {
    eyebrow: "Workflow-Automatisierung",
    title: "Verwandeln Sie wiederkehrende Abläufe",
    highlight: "in Workflows, die von selbst laufen.",
    description:
      "Verbinden Sie die Tools, die Ihre Teams bereits nutzen, automatisieren Sie wiederkehrende Schritte und behalten Sie Menschen dort, wo Entscheidungen wirklich zählen.",
    primaryCta: "Workflow besprechen",
    secondaryCta: "Sehen, wie es funktioniert",
  },
  problem: {
    eyebrow: "Das Problem",
    title: "Manuelle Übergaben sind",
    highlight: "wo Arbeit langsam wird.",
    areas: [
      { t: "Manuelle Übergaben", d: "Arbeit bewegt sich zwischen Menschen, Tabellen und Systemen — neu getippt, verzögert und fehleranfällig bei jedem Schritt." },
      { t: "Wiederkehrende Abläufe", d: "Teams führen täglich dieselben Trigger, Prüfungen und Updates aus, statt der Arbeit, die zählt." },
    ],
    beforeLabel: "MIT MANUELLEN ÜBERGABEN",
    beforeItems: [
      "Gleiche Information zwischen Tools neu getippt, mit Fehlern bei jedem Schritt",
      "Entscheidungen warten in Postfächern und Chats ohne Kontext",
      "Statusupdates von Hand gebaut, verspätet oder vergessen",
      "Datensätze manuell gepflegt, lange nach der Arbeit",
    ],
    afterLabel: "MIT ORCHESTRIERUNG",
    afterItems: [
      "Information fließt automatisch zwischen Tools, ohne Abtippen",
      "Entscheidungen an die richtige Person mit vollem Kontext geroutet",
      "Statusupdates pünktlich, konsistent und automatisch versendet",
      "Datensätze aktualisiert, während gearbeitet wird",
    ],
  },
  capabilities: {
    eyebrow: "Leistungen",
    title: "Jeder Teil eines orchestrierten Flows.",
    items: [
      {
        title: "Trigger",
        desc: "Events, die Arbeit starten: neue Datensätze, Statuswechsel, Zeitpläne und eingehende Nachrichten.",
      },
      {
        title: "Geschäftslogik",
        desc: "Bedingungen, Verzweigungen und Regeln, die jeden Fall auf den richtigen Pfad leiten.",
      },
      {
        title: "Freigaben",
        desc: "Menschliche Freigabe mit vollem Kontext, Timeouts und Eskalation, wenn niemand reagiert.",
      },
      {
        title: "API-Aktionen",
        desc: "Lesen und Schreiben in Odoo, CRMs, Sheets, Chat und Datenbanken im Flow.",
      },
      {
        title: "Benachrichtigungen",
        desc: "Die richtige Nachricht an die richtige Person im richtigen Schritt, nie Rauschen.",
      },
      {
        title: "Exception-Handling",
        desc: "Retries wo sicher, Review-Queues wo nicht, und keine stillen Fehler.",
      },
      {
        title: "Zeitplanung",
        desc: "Wiederkehrende Läufe, Follow-up-Timing und SLAs, die der Workflow selbst durchsetzt.",
      },
      {
        title: "Monitoring",
        desc: "Jeder Lauf sichtbar: was feuerte, was klappte, was Aufmerksamkeit braucht.",
      },
    ],
  },
  architecture: {
    eyebrow: "Orchestrierung",
    title: "Triggern, entscheiden, handeln, und den Rest abfangen.",
    desc: "Die Standardroute läuft von Trigger über Workflow und Entscheidung zur Aktion. Ausnahmen gehen zu menschlichem Review, und das Monitoring überwacht jeden Lauf.",
  },
  automation: {
    title: "Automatisieren Sie die Arbeit zwischen Systemen.",
    desc: "SystemaOps verbindet Trigger, Entscheidungen, Aktionen und Systemupdates in kontrollierten Workflows.",
    items: [
      { t: "Trigger", d: "Events, die einen Workflow starten: neue Datensätze, Statusänderungen, Pläne und eingehende Nachrichten." },
      { t: "Datentransfer", d: "Bewegt Informationen zwischen Systemen: Lesen und Schreiben in Odoo, CRMs, Sheets, Chat und Datenbanken." },
      { t: "Validierung", d: "Prüft Regeln und Bedingungen vor der Aktion: Jeder Fall geht den richtigen Weg." },
      { t: "Freigaben", d: "Leitet Arbeit bei Bedarf an Menschen weiter, mit vollem Kontext, Timeouts und Eskalation." },
      { t: "Systemupdates", d: "Erstellt, pflegt oder synchronisiert Datensätze, während die Arbeit geschieht." },
      { t: "Benachrichtigungen", d: "Sendet Nachrichten, Alerts oder Follow-ups automatisch an die richtige Person im richtigen Schritt." },
    ],
  },
  cases: {
    title: "Wo Workflow-Automatisierung Hebelwirkung erzeugt.",
    desc: "Praktische Geschäftsszenarien, die wir automatisieren — jedes ein wiederholbarer Ablauf mit klaren Triggern und Ergebnissen.",
    items: [
      { t: "Lead- / Anfrageeingang", d: "Erfasst eine Anfrage, validiert Informationen und routet sie in den richtigen Workflow.", flow: ["Anfrage kommt an", "Validiert", "Geroutet"] },
      { t: "Freigabe-Workflows", d: "Bewegt Anfragen vor Ausführung durch definierte Freigabeschritte.", flow: ["Anfrage gestellt", "Prüfer benachrichtigt", "Entscheidung erfasst"] },
      { t: "Dokumentenverarbeitung", d: "Empfängt Dokumente, extrahiert relevante Informationen und löst Folgeaktionen aus.", flow: ["Dokument erhalten", "Daten extrahiert", "Systeme aktualisiert"] },
      { t: "Systemsynchronisierung", d: "Hält Informationen über Geschäftssysteme hinweg konsistent.", flow: ["Änderung erkannt", "Datensätze abgeglichen", "Alle Systeme aktualisiert"] },
      { t: "Mitarbeiter- / Betriebsanfragen", d: "Automatisiert wiederkehrende interne Anfragen und Routing.", flow: ["Anfrage geloggt", "Geroutet", "Gelöst"] },
      { t: "Reporting / Benachrichtigungen", d: "Sammelt Events und benachrichtigt automatisch die richtigen Personen.", flow: ["Event gesammelt", "Bericht erstellt", "Team benachrichtigt"] },
    ],
  },
  systems: {
    title: "Eine Workflow-Schicht über Ihren Systemen.",
    desc: "Automatisierung koordiniert die Systeme, die Sie bereits nutzen — kein Rip-and-replace. Eine Engine sitzt zwischen Ihren Tools und dem Prozess, den Sie ausführen wollen.",
  },
  control: {
    title: "Automatisierung nimmt keine Kontrolle weg.",
    desc: "Automatisierung erledigt wiederkehrende Arbeit. Menschen behandeln Ausnahmen, Freigaben und Entscheidungen, die Urteil erfordern.",
    items: [
      { t: "Automatisiert", d: "Wiederkehrende, regelbasierte Arbeit läuft von allein." },
      { t: "Menschliche Prüfung", d: "Ausnahmen und Freigaben gehen mit vollem Kontext an einen Menschen." },
      { t: "Fortsetzung", d: "Der Workflow wird nach der menschlichen Entscheidung fortgesetzt, mit Protokoll." },
    ],
  },
  scope: {
    title: "Was die Implementierung umfasst.",
    desc: "Was SystemaOps bei der Implementierung Ihres Workflows tatsächlich tut.",
    items: [
      { t: "Workflow-Discovery", d: "Bildet den aktuellen Prozess ab und identifiziert Automatisierungschancen." },
      { t: "Integration", d: "Verbindet die nötigen Systeme und APIs." },
      { t: "Logik + Regeln", d: "Implementiert Trigger, Bedingungen und Aktionen." },
      { t: "Ausnahmebehandlung", d: "Definiert Freigabe- und menschliche Prüfpfade." },
      { t: "Testen", d: "Validiert reale Betriebsszenarien." },
      { t: "Deployment", d: "Gibt den Workflow frei und überwacht ihn." },
    ],
  },
  scenarios: {
    eyebrow: "In der Praxis",
    title: "Eine Engine, viele Workflows.",
    desc: "Wählen Sie ein Szenario, um zu sehen, wie dieselbe Engine verschiedene Geschäftsprozesse ausführt.",
    tabsLabel: "Workflow-Szenarien",
  },
  exception: {
    eyebrow: "Ausnahmen per Design",
    title: "Der Ausnahmepfad gehört zum Ablauf.",
    desc: "Automatisierung heißt nicht, dass alles automatisch läuft. Scheitert eine Prüfung, geht der Lauf an einen Menschen und kehrt mit Protokoll zurück.",
    approve: "Genehmigen",
    reject: "Ablehnen",
    resume: "Workflow wird fortgesetzt",
  },
  ecosystem: {
    eyebrow: "Anbindungen",
    title: "Ihre Systeme, eine Engine.",
    desc: "Die Workflow-Engine sitzt zwischen den Tools, die Sie bereits nutzen, und dem Prozess, den Sie ausführen wollen.",
    engine: "SystemaOps-Workflow-Engine",
    output: "Geschäftsprozess",
  },
  outcome: {
    eyebrow: "Ergebnis",
    title: "Was sich in der Operation ändert.",
    items: [
      "Weniger Handarbeit",
      "Weniger Übergaben",
      "Konsistente Prozesse",
      "Sichtbare Ausführung",
      "Kontrollierte Ausnahmen",
      "Nachvollziehbarer Betrieb",
    ],
  },
  diagram: {
    arch: {
      aria: "Workflow-Orchestrierung: Event führt zu Trigger, Prozess und Bedingung, mit Verzweigung zu Freigabe oder Review, dann Aktion und Abschluss",
      ariaCompact: "Workflow-Pipeline: von Event über Trigger und Entscheidung zur Aktion",
      event: "EVENT",
      trigger: "TRIGGER",
      process: "PROZESS",
      condition: "BEDINGUNG",
      approve: "FREIGABE",
      approveSub: "Standardpfad",
      review: "REVIEW",
      reviewSub: "Ausnahmepfad",
      action: "AKTION",
      complete: "FERTIG",
      pathApprove: "freigegeben",
      pathReview: "Review",
      captionPre: "Jeder Lauf fließt von Event zur Entscheidung, dann über",
      captionApprove: "Freigabe",
      captionMid: "oder",
      captionReview: "menschliches Review",
      captionPost: ", endend in Aktion und vollständigem Datensatz.",
    },
    tech: {
      aria: "Workflow-Orchestrierung: Trigger führt zu Workflow, Entscheidung, Aktion und überwachten Läufen, mit Ausnahmen an menschliches Review",
      tabsLabel: "Workflow-Pfade",
      paths: [
        {
          id: "happy",
          label: "Standardpfad",
          desc: "Trigger feuert, der Workflow verarbeitet, die Entscheidung passiert, und die Aktion läuft in verbundenen Systemen.",
        },
        {
          id: "exception",
          label: "Ausnahmepfad",
          desc: "Wenn eine Prüfung scheitert oder ein Fall nicht passt, weicht der Lauf zu menschlichem Review aus, und fügt sich danach wieder ein oder schließt mit Datensatz.",
        },
        {
          id: "monitor",
          label: "Monitoring",
          desc: "Jeder Lauf meldet Status: was feuerte, was klappte, wie lange es dauerte, und was Aufmerksamkeit braucht.",
        },
      ],
      nodes: {
        trigger: { t: "TRIGGER", s: "Event, Zeit" },
        workflow: { t: "WORKFLOW", s: "n8n-Schritte" },
        decision: { t: "ENTSCHEIDUNG", s: "Regeln, Freigabe" },
        action: { t: "AKTION", s: "Sync, Notify" },
        review: { t: "MENSCHLICHES REVIEW", s: "Ausnahme" },
        runlog: { t: "RUN-LOG", s: "Status, Timing" },
      },
    },
  },
  process: {
    eyebrow: "So setzen wir um",
    title: "Von Discovery bis Optimierung, in fünf Schritten.",
    steps: [
      {
        title: "Entdecken",
        desc: "Wir mappen repetitive Operationen, Übergaben und Engpässe, um zu finden, welche Workflows zuerst Automatisierung verdienen.",
      },
      {
        title: "Designen",
        desc: "Trigger, Logik, Freigaben und Ausnahmepfade rund um den echten Prozess entworfen: die Automatisierungs-Blaupause.",
      },
      {
        title: "Bauen",
        desc: "Produktions-Workflows in n8n gebaut mit APIs, Webhooks und Orchestrierung aller beteiligten Systeme.",
      },
      {
        title: "Ausrollen",
        desc: "Launch erfolgt sicher: getestet an realen Szenarien, mit Monitoring und Safeguards ab Tag eins.",
      },
      {
        title: "Optimieren",
        desc: "Läufe beobachtet, Fehler reviewed und Flows verbessert, während Business und Edge-Cases evolvieren.",
      },
    ],
  },
  tech: {
    eyebrow: "Technologie",
    title: "Orchestrierung rund um Ihre Tools.",
    desc: "Gruppiert nach Rolle: Orchestrierung, verbundene Systeme, Ausführung und Zuverlässigkeit, damit jede Aufgabe sichtbar bleibt.",
    groups: [
      {
        role: "Orchestrierung",
        items: ["n8n", "Event-Trigger", "Bedingungslogik", "Zeitpläne"],
      },
      {
        role: "Geschäftssysteme",
        items: ["Odoo ERP", "CRMs", "Datenbanken", "Google Sheets", "Slack", "E-Mail"],
      },
      {
        role: "Ausführung",
        items: ["Freigaben", "Benachrichtigungen", "Datensatz-Updates", "Follow-ups"],
      },
      {
        role: "Zuverlässigkeit",
        items: ["Fehlerbehandlung", "Monitoring", "Ausnahmepfade"],
      },
    ],
  },
  useCases: {
    eyebrow: "Anwendungsfälle",
    title: "Flows, die von selbst laufen.",
    items: [
      {
        title: "Von neuer Anfrage zum gelösten Datensatz",
        flow: ["Anfrage kommt an", "Validiert und angereichert", "ERP aktualisiert", "Team benachrichtigt"],
        desc: "Eingehende Anfragen reisen von Inbox zum System mit Validierung, Anreicherung und Benachrichtigungen unterwegs.",
      },
      {
        title: "Freigaben ohne Hinterherlaufen",
        flow: ["Freigabe nötig", "Reviewer benachrichtigt", "Entscheidung erfasst", "Flow läuft weiter"],
        desc: "Angebote, Ausgaben und Ausnahmen routen zum richtigen Freigeber mit Kontext, und eskalieren statt zu stocken.",
      },
      {
        title: "Systeme synchron gehalten",
        flow: ["Änderung erkannt", "Datensätze gematcht", "Alle Systeme aktualisiert"],
        desc: "Eine Änderung in einem Tool propagiert in die anderen per Zeitplan oder Trigger unter Ihrer Kontrolle.",
      },
      {
        title: "Follow-ups auf Schienen",
        flow: ["Deadline gesetzt", "Erinnerung gesendet", "Überfällig eskaliert"],
        desc: "Zeitbasierte Follow-ups feuern automatisch, mit Überfälligem an eine Person statt vergessen.",
      },
    ],
  },
  engagement: {
    eyebrow: "Umfang",
    title: "Was die Implementierung enthält.",
    items: [
      "Workflow-Discovery: repetitive Operationen, Übergaben und Engpässe",
      "Automatisierungsarchitektur: Trigger, Logik, Freigaben und Ausnahmepfade",
      "Implementierung in n8n mit APIs, Webhooks und Orchestrierung",
      "Integration mit CRMs, Sheets, Chat, ERP, Datenbanken und E-Mail",
      "Tests an realen Betriebsszenarien",
      "Ausrollen mit Monitoring und operativen Safeguards",
      "Optimierung: beobachtete Läufe, reviewte Fehler, evolvierende Flows",
      "Übergabenotizen, die Ihr Team pflegen kann",
    ],
  },
  faq: {
    eyebrow: "Fragen",
    title: "Workflow-Automatisierung, direkt beantwortet.",
    items: [
      {
        q: "Welche Workflows zuerst automatisieren?",
        a: "Repetitive, regelbasierte Arbeit mit klaren Triggern: Dateneingabe, Benachrichtigungen, Follow-ups, Freigaben und Datensatz-Sync. Discovery rankt Kandidaten nach Häufigkeit und Fehlerkosten.",
      },
      {
        q: "Nutzt ihr n8n?",
        a: "Ja. Produktions-Workflows bauen wir typisch in n8n mit APIs, Webhooks und Prozessorchestrierung: Self-Hosting-Kontrolle mit Sicht auf jeden Lauf.",
      },
      {
        q: "Was passiert bei Workflow-Fehlern?",
        a: "Fehler sind by Design abgefangen: sichere Retries, Ausnahme-Queues für den Rest, und Monitoring, damit nichts still scheitert. Jeder Lauf hinterlässt eine Spur.",
      },
      {
        q: "Können Menschen Schritte freigeben?",
        a: "Ja: Freigaben sind erstklassige Schritte mit Kontext, Timeouts und Eskalation. Der Workflow wartet, wo Urteil nötig ist, und fließt, wo nicht.",
      },
      {
        q: "Müssen wir Systeme ersetzen?",
        a: "Nein. Workflows verbinden Ihre CRMs, Sheets, Chattools, ERP-Systeme, Datenbanken und E-Mail: Automatisierung legt sich um Ihre bestehenden Tools.",
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
        title: "Odoo-Lösungen",
        desc: "ERP, CRM und Geschäftsanwendungen passend zu Ihrer Arbeitsweise.",
        href: "/odoo-customization",
      },
      {
        title: "Systemintegration & APIs",
        desc: "Odoo, CRMs und Geschäftssysteme in einem Fluss verbinden.",
        href: "/system-integrations",
      },
    ],
  },
  ctaOrbit: {
    eyebrow: "Bereit, die Arbeit zu verbinden?",
    title: "Machen Sie wiederkehrende Workflows",
    highlight: "zu automatisierten Systemen.",
    desc: "Verbinden Sie Ihre Tools, triggern Sie die richtigen Aktionen und bewegen Sie Arbeit ohne manuelle Übergaben.",
    button: "Workflow mappen",
    diagram: {
      center: "Workflow",
      centerSub: "Automatisierter Prozess",
      nodes: [
        { t: "Trigger", s: "Event oder Anfrage" },
        { t: "Prozess", s: "Regeln und Logik" },
        { t: "Verbinden", s: "CRM, ERP, APIs" },
        { t: "Ausführen", s: "Aktion und Update" },
      ],
    },
  },
  cta: {
    eyebrow: "Bereit, wenn Sie es sind",
    title: "Haben Sie einen Prozess, den Ihr Team",
    highlight: "jeden Tag wiederholt?",
    desc: "Machen wir daraus einen Workflow, der verlässlich läuft.",
    button: "Workflow besprechen",
  },
};

export const workflowContent = { en, nl, de };
