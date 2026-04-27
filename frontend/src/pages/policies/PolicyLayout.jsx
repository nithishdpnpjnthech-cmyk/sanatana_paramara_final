import React from 'react';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { Helmet } from 'react-helmet-async';

const PolicyLayout = ({ title, children, description, keywords }) => {
    const breadcrumbItems = [
        { label: 'Home', path: '/homepage' },
        { label: title, path: '#' }
    ];

    return (
        <>
            <Helmet>
                <title>{title} - Sanatana Parampare</title>
                <meta name="description" content={description || `Read our ${title} to understand our commitment to your satisfaction and privacy.`} />
                {keywords && <meta name="keywords" content={keywords} />}
            </Helmet>

            <div className="min-h-screen bg-background">
                <Header />

                <main className="pt-6 pb-16">
                    <div className="container mx-auto px-4">
                        <Breadcrumb customItems={breadcrumbItems} />

                        <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-sm border border-border p-8 md:p-12">
                            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-8 border-b border-border pb-6">
                                {title}
                            </h1>

                            <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-primary prose-p:font-body prose-p:text-muted-foreground prose-li:text-muted-foreground">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default PolicyLayout;
