import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/navbar";
import "../App.css";

export const Policies = () => {
  return (
    <div
      style={{
        background: "#efefef",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <div
        className="td-site-frame"
        style={{
          flex: 1,
          padding: "3rem 25% 6rem",
          textAlign:"justify",
          width:"100%",
          maxWidth:"none",
          margin: "0",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            fontFamily: "Montserrat, sans-serif",
            color: "#111",
            marginBottom: "0.5rem",
            letterSpacing: "-0.03em",
          }}
        >
          Policies & Code of Conduct
        </h1>
        <span
          style={{
            fontSize: "0.9rem",
            color: "#888",
            display: "block",
            marginBottom: "3rem",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Last updated: August 2025
        </span>

        <div
          style={{
            height: "1px",
            background: "#ddd",
            width: "100%",
            marginBottom: "2.5rem",
          }}
        />

        {/* 1 */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#111",
              marginBottom: "1rem",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            1. Introduction
          </h2>
          <p style={{ color: "#444", lineHeight: 1.7, fontSize: "0.95rem" }}>
            The Falcons Hackathon Community is a student-led technical community
            at NMIET, Pune, built around skill-building, collaboration, and
            friendly competition. By joining or using this platform, you agree
            to abide by the policies outlined below. These policies exist to
            ensure a safe, inclusive, and productive environment for all
            members.
          </p>
        </div>

        {/* 2 */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#111",
              marginBottom: "1rem",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            2. Member Responsibilities
          </h2>
          <ul
            style={{
              color: "#444",
              lineHeight: 1.7,
              fontSize: "0.95rem",
              paddingLeft: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <li>
              You are solely responsible for the accuracy and completeness of
              the information you provide during onboarding and profile
              management.
            </li>
            <li>
              You must not impersonate another individual, use a false identity,
              or provide misleading credentials or academic records.
            </li>
            <li>
              You are responsible for keeping your profile up to date,
              especially contact information and academic status.
            </li>
            <li>
              Do not share your account credentials. Each account must
              correspond to one real person.
            </li>
          </ul>
        </div>

        {/* 3 */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#111",
              marginBottom: "1rem",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            3. Data & Privacy
          </h2>
          <p
            style={{
              color: "#444",
              lineHeight: 1.7,
              fontSize: "0.95rem",
              marginBottom: "1rem",
            }}
          >
            We collect the following personal data to build your public member
            profile:
          </p>
          <ul
            style={{
              color: "#444",
              lineHeight: 1.7,
              fontSize: "0.95rem",
              paddingLeft: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <li>Full name, email address, contact number, and gender</li>
            <li>
              Academic information (branch, college, CGPA, city, passing year)
            </li>
            <li>Social profile links (GitHub, LinkedIn, Discord, Instagram)</li>
            <li>
              A profile photo, stored as a Base64-encoded image directly in our
              database
            </li>
            <li>Skills, experience, and hackathon participation data</li>
          </ul>
          <p
            style={{
              color: "#444",
              lineHeight: 1.7,
              fontSize: "0.95rem",
              marginBottom: "1rem",
            }}
          >
            All data is stored in Google Firestore (Singapore region). Profile
            information is visible to authenticated members of the Falcons
            community. No data is sold or shared with third parties. You may
            delete your profile and associated data at any time from your
            profile settings.
          </p>
          <p style={{ color: "#444", lineHeight: 1.7, fontSize: "0.95rem" }}>
            Authentication is handled via Firebase Authentication. We support
            sign-in by email/password and Google. No payment information is
            collected.
          </p>
        </div>

        {/* 4 */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#111",
              marginBottom: "1rem",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            4. Code of Conduct
          </h2>
          <ul
            style={{
              color: "#444",
              lineHeight: 1.7,
              fontSize: "0.95rem",
              paddingLeft: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <li>
              <strong style={{ color: "#111" }}>Respect:</strong> Treat every
              member with dignity. Harassment, hate speech, discrimination based
              on gender, caste, religion, or background, and any form of
              bullying are strictly prohibited.
            </li>
            <li>
              <strong style={{ color: "#111" }}>No Spam:</strong> Do not post
              spam, excessive self-promotion, referral codes, or advertisements
              in community channels without prior approval from organizers.
            </li>
            <li>
              <strong style={{ color: "#111" }}>Honesty:</strong> Provide
              truthful information. Fabricating academic records, skills, or
              hackathon history will result in immediate removal.
            </li>
            <li>
              <strong style={{ color: "#111" }}>Discord Guidelines:</strong> All
              interactions on our official Discord server must follow Discord's{" "}
              <a
                href="https://discord.com/guidelines"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0066cc", textDecoration: "none" }}
              >
                Community Guidelines
              </a>{" "}
              in addition to these rules.
            </li>
          </ul>
        </div>

        {/* 5 */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#111",
              marginBottom: "1rem",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            5. Violations & Removal Policy
          </h2>
          <p
            style={{
              color: "#444",
              lineHeight: 1.7,
              fontSize: "0.95rem",
              marginBottom: "1rem",
            }}
          >
            Violations of this Code of Conduct may result in one or more of the
            following actions, at the discretion of the Falcons organizers:
          </p>
          <ul
            style={{
              color: "#444",
              lineHeight: 1.7,
              fontSize: "0.95rem",
              paddingLeft: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <li>A formal warning issued via Discord or email</li>
            <li>Temporary suspension from community activities</li>
            <li>Permanent removal of your member profile from this platform</li>
            <li>
              Permanent ban from the Falcons Discord server and all community
              events
            </li>
          </ul>
          <p style={{ color: "#444", lineHeight: 1.7, fontSize: "0.95rem" }}>
            Organizers reserve the right to remove any profile or content
            without prior notice if it is deemed in violation of these policies
            or harmful to the community.
          </p>
        </div>

        {/* 6 */}
        <div style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#111",
              marginBottom: "1rem",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            6. Contact & Reporting
          </h2>
          <p
            style={{
              color: "#444",
              lineHeight: 1.7,
              fontSize: "0.95rem",
              marginBottom: "1rem",
            }}
          >
            If you witness a violation or have a concern about another member's
            behavior, please report it directly via our Discord server. All
            reports are handled confidentially.
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <a
              href="https://discord.gg/j8XvwsSUQB"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#0066cc",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "0.95rem",
              }}
            >
              Join the Falcons Discord →
            </a>
            <a
              href="https://github.com/Falcon-s-Hackathon-Community"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#0066cc",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "0.95rem",
              }}
            >
              GitHub Organization →
            </a>
          </div>
        </div>

        <div
          style={{
            height: "1px",
            background: "#ddd",
            width: "100%",
            marginBottom: "2rem",
          }}
        />

        <p
          style={{
            fontSize: "0.85rem",
            color: "#888",
            lineHeight: 1.7,
            textAlign: "center",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          These policies are subject to change. Members will be notified of
          significant updates via Discord. Continued use of this platform
          constitutes acceptance of the most recent version of these policies.
        </p>
      </div>

      <footer
        style={{
          borderTop: "1px solid #e8e8e8",
          padding: "1.25rem 6%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#bbb",
          fontSize: "0.78rem",
          fontFamily: "Montserrat, sans-serif",
          flexWrap: "wrap",
          gap: "0.5rem",
          background: "#efefef",
        }}
      >
        <span>© {new Date().getFullYear()} Falcons Hackathon Community</span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link
            to="/policies"
            style={{ color: "#bbb", textDecoration: "none" }}
          >
            Policies
          </Link>
          <a
            href="https://discord.gg/j8XvwsSUQB"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#bbb", textDecoration: "none" }}
          >
            Discord
          </a>
          <a
            href="https://github.com/Falcon-s-Hackathon-Community"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#bbb", textDecoration: "none" }}
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};
