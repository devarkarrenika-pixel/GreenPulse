import React from 'react';
import { useEco } from '../context/EcoContext';
import { Leaf, Award, ArrowUpRight, TrendingDown, Flame, Car, Utensils, ShoppingBag, Calendar, Zap } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { calculatedFootprint, ecoPoints, streak, history, activeChallenges, completedChallenges, level, levelTitle, xpPercentage } = useEco();

  const totalCarbon = calculatedFootprint.total;

  // Compute rating and descriptions based on total carbon emissions
  let carbonStatus = {
    title: 'Minimal Impact',
    badge: 'badge-mint',
    description: 'Amazing! Your footprint aligns with the global climate target of < 2.0t CO₂e.',
    colorClass: 'pulse-indicator-green',
    iconColor: 'hsl(var(--accent-mint))',
    scoreRating: 'A+',
  };

  if (totalCarbon > 2.0 && totalCarbon <= 6.0) {
    carbonStatus = {
      title: 'Eco Friendly',
      badge: 'badge-mint',
      description: 'Great job! You are well below the national average and nearing the global target.',
      colorClass: 'pulse-indicator-green',
      iconColor: 'hsl(var(--accent-mint))',
      scoreRating: 'B',
    };
  } else if (totalCarbon > 6.0 && totalCarbon <= 12.0) {
    carbonStatus = {
      title: 'Average Impact',
      badge: 'badge-cyan',
      description: 'Your carbon output is average. You can lower it with small lifestyle upgrades.',
      colorClass: 'pulse-indicator-green',
      iconColor: 'hsl(var(--accent-cyan))',
      scoreRating: 'C',
    };
  } else {
    carbonStatus = {
      title: 'High Impact',
      badge: 'badge-coral',
      description: 'Your footprint exceeds average sustainability metrics. Try committing to challenges below.',
      colorClass: 'pulse-indicator-red',
      iconColor: 'hsl(var(--accent-coral))',
      scoreRating: 'D',
    };
  }

  // Draw custom SVG Line Chart
  // Find min/max values to fit history inside the chart viewBox
  const paddingX = 40;
  const paddingY = 30;
  const width = 500;
  const height = 200;

  const minScore = 0;
  // Max score is either max of history, or a baseline of 18
  const maxScore = Math.max(...history.map(h => h.score), 16);

  // Generate SVG coordinates
  const points = history.map((item, idx) => {
    const x = paddingX + (idx / (history.length - 1)) * (width - 2 * paddingX);
    // In SVG, y=0 is at the top, so we subtract from height
    const ratio = (item.score - minScore) / (maxScore - minScore);
    const y = height - paddingY - ratio * (height - 2 * paddingY);
    return { x, y, score: item.score, date: item.date };
  });

  // Create path description string
  const pathD = points.reduce((acc, p, idx) => {
    if (idx === 0) return `M ${p.x} ${p.y}`;
    // Curving lines
    const prev = points[idx - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (p.x - prev.x) / 2;
    const cpY2 = p.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
  }, '');

  // Gridlines values
  const gridLines = [0.25, 0.5, 0.75].map(ratio => {
    const val = minScore + ratio * (maxScore - minScore);
    const y = height - paddingY - ratio * (height - 2 * paddingY);
    return { y, value: val.toFixed(0) };
  });

  return (
    <div className="view-transition" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '50px' }}>
      
      {/* Top Banner Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifySelf: 'start', justifyItems: 'center', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', background: 'rgba(251, 176, 27, 0.1)', borderRadius: '10px', color: 'hsl(var(--accent-gold))' }}>
              <Leaf size={18} />
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', fontWeight: 600 }}>User Status</p>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>Lvl {level}: {levelTitle}</h4>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', marginTop: '4px' }}>
            <div className="xp-container" style={{ flex: 1, height: '6px' }}>
              <div className="xp-bar" style={{ width: `${xpPercentage}%` }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>{xpPercentage}%</span>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px' }}>
          <div style={{ padding: '10px', background: 'rgba(27, 242, 147, 0.1)', borderRadius: '12px' }}>
            <Award size={24} style={{ color: 'hsl(var(--accent-mint))' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', fontWeight: 600 }}>Eco Points</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'hsl(var(--accent-mint))' }}>{ecoPoints}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px' }}>
          <div style={{ padding: '10px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '12px' }}>
            <Calendar size={24} style={{ color: 'hsl(var(--accent-cyan))' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', fontWeight: 600 }}>Daily Streak</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'hsl(var(--accent-cyan))' }}>{streak} {streak === 1 ? 'day' : 'days'}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px' }}>
          <div style={{ padding: '10px', background: 'rgba(255, 62, 108, 0.1)', borderRadius: '12px' }}>
            <Zap size={24} style={{ color: 'hsl(var(--accent-coral))' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', fontWeight: 600 }}>Active Projects</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'hsl(var(--text-primary))' }}>{activeChallenges.length} committed</h3>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid-2">
        {/* Left: The Carbon Pulse Ring */}
        <div className="glass-panel flex-center" style={{ flexDirection: 'column', padding: '40px 24px', textAlign: 'center' }}>
          <span className={`badge ${carbonStatus.badge}`} style={{ marginBottom: '16px' }}>{carbonStatus.title}</span>
          
          {/* Pulsing ring wrapper */}
          <div
            className={carbonStatus.colorClass}
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'rgba(25, 34, 30, 0.8)',
              border: `2px solid ${carbonStatus.iconColor}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '12px 0 24px',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', fontWeight: 600 }}>Annual Footprint</span>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, margin: '2px 0', color: 'white' }}>{totalCarbon}</span>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>tons CO₂e</span>

            {/* Float badge rating */}
            <div
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: carbonStatus.iconColor,
                color: 'black',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
              }}
            >
              {carbonStatus.scoreRating}
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', maxWidth: '320px', margin: '0 auto 20px' }}>
            {carbonStatus.description}
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-primary" onClick={() => onNavigate('estimator')}>
              Recalculate <ArrowUpRight size={16} />
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('challenges')}>
              Explore Challenges
            </button>
          </div>
        </div>

        {/* Right: Category Breakdown Progress bars */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Impact Breakdown</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '24px' }}>Your annual emissions distributed by category.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Transport */}
              <div>
                <div className="flex-row-center" style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                    <Car size={16} style={{ color: 'hsl(var(--accent-mint))' }} /> Transportation
                  </span>
                  <span>{calculatedFootprint.transport} t CO₂</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: 'hsl(var(--accent-mint))',
                      width: `${Math.min(100, (calculatedFootprint.transport / 8) * 100)}%`,
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>

              {/* Diet */}
              <div>
                <div className="flex-row-center" style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                    <Utensils size={16} style={{ color: 'hsl(var(--accent-cyan))' }} /> Diet & Food
                  </span>
                  <span>{calculatedFootprint.diet} t CO₂</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: 'hsl(var(--accent-cyan))',
                      width: `${Math.min(100, (calculatedFootprint.diet / 4) * 100)}%`,
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>

              {/* Energy */}
              <div>
                <div className="flex-row-center" style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                    <Flame size={16} style={{ color: 'hsl(var(--accent-coral))' }} /> Home Energy
                  </span>
                  <span>{calculatedFootprint.energy} t CO₂</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: 'hsl(var(--accent-coral))',
                      width: `${Math.min(100, (calculatedFootprint.energy / 5) * 100)}%`,
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>

              {/* Consumption */}
              <div>
                <div className="flex-row-center" style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                    <ShoppingBag size={16} style={{ color: 'rgba(255,255,255,0.7)' }} /> Material Goods
                  </span>
                  <span>{calculatedFootprint.consumption} t CO₂</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: 'rgba(255,255,255,0.7)',
                      width: `${Math.min(100, (calculatedFootprint.consumption / 3) * 100)}%`,
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-glass)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingDown size={20} className="text-mint" style={{ color: 'hsl(var(--accent-mint))' }} />
            <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>
              Completed challenges and clean energy choices subtract carbon credits from your footprint in real-time.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Historical Chart */}
      <div className="glass-panel">
        <div className="flex-row-center" style={{ marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Emissions Timeline</h3>
            <p style={{ fontSize: '0.85rem' }}>Track your carbon baseline improvements over time.</p>
          </div>
          <span className="badge badge-mint" style={{ textTransform: 'none' }}>
            {completedChallenges.length} Challenges Solved
          </span>
        </div>

        {/* Custom SVG Line Chart */}
        <div style={{ width: '100%', overflowX: 'auto', padding: '10px 0' }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: '100%', minWidth: '450px', height: 'auto', overflow: 'visible' }}
          >
            {/* Gridlines */}
            {gridLines.map((line, idx) => (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={line.y}
                  x2={width - paddingX}
                  y2={line.y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4,4"
                />
                <text
                  x={paddingX - 10}
                  y={line.y + 4}
                  fill="hsl(var(--text-muted))"
                  fontSize="9"
                  textAnchor="end"
                  fontFamily="var(--font-sans)"
                >
                  {line.value}t
                </text>
              </g>
            ))}

            {/* Glowing Gradient fill under line */}
            <defs>
              <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--accent-mint))" stopOpacity="0.25" />
                <stop offset="100%" stopColor="hsl(var(--accent-mint))" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {points.length > 1 && (
              <>
                {/* Gradient Path */}
                <path
                  d={`${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`}
                  fill="url(#chartGlow)"
                />

                {/* Main line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="hsl(var(--accent-mint))"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.4))' }}
                />
              </>
            )}

            {/* Circles for each point */}
            {points.map((p, idx) => (
              <g key={idx}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="hsl(var(--bg-obsidian))"
                  stroke="hsl(var(--accent-mint))"
                  strokeWidth="2.5"
                  style={{ cursor: 'pointer' }}
                />
                {/* Tooltip background & text */}
                <text
                  x={p.x}
                  y={p.y - 12}
                  fill="white"
                  fontSize="9"
                  fontWeight="600"
                  textAnchor="middle"
                  fontFamily="var(--font-sans)"
                >
                  {p.score}t
                </text>
                
                {/* Date Axis Label */}
                <text
                  x={p.x}
                  y={height - paddingY + 16}
                  fill="hsl(var(--text-muted))"
                  fontSize="9.5"
                  textAnchor="middle"
                  fontFamily="var(--font-sans)"
                >
                  {p.date}
                </text>
              </g>
            ))}

            {/* Base line */}
            <line
              x1={paddingX}
              y1={height - paddingY}
              x2={width - paddingX}
              y2={height - paddingY}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
