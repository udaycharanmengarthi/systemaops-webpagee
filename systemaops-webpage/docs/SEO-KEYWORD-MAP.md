# SystemaOps SEO Keyword Map

## Based on actual repository services and content

This map uses only services and content that exist in the codebase. No imaginary services or invented keywords.

---

## COMMERCIAL INTENT (Service Pages)

These are queries people use when looking for a company that provides the service. Each maps to an actual service page.

| Primary Keyword | Searcher Problem | Target Page | CTA | Schema |
|---|---|---|---|---|
| **AI automation services** | Need to automate repetitive tasks, reduce manual work | `/ai-automation` | "Discuss an AI workflow" / "Book a Free Call" | `Service` |
| **Business workflow automation** | Processes are slow, error-prone, manually intensive | `/workflow-automation` | "Discuss observability" | `Service` |
| **Odoo ERP customization** | ERP doesn't fit business processes, needs tailoring | `/odoo-customization` | "Discuss your integration" | `Service` |
| **n8n workflow development** | Want self-hosted automation without per-step fees | `/n8n-development` | "Discuss n8n" | `Service` (implicit via page) |
| **System integration services** | Tools are separate, data trapped in isolated systems | `/system-integrations` | "Plan an integration" | `Service` |
| **Data & document automation** | Documents arrive faster than can be read/filed; manual data entry | `/data-document-automation` | "Process document" | `Service` |
| **DevOps & observability** | Can't see system health; failures surface via customers; alert fatigue | `/devops-observability` | "Plan observability" | `Service` |
| **AI consulting** | Don't know where to start with AI; need roadmap to measurable value | `/ai-consulting` | "Have a process where AI could do more than answer?" | `Service` |

### Secondary commercial intent (long-tail)

| Keyword | Searcher Problem | Target Page |
|---|---|---|
| AI agents for business | Need AI that works with existing tools, not a chatbot | `/ai-automation` |
| Odoo implementation services | Need ERP configured to match business operations | `/odoo-customization` |
| Workflow automation company | Want to automate across existing tools without rip-and-replace | `/workflow-automation` |
| API integration services | Need systems to talk to each other automatically | `/system-integrations` |
| Document processing automation | Need to extract data from invoices, forms, contracts | `/data-document-automation` |
| AIOps monitoring | Want to detect issues before they become incidents | `/devops-observability` |
| AI consulting firm | Need strategy, not just prompts | `/ai-consulting` |

---

## INFORMATIONAL INTENT (Blog/Article Topics)

These are queries people use when researching, not yet ready to buy. Each should map to a blog article or page section.

| Keyword | Searcher Problem | Content Requirement | Target Page |
|---|---|---|---|
| What is business workflow automation | New to the concept; want to understand basics | Define workflow automation, how it differs from RPA, typical use cases | `/blogs` or blog article |
| How Odoo automation works | Considering Odoo; want to understand capabilities | Explain Odoo workflow automation, integration examples | `/blogs` or `Odoo` page section |
| How n8n workflow automation works | Heard of n8n; want to understand self-hosted automation | Explain n8n basics, self-hosted vs cloud, typical workflows | `/blogs` or `n8n-development` page |
| What is AI automation | Business leaders exploring AI options | Define AI automation, AI vs traditional, where it applies | `/blogs` or `AIAutomation` page section |
| Document processing automation | Have document-heavy processes; want to understand AI options | Explain IDP, OCR, AI document classification, ERP integration | `/blogs` or `DataDocumentAutomation` page section |
| AI vs traditional automation | Comparing approaches; want rational decision guide | Compare AI agents + workflow automation vs rules-based, human-staffed | `/blogs` |
| ERP workflow automation | Have ERP; want to automate within it | Explain how Odoo + n8n + AI can automate ERP workflows | `/blogs` or `Odoo` page section |
| System integration best practices | Have multiple tools; want to connect them | API design, webhook patterns, data sync, exception handling | `/blogs` or `SystemIntegrations` page section |
| DevOps observability best practices | Want to set up monitoring; want practical guide | How to instrument apps, collect logs/metrics, set alerts, respond | `/blogs` or `DevOpsObservability` page section |
| AI integration with existing systems | Already have tools; want to add AI without replacing everything | Explain how AI agents connect via APIs, webhooks, scoped tools | `/blogs` or `AIAutomation` page section |

---

## SERVICE-SPECIFIC SEMANTIC TOPICS

Each service page already has deep semantic content (from i18n `serviceDetail.<id>.*`). These are not "keywords" to stuff — they are actual topic coverage that should be reinforced in metadata and structured data.

### AI Automation semantic coverage (already in `ai.js`):
- AI agents, tool calling, document workflows, task automation, human-in-the-loop, workflow orchestration
- Architecture: context → agent → tools/data/rules → action → human check
- Use cases: incident response, document processing, system monitoring, workflow decisions, operations assistance, exception handling
- Guardrails: policy check, permission check, business rule check
- Implementation: signal mapping, system connections, AI logic, guardrails, monitoring

### Odoo ERP semantic coverage (from `odoo` translations):
- ERP, CRM, business applications tailored to how you operate
- Architecture: five modules → vertical bus → Odoo core → business workflows
- Use cases: various business modules converging through Odoo

### Workflow Automation semantic coverage (from `workflow.js`):
- Technical visual: trigger → workflow → decision → action, with exception → human review
- Ecosystem: tech groups (APIs, databases, etc.)
- Use cases: various automation scenarios
- Process: instrument, observe, detect, respond

### System Integrations semantic coverage (from `integration.js`):
- API integrations, webhooks, data sync, auth & access, error handling, monitoring
- Architecture: source systems → integration layer → business workflow
- Use cases: ERP↔CRM sync, webhook-driven workflows, DB↔app integration, external↔internal

### Data & Document Automation semantic coverage (from `data.js`):
- Document → understand → validate → structure → act pipeline
- Capabilities: inbox, scan search, list checks, arrow down/up, send, user check
- Processing: scanning → extracting → validating → done
- Checkpoint: human review steps

### DevOps & Observability semantic coverage (from `devops.js`):
- Deploy → observe → detect → respond loop
- Capabilities: deployment visibility, application monitoring, logs, metrics, health checks, alerts with context
- Architecture: applications → services → databases → workers all feed observability layer
- Use cases: application health monitoring, workflow monitoring, API visibility, background worker monitoring

### AI Consulting semantic coverage (from `consulting.js`):
- Strategy: assess → rank → roadmap → deliver
- Architecture: business needs → AI strategy → connected systems → operational outcomes
- Use cases: various consulting scenarios
- Path: implementation path steps
- Outcomes: measurable business value

---

## KEYWORD STRATEGY NOTES

1. **Do NOT claim these are high-volume keywords** — no keyword research was performed. These are semantic topic coverages based on actual service descriptions.

2. **Use semantic topic coverage** rather than repeating exact keywords. The i18n content already contains rich topic vocabularies; the SEO work is to make that content discoverable, not to force exact-match keywords.

3. **Primary intent → service page** is the mapping model. People searching "AI automation services" land on `/ai-automation`. People searching "how Odoo automation works" may land on a blog article or the `/odoo-customization` page.

4. **Long-tail / informational** queries should map to blog articles (which need content creation) or deep page sections that already have the answer.

5. **Brand name "SystemaOps"** should rank for company-name queries. Ensure `Organization` schema and consistent `name`, `url`, `logo`, `description` across all pages.

6. **Localization**: German traffic exists (per analytics snapshot). German translations exist for all service metadata. Ensure hreflang correctly routes German users to `/de`-prefixed pages.

---