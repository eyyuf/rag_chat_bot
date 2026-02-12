import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, FileText, Zap, Shield } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hero-content"
                    >
                        <h1>Intelligent RAG <span className="gradient-text">ChatBot</span></h1>
                        <p>Upload your documents and chat with them using advanced AI. Private, secure, and lightning fast.</p>
                        <div className="hero-btns">
                            <Link to="/register" className="btn btn-primary">Get Started</Link>
                            <a href="#features" className="btn btn-outline">Learn More</a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features">
                <div className="container">
                    <div className="section-title">
                        <h2>Why Choose Voyager AI?</h2>
                        <p>Our Retrieval-Augmented Generation pipeline ensures your AI has the context it needs.</p>
                    </div>
                    <div className="feature-grid">
                        <FeatureCard
                            icon={<FileText size={40} />}
                            title="Doc Intelligence"
                            desc="Extract text from PDFs and text files with 99.9% accuracy."
                        />
                        <FeatureCard
                            icon={<Zap size={40} />}
                            title="Vector Search"
                            desc="Instant semantic retrieval using Voyager AI embeddings."
                        />
                        <FeatureCard
                            icon={<Bot size={40} />}
                            title="AI Conversations"
                            desc="Nuanced, context-aware responses grounded in your data."
                        />
                        <FeatureCard
                            icon={<Shield size={40} />}
                            title="Secure Storage"
                            desc="End-to-end encryption for your documents and chats."
                        />
                    </div>
                </div>
            </section>

            <style jsx>{`
        .hero {
          padding: 8rem 0 6rem;
          text-align: center;
          background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%);
        }
        .hero-content h1 {
          font-size: 4rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        .gradient-text {
          background: linear-gradient(90deg, #6366f1, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-content p {
          font-size: 1.25rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto 2.5rem;
        }
        .hero-btns {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        .btn {
          padding: 0.8rem 2rem;
          border-radius: 0.5rem;
          font-weight: 600;
          text-decoration: none;
        }
        .btn-primary {
          background: var(--primary);
          color: white;
        }
        .btn-primary:hover {
          background: var(--primary-hover);
        }
        .btn-outline {
          border: 1px solid var(--border);
          color: white;
        }
        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .features {
          padding: 6rem 0;
        }
        .section-title {
          text-align: center;
          margin-bottom: 4rem;
        }
        .section-title h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .section-title p {
          color: var(--text-muted);
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        .feature-card {
          padding: 2.5rem;
          border-radius: 1rem;
          background: var(--bg-card);
          border: 1px solid var(--border);
          transition: transform 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary);
        }
        .icon-wrapper {
          color: var(--primary);
          margin-bottom: 1.5rem;
        }
        .feature-card h3 {
          margin-bottom: 1rem;
        }
        .feature-card p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }
      `}</style>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="feature-card">
        <div className="icon-wrapper">{icon}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
    </div>
);

export default LandingPage;
