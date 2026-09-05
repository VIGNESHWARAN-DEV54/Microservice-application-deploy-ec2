import React from 'react';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="back-to-top" onClick={scrollToTop}>
        Back to top
      </div>

      <div className="footer-links-grid">
        <div className="footer-col">
          <h4>DevOps Architecture</h4>
          <ul>
            <li>Product Service (:5001)</li>
            <li>User Service (:5002)</li>
            <li>Order Service (:5003)</li>
            <li>Payment Service (:5004)</li>
            <li>MongoDB Database (:27017)</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>DevOps Tooling</h4>
          <ul>
            <li>Docker & Dockerfiles</li>
            <li>Docker Compose Orchestration</li>
            <li>Jenkins Declarative CI/CD</li>
            <li>Git & GitHub Integration</li>
            <li>Linux EC2 Deployment</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>MERN Technologies</h4>
          <ul>
            <li>React.js 18 Frontend</li>
            <li>Node.js 21 Runtime</li>
            <li>Express.js REST APIs</li>
            <li>MongoDB & Mongoose ODM</li>
            <li>Standard CORS & Fetch</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Fresher Portfolio</h4>
          <ul>
            <li>Beginner Friendly Microservices</li>
            <li>Zero Over-engineering</li>
            <li>Interview Ready Architecture</li>
            <li>Production-like Deployment</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="brand-copy">
          © {new Date().getFullYear()} Amazon Clone Microservices — Built for DevOps Fresher Portfolio & Resume
        </p>
      </div>
    </footer>
  );
}

export default Footer;
