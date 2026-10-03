import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./App.css";

/* UI */
import Reveal from "./components/ui/Reveal";

/* Layout */
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer/Footer";

/* HOME PAGE */
import Hero from "./components/sections/Home/Hero";
import Services from "./components/sections/Services";
import BusinessPain from "./components/sections/BusinessPain";
import ButtonCta from "./components/sections/ButtonCta";
import WorkflowSystem from "./components/sections/WorkflowSystem";
import HowItWorks from "./components/sections/HowItWorks";
import OperationalImpact from "./components/sections/OperationalImpact";

/* OTHER PAGES */
import About from "./components/sections/About";
import ContactUs from "./components/sections/ContactUs";
import Careers from "./components/sections/Careers";
import PrivacyPolicy from "./components/sections/PrivacyPolicy";

/* SERVICE SECTIONS */
import N8nWorkflowProcess from "./components/sections/SERVICES/N8nWorkflowProcess/N8nWorkflowProcess";

/* AI AUTOMATION PAGE */
import AIAutomation from "./pages/AIAutomation";

/* ODOO + WORKFLOW PAGES (redesigned) */
import OdooPage from "./pages/Odoo";
import WorkflowPage from "./pages/Workflow";

/* NEW SERVICE PAGES */
import SystemIntegrations from "./pages/SystemIntegrations";
import DataDocumentAutomation from "./pages/DataDocumentAutomation";
import DevOpsObservability from "./pages/DevOpsObservability";
import AIConsulting from "./pages/AIConsulting";

/* BLOG PAGES */
import BlogListing from "./pages/Blogs/BlogListing";
import BlogArticle from "./pages/Blogs/BlogArticle";

/* FAQ PAGE */
import FaqsPage from "./pages/Faqs";

import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";

/* ---------- HOME PAGE ---------- */

function HomePage() {
  return (
    <>
      <Helmet>
        <title>
          SystemaOps | AI Automation & Odoo ERP Solutions
        </title>

        <meta
          name="description"
          content="SystemaOps provides AI Automation, Odoo ERP, Workflow Automation, n8n Development and Enterprise Software Solutions."
        />

        <link
          rel="canonical"
          href="https://www.systemaops.com/"
        />
      </Helmet>

      <Hero />

      <BusinessPain />

      <div id="services">
        <Services />
      </div>

      <WorkflowSystem />
      <HowItWorks />
      <OperationalImpact />

      <ButtonCta />
    </>
  );
}

/* ---------- OTHER PAGES ---------- */

function AboutPage() {
  return <About />;
}

function ContactPage() {
  return <ContactUs />;
}

function CareersPage() {
  return <Careers />;
}

/* ---------- ODOO PAGE ---------- */

function OdooCustomizationPage() {
  return <OdooPage />;
}

/* ---------- WORKFLOW AUTOMATION PAGE ---------- */

function BusinessWorkflowAutomationsPage() {
  return <WorkflowPage />;
}

/* ---------- N8N PAGE ---------- */

function N8nWorkflowProcessPage() {
  return (
    <Reveal>
      <N8nWorkflowProcess />
    </Reveal>
  );
}

/* ---------- PRIVACY PAGE ---------- */

function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}

/* ---------- BLOG PAGES ---------- */

function BlogListingPage() {
  return <BlogListing />;
}

function BlogArticlePage() {
  return <BlogArticle />;
}

/* ---------- APP ---------- */

function App() {
  return (
    <div className="app-root relative w-full min-h-screen overflow-x-hidden">

      {/* NAVBAR */}

      <Navbar />

      {/* PAGE CONTENT */}

      <div className="relative z-10">

        <ScrollToTop />

        <Routes>

          {/* ================= HOME ================= */}

          <Route
            path="/"
            element={<HomePage />}
          />

          {/* ================= ABOUT ================= */}

          <Route
            path="/about"
            element={<AboutPage />}
          />

          {/* ================= CONTACT ================= */}

          <Route
            path="/contact"
            element={<ContactPage />}
          />

          {/* ================= SERVICES ================= */}

          {/* AI AUTOMATION */}

          <Route
            path="/ai-automation"
            element={
              <AIAutomation />
            }
          />

          {/* ODOO CUSTOMIZATION */}

          <Route
            path="/odoo-customization"
            element={
              <OdooCustomizationPage />
            }
          />

          {/* WORKFLOW AUTOMATION */}

          <Route
            path="/workflow-automation"
            element={
              <BusinessWorkflowAutomationsPage />
            }
          />

          {/* N8N DEVELOPMENT */}

          <Route
            path="/n8n-development"
            element={
              <N8nWorkflowProcessPage />
            }
          />

          {/* SYSTEM INTEGRATION & APIS */}

          <Route
            path="/system-integrations"
            element={
              <SystemIntegrations />
            }
          />

          {/* DATA & DOCUMENT AUTOMATION */}

          <Route
            path="/data-document-automation"
            element={
              <DataDocumentAutomation />
            }
          />

          {/* DEVOPS & OBSERVABILITY */}

          <Route
            path="/devops-observability"
            element={
              <DevOpsObservability />
            }
          />

          {/* AI CONSULTING */}

          <Route
            path="/ai-consulting"
            element={
              <AIConsulting />
            }
          />

          {/* ================= BLOGS ================= */}

          <Route
            path="/blogs"
            element={
              <BlogListingPage />
            }
          />

          <Route
            path="/blog/:slug"
            element={
              <BlogArticlePage />
            }
          />

          {/* ================= OTHER ================= */}

          <Route
            path="/privacy-policy"
            element={
              <PrivacyPolicyPage />
            }
          />

          <Route
            path="/careers"
            element={
              <CareersPage />
            }
          />

          <Route
            path="/faqs"
            element={
              <FaqsPage />
            }
          />

        </Routes>

        {/* FOOTER */}

        <Footer />

        <CookieConsent />

      </div>
    </div>
  );
}

export default App;