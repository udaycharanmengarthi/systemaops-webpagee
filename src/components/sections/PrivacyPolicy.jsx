import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
  return (
    <section className="privacy-page">
      <div className="privacy-container">
        <span className="privacy-tag">LEGAL</span>

        <h1 className="privacy-title">Privacy Policy</h1>

        <p className="privacy-date">Effective Date: October 12, 2025</p>

        <div className="privacy-content">
          <div className="privacy-block">
            <h2>Who We Are</h2>

            <p>
              SystemaOps (“we”, “our”, “us”) is committed to protecting your
              privacy and complying with applicable data protection laws,
              including GDPR.
            </p>
          </div>

          <div className="privacy-block">
            <h2>Data We Collect</h2>

            <ul>
              <li>Contact information: Name, email, phone</li>

              <li>Usage data: IP address, browser, device, pages visited</li>

              <li>
                Cookies & tracking: Necessary cookies for site functionality;
                optional analytics cookies with consent
              </li>

              <li>
                Embedded content: YouTube, Google Maps, and other third-party
                content may collect data
              </li>
            </ul>
          </div>

          <div className="privacy-block">
            <h2>How We Use Your Data</h2>

            <ul>
              <li>Provide and improve services</li>
              <li>Respond to inquiries and requests</li>
              <li>Analyze website usage to improve user experience</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </div>

          <div className="privacy-block">
            <h2>Sharing Data</h2>

            <ul>
              <li>We do not sell or rent personal data</li>

              <li>Trusted service providers may process data on our behalf</li>

              <li>Data may be disclosed to comply with legal obligations</li>
            </ul>
          </div>

          <div className="privacy-block">
            <h2>Your Rights</h2>

            <ul>
              <li>
                Access, correct, delete, or restrict processing of your personal
                data
              </li>

              <li>Object to processing or withdraw consent</li>

              <li className="privacy-contact">
                Contact:{" "}
                <a
                  href="mailto:info@systemaops.com"
                  className="privacy-email-link"
                >
                  info@systemaops.com
                </a>
              </li>
            </ul>
          </div>

          <div className="privacy-block">
            <h2>Cookies & Consent</h2>

            <ul>
              <li>A consent banner appears when you first visit the site</li>

              <li>Necessary cookies are always enabled</li>

              <li>
                Optional cookies require consent and can be managed via browser
                settings
              </li>
            </ul>
          </div>

          <div className="privacy-block">
            <h2>Data Retention</h2>

            <p>
              Personal data is stored only as long as needed or required by law.
            </p>
          </div>

          <div className="privacy-block">
            <h2>Policy Updates</h2>

            <p>
              This policy may be updated. The latest version will always be
              available on this page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
