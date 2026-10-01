/**
 * Centralized service + navigation + shared translations (EN / NL / DE).
 *
 * - Per-service detail content lives in ./services/<id>.js and is
 *   consumed via t("serviceDetail.<id>.*"). Icons stay in components.
 * - Mega navigation strings live here under `megaMenu`.
 * - Shared UI strings (cookie consent, privacy consent, common labels,
 *   legal/privacy page) live here so no new keys are scattered.
 *
 * Merged top-level in LanguageContext as `serviceDetail`, `megaMenu`,
 * `cookie`, `privacy`, `common`, `legal`. None of these collide with
 * existing top-level keys in translations.js.
 */

import { odooContent } from "./services/odoo";
import { workflowContent } from "./services/workflow";
import { aiContent } from "./services/ai";
import { integrationContent } from "./services/integration";
import { dataContent } from "./services/data";
import { devopsContent } from "./services/devops";
import { consultingContent } from "./services/consulting";

export const serviceContent = {
  en: {
    odoo: odooContent.en,
    workflow: workflowContent.en,
    ai: aiContent.en,
    integration: integrationContent.en,
    data: dataContent.en,
    devops: devopsContent.en,
    consulting: consultingContent.en,
  },
  nl: {
    odoo: odooContent.nl,
    workflow: workflowContent.nl,
    ai: aiContent.nl,
    integration: integrationContent.nl,
    data: dataContent.nl,
    devops: devopsContent.nl,
    consulting: consultingContent.nl,
  },
  de: {
    odoo: odooContent.de,
    workflow: workflowContent.de,
    ai: aiContent.de,
    integration: integrationContent.de,
    data: dataContent.de,
    devops: devopsContent.de,
    consulting: consultingContent.de,
  },
};

/* ── MEGA NAVIGATION ── */

const megaMenuEn = {
  viewService: "View service",
  exploreAll: "Explore all services",
  bookCall: "Book a Free Call",
  services: {
    odoo: {
      title: "Odoo ERP",
      tagline: "ERP, CRM and business applications tailored to how you operate.",
    },
    workflow: {
      title: "Workflow Automation",
      tagline: "Automate repetitive operations across the tools you already use.",
    },
    ai: {
      title: "AI Automation",
      tagline: "AI agents and intelligent workflows that remove manual work.",
    },
    integration: {
      title: "System Integrations",
      tagline: "Connect CRM, ERP, databases and internal systems into one reliable ecosystem.",
    },
    data: {
      title: "Data & Document Automation",
      tagline: "Process, route and sync documents and data automatically.",
    },
    aiops: {
      title: "AIOps Monitoring",
      tagline: "Monitor, detect anomalies and respond before failures become operational problems.",
    },
    consulting: {
      title: "AI Consulting",
      tagline: "Identify high-impact AI opportunities and build a roadmap around measurable business value.",
    },
  },
  preview: {
    odoo: {
      label: "Odoo ERP hub diagram",
      sats: ["CRM", "Sales", "Inventory", "Invoicing", "HR / Payroll", "Accounting"],
      center: "ODOO ERP",
      centerSub: "ERP core",
    },
    workflow: {
      label: "Workflow automation pipeline diagram",
      trigger: { t: "Trigger", s: "starts the run" },
      process: { t: "Process", s: "runs the steps" },
      condition: { t: "Condition", s: "checks the rules" },
      action: { t: "Action", s: "updates systems" },
      review: { t: "Review", s: "handles exceptions" },
    },
    ai: {
      label: "AI agent workflow diagram",
      request: { t: "Request", s: "new input" },
      agent: { t: "AI Agent", s: "applies business rules" },
      reasoning: "Reasoning",
      response: { t: "Response", s: "ready to send" },
      tools: { t: "Tools", s: "connected APIs" },
    },
    integration: {
      label: "System integration architecture diagram",
      sats: ["CRM", "ERP", "Database", "External System"],
      center: "API Layer",
      centerSub: "webhooks",
    },
    data: {
      label: "Document automation pipeline diagram",
      document: { t: "Document", s: "invoice and form" },
      extraction: { t: "Extraction", s: "OCR and AI" },
      validation: { t: "Validation", s: "rules and checks" },
      structured: "Structured Data",
      destination: { t: "Destination", s: "ERP and CRM" },
    },
    devops: {
      label: "AIOps monitoring loop diagram",
      deploy: { t: "Deploy", s: "release" },
      runtime: { t: "Runtime", s: "production" },
      monitor: { t: "Monitor", s: "logs and metrics" },
      alert: "Alert",
      resolve: { t: "Resolve", s: "fix and improve" },
    },
    aiops: {
      label: "AIOps monitoring loop diagram",
      deploy: { t: "Deploy", s: "release" },
      runtime: { t: "Runtime", s: "production" },
      monitor: { t: "Monitor", s: "logs and metrics" },
      alert: "Alert",
      resolve: { t: "Resolve", s: "fix and improve" },
    },
    consulting: {
      label: "AI consulting roadmap diagram",
      request: { t: "Assess", s: "current operation" },
      agent: { t: "Opportunities", s: "ranked by value" },
      reasoning: "Roadmap",
      response: { t: "Implementation", s: "phased delivery" },
      tools: { t: "Governance", s: "guardrails and metrics" },
    },
  },
};

