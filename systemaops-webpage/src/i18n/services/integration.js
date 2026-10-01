/* Centralized content for the System Integration service page (/system-integrations).
   Consumed via t("serviceDetail.integration.*"). Icons stay in the component.
   diagram shape (exactly what the two inline visuals need):
   - diagram.hero: { aria, crm, erp, apiTitle, apiSub, database, external, webhook, webhookSub, outcome }
     (aria + all node labels/subs used by HeroVisual)
   - diagram.arch: { aria, sources[5], layerTitle, layerItems[4], businessLine1, businessLine2, exceptionLabel }
     (aria + source nodes + layer panel + chips + outcome lines + exception node used by ArchitectureVisual)
*/

const en = {
  meta: {
    title: "System Integration & APIs",
    description:
      "Connect ERP, CRM, databases and business applications through reliable APIs, webhooks and workflows built by SystemaOps.",
    keywords:
      "system integration, API integration, webhooks, ERP CRM integration, data synchronization, integration services",
    schemaName: "System Integration & APIs",
    schemaDesc:
      "Integration services connecting ERP, CRM, databases and business applications through APIs, webhooks and monitored workflows.",
  },
  hero: {
    eyebrow: "System Integration & APIs",
    title: "Connect every system.",
    highlight: "Run one operation.",
    description:
      "We connect ERP, CRM, databases, applications and external services through reliable APIs, webhooks and automated workflows, giving your business one connected operational layer.",
    primaryCta: "Discuss your integration",
    secondaryCta: "Explore the architecture",
  },
  problem: {
    eyebrow: "Why integration",
    title: "Your tools are separate.",
    highlight: "Your operation shouldn't be.",
    beforeLabel: "WITHOUT INTEGRATION",
    beforeItems: [
      "Customer, order and stock data trapped where the team that needs it cannot reach it",
      "Records copied and re-keyed between tools every day",
      "Payments and status changes with no downstream reaction",
      "Duplicate records and sync failures nobody can trace",
    ],
    afterLabel: "WITH INTEGRATION",
    afterItems: [
      "Shared data available where the teams work",
      "Records move automatically between systems",
      "Events trigger the next step downstream",
      "One consistent record with visible, traceable flows",
    ],
  },
  capabilities: {
    eyebrow: "Capabilities",
    title: "What the integration covers.",
    items: [
      {
        title: "API integrations",
        desc: "Connect ERP, CRM, databases and business applications through well-defined REST APIs, reading and writing data where the operation needs it.",
      },
      {
        title: "Webhooks & events",
        desc: "React to what happens in one system, a new order, a status change, a payment, and trigger the next step somewhere else automatically.",
      },
      {
        title: "Data synchronization",
        desc: "Keep shared records consistent across systems so teams stop reconciling the same information in two places.",
      },
      {
        title: "Authentication & access",
        desc: "API keys, tokens and scoped permissions set up deliberately, so each integration can only touch what it should.",
      },
      {
        title: "Error handling",
        desc: "Failed calls are caught, retried where safe, and surfaced clearly, instead of silently dropping business-critical updates.",
      },
      {
        title: "Integration monitoring",
        desc: "Know when a flow stops working: payload logs, failure visibility and alerts wired into the workflows your team already watches.",
      },
    ],
  },
  architecture: {
    eyebrow: "Architecture",
    title: "How the systems connect.",
    desc: "Every source system talks to one integration layer, never a tangle of point-to-point links. Validation and retry handling sit in the middle, and anything that can't be resolved lands in an exception queue a person can inspect.",
  },
  network: {
    aria: "Integration network: six business systems connect through the SystemaOps integration core",
    tabsLabel: "Connected systems",
    core: "SYSTEMAOPS",
    coreSub: "Integration core",
    nodes: [
      { t: "CRM", s: "customer data" },
      { t: "ERP / Odoo", s: "operations" },
      { t: "Database", s: "records" },
      { t: "Webhook", s: "events" },
      { t: "External API", s: "services" },
      { t: "Application", s: "custom tools" },
    ],
    activeDesc:
      "Data packet from {source} travels to the core, then continues to {dest}.",
  },
  layer: {
    eyebrow: "One layer",
    title: "One layer. Every system.",
    desc: "Connect the systems your business already depends on.",
    cards: [
      { title: "ERP", desc: "Synchronize operational data." },
      { title: "CRM", desc: "Keep customer information connected." },
      { title: "Database", desc: "Move and validate business data." },
      { title: "APIs", desc: "Connect internal and external services." },
      { title: "Webhooks", desc: "React to business events instantly." },
      { title: "Applications", desc: "Connect custom business tools." },
    ],
  },
  order: {
    eyebrow: "In practice",
    title: "When an order is created",
    desc: "Watch an order travel from the customer to the invoice, through one connected layer.",
    steps: [
      { t: "Customer order", s: "received" },
      { t: "CRM", s: "validated" },
      { t: "Webhook", s: "event sent" },
      { t: "Integration core", s: "transformed" },
      { t: "Odoo", s: "synchronized" },
      { t: "Inventory", s: "reserved" },
      { t: "Invoice", s: "completed" },
    ],
    stages: ["Received", "Validated", "Transformed", "Synchronized", "Completed"],
  },
  archcaps: {
    eyebrow: "Architecture",
    title: "Built for systems that need to stay connected.",
    cards: [
      { title: "APIs", desc: "Reliable system-to-system communication." },
      { title: "Webhooks", desc: "Event-driven workflows without unnecessary polling." },
      { title: "Data synchronization", desc: "Consistent information across operational systems." },
    ],
  },
  diagram: {
    hero: {
      aria: "Integration architecture: CRM and ERP exchange requests and data both ways through a central API layer, which also serves the database, webhooks and external systems, producing a connected business flow",
      crm: "CRM",
      erp: "ERP",
      apiTitle: "API LAYER",
      apiSub: "requests, data",
      database: "DATABASE",
      external: "EXTERNAL SYSTEM",
      webhook: "WEBHOOK",
      webhookSub: "event trigger",
      outcome: "CONNECTED BUSINESS FLOW",
    },
    arch: {
      aria: "Integration flow: source systems pass through an integration layer with API, webhook, validation and retry handling into the business workflow",
      tabsLabel: "Source systems",
      sources: ["ERP", "CRM", "Database", "Payments", "External services"],
      layerTitle: "INTEGRATION LAYER",
      layerItems: ["API", "Webhook", "Validation", "Retry"],
      businessLine1: "BUSINESS",
      businessLine2: "WORKFLOW",
      exceptionLabel: "Exception queue",
      legs: ["Request", "Authentication", "Transformation", "Destination", "Response"],
      activeDesc:
        "Request from {source} travels through validation and retry handling into the business workflow, and the response returns the same way.",
    },
  },
  process: {
    eyebrow: "How it works",
    title: "From mapping to operation.",
    steps: [
      {
        title: "Map",
        desc: "We identify what needs to move between which systems, in which direction, and what triggers each exchange.",
      },
      {
        title: "Connect",
        desc: "APIs, webhooks and system boundaries are defined, including authentication and data formats for each side.",
      },
      {
        title: "Validate",
        desc: "Payloads, permissions and failure cases are checked before anything goes live, so edge cases don't become incidents.",
      },
      {
        title: "Operate",
        desc: "The integration runs under observation, with exception handling and a clear path for changes as systems evolve.",
      },
    ],
  },
  tech: {
    eyebrow: "Technology",
    title: "Built from the systems you already run.",
    desc: "Integrations are assembled from proven connectivity, grouped here by role, so you see what each part does instead of a logo wall.",
    groups: [
      {
        role: "Systems",
        items: ["Odoo ERP", "CRMs", "Databases", "Payment platforms", "Messaging tools", "Logistics platforms"],
      },
      {
        role: "Connectivity",
        items: ["REST APIs", "Webhooks", "Event triggers", "Data-format mapping"],
      },
      {
        role: "Control",
        items: ["Payload validation", "Retry & fallback", "Exception queues", "Access scoping"],
      },
      {
        role: "Operations",
        items: ["Logging", "Monitoring", "Alerts", "n8n workflows"],
      },
    ],
  },
  useCases: {
    eyebrow: "Use cases",
    title: "Where integrations pay off.",
    items: [
      {
        title: "ERP ↔ CRM synchronization",
        flow: ["Customer updated", "Order synced", "Status aligned"],
        desc: "Customers, orders and statuses stay aligned between the system that sells and the system that fulfills, without manual re-entry.",
      },
      {
        title: "Webhook-driven business workflows",
        flow: ["Event fires", "n8n workflow runs", "Records and follow-ups done"],
        desc: "Events in one platform kick off multi-step workflows in n8n: notifications, record updates, follow-ups and handoffs.",
      },
      {
        title: "Database ↔ application integration",
        flow: ["Data changes", "Mapped and validated", "Both sides consistent"],
        desc: "Operational data flows between databases and the applications teams use daily, kept consistent in both directions where needed.",
      },
      {
        title: "External platform ↔ internal system",
        flow: ["External event arrives", "Controlled layer maps it", "ERP and workflows updated"],
        desc: "Third-party platforms, payments, messaging, logistics, connected to internal ERP and workflow systems through a controlled layer.",
      },
    ],
  },
  engagement: {
    eyebrow: "Delivery",
    title: "What the implementation includes.",
    items: [
      "Endpoint and event inventory, what connects to what, and why",
      "Authentication and access scoping for every integration",
      "Payload validation and data-format mapping",
      "Retry, fallback and exception paths for failed calls",
      "Logging and monitoring hooks so failures are visible",
      "Handover notes your team can actually maintain",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Integration, answered directly.",
    items: [
      {
        q: "Which systems can you connect?",
        a: "Odoo, CRMs, databases, n8n workflows and third-party platforms that expose APIs or webhooks, payments, messaging and logistics included. If a system has no usable interface, we say so during mapping rather than promising a workaround.",
      },
      {
        q: "Do we need to replace our current tools?",
        a: "No. Integrations wrap around the tools you already use. The goal is one reliable flow between existing systems, not a rip-and-replace.",
      },
      {
        q: "What happens when an integration fails?",
        a: "Failed calls are retried where safe and anything unresolvable lands in an exception queue with the payload and reason attached, visible to your team instead of silently dropped.",
      },
      {
        q: "How is access kept secure?",
        a: "Every integration gets scoped credentials, API keys or tokens limited to exactly what that flow needs, so no connection can touch more than its own job.",
      },
      {
        q: "Who maintains the integrations afterwards?",
        a: "You receive an endpoint and event inventory plus handover notes, and every flow ships with logging and monitoring hooks so your team sees failures first.",
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
        title: "AI Automation & Agents",
        desc: "AI agents and intelligent workflows that remove manual work.",
        href: "/ai-automation",
      },
    ],
  },
  narrative: {
    problem: {
      title: "Your systems are separate.",
      highlight: "Your operation shouldn't be.",
      desc: "ERP, CRM, finance, warehouse, internal tools, and external platforms often operate independently. We connect the systems that need to exchange information so work can move without manual handoffs.",
      items: [
        { t: "Disconnected systems", points: ["Data duplicated between tools", "Manual exports and imports", "Teams switching between systems"] },
        { t: "Connected operation", points: ["Data moves between systems", "Events trigger downstream actions", "Teams work from consistent information"] },
      ],
    },
    connect: {
      title: "One integration layer. Every system that matters.",
      desc: "The systems behind your operation, connected into one reliable ecosystem.",
      items: [
        { t: "ERP", d: "Orders, inventory and business records" },
        { t: "CRM", d: "Customers, opportunities and account data" },
        { t: "Finance", d: "Invoices, payments and financial records" },
        { t: "HR", d: "Employee and organizational data" },
        { t: "Warehouse", d: "Stock levels and fulfillment" },
        { t: "E-commerce", d: "Orders and product availability" },
        { t: "Internal Tools", d: "Sheets, docs and team applications" },
        { t: "APIs", d: "External services and platforms" },
      ],
    },
    process: {
      title: "From system event to completed action.",
      desc: "Four controlled steps between a change in one system and the result in another.",
      steps: [
        { t: "Connect", d: "Map the systems, APIs and data involved." },
        { t: "Transform", d: "Normalize data so systems can understand each other." },
        { t: "Orchestrate", d: "Trigger the right workflow when an event occurs." },
        { t: "Verify", d: "Validate results, handle failures and keep operations observable." },
      ],
    },
    cases: {
      title: "Where integration creates real leverage.",
      desc: "Connect the systems behind the work so information moves automatically between the teams and tools that depend on it.",
      items: [
        { t: "Order → Fulfillment", d: "When an order is created, update inventory, trigger fulfillment and notify the relevant system." },
        { t: "CRM → ERP", d: "Move customer and deal information into the operational system without duplicate entry." },
        { t: "Invoice → Finance", d: "Pass invoice and payment events into finance workflows automatically." },
        { t: "Inventory → Commerce", d: "Keep product availability synchronized across operational and customer-facing systems." },
        { t: "Employee → HR Systems", d: "Synchronize employee records across HR and internal systems." },
        { t: "API → Internal Workflow", d: "Turn an external API event into a controlled internal business workflow." },
      ],
    },
    deliver: {
      title: "What the implementation includes.",
      desc: "From architecture to handover — everything needed to run the connection in production.",
      items: [
        { t: "API & Webhooks", d: "Connect systems through APIs, events and webhooks." },
        { t: "Data Mapping", d: "Translate data structures between systems." },
        { t: "Orchestration", d: "Workflows that react to events and move data." },
        { t: "Authentication", d: "Keys, tokens and scoped access." },
        { t: "Error Handling", d: "Retries, fallbacks and safe failures." },
        { t: "Monitoring", d: "Logs, alerts and visibility." },
        { t: "Testing", d: "Validation against real scenarios." },
        { t: "Documentation", d: "Notes and handover your team can maintain." },
      ],
    },
    example: {
      title: "Example: when an order is created.",
      desc: "One event can trigger the complete operational flow without requiring teams to move information manually.",
    },
  },
  ctaOrbit: {
    eyebrow: "Ready to connect your systems?",
    title: "Make your business systems",
    highlight: "work as one.",
    desc: "Connect CRM, ERP, databases, APIs and internal tools into a reliable operating ecosystem.",
    button: "Plan an integration",
    diagram: {
      center: "Connected Systems",
      centerSub: "One reliable ecosystem",
      nodes: [
        { t: "CRM", s: "Customer data" },
        { t: "ERP", s: "Operations" },
        { t: "APIs", s: "External services" },
        { t: "Database", s: "Business records" },
      ],
    },
  },
  cta: {
    eyebrow: "Ready when you are",
    title: "Have systems that need to",
    highlight: "work together?",
    desc: "Tell us which systems hold your operation together today. We'll map the connections worth building first.",
    button: "Plan an integration",
  },
};

const nl = {
  meta: {
    title: "Systeemkoppelingen & API's",
    description:
      "Koppel ERP, CRM, databases en bedrijfsapplicaties via betrouwbare API's, webhooks en workflows van SystemaOps.",
    keywords:
      "systeemkoppeling, API-koppeling, webhooks, ERP CRM-koppeling, datasynchronisatie, integratiediensten",
    schemaName: "Systeemkoppelingen & API's",
    schemaDesc:
      "Integratiediensten die ERP, CRM, databases en bedrijfsapplicaties verbinden via API's, webhooks en gemonitorde workflows.",
  },
  hero: {
    eyebrow: "Systeemkoppeling & API's",
    title: "Verbind elk systeem.",
    highlight: "Draai één operatie.",
    description:
      "Wij koppelen ERP, CRM, databases, applicaties en externe diensten via betrouwbare API's, webhooks en geautomatiseerde workflows, voor één verbonden operationele laag.",
    primaryCta: "Bespreek uw koppeling",
    secondaryCta: "Bekijk de architectuur",
  },
  problem: {
    eyebrow: "Waarom integratie",
    title: "Uw tools staan los.",
    highlight: "Uw operatie niet.",
    beforeLabel: "ZONDER KOPPELING",
    beforeItems: [
      "Klant-, order- en voorraaddata opgesloten waar het team dat ze nodig heeft er niet bij kan",
      "Records dagelijks gekopieerd en overgetypt tussen tools",
      "Betalingen en statuswijzigingen zonder reactie verderop",
      "Dubbele records en syncfouten die niemand kan traceren",
    ],
    afterLabel: "MET KOPPELING",
    afterItems: [
      "Gedeelde data beschikbaar waar teams werken",
      "Records bewegen automatisch tussen systemen",
      "Events triggeren de volgende stap verderop",
      "Eén consistent record met zichtbare, traceerbare stromen",
    ],
  },
  capabilities: {
    eyebrow: "Mogelijkheden",
    title: "Wat de koppeling dekt.",
    items: [
      {
        title: "API-koppelingen",
        desc: "Koppel ERP, CRM, databases en bedrijfsapplicaties via heldere REST-API's, data lezend en schrijvend waar de operatie het nodig heeft.",
      },
      {
        title: "Webhooks & events",
        desc: "Reageer op wat in één systeem gebeurt, een nieuwe order, een statuswijziging, een betaling, en trigger automatisch de volgende stap elders.",
      },
      {
        title: "Datasynchronisatie",
        desc: "Houd gedeelde records consistent tussen systemen zodat teams dezelfde informatie niet op twee plekken hoeven te reconciliëren.",
      },
      {
        title: "Authenticatie & toegang",
        desc: "API-sleutels, tokens en scoped rechten bewust ingericht, zodat elke koppeling alleen raakt wat zij moet raken.",
      },
      {
        title: "Foutafhandeling",
        desc: "Mislukte calls worden opgevangen, waar veilig opnieuw geprobeerd en helder getoond, in plaats van bedrijfskritische updates stil te laten vallen.",
      },
      {
        title: "Koppelingsmonitoring",
        desc: "Weet wanneer een stroom stopt: payloadlogs, foutzichtbaarheid en alerts gekoppeld aan de workflows die uw team al volgt.",
      },
    ],
  },
  architecture: {
    eyebrow: "Architectuur",
    title: "Zo verbinden systemen.",
    desc: "Elk bronsysteem praat met één integratielaag, nooit een kluwen van punt-tot-puntlinks. Validatie en retry staan in het midden, en wat niet kan worden opgelost landt in een uitzonderingswachtrij die een mens kan inspecteren.",
  },
  network: {
    aria: "Integratienetwerk: zes bedrijfssystemen verbinden via de SystemaOps-integratiekern",
    tabsLabel: "Verbonden systemen",
    core: "SYSTEMAOPS",
    coreSub: "Integratiekern",
    nodes: [
      { t: "CRM", s: "klantdata" },
      { t: "ERP / Odoo", s: "operatie" },
      { t: "Database", s: "records" },
      { t: "Webhook", s: "events" },
      { t: "Externe API", s: "diensten" },
      { t: "Applicatie", s: "maatwerktools" },
    ],
    activeDesc:
      "Datapakket van {source} reist naar de kern en gaat verder naar {dest}.",
  },
  layer: {
    eyebrow: "Één laag",
    title: "Eén laag. Elk systeem.",
    desc: "Koppel de systemen waar uw bedrijf al op draait.",
    cards: [
      { title: "ERP", desc: "Synchroniseer operationele data." },
      { title: "CRM", desc: "Houd klantinformatie verbonden." },
      { title: "Database", desc: "Verplaats en valideer bedrijfsdata." },
      { title: "API's", desc: "Verbind interne en externe diensten." },
      { title: "Webhooks", desc: "Reageer direct op bedrijfsevents." },
      { title: "Applicaties", desc: "Koppel maatwerkbedrijfstools." },
    ],
  },
  order: {
    eyebrow: "In de praktijk",
    title: "Wanneer een order ontstaat",
    desc: "Bekijk hoe een order van klant naar factuur reist, via één verbonden laag.",
    steps: [
      { t: "Bestelling", s: "ontvangen" },
      { t: "CRM", s: "gevalideerd" },
      { t: "Webhook", s: "event verstuurd" },
      { t: "Integratiekern", s: "getransformeerd" },
      { t: "Odoo", s: "gesynchroniseerd" },
      { t: "Voorraad", s: "gereserveerd" },
      { t: "Factuur", s: "voltooid" },
    ],
    stages: ["Ontvangen", "Gevalideerd", "Getransformeerd", "Gesynchroniseerd", "Voltooid"],
  },
  archcaps: {
    eyebrow: "Architectuur",
    title: "Gebouwd voor systemen die verbonden moeten blijven.",
    cards: [
      { title: "API's", desc: "Betrouwbare systeem-tot-systeemcommunicatie." },
      { title: "Webhooks", desc: "Eventgedreven workflows zonder onnodig pollen." },
      { title: "Datasynchronisatie", desc: "Consistente informatie in operationele systemen." },
    ],
  },
  diagram: {
    hero: {
      aria: "Integratiearchitectuur: CRM en ERP wisselen aanvragen en data beide kanten uit via een centrale API-laag, die ook de database, webhooks en externe systemen bedient, met een verbonden bedrijfsstroom als resultaat",
      crm: "CRM",
      erp: "ERP",
      apiTitle: "API-LAAG",
      apiSub: "aanvragen, data",
      database: "DATABASE",
      external: "EXTERN SYSTEEM",
      webhook: "WEBHOOK",
      webhookSub: "eventtrigger",
      outcome: "VERBONDEN BEDRIJFSSTROOM",
    },
    arch: {
      aria: "Integratiestroom: bronsystemen lopen via een integratielaag met API-, webhook-, validatie- en retry-afhandeling naar de bedrijfsworkflow",
      tabsLabel: "Bronsystemen",
      sources: ["ERP", "CRM", "Database", "Betalingen", "Externe diensten"],
      layerTitle: "INTEGRATIELAAG",
      layerItems: ["API", "Webhook", "Validatie", "Retry"],
      businessLine1: "BUSINESS",
      businessLine2: "WORKFLOW",
      exceptionLabel: "Uitzonderingswachtrij",
      legs: ["Aanvraag", "Authenticatie", "Transformatie", "Bestemming", "Antwoord"],
      activeDesc:
        "Aanvraag van {source} loopt via validatie en retry-afhandeling naar de bedrijfsworkflow, en het antwoord keert via dezelfde weg terug.",
    },
  },
  process: {
    eyebrow: "Hoe het werkt",
    title: "Van mapping naar operatie.",
    steps: [
      {
        title: "In kaart",
        desc: "Wij bepalen wat tussen welke systemen moet bewegen, in welke richting, en wat elke uitwisseling triggert.",
      },
      {
        title: "Verbinden",
        desc: "API's, webhooks en systeemgrenzen worden gedefinieerd, inclusief authenticatie en dataformaten per kant.",
      },
      {
        title: "Valideren",
        desc: "Payloads, rechten en faalscenario's worden gecontroleerd vóór livegang, zodat randgevallen geen incidenten worden.",
      },
      {
        title: "Beheren",
        desc: "De koppeling draait onder observatie, met uitzonderingsafhandeling en een helder pad voor wijzigingen naarmate systemen evolueren.",
      },
    ],
  },
  tech: {
    eyebrow: "Technologie",
    title: "Gebouwd op uw bestaande systemen.",
    desc: "Koppelingen zijn samengesteld uit bewezen connectiviteit, hier gegroepeerd per rol, zodat u ziet wat elk onderdeel doet in plaats van een logomuur.",
    groups: [
      {
        role: "Systemen",
        items: ["Odoo ERP", "CRM's", "Databases", "Betaalplatforms", "Messagingtools", "Logistieke platforms"],
      },
      {
        role: "Connectiviteit",
        items: ["REST-API's", "Webhooks", "Eventtriggers", "Dataformaatmapping"],
      },
      {
        role: "Controle",
        items: ["Payloadvalidatie", "Retry & fallback", "Uitzonderingswachtrijen", "Toegangsscoping"],
      },
      {
        role: "Operatie",
        items: ["Logging", "Monitoring", "Alerts", "n8n-workflows"],
      },
    ],
  },
  useCases: {
    eyebrow: "Gebruiksgevallen",
    title: "Waar koppelingen renderen.",
    items: [
      {
        title: "ERP ↔ CRM-synchronisatie",
        flow: ["Klant bijgewerkt", "Order gesynchroniseerd", "Status afgestemd"],
        desc: "Klanten, orders en statussen blijven afgestemd tussen het systeem dat verkoopt en het systeem dat levert, zonder handmatige herinvoer.",
      },
      {
        title: "Webhook-gedreven bedrijfsworkflows",
        flow: ["Event vuurt", "n8n-workflow draait", "Records en opvolging klaar"],
        desc: "Events in één platform starten meerstapsworkflows in n8n: notificaties, recordupdates, opvolging en overdrachten.",
      },
      {
        title: "Database ↔ applicatiekoppeling",
        flow: ["Data wijzigt", "Gemapt en gevalideerd", "Beide kanten consistent"],
        desc: "Operationele data stroomt tussen databases en de applicaties die teams dagelijks gebruiken, waar nodig beide kanten consistent gehouden.",
      },
      {
        title: "Extern platform ↔ intern systeem",
        flow: ["Extern event komt binnen", "Beheerlaag mapt het", "ERP en workflows bijgewerkt"],
        desc: "Externe platforms, betalingen, messaging, logistiek, verbonden met interne ERP- en workflowsystemen via een beheerste laag.",
      },
    ],
  },
  engagement: {
    eyebrow: "Oplevering",
    title: "Wat de implementatie omvat.",
    items: [
      "Endpoint- en eventinventaris, wat waaraan koppelt, en waarom",
      "Authenticatie- en toegangsscoping voor elke koppeling",
      "Payloadvalidatie en dataformaatmapping",
      "Retry-, fallback- en uitzonderingspaden voor mislukte calls",
      "Logging- en monitoringhooks zodat fouten zichtbaar zijn",
      "Overdrachtsnotities die uw team echt kan onderhouden",
    ],
  },
  faq: {
    eyebrow: "Vragen",
    title: "Integratie, direct beantwoord.",
    items: [
      {
        q: "Welke systemen kunt u koppelen?",
        a: "Odoo, CRM's, databases, n8n-workflows en externe platforms met API's of webhooks, inclusief betalingen, messaging en logistiek. Heeft een systeem geen bruikbare interface, dan zeggen wij dat tijdens mapping in plaats van een omweg te beloven.",
      },
      {
        q: "Moeten wij onze huidige tools vervangen?",
        a: "Nee. Koppelingen wikkelen zich om de tools die u al gebruikt. Het doel is één betrouwbare stroom tussen bestaande systemen, geen rip-and-replace.",
      },
      {
        q: "Wat gebeurt er als een koppeling faalt?",
        a: "Mislukte calls worden waar veilig opnieuw geprobeerd en wat onoplosbaar blijft landt in een uitzonderingswachtrij met payload en reden erbij, zichtbaar voor uw team in plaats van stil te verdwijnen.",
      },
      {
        q: "Hoe blijft toegang veilig?",
        a: "Elke koppeling krijgt scoped credentials, API-sleutels of tokens beperkt tot precies wat die stroom nodig heeft, zodat geen verbinding meer raakt dan haar eigen taak.",
      },
      {
        q: "Wie onderhoudt de koppelingen daarna?",
        a: "U ontvangt een endpoint- en eventinventaris plus overdrachtsnotities, en elke stroom komt met logging- en monitoringhooks zodat uw team fouten als eerste ziet.",
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
        title: "AI-automatisering & Agents",
        desc: "AI-agents en intelligente workflows die handmatig werk wegnemen.",
        href: "/ai-automation",
      },
    ],
  },
  narrative: {
    problem: {
      title: "Uw systemen zijn gescheiden.",
      highlight: "Uw operatie hoeft dat niet te zijn.",
      desc: "ERP, CRM, finance, magazijn, interne tools en externe platforms werken vaak onafhankelijk. Wij verbinden de systemen die informatie moeten uitwisselen, zodat werk zonder handmatige overdrachten kan bewegen.",
      items: [
        { t: "Losgekoppelde systemen", points: ["Data gedupliceerd tussen tools", "Handmatige exports en imports", "Teams die tussen systemen schakelen"] },
        { t: "Verbonden operatie", points: ["Data beweegt tussen systemen", "Events triggeren vervolgacties", "Teams werken met consistente informatie"] },
      ],
    },
    connect: {
      title: "Eén integratielaag. Elk systeem dat ertoe doet.",
      desc: "De systemen achter uw operatie, verbonden in één betrouwbaar ecosysteem.",
      items: [
        { t: "ERP", d: "Orders, voorraad en bedrijfsrecords" },
        { t: "CRM", d: "Klanten, kansen en accountdata" },
        { t: "Finance", d: "Facturen, betalingen en financiële records" },
        { t: "HR", d: "Medewerker- en organisatiedata" },
        { t: "Magazijn", d: "Voorraadniveaus en fulfilment" },
        { t: "E-commerce", d: "Orders en productbeschikbaarheid" },
        { t: "Interne tools", d: "Sheets, documenten en teamapplicaties" },
        { t: "API's", d: "Externe diensten en platforms" },
      ],
    },
    process: {
      title: "Van systeemevent naar voltooide actie.",
      desc: "Vier gecontroleerde stappen tussen een wijziging in het ene systeem en het resultaat in het andere.",
      steps: [
        { t: "Verbinden", d: "Breng de systemen, API's en data in kaart." },
        { t: "Transformeren", d: "Normaliseer data zodat systemen elkaar begrijpen." },
        { t: "Orkestreren", d: "Trigger de juiste workflow wanneer een event plaatsvindt." },
        { t: "Verifiëren", d: "Valideer resultaten, vang fouten af en houd de operatie zichtbaar." },
      ],
    },
    cases: {
      title: "Waar integratie echte hefboomwerking creëert.",
      desc: "Verbind de systemen achter het werk, zodat informatie automatisch beweegt tussen de teams en tools die ervan afhangen.",
      items: [
        { t: "Order → Fulfilment", d: "Wanneer een order wordt aangemaakt: voorraad bijwerken, fulfilment triggeren en het juiste systeem informeren." },
        { t: "CRM → ERP", d: "Klant- en dealinformatie zonder dubbele invoer naar het operationele systeem brengen." },
        { t: "Factuur → Finance", d: "Factuur- en betaalevents automatisch naar financiële workflows doorgeven." },
        { t: "Voorraad → Commerce", d: "Productbeschikbaarheid gesynchroniseerd tussen operationele en klantgerichte systemen." },
        { t: "Medewerker → HR-systemen", d: "Medewerkerrecords gesynchroniseerd tussen HR en interne systemen." },
        { t: "API → Interne workflow", d: "Van een extern API-event een gecontroleerde interne bedrijfsworkflow maken." },
      ],
    },
    deliver: {
      title: "Wat de implementatie omvat.",
      desc: "Van architectuur tot overdracht — alles om de koppeling in productie te laten draaien.",
      items: [
        { t: "API's & webhooks", d: "Systemen verbinden via API's, events en webhooks." },
        { t: "Datamapping", d: "Datastructuren vertalen tussen systemen." },
        { t: "Orkestratie", d: "Workflows die reageren op events en data verplaatsen." },
        { t: "Authenticatie", d: "Keys, tokens en afgebakende toegang." },
        { t: "Foutafhandeling", d: "Retries, fallbacks en veilige fouten." },
        { t: "Monitoring", d: "Logs, alerts en zichtbaarheid." },
        { t: "Testen", d: "Validatie tegen echte scenario's." },
        { t: "Documentatie", d: "Notities en overdracht die uw team kan onderhouden." },
      ],
    },
    example: {
      title: "Voorbeeld: wanneer een order wordt aangemaakt.",
      desc: "Eén event kan de complete operationele stroom triggeren, zonder dat teams informatie handmatig moeten verplaatsen.",
    },
  },
  ctaOrbit: {
    eyebrow: "Klaar om uw systemen te verbinden?",
    title: "Laat uw bedrijfssystemen",
    highlight: "als één werken.",
    desc: "Verbind CRM, ERP, databases, API's en interne tools in een betrouwbaar operationeel ecosysteem.",
    button: "Plan een koppeling",
    diagram: {
      center: "Verbonden systemen",
      centerSub: "Eén betrouwbaar ecosysteem",
      nodes: [
        { t: "CRM", s: "Klantdata" },
        { t: "ERP", s: "Operatie" },
        { t: "API's", s: "Externe diensten" },
        { t: "Database", s: "Bedrijfsrecords" },
      ],
    },
  },
  cta: {
    eyebrow: "Klaar wanneer u dat bent",
    title: "Hebt u systemen die moeten",
    highlight: "samenwerken?",
    desc: "Vertel welke systemen uw operatie vandaag dragen. Wij brengen de waardevolste verbindingen eerst in kaart.",
    button: "Plan een koppeling",
  },
};

const de = {
  meta: {
    title: "Systemintegration & APIs",
    description:
      "ERP, CRM, Datenbanken und Geschäftsanwendungen über zuverlässige APIs, Webhooks und Workflows von SystemaOps verbinden.",
    keywords:
      "Systemintegration, API-Integration, Webhooks, ERP CRM-Integration, Datensynchronisation, Integrationsleistungen",
    schemaName: "Systemintegration & APIs",
    schemaDesc:
      "Integrationsleistungen, die ERP, CRM, Datenbanken und Anwendungen über APIs, Webhooks und überwachte Workflows verbinden.",
  },
  hero: {
    eyebrow: "Systemintegration & APIs",
    title: "Verbinden Sie jedes System.",
    highlight: "Betreiben Sie eine Operation.",
    description:
      "Wir verbinden ERP, CRM, Datenbanken, Anwendungen und externe Dienste über zuverlässige APIs, Webhooks und automatisierte Workflows, für eine verbundene operative Schicht.",
    primaryCta: "Integration besprechen",
    secondaryCta: "Architektur entdecken",
  },
  problem: {
    eyebrow: "Warum Integration",
    title: "Ihre Tools sind getrennt.",
    highlight: "Ihre Operation nicht.",
    beforeLabel: "OHNE INTEGRATION",
    beforeItems: [
      "Kunden-, Auftrags- und Bestandsdaten gefangen, wo das Team sie nicht erreicht",
      "Datensätze täglich zwischen Tools kopiert und neu getippt",
      "Zahlungen und Statuswechsel ohne Reaktion weiter unten",
      "Doppelte Datensätze und Sync-Fehler, die niemand nachverfolgen kann",
    ],
    afterLabel: "MIT INTEGRATION",
    afterItems: [
      "Geteilte Daten verfügbar, wo Teams arbeiten",
      "Datensätze bewegen sich automatisch zwischen Systemen",
      "Events triggern den nächsten Schritt weiter unten",
      "Ein konsistenter Datensatz mit sichtbaren, nachvollziehbaren Flüssen",
    ],
  },
  capabilities: {
    eyebrow: "Leistungen",
    title: "Was die Integration abdeckt.",
    items: [
      {
        title: "API-Integrationen",
        desc: "ERP, CRM, Datenbanken und Anwendungen über klar definierte REST-APIs verbinden, Daten lesend und schreibend, wo die Operation sie braucht.",
      },
      {
        title: "Webhooks & Events",
        desc: "Auf Geschehen in einem System reagieren, neuer Auftrag, Statuswechsel, Zahlung, und automatisch den nächsten Schritt anderswo auslösen.",
      },
      {
        title: "Datensynchronisation",
        desc: "Geteilte Datensätze über Systeme konsistent halten, sodass Teams dieselbe Information nicht an zwei Stellen abgleichen.",
      },
      {
        title: "Authentifizierung & Zugriff",
        desc: "API-Keys, Tokens und scoped Berechtigungen bewusst eingerichtet, sodass jede Integration nur berührt, was sie soll.",
      },
      {
        title: "Fehlerbehandlung",
        desc: "Fehlgeschlagene Calls werden abgefangen, wo sicher erneut versucht und klar gezeigt, statt kritische Updates still fallen zu lassen.",
      },
      {
        title: "Integrationsmonitoring",
        desc: "Wissen, wenn ein Fluss stoppt: Payload-Logs, Fehlersichtbarkeit und Alerts in den Workflows, die Ihr Team ohnehin beobachtet.",
      },
    ],
  },
  architecture: {
    eyebrow: "Architektur",
    title: "So verbinden sich Systeme.",
    desc: "Jedes Quellsystem spricht mit einer Integrationsschicht, nie ein Gewirr aus Punkt-zu-Punkt-Links. Validierung und Retry sitzen in der Mitte, und was nicht lösbar ist, landet in einer Exception-Queue, die ein Mensch prüfen kann.",
  },
  network: {
    aria: "Integrationsnetzwerk: sechs Geschäftssysteme verbinden über den SystemaOps-Integrationskern",
    tabsLabel: "Verbundene Systeme",
    core: "SYSTEMAOPS",
    coreSub: "Integrationskern",
    nodes: [
      { t: "CRM", s: "Kundendaten" },
      { t: "ERP / Odoo", s: "Betrieb" },
      { t: "Datenbank", s: "Datensätze" },
      { t: "Webhook", s: "Events" },
      { t: "Externe API", s: "Dienste" },
      { t: "Anwendung", s: "Custom-Tools" },
    ],
    activeDesc:
      "Datenpaket von {source} läuft zum Kern und weiter zu {dest}.",
  },
  layer: {
    eyebrow: "Eine Schicht",
    title: "Eine Schicht. Jedes System.",
    desc: "Verbinden Sie die Systeme, auf die Ihr Business bereits baut.",
    cards: [
      { title: "ERP", desc: "Operative Daten synchronisieren." },
      { title: "CRM", desc: "Kundeninformationen verbunden halten." },
      { title: "Datenbank", desc: "Geschäftsdaten bewegen und validieren." },
      { title: "APIs", desc: "Interne und externe Dienste verbinden." },
      { title: "Webhooks", desc: "Sofort auf Business-Events reagieren." },
      { title: "Anwendungen", desc: "Custom-Businesstools anbinden." },
    ],
  },
  order: {
    eyebrow: "In der Praxis",
    title: "Wenn ein Auftrag entsteht",
    desc: "Verfolgen Sie einen Auftrag vom Kunden bis zur Rechnung, durch eine verbundene Schicht.",
    steps: [
      { t: "Kundenauftrag", s: "erhalten" },
      { t: "CRM", s: "validiert" },
      { t: "Webhook", s: "Event gesendet" },
      { t: "Integrationskern", s: "transformiert" },
      { t: "Odoo", s: "synchronisiert" },
      { t: "Lager", s: "reserviert" },
      { t: "Rechnung", s: "abgeschlossen" },
    ],
    stages: ["Erhalten", "Validiert", "Transformiert", "Synchronisiert", "Abgeschlossen"],
  },
  archcaps: {
    eyebrow: "Architektur",
    title: "Gebaut für Systeme, die verbunden bleiben müssen.",
    cards: [
      { title: "APIs", desc: "Zuverlässige System-zu-System-Kommunikation." },
      { title: "Webhooks", desc: "Eventgetriebene Workflows ohne unnötiges Polling." },
      { title: "Datensynchronisierung", desc: "Konsistente Informationen in operativen Systemen." },
    ],
  },
  diagram: {
    hero: {
      aria: "Integrationsarchitektur: CRM und ERP tauschen Anfragen und Daten beidseitig über eine zentrale API-Schicht aus, die auch Datenbank, Webhooks und externe Systeme bedient, mit verbundenem Business-Flow als Ergebnis",
      crm: "CRM",
      erp: "ERP",
      apiTitle: "API-SCHICHT",
      apiSub: "Anfragen, Daten",
      database: "DATENBANK",
      external: "EXTERNES SYSTEM",
      webhook: "WEBHOOK",
      webhookSub: "Event-Trigger",
      outcome: "VERBUNDENER BUSINESS-FLOW",
    },
    arch: {
      aria: "Integrationsfluss: Quellsysteme laufen über eine Integrationsschicht mit API-, Webhook-, Validierungs- und Retry-Behandlung in den Business-Workflow",
      tabsLabel: "Quellsysteme",
      sources: ["ERP", "CRM", "Datenbank", "Zahlungen", "Externe Dienste"],
      layerTitle: "INTEGRATIONSSCHICHT",
      layerItems: ["API", "Webhook", "Validierung", "Retry"],
      businessLine1: "BUSINESS",
      businessLine2: "WORKFLOW",
      exceptionLabel: "Exception-Queue",
      legs: ["Anfrage", "Authentifizierung", "Transformation", "Ziel", "Antwort"],
      activeDesc:
        "Anfrage von {source} läuft über Validierung und Retry-Behandlung in den Business-Workflow, die Antwort kehrt auf demselben Weg zurück.",
    },
  },
  process: {
    eyebrow: "So funktioniert es",
    title: "Vom Mapping zum Betrieb.",
    steps: [
      {
        title: "Mappen",
        desc: "Wir klären, was zwischen welchen Systemen laufen muss, in welche Richtung, und was jeden Austausch triggert.",
      },
      {
        title: "Verbinden",
        desc: "APIs, Webhooks und Systemgrenzen werden definiert, inklusive Authentifizierung und Datenformaten je Seite.",
      },
      {
        title: "Validieren",
        desc: "Payloads, Rechte und Fehlerfälle werden vor Go-live geprüft, sodass Randfälle keine Incidents werden.",
      },
      {
        title: "Betreiben",
        desc: "Die Integration läuft unter Beobachtung, mit Exception-Behandlung und klarem Pfad für Änderungen mit den Systemen.",
      },
    ],
  },
  tech: {
    eyebrow: "Technologie",
    title: "Gebaut auf Ihren bestehenden Systemen.",
    desc: "Integrationen aus bewährter Konnektivität zusammengesetzt, hier nach Rolle gruppiert, sodass jede Aufgabe sichtbar bleibt statt einer Logowand.",
    groups: [
      {
        role: "Systeme",
        items: ["Odoo ERP", "CRMs", "Datenbanken", "Zahlungsplattformen", "Messaging-Tools", "Logistikplattformen"],
      },
      {
        role: "Konnektivität",
        items: ["REST-APIs", "Webhooks", "Event-Trigger", "Datenformat-Mapping"],
      },
      {
        role: "Kontrolle",
        items: ["Payload-Validierung", "Retry & Fallback", "Exception-Queues", "Zugriffs-Scoping"],
      },
      {
        role: "Betrieb",
        items: ["Logging", "Monitoring", "Alerts", "n8n-Workflows"],
      },
    ],
  },
  useCases: {
    eyebrow: "Anwendungsfälle",
    title: "Wo Integrationen zahlen.",
    items: [
      {
        title: "ERP ↔ CRM-Synchronisation",
        flow: ["Kunde aktualisiert", "Auftrag synchronisiert", "Status abgeglichen"],
        desc: "Kunden, Aufträge und Status bleiben zwischen verkaufendem und erfüllendem System abgeglichen, ohne manuelle Neueingabe.",
      },
      {
        title: "Webhook-getriebene Business-Workflows",
        flow: ["Event feuert", "n8n-Workflow läuft", "Records und Follow-ups erledigt"],
        desc: "Events in einer Plattform starten mehrstufige Workflows in n8n: Benachrichtigungen, Record-Updates, Follow-ups und Übergaben.",
      },
      {
        title: "Datenbank ↔ Anwendungsintegration",
        flow: ["Daten ändern sich", "Gemappt und validiert", "Beide Seiten konsistent"],
        desc: "Operative Daten fließen zwischen Datenbanken und täglich genutzten Anwendungen, wo nötig beidseitig konsistent gehalten.",
      },
      {
        title: "Externe Plattform ↔ internes System",
        flow: ["Externes Event trifft ein", "Kontrollschicht mappt", "ERP und Workflows aktualisiert"],
        desc: "Drittplattformen, Zahlungen, Messaging, Logistik, verbunden mit internem ERP und Workflows über eine kontrollierte Schicht.",
      },
    ],
  },
  engagement: {
    eyebrow: "Lieferung",
    title: "Was die Implementierung enthält.",
    items: [
      "Endpoint- und Event-Inventar, was womit verbindet, und warum",
      "Authentifizierungs- und Zugriffs-Scoping für jede Integration",
      "Payload-Validierung und Datenformat-Mapping",
      "Retry-, Fallback- und Exception-Pfade für fehlgeschlagene Calls",
      "Logging- und Monitoring-Hooks, sodass Fehler sichtbar sind",
      "Übergabenotizen, die Ihr Team wirklich pflegen kann",
    ],
  },
  faq: {
    eyebrow: "Fragen",
    title: "Integration, direkt beantwortet.",
    items: [
      {
        q: "Welche Systeme können Sie verbinden?",
        a: "Odoo, CRMs, Datenbanken, n8n-Workflows und Drittplattformen mit APIs oder Webhooks, inklusive Zahlungen, Messaging und Logistik. Hat ein System keine nutzbare Schnittstelle, sagen wir das beim Mapping statt einen Workaround zu versprechen.",
      },
      {
        q: "Müssen wir unsere Tools ersetzen?",
        a: "Nein. Integrationen legen sich um Ihre bestehenden Tools. Ziel ist ein verlässlicher Fluss zwischen Bestandssystemen, kein Rip-and-Replace.",
      },
      {
        q: "Was passiert bei Integrationsfehlern?",
        a: "Fehlgeschlagene Calls werden wo sicher erneut versucht und Unlösbares landet in einer Exception-Queue mit Payload und Grund, sichtbar für Ihr Team statt still verworfen.",
      },
      {
        q: "Wie bleibt Zugriff sicher?",
        a: "Jede Integration erhält scoped Credentials, API-Keys oder Tokens begrenzt auf genau ihren Bedarf, sodass keine Verbindung mehr berührt als ihre Aufgabe.",
      },
      {
        q: "Wer pflegt die Integrationen danach?",
        a: "Sie erhalten Endpoint- und Event-Inventar plus Übergabenotizen, und jeder Fluss hat Logging- und Monitoring-Hooks, sodass Ihr Team Fehler zuerst sieht.",
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
        title: "KI-Automatisierung & Agenten",
        desc: "KI-Agenten und intelligente Workflows, die Handarbeit abnehmen.",
        href: "/ai-automation",
      },
    ],
  },
  narrative: {
    problem: {
      title: "Ihre Systeme sind getrennt.",
      highlight: "Ihr Betrieb muss es nicht sein.",
      desc: "ERP, CRM, Finanzen, Lager, interne Tools und externe Plattformen arbeiten oft unabhängig voneinander. Wir verbinden die Systeme, die Informationen austauschen müssen, damit Arbeit ohne manuelle Übergaben fließt.",
      items: [
        { t: "Getrennte Systeme", points: ["Daten zwischen Tools dupliziert", "Manuelle Ex- und Importe", "Teams wechseln zwischen Systemen"] },
        { t: "Verbundener Betrieb", points: ["Daten fließen zwischen Systemen", "Events lösen Folgeaktionen aus", "Teams arbeiten mit konsistenten Daten"] },
      ],
    },
    connect: {
      title: "Eine Integrationsschicht. Jedes System, das zählt.",
      desc: "Die Systeme hinter Ihrem Betrieb, verbunden in einem zuverlässigen Ökosystem.",
      items: [
        { t: "ERP", d: "Aufträge, Lager und Geschäftsdaten" },
        { t: "CRM", d: "Kunden, Chancen und Kontodaten" },
        { t: "Finanzen", d: "Rechnungen, Zahlungen und Finanzdaten" },
        { t: "HR", d: "Mitarbeiter- und Organisationsdaten" },
        { t: "Lager", d: "Bestände und Fulfillment" },
        { t: "E-Commerce", d: "Bestellungen und Produktverfügbarkeit" },
        { t: "Interne Tools", d: "Sheets, Dokumente und Team-Anwendungen" },
        { t: "APIs", d: "Externe Dienste und Plattformen" },
      ],
    },
    process: {
      title: "Vom System-Event zur abgeschlossenen Aktion.",
      desc: "Vier kontrollierte Schritte zwischen einer Änderung im einen System und dem Ergebnis im anderen.",
      steps: [
        { t: "Verbinden", d: "Systeme, APIs und Daten erfassen." },
        { t: "Transformieren", d: "Daten normalisieren, damit Systeme einander verstehen." },
        { t: "Orchestrieren", d: "Den richtigen Workflow auslösen, wenn ein Event eintritt." },
        { t: "Verifizieren", d: "Ergebnisse prüfen, Fehler abfangen und den Betrieb beobachtbar halten." },
      ],
    },
    cases: {
      title: "Wo Integration echte Hebelwirkung erzeugt.",
      desc: "Verbinden Sie die Systeme hinter der Arbeit, damit Informationen automatisch zwischen den abhängigen Teams und Tools fließen.",
      items: [
        { t: "Auftrag → Fulfillment", d: "Bei neuer Bestellung: Lager aktualisieren, Fulfillment auslösen und das richtige System informieren." },
        { t: "CRM → ERP", d: "Kunden- und Dealdaten ohne doppelte Eingabe ins operative System bringen." },
        { t: "Rechnung → Finanzen", d: "Rechnungs- und Zahlungs-Events automatisch in Finanz-Workflows übergeben." },
        { t: "Lager → Commerce", d: "Produktverfügbarkeit zwischen operativen und kundennahen Systemen synchron halten." },
        { t: "Mitarbeiter → HR-Systeme", d: "Mitarbeiterdaten zwischen HR und internen Systemen synchronisieren." },
        { t: "API → interner Workflow", d: "Aus einem externen API-Event einen kontrollierten internen Geschäftsworkflow machen." },
      ],
    },
    deliver: {
      title: "Was die Implementierung umfasst.",
      desc: "Von Architektur bis Übergabe — alles, um die Verbindung in Produktion zu betreiben.",
      items: [
        { t: "APIs & Webhooks", d: "Systeme über APIs, Events und Webhooks verbinden." },
        { t: "Daten-Mapping", d: "Datenstrukturen zwischen Systemen übersetzen." },
        { t: "Orchestrierung", d: "Workflows, die auf Events reagieren und Daten bewegen." },
        { t: "Authentifizierung", d: "Keys, Tokens und abgegrenzte Zugriffe." },
        { t: "Fehlerbehandlung", d: "Retries, Fallbacks und sichere Fehler." },
        { t: "Monitoring", d: "Logs, Alerts und Sichtbarkeit." },
        { t: "Testen", d: "Validierung an echten Szenarien." },
        { t: "Dokumentation", d: "Notizen und Übergabe, die Ihr Team pflegen kann." },
      ],
    },
    example: {
      title: "Beispiel: Wenn eine Bestellung angelegt wird.",
      desc: "Ein Event kann den kompletten Betriebsablauf auslösen, ohne dass Teams Informationen manuell bewegen müssen.",
    },
  },
  ctaOrbit: {
    eyebrow: "Bereit, Ihre Systeme zu verbinden?",
    title: "Lassen Sie Ihre Systeme",
    highlight: "als eines arbeiten.",
    desc: "Verbinden Sie CRM, ERP, Datenbanken, APIs und interne Tools in einem zuverlässigen Betriebsökosystem.",
    button: "Integration planen",
    diagram: {
      center: "Verbundene Systeme",
      centerSub: "Ein zuverlässiges Ökosystem",
      nodes: [
        { t: "CRM", s: "Kundendaten" },
        { t: "ERP", s: "Betrieb" },
        { t: "APIs", s: "Externe Dienste" },
        { t: "Datenbank", s: "Geschäftsdaten" },
      ],
    },
  },
  cta: {
    eyebrow: "Bereit, wenn Sie es sind",
    title: "Haben Sie Systeme, die",
    highlight: "zusammenarbeiten müssen?",
    desc: "Sagen Sie uns, welche Systeme Ihre Operation heute tragen. Wir mappen zuerst die wertvollsten Verbindungen.",
    button: "Integration planen",
  },
};

export const integrationContent = { en, nl, de };
