/* Centralized content for the Data & Document Automation service page (/data-document-automation).
   Consumed via t("serviceDetail.data.*"). Icons stay in the component.
   Diagram shapes (exactly what the two inline visuals need):
   - diagram.hero: { aria, stages[{t,s}] (6 pipeline nodes, geometry stays local;
     index 2 EXTRACT is the highlighted node), fields[] (3 extraction chips) }
   - diagram.processing: { aria, document/extract/validate/structure/destination/review
     ({t,s} each, matching the six visual blocks) }
   Notes vs. the generic service shape:
   - problem.items preserves the existing WHY grid (title+desc x4); before/after
     are derived from the same problem-section copy (page has no before/after block).
   - problem.before/after, checkpoint and work are derived/preserved keys so the
     page keeps its layout with no hardcoded strings.
   - useCases items use {tag,title,desc}: the source has category tags, no flow
     arrays, so tags are preserved instead of inventing flows. */

const en = {
  meta: {
    title: "Data & Document Automation",
    description:
      "Capture documents and data, extract what matters, validate it and route it into Odoo, CRM and business workflows, with human review where it counts.",
    keywords:
      "document automation, data extraction, document processing, document workflow, data validation, Odoo document automation",
    schemaName: "Data & Document Automation",
    schemaDesc:
      "Document and data automation: intake, extraction, validation, normalization and routing into business systems with human oversight.",
  },
  hero: {
    eyebrow: "Data & Document Automation",
    title: "Turn documents into",
    highlight: "decisions your systems can use.",
    description:
      "Capture documents and data, extract the information that matters, validate it and route it into the systems that handle the next step, with a human checkpoint wherever judgment is required.",
    primaryCta: "Automate a document workflow",
    secondaryCta: "See the pipeline",
  },
  problem: {
    eyebrow: "Why document automation",
    title: "Useful information should not",
    highlight: "stay trapped in files.",
    beforeLabel: "WITHOUT AUTOMATION",
    beforeItems: [
      "Same values retyped from PDFs and forms, day after day",
      "Every sender's format reconciled by hand",
      "Documents waiting in inboxes and folders",
      "Straightforward cases reviewed like ambiguous ones",
    ],
    afterLabel: "WITH AUTOMATION",
    afterItems: [
      "Values extracted once, systems updated directly",
      "Formats normalized into one clean structure",
      "Documents processed as they arrive",
      "Routine cases flow through, people judge the exceptions",
    ],
    items: [
      {
        title: "Repetitive manual entry",
        desc: "Teams retype the same values from PDFs and forms into systems, day after day.",
      },
      {
        title: "Inconsistent formats",
        desc: "Every sender formats things differently, dates, totals, references, and someone has to reconcile them.",
      },
      {
        title: "Delayed processing",
        desc: "Documents wait in inboxes and folders until a person gets around to them.",
      },
      {
        title: "Routine human review",
        desc: "Straightforward cases get the same attention as genuinely ambiguous ones.",
      },
    ],
  },
  capabilities: {
    eyebrow: "Capabilities",
    title: "From inbox to structured record.",
    items: [
      {
        title: "Document intake",
        desc: "A single entry point for incoming files and form data, email attachments, uploads and shared folders collected into one workflow.",
      },
      {
        title: "Information extraction",
        desc: "The fields that matter, totals, dates, reference numbers, line items, pulled out of documents into usable values.",
      },
      {
        title: "Validation & rules",
        desc: "Business rules check every record: required fields, expected formats, sensible ranges. Anything doubtful is flagged, not forced through.",
      },
      {
        title: "Data normalization",
        desc: "Inconsistent formats become one clean structure, so downstream systems receive data they can actually consume.",
      },
      {
        title: "Routing & workflow",
        desc: "Validated records flow into Odoo, CRM or custom workflows automatically, with the source document attached for traceability.",
      },
      {
        title: "Human review",
        desc: "Exceptions route to a person with full context. Approved or corrected records rejoin the flow; nothing stalls silently.",
      },
    ],
  },
  architecture: {
    eyebrow: "The pipeline",
    title: "Controlled automation, end to end.",
    desc: "Documents travel left to right: extraction pulls out the values, validation checks them, and structured records land in Odoo or your ERP. Anything the rules can't resolve drops to human review, with the source document and the reason attached.",
  },
  diagram: {
    hero: {
      aria: "Document pipeline: a document is captured, extracted showing name, date and amount fields, validated against rules, structured into data, and delivered to the business system",
      stages: [
        { t: "DOCUMENT", s: "raw file" },
        { t: "CAPTURE", s: "collected" },
        { t: "EXTRACT", s: "fields pulled" },
        { t: "VALIDATE", s: "rules, checks" },
        { t: "STRUCTURED DATA", s: "clean record" },
        { t: "BUSINESS SYSTEM", s: "next step" },
      ],
      fields: ["NAME", "DATE", "AMOUNT"],
    },
    processing: {
      aria: "Processing flow: document to extract to validate to structure to Odoo or ERP, with a human review branch off validation",
      document: { t: "DOCUMENT", s: "invoice, form" },
      extract: { t: "EXTRACT", s: "fields, values" },
      validate: { t: "VALIDATE", s: "rules, checks" },
      structure: { t: "STRUCTURE", s: "clean record" },
      destination: { t: "ODOO / ERP", s: "next system" },
      review: { t: "HUMAN REVIEW", s: "exceptions" },
      sample: {
        docTitle: "Invoice",
        fields: [
          { k: "Customer", v: "ACME GmbH" },
          { k: "Invoice no.", v: "INV-1048" },
          { k: "Amount", v: "€4,280" },
          { k: "Date", v: "12 Sep 2026" },
        ],
        ready: "Ready for Odoo",
      },
    },
  },
  process: {
    eyebrow: "How it works",
    title: "Capture, extract, validate, act.",
    steps: [
      {
        title: "Capture",
        desc: "Incoming documents and data are brought into one workflow, whatever format they arrive in.",
      },
      {
        title: "Extract",
        desc: "The fields your process needs are identified and pulled out as structured values.",
      },
      {
        title: "Validate",
        desc: "Rules run over every record; exceptions go to a human with the full picture attached.",
      },
      {
        title: "Act",
        desc: "Clean, structured information lands in the system that handles the next step.",
      },
    ],
  },
  tech: {
    eyebrow: "Technology",
    title: "Every stage uses the right tool.",
    desc: "The pipeline is assembled from intake, processing and destination tooling, grouped by role so the responsibilities stay clear.",
    groups: [
      {
        role: "Sources",
        items: ["Email attachments", "Uploads", "Shared folders", "Forms", "Invoices", "RFQs"],
      },
      {
        role: "Processing",
        items: ["Field extraction", "Validation rules", "Format normalization", "Duplicate detection"],
      },
      {
        role: "Destinations",
        items: ["Odoo ERP", "CRM systems", "n8n workflows", "Structured records"],
      },
      {
        role: "Oversight",
        items: ["Human review queues", "Source traceability", "Review history"],
      },
    ],
  },
  checkpoint: {
    eyebrow: "Human oversight",
    title: "Automation with a human checkpoint.",
    desc: "Not every decision should be fully automated. The pipeline is designed so routine cases flow straight through while anything uncertain stops where a person can judge it.",
    steps: [
      { lead: "Automation", text: "extracts and checks every record." },
      { lead: "Validation", text: "passes clean records, flags the rest." },
      { lead: "Exception", text: "carries the document plus the reason." },
      { lead: "Human review", text: "approves or corrects with one action." },
      { lead: "Continue", text: "the record rejoins the flow." },
    ],
  },
  useCases: {
    eyebrow: "Use cases",
    title: "Document-heavy work, handled.",
    items: [
      {
        tag: "Operations",
        title: "RFQ processing",
        desc: "Incoming requests for quotation are captured, key details extracted and structured, then routed into the quoting workflow, with unclear requests flagged for review.",
      },
      {
        tag: "Back office",
        title: "Document intake at scale",
        desc: "High volumes of routine documents move through the same pipeline: captured, validated and filed into the right system without per-file handling.",
      },
      {
        tag: "Finance ops",
        title: "Structured business data extraction",
        desc: "Totals, dates and line items leave the PDF and become fields your ERP and reporting can work with directly.",
      },
      {
        tag: "Regulated work",
        title: "Compliance-oriented document workflows",
        desc: "Where traceability matters, every record keeps its source document, validation history and review decision attached.",
      },
    ],
  },
  work: {
    eyebrow: "Selected work",
    title: "Where document work lands.",
    desc: "Extracted, validated records flow into maintained systems, these build areas from our own portfolio are typical destinations.",
    items: [
      {
        id: "aml",
        category: "AI / Compliance",
        title: "AML & AI Systems",
        description:
          "AI-assisted systems for compliance-heavy processes, combining automation, document handling and observability where appropriate.",
        tags: ["AI", "Compliance", "Automation"],
        href: "/ai-automation",
        linkLabel: "Explore AI automation",
      },
      {
        id: "ai",
        category: "Intelligent Automation",
        title: "AI Automation",
        description:
          "AI agents and intelligent workflows that handle repetitive decisions, documents and responses, with human oversight where needed.",
        tags: ["AI Agents", "Workflows", "Human-in-the-loop"],
        href: "/ai-automation",
        linkLabel: "Explore AI automation",
      },
      {
        id: "workflow",
        category: "Automation",
        title: "Workflow Automation",
        description:
          "Production automation systems built with n8n and APIs that connect business applications and remove manual steps.",
        tags: ["n8n", "APIs", "Automation"],
        href: "/workflow-automation",
        linkLabel: "Explore workflow automation",
      },
    ],
  },
  engagement: {
    eyebrow: "Delivery",
    title: "What the implementation includes.",
    items: [
      "Intake design, where documents enter and how they are tracked",
      "Field mapping, which values matter and where each one goes",
      "Validation rules tuned to your formats and tolerances",
      "Exception routing with full context for the reviewer",
      "Delivery into Odoo, CRM or workflow systems",
      "Handover notes your team can maintain",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Document automation, answered directly.",
    items: [
      {
        q: "What kinds of documents can you automate?",
        a: "Routine business documents with repeatable structure, invoices, forms, RFQs and standard back-office files. If a document type is too irregular to handle reliably, we tell you during mapping.",
      },
      {
        q: "Do you use OCR or AI for extraction?",
        a: "Where appropriate. Extraction is paired with validation rules and human review for exceptions, so automation speeds up the routine without gambling on the ambiguous.",
      },
      {
        q: "What happens to a document that fails validation?",
        a: "It routes to a human reviewer with the source document and the reason attached. Approved or corrected records rejoin the flow, nothing stalls silently.",
      },
      {
        q: "Where does the structured data end up?",
        a: "In the system that handles the next step, typically Odoo, a CRM, or a workflow, with the source document attached for traceability.",
      },
      {
        q: "How do you handle sensitive documents?",
        a: "Intake, access and retention are designed around your requirements: scoped access, source traceability, and review history on compliance-sensitive records.",
      },
    ],
  },
  related: {
    eyebrow: "Keep exploring",
    title: "Related services.",
    linkLabel: "Explore",
    items: [
      {
        title: "AI Automation & Agents",
        desc: "AI agents and intelligent workflows that remove manual work.",
        href: "/ai-automation",
      },
      {
        title: "Workflow Automation",
        desc: "Automate repetitive operations across the tools you already use.",
        href: "/workflow-automation",
      },
      {
        title: "Odoo Solutions",
        desc: "ERP, CRM and business applications tailored to how you operate.",
        href: "/odoo-customization",
      },
    ],
  },
  ctaOrbit: {
    eyebrow: "Ready to automate documents?",
    title: "Turn documents into",
    highlight: "structured business data.",
    desc: "Capture, extract, validate and route documents into the systems that handle the next step.",
    button: "Discuss document automation",
    diagram: {
      center: "Documents",
      centerSub: "To structured data",
      nodes: [
        { t: "Document", s: "Invoice or form" },
        { t: "Extract", s: "Fields and values" },
        { t: "Validate", s: "Rules and checks" },
        { t: "Destination", s: "ERP or CRM" },
      ],
    },
  },
  cta: {
    eyebrow: "Ready when you are",
    title: "Have a",
    highlight: "document-heavy process?",
    desc: "Show us one representative document and where it needs to go. We'll map the workflow from there.",
    button: "Map the workflow",
  },
};

const nl = {
  meta: {
    title: "Data- & documentautomatisering",
    description:
      "Leg documenten en data vast, extraheer wat telt, valideer het en routeer het naar Odoo, CRM en bedrijfsWorkflows, met menselijke controle waar het telt.",
    keywords:
      "documentautomatisering, data-extractie, documentverwerking, documentworkflow, datavalidatie, Odoo-documentautomatisering",
    schemaName: "Data- & documentautomatisering",
    schemaDesc:
      "Document- en data-automatisering: intake, extractie, validatie, normalisatie en routering naar bedrijfssystemen met menselijk toezicht.",
  },
  hero: {
    eyebrow: "Data- & documentautomatisering",
    title: "Maak van documenten",
    highlight: "beslissingen voor uw systemen.",
    description:
      "Leg documenten en data vast, extraheer de informatie die telt, valideer deze en routeer ze naar de systemen voor de volgende stap, met een menselijk controlemoment waar oordeel nodig is.",
    primaryCta: "Automatiseer een documentworkflow",
    secondaryCta: "Bekijk de pijplijn",
  },
  problem: {
    eyebrow: "Waarom documentautomatisering",
    title: "Nuttige informatie hoort niet",
    highlight: "vast te zitten in bestanden.",
    beforeLabel: "ZONDER AUTOMATISERING",
    beforeItems: [
      "Dagelijks dezelfde waarden overtypen uit pdf's en formulieren",
      "Elke afwijkende opmaak handmatig rechttrekken",
      "Documenten wachtend in inboxen en mappen",
      "Eenvoudige gevallen beoordeeld als twijfelgevallen",
    ],
    afterLabel: "MET AUTOMATISERING",
    afterItems: [
      "Waarden één keer geëxtraheerd, systemen direct bijgewerkt",
      "Formaten genormaliseerd tot één schone structuur",
      "Documenten verwerkt zodra ze binnenkomen",
      "Routine stroomt door, mensen beoordelen de uitzonderingen",
    ],
    items: [
      {
        title: "Repetitieve handmatige invoer",
        desc: "Teams typen dagelijks dezelfde waarden over uit pdf's en formulieren naar systemen.",
      },
      {
        title: "Inconsistente formaten",
        desc: "Elke afzender formateert anders, data, totalen, referenties, en iemand moet het rechttrekken.",
      },
      {
        title: "Vertraagde verwerking",
        desc: "Documenten wachten in inboxen en mappen tot iemand eraan toekomt.",
      },
      {
        title: "Routinematige menselijke controle",
        desc: "Eenvoudige gevallen krijgen evenveel aandacht als echt twijfelachtige.",
      },
    ],
  },
  capabilities: {
    eyebrow: "Mogelijkheden",
    title: "Van inbox naar gestructureerd record.",
    items: [
      {
        title: "Documentintake",
        desc: "Eén ingang voor binnenkomende bestanden en formulierdata, e-mailbijlagen, uploads en gedeelde mappen verzameld in één workflow.",
      },
      {
        title: "Informatie-extractie",
        desc: "De velden die ertoe doen, totalen, data, referentienummers, regelitems, uit documenten gehaald als bruikbare waarden.",
      },
      {
        title: "Validatie & regels",
        desc: "Bedrijfsregels controleren elk record: verplichte velden, verwachte formaten, zinnige bereiken. Alles wat twijfelachtig is, wordt gemarkeerd, niet doorgedrukt.",
      },
      {
        title: "Datanormalisatie",
        desc: "Inconsistente formaten worden één schone structuur, zodat vervolgsystemen data ontvangen die ze echt kunnen verwerken.",
      },
      {
        title: "Routering & workflow",
        desc: "Gevalideerde records stromen automatisch naar Odoo, CRM of maatwerkworkflows, met het brondocument bijgevoegd voor traceerbaarheid.",
      },
      {
        title: "Menselijke controle",
        desc: "Uitzonderingen gaan naar een persoon met volledige context. Goedgekeurde of gecorrigeerde records voegen weer in; niets valt stilzwijgend stil.",
      },
    ],
  },
  architecture: {
    eyebrow: "De pijplijn",
    title: "Gecontroleerde automatisering, van begin tot eind.",
    desc: "Documenten reizen van links naar rechts: extractie haalt de waarden eruit, validatie controleert ze, en gestructureerde records landen in Odoo of uw ERP. Alles wat de regels niet kunnen oplossen, valt terug op menselijke controle, met brondocument en reden erbij.",
  },
  diagram: {
    hero: {
      aria: "Documentpijplijn: een document wordt vastgelegd, geëxtraheerd met velden voor naam, datum en bedrag, gevalideerd tegen regels, gestructureerd tot data en afgeleverd aan het bedrijfssysteem",
      stages: [
        { t: "DOCUMENT", s: "ruw bestand" },
        { t: "VASTLEGGING", s: "verzameld" },
        { t: "EXTRACTIE", s: "velden opgehaald" },
        { t: "VALIDATIE", s: "regels, controles" },
        { t: "GESTRUCTUREERDE DATA", s: "schoon record" },
        { t: "BEDRIJFSSYSTEEM", s: "volgende stap" },
      ],
      fields: ["NAAM", "DATUM", "BEDRAG"],
    },
    processing: {
      aria: "Verwerkingsstroom: document naar extractie naar validatie naar structuur naar Odoo of ERP, met een menselijke controletak vanaf validatie",
      document: { t: "DOCUMENT", s: "factuur, formulier" },
      extract: { t: "EXTRACTIE", s: "velden, waarden" },
      validate: { t: "VALIDATIE", s: "regels, controles" },
      structure: { t: "STRUCTUUR", s: "schoon record" },
      destination: { t: "ODOO / ERP", s: "volgend systeem" },
      review: { t: "MENSELIJKE CONTROLE", s: "uitzonderingen" },
      sample: {
        docTitle: "Factuur",
        fields: [
          { k: "Klant", v: "ACME GmbH" },
          { k: "Factuurnr.", v: "INV-1048" },
          { k: "Bedrag", v: "€ 4.280" },
          { k: "Datum", v: "12 sep 2026" },
        ],
        ready: "Klaar voor Odoo",
      },
    },
  },
  process: {
    eyebrow: "Hoe het werkt",
    title: "Vastleggen, extraheren, valideren, toepassen.",
    steps: [
      {
        title: "Vastleggen",
        desc: "Binnenkomende documenten en data komen in één workflow, in welk formaat ze ook arriveren.",
      },
      {
        title: "Extraheren",
        desc: "De velden die uw proces nodig heeft, worden herkend en als gestructureerde waarden opgehaald.",
      },
      {
        title: "Valideren",
        desc: "Regels lopen over elk record; uitzonderingen gaan naar een mens met het volledige beeld erbij.",
      },
      {
        title: "Toepassen",
        desc: "Schone, gestructureerde informatie landt in het systeem voor de volgende stap.",
      },
    ],
  },
  tech: {
    eyebrow: "Technologie",
    title: "Elke fase gebruikt de juiste tool.",
    desc: "De pijplijn is opgebouwd uit intake-, verwerkings- en bestemmingstooling, gegroepeerd per rol zodat verantwoordelijkheden helder blijven.",
    groups: [
      {
        role: "Bronnen",
        items: ["E-mailbijlagen", "Uploads", "Gedeelde mappen", "Formulieren", "Facturen", "Offerteaanvragen"],
      },
      {
        role: "Verwerking",
        items: ["Veldextractie", "Validatieregels", "Formaatnormalisatie", "Duplicaatdetectie"],
      },
      {
        role: "Bestemmingen",
        items: ["Odoo ERP", "CRM-systemen", "n8n-workflows", "Gestructureerde records"],
      },
      {
        role: "Toezicht",
        items: ["Menselijke controlewachtrijen", "Brontraceerbaarheid", "Controlegeschiedenis"],
      },
    ],
  },
  checkpoint: {
    eyebrow: "Menselijk toezicht",
    title: "Automatisering met een menselijk controlemoment.",
    desc: "Niet elke beslissing hoort volledig geautomatiseerd. De pijplijn is zo ontworpen dat routinegevallen direct doorstromen, terwijl alles wat onzeker is, stopt waar een mens kan oordelen.",
    steps: [
      { lead: "Automatisering", text: "extraheert en controleert elk record." },
      { lead: "Validatie", text: "laat schone records door, markeert de rest." },
      { lead: "Uitzondering", text: "draagt het document plus de reden mee." },
      { lead: "Menselijke controle", text: "keurt goed of corrigeert met één actie." },
      { lead: "Verder", text: "het record voegt weer in de stroom." },
    ],
  },
  useCases: {
    eyebrow: "Gebruiksgevallen",
    title: "Documentintensief werk, afgehandeld.",
    items: [
      {
        tag: "Operatie",
        title: "RFQ-verwerking",
        desc: "Binnenkomende offerteaanvragen worden vastgelegd, kerngegevens geëxtraheerd en gestructureerd, en gerouteerd naar de offerteworkflow, onduidelijke aanvragen gemarkeerd voor controle.",
      },
      {
        tag: "Backoffice",
        title: "Documentintake op schaal",
        desc: "Grote volumes routinedocumenten doorlopen dezelfde pijplijn: vastgelegd, gevalideerd en weggeschreven naar het juiste systeem zonder behandeling per bestand.",
      },
      {
        tag: "Financiële operatie",
        title: "Gestructureerde extractie van bedrijfsdata",
        desc: "Totalen, data en regelitems verlaten de pdf en worden velden waarmee uw ERP en rapportage direct werken.",
      },
      {
        tag: "Gereguleerd werk",
        title: "Compliancegerichte documentworkflows",
        desc: "Waar traceerbaarheid telt, houdt elk record brondocument, validatiegeschiedenis en controlebesluit bij zich.",
      },
    ],
  },
  work: {
    eyebrow: "Uitgelicht werk",
    title: "Waar documentwerk landt.",
    desc: "Geëxtraheerde, gevalideerde records stromen naar onderhouden systemen, deze bouwonderdelen uit ons eigen portfolio zijn typische bestemmingen.",
    items: [
      {
        id: "aml",
        category: "AI / Compliance",
        title: "AML & AI-systemen",
        description:
          "AI-ondersteunde systemen voor compliance-intensieve processen, met automatisering, documentafhandeling en observability waar passend.",
        tags: ["AI", "Compliance", "Automatisering"],
        href: "/ai-automation",
        linkLabel: "Bekijk AI-automatisering",
      },
      {
        id: "ai",
        category: "Intelligente automatisering",
        title: "AI-automatisering",
        description:
          "AI-agents en intelligente workflows voor terugkerende beslissingen, documenten en antwoorden, met menselijk toezicht waar nodig.",
        tags: ["AI-agents", "Workflows", "Mens-in-de-lus"],
        href: "/ai-automation",
        linkLabel: "Bekijk AI-automatisering",
      },
      {
        id: "workflow",
        category: "Automatisering",
        title: "Workflowautomatisering",
        description:
          "Productieautomatisering met n8n en API's die bedrijfsapplicaties verbinden en handmatige stappen wegnemen.",
        tags: ["n8n", "API's", "Automatisering"],
        href: "/workflow-automation",
        linkLabel: "Bekijk workflowautomatisering",
      },
    ],
  },
  engagement: {
    eyebrow: "Oplevering",
    title: "Wat de implementatie omvat.",
    items: [
      "Intakeontwerp, waar documenten binnenkomen en hoe ze gevolgd worden",
      "Veldmapping, welke waarden ertoe doen en waar elk heen gaat",
      "Validatieregels afgestemd op uw formaten en toleranties",
      "Uitzonderingsroutering met volledige context voor de beoordelaar",
      "Oplevering naar Odoo-, CRM- of workflowsystemen",
      "Overdrachtsnotities die uw team kan onderhouden",
    ],
  },
  faq: {
    eyebrow: "Vragen",
    title: "Documentautomatisering, direct beantwoord.",
    items: [
      {
        q: "Welke soorten documenten kunt u automatiseren?",
        a: "Routinematige bedrijfsdocumenten met herhaalbare structuur, facturen, formulieren, offerteaanvragen en standaard backofficebestanden. Is een documenttype te onregelmatig voor betrouwbare verwerking, dan melden wij dat tijdens de mapping.",
      },
      {
        q: "Gebruikt u OCR of AI voor extractie?",
        a: "Waar passend. Extractie wordt gecombineerd met validatieregels en menselijke controle voor uitzonderingen, zodat automatisering de routine versnelt zonder te gokken op het twijfelachtige.",
      },
      {
        q: "Wat gebeurt er met een document dat validatie niet haalt?",
        a: "Het gaat naar een menselijke beoordelaar met brondocument en reden erbij. Goedgekeurde of gecorrigeerde records voegen weer in, niets valt stilzwijgend stil.",
      },
      {
        q: "Waar komt de gestructureerde data terecht?",
        a: "In het systeem voor de volgende stap, meestal Odoo, een CRM of een workflow, met het brondocument bijgevoegd voor traceerbaarheid.",
      },
      {
        q: "Hoe gaat u om met gevoelige documenten?",
        a: "Intake, toegang en bewaring worden rond uw eisen ontworpen: afgebakende toegang, brontraceerbaarheid en controlegeschiedenis op compliancegevoelige records.",
      },
    ],
  },
  related: {
    eyebrow: "Blijf ontdekken",
    title: "Gerelateerde diensten.",
    linkLabel: "Bekijk",
    items: [
      {
        title: "AI-automatisering & Agents",
        desc: "AI-agents en intelligente workflows die handmatig werk wegnemen.",
        href: "/ai-automation",
      },
      {
        title: "Workflowautomatisering",
        desc: "Automatiseer terugkerende operatie in de tools die u al gebruikt.",
        href: "/workflow-automation",
      },
      {
        title: "Odoo-oplossingen",
        desc: "ERP, CRM en bedrijfsapplicaties passend bij uw werkwijze.",
        href: "/odoo-customization",
      },
    ],
  },
  ctaOrbit: {
    eyebrow: "Klaar om documenten te automatiseren?",
    title: "Maak van documenten",
    highlight: "gestructureerde bedrijfsdata.",
    desc: "Leg vast, extraheer, valideer en routeer documenten naar de systemen die de volgende stap doen.",
    button: "Bespreek documentautomatisering",
    diagram: {
      center: "Documenten",
      centerSub: "Naar gestructureerde data",
      nodes: [
        { t: "Document", s: "Factuur of formulier" },
        { t: "Extraheren", s: "Velden en waarden" },
        { t: "Valideren", s: "Regels en controles" },
        { t: "Bestemming", s: "ERP of CRM" },
      ],
    },
  },
  cta: {
    eyebrow: "Klaar wanneer u dat bent",
    title: "Heeft u een",
    highlight: "documentintensief proces?",
    desc: "Toon ons één representatief document en waar het heen moet. Wij brengen de workflow van daaruit in kaart.",
    button: "Breng de workflow in kaart",
  },
};

const de = {
  meta: {
    title: "Daten- & Dokumentenautomatisierung",
    description:
      "Dokumente und Daten erfassen, Wichtiges extrahieren, validieren und in Odoo, CRM und GeschäftsWorkflows routen, mit menschlicher Prüfung, wo sie zählt.",
    keywords:
      "Dokumentenautomatisierung, Datenextraktion, Dokumentenverarbeitung, Dokumentenworkflow, Datenvalidierung, Odoo-Dokumentenautomatisierung",
    schemaName: "Daten- & Dokumentenautomatisierung",
    schemaDesc:
      "Dokumenten- und Datenautomatisierung: Intake, Extraktion, Validierung, Normalisierung und Routing in Geschäftssysteme mit menschlicher Aufsicht.",
  },
  hero: {
    eyebrow: "Daten- & Dokumentenautomatisierung",
    title: "Aus Dokumenten werden",
    highlight: "Entscheidungen für Ihre Systeme.",
    description:
      "Dokumente und Daten erfassen, wichtige Informationen extrahieren, validieren und in die Systeme für den nächsten Schritt routen, mit menschlichem Checkpoint, wo Urteil gefragt ist.",
    primaryCta: "Dokumentenworkflow automatisieren",
    secondaryCta: "Pipeline ansehen",
  },
  problem: {
    eyebrow: "Warum Dokumentenautomatisierung",
    title: "Nützliche Information sollte nicht",
    highlight: "in Dateien gefangen bleiben.",
    beforeLabel: "OHNE AUTOMATISIERUNG",
    beforeItems: [
      "Gleiche Werte täglich neu aus PDFs und Formularen abtippen",
      "Jedes fremde Format von Hand geradeziehen",
      "Dokumente wartend in Posteingängen und Ordnern",
      "Einfache Fälle geprüft wie Zweifelsfälle",
    ],
    afterLabel: "MIT AUTOMATISIERUNG",
    afterItems: [
      "Werte einmal extrahiert, Systeme direkt aktualisiert",
      "Formate normalisiert zu einer sauberen Struktur",
      "Dokumente verarbeitet, sobald sie eintreffen",
      "Routine läuft durch, Menschen prüfen Ausnahmen",
    ],
    items: [
      {
        title: "Repetitive manuelle Eingabe",
        desc: "Teams tippen täglich gleiche Werte aus PDFs und Formularen in Systeme.",
      },
      {
        title: "Inkonsistente Formate",
        desc: "Jeder Absender formatiert anders, Daten, Summen, Referenzen, und jemand muss es geradeziehen.",
      },
      {
        title: "Verzögerte Verarbeitung",
        desc: "Dokumente warten in Posteingängen und Ordnern, bis jemand dazu kommt.",
      },
      {
        title: "Menschliche Routineprüfung",
        desc: "Einfache Fälle erhalten so viel Aufmerksamkeit wie echte Zweifelsfälle.",
      },
    ],
  },
  capabilities: {
    eyebrow: "Leistungen",
    title: "Vom Posteingang zum strukturierten Datensatz.",
    items: [
      {
        title: "Dokumenten-Intake",
        desc: "Ein Einstieg für eingehende Dateien und Formulardaten, E-Mail-Anhänge, Uploads und geteilte Ordner gesammelt in einem Workflow.",
      },
      {
        title: "Informationsextraktion",
        desc: "Die Felder, die zählen, Summen, Daten, Referenznummern, Positionen, aus Dokumenten geholt als nutzbare Werte.",
      },
      {
        title: "Validierung & Regeln",
        desc: "Geschäftsregeln prüfen jeden Datensatz: Pflichtfelder, erwartete Formate, sinnvolle Bereiche. Zweifelhaftes wird markiert, nicht durchgedrückt.",
      },
      {
        title: "Datennormalisierung",
        desc: "Inkonsistente Formate werden eine saubere Struktur, sodass Folgesysteme Daten erhalten, die sie wirklich verarbeiten können.",
      },
      {
        title: "Routing & Workflow",
        desc: "Validierte Datensätze fließen automatisch nach Odoo, CRM oder Custom-Workflows, mit Quelldokument im Anhang für Nachvollziehbarkeit.",
      },
      {
        title: "Menschliche Prüfung",
        desc: "Ausnahmen gehen an eine Person mit vollem Kontext. Freigegebene oder korrigierte Datensätze reihen sich wieder ein; nichts bleibt lautlos stehen.",
      },
    ],
  },
  architecture: {
    eyebrow: "Die Pipeline",
    title: "Kontrollierte Automatisierung, durchgehend.",
    desc: "Dokumente reisen von links nach rechts: Extraktion holt die Werte heraus, Validierung prüft sie, und strukturierte Datensätze landen in Odoo oder Ihrem ERP. Was die Regeln nicht lösen, fällt an menschliche Prüfung, mit Quelldokument und Grund im Anhang.",
  },
  diagram: {
    hero: {
      aria: "Dokumentenpipeline: Ein Dokument wird erfasst, extrahiert mit Feldern für Name, Datum und Betrag, gegen Regeln validiert, zu Daten strukturiert und an das Geschäftssystem geliefert",
      stages: [
        { t: "DOKUMENT", s: "rohe Datei" },
        { t: "ERFASSUNG", s: "gesammelt" },
        { t: "EXTRAKTION", s: "Felder geholt" },
        { t: "VALIDIERUNG", s: "Regeln, Prüfungen" },
        { t: "STRUKTURIERTE DATEN", s: "sauberer Datensatz" },
        { t: "GESCHÄFTSSYSTEM", s: "nächster Schritt" },
      ],
      fields: ["NAME", "DATUM", "BETRAG"],
    },
    processing: {
      aria: "Verarbeitungsfluss: Dokument zu Extraktion zu Validierung zu Struktur zu Odoo oder ERP, mit menschlichem Prüfungszweig ab Validierung",
      document: { t: "DOKUMENT", s: "Rechnung, Formular" },
      extract: { t: "EXTRAKTION", s: "Felder, Werte" },
      validate: { t: "VALIDIERUNG", s: "Regeln, Prüfungen" },
      structure: { t: "STRUKTUR", s: "sauberer Datensatz" },
      destination: { t: "ODOO / ERP", s: "nächstes System" },
      review: { t: "MENSCHLICHE PRÜFUNG", s: "Ausnahmen" },
      sample: {
        docTitle: "Rechnung",
        fields: [
          { k: "Kunde", v: "ACME GmbH" },
          { k: "Rechnungsnr.", v: "INV-1048" },
          { k: "Betrag", v: "4.280 €" },
          { k: "Datum", v: "12. Sep 2026" },
        ],
        ready: "Bereit für Odoo",
      },
    },
  },
  process: {
    eyebrow: "So funktioniert es",
    title: "Erfassen, extrahieren, validieren, anwenden.",
    steps: [
      {
        title: "Erfassen",
        desc: "Eingehende Dokumente und Daten kommen in einen Workflow, in welchem Format sie auch eintreffen.",
      },
      {
        title: "Extrahieren",
        desc: "Die Felder, die Ihr Prozess braucht, werden erkannt und als strukturierte Werte geholt.",
      },
      {
        title: "Validieren",
        desc: "Regeln laufen über jeden Datensatz; Ausnahmen gehen an einen Menschen mit vollständigem Bild.",
      },
      {
        title: "Anwenden",
        desc: "Saubere, strukturierte Information landet im System für den nächsten Schritt.",
      },
    ],
  },
  tech: {
    eyebrow: "Technologie",
    title: "Jede Stufe nutzt das richtige Werkzeug.",
    desc: "Die Pipeline baut aus Intake-, Verarbeitungs- und Ziel-Tooling, gruppiert per Rolle, damit Verantwortungen klar bleiben.",
    groups: [
      {
        role: "Quellen",
        items: ["E-Mail-Anhänge", "Uploads", "Geteilte Ordner", "Formulare", "Rechnungen", "Angebotsanfragen"],
      },
      {
        role: "Verarbeitung",
        items: ["Feldextraktion", "Validierungsregeln", "Formatnormalisierung", "Duplikaterkennung"],
      },
      {
        role: "Ziele",
        items: ["Odoo ERP", "CRM-Systeme", "n8n-Workflows", "Strukturierte Datensätze"],
      },
      {
        role: "Aufsicht",
        items: ["Menschliche Prüflisten", "Quellennachweis", "Prüfverlauf"],
      },
    ],
  },
  checkpoint: {
    eyebrow: "Menschliche Aufsicht",
    title: "Automatisierung mit menschlichem Checkpoint.",
    desc: "Nicht jede Entscheidung sollte voll automatisiert sein. Die Pipeline ist so gebaut, dass Routinefälle direkt durchlaufen, während Unsicheres dort stoppt, wo ein Mensch urteilen kann.",
    steps: [
      { lead: "Automatisierung", text: "extrahiert und prüft jeden Datensatz." },
      { lead: "Validierung", text: "lässt saubere Datensätze durch, markiert den Rest." },
      { lead: "Ausnahme", text: "trägt Dokument plus Grund mit." },
      { lead: "Menschliche Prüfung", text: "gibt frei oder korrigiert mit einer Aktion." },
      { lead: "Weiter", text: "der Datensatz reiht sich wieder in den Fluss ein." },
    ],
  },
  useCases: {
    eyebrow: "Anwendungsfälle",
    title: "Dokumentenlastige Arbeit, erledigt.",
    items: [
      {
        tag: "Betrieb",
        title: "RFQ-Verarbeitung",
        desc: "Eingehende Angebotsanfragen werden erfasst, Kerndaten extrahiert und strukturiert, dann in den Angebots-Workflow geroutet, unklare Anfragen markiert für Prüfung.",
      },
      {
        tag: "Backoffice",
        title: "Dokumenten-Intake im Maßstab",
        desc: "Hohe Volumina an Routinedokumenten laufen durch dieselbe Pipeline: erfasst, validiert und ins richtige System gebucht ohne Behandlung pro Datei.",
      },
      {
        tag: "Finanzbetrieb",
        title: "Strukturierte Geschäftsdaten-Extraktion",
        desc: "Summen, Daten und Positionen verlassen das PDF und werden Felder, mit denen Ihr ERP und Reporting direkt arbeiten.",
      },
      {
        tag: "Regulierte Arbeit",
        title: "Compliance-orientierte DokumentenWorkflows",
        desc: "Wo Nachvollziehbarkeit zählt, behält jeder Datensatz Quelldokument, Validierungsverlauf und Prüfentscheidung bei sich.",
      },
    ],
  },
  work: {
    eyebrow: "Ausgewählte Arbeit",
    title: "Wo Dokumentenarbeit landet.",
    desc: "Extrahierte, validierte Datensätze fließen in gepflegte Systeme, diese Baubereiche aus unserem eigenen Portfolio sind typische Ziele.",
    items: [
      {
        id: "aml",
        category: "KI / Compliance",
        title: "AML- & KI-Systeme",
        description:
          "KI-gestützte Systeme für compliance-intensive Prozesse mit Automatisierung, Dokumentenhandling und Observability wo passend.",
        tags: ["KI", "Compliance", "Automatisierung"],
        href: "/ai-automation",
        linkLabel: "KI-Automatisierung entdecken",
      },
      {
        id: "ai",
        category: "Intelligente Automatisierung",
        title: "KI-Automatisierung",
        description:
          "KI-Agenten und intelligente Workflows für wiederkehrende Entscheidungen, Dokumente und Antworten, mit menschlicher Aufsicht wo nötig.",
        tags: ["KI-Agenten", "Workflows", "Mensch-in-der-Schleife"],
        href: "/ai-automation",
        linkLabel: "KI-Automatisierung entdecken",
      },
      {
        id: "workflow",
        category: "Automatisierung",
        title: "Workflow-Automatisierung",
        description:
          "Produktionsautomatisierung mit n8n und APIs, die Geschäftsanwendungen verbindet und manuelle Schritte entfernt.",
        tags: ["n8n", "APIs", "Automatisierung"],
        href: "/workflow-automation",
        linkLabel: "Workflow-Automatisierung entdecken",
      },
    ],
  },
  engagement: {
    eyebrow: "Lieferumfang",
    title: "Was die Implementierung enthält.",
    items: [
      "Intake-Design, wo Dokumente eingehen und wie sie verfolgt werden",
      "Feldmapping, welche Werte zählen und wohin jedes geht",
      "Validierungsregeln abgestimmt auf Ihre Formate und Toleranzen",
      "Ausnahme-Routing mit vollem Kontext für Prüfer",
      "Übergabe an Odoo-, CRM- oder Workflow-Systeme",
      "Übergabenotizen, die Ihr Team pflegen kann",
    ],
  },
  faq: {
    eyebrow: "Fragen",
    title: "Dokumentenautomatisierung, direkt beantwortet.",
    items: [
      {
        q: "Welche Dokumentarten können Sie automatisieren?",
        a: "Routinemäßige Geschäftsunterlagen mit wiederholbarer Struktur, Rechnungen, Formulare, RFQs und Standard-Backoffice-Dateien. Ist ein Dokumenttyp zu unregelmäßig für verlässliche Verarbeitung, sagen wir es beim Mapping.",
      },
      {
        q: "Nutzen Sie OCR oder KI für Extraktion?",
        a: "Wo passend. Extraktion paart sich mit Validierungsregeln und menschlicher Prüfung für Ausnahmen, sodass Automatisierung Routine beschleunigt ohne über Zweideutiges zu wetten.",
      },
      {
        q: "Was passiert mit einem Dokument, das Validierung nicht besteht?",
        a: "Es geht an menschliche Prüfung mit Quelldokument und Grund im Anhang. Freigegebene oder korrigierte Datensätze reihen sich wieder ein, nichts bleibt lautlos stehen.",
      },
      {
        q: "Wo landen die strukturierten Daten?",
        a: "Im System für den nächsten Schritt, typisch Odoo, ein CRM oder ein Workflow, mit Quelldokument im Anhang für Nachvollziehbarkeit.",
      },
      {
        q: "Wie behandeln Sie sensible Dokumente?",
        a: "Intake, Zugriff und Aufbewahrung richten sich nach Ihren Vorgaben: abgegrenzter Zugriff, Quellennachweis und Prüfverlauf bei compliance-sensiblen Datensätzen.",
      },
    ],
  },
  related: {
    eyebrow: "Weiter entdecken",
    title: "Verwandte Leistungen.",
    linkLabel: "Entdecken",
    items: [
      {
        title: "KI-Automatisierung & Agenten",
        desc: "KI-Agenten und intelligente Workflows, die Handarbeit abnehmen.",
        href: "/ai-automation",
      },
      {
        title: "Workflow-Automatisierung",
        desc: "Wiederkehrende Operationen in Ihren bestehenden Tools automatisieren.",
        href: "/workflow-automation",
      },
      {
        title: "Odoo-Lösungen",
        desc: "ERP, CRM und Geschäftsanwendungen passend zu Ihrer Arbeitsweise.",
        href: "/odoo-customization",
      },
    ],
  },
  ctaOrbit: {
    eyebrow: "Bereit, Dokumente zu automatisieren?",
    title: "Machen Sie Dokumente zu",
    highlight: "strukturierten Geschäftsdaten.",
    desc: "Erfassen, extrahieren, validieren und routen Sie Dokumente in die Systeme, die den nächsten Schritt übernehmen.",
    button: "Dokumentenautomatisierung besprechen",
    diagram: {
      center: "Dokumente",
      centerSub: "Zu strukturierten Daten",
      nodes: [
        { t: "Dokument", s: "Rechnung oder Formular" },
        { t: "Extrahieren", s: "Felder und Werte" },
        { t: "Validieren", s: "Regeln und Prüfungen" },
        { t: "Ziel", s: "ERP oder CRM" },
      ],
    },
  },
  cta: {
    eyebrow: "Bereit, wenn Sie es sind",
    title: "Haben Sie einen",
    highlight: "dokumentenlastigen Prozess?",
    desc: "Zeigen Sie uns ein repräsentatives Dokument und wohin es muss. Wir mappen den Workflow von dort.",
    button: "Workflow mappen",
  },
};

export const dataContent = { en, nl, de };
