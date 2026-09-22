import sys

path = r'src\components\sections\About\About.css'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

s = text.find('TIMELINE')
start = text.rfind('/* ===', 0, s)
e = text.find('OUR STORY', s)
e = text.rfind('/* ===', 0, e)

new_css = """/* ================================================================
   OUR STORY — editorial journey: FROM → THROUGH → TO
   Vertical timeline rail removed. Three-stage journey with
   subtle progression line pointing right toward origin visual.
============================================================ */

/* ── Story Grid ── */
.about-story-grid {
  display: grid;
  grid-template-columns: 0.45fr 0.55fr;
  gap: 40px;
  align-items: center;
}

/* ── Progression Line ── */
.about-progression-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 48px;
  margin-bottom: 32px;
  padding: 0 4px;
}

.about-progression-node {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ── Journey Stage ── */
.about-story-journey-stage {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0;
  position: relative;
}

.about-story-journey-stage:nth-child(1) { margin-top: -8px; }
.about-story-journey-stage:nth-child(2) { margin-top: 0; }
.about-story-journey-stage:nth-child(3) { margin-top: 8px; }

.about-stage-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 4px;
}

.about-stage-label {
  font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--about-text-secondary);
}

.about-stage-phase {
  font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--about-text);
}

.about-stage-title {
  font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
  color: var(--about-text);
  margin: 0;
}

.about-stage-desc {
  font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.65;
  letter-spacing: -0.01em;
  color: var(--about-text-secondary);
  margin: 4px 0 0;
}

.about-story-journey-stage[data-accent="violet"] .about-stage-label,
.about-story-journey-stage[data-accent="violet"] .about-stage-phase { color: #8B7CFF; }
.about-story-journey-stage[data-accent="cyan"] .about-stage-label,
.about-story-journey-stage[data-accent="cyan"] .about-stage-phase { color: #22D3EE; }
.about-story-journey-stage[data-accent="green"] .about-stage-label,
.about-story-journey-stage[data-accent="green"] .about-stage-phase { color: var(--accent-primary); }

/* ── Hover / Focus ── */
.about-story-journey-stage {
  cursor: pointer;
  transition: transform 0.2s ease;
  border-radius: 12px;
  padding-left: 12px;
  padding-right: 12px;
}

.about-story-journey-stage:hover,
.about-story-journey-stage:focus-visible {
  transform: translateX(3px);
  background: rgba(255, 255, 255, 0.04);
  outline: none;
}

.about-story-journey-stage:focus-visible {
  border-left: 2px solid var(--accent-primary);
}

.about-story-journey-stage:hover .about-stage-phase,
.about-story-journey-stage:focus-visible .about-stage-phase { filter: brightness(1.2); }

/* ── Origin Visual Panel ── */
.about-story-visual-panel {
  background: var(--bg-elevated);
  border-radius: 24px;
  padding: 40px;
  position: relative;
  overflow: hidden;
}
[data-theme="dark"] .about-story-visual-panel { background: #0E1725; }
.about-origin-svg { width: 100%; height: auto; display: block; }

/* ── Section header spacing ── */
.about-section-header { margin-bottom: 32px; }

/* ── Mobile ── */
@media (max-width: 768px) {
  .about-story-grid { grid-template-columns: 1fr; gap: 24px; }
  .about-story-journey-stage { flex-direction: row; align-items: baseline; gap: 12px; margin-top: 0 !important; }
  .about-story-journey-stage:nth-child(1),
  .about-story-journey-stage:nth-child(2),
  .about-story-journey-stage:nth-child(3) { margin-top: 0; }
  .about-stage-phase { font-size: 1.4rem; }
  .about-stage-title { font-size: 1.1rem; }
  .about-progression-line { margin-top: 24px; margin-bottom: 16px; }
  .about-story-visual-panel { margin-top: 8px; }
}"""

new_text = text[:start] + new_css + text[e:]
with open(path, 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Replacement done successfully')
print(f'Old length: {len(text)}, New length: {len(new_text)}')