const megaMenuNl = {
  viewService: "Bekijk dienst",
  exploreAll: "Bekijk alle diensten",
  bookCall: "Plan een gratis gesprek",
  services: {
    odoo: {
      title: "Odoo ERP",
      tagline: "ERP, CRM en bedrijfsapplicaties passend bij uw werkwijze.",
    },
    workflow: {
      title: "Workflowautomatisering",
      tagline: "Automatiseer terugkerende operatie in uw bestaande tools.",
    },
    ai: {
      title: "AI-automatisering",
      tagline: "AI-agents en intelligente workflows die handmatig werk wegnemen.",
    },
    integration: {
      title: "Systeemintegraties",
      tagline: "Verbind CRM, ERP, databases en interne systemen in één betrouwbaar ecosysteem.",
    },
    data: {
      title: "Data- & documentautomatisering",
      tagline: "Verwerk, routeer en synchroniseer documenten en data automatisch.",
    },
    aiops: {
      title: "AIOps-monitoring",
      tagline: "Monitor, detecteer afwijkingen en reageer voordat storingen operationele problemen worden.",
    },
    consulting: {
      title: "AI-consulting",
      tagline: "Identificeer AI-kansen met hoge impact en bouw een roadmap rond meetbare bedrijfswaarde.",
    },
  },
  preview: {
    odoo: {
      label: "Odoo ERP-hubdiagram",
      sats: ["CRM", "Verkoop", "Voorraad", "Facturatie", "HR / Payroll", "Boekhouding"],
      center: "ODOO ERP",
      centerSub: "ERP-kern",
    },
    workflow: {
      label: "Workflowautomatiseringsschema",
      trigger: { t: "Trigger", s: "start de run" },
      process: { t: "Proces", s: "voert de stappen uit" },
      condition: { t: "Conditie", s: "controleert de regels" },
      action: { t: "Actie", s: "werkt systemen bij" },
      review: { t: "Beoordeling", s: "handelt uitzonderingen af" },
    },
    ai: {
      label: "AI-agent workflowschema",
      request: { t: "Verzoek", s: "nieuwe invoer" },
      agent: { t: "AI-agent", s: "past bedrijfsregels toe" },
      reasoning: "Redenering",
      response: { t: "Antwoord", s: "klaar om te versturen" },
      tools: { t: "Tools", s: "gekoppelde API's" },
    },
    integration: {
      label: "Systeemkoppelingsdiagram",
      sats: ["CRM", "ERP", "Database", "Extern systeem"],
      center: "API-laag",
      centerSub: "webhooks",
    },
    data: {
      label: "Documentautomatiseringsschema",
      document: { t: "Document", s: "factuur en formulier" },
      extraction: { t: "Extractie", s: "OCR en AI" },
      validation: { t: "Validatie", s: "regels en controles" },
      structured: "Gestructureerde data",
      destination: { t: "Bestemming", s: "ERP en CRM" },
    },
    devops: {
      label: "AIOps-monitoringlusdiagram",
      deploy: { t: "Uitrol", s: "release" },
      runtime: { t: "Runtime", s: "productie" },
      monitor: { t: "Monitor", s: "logs en metrieken" },
      alert: "Alarm",
      resolve: { t: "Oplossen", s: "herstellen en verbeteren" },
    },
    aiops: {
      label: "AIOps-monitoringlusdiagram",
      deploy: { t: "Uitrol", s: "release" },
      runtime: { t: "Runtime", s: "productie" },
      monitor: { t: "Monitor", s: "logs en metrieken" },
      alert: "Alarm",
      resolve: { t: "Oplossen", s: "herstellen en verbeteren" },
    },
    consulting: {
      label: "AI-consultingroadmap",
      request: { t: "Beoordelen", s: "huidige operatie" },
      agent: { t: "Kansen", s: "gerangschikt op waarde" },
      reasoning: "Roadmap",
      response: { t: "Implementatie", s: "gefaseerde oplevering" },
      tools: { t: "Governance", s: "waarborgen en metrieken" },
    },
  },
};

