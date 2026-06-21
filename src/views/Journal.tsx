import React from 'react';
import { useEco } from '../context/EcoContext';
import type { DailyActions } from '../context/EcoContext';
import { CheckSquare, Square, Calendar, Sparkles, Smile, Zap } from 'lucide-react';

export const Journal: React.FC = () => {
  const { dailyActions, toggleDailyAction, streak } = useEco();

  const actionKeys: { key: keyof DailyActions; label: string; points: number; desc: string; carbonAvoided: number }[] = [
    {
      key: 'commutedGreen',
      label: 'Eco-Friendly Commute',
      points: 15,
      desc: 'Biked, walked, carpooled, or used public transit instead of driving solo.',
      carbonAvoided: 2.8, // kg CO2
    },
    {
      key: 'atePlantBased',
      label: 'Plant-Based Meals',
      points: 15,
      desc: 'Ate vegetarian or vegan. Avoided high-impact beef or dairy products.',
      carbonAvoided: 3.5, // kg CO2
    },
    {
      key: 'savedEnergy',
      label: 'Energy Conservator',
      points: 15,
      desc: 'Turned off standby appliances, unplugged idle electronics, or lowered heater.',
      carbonAvoided: 1.5, // kg CO2
    },
    {
      key: 'reusedOrRecycled',
      label: 'Waste Warrior',
      points: 15,
      desc: 'Sorted waste, composted organic food scraps, or bought pre-owned item.',
      carbonAvoided: 1.1, // kg CO2
    },
    {
      key: 'avoidedPlastic',
      label: 'Zero Single-Use Plastic',
      points: 15,
      desc: 'Carried a reusable shopping bag, coffee cup, or steel water bottle.',
      carbonAvoided: 0.6, // kg CO2
    },
  ];

  // Stats
  const completedCount = Object.values(dailyActions).filter(Boolean).length;
  const totalActions = actionKeys.length;
  const carbonSavedToday = actionKeys.reduce((acc, current) => {
    return acc + (dailyActions[current.key] ? current.carbonAvoided : 0);
  }, 0);

  const getTodayDateString = () => {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="view-transition" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '50px' }}>
      
      {/* Header */}
      <div className="flex-row-center">
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Daily Green Journal</h2>
          <p style={{ fontSize: '0.9rem' }}>Log simple daily actions and earn bonus Eco Points.</p>
        </div>
        <span className="badge badge-cyan" style={{ textTransform: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} /> {getTodayDateString()}
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid-2">
        
        {/* Left: Checklist */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Log Today's Good Actions</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {actionKeys.map(action => (
              <div
                key={action.key}
                onClick={() => toggleDailyAction(action.key)}
                className="glass-card-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '16px',
                  background: dailyActions[action.key] ? 'rgba(16, 185, 129, 0.04)' : 'rgba(20, 26, 23, 0.4)',
                  borderColor: dailyActions[action.key] ? 'hsl(var(--accent-mint))' : 'var(--border-glass)',
                  transform: 'none',
                }}
              >
                <div style={{ marginTop: '2px', color: dailyActions[action.key] ? 'hsl(var(--accent-mint))' : 'hsl(var(--text-muted))' }}>
                  {dailyActions[action.key] ? (
                    <CheckSquare size={22} style={{ color: 'hsl(var(--accent-mint))', filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.4))' }} />
                  ) : (
                    <Square size={22} />
                  )}
                </div>
                
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div className="flex-row-center" style={{ width: '100%' }}>
                    <h4 style={{ fontSize: '1rem', color: dailyActions[action.key] ? 'white' : 'hsl(var(--text-primary))' }}>{action.label}</h4>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--accent-mint))' }}>+{action.points} pts</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>{action.desc}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>
                    <Zap size={10} style={{ color: 'hsl(var(--accent-coral))' }} /> Saves approx {action.carbonAvoided} kg CO₂
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Daily Stats and Streaks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Progress Circular Panel */}
          <div className="glass-panel flex-center" style={{ flexDirection: 'column', padding: '32px 24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Today's Check-in</h3>
            
            {/* Visual SVG Progress Circle */}
            <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '20px' }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="8"
                />
                {/* Progress bar circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="transparent"
                  stroke="hsl(var(--accent-mint))"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - completedCount / totalActions)}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 0.4s ease',
                    filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.35))',
                  }}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{completedCount}/{totalActions}</div>
                <div style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Logged</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', marginTop: '8px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Saved Today</span>
                <strong style={{ fontSize: '1.2rem', color: 'hsl(var(--accent-mint))' }}>{carbonSavedToday.toFixed(1)} <span style={{ fontSize: '0.8rem' }}>kg</span></strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Daily Payout</span>
                <strong style={{ fontSize: '1.2rem', color: 'hsl(var(--text-primary))' }}>+{completedCount * 15} <span style={{ fontSize: '0.8rem' }}>pts</span></strong>
              </div>
            </div>
          </div>

          {/* Streak details panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '10px' }}>
                <Sparkles size={20} style={{ color: 'hsl(var(--accent-cyan))' }} />
              </div>
              <h3 style={{ fontSize: '1.05rem', textAlign: 'left' }}>Maintain the Rhythm</h3>
            </div>
            
            <p style={{ fontSize: '0.85rem', textAlign: 'left', marginBottom: '16px' }}>
              Log at least one action every 24 hours to grow your streak! Achieving streaks unlocks carbon titles and exclusive points multipliers.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: 'linear-gradient(90deg, rgba(6,182,212,0.1) 0%, transparent 100%)',
                borderRadius: '12px',
                borderLeft: '3px solid hsl(var(--accent-cyan))',
              }}
            >
              <Smile size={32} style={{ color: 'hsl(var(--accent-cyan))' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  Current Streak: {streak} {streak === 1 ? 'Day' : 'Days'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>
                  {streak === 0
                    ? "Check off an action to start today's streak!"
                    : streak < 3
                    ? 'Nice start! Keep it up for 3 days to hit a bronze milestone.'
                    : 'Unstoppable! You are setting an excellent standard.'}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
