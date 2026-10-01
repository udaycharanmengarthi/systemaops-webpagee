import './WhyChooseUs.css'

import { useState } from 'react'

import {
  BriefcaseBusiness,
  GitBranchPlus,
  Blocks,
  Handshake,
  ArrowUpRight,
} from 'lucide-react'

import { useLanguage } from '../../../../i18n/LanguageContext'

const icons = [
  BriefcaseBusiness,
  GitBranchPlus,
  Blocks,
  Handshake,
]

export default function WhyChooseUs() {
  const { t } = useLanguage()

  const [activeIndex, setActiveIndex] = useState(-1)

  const features = t('whyUs.features').map(
    (item, index) => ({
      ...item,
      icon: icons[index],
    })
  )

  return (
    <section className="why-section">
      <div className="why-container">

        {/* Header */}
        <div className="why-top">

          <span className="why-label">
            {t('whyUs.label')}
          </span>

          <h2 className="why-heading">
            {t('whyUs.heading')}
            <br />

            <span className="gradient-text">
              {t('whyUs.accent')}
            </span>
          </h2>

          <p className="why-sub">
            {t('whyUs.sub')}
          </p>

        </div>

        {/* Cards Rail */}
        <div
          className="why-rail"
          onMouseLeave={() =>
            setActiveIndex(-1)
          }
        >

          {/* Progress Line */}
          <div
            className="rail-progress"
            style={{
              width:
                activeIndex === -1
                  ? '0%'
                  : `${
                      ((activeIndex + 1) /
                        features.length) *
                      100
                    }%`,
            }}
          />

          {/* Feature Cards */}
          {features.map((item, index) => {
            const Icon = item.icon

            return (
              <article
                key={item.no}
                className={`why-item ${
                  activeIndex >= index
                    ? 'active'
                    : ''
                }`}
                onMouseEnter={() =>
                  setActiveIndex(index)
                }
              >

                {/* Number */}
                <div className="why-number">
                  {item.no}
                </div>

                {/* Icon */}
                <div className="why-icon">
                  <Icon size={22} />
                </div>

                {/* Title */}
                <h3>
                  {item.title}
                </h3>

                {/* Description */}
                <p>
                  {item.desc}
                </p>

                {/* Button */}
                <button className="why-btn">
                  {t('whyUs.learnMore')}

                  <ArrowUpRight
                    size={16}
                  />
                </button>

              </article>
            )
          })}

        </div>
      </div>
    </section>
  )
}