const megaMenuDe = {
  viewService: "Leistung ansehen",
  exploreAll: "Alle Leistungen entdecken",
  bookCall: "Kostenloses Gespräch buchen",
  services: {
    odoo: {
      title: "Odoo ERP",
      tagline: "ERP, CRM und Geschäftsanwendungen passend zu Ihrer Arbeitsweise.",
    },
    workflow: {
      title: "Workflow-Automatisierung",
      tagline: "Wiederkehrende Operationen in Ihren bestehenden Tools automatisieren.",
    },
    ai: {
      title: "KI-Automatisierung",
      tagline: "KI-Agenten und intelligente Workflows, die Handarbeit abnehmen.",
    },
    integration: {
      title: "Systemintegrationen",
      tagline: "CRM, ERP, Datenbanken und interne Systeme in einem zuverlässigen Ökosystem verbinden.",
    },
    data: {
      title: "Daten- & Dokumentenautomatisierung",
      tagline: "Dokumente und Daten automatisch verarbeiten, routen und syncen.",
    },
    aiops: {
      title: "AIOps-Monitoring",
      tagline: "Überwachen, Anomalien erkennen und reagieren, bevor Ausfälle zu Betriebsproblemen werden.",
    },
    consulting: {
      title: "KI-Beratung",
      tagline: "KI-Chancen mit hoher Wirkung identifizieren und eine Roadmap um messbaren Geschäftswert bauen.",
    },
  },
  preview: {
    odoo: {
      label: "Odoo-ERP-Hubdiagramm",
      sats: ["CRM", "Vertrieb", "Lager", "Rechnung", "HR / Payroll", "Buchhaltung"],
      center: "ODOO ERP",
      centerSub: "ERP-Kern",
    },
    workflow: {
      label: "Workflow-Pipelinediagramm",
      trigger: { t: "Trigger", s: "startet den Lauf" },
      process: { t: "Prozess", s: "führt die Schritte aus" },
      condition: { t: "Bedingung", s: "prüft die Regeln" },
      action: { t: "Aktion", s: "aktualisiert Systeme" },
      review: { t: "Prüfung", s: "behandelt Ausnahmen" },
    },
    ai: {
      label: "KI-Agenten-Diagramm",
      request: { t: "Anfrage", s: "neue Eingabe" },
      agent: { t: "KI-Agent", s: "wendet Geschäftsregeln an" },
      reasoning: "Schlussfolgerung",
      response: { t: "Antwort", s: "versandbereit" },
      tools: { t: "Tools", s: "verbundene APIs" },
    },
    integration: {
      label: "Systemintegrationsdiagramm",
      sats: ["CRM", "ERP", "Datenbank", "Externes System"],
      center: "API-Schicht",
      centerSub: "Webhooks",
    },
    data: {
      label: "Dokumenten-Pipelinediagramm",
      document: { t: "Dokument", s: "Rechnung und Formular" },
      extraction: { t: "Extraktion", s: "OCR und KI" },
      validation: { t: "Validierung", s: "Regeln und Prüfungen" },
      structured: "Strukturierte Daten",
      destination: { t: "Ziel", s: "ERP und CRM" },
    },
    devops: {
      label: "AIOps-Beobachtungsschleife",
      deploy: { t: "Deployment", s: "Release" },
      runtime: { t: "Laufzeit", s: "Produktion" },
      monitor: { t: "Monitor", s: "Logs und Metriken" },
      alert: "Alarm",
      resolve: { t: "Beheben", s: "fixen und verbessern" },
    },
    aiops: {
      label: "AIOps-Beobachtungsschleife",
      deploy: { t: "Deployment", s: "Release" },
      runtime: { t: "Laufzeit", s: "Produktion" },
      monitor: { t: "Monitor", s: "Logs und Metriken" },
      alert: "Alarm",
      resolve: { t: "Beheben", s: "fixen und verbessern" },
    },
    consulting: {
      label: "KI-Beratungs-Roadmap",
      request: { t: "Bewerten", s: "aktueller Betrieb" },
      agent: { t: "Chancen", s: "nach Wert gereiht" },
      reasoning: "Roadmap",
      response: { t: "Umsetzung", s: "phasenweise Lieferung" },
      tools: { t: "Governance", s: "Leitplanken und Metriken" },
    },
  },
};

