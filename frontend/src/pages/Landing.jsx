import React from 'react';
import '../styles/Landing.css';

const Landing = () => {
    const destinations = [
        { title: 'Lalibela', desc: 'Famous for its rock-hewn churches.', img: 'https://images.unsplash.com/photo-1579717757962-d599c7595bc6?auto=format&fit=crop&q=80&w=800' },
        { title: 'Simien Mountains', desc: 'Stunning landscapes and unique wildlife.', img: 'https://images.unsplash.com/photo-1629731674431-27ec968d66df?auto=format&fit=crop&q=80&w=800' },
        { title: 'Danakil Depression', desc: 'One of the hottest and lowest places on Earth.', img: 'https://images.unsplash.com/photo-1563812836236-8db7145719a6?auto=format&fit=crop&q=80&w=800' }
    ];

    return (
        <div className="landing-page">
            <header className="hero">
                <div className="container">
                    <h1>Discover Ethiopia</h1>
                    <p>Experience the Land of Origins, from ancient civilizations to breathtaking landscapes.</p>
                </div>
            </header>

            <section className="about" id="about">
                <div className="container">
                    <h2 className="section-title">About Ethiopia</h2>
                    <p>Ethiopia is a country of extraordinary history and culture. It's the only African nation that was never colonized, maintaining its unique alphabet, calendar, and traditions. From the birthplace of Coffee to the home of "Lucy", Ethiopia offers a journey like no other.</p>
                </div>
            </section>

            <section className="destinations" id="destinations">
                <div className="container">
                    <h2 className="section-title">Popular Destinations</h2>
                    <div className="destinations-grid">
                        {destinations.map((dest, idx) => (
                            <div key={idx} className="destination-card">
                                <div
                                    className="destination-image"
                                    style={{ backgroundImage: `url(${dest.img})` }}
                                ></div>
                                <div className="destination-info">
                                    <h3>{dest.title}</h3>
                                    <p>{dest.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="travel-tips" id="tips">
                <div className="container">
                    <h2 className="section-title">Travel Tips</h2>
                    <div className="tips-container">
                        <div className="tip-item">
                            <h3>Best Time to Visit</h3>
                            <p>October to June is the dry season, perfect for trekking and festivals.</p>
                        </div>
                        <div className="tip-item">
                            <h3>Local Cuisine</h3>
                            <p>Don't miss out on Injera and Doro Wat, and definitely try the traditional coffee ceremony.</p>
                        </div>
                        <div className="tip-item">
                            <h3>Currency</h3>
                            <p>The local currency is the Ethiopian Birr (ETB). Cash is king in rural areas.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
