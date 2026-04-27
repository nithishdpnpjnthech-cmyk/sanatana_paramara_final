import React from 'react';
import PolicyLayout from './PolicyLayout';

const PrivacyPolicy = () => {
    return (
        <PolicyLayout
            title="Privacy Policy"
            description="We value your privacy. Learn how Sanatana Parampare collects, uses, and protects your personal information."
            keywords="privacy policy, data protection, personal information, cookies, security"
        >
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">1. Information We Collect</h2>
                <p className="mb-4">
                    When you visit Sanatana Parampare, we collect certain information to provide you with a better shopping experience:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Personal Information:</strong> Name, email address, phone number, and shipping address when you create an account or place an order.</li>
                    <li><strong>Transaction Details:</strong> Information about the products you purchase and payment status (we do not store credit/debit card details).</li>
                    <li><strong>Device Information:</strong> IP address, browser type, and operating system collected through cookies.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">2. How We Use Your Information</h2>
                <p className="mb-4">
                    We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Process and fulfill your orders.</li>
                    <li>Communicate with you regarding your order status.</li>
                    <li>Improve our website and product offerings.</li>
                    <li>Send you promotional messages if you have opted-in to our newsletter.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">3. Data Protection</h2>
                <p>
                    We implement a variety of security measures to maintain the safety of your personal information. Your data is stored on secure servers and is accessible only to authorized personnel.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">4. Sharing with Third Parties</h2>
                <p>
                    We do not sell or trade your personal information. We only share necessary data with trusted third parties who assist us in operating our website and delivering products (e.g., courier partners, payment gateways).
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">5. Your Choices</h2>
                <p>
                    You can update your account information at any time. You can also choose to disable cookies in your browser settings, though this may affect some features of our website.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">6. Updates to This Policy</h2>
                <p>
                    We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
                </p>
            </section>
        </PolicyLayout>
    );
};

export default PrivacyPolicy;
