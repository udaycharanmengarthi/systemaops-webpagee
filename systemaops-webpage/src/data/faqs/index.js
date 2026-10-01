/**
 * data/faqs/index.js
 *
 * Comprehensive FAQ data for the SystemaOps FAQ page.
 * Organized by category for grouped rendering and FAQPage schema.
 *
 * To add FAQs: append to the relevant category's `items` array,
 * or add a new category object.
 */

export const faqCategories = [
  {
    id: "workflow-automation",
    label: "Workflow Automation",
    accentColor: "#1A7F7F",
    items: [
      {
        id: "wa-1",
        question: "What is business workflow automation?",
        answer:
          "Business workflow automation replaces manual, repetitive processes — like approvals, data entry, and task routing — with connected, self-running systems. Instead of someone manually moving information from one place to another, automated workflows do it instantly and accurately, every time.",
      },
      {
        id: "wa-2",
        question: "Which workflows should I automate first?",
        answer:
          "Start with the process that causes the most friction today. Approval chains stuck in email, data that gets re-entered across multiple systems, and customer/lead routing are the three areas where automation typically pays off fastest. Automating one high-friction workflow builds confidence and proves value quickly.",
      },
      {
        id: "wa-3",
        question: "How long does it take to see ROI from automation?",
        answer:
          "Businesses that start with one focused, high-impact workflow typically see measurable time savings within the first few weeks. The ROI compounds over time as the same automated process handles increasing volume without additional headcount.",
      },
      {
        id: "wa-4",
        question: "Will workflow automation replace our existing tools?",
        answer:
          "No. Workflow automation connects the tools you already use — CRMs, ERPs, spreadsheets, email, communication platforms — rather than replacing them. The goal is to make your existing stack work together automatically.",
      },
      {
        id: "wa-5",
        question: "How does workflow automation handle errors or exceptions?",
        answer:
          "Well-built automation systems include error handling, alerts, and fallback paths. When something unexpected happens — a missing field, a failed API call — the workflow either handles it gracefully or notifies the right person to intervene, rather than silently failing.",
      },
    ],
  },
  {
    id: "n8n",
    label: "n8n Development",
    accentColor: "#2A9D9C",
    items: [
      {
        id: "n8n-1",
        question: "What is n8n and why do businesses use it?",
        answer:
          "n8n is an open-source workflow automation platform that lets businesses connect tools and automate processes visually — without per-task pricing. Unlike Zapier or Make, n8n can be self-hosted for full data control, supports custom code for complex logic, and includes native AI nodes for building intelligent automation workflows.",
      },
      {
        id: "n8n-2",
        question: "Is n8n better than Zapier for my business?",
        answer:
          "Zapier is faster to get started with for simple, low-volume automations. n8n becomes the stronger choice as complexity or volume grows, since its execution-based pricing avoids per-task costs, and its support for custom code handles logic that no-code tools can't.",
      },
      {
        id: "n8n-3",
        question: "Do we need a developer to use n8n?",
        answer:
          "Day-to-day use of existing n8n workflows doesn't require a developer. But building and maintaining production-grade n8n systems — with proper error handling, monitoring, and scalability — does require technical expertise. Most growing businesses partner with a team like SystemaOps rather than hire a full-time automation engineer.",
      },
      {
        id: "n8n-4",
        question: "Can n8n handle AI-powered workflows?",
        answer:
          "Yes. n8n has native AI nodes that connect directly to models like OpenAI and Claude inside the same visual canvas. You can build workflows that classify tickets, draft emails, summarize data, or route requests intelligently — with human-in-the-loop approval steps wherever needed.",
      },
      {
        id: "n8n-5",
        question: "What tools can n8n connect to?",
        answer:
          "n8n supports over 400 native integrations including Slack, Google Workspace, HubSpot, Salesforce, Odoo, Airtable, PostgreSQL, MySQL, HTTP/webhooks, and all major AI APIs. If a native integration doesn't exist, custom HTTP request nodes or code nodes can connect to virtually any API.",
      },
    ],
  },
  {
    id: "odoo-erp",
    label: "Odoo ERP",
    accentColor: "#3BA3A1",
    items: [
      {
        id: "odoo-1",
        question: "What is Odoo ERP and who is it for?",
        answer:
          "Odoo is an open-source ERP platform that covers accounting, inventory, CRM, manufacturing, HR, project management, and more in a single system. It's particularly well-suited for growing small and mid-sized businesses that need integrated operations without the cost of enterprise ERP systems like SAP or Oracle.",
      },
      {
        id: "odoo-2",
        question: "When does a business outgrow standard Odoo?",
        answer:
          "The clearest signs are: workaround spreadsheets appearing outside the system, approvals happening over email instead of inside Odoo, reporting that takes days instead of minutes, and new tools being added because default Odoo modules don't quite fit the business's specific processes.",
      },
      {
        id: "odoo-3",
        question: "Is Odoo customization worth it, or should we switch ERPs?",
        answer:
          "In almost every case, targeted Odoo customization is significantly cheaper and less disruptive than switching ERPs. A full ERP migration involves data migration costs, retraining, and weeks or months of disruption. Customization addresses specific gaps without touching what already works.",
      },
      {
        id: "odoo-4",
        question: "Will Odoo customization break future version upgrades?",
        answer:
          "Not if it's done correctly. Customizations built using Odoo's inheritance architecture — adding or extending modules rather than editing core code directly — remain compatible with future Odoo versions. SystemaOps follows this approach on every implementation.",
      },
      {
        id: "odoo-5",
        question: "How long does an Odoo implementation or customization take?",
        answer:
          "A focused customization — a custom report or approval workflow — can be delivered in days to a few weeks. A full Odoo implementation covering multiple modules across an entire business typically takes 2–4 months. Phased rollouts let businesses address the most urgent needs first.",
      },
    ],
  },
  {
    id: "ai-automation",
    label: "AI Automation",
    accentColor: "#1A7F7F",
    items: [
      {
        id: "ai-1",
        question: "What's the difference between AI automation and regular workflow automation?",
        answer:
          "Traditional workflow automation follows fixed, rule-based logic — if X happens, do Y. AI automation adds intelligence: it can classify unstructured data, generate responses, make decisions based on context, and adapt to inputs that don't follow a predictable pattern. The two approaches work best together.",
      },
      {
        id: "ai-2",
        question: "Can AI automation run without human oversight?",
        answer:
          "It depends on the use case. For internal data processing or classification, full automation is often safe. For anything customer-facing — replies, approvals, financial actions — a human-in-the-loop step is strongly recommended until the system has proven accuracy over time.",
      },
      {
        id: "ai-3",
        question: "Which business processes benefit most from AI automation?",
        answer:
          "The highest-value use cases are typically: support ticket classification and routing, lead scoring and enrichment, document extraction and processing, report summarization, and draft generation for repetitive communications. These are all high-volume, pattern-based tasks where AI consistency outperforms manual handling.",
      },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    accentColor: "#2A9D9C",
    items: [
      {
        id: "int-1",
        question: "What systems can SystemaOps integrate with Odoo?",
        answer:
          "SystemaOps has built integrations connecting Odoo to e-commerce platforms (Shopify, WooCommerce), payment gateways, shipping providers, CRMs, marketing tools, custom APIs, and third-party databases. If it has an API, it can be integrated.",
      },
      {
        id: "int-2",
        question: "How long does a custom integration take to build?",
        answer:
          "A straightforward API integration — connecting two systems with a defined data flow — typically takes 1–3 weeks depending on API complexity. Integrations requiring custom data transformation, error handling, or real-time synchronization take longer.",
      },
      {
        id: "int-3",
        question: "Will integrations break when systems update?",
        answer:
          "API-based integrations can be affected by version changes in the connected systems. SystemaOps includes monitoring and maintenance support to catch and fix breaking changes before they impact operations.",
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing & Engagement",
    accentColor: "#3BA3A1",
    items: [
      {
        id: "price-1",
        question: "How does SystemaOps price its services?",
        answer:
          "Pricing depends on scope — the number of workflows, the complexity of integrations, and the level of ongoing support needed. Every engagement starts with a discovery call to map the actual bottlenecks, which gives us enough information to provide an accurate project estimate. Contact us to start that conversation.",
      },
      {
        id: "price-2",
        question: "Is there a minimum engagement size?",
        answer:
          "We work with growing businesses at different stages. Some engagements start with a single automation workflow and expand over time; others involve full Odoo implementations from day one. The right starting point depends on where the highest-friction problems are today.",
      },
      {
        id: "price-3",
        question: "Do you offer ongoing support after a project is delivered?",
        answer:
          "Yes. Most clients retain SystemaOps on an ongoing basis for monitoring, optimization, and expanding automation as the business grows. A system delivered without ongoing support tends to drift as the business changes — ongoing engagement is how automation stays aligned with operations.",
      },
    ],
  },
  {
    id: "small-business",
    label: "Small Business",
    accentColor: "#1A7F7F",
    items: [
      {
        id: "smb-1",
        question: "Is automation only for large enterprises?",
        answer:
          "No — smaller businesses often see faster ROI from automation because they're typically running leaner teams where every hour saved has a bigger proportional impact. Automation doesn't require a large IT department or a six-figure budget to deliver real results.",
      },
      {
        id: "smb-2",
        question: "What if our team isn't technical?",
        answer:
          "Automation systems built by SystemaOps are designed to run in the background without requiring technical intervention from the team using them. Day-to-day operations don't require touching the automation — it just handles the work. When changes are needed, we handle them.",
      },
      {
        id: "smb-3",
        question: "How do we get started if we don't know which process to automate first?",
        answer:
          "That's exactly what the discovery call is for. We map your current workflows, find where manual work is actually costing the most time, and recommend a starting point that delivers measurable results quickly — rather than asking you to decide before you have all the information.",
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    accentColor: "#2A9D9C",
    items: [
      {
        id: "sup-1",
        question: "What happens if an automation breaks after launch?",
        answer:
          "All SystemaOps automations are built with monitoring and alerting. If something breaks, we're typically notified before the client is. Clients on support plans receive priority response times and proactive maintenance to prevent issues before they impact operations.",
      },
      {
        id: "sup-2",
        question: "How quickly does SystemaOps respond to support requests?",
        answer:
          "Response times depend on the support tier. We typically respond to critical issues within a few hours and non-critical questions within one business day. Specific SLAs are defined as part of the engagement agreement.",
      },
      {
        id: "sup-3",
        question: "Can we make changes to automations ourselves after handoff?",
        answer:
          "Yes, with some caveats. Simple configuration changes — updating a recipient, changing a threshold — are designed to be accessible without developer involvement. More complex logic changes benefit from SystemaOps involvement to avoid unintended side effects in connected workflows.",
      },
    ],
  },
];

/**
 * Flatten all FAQ items into a single array (for FAQPage schema).
 * @returns {Array<{question: string, answer: string}>}
 */
export function getAllFaqs() {
  return faqCategories.flatMap((cat) =>
    cat.items.map(({ question, answer }) => ({ question, answer }))
  );
}

/**
 * Legacy flat array export for backward compatibility.
 */
export const faqs = getAllFaqs();