export const megaMenuContent = { en: megaMenuEn, nl: megaMenuNl, de: megaMenuDe };

/* ── N8N WORKFLOW PAGE (/n8n-development) ── */

const n8nPageEn = {
  metaTitle: "n8n Workflow Development",
  metaDesc:
    "Production n8n workflows with APIs, webhooks and orchestration: self-hosted automation with full visibility into every run.",
  badge: "N8N WORKFLOW DEVELOPMENT",
  headingLine1: "Workflows built",
  headingAccent: "in n8n,",
  headingLine3: "run anywhere.",
  description:
    "Self-hosted n8n automation with APIs, webhooks and process orchestration: every run visible, every failure handled.",
  tags: ["Self-hosted", "API-first", "Visible runs", "No per-step fees"],
  processSmallTitle: "HOW WE BUILD",
  processHeading: "From trigger to traceable run.",
  processSubtitle: "Five stages take a workflow from event to monitored production.",
  steps: [
    {
      title: "Trigger",
      description: "Events, schedules or webhooks start the run with full context attached.",
      outcome: "Started runs",
    },
    {
      title: "Enrich",
      description: "Records are fetched, matched and prepared before any action runs.",
      outcome: "Clean input",
    },
    {
      title: "Decide",
      description: "Conditions and approvals route each case down the right branch.",
      outcome: "Right branch",
    },
    {
      title: "Act",
      description: "APIs, messages and updates execute across connected systems.",
      outcome: "Done work",
    },
    {
      title: "Trace",
      description: "Every run leaves logs, timing and status your team can inspect.",
      outcome: "Full trace",
    },
  ],
  outcomeLabel: "Outcome",
  ctaMini: "READY WHEN YOU ARE",
  ctaHeading: "Automate with n8n.",
  ctaText: "Tell us the repetitive process. We build the workflow around it.",
  ctaButton: "Discuss n8n",
};

