import {useState} from 'react'
import {
  Cpu,
  Database,
  Clock3,
  TrendingUp,
  Workflow,
  FileSpreadsheet,
  Users,
  ShieldAlert,
  Layers3,
  GitBranchPlus,
  Gauge,
  Boxes,
  ArrowRight,
  TriangleAlert,
  Settings2,
  LineChart,
} from 'lucide-react'

import './BusinessPain.css'
import { useLanguage } from '../../i18n/LanguageContext'

const CONTENT = {
  default: [
    {
      icon: <Workflow size={30} strokeWidth={2} />,
      title: 'Manual Processes',
      desc:
        'Teams waste hours repeating approvals, admin tasks and disconnected workflows.',
    },
    {
      icon: <Database size={30} strokeWidth={2} />,
      title: 'Disconnected Systems',
      desc:
        'CRMs, spreadsheets and internal tools rarely sync properly.',
    },
    {
      icon: <Clock3 size={30} strokeWidth={2} />,
      title: 'Slow Operations',
      desc:
        'Fragmented systems create delays and slow execution.',
    },
    {
      icon: <TrendingUp size={30} strokeWidth={2} />,
      title: 'Scaling Problems',
      desc:
        'Processes that worked early begin breaking as teams grow.',
    },
  ],

  bottlenecks: [
    {
      icon: <ShieldAlert size={30} strokeWidth={2} />,
      title: 'Slow Execution',
      desc:
        'Approval chains and repetitive steps create delivery bottlenecks.',
    },
    {
      icon: <Users size={30} strokeWidth={2} />,
      title: 'Context Switching',
      desc:
        'Teams constantly move between disconnected apps and workflows.',
    },
    {
      icon: <Gauge size={30} strokeWidth={2} />,
      title: 'Operational Delays',
      desc:
        'Manual coordination slows decision-making and execution speed.',
    },
    {
      icon: <GitBranchPlus size={30} strokeWidth={2} />,
      title: 'Broken Workflows',
      desc:
        'Disconnected systems introduce friction at every stage.',
    },
  ],

  manual: [
    {
      icon: (
        <FileSpreadsheet
          size={30}
          strokeWidth={2}
        />
      ),
      title: 'Spreadsheet Dependency',
      desc:
        'Critical workflows still depend on manual spreadsheet tracking.',
    },
    {
      icon: <Workflow size={30} strokeWidth={2} />,
      title: 'Approval Loops',
      desc:
        'Manual approvals slow productivity and reduce execution speed.',
    },
    {
      icon: <Users size={30} strokeWidth={2} />,
      title: 'Human Dependency',
      desc:
        'Processes rely too heavily on manual intervention.',
    },
    {
      icon: <Cpu size={30} strokeWidth={2} />,
      title: 'Repetitive Admin',
      desc:
        'Teams waste hours on repetitive operational tasks.',
    },
  ],

  scaling: [
    {
      icon: <Cpu size={30} strokeWidth={2} />,
      title: 'System Complexity',
      desc:
        'Growing businesses expose operational limitations quickly.',
    },
    {
      icon: <Layers3 size={30} strokeWidth={2} />,
      title: 'Cross-Team Dependency',
      desc:
        'Growth increases coordination overhead between teams.',
    },
    {
      icon: <Boxes size={30} strokeWidth={2} />,
      title: 'Tool Explosion',
      desc:
        'More software creates fragmented operational workflows.',
    },
    {
      icon: <TrendingUp size={30} strokeWidth={2} />,
      title: 'Execution Gaps',
      desc:
        'Systems that worked early fail to scale with business growth.',
    },
  ],
}

const BusinessPain = () => {
  const [active, setActive] =
    useState('default')
  const { t } = useLanguage()
  const activeText = t(`pain.groups.${active}`)

  return (
    <section className="pain-section">
      <div className="pain-container">
        <div className="pain-left">
          <div className="pain-pill">
            {t('pain.pill')}
          </div>

          <h2 className="pain-heading">
            {t('pain.heading')}
            <span>
              {t('pain.headingAccent')}
            </span>
          </h2>

          <p className="pain-desc">
            {t('pain.desc')}
          </p>

          <div className="pain-helper">
            <span>
              {t('pain.helper')}
            </span>

            <ArrowRight
              size={16}
              className="pain-helper-arrow"
            />
          </div>

          <div className="pain-tabs">
            <button
              className={`pain-tab ${
                active ===
                'bottlenecks'
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                setActive(
                  'bottlenecks',
                )
              }
            >
              <TriangleAlert size={16} />
              {t('pain.tabs.bottlenecks')}
            </button>

            <button
              className={`pain-tab ${
                active ===
                'manual'
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                setActive('manual')
              }
            >
              <Settings2 size={16} />
              {t('pain.tabs.manual')}
            </button>

            <button
              className={`pain-tab ${
                active ===
                'scaling'
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                setActive('scaling')
              }
            >
              <LineChart size={16} />
              {t('pain.tabs.scaling')}
            </button>
          </div>
        </div>

        <div className="pain-right">
          {CONTENT[active].map(
            (item, index) => (
              <div
                className={`pain-card${active === 'default' ? ' pain-card--gold' : ''}`}
                key={activeText[index][0]}
              >
                <div className="pain-icon">
                  {item.icon}
                </div>

                <h3>
                  {activeText[index][0]}
                </h3>

                <p>{activeText[index][1]}</p>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  )
}

export default BusinessPain
