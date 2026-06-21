import React, { useState } from 'react';
import { useEco } from '../context/EcoContext';
import { Zap, Check, CheckCircle2, ShieldPlus, Trash2, Flame, Car, Utensils, ShoppingBag } from 'lucide-react';

export const Challenges: React.FC = () => {
  const {
    availableChallenges,
    activeChallenges,
    completedChallenges,
    commitChallenge,
    uncommitChallenge,
    completeChallenge,
    addHistoryPoint,
    calculatedFootprint
  } = useEco();

  const [filter, setFilter] = useState<string>('all');
  const [celebratedId, setCelebratedId] = useState<string | null>(null);

  // Category Icon Mapper
  const getCategoryIcon = (category: string, size = 18) => {
    switch (category) {
      case 'transport': return <Car size={size} style={{ color: 'hsl(var(--accent-mint))' }} />;
      case 'diet': return <Utensils size={size} style={{ color: 'hsl(var(--accent-cyan))' }} />;
      case 'energy': return <Flame size={size} style={{ color: 'hsl(var(--accent-coral))' }} />;
      default: return <ShoppingBag size={size} style={{ color: 'rgba(255,255,255,0.7)' }} />;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return <span className="badge badge-coral">High Impact</span>;
      case 'medium': return <span className="badge badge-cyan">Medium Impact</span>;
      default: return <span className="badge badge-mint">Low Impact</span>;
    }
  };

  // Filter logic
  const filteredAvailable = availableChallenges.filter(c => {
    const isNotActiveOrDone = !activeChallenges.includes(c.id) && !completedChallenges.includes(c.id);
    if (!isNotActiveOrDone) return false;
    if (filter === 'all') return true;
    return c.category === filter;
  });

  const activeChallengeObjects = availableChallenges.filter(c => activeChallenges.includes(c.id));
  const completedChallengeObjects = availableChallenges.filter(c => completedChallenges.includes(c.id));

  const handleComplete = (id: string) => {
    setCelebratedId(id);
    completeChallenge(id);
    // Add point to history after updating score (subtracting the saving)
    const challenge = availableChallenges.find(c => c.id === id);
    const saving = challenge ? challenge.carbonSaving : 0;
    const nextScore = Math.max(1.0, parseFloat((calculatedFootprint.total - saving).toFixed(1)));
    addHistoryPoint(nextScore);

    // Turn off celebration after 3 seconds
    setTimeout(() => {
      setCelebratedId(null);
    }, 2800);
  };

  return (
    <div className="view-transition" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '50px' }}>
      
      {/* Celebration overlay */}
      {celebratedId && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(9, 12, 11, 0.9)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '420px',
              width: '90%',
              textAlign: 'center',
              border: '2px solid hsl(var(--accent-mint))',
              boxShadow: 'var(--glow-mint-strong)',
              padding: '40px 24px',
              animation: 'slide-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', marginBottom: '20px' }}>
              <CheckCircle2 size={48} className="floating-icon" style={{ color: 'hsl(var(--accent-mint))' }} />
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Challenge Completed!</h2>
            <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '24px' }}>
              Awesome job reducing your carbon footprint! You earned eco points and lowered your annual carbon score.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '8px 16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Points Reward</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'hsl(var(--accent-mint))' }}>
                  +{availableChallenges.find(c => c.id === celebratedId)?.points} pts
                </div>
              </div>
              <div style={{ padding: '8px 16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Carbon Reduced</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'hsl(var(--accent-coral))' }}>
                  -{availableChallenges.find(c => c.id === celebratedId)?.carbonSaving} tons/yr
                </div>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%' }} onClick={() => setCelebratedId(null)}>
              Keep Going!
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Gamified Eco-Challenges</h2>
        <p style={{ fontSize: '0.9rem' }}>Commit to sustainable habits and reduce your ecological impact step-by-step.</p>
      </div>

      {/* Active Committed Challenges */}
      {activeChallengeObjects.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'hsl(var(--accent-mint))', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} /> My Active Challenges ({activeChallengeObjects.length})
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            {activeChallengeObjects.map(c => (
              <div
                key={c.id}
                className="glass-panel"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderColor: 'rgba(16, 185, 129, 0.25)',
                  background: 'rgba(16, 185, 129, 0.02)',
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                    {getCategoryIcon(c.category, 24)}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h4 style={{ fontSize: '1.05rem' }}>{c.title}</h4>
                      {getImpactBadge(c.impact)}
                    </div>
                    <p style={{ fontSize: '0.85rem', marginTop: '4px', maxWidth: '500px' }}>{c.description}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--accent-mint))' }}>+{c.points} pts</div>
                    <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>-{c.carbonSaving}t CO₂e/yr</div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn-primary"
                      onClick={() => handleComplete(c.id)}
                      style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
                    >
                      Complete <Check size={14} />
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => uncommitChallenge(c.id)}
                      style={{ padding: '8px', borderRadius: '8px', color: 'hsl(var(--accent-coral))' }}
                      title="Abandon Challenge"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Challenges to Commit */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="flex-row-center" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Available Challenges ({filteredAvailable.length})</h3>
          
          {/* Categories Tab selector */}
          <div className="tab-navigation" style={{ padding: '4px' }}>
            {['all', 'transport', 'diet', 'energy', 'consumption'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`tab-btn ${filter === cat ? 'active' : ''}`}
                style={{ padding: '6px 12px', fontSize: '0.8rem', textTransform: 'capitalize' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredAvailable.length === 0 ? (
          <div className="glass-panel flex-center" style={{ padding: '48px', color: 'hsl(var(--text-muted))', flexDirection: 'column' }}>
            <CheckCircle2 size={36} style={{ color: 'hsl(var(--accent-mint))', marginBottom: '12px' }} />
            <p>You have committed to all available challenges in this category!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {filteredAvailable.map(c => (
              <div
                key={c.id}
                className="glass-card-interactive"
                onClick={() => commitChallenge(c.id)}
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190px', padding: '20px' }}
              >
                <div>
                  <div className="flex-row-center" style={{ marginBottom: '12px' }}>
                    <div style={{ padding: '6px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px' }}>
                      {getCategoryIcon(c.category, 18)}
                    </div>
                    {getImpactBadge(c.impact)}
                  </div>
                  
                  <h4 style={{ fontSize: '1rem', marginBottom: '6px', textAlign: 'left' }}>{c.title}</h4>
                  <p style={{ fontSize: '0.8rem', textAlign: 'left', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Reward: </span>
                    <strong style={{ fontSize: '0.85rem', color: 'hsl(var(--accent-mint))' }}>{c.points} pts</strong>
                  </div>
                  
                  <button
                    className="btn-secondary"
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: 'hsl(var(--accent-mint))',
                      borderColor: 'rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    Commit <ShieldPlus size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Challenges History */}
      {completedChallengeObjects.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: 0.85 }}>
          <h3 style={{ fontSize: '1.1rem', color: 'hsl(var(--text-muted))' }}>Completed Challenges ({completedChallengeObjects.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {completedChallengeObjects.map(c => (
              <div
                key={c.id}
                className="glass-panel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  background: 'rgba(255,255,255,0.01)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
                  <Check size={14} style={{ color: 'hsl(var(--accent-mint))' }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontSize: '0.85rem', textDecoration: 'line-through', opacity: 0.6 }}>{c.title}</h4>
                  <div style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>
                    Awarded {c.points} pts • Saved {c.carbonSaving}t/yr
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