const n8nPageNl = {
  metaTitle: "n8n-workflowontwikkeling",
  metaDesc:
    "Productie-n8n-workflows met API's, webhooks en orkestratie: zelfgehoste automatisering met volledig inzicht in elke run.",
  badge: "N8N-WORKFLOWONTWIKKELING",
  headingLine1: "Workflows gebouwd",
  headingAccent: "in n8n,",
  headingLine3: "overal draaiend.",
  description:
    "Zelfgehoste n8n-automatisering met API's, webhooks en procesorkestratie: elke run zichtbaar, elke fout afgehandeld.",
  tags: ["Zelfgehost", "API-eerst", "Zichtbare runs", "Geen kosten per stap"],
  processSmallTitle: "ZO BOUWEN WIJ",
  processHeading: "Van trigger tot traceerbare run.",
  processSubtitle: "Vijf fasen brengen een workflow van event naar gemonitorde productie.",
  steps: [
    {
      title: "Trigger",
      description: "Events, planning of webhooks starten de run met volledige context.",
      outcome: "Gestarte runs",
    },
    {
      title: "Verrijken",
      description: "Records worden opgehaald en voorbereid vóór elke actie.",
      outcome: "Schone invoer",
    },
    {
      title: "Beslissen",
      description: "Condities en goedkeuringen routeren elke zaak naar de juiste tak.",
      outcome: "Juiste tak",
    },
    {
      title: "Handelen",
      description: "API's, berichten en updates in verbonden systemen.",
      outcome: "Gedaan werk",
    },
    {
      title: "Traceren",
      description: "Elke run laat logs, timing en status achter voor uw team.",
      outcome: "Volledige trace",
    },
  ],
  outcomeLabel: "Resultaat",
  ctaMini: "KLAAR WANNEER U DAT BENT",
  ctaHeading: "Automatiseer met n8n.",
  ctaText: "Vertel het terugkerende proces. Wij bouwen de workflow eromheen.",
  ctaButton: "Bespreek n8n",
};

const n8nPageDe = {
  metaTitle: "n8n-Workflow-Entwicklung",
  metaDesc:
    "Produktions-n8n-Workflows mit APIs, Webhooks und Orchestrierung: selbstgehostete Automatisierung mit vollem Einblick in jeden Lauf.",
  badge: "N8N-WORKFLOW-ENTWICKLUNG",
  headingLine1: "Workflows gebaut",
  headingAccent: "in n8n,",
  headingLine3: "überall lauffähig.",
  description:
    "Selbstgehostete n8n-Automatisierung mit APIs, Webhooks und Prozessorchestrierung: jeder Lauf sichtbar, jeder Fehler behandelt.",
  tags: ["Selbstgehostet", "API-first", "Sichtbare Läufe", "Keine Pro-Schritt-Gebühren"],
  processSmallTitle: "SO BAUEN WIR",
  processHeading: "Vom Trigger zum nachvollziehbaren Lauf.",
  processSubtitle: "Fünf Stufen bringen einen Workflow vom Event in den monitoreden Betrieb.",
  steps: [
    {
      title: "Trigger",
      description: "Events, Pläne oder Webhooks starten den Lauf mit vollem Kontext.",
      outcome: "Gestartete Läufe",
    },
    {
      title: "Anreichern",
      description: "Datensätze werden abgerufen und vorbereitet, bevor Aktionen laufen.",
      outcome: "Saubere Eingabe",
    },
    {
      title: "Entscheiden",
      description: "Bedingungen und Freigaben routen jeden Fall in den richtigen Zweig.",
      outcome: "Richtiger Zweig",
    },
    {
      title: "Handeln",
      description: "APIs, Nachrichten und Updates in verbundenen Systemen.",
      outcome: "Erledigte Arbeit",
    },
    {
      title: "Nachverfolgen",
      description: "Jeder Lauf hinterlässt Logs, Zeiten und Status für Ihr Team.",
      outcome: "Volle Nachverfolgung",
    },
  ],
  outcomeLabel: "Ergebnis",
  ctaMini: "BEREIT, WENN SIE ES SIND",
  ctaHeading: "Mit n8n automatisieren.",
  ctaText: "Schildern Sie den wiederkehrenden Prozess. Wir bauen den Workflow darum.",
  ctaButton: "n8n besprechen",
};

export const n8nPageContent = { en: n8nPageEn, nl: n8nPageNl, de: n8nPageDe };

/* ── SHARED UI: cookie consent, privacy consent, common labels, legal ── */

