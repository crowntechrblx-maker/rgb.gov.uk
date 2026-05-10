import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const LegalLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="govuk-width-container py-12 md:py-20"
  >
    <Link to="/" className="text-gds-blue underline font-bold flex items-center gap-2 mb-8">
      ← Back to GOV.UK
    </Link>
    <div className="max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 border-b-4 border-gds-black pb-4">{title}</h1>
      <div className="prose prose-lg max-w-none text-gds-black space-y-6">
        {children}
      </div>
      <div className="mt-16 p-6 bg-gds-grey border-l-4 border-gds-dark-grey text-sm">
        <p className="font-bold mb-2">Disclaimer</p>
        <p>This website is a prototype and is not associated with the official UK Government (GOV.UK), Parliament, or any government department. Any content here is for demonstration purposes only.</p>
      </div>
    </div>
  </motion.div>
);

export const Privacy = () => (
  <LegalLayout title="Privacy notice">
    <p>This privacy notice explains how we use any personal information we collect about you when you use this prototype website.</p>
    <h2 className="text-2xl font-bold mt-8">What information do we collect about you?</h2>
    <p>We collect information about you when you register with us or sign a petition. This includes your email address and any content you publish.</p>
    <h2 className="text-2xl font-bold mt-8">How will we use the information about you?</h2>
    <p>We collect information about you to manage your account and, if you agree, to email you about other services we think may be of interest to you.</p>
  </LegalLayout>
);

export const Cookies = () => (
  <LegalLayout title="Cookies">
    <p>GOV.UK Prototype puts small files (known as ‘cookies’) onto your computer to collect information about how you browse the site.</p>
    <h2 className="text-2xl font-bold mt-8">How cookies are used</h2>
    <p>We use cookies to measure how you use the website so it can be updated and improved based on your needs.</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>Essential cookies that make the site work</li>
      <li>Analytics cookies (demo only)</li>
    </ul>
  </LegalLayout>
);

export const Terms = () => (
  <LegalLayout title="Terms and conditions">
    <p>By using this website, you agree to these terms and conditions.</p>
    <h2 className="text-2xl font-bold mt-8">Disclaimer</h2>
    <p>We are not associated with the official UK Government. This is a simulation/prototype for engineering demonstration purposes.</p>
    <h2 className="text-2xl font-bold mt-8">User conduct</h2>
    <p>Users must not post any content that is offensive, illegal, or impersonates real government officials for malicious purposes.</p>
  </LegalLayout>
);
