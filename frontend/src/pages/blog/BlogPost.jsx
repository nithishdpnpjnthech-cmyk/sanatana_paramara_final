import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';

// Mock data for individual posts
const blogData = {
    'heritage-story': {
        title: "Preserving India's Ancient Culinary Wisdom",
        date: "May 15, 2024",
        category: "Our Heritage",
        readTime: "5 min read",
        author: "Team Sanatana Parampare",
        image: "/assets/images/parampara.jpg",
        content: [
            { type: 'paragraph', text: "India's culinary landscape is more than just food; it's a profound science known as 'Ahara Vidya' that has been passed down through millennia. At Sanatana Parampare, we believe that the health of a society is deeply rooted in the purity of the food it consumes, and the methods used to prepare it." },
            { type: 'heading', text: "The Genesis of Sanatana Parampare" },
            { type: 'paragraph', text: "Our journey began when we noticed a disconnect between the food available in modern markets and the authentic meals we remembered from our childhood—meals that were not only delicious but filled with vitality. This realization sparked a mission: to bridge the gap between ancient wisdom and contemporary living." },
            { type: 'image', src: "/assets/images/store.jpg", alt: "Our traditional store" },
            { type: 'paragraph', text: "Sanatana Parampare was born out of a commitment to bring back traditional purity. Every product we offer is a testament to our dedication to preserving ancestral knowledge. From the way our spices are ground to the methods used to extract our oils, tradition is at the heart of everything we do." },
            { type: 'heading', text: "Purity Without Compromise" },
            { type: 'paragraph', text: "In today's fast-paced world, many traditional processes have been replaced by industrial shortcuts to save time and cost. However, these shortcuts often come at the expense of nutritional value and flavor. We refuse to compromise." },
            { type: 'paragraph', text: "By choosing Sanatana Parampare, you're not just buying food; you're supporting a legacy of purity, health, and a deep respect for our natural heritage." }
        ],
        seoDescription: "Discover how Sanatana Parampare preserves ancient Indian culinary wisdom through authentic recipes and traditional methods.",
        seoKeywords: "indian tradition, culinary heritage, ancient wisdom, pure food, authentic recipes"
    },
    'wood-pressed-oils': {
        title: "The Magic of Wood Pressed Oils",
        date: "June 2, 2024",
        category: "Traditional Processes",
        readTime: "4 min read",
        author: "Health & Wellness Desk",
        image: "/assets/store/store1.jpg",
        content: [
            { type: 'paragraph', text: "For centuries, cold-pressed oils extracted using wooden churners, known as 'Ghani', have been a staple in Indian households. Today, we're seeing a massive resurgence in the popularity of these oils, and for very good reason." },
            { type: 'heading', text: "Why Wood Pressing Matters" },
            { type: 'paragraph', text: "The primary difference between refined oils and wood-pressed oils lies in the temperature. Industrial extraction uses high heat and chemicals, which destroys the delicate nutritional profile of the seeds. In contrast, wooden churners operate at low speeds, ensuring the oil temperature never rises above a certain point." },
            { type: 'image', src: "/assets/store/store2.jpg", alt: "Traditional wooden ghani" },
            { type: 'paragraph', text: "This 'cold' process preserves the natural antioxidants, vitamins, and minerals that seeds are famous for. The wood of the churner also acts as a natural insulator, prevents heat absorption during the process." },
            { type: 'heading', text: "Benefits of Wood Pressed Oils" },
            { type: 'paragraph', text: "1. Rich in Vitamin E and Heart-Healthy Fats\n2. Maintain Natural Aroma and Character\n3. Zero Residual Chemicals or Solvents\n4. Better Taste for Your Cooking" },
            { type: 'paragraph', text: "At Sanatana Parampare, our wood-pressed oils are extracted exactly the way nature intended—pure, potent, and incredibly healthy." }
        ],
        seoDescription: "Examine the benefits of wood-pressed oils and why the traditional Ghani method is superior for your health.",
        seoKeywords: "wood pressed oil, ghani oil online, cold pressed oil benefits, healthy cooking oils, pure peanut oil"
    }
    // More posts would be added here
};

const BlogPost = () => {
    const { id } = useParams();
    const post = blogData[id];

    if (!post) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-4xl font-heading font-bold text-primary mb-6">Blog Post Not Found</h1>
                    <p className="font-body text-lg text-muted-foreground mb-8">Sorry, the article you are looking for does not exist.</p>
                    <Link to="/blog" className="bg-primary text-white px-8 py-3 rounded-full font-heading font-bold">Back to Blog</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const breadcrumbItems = [
        { label: 'Home', path: '/homepage' },
        { label: 'Our Blog', path: '/blog' },
        { label: post.title, path: `/blog/${id}` }
    ];

    return (
        <>
            <Helmet>
                <title>{post.title} - Sanatana Parampare Blog</title>
                <meta name="description" content={post.seoDescription} />
                <meta name="keywords" content={post.seoKeywords} />
                <meta property="og:title" content={`${post.title} - Sanatana Parampare`} />
                <meta property="og:description" content={post.seoDescription} />
                <meta property="og:image" content={post.image} />
                <meta property="og:type" content="article" />
                <link rel="canonical" href={`https://sanatanaparampare.com/blog/${id}`} />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Header />

                <main className="pt-6">
                    <div className="container mx-auto px-4">
                        <Breadcrumb customItems={breadcrumbItems} />
                    </div>

                    <article className="py-16">
                        <div className="container mx-auto px-4 max-w-4xl">
                            {/* Header */}
                            <header className="mb-12 text-center">
                                <span className="bg-accent/10 text-accent text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 inline-block">
                                    {post.category}
                                </span>
                                <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-8 leading-tight">
                                    {post.title}
                                </h1>

                                <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground border-y border-border py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">SP</div>
                                        <span className="font-medium text-foreground">{post.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Icon name="Calendar" size={18} />
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Icon name="Clock" size={18} />
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>
                            </header>

                            {/* Featured Image */}
                            <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl aspect-[16/9]">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="prose prose-lg prose-primary max-w-none font-body">
                                {post.content.map((item, idx) => {
                                    if (item.type === 'paragraph') return <p key={idx} className="text-muted-foreground leading-relaxed mb-6 text-lg whitespace-pre-line">{item.text}</p>;
                                    if (item.type === 'heading') return <h2 key={idx} className="text-primary font-heading font-bold text-3xl mt-12 mb-6">{item.text}</h2>;
                                    if (item.type === 'image') return (
                                        <figure key={idx} className="my-10">
                                            <img src={item.src} alt={item.alt} className="rounded-2xl w-full shadow-lg" />
                                            <figcaption className="text-center text-sm text-muted-foreground mt-4 italic">{item.alt}</figcaption>
                                        </figure>
                                    );
                                    return null;
                                })}
                            </div>

                            {/* Sharing & Navigation */}
                            <div className="mt-16 pt-12 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-8">
                                <div className="flex items-center gap-4">
                                    <span className="font-heading font-bold text-primary">Share:</span>
                                    <div className="flex gap-3">
                                        {['Facebook', 'Twitter', 'Linkedin', 'Share2'].map(social => (
                                            <button key={social} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                                                <Icon name={social} size={18} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Link to="/blog" className="inline-flex items-center gap-2 text-primary font-heading font-bold hover:text-accent transition-colors duration-200">
                                    <Icon name="ArrowLeft" size={20} />
                                    Back to All Stories
                                </Link>
                            </div>
                        </div>
                    </article>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default BlogPost;