const sharedEn = {
  cookie: {
    title: "We value your privacy",
    text: "We use technically necessary cookies to run this site. Optional statistics cookies are set only with your consent.",
    accept: "Accept all",
    decline: "Necessary only",
    settings: "Cookie settings",
    save: "Save selection",
    necessary: "Necessary",
    necessaryDesc: "Required for security, language and theme preferences.",
    stats: "Statistics",
    statsDesc: "Anonymous usage measurement. Off unless you accept.",
    note: "You can change your choice anytime via Cookie settings in the footer.",
    updated: "Choice saved.",
  },
  privacy: {
    consentNote: "I agree to the processing of my data as described in the",
    policyLink: "Privacy Policy",
    required: "Please accept the privacy notice to submit the form.",
    version: "2026-01-01",
  },
  common: {
    close: "Close",
    loading: "Loading",
    required: "required",
    demo: {
      processDocument: "Process document",
      reset: "Reset",
    },
  },
  legal: {
    tag: "LEGAL",
    title: "Privacy Policy",
    updated: "Effective date: October 12, 2025. Policy version 2026-01-01.",
    intro:
      "SystemaOps (we, our, us) processes personal data to operate this website and respond to inquiries. We store data inside our own infrastructure and never sell personal data.",
    collectTitle: "Data we collect",
    collectItems: [
      "Contact details you submit: name, email, phone, company, message",
      "Application details: background, links, motivation, resume reference",
      "Technical data: pages visited, device and browser type",
      "Consent records: privacy version, timestamp, cookie choice",
    ],
    useTitle: "How we use it",
    useItems: [
      "Respond to contact inquiries and applications",
      "Operate and secure the website",
      "Improve content based on anonymous statistics (only with consent)",
    ],
    retentionTitle: "Retention",
    retentionText:
      "Contact enquiries and job applications are kept for 12 months from submission and then automatically deleted.",
    rightsTitle: "Your rights",
    rightsText:
      "You can request access, correction or deletion of your data at any time via info@systemaops.com.",
    cookieTitle: "Cookies",
    cookieText:
      "Necessary cookies run without consent. Statistics cookies require consent via the cookie banner. Change your choice anytime in the footer.",
    contactCta: "Questions? Contact us.",
  },
};

const sharedNl = {
  cookie: {
    title: "Wij respecteren uw privacy",
    text: "Wij gebruiken technisch noodzakelijke cookies voor deze site. Optionele statistiekcookies alleen met uw toestemming.",
    accept: "Alles accepteren",
    decline: "Alleen noodzakelijk",
    settings: "Cookie-instellingen",
    save: "Keuze opslaan",
    necessary: "Noodzakelijk",
    necessaryDesc: "Vereist voor beveiliging, taal- en themavoorkeur.",
    stats: "Statistieken",
    statsDesc: "Anonieme gebruiksmeting. Uit tenzij u accepteert.",
    note: "Wijzig uw keuze altijd via Cookie-instellingen in de voettekst.",
    updated: "Keuze opgeslagen.",
  },
  privacy: {
    consentNote: "Ik ga akkoord met verwerking van mijn gegevens zoals beschreven in het",
    policyLink: "Privacybeleid",
    required: "Accepteer de privacyverklaring om het formulier te versturen.",
    version: "2026-01-01",
  },
  common: {
    close: "Sluiten",
    loading: "Laden",
    required: "verplicht",
    demo: {
      processDocument: "Verwerk document",
      reset: "Opnieuw",
    },
  },
  legal: {
    tag: "JURIDISCH",
    title: "Privacybeleid",
    updated: "Ingangsdatum: 12 oktober 2025. Beleidversie 2026-01-01.",
    intro:
      "SystemaOps (wij, ons) verwerkt persoonsgegevens om deze website te beheren en op aanvragen te reageren. Data blijft in onze eigen infrastructuur en wordt nooit verkocht.",
    collectTitle: "Gegevens die wij verzamelen",
    collectItems: [
      "Contactgegevens die u instuurt: naam, e-mail, telefoon, bedrijf, bericht",
      "Sollicitatiegegevens: achtergrond, links, motivatie, cv-verwijzing",
      "Technische gegevens: bezochte pagina's, apparaat- en browsertype",
      "Toestemmingsrecords: privacyversie, tijdstempel, cookiekeuze",
    ],
    useTitle: "Hoe wij ze gebruiken",
    useItems: [
      "Reageren op contactaanvragen en sollicitaties",
      "Website beheren en beveiligen",
      "Inhoud verbeteren via anonieme statistieken (alleen met toestemming)",
    ],
    retentionTitle: "Bewaartermijn",
    retentionText:
      "Contactaanvragen en sollicitaties worden 12 maanden na indiening bewaard en daarna automatisch verwijderd.",
    rightsTitle: "Uw rechten",
    rightsText:
      "U kunt altijd inzage, correctie of verwijdering vragen via info@systemaops.com.",
    cookieTitle: "Cookies",
    cookieText:
      "Noodzakelijke cookies werken zonder toestemming. Statistiekcookies vereisen toestemming via de cookiebanner. Wijzig uw keuze altijd in de voettekst.",
    contactCta: "Vragen? Neem contact op.",
  },
};

