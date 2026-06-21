import React, { useState } from 'react';
import { useEco } from '../context/EcoContext';
import { Heart, DollarSign } from 'lucide-react';

export const OffsetForest: React.FC = () => {
  const { calculatedFootprint } = useEco();
  const [offsetPercent, setOffsetPercent] = useState<number>(30);

  const totalCarbon = calculatedFootprint.total;
  
  // 1 tree absorbs ~22kg of CO2/year = 0.022 metric tons
  const annualTreeAbsorbingCapacity = 0.022;
  const totalTreesNeeded = Math.ceil(totalCarbon / annualTreeAbsorbingCapacity);
  
  const simulatedTrees = Math.ceil(totalTreesNeeded * (offsetPercent / 100));
  const carbonOffset = parseFloat((simulatedTrees * annualTreeAbsorbingCapacity).toFixed(1));
  const remainingCarbon = Math.max(0, parseFloat((totalCarbon - carbonOffset).toFixed(1)));
  
  // Cost to plant trees (avg $1.00 per tree through global programs)
  const simulatedCost = simulatedTrees * 1; 

  // Generate coordinate array for planting trees in the digital grid
  // Max trees in visual display represents 30 trees to avoid overload, scaled proportionally
  const visualMax = 24;
  const visualTreesCount = Math.min(visualMax, Math.ceil(visualMax * (offsetPercent / 100)));

  // Generate stable coordinates for visual trees
  const generateVisualTrees = () => {
    const list = [];
    const cols = 6;
    for (let i = 0; i < visualTreesCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      // Introduce slight randomness for organic forest layout
      const jitterX = (i * 17) % 12 - 6;
      const jitterY = (i * 23) % 8 - 4;
      const posX = 15 + col * 14 + jitterX;
      const posY = 15 + row * 22 + jitterY;
      // Stable scale & opacity for animation growth
      const scale = 0.6 + ((i * 7) % 5) * 0.1; 
      list.push({ x: posX, y: posY, scale });
    }
    return list;
  };

  const visualTrees = generateVisualTrees();

  return (
    <div className="view-transition" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '50px' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Eco-Offset Forest Simulator</h2>
        <p style={{ fontSize: '0.9rem' }}>Understand what it takes to balance your carbon score. Simulating tree growth based on real botanical metrics.</p>
      </div>

      <div className="grid-2">
        
        {/* Left: Forest Canvas Visualization */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '380px',
            position: 'relative',
            padding: '20px',
            overflow: 'hidden',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', textAlign: 'left' }}>Your Virtual Offset Forest</h3>
            <p style={{ fontSize: '0.8rem', textAlign: 'left', marginBottom: '16px' }}>
              Visualizing {simulatedTrees} trees out of {totalTreesNeeded} required.
            </p>
          </div>

          {/* Forest SVG grid container */}
          <div
            style={{
              flex: 1,
              background: 'linear-gradient(180deg, rgba(20, 26, 23, 0.4) 0%, rgba(9, 12, 11, 0.8) 100%)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              minHeight: '220px',
              position: 'relative',
            }}
          >
            {visualTrees.length === 0 ? (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'hsl(var(--text-muted))',
                  fontSize: '0.85rem',
                }}
              >
                🌲 Move the slider below to plant trees!
              </div>
            ) : (
              <svg
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Visual grid trees */}
                {visualTrees.map((tree, idx) => {
                  const greenH = 120 + (offsetPercent * 0.4); // goes from yellow-green to emerald
                  return (
                    <g
                      key={idx}
                      style={{
                        transform: `translate(${tree.x}%, ${tree.y}%) scale(${tree.scale})`,
                        transformOrigin: 'bottom center',
                        animation: 'slide-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                      }}
                    >
                      {/* Leaf canopy */}
                      <path
                        d="M 0 -18 L 8 -4 L -8 -4 Z"
                        fill={`hsl(${greenH}, 70%, 35%)`}
                        stroke={`hsl(${greenH}, 75%, 20%)`}
                        strokeWidth="0.5"
                      />
                      <path
                        d="M 0 -24 L 6 -12 L -6 -12 Z"
                        fill={`hsl(${greenH + 10}, 75%, 42%)`}
                        stroke={`hsl(${greenH}, 80%, 25%)`}
                        strokeWidth="0.5"
                      />
                      {/* Tree Trunk */}
                      <rect x="-1.5" y="-4" width="3" height="4" fill="#78350F" />
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* Interactive slider */}
          <div className="slider-group" style={{ marginTop: '20px', marginBottom: 0 }}>
            <div className="slider-header">
              <span className="slider-label" style={{ fontSize: '0.85rem' }}>Simulated Offset Level</span>
              <span className="slider-value">{offsetPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={offsetPercent}
              onChange={e => setOffsetPercent(parseInt(e.target.value))}
              className="slider-input"
            />
          </div>
        </div>

        {/* Right: Calculations Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Botanical Math</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>Understanding tree offset calculations.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>My Carbon footprint:</span>
                <strong style={{ fontSize: '0.95rem' }}>{totalCarbon} tons/year</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>Absorption Rate:</span>
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>~22kg CO₂ / tree / year</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>Total trees needed:</span>
                <strong style={{ fontSize: '0.95rem', color: 'hsl(var(--accent-mint))' }}>{totalTreesNeeded} trees</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>Simulated carbon offset:</span>
                <strong style={{ fontSize: '0.95rem', color: 'hsl(var(--accent-mint))' }}>-{carbonOffset} tons/year</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>Remaining net footprint:</span>
                <strong style={{ fontSize: '0.95rem', color: 'hsl(var(--accent-coral))' }}>{remainingCarbon} tons/year</strong>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '10px', background: 'rgba(16,185,129,0.15)', borderRadius: '50%', color: 'hsl(var(--accent-mint))' }}>
              <Heart size={20} />
            </div>
            
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Estimated Donation Cost</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center' }}>
                <DollarSign size={18} style={{ color: 'hsl(var(--accent-mint))', marginRight: '-2px' }} />
                {simulatedCost.toLocaleString()} USD
              </div>
              <p style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>
                Based on typical reforestation partners at $1 per tree planted.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {offsetPercent === 100 && (
        <div className="view-transition certificate-card" style={{ marginTop: '28px' }}>
          <div className="certificate-seal">
            ★
          </div>
          <h3 className="text-gradient" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
            Certificate of Carbon Neutrality
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'hsl(var(--text-secondary))', maxWidth: '550px', margin: '0 auto 16px' }}>
            This certifies that you have simulated planting a forest of <strong>{simulatedTrees}</strong> trees, fully absorbing your annual footprint of <strong>{totalCarbon} tons of CO₂e</strong>.
          </p>
          <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', maxWidth: '400px', margin: '0 auto' }}>
            <span>Verified GreenPulse Botanicals</span>
            <span>Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
