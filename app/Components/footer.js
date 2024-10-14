import React from 'react';
import './Footer.css';
import footerLinks from './footerLinks';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-logo">
                <img src="/images/DishDash-Logo.png" alt="Company Logo" />
            </div>
            <div className="footer-links">
                {Object.entries(footerLinks).map(([key, links]) => (
                    <div key={key} className="footer-column">
                        <h4>{key}</h4>
                        <ul>
                            {links.map(link => (
                                <li key={link.name}>
                                    <a href={link.url}>
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </footer>
    );
};

export default Footer;