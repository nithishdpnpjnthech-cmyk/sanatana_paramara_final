import React from 'react';
import { Link } from 'react-router-dom';

const ExperienceTraditionCTA = () => {
    return (
        <section className="py-8 bg-white">
            <div className="container mx-auto px-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center">
                    <h3 className="text-3xl font-bold mb-4">
                        Experience the Taste of Tradition
                    </h3>
                    <p className="text-xl mb-6 opacity-90">
                        Shop our complete collection of premium traditional products
                    </p>
                    <Link
                        to="/product-collection-grid"
                        className="inline-flex items-center px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
                    >
                        Shop All Products
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ExperienceTraditionCTA;
