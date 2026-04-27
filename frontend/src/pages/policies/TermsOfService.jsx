import React from 'react';
import PolicyLayout from './PolicyLayout';

const TermsOfService = () => {
    return (
        <PolicyLayout
            title="Terms of Service"
            description="Read the terms and conditions for using Sanatana Parampare's website and services."
            keywords="terms of service, terms and conditions, legal agreement, website usage"
        >
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">1. Acceptance of Terms</h2>
                <p>
                    By accessing and using the Sanatana Parampare website, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">2. Use of the Website</h2>
                <p className="mb-4">
                    You agree to use this website only for lawful purposes. You are prohibited from:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Using the site in any way that causes damage or impairment of site accessibility.</li>
                    <li>Copying, storing, or transmitting any material that consists of malicious computer software.</li>
                    <li>Engaging in any data collection activities without our express written consent.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">3. Product Information</h2>
                <p>
                    We strive to provide accurate information about our traditional food products. However, we do not warrant that product descriptions or other content are error-free. Actual product packaging and materials may contain more or different information than shown on our website.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">4. Intellectual Property</h2>
                <p>
                    All content on this website, including text, graphics, logos, and images, is the property of Sanatana Parampare and is protected by copyright and intellectual property laws.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">5. Limitation of Liability</h2>
                <p>
                    Sanatana Parampare shall not be liable for any direct, indirect, or incidental damages arising out of your use of or inability to use the website or its products.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">6. Governing Law</h2>
                <p>
                    These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">7. Changes to Terms</h2>
                <p>
                    We reserve the right to modify these terms at any time. It is your responsibility to check this page periodically for changes.
                </p>
            </section>
        </PolicyLayout>
    );
};

export default TermsOfService;
