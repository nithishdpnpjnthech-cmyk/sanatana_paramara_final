import React from 'react';
import PolicyLayout from './PolicyLayout';

const ReturnPolicy = () => {
    return (
        <PolicyLayout
            title="Return & Refund Policy"
            description="Understand our return, replacement, and refund process for products purchased from Sanatana Parampare."
            keywords="return policy, refund, replacement, food safety, damaged products"
        >
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">1. Return Eligibility</h2>
                <p className="mb-4">
                    Since we deal in food products, returns are generally not accepted due to health and safety reasons, except in the following cases:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Damaged Product:</strong> If the product arrives damaged or the packaging is tampered with.</li>
                    <li><strong>Incorrect Item:</strong> If you receive an item different from what you ordered.</li>
                    <li><strong>Expired Product:</strong> If the product received is past its expiry date.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">2. Reporting an Issue</h2>
                <p className="mb-4">
                    Any issues must be reported within 24-48 hours of receiving the shipment.
                </p>
                <p>
                    To report an issue, please email us at <strong>returns@sanatanaparampare.com</strong> with your order number and clear photos of the product and packaging.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">3. Replacement Process</h2>
                <p>
                    If your claim is approved, we will initiate a replacement for the damaged or incorrect item at no additional cost to you. Replacements are subject to product availability.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">4. Refund Policy</h2>
                <p className="mb-4">
                    Refunds are only processed if a replacement cannot be provided for a valid claim.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Approved refunds will be credited back to the original payment method within 7-10 business days.</li>
                    <li>For Cash on Delivery (COD) orders, we will request your bank details for the refund.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">5. Cancellation</h2>
                <p>
                    You can cancel your order before it is dispatched. Once the order has been handed over to the courier partner, cancellation is not possible.
                </p>
            </section>
        </PolicyLayout>
    );
};

export default ReturnPolicy;
