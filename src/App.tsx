import React, { useState } from 'react';
import { EcoProvider, useEco } from './context/EcoContext';
import { Dashboard } from './views/Dashboard';
import { Estimator } from './views/Estimator';
import { Challenges } from './views/Challenges';
import { Journal } from './views/Journal';
import { OffsetForest } from './views/OffsetForest';
import { AIAdvisor } from './views/AIAdvisor';
import { Rewards } from './views/Rewards';
import {
  Leaf,
  LayoutDashboard,
  Calculator,
  Compass,
  BookOpen,
  TreePine,
  Bot,
  Award,
  Calendar,
  RotateCcw,
  Sparkles,
  Ticket
} from 'lucide-react';
import './App.css';

const MainApp: React.FC = () => {
  const { ecoPoints, streak, resetAllData, level, xpPercentage, levelTitle } = useEco();
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('gp_has_estimated') === 'true' ? 'dashboard' : 'onboarding';
  });

  const handleEstimationComplete = () => {
    localStorage.setItem('gp_has_estimated', 'true');
    setActiveTab('dashboard');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all tracking data, streaks, and eco points?')) {
      resetAllData();
      localStorage.removeItem('gp_has_estimated');
      setActiveTab('onboarding');
    }
  };

  return (
    <>
      {/* Premium Glassmorphic Header */}
      <header
        style={{
          background: 'rgba(20, 26, 23, 0.75)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-glass)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '14px 0',
        }}
      >
        <div className="container flex-row-center" style={{ flexWrap: 'wrap', gap: '12px' }}>
          {/* Logo with pulse leaf icon */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => setActiveTab(localStorage.getItem('gp_has_estimated') === 'true' ? 'dashboard' : 'onboarding')}
          >
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--glow-mint)',
              }}
            >
              <Leaf size={24} style={{ color: 'hsl(var(--accent-mint))' }} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(90deg, #ffffff 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              GreenPulse
            </span>
          </div>

          {/* Core Tabs Menu */}
          {activeTab !== 'onboarding' && (
            <nav className="tab-navigation">
              <button
                className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={16} /> Dashboard
              </button>
              <button
                className={`tab-btn ${activeTab === 'estimator' ? 'active' : ''}`}
                onClick={() => setActiveTab('estimator')}
              >
                <Calculator size={16} /> Estimator
              </button>
              <button
                className={`tab-btn ${activeTab === 'challenges' ? 'active' : ''}`}
                onClick={() => setActiveTab('challenges')}
              >
                <Compass size={16} /> Challenges
              </button>
              <button
                className={`tab-btn ${activeTab === 'journal' ? 'active' : ''}`}
                onClick={() => setActiveTab('journal')}
              >
                <BookOpen size={16} /> Journal
              </button>
              <button
                className={`tab-btn ${activeTab === 'rewards' ? 'active' : ''}`}
                onClick={() => setActiveTab('rewards')}
              >
                <Ticket size={16} /> Rewards
              </button>
              <button
                className={`tab-btn ${activeTab === 'forest' ? 'active' : ''}`}
                onClick={() => setActiveTab('forest')}
              >
                <TreePine size={16} /> Forest
              </button>
              <button
                className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
                onClick={() => setActiveTab('ai')}
              >
                <Bot size={16} /> PulseAI
              </button>
            </nav>
          )}

          {/* User Score Stats in Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {activeTab !== 'onboarding' && (
              <>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '4px',
                    fontSize: '0.8rem',
                    background: 'rgba(251, 176, 27, 0.06)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(251, 176, 27, 0.15)',
                  }}
                  title={`Level ${level}: ${levelTitle}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'hsl(var(--accent-gold))', fontSize: '0.75rem' }}>
                    <Sparkles size={11} />
                    <span>Lvl {level}</span>
                  </div>
                  <div className="xp-container" style={{ width: '80px', height: '4px' }}>
                    <div className="xp-bar" style={{ width: `${xpPercentage}%` }} />
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'hsl(var(--accent-mint))',
                    background: 'rgba(27, 242, 147, 0.08)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(27, 242, 147, 0.2)',
                  }}
                  title="Points accrued from completed challenges"
                >
                  <Award size={14} />
                  <span>{ecoPoints} pts</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'hsl(var(--accent-cyan))',
                    background: 'rgba(6, 182, 212, 0.1)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                  }}
                  title="Consecutive days checked in"
                >
                  <Calendar size={14} />
                  <span>{streak}d Streak</span>
                </div>

                <button
                  onClick={handleReset}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'hsl(var(--text-muted))',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Reset Data"
                >
                  <RotateCcw size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="container" style={{ flex: 1, padding: '36px 24px 20px' }}>
        
        {/* Onboarding Welcome Screen */}
        {activeTab === 'onboarding' && (
          <div
            className="glass-panel view-transition"
            style={{
              maxWidth: '650px',
              margin: '40px auto 0',
              textAlign: 'center',
              padding: '48px 32px',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                padding: '20px',
                background: 'rgba(16, 185, 129, 0.12)',
                borderRadius: '50%',
                marginBottom: '28px',
                boxShadow: 'var(--glow-mint)',
              }}
            >
              <Leaf size={56} className="floating-icon" style={{ color: 'hsl(var(--accent-mint))' }} />
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
              Welcome to GreenPulse
            </h1>
            
            <p style={{ fontSize: '1.05rem', color: 'hsl(var(--text-secondary))', marginBottom: '32px', lineHeight: 1.6 }}>
              A premium, interactive platform built to help you track, analyze, and offset your carbon footprint. Engage in gamified challenges, log daily habits, grow your virtual forest, and get AI guidance to make a real-world difference.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button
                className="btn-primary"
                onClick={() => setActiveTab('estimator')}
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                Estimate My Footprint <Sparkles size={16} />
              </button>
              
              <button
                className="btn-secondary"
                onClick={() => {
                  localStorage.setItem('gp_has_estimated', 'true');
                  setActiveTab('dashboard');
                }}
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                Skip to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* View Routing */}
        {activeTab === 'dashboard' && <Dashboard onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'estimator' && <Estimator onComplete={handleEstimationComplete} />}
        {activeTab === 'challenges' && <Challenges />}
        {activeTab === 'journal' && <Journal />}
        {activeTab === 'rewards' && <Rewards />}
        {activeTab === 'forest' && <OffsetForest />}
        {activeTab === 'ai' && <AIAdvisor />}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-glass)',
          padding: '24px 0',
          background: 'rgba(9, 12, 11, 0.95)',
          color: 'hsl(var(--text-muted))',
          fontSize: '0.8rem',
        }}
      >
        <div className="container flex-row-center" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div>
            &copy; {new Date().getFullYear()} GreenPulse Inc. All rights reserved.
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'hsl(var(--accent-mint))',
                boxShadow: 'var(--glow-mint)',
              }}
            />
            <span style={{ color: 'hsl(var(--text-secondary))' }}>
              Optimized for GCP Cloud Infrastructure
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

function App() {
  return (
    <EcoProvider>
      <MainApp />
    </EcoProvider>
  );
}

export default App;
