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
      shared: "Shared records",
      modules: [
        { t: "CRM", s: "Leads & Customers" },
        { t: "Sales", s: "Orders & Revenue" },
        { t: "Inventory", s: "Stock & Fulfillment" },
        { t: "Finance", s: "Accounting & Financials" },
        { t: "HR", s: "People & Operations" },
      ],
      diagram: {
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
    },
    workflow: {
      label: "Workflow automation pipeline diagram",
      trigger: { t: "Trigger", s: "An event starts the workflow" },
      automate: { t: "Automate", s: "Tasks run automatically" },
      review: { t: "Review", s: "Human approval when needed" },
      complete: { t: "Complete", s: "Work moves forward" },
      heading: "Move repetitive work forward automatically",
      outcome: "Less manual effort. Clearer, more consistent workflows.",
      decision: { t: "Decision", s: "rules pass?" },
      auto: { t: "Automatic", s: "no approval needed" },
      completed: { t: "Completed", s: "done" },
      approval: { t: "Human Approval", s: "conditional review" },
      approved: { t: "Approved", s: "continue" },
      continueNode: { t: "Continue Process", s: "resume flow" },
      rejected: { t: "Rejected" },
      returnNode: { t: "Return / Exception" },
      diagram: {
        label:
          "Workflow automation: a new enquiry triggers an automated workflow and completes the task",
        trigger: "Trigger",
        triggerSub: "New enquiry",
        automate: "Automate",
        automateSub: "Process workflow",
        complete: "Complete",
        completeSub: "Task completed",
      },
    },
    ai: {
      label: "AI agent workflow diagram",
      request: { t: "Request", s: "new input" },
      context: { t: "Context", s: "relevant data" },
      agent: { t: "AI Agent", s: "applies business rules" },
      reasoning: "Reasoning",
      response: { t: "Response", s: "ready to send" },
      tools: { t: "Tools", s: "connected APIs" },
      validate: { t: "Validate", s: "checks and approval" },
      result: { t: "Result", s: "ready to use" },
      inputs: {
        context: { t: "Context", s: "information" },
        tools: { t: "Tools & Data", s: "approved APIs" },
        rules: { t: "Business Rules", s: "permissions" },
      },
      steps: ["Analyze", "Plan", "Use Tools", "Make Decision"],
      review: { t: "Human Review", s: "exceptions / approval" },
      action: { t: "Business Action", s: "agent proposes" },
      execute: { t: "Execute Task" },
      update: { t: "Update Systems" },
      outcomes: ["Task Completed", "Systems Updated", "Business Outcome"],
      diagram: {
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
    },
    integration: {
      label: "System integration architecture diagram",
      sats: ["CRM", "ERP", "Database", "External System"],
      center: "API Layer",
      centerSub: "webhooks",
      errors: { t: "Errors", s: "handled safely" },
      crm: { t: "CRM", items: ["Customers", "Leads", "Sales Data"] },
      layer: {
        t: "Integration / API Layer",
        items: [
          "API & Connectors",
          "Secure Integration",
          "Data Exchange",
          "Mapping & Validation",
          "Transform Data",
          "Validate Rules",
          "Synchronization",
          "Keep Systems in Sync",
          "Two-way Exchange",
        ],
      },
      erp: { t: "ERP", items: ["Orders", "Inventory", "Financial Data"] },
      diagram: {
        label:
          "System integration: CRM and ERP synchronize through an API and webhook layer with shared database records",
        systems: "CRM / ERP",
        systemsSub: "business systems",
        layer: "API & Webhooks",
        layerSub: "validate & sync",
        data: "Database",
        dataSub: "shared records",
      },
    },
    aiops: {
      label: "AIOps monitoring loop diagram",
      deploy: { t: "Deploy", s: "release" },
      runtime: { t: "Runtime", s: "production" },
      monitor: { t: "Monitor", s: "Metrics and logs" },
      alert: "Alert",
      resolve: { t: "Resolve", s: "Alert or fix" },
      apps: { t: "Applications", s: "systems in use" },
      detect: { t: "Detect", s: "Find anomalies" },
      verify: { t: "Verify", s: "Confirm recovery" },
      heading: "Keep systems healthy",
      outcome: "Find issues earlier. Restore operations faster.",
      systems: { t: "Systems & Apps", s: "monitored stack" },
      signals: [
        { t: "Metrics", s: "performance / usage" },
        { t: "Logs", s: "events / errors" },
        { t: "Health", s: "availability checks" },
      ],
      detectNode: { t: "Detection", s: "identify + investigate" },
      alertNode: { t: "Alert", s: "notify team · incident" },
      response: { t: "Response", s: "auto / manual fix" },
      verifyNode: { t: "Recovery Check", s: "confirm + monitor" },
      feedback: "Continuous Monitoring",
      diagram: {
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
    },
    consulting: {
      diagram: {
        label:
          "AI consulting: understand, recommend, implement and improve",
        understand: "Understand",
        recommend: "Recommend",
        implement: "Implement",
        improve: "Improve",
      },
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
      shared: "Gedeelde records",
      modules: [
        { t: "CRM", s: "Leads & Klanten" },
        { t: "Verkoop", s: "Orders & Omzet" },
        { t: "Voorraad", s: "Voorraad & Fulfilment" },
        { t: "Financiën", s: "Boekhouding & Financiën" },
        { t: "HR", s: "Mensen & Operatie" },
      ],
      diagram: {
        label:
          "Odoo-aanpassing: verkoop, voorraad en financiën verbonden via Odoo op maat in één workflow",
        sales: "Verkoop",
        salesSub: "Orders & omzet",
        inventory: "Voorraad",
        inventorySub: "Voorraad & fulfilment",
        finance: "Financiën",
        financeSub: "Facturen & boeken",
        core: "Odoo op maat",
        coreSub: "afgestemd op uw workflow",
        outcome: "Eén workflow",
        outcomeSub: "één verbonden operatie",
      },
    },
    workflow: {
      label: "Workflowautomatiseringsschema",
      trigger: { t: "Event / Trigger", s: "start de run" },
      process: { t: "Proces", s: "voert de stappen uit" },
      condition: { t: "Conditie", s: "controleert de regels" },
      action: { t: "Actie", s: "werkt systemen bij" },
      review: { t: "Beoordeling", s: "handelt uitzonderingen af" },
      complete: { t: "Voltooid", s: "klaar" },
      decision: { t: "Beslissing", s: "regels ok?" },
      auto: { t: "Automatisch", s: "geen akkoord nodig" },
      completed: { t: "Voltooid", s: "klaar" },
      approval: { t: "Menselijk akkoord", s: "conditionele review" },
      approved: { t: "Goedgekeurd", s: "ga verder" },
      continueNode: { t: "Proces vervolgen", s: "hervat flow" },
      rejected: { t: "Afgekeurd" },
      returnNode: { t: "Retour / Exceptie" },
      diagram: {
        label:
          "Workflowautomatisering: een nieuwe aanvraag start een geautomatiseerde workflow en rondt de taak af",
        trigger: "Trigger",
        triggerSub: "Nieuwe aanvraag",
        automate: "Automatiseren",
        automateSub: "Workflow uitvoeren",
        complete: "Voltooid",
        completeSub: "Taak afgerond",
      },
    },
    ai: {
      label: "AI-agent workflowschema",
      request: { t: "Verzoek", s: "nieuwe invoer" },
      context: { t: "Context", s: "relevante data" },
      agent: { t: "AI-agent", s: "past bedrijfsregels toe" },
      reasoning: "Redenering",
      response: { t: "Antwoord", s: "klaar om te versturen" },
      tools: { t: "Tools", s: "gekoppelde API's" },
      validate: { t: "Valideren", s: "controles en akkoord" },
      result: { t: "Resultaat", s: "klaar voor gebruik" },
      inputs: {
        context: { t: "Context", s: "informatie" },
        tools: { t: "Tools & Data", s: "goedgekeurde API's" },
        rules: { t: "Bedrijfsregels", s: "permissies" },
      },
      steps: ["Analyseren", "Plannen", "Gebruik tools", "Beslissen"],
      review: { t: "Menselijke review", s: "excepties / akkoord" },
      action: { t: "Bedrijfsactie", s: "agent stelt voor" },
      execute: { t: "Taak uitvoeren" },
      update: { t: "Systemen bijwerken" },
      outcomes: ["Taak voltooid", "Systemen bijgewerkt", "Bedrijfsresultaat"],
      diagram: {
        label:
          "AI-automatisering: context en een verzoek gaan naar een AI-agent die een menselijk gecontroleerde bedrijfsactie oplevert",
        context: "Context",
        contextSub: "Kennis & data",
        request: "Verzoek",
        requestSub: "Gebruikersprompt",
        core: "AI-agent",
        coreSub: "regels, tools & context",
        outcome: "Bedrijfsactie",
        outcomeSub: "menselijk gecontroleerd",
      },
    },
    integration: {
      label: "Systeemkoppelingsdiagram",
      sats: ["CRM", "ERP", "Database", "Extern systeem"],
      center: "API-laag",
      centerSub: "webhooks",
      errors: { t: "Fouten", s: "veilig afgehandeld" },
      crm: { t: "CRM", items: ["Klanten", "Leads", "Verkoopdata"] },
      layer: {
        t: "Integratie / API-laag",
        items: [
          "API & Connectoren",
          "Veilige integratie",
          "Data-uitwisseling",
          "Mapping & Validatie",
          "Transformeer data",
          "Valideer regels",
          "Synchronisatie",
          "Houd systemen in sync",
          "Tweerichtingsverkeer",
        ],
      },
      erp: { t: "ERP", items: ["Orders", "Voorraad", "Financiële data"] },
      diagram: {
        label:
          "Systeemintegratie: CRM en ERP synchroniseren via een API- en webhooklaag met gedeelde databaserecords",
        systems: "CRM / ERP",
        systemsSub: "bedrijfssystemen",
        layer: "API & webhooks",
        layerSub: "valideren & syncen",
        data: "Database",
        dataSub: "gedeelde records",
      },
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
      apps: { t: "Applicaties", s: "systemen in gebruik" },
      detect: { t: "Detecteren", s: "afwijkingen vinden" },
      verify: { t: "Verifiëren", s: "status bevestigd" },
      systems: { t: "Systemen & Apps", s: "gemonitorde stack" },
      signals: [
        { t: "Metrieken", s: "prestatie / gebruik" },
        { t: "Logs", s: "events / fouten" },
        { t: "Health", s: "beschikbaarheidschecks" },
      ],
      detectNode: { t: "Detectie", s: "vinden + onderzoeken" },
      alertNode: { t: "Alarm", s: "team + incident" },
      response: { t: "Respons", s: "auto / handmatige fix" },
      verifyNode: { t: "Herstelcheck", s: "bevestig + monitor" },
      feedback: "Continue monitoring",
    },
    aiops: {
      label: "AIOps-monitoringlusdiagram",
      deploy: { t: "Uitrol", s: "release" },
      runtime: { t: "Runtime", s: "productie" },
      monitor: { t: "Monitor", s: "logs en metrieken" },
      alert: "Alarm",
      resolve: { t: "Oplossen", s: "herstellen en verbeteren" },
      apps: { t: "Applicaties", s: "systemen in gebruik" },
      detect: { t: "Detecteren", s: "afwijkingen vinden" },
      verify: { t: "Verifiëren", s: "status bevestigd" },
      systems: { t: "Systemen & Apps", s: "gemonitorde stack" },
      signals: [
        { t: "Metrieken", s: "prestatie / gebruik" },
        { t: "Logs", s: "events / fouten" },
        { t: "Health", s: "beschikbaarheidschecks" },
      ],
      detectNode: { t: "Detectie", s: "vinden + onderzoeken" },
      alertNode: { t: "Alarm", s: "team + incident" },
      response: { t: "Respons", s: "auto / handmatige fix" },
      verifyNode: { t: "Herstelcheck", s: "bevestig + monitor" },
      feedback: "Continue monitoring",
      diagram: {
        label:
          "AIOps-monitoring: monitoren, detecteren, reageren en herstellen, met continue monitoring",
        monitor: "Monitor",
        monitorSub: "Metrieken & logs",
        detect: "Detecteren",
        detectSub: "Afwijkingen vinden",
        respond: "Reageren",
        respondSub: "Alarm of herstel",
        recover: "Herstellen",
        recoverSub: "Herstel bevestigen",
        continuous: "Continue monitoring",
      },
    },
    consulting: {
      diagram: {
        label:
          "AI-consulting: begrijpen, adviseren, implementeren en verbeteren",
        understand: "Begrijpen",
        recommend: "Adviseren",
        implement: "Implementeren",
        improve: "Verbeteren",
      },
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
      shared: "Gemeinsame Datensätze",
      modules: [
        { t: "CRM", s: "Leads & Kunden" },
        { t: "Vertrieb", s: "Aufträge & Umsatz" },
        { t: "Lager", s: "Bestand & Fulfillment" },
        { t: "Finanzen", s: "Buchhaltung & Finanzen" },
        { t: "HR", s: "People & Operations" },
      ],
      diagram: {
        label:
          "Odoo-Anpassung: Vertrieb, Lager und Finanzen über Odoo nach Maß in einem einheitlichen Workflow verbunden",
        sales: "Vertrieb",
        salesSub: "Aufträge & Umsatz",
        inventory: "Lager",
        inventorySub: "Bestand & Fulfillment",
        finance: "Finanzen",
        financeSub: "Rechnungen & Bücher",
        core: "Odoo nach Maß",
        coreSub: "an Ihren Ablauf angepasst",
        outcome: "Ein Workflow",
        outcomeSub: "ein verbundener Ablauf",
      },
    },
    workflow: {
      label: "Workflow-Pipelinediagramm",
      trigger: { t: "Event / Trigger", s: "startet den Lauf" },
      process: { t: "Prozess", s: "führt die Schritte aus" },
      condition: { t: "Bedingung", s: "prüft die Regeln" },
      action: { t: "Aktion", s: "aktualisiert Systeme" },
      review: { t: "Prüfung", s: "behandelt Ausnahmen" },
      complete: { t: "Fertig", s: "abgeschlossen" },
      decision: { t: "Entscheidung", s: "Regeln ok?" },
      auto: { t: "Automatisch", s: "ohne Freigabe" },
      completed: { t: "Fertig", s: "abgeschlossen" },
      approval: { t: "Manuelle Freigabe", s: "bedingte Prüfung" },
      approved: { t: "Freigegeben", s: "weiter" },
      continueNode: { t: "Prozess fortsetzen", s: "Flow fortsetzen" },
      rejected: { t: "Abgelehnt" },
      returnNode: { t: "Rückgabe / Ausnahme" },
      diagram: {
        label:
          "Workflow-Automatisierung: eine neue Anfrage startet einen automatisierten Workflow und schließt die Aufgabe ab",
        trigger: "Trigger",
        triggerSub: "Neue Anfrage",
        automate: "Automatisieren",
        automateSub: "Workflow verarbeiten",
        complete: "Fertig",
        completeSub: "Aufgabe erledigt",
      },
    },
    ai: {
      label: "KI-Agenten-Diagramm",
      request: { t: "Anfrage", s: "neue Eingabe" },
      context: { t: "Kontext", s: "relevante Daten" },
      agent: { t: "KI-Agent", s: "wendet Geschäftsregeln an" },
      reasoning: "Schlussfolgerung",
      response: { t: "Antwort", s: "versandbereit" },
      tools: { t: "Tools", s: "verbundene APIs" },
      validate: { t: "Prüfen", s: "Kontrollen und Freigabe" },
      result: { t: "Ergebnis", s: "einsatzbereit" },
      inputs: {
        context: { t: "Kontext", s: "Informationen" },
        tools: { t: "Tools & Daten", s: "freigegebene APIs" },
        rules: { t: "Geschäftsregeln", s: "Berechtigungen" },
      },
      steps: ["Analysieren", "Planen", "Tools nutzen", "Entscheiden"],
      review: { t: "Manuelle Prüfung", s: "Ausnahmen / Freigabe" },
      action: { t: "Geschäftsaktion", s: "Agent schlägt vor" },
      execute: { t: "Task ausführen" },
      update: { t: "Systeme updaten" },
      outcomes: ["Task erledigt", "Systeme aktuell", "Geschäftsergebnis"],
      diagram: {
        label:
          "KI-Automatisierung: Kontext und eine Anfrage gehen an einen KI-Agenten, der eine menschlich geprüfte Geschäftsaktion liefert",
        context: "Kontext",
        contextSub: "Wissen & Daten",
        request: "Anfrage",
        requestSub: "Nutzer-Prompt",
        core: "KI-Agent",
        coreSub: "Regeln & Kontext",
        outcome: "Geschäftsaktion",
        outcomeSub: "menschlich geprüft",
      },
    },
    integration: {
      label: "Systemintegrationsdiagramm",
      sats: ["CRM", "ERP", "Datenbank", "Externes System"],
      center: "API-Schicht",
      centerSub: "Webhooks",
      errors: { t: "Fehler", s: "sicher behandelt" },
      crm: { t: "CRM", items: ["Kunden", "Leads", "Vertriebsdaten"] },
      layer: {
        t: "Integration / API-Schicht",
        items: [
          "API & Connectoren",
          "Sichere Integration",
          "Datenaustausch",
          "Mapping & Validierung",
          "Daten transformieren",
          "Regeln prüfen",
          "Synchronisierung",
          "Systeme synchron halten",
          "Zwei-Wege-Austausch",
        ],
      },
      erp: { t: "ERP", items: ["Aufträge", "Lager", "Finanzdaten"] },
      diagram: {
        label:
          "Systemintegration: CRM und ERP synchronisieren über eine API- und Webhook-Schicht mit gemeinsamen Datenbankeinträgen",
        systems: "CRM / ERP",
        systemsSub: "Geschäftssysteme",
        layer: "API & Webhooks",
        layerSub: "prüfen & syncen",
        data: "Datenbank",
        dataSub: "gemeinsame Datensätze",
      },
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
      apps: { t: "Anwendungen", s: "genutzte Systeme" },
      detect: { t: "Erkennen", s: "Anomalien finden" },
      verify: { t: "Verifizieren", s: "Status bestätigt" },
      systems: { t: "Systeme & Apps", s: "überwachter Stack" },
      signals: [
        { t: "Metriken", s: "Performance / Nutzung" },
        { t: "Logs", s: "Events / Fehler" },
        { t: "Health", s: "Verfügbarkeitschecks" },
      ],
      detectNode: { t: "Erkennung", s: "finden + analysieren" },
      alertNode: { t: "Alarm", s: "Team + Incident" },
      response: { t: "Reaktion", s: "auto / manueller Fix" },
      verifyNode: { t: "Recovery-Check", s: "bestätigen + monitoren" },
      feedback: "Kontinuierliches Monitoring",
    },
    aiops: {
      label: "AIOps-Beobachtungsschleife",
      deploy: { t: "Deployment", s: "Release" },
      runtime: { t: "Laufzeit", s: "Produktion" },
      monitor: { t: "Monitor", s: "Logs und Metriken" },
      alert: "Alarm",
      resolve: { t: "Beheben", s: "fixen und verbessern" },
      apps: { t: "Anwendungen", s: "genutzte Systeme" },
      detect: { t: "Erkennen", s: "Anomalien finden" },
      verify: { t: "Verifizieren", s: "Status bestätigt" },
      systems: { t: "Systeme & Apps", s: "überwachter Stack" },
      signals: [
        { t: "Metriken", s: "Performance / Nutzung" },
        { t: "Logs", s: "Events / Fehler" },
        { t: "Health", s: "Verfügbarkeitschecks" },
      ],
      detectNode: { t: "Erkennung", s: "finden + analysieren" },
      alertNode: { t: "Alarm", s: "Team + Incident" },
      response: { t: "Reaktion", s: "auto / manueller Fix" },
      verifyNode: { t: "Recovery-Check", s: "bestätigen + monitoren" },
      feedback: "Kontinuierliches Monitoring",
      diagram: {
        label:
          "AIOps-Monitoring: überwachen, erkennen, reagieren und wiederherstellen, mit kontinuierlichem Monitoring",
        monitor: "Überwachen",
        monitorSub: "Metriken & Logs",
        detect: "Erkennen",
        detectSub: "Anomalien finden",
        respond: "Reagieren",
        respondSub: "Alarm oder Fix",
        recover: "Wiederherstellen",
        recoverSub: "Erholung bestätigt",
        continuous: "Kontinuierliches Monitoring",
      },
    },
    consulting: {
      diagram: {
        label:
          "KI-Beratung: verstehen, empfehlen, umsetzen und verbessern",
        understand: "Verstehen",
        recommend: "Empfehlen",
        implement: "Umsetzen",
        improve: "Verbessern",
      },
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
    skipToContent: "Skip to main content",
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
  payments: {
  button: "Pay for Consultation",
  checkoutHeading: "Continue to secure payment",
  checkoutText: "Your consultation request is saved. Review the configured price, then continue to Stripe Checkout.",
  retryConfiguration: "Retry payment setup",
  loading: "Opening secure checkout…",
  notConfigured:
    "Online payment is not available right now. Please contact us and we will arrange it.",
  errorGeneric:
    "We could not start the payment. Please try again in a moment.",
  errorNetwork:
    "We could not reach the payment service. Please check your connection and try again.",
    success: {
      title: "Thank you | SystemaOps",
      heading: "Thank you.",
      body: "Thank you. We are confirming your payment. A confirmation email will be sent once it is verified.",
      verifiedHeading: "Payment verified",
      verifiedBody: "Stripe has verified your payment.",
      verifiedNote: "A confirmation email will be sent after the payment notification is processed.",
      failedHeading: "Payment not completed",
      failedBody: "Stripe reports that this payment did not complete.",
      failedNote: "You can return to Book a Call to try again.",
      expiredHeading: "Checkout expired",
      expiredBody: "This checkout session expired before payment was completed.",
      expiredNote: "Return to Book a Call to start again.",
      unavailableHeading: "Status temporarily unavailable",
      unavailableBody: "We could not retrieve the payment status right now.",
      unavailableNote: "Try checking again in a moment. Your payment status is not changed by this page.",
      retryVerification: "Check status again",
      note: "This page does not confirm payment on its own — the confirmation email is sent only after Stripe verifies the payment.",
      missingSession:
        "We could not read the checkout reference from this link. If you completed checkout, your confirmation email will still arrive once the payment is verified.",
        neutralHeading: "We could not find a payment to confirm",
        neutralBody:
          "There is no payment linked to this page, so nothing can be confirmed here.",
        neutralNote:
          "If you completed a checkout, the confirmation email is sent once the payment has been verified.",
      contactCta: "Continue to contact",
      homeCta: "Back to home",
    },
    cancel: {
      title: "Payment cancelled | SystemaOps",
      heading: "Payment cancelled.",
      body: "You cancelled the payment and nothing was charged.",
      retryCta: "Try again",
      contactCta: "Contact us instead",
    },
  },
  consultation: {
    meta: {
      title: "Book a Call | SystemaOps",
      description:
        "Tell us what you are trying to achieve. Our team can help you explore practical solutions for automation, ERP, AI and business operations.",
    },
    hero: {
      eyebrow: "Consultation",
      heading: "Let's discuss your business goals.",
      sub: "Tell us what you're trying to achieve. We'll review your requirements and help identify a practical next step.",
      primary: "Request a consultation",
      secondary: "Contact us",
      expectTitle: "What happens next",
      expect: {
        one: "Share your goals",
        two: "We review your requirements",
        three: "We follow up by email",
      },
    },
    areas: {
      heading: "Areas of expertise",
      hint: "Choose the area closest to your question.",
      other: "Something else",
      otherDesc: "Tell us what does not fit the list.",
    },
    form: {
      heading: "Tell us what you need",
      subheading:
        "A few details so we can prepare a useful conversation.",
      name: "Full name",
      email: "Business email",
      company: "Company name",
      optional: "Optional",
      area: "Area of interest",
      areaPlaceholder: "Select an area (optional)",
      message: "Briefly describe the business challenge",
      privacy:
        "I agree that SystemaOps may store and process these details to respond to my enquiry.",
      submit: "Request a consultation",
      submitting: "Sending your request…",
      note: "We only use these details to respond to your enquiry.",
      counter: "{count} / {max} characters",
        submitError: {
          network: "We could not reach the server. Check your connection and try again.",
          rateLimited: "Too many requests. Please wait a moment and try again.",
          invalid: "Some details were not accepted. Please review the form and try again.",
          server: "Something went wrong on our side. Please try again in a moment.",
        },
      errorSummaryTitle:
        "Please fix {count} field(s) before continuing.",
    },
    steps: {
      label: "Consultation progress",
      details: "Details",
      review: "Review",
      payment: "Payment",
      confirmation: "Confirmation",
      detailsAnnounced: "Step 1 of the journey: your details.",
      reviewAnnounced: "Step 2 of the journey: review your details.",
      paymentAnnounced: "Step 3 of the journey: payment.",
      confirmationAnnounced: "Final step: confirmation.",
    },
    review: {
      heading: "Review your details",
      text: "Please check everything below before you continue. You can go back and edit any field.",
      edit: "Edit details",
      submit: "Submit enquiry",
      submitting: "Submitting…",
      toPayment: "Continue to payment",
    },
    panel: {
      label: "Consultation summary",
      heading: "What this consultation is",
      purpose:
        "A conversation about your operational goals and the practical options for the work, with the people who would do it.",
      mode: "Consultation type",
      price: "Consultation fee",
      oneTime: "One-time payment",
      secureCheckout: "Secure checkout via Stripe.",
      next: "What happens next",
      stripeNote:
        "When payment is enabled, card details are entered on Stripe's hosted page — never on this site.",
      footnote:
        "No appointment is booked automatically. Timing is arranged by email.",
    },
    offer: {
      mode: {
        undecided: "To be confirmed",
        free: "Free introductory call",
        paid: "Paid consultation",
      },
      pricePending: "To be confirmed",
      next: {
        undecided:
          "We review your requirements and confirm the format and pricing by email.",
        free: "We confirm a time by email.",
        paid:
            "Once the payment is verified, we arrange the timing by email.",
      },
      duration: "Duration",
      deliverable: "What you get",
    },
    confirm: {
      heading: "Enquiry received",
      text: "Thank you. Your requirements have been sent to our team.",
      next: {
        undecided:
          "We will review them and confirm the format and pricing by email.",
        free: "We will confirm a time by email.",
        paid: "We will follow up by email about the paid consultation.",
      },
      home: "Back to home",
      startOver: "Send another enquiry",
    },
    validation: {
      nameRequired: "Please enter your full name.",
      nameTooLong: "That name is too long (120 characters maximum).",
      emailRequired: "Please enter your business email address.",
      emailInvalid:
        "Please enter a valid business email, like name@company.com.",
      emailTooLong: "That email address is too long.",
      areaRequired: "Please choose an area of interest.",
      areaInvalid: "Please choose one of the listed areas.",
      messageRequired: "Please describe your requirements briefly.",
      messageTooLong: "Please shorten your description (1200 characters maximum).",
      privacyRequired:
        "Please accept the privacy acknowledgement to continue.",
    },
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
    skipToContent: "Direct naar inhoud",
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
  payments: {
  button: "Betaling voor consultatie",
  checkoutHeading: "Doorgaan naar veilige betaling",
  checkoutText: "Je consultaanvraag is opgeslagen. Controleer de ingestelde prijs en ga verder naar Stripe Checkout.",
  retryConfiguration: "Betaalconfiguratie opnieuw proberen",
  loading: "Bezig met het openen van beveiligde betaling…",
  notConfigured:
    "Online betalen is momenteel niet beschikbaar. Neem contact met ons op, dan regelen we het.",
  errorGeneric:
    "We konden de betaling niet starten. Probeer het over een moment opnieuw.",
  errorNetwork:
    "We konden de betaaldienst niet bereiken. Controleer je verbinding en probeer opnieuw.",
    success: {
      title: "Bedankt | SystemaOps",
      heading: "Bedankt.",
      body: "Bedankt. We bevestigen je betaling. Er wordt een bevestigingsmail verstuurd zodra deze is geverifieerd.",
      verifiedHeading: "Betaling geverifieerd",
      verifiedBody: "Stripe heeft je betaling geverifieerd.",
      verifiedNote: "Er wordt een bevestigingsmail verstuurd nadat de betalingsmelding is verwerkt.",
      failedHeading: "Betaling niet afgerond",
      failedBody: "Stripe meldt dat deze betaling niet is afgerond.",
      failedNote: "Je kunt teruggaan naar Gesprek boeken om het opnieuw te proberen.",
      expiredHeading: "Checkout verlopen",
      expiredBody: "Deze checkout is verlopen voordat de betaling was afgerond.",
      expiredNote: "Ga terug naar Gesprek boeken om opnieuw te beginnen.",
      unavailableHeading: "Status tijdelijk niet beschikbaar",
      unavailableBody: "We kunnen de betaalstatus momenteel niet ophalen.",
      unavailableNote: "Probeer het straks opnieuw. Deze pagina wijzigt je betaalstatus niet.",
      retryVerification: "Status opnieuw controleren",
      note: "Deze pagina bevestigt de betaling niet zelf — de bevestigingsmail wordt alleen verstuurd nadat Stripe de betaling heeft geverifieerd.",
      missingSession:
        "We konden de checkoutreferentie uit deze link niet lezen. Als je de betaling hebt afgerond, ontvang je de bevestigingsmail zodra de betaling is geverifieerd.",
        neutralHeading: "Wij konden geen betaling vinden om te bevestigen",
        neutralBody:
          "Er is geen betaling aan deze pagina gekoppeld, dus hier valt niets te bevestigen.",
        neutralNote:
          "Als je een betaling hebt afgerond, ontvang je de bevestigingsmail zodra de betaling is geverifieerd.",
      contactCta: "Ga verder naar contact",
      homeCta: "Terug naar home",
    },
    cancel: {
      title: "Betaling geannuleerd | SystemaOps",
      heading: "Betaling geannuleerd.",
      body: "Je hebt de betaling geannuleerd en er is niets in rekening gebracht.",
      retryCta: "Opnieuw proberen",
      contactCta: "Neem contact op",
    },
  },
  consultation: {
    meta: {
      title: "Plan een gesprek | SystemaOps",
      description:
        "Vertel wat u wilt bereiken. Ons team helpt u praktische oplossingen verkennen voor automatisering, ERP, AI en bedrijfsvoering.",
    },
    hero: {
      eyebrow: "Consultatie",
      heading: "Laten we het over uw zakelijke doelen hebben.",
      sub: "Vertel ons wat u wilt bereiken. We bekijken uw wensen en helpen u een praktische volgende stap te bepalen.",
      primary: "Consultatie aanvragen",
      secondary: "Neem contact op",
      expectTitle: "Wat gebeurt er daarna",
      expect: {
        one: "Deel uw doelen",
        two: "Wij bekijken uw wensen",
        three: "Wij nemen per e-mail contact op",
      },
    },
    areas: {
      heading: "Expertisegebieden",
      hint: "Kies het gebied dat het dichtst bij uw vraag ligt.",
      other: "Iets anders",
      otherDesc: "Vertel ons wat niet in de lijst past.",
    },
    form: {
      heading: "Vertel ons wat u nodig hebt",
      subheading:
        "Een paar gegevens zodat we een nuttig gesprek kunnen voorbereiden.",
      name: "Volledige naam",
      email: "Zakelijk e-mailadres",
      company: "Bedrijfsnaam",
      optional: "Optioneel",
      area: "Interessegebied",
      areaPlaceholder: "Kies een gebied (optioneel)",
      message: "Omschrijf kort de zakelijke uitdaging",
      privacy:
        "Ik ga akkoord dat SystemaOps deze gegevens opslaat en verwerkt om mijn vraag te beantwoorden.",
      submit: "Consultatie aanvragen",
      submitting: "Versturen…",
      note: "Wij gebruiken deze gegevens uitsluitend om uw vraag te beantwoorden.",
      counter: "{count} / {max} tekens",
        submitError: {
          network: "We konden de server niet bereiken. Controleer je verbinding en probeer het opnieuw.",
          rateLimited: "Te veel verzoeken. Wacht even en probeer het opnieuw.",
          invalid: "Sommige gegevens zijn niet geaccepteerd. Controleer het formulier en probeer het opnieuw.",
          server: "Er ging iets mis aan onze kant. Probeer het over een moment opnieuw.",
        },
      errorSummaryTitle:
        "Corrigeer {count} veld(en) voordat u verdergaat.",
    },
    steps: {
      label: "Voortgang consultatie",
      details: "Gegevens",
      review: "Controleren",
      payment: "Betaling",
      confirmation: "Bevestiging",
      detailsAnnounced: "Stap 1 van het traject: uw gegevens.",
      reviewAnnounced: "Stap 2 van het traject: controleer uw gegevens.",
      paymentAnnounced: "Stap 3 van het traject: betaling.",
      confirmationAnnounced: "Laatste stap: bevestiging.",
    },
    review: {
      heading: "Controleer uw gegevens",
      text: "Controleer hieronder alles voordat u verdergaat. U kunt elk veld aanpassen.",
      edit: "Gegevens bewerken",
      submit: "Aanvraag versturen",
      submitting: "Versturen…",
      toPayment: "Doorgaan naar betaling",
    },
    panel: {
      label: "Samenvatting consultatie",
      heading: "Waar deze consultatie over gaat",
      purpose:
        "Een gesprek over uw operationele doelen en de praktische opties voor het werk, met de mensen die het uitvoeren.",
      mode: "Type consultatie",
      price: "Consultatiekosten",
      oneTime: "Eenmalige betaling",
      secureCheckout: "Veilig afrekenen via Stripe.",
      next: "Wat gebeurt er daarna",
      stripeNote:
        "Wanneer betaling is ingeschakeld, worden kaartgegevens ingevuld op de gehoste pagina van Stripe — nooit op deze site.",
      footnote:
        "Er wordt automatisch geen afspraak ingepland. De timing stemmen we per e-mail af.",
    },
    offer: {
      mode: {
        undecided: "Nog te bevestigen",
        free: "Gratis kennismakingsgesprek",
        paid: "Betaalde consultatie",
      },
      pricePending: "Nog te bevestigen",
      next: {
        undecided:
          "Wij bekijken uw wensen en bevestigen vorm en prijs per e-mail.",
        free: "Wij stemmen een tijd per e-mail af.",
        paid:
            "Zodra de betaling is geverifieerd, stemmen we de timing per e-mail af.",
      },
      duration: "Duur",
      deliverable: "Wat u krijgt",
    },
    confirm: {
      heading: "Aanvraag ontvangen",
      text: "Bedankt. Uw wensen zijn naar ons team verstuurd.",
      next: {
        undecided:
          "Wij bekijken ze en bevestigen vorm en prijs per e-mail.",
        free: "Wij stemmen een tijd per e-mail af.",
        paid: "Wij nemen per e-mail contact op over de betaalde consultatie.",
      },
      home: "Terug naar home",
      startOver: "Nog een aanvraag versturen",
    },
    validation: {
      nameRequired: "Vul uw volledige naam in.",
      nameTooLong: "Die naam is te lang (maximaal 120 tekens).",
      emailRequired: "Vul uw zakelijke e-mailadres in.",
      emailInvalid:
        "Vul een geldig zakelijk e-mailadres in, zoals naam@bedrijf.nl.",
      emailTooLong: "Dat e-mailadres is te lang.",
      areaRequired: "Kies een interessegebied.",
      areaInvalid: "Kies een van de vermelde gebieden.",
      messageRequired: "Omschrijf kort uw wensen.",
      messageTooLong: "Kort uw beschrijving in (maximaal 1200 tekens).",
      privacyRequired:
        "Ga akkoord met de privacyverklaring om verder te gaan.",
    },
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
    skipToContent: "Zum Inhalt springen",
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
  payments: {
  button: "Beratung bezahlen",
  checkoutHeading: "Weiter zur sicheren Zahlung",
  checkoutText: "Deine Beratungsanfrage wurde gespeichert. Prüfe den konfigurierten Preis und fahre mit Stripe Checkout fort.",
  retryConfiguration: "Zahlungskonfiguration erneut laden",
  loading: "Sichere Zahlung wird geöffnet…",
  notConfigured:
    "Online-Zahlung ist derzeit nicht verfügbar. Kontaktiere uns, wir bringen es in Ordnung.",
  errorGeneric:
    "Die Zahlung konnte nicht gestartet werden. Bitte versuche es gleich noch einmal.",
  errorNetwork:
    "Der Zahlungsdienst war nicht erreichbar. Bitte prüfe deine Verbindung und versuche es erneut.",
    success: {
      title: "Vielen Dank | SystemaOps",
      heading: "Vielen Dank.",
      body: "Vielen Dank. Wir bestätigen deine Zahlung. Sobald sie geprüft ist, senden wir eine Bestätigungs-E-Mail.",
      verifiedHeading: "Zahlung bestätigt",
      verifiedBody: "Stripe hat deine Zahlung bestätigt.",
      verifiedNote: "Eine Bestätigungs-E-Mail wird nach Verarbeitung der Zahlungsbenachrichtigung gesendet.",
      failedHeading: "Zahlung nicht abgeschlossen",
      failedBody: "Stripe meldet, dass diese Zahlung nicht abgeschlossen wurde.",
      failedNote: "Du kannst zur Gesprächsbuchung zurückkehren und es erneut versuchen.",
      expiredHeading: "Checkout abgelaufen",
      expiredBody: "Diese Checkout-Sitzung ist vor Abschluss der Zahlung abgelaufen.",
      expiredNote: "Kehre zur Gesprächsbuchung zurück, um neu zu beginnen.",
      unavailableHeading: "Status vorübergehend nicht verfügbar",
      unavailableBody: "Der Zahlungsstatus kann gerade nicht abgerufen werden.",
      unavailableNote: "Versuche es gleich erneut. Diese Seite ändert deinen Zahlungsstatus nicht.",
      retryVerification: "Status erneut prüfen",
      note: "Diese Seite bestätigt die Zahlung nicht selbst — die Bestätigungs-E-Mail wird erst versendet, nachdem Stripe die Zahlung geprüft hat.",
      missingSession:
        "Wir konnten die Checkout-Referenz nicht aus diesem Link lesen. Wenn du die Zahlung abgeschlossen hast, erhältst du die Bestätigungs-E-Mail, sobald die Zahlung geprüft ist.",
        neutralHeading: "Wir konnten keine Zahlung zum Bestätigen finden",
        neutralBody:
          "Dieser Seite ist keine Zahlung zugeordnet, daher kann hier nichts bestätigt werden.",
        neutralNote:
          "Wenn du eine Zahlung abgeschlossen hast, erhältst du die Bestätigungs-E-Mail, sobald die Zahlung geprüft ist.",
      contactCta: "Weiter zum Kontakt",
      homeCta: "Zurück zur Startseite",
    },
    cancel: {
      title: "Zahlung abgebrochen | SystemaOps",
      heading: "Zahlung abgebrochen.",
      body: "Du hast die Zahlung abgebrochen. Es wurde nichts berechnet.",
      retryCta: "Erneut versuchen",
      contactCta: "Kontaktiere uns",
    },
  },
  consultation: {
    meta: {
      title: "Gespräch buchen | SystemaOps",
      description:
        "Sagen Sie uns, was Sie erreichen möchten. Unser Team unterstützt Sie bei praktischen Lösungen für Automatisierung, ERP, KI und Betriebsabläufe.",
    },
    hero: {
      eyebrow: "Beratung",
      heading: "Lassen Sie uns über Ihre Geschäftsziele sprechen.",
      sub: "Sagen Sie uns, was Sie erreichen möchten. Wir prüfen Ihre Anforderungen und helfen Ihnen beim nächsten praktischen Schritt.",
      primary: "Beratung anfragen",
      secondary: "Kontakt aufnehmen",
      expectTitle: "Wie es weitergeht",
      expect: {
        one: "Teilen Sie Ihre Ziele",
        two: "Wir prüfen Ihre Anforderungen",
        three: "Wir melden uns per E-Mail",
      },
    },
    areas: {
      heading: "Expertisegebiete",
      hint: "Wählen Sie das Gebiet, das Ihrer Frage am nächsten liegt.",
      other: "Etwas anderes",
      otherDesc: "Sagen Sie uns, was nicht zur Liste passt.",
    },
    form: {
      heading: "Sagen Sie uns, was Sie brauchen",
      subheading:
        "Ein paar Angaben, damit wir ein hilfreiches Gespräch vorbereiten können.",
      name: "Vollständiger Name",
      email: "Geschäftliche E-Mail",
      company: "Unternehmensname",
      optional: "Optional",
      area: "Interessengebiet",
      areaPlaceholder: "Gebiet auswählen (optional)",
      message: "Beschreiben Sie kurz die geschäftliche Herausforderung",
      privacy:
        "Ich stimme zu, dass SystemaOps diese Angaben speichert und verarbeitet, um meine Anfrage zu beantworten.",
      submit: "Beratung anfragen",
      submitting: "Wird gesendet…",
      note: "Wir verwenden diese Angaben ausschließlich, um Ihre Anfrage zu beantworten.",
      counter: "{count} / {max} Zeichen",
        submitError: {
          network: "Der Server war nicht erreichbar. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
          rateLimited: "Zu viele Anfragen. Bitte warten Sie einen Moment und versuchen Sie es erneut.",
          invalid: "Einige Angaben wurden nicht akzeptiert. Bitte prüfen Sie das Formular und versuchen Sie es erneut.",
          server: "Auf unserer Seite ist etwas schiefgelaufen. Bitte versuchen Sie es gleich noch einmal.",
        },
      errorSummaryTitle:
        "Bitte korrigieren Sie {count} Feld(er), bevor Sie fortfahren.",
    },
    steps: {
      label: "Fortschritt der Beratung",
      details: "Angaben",
      review: "Prüfen",
      payment: "Zahlung",
      confirmation: "Bestätigung",
      detailsAnnounced: "Schritt 1 des Ablaufs: Ihre Angaben.",
      reviewAnnounced: "Schritt 2 des Ablaufs: Angaben prüfen.",
      paymentAnnounced: "Schritt 3 des Ablaufs: Zahlung.",
      confirmationAnnounced: "Letzter Schritt: Bestätigung.",
    },
    review: {
      heading: "Angaben prüfen",
      text: "Bitte prüfen Sie alles, bevor Sie fortfahren. Jedes Feld können Sie bearbeiten.",
      edit: "Angaben bearbeiten",
      submit: "Anfrage senden",
      submitting: "Wird gesendet…",
      toPayment: "Weiter zur Zahlung",
    },
    panel: {
      label: "Beratungsübersicht",
      heading: "Worum es in dieser Beratung geht",
      purpose:
        "Ein Gespräch über Ihre operativen Ziele und die praktischen Wege für die Arbeit — mit den Menschen, die sie umsetzen würden.",
      mode: "Art der Beratung",
      price: "Beratungsgebühr",
      oneTime: "Einmalige Zahlung",
      secureCheckout: "Sichere Zahlung über Stripe.",
      next: "Wie es weitergeht",
      stripeNote:
        "Wenn die Zahlung aktiviert ist, werden Kartendaten auf der gehosteten Stripe-Seite eingegeben — niemals auf dieser Website.",
      footnote:
        "Es wird kein Termin automatisch gebucht. Die Terminierung stimmen wir per E-Mail ab.",
    },
    offer: {
      mode: {
        undecided: "Noch zu bestätigen",
        free: "Kostenloses Erstgespräch",
        paid: "Bezahlte Beratung",
      },
      pricePending: "Noch zu bestätigen",
      next: {
        undecided:
          "Wir prüfen Ihre Anforderungen und bestätigen Format und Preis per E-Mail.",
        free: "Wir stimmen einen Termin per E-Mail ab.",
        paid:
            "Sobald die Zahlung geprüft ist, stimmen wir den Termin per E-Mail ab.",
      },
      duration: "Dauer",
      deliverable: "Das erhalten Sie",
    },
    confirm: {
      heading: "Anfrage erhalten",
      text: "Vielen Dank. Ihre Anforderungen wurden an unser Team gesendet.",
      next: {
        undecided:
          "Wir prüfen sie und bestätigen Format und Preis per E-Mail.",
        free: "Wir stimmen einen Termin per E-Mail ab.",
        paid: "Wir melden uns per E-Mail zur bezahlten Beratung.",
      },
      home: "Zurück zur Startseite",
      startOver: "Weitere Anfrage senden",
    },
    validation: {
      nameRequired: "Bitte geben Sie Ihren vollständigen Namen ein.",
      nameTooLong: "Dieser Name ist zu lang (maximal 120 Zeichen).",
      emailRequired: "Bitte geben Sie Ihre geschäftliche E-Mail-Adresse ein.",
      emailInvalid:
        "Bitte geben Sie eine gültige geschäftliche E-Mail ein, zum Beispiel name@unternehmen.de.",
      emailTooLong: "Diese E-Mail-Adresse ist zu lang.",
      areaRequired: "Bitte wählen Sie ein Interessegebiet.",
      areaInvalid: "Bitte wählen Sie eines der genannten Gebiete.",
      messageRequired: "Bitte beschreiben Sie kurz Ihre Anforderungen.",
      messageTooLong:
        "Bitte kürzen Sie Ihre Beschreibung (maximal 1200 Zeichen).",
      privacyRequired:
        "Bitte bestätigen Sie den Datenschutzhinweis, um fortzufahren.",
    },
  },
};

export const sharedContent = { en: sharedEn, nl: sharedNl, de: sharedDe };

/* ================================================================
   DEVELOPMENT-DEMO COPY — NOT PART OF THE SHIPPING LOCALES.
   ------------------------------------------------------------
   The mock payment journey renders only when the dev-only flag is
   on, so these strings are merged in DEVELOPMENT BUILDS ONLY (see
   LanguageContext). In a production bundle they are never merged and
   are therefore tree-shaken out entirely — no demo copy ships.
   ================================================================ */
export const consultationMockCopy = {
  en: {
    banner: "Development demo. No real payment.",
    heading: "Simulated checkout",
    text: "This step simulates the hosted checkout handoff so the full journey can be reviewed without Stripe or any credentials.",
    area: "Area",
    customer: "Customer",
    status: "Status",
    statusValue: "Awaiting simulation",
    noCardNote: "No card fields are shown and no payment request is made. In production this step is provided by Stripe-hosted Checkout.",
    simulateSuccess: "Simulate successful payment",
    simulateCancel: "Simulate cancelled or failed payment",
    back: "Back to details",
    successHeading: "Simulated payment succeeded",
    successText: "This is a simulated result for the development demo. No money was charged and no payment was verified.",
    cancelHeading: "Simulated payment cancelled",
    cancelText: "This is a simulated cancellation for the development demo. Nothing was charged.",
    failHeading: "Simulated payment failed",
    failText: "This is a simulated failure for the development demo. Nothing was charged.",
    reference: "Demo reference",
    realFlowNote: "In the real flow, the confirmation email is sent only after the backend has verified the payment with Stripe.",
    tryAgain: "Try again",
    backToConsultation: "Back to consultation",
    devNotice: "Development build: a non-production offer scenario is active. No payment can be processed.",
  },
  nl: {
    banner: "Ontwikkeldemo. Geen echte betaling.",
    heading: "Gesimuleerde betaling",
    text: "Deze stap simuleert de overdracht naar de gehoste betaalpagina, zodat u het volledige traject kunt bekijken zonder Stripe of inloggegevens.",
    area: "Gebied",
    customer: "Klant",
    status: "Status",
    statusValue: "Wacht op simulatie",
    noCardNote: "Er worden geen kaartvelden getoond en er wordt geen betalingsverzoek verstuurd. In productie wordt deze stap geleverd door de gehoste betaalpagina van Stripe.",
    simulateSuccess: "Simuleer geslaagde betaling",
    simulateCancel: "Simuleer geannuleerde of mislukte betaling",
    back: "Terug naar gegevens",
    successHeading: "Gesimuleerde betaling geslaagd",
    successText: "Dit is een gesimuleerd resultaat voor de ontwikkeldemo. Er is niets afgeschreven en er is geen betaling geverifieerd.",
    cancelHeading: "Gesimuleerde betaling geannuleerd",
    cancelText: "Dit is een geannuleerde betaling in de ontwikkeldemo. Er is niets afgeschreven.",
    failHeading: "Gesimuleerde betaling mislukt",
    failText: "Dit is een mislukte betaling in de ontwikkeldemo. Er is niets afgeschreven.",
    reference: "Demoreferentie",
    realFlowNote: "In het echte traject wordt de bevestigingsmail alleen verstuurd nadat de backend de betaling met Stripe heeft geverifieerd.",
    tryAgain: "Opnieuw proberen",
    backToConsultation: "Terug naar de consultatie",
    devNotice: "Ontwikkelbuild: een niet-productieve aanbiedingsmodus is actief. Er kan geen betaling worden verwerkt.",
  },
  de: {
    banner: "Entwicklungsdemo. Keine echte Zahlung.",
    heading: "Simulierte Zahlung",
    text: "Dieser Schritt simuliert die Übergabe an die gehostete Zahlungsseite, damit Sie den kompletten Ablauf ohne Stripe und ohne Zugangsdaten ansehen können.",
    area: "Gebiet",
    customer: "Kunde",
    status: "Status",
    statusValue: "Warten auf Simulation",
    noCardNote: "Es werden keine Kartffelder angezeigt und es wird keine Zahlungsanfrage gestellt. Im Produktivbetrieb stellt Stripe die gehostete Zahlungsseite bereit.",
    simulateSuccess: "Erfolgreiche Zahlung simulieren",
    simulateCancel: "Abgebrochene oder fehlgeschlagene Zahlung simulieren",
    back: "Zurück zu den Angaben",
    successHeading: "Simulierte Zahlung erfolgreich",
    successText: "Dies ist ein simuliertes Ergebnis der Entwicklungsdemo. Es wurde nichts abgebucht und keine Zahlung bestätigt.",
    cancelHeading: "Simulierte Zahlung abgebrochen",
    cancelText: "Dies ist eine abgebrochene Zahlung in der Entwicklungsdemo. Es wurde nichts abgebucht.",
    failHeading: "Simulierte Zahlung fehlgeschlagen",
    failText: "Dies ist eine fehlgeschlagene Zahlung in der Entwicklungsdemo. Es wurde nichts abgebucht.",
    reference: "Demo-Referenz",
    realFlowNote: "Im echten Ablauf wird die Bestätigungs-E-Mail erst versendet, nachdem das Backend die Zahlung mit Stripe geprüft hat.",
    tryAgain: "Erneut versuchen",
    backToConsultation: "Zurück zur Beratung",
    devNotice: "Entwicklungsbuild: ein nicht-produktives Angebotsszenario ist aktiv. Es kann keine Zahlung verarbeitet werden.",
  },
};
