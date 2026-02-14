import React from 'react';
import '../styles/Landing.css';

// Import local assets
import heroBg from '../assets/images/hero.png';
import lalibelaImg from '../assets/images/lalibela.png';
import simienImg from '../assets/images/semen_mountain.png';
import danakilImg from '../assets/images/dankil.png';

const Landing = () => {
    const destinations = [
        { title: 'Lalibela', desc: 'Step back in time at the rock-hewn churches, a subterranean wonder of the world.', img: lalibelaImg },
        { title: 'Simien Mountains', desc: 'Trek through dramatic peaks and encounter unique wildlife like the Gelada baboon.', img: simienImg },
        { title: 'Danakil Depression', desc: 'Witness the unearthly colors of one of the hottest places on the planet.', img: danakilImg }
    ];

    return (
        <div className="landing-page">
            <header
                className="hero"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(5, 5, 5, 0.6), var(--bg-black)), url(${heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
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
                                <div className="destination-image-container">
                                    <img src={dest.img} alt={dest.title} className="destination-image" />
                                </div>
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
