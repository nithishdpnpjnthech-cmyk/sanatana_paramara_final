import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';

const blogPosts = [
    {
        id: 'heritage-story',
        title: "Preserving India's Ancient Culinary Wisdom",
        excerpt: "Discover the journey of Sanatana Parampare and our mission to protect traditional food preparation methods in the modern era.",
        image: "/assets/images/parampara.jpg",
        date: "May 15, 2024",
        category: "Our Heritage",
        readTime: "5 min read"
    },
    {
        id: 'wood-pressed-oils',
        title: "The Magic of Wood Pressed Oils",
        excerpt: "Learn why traditional wood pressing methods are superior for extracting oils that maintain natural nutrients and authentic taste.",
        image: "/assets/store/store1.jpg",
        date: "June 2, 2024",
        category: "Traditional Processes",
        readTime: "4 min read"
    },
    {
        id: 'stone-ground-spices',
        title: "Stone Grinding: An Ancient Secret for Better Spices",
        excerpt: "How traditional stone mills preserve essential oils and aromatic compounds in your favorite spices.",
        image: "/assets/store/store3.jpg",
        date: "June 20, 2024",
        category: "Cooking Tips",
        readTime: "6 min read"
    },
    {
        id: 'purity-authenticity',
        title: "What Purity Means at Sanatana Parampare",
        excerpt: "A deep dive into our commitment to 100% natural heritage foods without chemical additives or preservatives.",
        image: "/assets/images/store.jpg",
        date: "July 5, 2024",
        category: "Quality Promise",
        readTime: "3 min read"
    },
    {
        id: 'handcrafted-pickles',
        title: "The Art of Handcrafted Pickles",
        excerpt: "Exploring the time-honored techniques used by our artisans to create authentic Indian pickles.",
        image: "/assets/store/store5.jpg",
        date: "July 18, 2024",
        category: "Traditional Processes",
        readTime: "7 min read"
    },
    {
        id: 'natural-heritage',
        title: "Connecting with Your Culinary Roots",
        excerpt: "How choosing traditional foods helps preserve ancient Indian wisdom and promotes a healthier lifestyle.",
        image: "/assets/store/store7.jpg",
        date: "August 1, 2024",
        category: "Natural Heritage",
        readTime: "5 min read"
    }
];

const BlogIndex = () => {
    const breadcrumbItems = [
        { label: 'Home', path: '/homepage' },
        { label: 'Our Blog', path: '/blog' }
    ];

    return (
        <>
            <Helmet>
                <title>Our Blog - Sanatana Parampare | Traditional Indian Food Insights</title>
                <meta name="description" content="Explore stories about Indian culinary heritage, traditional processing methods, and the benefits of pure, natural food products." />
                <meta name="keywords" content="blog sanatana parampare, traditional food blog, indian culinary heritage, healthy living, authentic spice powders, wood pressed oils" />
                <meta property="og:title" content="Our Blog - Sanatana Parampare | Traditional Indian Food Insights" />
                <meta property="og:description" content="Discover the secrets behind traditional Indian food preparation and its many benefits." />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://sanatanaparampare.com/blog" />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Header />

                <main className="pt-6">
                    <div className="container mx-auto px-4">
                        <Breadcrumb customItems={breadcrumbItems} />
                    </div>

                    <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
                        <div className="container mx-auto px-4 text-center">
                            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">
                                Our Blog
                            </h1>
                            <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                                Nourishing your mind with stories of tradition, purity, and the ancient wisdom
                                hidden within India's rich culinary heritage.
                            </p>
                        </div>
                    </section>

                    <section className="py-16 bg-white">
                        <div className="container mx-auto px-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {blogPosts.map((post) => (
                                    <article key={post.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-border">
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                                                    {post.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-8 flex-grow flex flex-col">
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Icon name="Calendar" size={14} />
                                                    <span>{post.date}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Icon name="Clock" size={14} />
                                                    <span>{post.readTime}</span>
                                                </div>
                                            </div>

                                            <h2 className="font-heading font-bold text-2xl text-primary mb-4 line-clamp-2 min-h-[4rem]">
                                                <Link to={`/blog/${post.id}`} className="hover:text-accent transition-colors duration-200">
                                                    {post.title}
                                                </Link>
                                            </h2>

                                            <p className="font-body text-muted-foreground mb-6 line-clamp-3 flex-grow">
                                                {post.excerpt}
                                            </p>

                                            <Link
                                                to={`/blog/${post.id}`}
                                                className="inline-flex items-center gap-2 text-accent font-heading font-bold hover:text-primary transition-colors duration-200 group-btn"
                                            >
                                                Read More
                                                <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Newsletter Section */}
                    <section className="py-16 bg-green-50">
                        <div className="container mx-auto px-4 max-w-4xl">
                            <div className="bg-primary rounded-3xl p-12 text-center text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Icon name="Mail" size={120} />
                                </div>
                                <h2 className="font-heading text-3xl font-bold mb-6">Stay Connected</h2>
                                <p className="font-body text-xl mb-8 text-white/90">
                                    Subscribe to our newsletter for traditional recipes, wellness tips, and exclusive blog updates.
                                </p>
                                <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                                    <input
                                        type="email"
                                        placeholder="Your Email Address"
                                        className="flex-grow px-6 py-4 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-accent hover:bg-white hover:text-accent text-white px-8 py-4 rounded-full font-heading font-bold transition-all duration-300 shadow-lg"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default BlogIndex;
