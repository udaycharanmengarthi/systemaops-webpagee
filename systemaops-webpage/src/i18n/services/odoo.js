/* Centralized content for the Odoo Solutions service page (/odoo-customization).
   Consumed via t("serviceDetail.odoo.*"). Icons stay in the component. */

const en = {
  meta: {
    title: "Odoo Solutions & ERP Customization",
    description:
      "Implement and customize Odoo around your workflows, business logic and operational needs: CRM, sales, inventory, finance and connected modules.",
    keywords:
      "Odoo customization, Odoo ERP, Odoo implementation, Odoo modules, ERP customization, business workflows",
    schemaName: "Odoo Solutions",
    schemaDesc:
      "Odoo ERP implementation and customization services built around real business workflows and operational needs.",
  },
  hero: {
    eyebrow: "Odoo Solutions",
    title: "Make Odoo fit",
    highlight: "the way your business works.",
    description:
      "Implement and customize Odoo around your workflows, business logic and operational needs, instead of bending the operation to fit the software.",
    primaryCta: "Discuss Odoo",
    secondaryCta: "See how it works",
  },
  problem: {
    eyebrow: "The problem",
    title: "Your ERP should support the operation,",
    highlight: "not force it into a template.",
    beforeLabel: "WITHOUT FIT",
    beforeItems: [
      "Disconnected processes across teams and tools",
      "Manual handoffs between sales, stock and finance",
      "Business rules living in people's heads",
      "Standard configuration fighting the real workflow",
    ],
    afterLabel: "WITH ODOO FITTED",
    afterItems: [
      "One system carrying the whole operation",
      "Handoffs configured to mirror reality",
      "Rules implemented where the work happens",
      "Workflows shaped to the teams using them",
    ],
  },
  capabilities: {
    eyebrow: "Capabilities",
    title: "Everything Odoo should do for your operation.",
    items: [
      {
        title: "Odoo implementation",
        desc: "Odoo set up around your operation from the start: apps, access, and structure matched to how the business actually runs.",
      },
      {
        title: "Customization",
        desc: "Views, fields, flows and rules adjusted so standard Odoo behavior follows your process instead of fighting it.",
      },
      {
        title: "Workflow configuration",
        desc: "Pipelines, stages and approvals configured per team: sales, warehouse, finance, with handoffs that mirror reality.",
      },
      {
        title: "Business logic",
        desc: "The rules your operation runs on: pricing, stock, invoicing logic, implemented where the work happens.",
      },
      {
        title: "Module integration",
        desc: "CRM, sales, inventory, accounting, HR and custom modules working as one system, not five disconnected apps.",
      },
      {
        title: "Process alignment",
        desc: "Existing processes mapped first, then Odoo shaped to them: gaps closed deliberately instead of paved over.",
      },
    ],
  },
  architecture: {
    eyebrow: "Architecture",
    title: "Five modules. One core. Live workflows.",
    desc: "Five business modules converge into one configured Odoo core, and the results flow into the business workflows your teams run every day.",
  },
  diagram: {
    aria: "ERP architecture: five business modules converge into the Odoo core, which drives business workflows",
    ariaCompact: "Odoo system: business modules feed Odoo, driving operations",
    tabsLabel: "Odoo modules",
    nodes: [
      { t: "CRM", s: "customer relationships" },
      { t: "Sales", s: "orders" },
      { t: "Inventory", s: "stock" },
      { t: "Finance", s: "invoices and accounting" },
      { t: "HR", s: "people" },
    ],
    coreTitle: "ODOO",
    coreLine2: "CORE",
    coreSub: "configured and customized",
    opsTitle: "BUSINESS OPERATIONS",
    opsLine1: "BUSINESS",
    opsLine2: "WORKFLOWS",
    opsSub: "connected workflows",
    captionPre: "Tracing",
    captionPost:
      ": configured pipelines, business rules and custom logic carry it from module into daily workflows.",
    captionFullPre: "Five business modules converge into",
    captionFullCore: "one Odoo core",
    captionFullPost: ". Results flow into daily business operations.",
  },
  process: {
    eyebrow: "How we implement it",
    title: "Understand, configure, customize, operate.",
    steps: [
      {
        title: "Understand",
        desc: "We map the operation: workflows, handoffs, rules and where standard processes break down.",
      },
      {
        title: "Configure",
        desc: "Odoo is aligned with the existing workflow: apps, pipelines and permissions set up per team.",
      },
      {
        title: "Customize",
        desc: "Required business logic is implemented in custom modules, tested against real operating scenarios.",
      },
      {
        title: "Operate",
        desc: "The system goes live under observation, then we improve, extend and adapt as the business changes.",
      },
    ],
  },
  tech: {
    eyebrow: "Technology",
    title: "Odoo, organized around your operation.",
    desc: "Modules, workflows, integrations and custom logic, each grouped by the job it does.",
    groups: [
      {
        role: "Odoo modules",
        items: ["CRM", "Sales", "Inventory", "Invoicing", "Accounting", "HR & Payroll"],
      },
      {
        role: "Business workflows",
        items: ["Pipelines", "Approvals", "Fulfillment", "Lead tracking"],
      },
      {
        role: "Integrations",
        items: ["REST APIs", "Webhooks", "Payment platforms", "Third-party systems"],
      },
      {
        role: "Data",
        items: ["Products", "Stock", "Customers", "Finance records"],
      },
      {
        role: "Custom logic",
        items: ["Python modules", "Business rules", "Custom views", "Automated actions"],
      },
    ],
  },
  useCases: {
    eyebrow: "Use cases",
    title: "Operations running on Odoo.",
    items: [
      {
        title: "ERP workflows that match the floor",
        flow: ["Order arrives", "Stock & rules checked", "Fulfillment + invoice"],
        desc: "Sales, warehouse and finance move through one connected flow, configured around how fulfillment actually happens.",
      },
      {
        title: "CRM processes sales teams follow",
        flow: ["Lead captured", "Pipeline + follow-ups", "Quote to order"],
        desc: "Pipelines, stages and reminders shaped to the sales motion, not a default template nobody opens.",
      },
      {
        title: "Business operations in one place",
        flow: ["Request logged", "Approval routed", "Record updated"],
        desc: "Day-to-day operational requests travel through Odoo with approvals and history attached.",
      },
      {
        title: "Module customization for edge cases",
        flow: ["Gap identified", "Custom module built", "Standard + custom unified"],
        desc: "Where standard Odoo stops, Python modules continue, integrated so users never feel the seam.",
      },
    ],
  },
  engagement: {
    eyebrow: "Engagement",
    title: "What the implementation includes.",
    items: [
      "Discovery: operation mapping across teams and handoffs",
      "App scoping: which Odoo modules, and what each must do",
      "Configuration: pipelines, permissions and workflows per team",
      "Customization: views, fields, rules and Python modules",
      "Integrations: payments, external platforms and connected tools",
      "Testing: real operating scenarios before go-live",
      "Handover: notes, training support and a path for extension",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Odoo, answered directly.",
    items: [
      {
        q: "Can Odoo be customized around our process?",
        a: "Yes, that is the core of the service. Views, fields, workflows and Python modules are shaped around how your teams already work, instead of forcing the operation into a default template.",
      },
      {
        q: "Do we need to replace our existing systems?",
        a: "Not necessarily. Odoo can become the operational core while existing tools connect through APIs and webhooks. We map what stays, what moves, and what integrates.",
      },
      {
        q: "Can Odoo integrate with other applications?",
        a: "Yes. Payment platforms, CRMs, logistics and third-party systems connect to Odoo through APIs and webhooks, so data flows instead of being re-entered.",
      },
      {
        q: "How does implementation work?",
        a: "Understand the operation first, then configure Odoo around it, customize where standard behavior falls short, and go live under observation, with testing against real scenarios throughout.",
      },
      {
        q: "What happens after go-live?",
        a: "The system is monitored, improved and extended as the business changes, with handover notes your team can maintain and a clear path for new modules.",
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
        title: "System Integration & APIs",
        desc: "Connect Odoo, CRMs and business systems into one flow.",
        href: "/system-integrations",
      },
    ],
  },
  middle: {
    solve: {
      title: "Odoo should fit the way your business works.",
      desc: "Standard Odoo gives you the foundation. We configure and customize it around your workflows, business rules, integrations, and operating processes.",
      items: [
        { t: "Process Alignment", d: "Map existing workflows and identify where Odoo should adapt to the business." },
        { t: "Business Logic", d: "Implement the rules, approvals, pricing, inventory, and operational logic the business actually uses." },
        { t: "Module Integration", d: "Connect CRM, Sales, Inventory, Finance, HR, and other required Odoo modules into one operating flow." },
        { t: "Workflow Automation", d: "Reduce repetitive manual work by connecting business processes and system actions." },
      ],
    },
    provide: {
      title: "What we build around Odoo.",
      desc: "From configuration to custom development, we adapt Odoo to the way your teams operate.",
      items: [
        { t: "Odoo Implementation", d: "Odoo set up around your operation from the start: apps, access and structure matched to how the business runs." },
        { t: "Odoo Customization", d: "Views, fields, flows and rules adjusted so standard Odoo follows your process." },
        { t: "Workflow Configuration", d: "Pipelines, stages and approvals configured per team, with handoffs that mirror reality." },
        { t: "Module Integration", d: "CRM, sales, inventory, accounting, HR and custom modules working as one system." },
        { t: "Business Automation", d: "Repetitive steps, follow-ups and system actions handled automatically where safe." },
        { t: "Reporting & Operational Visibility", d: "Dashboards and reports built from the operational data Odoo already holds." },
      ],
    },
    usecases: {
      title: "Built around real business workflows.",
      desc: "We configure Odoo around the workflows your teams already depend on — instead of forcing operations into a generic template.",
      items: [
        { t: "CRM & Sales", flow: ["Lead", "Opportunity", "Quotation", "Order", "Customer handoff"] },
        { t: "Inventory & Operations", flow: ["Stock", "Warehouse", "Procurement", "Fulfillment"] },
        { t: "Finance", flow: ["Orders", "Invoicing", "Payment", "Accounting"] },
        { t: "HR & Internal Operations", flow: ["Employee processes", "Approvals", "Internal workflows"] },
        { t: "Management & Reporting", flow: ["Operational data", "Dashboards", "Business visibility"] },
      ],
    },
    delivery: {
      title: "From business process to working Odoo.",
      items: [
        { t: "Understand", d: "Map workflows, teams, rules, dependencies, and operational requirements." },
        { t: "Configure", d: "Set up Odoo modules, permissions, workflows, and standard functionality around the process." },
        { t: "Customize", d: "Build required business logic, integrations, automations, and custom modules where standard Odoo is not enough." },
        { t: "Operate", d: "Launch, monitor, improve, and adapt the system as the business changes." },
      ],
    },
  },
  ctaOrbit: {
    eyebrow: "Ready to modernize operations?",
    title: "Build Odoo around",
    highlight: "how your business works.",
    desc: "Connect your operations with an Odoo system designed around your actual workflows, data and teams.",
    button: "Discuss an Odoo solution",
    diagram: {
      center: "Odoo ERP",
      centerSub: "Configured and customized",
      nodes: [
        { t: "Operations", s: "Business workflows" },
        { t: "Modules", s: "CRM, Sales, Inventory" },
        { t: "Data", s: "Unified records" },
        { t: "Automation", s: "Rules and approvals" },
      ],
    },
  },
  cta: {
    eyebrow: "Ready when you are",
    title: "Let's make Odoo",
    highlight: "fit your operation.",
    desc: "Walk us through how work moves today. We'll show where Odoo fits and what needs shaping.",
    button: "Discuss Odoo",
  },
};

const nl = {
  meta: {
    title: "Odoo-oplossingen & ERP-maatwerk",
    description:
      "Implementeer en stem Odoo af op uw workflows, bedrijfslogica en operationele behoeften: CRM, verkoop, voorraad, finance en gekoppelde modules.",
    keywords:
      "Odoo-maatwerk, Odoo ERP, Odoo-implementatie, Odoo-modules, ERP-maatwerk, bedrijfsworkflows",
    schemaName: "Odoo-oplossingen",
    schemaDesc:
      "Odoo ERP-implementatie en maatwerk, gebouwd rond echte bedrijfsWorkflows en operationele behoeften.",
  },
  hero: {
    eyebrow: "Odoo-oplossingen",
    title: "Laat Odoo passen",
    highlight: "bij hoe uw bedrijf werkt.",
    description:
      "Implementeer en stem Odoo af op uw workflows, bedrijfslogica en operationele behoeften, in plaats van de operatie in de software te persen.",
    primaryCta: "Bespreek Odoo",
    secondaryCta: "Bekijk hoe het werkt",
  },
  problem: {
    eyebrow: "Het probleem",
    title: "Uw ERP moet de operatie ondersteunen,",
    highlight: "niet in een sjabloon dwingen.",
    beforeLabel: "ZONDER FIT",
    beforeItems: [
      "Losgekoppelde processen tussen teams en tools",
      "Handmatige overdrachten tussen verkoop, voorraad en finance",
      "Bedrijfsregels alleen in hoofden van mensen",
      "Standaardconfiguratie tegen de echte workflow in",
    ],
    afterLabel: "MET PASSEND ODOO",
    afterItems: [
      "Eén systeem dat de hele operatie draagt",
      "Overdrachten ingericht als in werkelijkheid",
      "Regels vastgelegd waar het werk gebeurt",
      "Workflows gevormd naar de teams die ze gebruiken",
    ],
  },
  capabilities: {
    eyebrow: "Mogelijkheden",
    title: "Alles wat Odoo voor uw operatie moet doen.",
    items: [
      {
        title: "Odoo-implementatie",
        desc: "Odoo vanaf het begin ingericht rond uw operatie: apps, toegang en structuur passend bij hoe het bedrijf echt werkt.",
      },
      {
        title: "Maatwerk",
        desc: "Weergaven, velden, stromen en regels aangepast zodat standaard Odoo-gedrag uw proces volgt in plaats van tegenwerkt.",
      },
      {
        title: "Workflowconfiguratie",
        desc: "Pijplijnen, fasen en goedkeuringen per team ingericht: verkoop, magazijn, finance, met realistische overdrachten.",
      },
      {
        title: "Bedrijfslogica",
        desc: "De regels waarop uw operatie draait: prijs-, voorraad- en facturatielogica, vastgelegd waar het werk gebeurt.",
      },
      {
        title: "Module-integratie",
        desc: "CRM, verkoop, voorraad, boekhouding, HR en maatwerkmodules als één systeem, niet vijf losse apps.",
      },
      {
        title: "Procesafstemming",
        desc: "Eerst bestaande processen in kaart, dan Odoo ernaar gevormd: hiaten bewust gedicht in plaats van bedekt.",
      },
    ],
  },
  architecture: {
    eyebrow: "Architectuur",
    title: "Vijf modules. Eén kern. Lopende workflows.",
    desc: "Vijf bedrijfsmodules komen samen in één ingerichte Odoo-kern; de resultaten stromen door naar de bedrijfsworkflows die uw teams dagelijks draaien.",
  },
  diagram: {
    aria: "ERP-architectuur: vijf bedrijfsmodules komen samen in de Odoo-kern, die bedrijfsWorkflows aanstuurt",
    ariaCompact: "Odoo-systeem: bedrijfsmodules voeden Odoo, dat de operatie aanstuurt",
    tabsLabel: "Odoo-modules",
    nodes: [
      { t: "CRM", s: "klantrelaties" },
      { t: "Verkoop", s: "orders" },
      { t: "Voorraad", s: "voorraad" },
      { t: "Finance", s: "facturen en boekhouding" },
      { t: "HR", s: "medewerkers" },
    ],
    coreTitle: "ODOO",
    coreLine2: "KERN",
    coreSub: "ingericht en aangepast",
    opsTitle: "BEDRIJFSOPERATIE",
    opsLine1: "BEDRIJFS",
    opsLine2: "WORKFLOWS",
    opsSub: "gekoppelde workflows",
    captionPre: "Route van",
    captionPost:
      ": ingerichte pijplijnen, bedrijfsregels en maatwerklogica dragen het van module naar dagelijkse workflows.",
    captionFullPre: "Vijf bedrijfsmodules komen samen in",
    captionFullCore: "één Odoo-kern",
    captionFullPost: ". Resultaten stromen naar de dagelijkse operatie.",
  },
  process: {
    eyebrow: "Zo implementeren wij",
    title: "Begrijpen, inrichten, aanpassen, beheren.",
    steps: [
      {
        title: "Begrijpen",
        desc: "Wij brengen de operatie in kaart: workflows, overdrachten, regels en waar standaardprocessen breken.",
      },
      {
        title: "Inrichten",
        desc: "Odoo wordt afgestemd op de bestaande workflow: apps, pijplijnen en rechten per team.",
      },
      {
        title: "Aanpassen",
        desc: "Benodigde bedrijfslogica in maatwerkmodules, getest aan echte operationele scenario's.",
      },
      {
        title: "Beheren",
        desc: "Het systeem gaat live onder observatie, daarna verbeteren, uitbreiden en aanpassen naarmate het bedrijf verandert.",
      },
    ],
  },
  tech: {
    eyebrow: "Technologie",
    title: "Odoo, georganiseerd rond uw operatie.",
    desc: "Modules, workflows, integraties en maatwerklogica, gegroepeerd per taak.",
    groups: [
      {
        role: "Odoo-modules",
        items: ["CRM", "Verkoop", "Voorraad", "Facturatie", "Boekhouding", "HR & Payroll"],
      },
      {
        role: "BedrijfsWorkflows",
        items: ["Pijplijnen", "Goedkeuringen", "Fulfilment", "Leadtracking"],
      },
      {
        role: "Integraties",
        items: ["REST-API's", "Webhooks", "Betaalplatforms", "Systemen van derden"],
      },
      {
        role: "Data",
        items: ["Producten", "Voorraad", "Klanten", "Financiële records"],
      },
      {
        role: "Maatwerklogica",
        items: ["Python-modules", "Bedrijfsregels", "Aangepaste weergaven", "Geautomatiseerde acties"],
      },
    ],
  },
  useCases: {
    eyebrow: "Gebruiksgevallen",
    title: "Operatie draaiend op Odoo.",
    items: [
      {
        title: "ERP-workflows als op de werkvloer",
        flow: ["Order komt binnen", "Voorraad en regels gecontroleerd", "Fulfilment + factuur"],
        desc: "Verkoop, magazijn en finance bewegen door één verbonden stroom, ingericht rond hoe fulfilment echt gebeurt.",
      },
      {
        title: "CRM-processen die verkoop volgt",
        flow: ["Lead vastgelegd", "Pijplijn + opvolging", "Offerte naar order"],
        desc: "Pijplijnen, fasen en herinneringen gevormd naar de verkoopbeweging, geen standaardsjabloon dat niemand opent.",
      },
      {
        title: "Bedrijfsoperatie op één plek",
        flow: ["Verzoek gelogd", "Goedkeuring gerouteerd", "Record bijgewerkt"],
        desc: "Dagelijkse operationele verzoeken lopen via Odoo met goedkeuringen en historie erbij.",
      },
      {
        title: "Modulemaatwerk voor randgevallen",
        flow: ["Hiaat gevonden", "Maatwerkmodule gebouwd", "Standaard + maatwerk verenigd"],
        desc: "Waar standaard Odoo stopt, gaan Python-modules verder, geïntegreerd zodat gebruikers de naad nooit voelen.",
      },
    ],
  },
  engagement: {
    eyebrow: "Aanpak",
    title: "Wat de implementatie omvat.",
    items: [
      "Discovery: operatie in kaart tussen teams en overdrachten",
      "App-scoping: welke Odoo-modules, en wat elk moet doen",
      "Configuratie: pijplijnen, rechten en workflows per team",
      "Maatwerk: weergaven, velden, regels en Python-modules",
      "Integraties: betalingen, externe platforms en gekoppelde tools",
      "Tests: echte operationele scenario's vóór livegang",
      "Overdracht: notities, trainingsondersteuning en een pad voor uitbreiding",
    ],
  },
  faq: {
    eyebrow: "Vragen",
    title: "Odoo, direct beantwoord.",
    items: [
      {
        q: "Kan Odoo rond ons proces worden aangepast?",
        a: "Ja, dat is de kern van de dienst. Weergaven, velden, workflows en Python-modules worden gevormd rond hoe uw teams al werken, in plaats van de operatie in een standaardsjabloon te dwingen.",
      },
      {
        q: "Moeten wij onze bestaande systemen vervangen?",
        a: "Niet per se. Odoo kan de operationele kern worden terwijl bestaande tools via API's en webhooks koppelen. Wij brengen in kaart wat blijft, wat verhuist en wat integreert.",
      },
      {
        q: "Kan Odoo met andere applicaties integreren?",
        a: "Ja. Betaalplatforms, CRM's, logistiek en systemen van derden koppelen via API's en webhooks, zodat data stroomt in plaats van opnieuw ingevoerd te worden.",
      },
      {
        q: "Hoe werkt implementatie?",
        a: "Eerst de operatie begrijpen, dan Odoo eromheen inrichten, aanpassen waar standaardgedrag tekortschiet, en live gaan onder observatie, met tests aan echte scenario's.",
      },
      {
        q: "Wat gebeurt er na livegang?",
        a: "Het systeem wordt gemonitord, verbeterd en uitgebreid naarmate het bedrijf verandert, met overdrachtsnotities die uw team kan onderhouden en een duidelijk pad voor nieuwe modules.",
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
        title: "Systeemkoppelingen & API's",
        desc: "Koppel Odoo, CRM's en bedrijfssystemen in één stroom.",
        href: "/system-integrations",
      },
    ],
  },
  middle: {
    solve: {
      title: "Odoo moet passen bij hoe uw bedrijf werkt.",
      desc: "Standaard Odoo geeft u het fundament. Wij configureren en passen het aan rond uw workflows, bedrijfsregels, integraties en operationele processen.",
      items: [
        { t: "Procesafstemming", d: "Bestaande workflows in kaart brengen en bepalen waar Odoo zich aan het bedrijf moet aanpassen." },
        { t: "Bedrijfslogica", d: "De regels, goedkeuringen, prijsvorming, voorraad en operationele logica implementeren die het bedrijf echt gebruikt." },
        { t: "Module-integratie", d: "CRM, Verkoop, Voorraad, Finance, HR en andere benodigde Odoo-modules verbinden tot één operationele stroom." },
        { t: "Workflowautomatisering", d: "Terugkerend handwerk verminderen door bedrijfsprocessen en systeemacties te koppelen." },
      ],
    },
    provide: {
      title: "Wat we rond Odoo bouwen.",
      desc: "Van configuratie tot maatwerkontwikkeling passen we Odoo aan op hoe uw teams werken.",
      items: [
        { t: "Odoo-implementatie", d: "Odoo vanaf het begin ingericht rond uw operatie: apps, toegang en structuur passend bij hoe het bedrijf werkt." },
        { t: "Odoo-maatwerk", d: "Weergaven, velden, stromen en regels aangepast zodat standaard Odoo uw proces volgt." },
        { t: "Workflowconfiguratie", d: "Pijplijnen, fasen en goedkeuringen per team ingericht, met overdrachten zoals in werkelijkheid." },
        { t: "Module-integratie", d: "CRM, verkoop, voorraad, boekhouding, HR en maatwerkmodules als één systeem." },
        { t: "Bedrijfsautomatisering", d: "Terugkerende stappen, opvolging en systeemacties automatisch afgehandeld waar dat veilig kan." },
        { t: "Rapportage & operationeel inzicht", d: "Dashboards en rapporten gebouwd op de operationele data die Odoo al bevat." },
      ],
    },
    usecases: {
      title: "Gebouwd rond echte bedrijfsworkflows.",
      desc: "We configureren Odoo rond de workflows waar uw teams al op draaien — in plaats van de operatie in een generiek sjabloon te dwingen.",
      items: [
        { t: "CRM & Verkoop", flow: ["Lead", "Kans", "Offerte", "Order", "Overdracht naar klant"] },
        { t: "Voorraad & Operatie", flow: ["Voorraad", "Magazijn", "Inkoop", "Fulfilment"] },
        { t: "Finance", flow: ["Orders", "Facturatie", "Betaling", "Boekhouding"] },
        { t: "HR & Interne operatie", flow: ["HR-processen", "Goedkeuringen", "Interne workflows"] },
        { t: "Management & Rapportage", flow: ["Operationele data", "Dashboards", "Zakelijk inzicht"] },
      ],
    },
    delivery: {
      title: "Van bedrijfsproces naar werkende Odoo.",
      items: [
        { t: "Begrijpen", d: "Workflows, teams, regels, afhankelijkheden en operationele vereisten in kaart brengen." },
        { t: "Inrichten", d: "Odoo-modules, rechten, workflows en standaardfunctionaliteit rond het proces instellen." },
        { t: "Aanpassen", d: "Benodigde bedrijfslogica, integraties, automatiseringen en maatwerkmodules bouwen waar standaard Odoo tekortschiet." },
        { t: "Beheren", d: "Livegang, monitoring, verbetering en aanpassing van het systeem naarmate het bedrijf verandert." },
      ],
    },
  },
  ctaOrbit: {
    eyebrow: "Klaar om de operatie te moderniseren?",
    title: "Bouw Odoo rond",
    highlight: "hoe uw bedrijf werkt.",
    desc: "Verbind uw operatie met een Odoo-systeem ontworpen rond uw echte workflows, data en teams.",
    button: "Bespreek een Odoo-oplossing",
    diagram: {
      center: "Odoo ERP",
      centerSub: "Ingericht en aangepast",
      nodes: [
        { t: "Operatie", s: "Bedrijfsworkflows" },
        { t: "Modules", s: "CRM, Verkoop, Voorraad" },
        { t: "Data", s: "Uniforme records" },
        { t: "Automatisering", s: "Regels en goedkeuringen" },
      ],
    },
  },
  cta: {
    eyebrow: "Klaar wanneer u dat bent",
    title: "Laten we Odoo",
    highlight: "passend maken voor uw operatie.",
    desc: "Laat zien hoe werk vandaag stroomt. Wij tonen waar Odoo past en wat vorm nodig heeft.",
    button: "Bespreek Odoo",
  },
};

const de = {
  meta: {
    title: "Odoo-Lösungen & ERP-Anpassung",
    description:
      "Odoo rund um Ihre Workflows, Geschäftslogik und operativen Bedarf implementieren und anpassen: CRM, Vertrieb, Lager, Finanzen und verbundene Module.",
    keywords:
      "Odoo-Anpassung, Odoo ERP, Odoo-Implementierung, Odoo-Module, ERP-Anpassung, GeschäftsWorkflows",
    schemaName: "Odoo-Lösungen",
    schemaDesc:
      "Odoo-ERP-Implementierung und Anpassung rund um reale GeschäftsWorkflows und operativen Bedarf.",
  },
  hero: {
    eyebrow: "Odoo-Lösungen",
    title: "Odoo passend machen",
    highlight: "für Ihre Arbeitsweise.",
    description:
      "Odoo rund um Ihre Workflows, Geschäftslogik und operativen Bedarf implementieren und anpassen, statt den Betrieb in die Software zu pressen.",
    primaryCta: "Odoo besprechen",
    secondaryCta: "Sehen, wie es funktioniert",
  },
  problem: {
    eyebrow: "Das Problem",
    title: "Ihr ERP sollte den Betrieb stützen,",
    highlight: "nicht in eine Vorlage zwingen.",
    beforeLabel: "OHNE FIT",
    beforeItems: [
      "Getrennte Prozesse über Teams und Tools hinweg",
      "Manuelle Übergaben zwischen Vertrieb, Lager und Finanzen",
      "Geschäftsregeln nur in den Köpfen der Menschen",
      "Standardkonfiguration gegen den echten Workflow",
    ],
    afterLabel: "MIT PASSENDEM ODOO",
    afterItems: [
      "Ein System trägt den gesamten Betrieb",
      "Übergaben wie in der Realität konfiguriert",
      "Regeln dort umgesetzt, wo gearbeitet wird",
      "Workflows passend zu den Teams geformt",
    ],
  },
  capabilities: {
    eyebrow: "Leistungen",
    title: "Alles, was Odoo für Ihren Betrieb leisten sollte.",
    items: [
      {
        title: "Odoo-Implementierung",
        desc: "Odoo von Beginn an rund um Ihre Operation eingerichtet: Apps, Zugriff und Struktur passend zur echten Arbeitsweise.",
      },
      {
        title: "Anpassung",
        desc: "Ansichten, Felder, Abläufe und Regeln so justiert, dass Standard-Odoo Ihrem Prozess folgt statt dagegen.",
      },
      {
        title: "Workflow-Konfiguration",
        desc: "Pipelines, Stufen und Freigaben je Team konfiguriert: Vertrieb, Lager, Finanzen, mit realistischen Übergaben.",
      },
      {
        title: "Geschäftslogik",
        desc: "Die Regeln Ihrer Operation: Preis-, Bestands- und Rechnungslogik dort umgesetzt, wo gearbeitet wird.",
      },
      {
        title: "Modulintegration",
        desc: "CRM, Vertrieb, Lager, Buchhaltung, HR und Custom-Module als ein System, nicht fünf getrennte Apps.",
      },
      {
        title: "Prozessabgleich",
        desc: "Erst bestehende Prozesse erfasst, dann Odoo danach geformt: Lücken bewusst geschlossen statt überdeckt.",
      },
    ],
  },
  architecture: {
    eyebrow: "Architektur",
    title: "Fünf Module. Ein Kern. Lebendige Workflows.",
    desc: "Fünf Geschäftsmodule laufen in einem konfigurierten Odoo-Kern zusammen; die Ergebnisse fließen in die GeschäftsWorkflows, die Ihre Teams täglich ausführen.",
  },
  diagram: {
    aria: "ERP-Architektur: fünf Geschäftsmodule laufen im Odoo-Kern zusammen, der GeschäftsWorkflows antreibt",
    ariaCompact: "Odoo-System: Geschäftsmodule speisen Odoo, das die Operation antreibt",
    tabsLabel: "Odoo-Module",
    nodes: [
      { t: "CRM", s: "Kundenbeziehungen" },
      { t: "Vertrieb", s: "Aufträge" },
      { t: "Lager", s: "Bestand" },
      { t: "Finanzen", s: "Rechnungen und Buchhaltung" },
      { t: "HR", s: "Mitarbeiter" },
    ],
    coreTitle: "ODOO",
    coreLine2: "KERN",
    coreSub: "konfiguriert und angepasst",
    opsTitle: "GESCHÄFTSBETRIEB",
    opsLine1: "GESCHÄFTS",
    opsLine2: "WORKFLOWS",
    opsSub: "verbundene Workflows",
    captionPre: "Verlauf von",
    captionPost:
      ": konfigurierte Pipelines, Geschäftsregeln und Custom-Logik tragen es vom Modul in tägliche Workflows.",
    captionFullPre: "Fünf Geschäftsmodule laufen zusammen in",
    captionFullCore: "einem Odoo-Kern",
    captionFullPost: ". Ergebnisse fließen in den täglichen Betrieb.",
  },
  process: {
    eyebrow: "So setzen wir um",
    title: "Verstehen, konfigurieren, anpassen, betreiben.",
    steps: [
      {
        title: "Verstehen",
        desc: "Wir erfassen die Operation: Workflows, Übergaben, Regeln und wo Standardprozesse brechen.",
      },
      {
        title: "Konfigurieren",
        desc: "Odoo wird am bestehenden Workflow ausgerichtet: Apps, Pipelines und Rechte je Team.",
      },
      {
        title: "Anpassen",
        desc: "Erforderliche Geschäftslogik in Custom-Modulen, getestet an realen Betriebsszenarien.",
      },
      {
        title: "Betreiben",
        desc: "Das System geht unter Beobachtung live, dann verbessern, erweitern und anpassen mit dem Business.",
      },
    ],
  },
  tech: {
    eyebrow: "Technologie",
    title: "Odoo, organisiert um Ihren Betrieb.",
    desc: "Module, Workflows, Integrationen und Custom-Logik, gruppiert nach Aufgabe.",
    groups: [
      {
        role: "Odoo-Module",
        items: ["CRM", "Vertrieb", "Lager", "Rechnung", "Buchhaltung", "HR & Payroll"],
      },
      {
        role: "GeschäftsWorkflows",
        items: ["Pipelines", "Freigaben", "Fulfillment", "Lead-Tracking"],
      },
      {
        role: "Integrationen",
        items: ["REST-APIs", "Webhooks", "Zahlungsplattformen", "Drittsysteme"],
      },
      {
        role: "Daten",
        items: ["Produkte", "Bestand", "Kunden", "Finanzdaten"],
      },
      {
        role: "Custom-Logik",
        items: ["Python-Module", "Geschäftsregeln", "Custom-Ansichten", "Automatisierte Aktionen"],
      },
    ],
  },
  useCases: {
    eyebrow: "Anwendungsfälle",
    title: "Betrieb auf Odoo.",
    items: [
      {
        title: "ERP-Workflows wie in der Halle",
        flow: ["Auftrag kommt an", "Bestand und Regeln geprüft", "Fulfillment + Rechnung"],
        desc: "Vertrieb, Lager und Finanzen in einem verbundenen Fluss, konfiguriert wie Fulfillment wirklich läuft.",
      },
      {
        title: "CRM-Prozesse, die Vertrieb nutzt",
        flow: ["Lead erfasst", "Pipeline + Follow-ups", "Angebot zum Auftrag"],
        desc: "Pipelines, Stufen und Erinnerungen passend zur Vertriebsbewegung, keine Standardvorlage, die niemand öffnet.",
      },
      {
        title: "Geschäftsbetrieb an einem Ort",
        flow: ["Anfrage geloggt", "Freigabe geroutet", "Datensatz aktualisiert"],
        desc: "Tägliche operative Anfragen laufen durch Odoo mit Freigaben und Verlauf.",
      },
      {
        title: "Modulanpassung für Randfälle",
        flow: ["Lücke erkannt", "Custom-Modul gebaut", "Standard + Custom vereint"],
        desc: "Wo Standard-Odoo endet, setzen Python-Module an, integriert, sodass Nutzer die Naht nie spüren.",
      },
    ],
  },
  engagement: {
    eyebrow: "Umfang",
    title: "Was die Implementierung enthält.",
    items: [
      "Discovery: Operations-Mapping über Teams und Übergaben",
      "App-Scoping: welche Odoo-Module, und was jedes leisten muss",
      "Konfiguration: Pipelines, Rechte und Workflows je Team",
      "Anpassung: Ansichten, Felder, Regeln und Python-Module",
      "Integrationen: Zahlungen, externe Plattformen und verbundene Tools",
      "Tests: reale Betriebsszenarien vor Go-live",
      "Übergabe: Notizen, Trainingssupport und Erweiterungspfad",
    ],
  },
  faq: {
    eyebrow: "Fragen",
    title: "Odoo, direkt beantwortet.",
    items: [
      {
        q: "Kann Odoo an unseren Prozess angepasst werden?",
        a: "Ja, das ist der Kern der Leistung. Ansichten, Felder, Workflows und Python-Module werden um Ihre Arbeitsweise geformt, statt die Operation in eine Vorlage zu zwingen.",
      },
      {
        q: "Müssen wir bestehende Systeme ersetzen?",
        a: "Nicht unbedingt. Odoo kann operativer Kern werden, während Bestandstools per API und Webhook anbinden. Wir mappen, was bleibt, was wandert und was integriert.",
      },
      {
        q: "Integriert Odoo andere Anwendungen?",
        a: "Ja. Zahlungsplattformen, CRMs, Logistik und Drittsysteme hängen per API und Webhook an Odoo, sodass Daten fließen statt neu getippt zu werden.",
      },
      {
        q: "Wie läuft die Implementierung?",
        a: "Erst Operation verstehen, dann Odoo darum konfigurieren, anpassen, wo Standardverhalten nicht reicht, und unter Beobachtung live gehen, mit Tests an realen Szenarien.",
      },
      {
        q: "Was passiert nach Go-live?",
        a: "Das System wird monitored, verbessert und erweitert mit dem Business, mit Übergabenotizen für Ihr Team und klarem Pfad für neue Module.",
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
        title: "Systemintegration & APIs",
        desc: "Odoo, CRMs und Geschäftssysteme in einem Fluss verbinden.",
        href: "/system-integrations",
      },
    ],
  },
  middle: {
    solve: {
      title: "Odoo sollte zur Arbeitsweise Ihres Unternehmens passen.",
      desc: "Standard-Odoo liefert das Fundament. Wir konfigurieren und passen es an Ihre Workflows, Geschäftsregeln, Integrationen und Betriebsprozesse an.",
      items: [
        { t: "Prozessabgleich", d: "Bestehende Workflows erfassen und feststellen, wo Odoo sich dem Unternehmen anpassen sollte." },
        { t: "Geschäftslogik", d: "Die Regeln, Freigaben, Preisgestaltung, Bestände und operative Logik umsetzen, die das Unternehmen wirklich nutzt." },
        { t: "Modulintegration", d: "CRM, Vertrieb, Lager, Finanzen, HR und weitere benötigte Odoo-Module zu einem Betriebsfluss verbinden." },
        { t: "Workflow-Automatisierung", d: "Wiederkehrende Handarbeit reduzieren, indem Geschäftsprozesse und Systemaktionen verbunden werden." },
      ],
    },
    provide: {
      title: "Was wir rund um Odoo bauen.",
      desc: "Von der Konfiguration bis zur Individualentwicklung passen wir Odoo an die Arbeitsweise Ihrer Teams an.",
      items: [
        { t: "Odoo-Implementierung", d: "Odoo von Beginn an rund um Ihre Operation eingerichtet: Apps, Zugriff und Struktur passend zur Arbeitsweise." },
        { t: "Odoo-Anpassung", d: "Ansichten, Felder, Abläufe und Regeln so justiert, dass Standard-Odoo Ihrem Prozess folgt." },
        { t: "Workflow-Konfiguration", d: "Pipelines, Stufen und Freigaben je Team konfiguriert, mit realistischen Übergaben." },
        { t: "Modulintegration", d: "CRM, Vertrieb, Lager, Buchhaltung, HR und Custom-Module als ein System." },
        { t: "Geschäftsautomatisierung", d: "Wiederkehrende Schritte, Follow-ups und Systemaktionen automatisch erledigt, wo es sicher ist." },
        { t: "Reporting & operative Transparenz", d: "Dashboards und Berichte aus den operativen Daten, die Odoo bereits hält." },
      ],
    },
    usecases: {
      title: "Gebaut um echte GeschäftsWorkflows.",
      desc: "Wir konfigurieren Odoo rund um die Workflows, auf die Ihre Teams bereits angewiesen sind — statt den Betrieb in eine generische Vorlage zu zwingen.",
      items: [
        { t: "CRM & Vertrieb", flow: ["Lead", "Chance", "Angebot", "Auftrag", "Kundenübergabe"] },
        { t: "Lager & Betrieb", flow: ["Bestand", "Lager", "Beschaffung", "Fulfillment"] },
        { t: "Finanzen", flow: ["Aufträge", "Fakturierung", "Zahlung", "Buchhaltung"] },
        { t: "HR & interne Abläufe", flow: ["Mitarbeiterprozesse", "Freigaben", "Interne Workflows"] },
        { t: "Management & Reporting", flow: ["Betriebsdaten", "Dashboards", "Geschäftstransparenz"] },
      ],
    },
    delivery: {
      title: "Vom Geschäftsprozess zum funktionierenden Odoo.",
      items: [
        { t: "Verstehen", d: "Workflows, Teams, Regeln, Abhängigkeiten und operative Anforderungen erfassen." },
        { t: "Konfigurieren", d: "Odoo-Module, Rechte, Workflows und Standardfunktionen rund um den Prozess einrichten." },
        { t: "Anpassen", d: "Benötigte Geschäftslogik, Integrationen, Automatisierungen und Custom-Module bauen, wo Standard-Odoo nicht ausreicht." },
        { t: "Betreiben", d: "Livegang, Überwachung, Verbesserung und Anpassung des Systems, während sich das Unternehmen verändert." },
      ],
    },
  },
  ctaOrbit: {
    eyebrow: "Bereit, die Operation zu modernisieren?",
    title: "Bauen Sie Odoo rund um",
    highlight: "Ihre Arbeitsweise.",
    desc: "Verbinden Sie Ihre Operation mit einem Odoo-System rund um Ihre echten Workflows, Daten und Teams.",
    button: "Odoo-Lösung besprechen",
    diagram: {
      center: "Odoo ERP",
      centerSub: "Konfiguriert und angepasst",
      nodes: [
        { t: "Betrieb", s: "Geschäftsworkflows" },
        { t: "Module", s: "CRM, Vertrieb, Lager" },
        { t: "Daten", s: "Einheitliche Datensätze" },
        { t: "Automatisierung", s: "Regeln und Freigaben" },
      ],
    },
  },
  cta: {
    eyebrow: "Bereit, wenn Sie es sind",
    title: "Machen wir Odoo",
    highlight: "passend für Ihre Operation.",
    desc: "Zeigen Sie uns, wie Arbeit heute läuft. Wir zeigen, wo Odoo passt und was Form braucht.",
    button: "Odoo besprechen",
  },
};

export const odooContent = { en, nl, de };
