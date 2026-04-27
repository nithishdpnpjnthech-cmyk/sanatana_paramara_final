import React from 'react';
import PolicyLayout from './PolicyLayout';

const ShippingPolicy = () => {
    return (
        <PolicyLayout
            title="Shipping Policy"
            description="Learn about Sanatana Parampare's shipping methods, costs, and delivery times for our traditional Indian food products."
            keywords="shipping policy, delivery time, shipping costs, international shipping, local delivery"
        >
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">1. Shipping Methods & Delivery Times</h2>
                <p className="mb-4">
                    At Sanatana Parampare, we take great care in ensuring that your traditional food products reach you in the best possible condition. We partner with reliable courier services to ensure timely and safe delivery.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Domestic Shipping (India):</strong> Deliveries typically take 3-7 business days depending on your location.</li>
                    <li><strong>Express Shipping:</strong> Available in select cities, with delivery within 1-2 business days.</li>
                    <li><strong>Fragile Items:</strong> Items like glass jars of pickles or sweets are packed with extra care, which may slightly increase packaging time.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">2. Shipping Costs</h2>
                <p className="mb-4">
                    Shipping costs are calculated based on the weight of your order and the delivery destination.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Shipping charges will be displayed at the time of checkout before you make the payment.</li>
                    <li>We offer free shipping on orders above a certain value (as mentioned on our website from time to time).</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">3. Order Tracking</h2>
                <p>
                    Once your order is dispatched, you will receive a tracking number via email and SMS. You can use this number to track your shipment on our website or the courier partner's portal.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">4. Packaging</h2>
                <p>
                    We use eco-friendly and food-grade packaging materials wherever possible to preserve the freshness and authenticity of our products while being kind to the environment.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">5. Shipping Restrictions</h2>
                <p>
                    Currently, we ship to most locations across India. For international shipping inquiries, please contact our customer support team at hello@sanatanaparampare.com.
                </p>
            </section>
        </PolicyLayout>
    );
};

export default ShippingPolicy;
