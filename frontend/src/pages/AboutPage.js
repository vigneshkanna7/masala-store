// src/pages/AboutPage.js
import React from "react";

const font = "'Poppins', sans-serif";

if (typeof document !== "undefined" && !document.getElementById("poppins-font")) {
  const link = document.createElement("link");
  link.id = "poppins-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

const AboutPage = () => {
  return (
    <div style={{ background: "#fff", fontFamily: font }}>

      <style>{`
        .about-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 48px 48px;
        }
        .about-title {
          text-align: center;
          font-size: 40px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 48px;
          font-family: 'Poppins', sans-serif;
        }
        .about-section {
          margin-bottom: 40px;
        }
        .about-section-heading {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1f2937;
          margin-bottom: 16px;
          font-family: 'Poppins', sans-serif;
        }
        .about-body-text {
          font-size: 16px;
          color: #374151;
          line-height: 1.8;
          margin-bottom: 16px;
          font-family: 'Poppins', sans-serif;
        }
        .about-body-text:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 640px) {
          .about-wrapper {
            padding: 16px 16px 40px;
          }
          .about-title {
            font-size: 26px;
            margin-bottom: 28px;
          }
          .about-section {
            margin-bottom: 28px;
          }
          .about-section-heading {
            font-size: 12px;
          }
          .about-body-text {
            font-size: 15px;
            line-height: 1.75;
          }
        }

        @media (min-width: 641px) and (max-width: 900px) {
          .about-wrapper {
            padding: 20px 24px 40px;
          }
          .about-title {
            font-size: 32px;
            margin-bottom: 36px;
          }
          .about-body-text {
            font-size: 15px;
          }
        }
      `}</style>

      <div className="about-wrapper">

        <h1 className="about-title">About Us</h1>

        {/* ── The Company ── */}
        <section className="about-section">
          <h2 className="about-section-heading">The Company</h2>
          <p className="about-body-text">
            Brand Melam has been a house hold favourite for decades. Now under the
            diversified umbrella of AVA Group, the brand has gained renewed strength
            and is poised to delight consumers with enhanced quality and innovation.
            Over the years Melam has carved a respected name for itself owing to its
            quality products and authentic recipes.{" "}
            <span style={{ color: "#dc2626", fontWeight: 500 }}>AVA group</span> has
            intensified these efforts along with the set up of modern plant, strict QC
            norms and checks and by going deep in to the roots of Kerala to get
            authentic and some possibly forgotten recipes. AVA Naturals Pvt Ltd. a
            group company of AVA Group is known for its other quality products under
            the Brand name{" "}
            <span style={{ color: "#dc2626", fontWeight: 500 }}>Medimix</span> and{" "}
            <span style={{ color: "#dc2626", fontWeight: 500 }}>Sanjeevanam</span>, and
            has a very strong marketing and distribution muscle to reach the products
            at arm's length to the consumer. This marketing muscle is now backing Melam
            brand to reach its wide range of products to the consumers not only in
            Kerala but across the globe.
          </p>
          <p className="about-body-text">
            True to its commitment to quality and authenticity, the group defines its
            brand vision and standards with same rigour.
          </p>
        </section>

        {/* ── Melam Brand Vision ── */}
        <section className="about-section">
          <h2 className="about-section-heading">Melam Brand Vision</h2>
          <p className="about-body-text">
            We aim to be the most trusted, authentic, premium Indian food brand, that
            stands for delivering the regional taste diversity of India in all its
            authenticity and freshness to all our customers. Each of our products shall
            be created around natural produces and shall be curated to ensure that the
            taste, best represents the origins.
          </p>
        </section>

        {/* ── Our Brand Standard ── */}
        <section className="about-section" style={{ marginBottom: 0 }}>
          <h2 className="about-section-heading">Our Brand Standard</h2>
          <p className="about-body-text">
            We will ensure that Melam food products are manufactured, packaged and
            delivered to our customers while maintaining the highest order of quality
            and hygiene. We commit to continuously work, towards identifying and
            eliminating instances of adulteration, presence of heavy metals and
            pesticides in the entire supply chain originating from the farms. We shall
            strive to deliver nutritionally sound products and disclose complete and
            accurate nutritional information on our packaging. We will avoid the use of
            all artificial colouring agents in our products.
          </p>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;