const sharedDe = {
  cookie: {
    title: "Wir respektieren Ihre Privatsphäre",
    text: "Wir nutzen technisch notwendige Cookies für diese Seite. Optionale Statistik-Cookies nur mit Ihrer Zustimmung.",
    accept: "Alle akzeptieren",
    decline: "Nur notwendig",
    settings: "Cookie-Einstellungen",
    save: "Auswahl speichern",
    necessary: "Notwendig",
    necessaryDesc: "Erforderlich für Sicherheit, Sprach- und Theme-Einstellung.",
    stats: "Statistik",
    statsDesc: "Anonyme Nutzungsmessung. Aus, sofern Sie nicht zustimmen.",
    note: "Ihre Wahl lässt sich jederzeit in der Fußzeile ändern.",
    updated: "Auswahl gespeichert.",
  },
  privacy: {
    consentNote: "Ich stimme der Datenverarbeitung wie beschrieben in der",
    policyLink: "Datenschutzerklärung",
    required: "Bitte den Datenschutzhinweis akzeptieren, um abzusenden.",
    version: "2026-01-01",
  },
  common: {
    close: "Schließen",
    loading: "Lädt",
    required: "Pflichtfeld",
    demo: {
      processDocument: "Dokument verarbeiten",
      reset: "Zurücksetzen",
    },
  },
  legal: {
    tag: "RECHTLICHES",
    title: "Datenschutzerklärung",
    updated: "Stand: 12. Oktober 2025. Richtlinienversion 2026-01-01.",
    intro:
      "SystemaOps (wir, uns) verarbeitet personenbezogene Daten für Betrieb und Anfragen dieser Website. Daten bleiben in unserer eigenen Infrastruktur und werden nie verkauft.",
    collectTitle: "Welche Daten wir erheben",
    collectItems: [
      "Kontaktdaten Ihrer Nachricht: Name, E-Mail, Telefon, Firma, Nachricht",
      "Bewerbungsdaten: Hintergrund, Links, Motivation, Lebenslaufverweis",
      "Technische Daten: besuchte Seiten, Geräte- und Browsertyp",
      "Einwilligungen: Datenschutzversion, Zeitstempel, Cookie-Wahl",
    ],
    useTitle: "Wie wir sie nutzen",
    useItems: [
      "Beantwortung von Kontaktanfragen und Bewerbungen",
      "Betrieb und Absicherung der Website",
      "Verbesserung per anonymer Statistik (nur mit Zustimmung)",
    ],
    retentionTitle: "Speicherdauer",
    retentionText:
      "Kontaktanfragen und Bewerbungen werden 12 Monate ab Eingang gespeichert und dann automatisch gelöscht.",
    rightsTitle: "Ihre Rechte",
    rightsText:
      "Auskunft, Berichtigung oder Löschung jederzeit via info@systemaops.com.",
    cookieTitle: "Cookies",
    cookieText:
      "Notwendige Cookies laufen ohne Zustimmung. Statistik-Cookies brauchen Zustimmung per Banner. Wahl jederzeit in der Fußzeile änderbar.",
    contactCta: "Fragen? Kontakt aufnehmen.",
  },
};

export const sharedContent = { en: sharedEn, nl: sharedNl, de: sharedDe };
