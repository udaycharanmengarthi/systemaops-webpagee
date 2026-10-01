import { useRef, useEffect } from "react";
import "./Testimonials.css";
import { useLanguage } from "../../i18n/LanguageContext";

const testimonials = [
  {
    text: "This product changed the way our team collaborates. Absolutely love it!",
    image: "https://i.pravatar.cc/40?img=1",
    name: "Sarah Johnson",
    role: "Product Manager",
  },
  {
    text: "Incredibly fast and reliable. Our workflow has improved 10x since switching.",
    image: "https://i.pravatar.cc/40?img=2",
    name: "James Lee",
    role: "Frontend Developer",
  },
  {
    text: "The support team is fantastic. Issues resolved within minutes every time.",
    image: "https://i.pravatar.cc/40?img=3",
    name: "Priya Nair",
    role: "CTO, Startup",
  },
  {
    text: "Clean UI, powerful features. Exactly what we needed for scaling our business.",
    image: "https://i.pravatar.cc/40?img=4",
    name: "Carlos Rivera",
    role: "CEO, Tech Co",
  },
];

const TestimonialsColumn = ({ items = testimonials, duration = 20 }) => {
  const innerRef = useRef(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.animationDuration = `${duration}s`;
  }, [duration]);

  const doubled = [...items, ...items];

  return (
    <div className="tc-wrapper">
      <div className="tc-inner" ref={innerRef}>
        {doubled.map((t, i) => (
          <div className="tc-card" key={`${t.name}-${i}`}>
            <p className="tc-text">“{t.text}”</p>
            <div className="tc-author">
              <img src={t.image} alt={t.name} className="tc-avatar" />
              <div>
                <div className="tc-name">{t.name}</div>
                <div className="tc-role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function TestimonialsPage() {
  const { t } = useLanguage();
  const translatedTestimonials = testimonials.map((item, index) => ({
    ...item,
    text: t("testimonials.items")[index],
  }));

  return (
    <section className="testimonials-sec">
      {/* Ambient background glow matching your platform design */}
      <div className="testimonials-bg-glow" />
      
      <div className="testimonials-header">
        <h2 className="testimonials-heading">{t("testimonials.heading")}</h2>
        <p className="testimonials-sub">{t("testimonials.sub")}</p>
      </div>

      <div className="testimonials-grid">
        <TestimonialsColumn items={translatedTestimonials} duration={18} />
        <TestimonialsColumn items={[...translatedTestimonials].reverse()} duration={22} />
        <TestimonialsColumn items={translatedTestimonials} duration={16} />
      </div>
    </section>
  );
}
