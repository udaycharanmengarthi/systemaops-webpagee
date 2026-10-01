import './Services1.css'
import { useLanguage } from '../../../../i18n/LanguageContext'
import {
  BrainCircuit,
  Boxes,
  GitBranchPlus,
  MonitorSmartphone,
  LayoutDashboard,
  PackageSearch,
  ReceiptText,
  Orbit,
} from 'lucide-react'

const services = [
  {
    title: 'AI Automation',
    desc: 'Production-ready AI workflows that reduce repetitive work and improve operational efficiency.',
    icon: BrainCircuit,
    accent: 'cyan',
    tags: ['AI', 'Automation', 'LLM'],
    featured: false,
  },
  {
    title: 'Odoo ERP',
    desc: 'Full ERP customization, implementation and scalable systems built around your workflows.',
    icon: Boxes,
    accent: 'purple',
    tags: ['ERP', 'Odoo', 'Python'],
    featured: true,
  },
  {
    title: 'Workflow Automation',
    desc: 'Automate repetitive operations and connect systems using workflows.',
    icon: GitBranchPlus,
    accent: 'blue',
    tags: ['n8n', 'Zapier', 'API'],
  },
  {
    title: 'CRM Customization',
    desc: 'Tailored CRM pipelines, lead tracking and automation for sales teams.',
    icon: LayoutDashboard,
    accent: 'green',
    tags: ['CRM', 'Sales', 'Leads'],
  },
  {
    title: 'Website Development',
    desc: 'Modern business websites and customer portals built around Odoo.',
    icon: MonitorSmartphone,
    accent: 'cyan',
    tags: ['React', 'SEO', 'Odoo'],
  },
  {
    title: 'Inventory Management',
    desc: 'Inventory systems optimized for stock tracking and fulfillment.',
    icon: PackageSearch,
    accent: 'orange',
    tags: ['Inventory', 'Warehouse', 'Tracking'],
  },
  {
    title: 'Invoicing & Accounting',
    desc: 'Smart accounting workflows, invoicing and finance operations.',
    icon: ReceiptText,
    accent: 'gold',
    tags: ['Invoices', 'Finance', 'Reports'],
  },
  {
    title: 'Custom Module Development',
    desc: 'Tailored Odoo modules designed around unique business requirements.',
    icon: Boxes,
    accent: 'pink',
    tags: ['Custom', 'Python', 'Modules'],
  },
  {
    title: 'Odoo Integration',
    desc: 'Connect ERP, CRM, payment systems and third-party platforms.',
    icon: Orbit,
    accent: 'teal',
    tags: ['API', 'Webhook', 'ERP'],
  },
]

export default function Services1() {
  const { t } = useLanguage()

  const translatedServices = services.map((service, index) => ({
    ...service,
    ...t('servicesPage.items')[index],
  }))

  const featured = translatedServices.filter(
    (s) => s.featured
  )

  const normal = translatedServices.filter(
    (s) => !s.featured
  )

  return (
    <section className="services-section">
      <div className="services-container">


        <h2 className="services-heading fade-in-el">
          {t('servicesPage.heading')}
          <br />
          {t('servicesPage.headingAccent')}
        </h2>

        <p className="services-sub fade-in-el">
          {t('servicesPage.sub')}
        </p>

        {/* Featured row */}
        <div className="featured-grid">
          <ServiceCard
            service={translatedServices[0]}
            learnMore={t('servicesPage.learnMore')}
          />

          {featured.map((service) => (
            <ServiceCard
              key={service.title}
              service={service}
              learnMore={t('servicesPage.learnMore')}
            />
          ))}
        </div>

        {/* Normal cards */}
        <div className="service-grid">
          {normal.slice(1).map((service) => (
            <ServiceCard
              key={service.title}
              service={service}
              learnMore={t('servicesPage.learnMore')}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

function ServiceCard({ service, learnMore }) {
  const Icon = service.icon

  return (
    <div
      className={`service-card ${
        service.featured ? 'featured' : ''
      } ${service.accent}`}
    >
      <div className="service-icon">
        <Icon size={28} />
      </div>

      <h3>{service.title}</h3>

      <p>{service.desc}</p>

      <div className="service-tags">
        {service.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <button className="learn-btn">
        {learnMore}
        <span>→</span>
      </button>
    </div>
  )
}