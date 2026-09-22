path = r'src\components\sections\About\About.css'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

old = ".about-progression-node {\n  width: 10px;\n  height: 10px;\n  border-radius: 50%;\n  flex-shrink: 0;\n}"
new = """.about-progression-line {
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
  background: var(--about-border);
}

[data-theme="dark"] .about-progression-node { background: #1E293B; }"""

if old in text:
    text = text.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    print('Updated .about-progression-node')
else:
    print('Old not found')
