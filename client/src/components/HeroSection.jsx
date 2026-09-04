import React from 'react';
import { Sparkles, Cpu, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

const HeroSection = ({ onExploreClick }) => {
  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '1.5rem auto 2rem',
        padding: '0 1.5rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          padding: '3rem 2.5rem',
          borderRadius: '24px',
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Glowing Radial Orb */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(99, 102, 241, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '680px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={16} color="#818cf8" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#c7d2fe' }}>
              Microservices Architecture Demo
            </span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: '2.5rem',
              lineHeight: 1.15,
              fontWeight: 800,
              marginBottom: '1rem',
              color: '#ffffff',
            }}
          >
            Experience Speed & Power with <span className="gradient-text">ShopHub</span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize: '1.05rem',
              color: '#94a3b8',
              marginBottom: '1.75rem',
              lineHeight: 1.6,
            }}
          >
            Powered by Node.js microservices, API Gateway routing, MongoDB persistence, and an enterprise React client. Explore curated high-tech gear, apparel, and home essentials.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={onExploreClick}>
              <span>Explore Products</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Feature Pillars */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 150px))',
              gap: '1rem',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={20} color="#818cf8" />
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>Microservices</p>
                <p style={{ fontSize: '0.7rem', color: '#64748b' }}>4 Scalable Apps</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={20} color="#34d399" />
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>Ultra Fast</p>
                <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Vite & Gateway</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="#38bdf8" />
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>JWT Secured</p>
                <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Protected APIs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
