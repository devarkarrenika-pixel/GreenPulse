import React, { useState } from 'react';
import { useEco } from '../context/EcoContext';
import type { VehicleType, DietType, HeatingType } from '../context/EcoContext';
import { Car, Flame, ShoppingBag, Utensils, ArrowRight, ArrowLeft, Check, Leaf } from 'lucide-react';

interface EstimatorProps {
  onComplete: () => void;
}

export const Estimator: React.FC<EstimatorProps> = ({ onComplete }) => {
  const { answers, updateAnswers, calculatedFootprint } = useEco();
  const [step, setStep] = useState<number>(0);

  const steps = [
    { name: 'Transportation', icon: <Car size={20} className="text-mint" /> },
    { name: 'Diet & Food', icon: <Utensils size={20} className="text-mint" /> },
    { name: 'Home Energy', icon: <Flame size={20} className="text-mint" /> },
    { name: 'Consumption', icon: <ShoppingBag size={20} className="text-mint" /> },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  return (
    <div className="view-transition" style={{ maxWidth: '700px', margin: '0 auto', padding: '12px 0 40px' }}>
      <div className="flex-row-center" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Leaf className="text-mint" style={{ color: 'hsl(var(--accent-mint))' }} />
            Carbon Footprint Estimator
          </h2>
          <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Calculate your emissions and set a baseline.</p>
        </div>
        <span className="badge badge-mint">Step {step + 1} of 4</span>
      </div>

      {/* Progress Line */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {steps.map((_, idx) => (
          <div
            key={idx}
            style={{
              height: '4px',
              flex: 1,
              backgroundColor: idx <= step ? 'hsl(var(--accent-mint))' : 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              transition: 'background-color 0.3s ease',
            }}
          />
        ))}
      </div>

      <div className="glass-panel" style={{ position: 'relative' }}>
        {/* Step 1: Transport */}
        {step === 0 && (
          <div className="view-transition">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                <Car size={24} style={{ color: 'hsl(var(--accent-mint))' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Transportation Habits</h3>
                <p style={{ fontSize: '0.85rem' }}>Travel accounts for ~30% of individual emissions.</p>
              </div>
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Car driving (miles per week)</span>
                <span className="slider-value">{answers.carMilesPerWeek} mi</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={answers.carMilesPerWeek}
                onChange={e => updateAnswers({ carMilesPerWeek: parseInt(e.target.value) })}
                className="slider-input"
              />
            </div>

            {answers.carMilesPerWeek > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.95rem' }}>
                  What type of car do you drive?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {(['gas', 'hybrid', 'ev'] as VehicleType[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updateAnswers({ vehicleType: t })}
                      className="tab-btn"
                      style={{
                        justifyContent: 'center',
                        textTransform: 'capitalize',
                        backgroundColor: answers.vehicleType === t ? 'hsl(var(--accent-mint))' : 'rgba(255, 255, 255, 0.03)',
                        color: answers.vehicleType === t ? 'hsl(var(--bg-obsidian))' : 'hsl(var(--text-secondary))',
                        border: '1px solid',
                        borderColor: answers.vehicleType === t ? 'hsl(var(--accent-mint))' : 'var(--border-glass)',
                        padding: '10px',
                      }}
                    >
                      {t === 'ev' ? 'Electric (EV)' : t}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateAnswers({ vehicleType: 'none', carMilesPerWeek: 0 })}
                    className="tab-btn"
                    style={{
                      justifyContent: 'center',
                      backgroundColor: answers.vehicleType === 'none' ? 'hsl(var(--accent-mint))' : 'rgba(255, 255, 255, 0.03)',
                      color: answers.vehicleType === 'none' ? 'hsl(var(--bg-obsidian))' : 'hsl(var(--text-secondary))',
                      border: '1px solid',
                      borderColor: answers.vehicleType === 'none' ? 'hsl(var(--accent-mint))' : 'var(--border-glass)',
                      padding: '10px',
                    }}
                  >
                    No Car
                  </button>
                </div>
              </div>
            )}

            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Public transit usage (miles per week)</span>
                <span className="slider-value">{answers.transitMilesPerWeek} mi</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="5"
                value={answers.transitMilesPerWeek}
                onChange={e => updateAnswers({ transitMilesPerWeek: parseInt(e.target.value) })}
                className="slider-input"
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Flights per year (round trips)</span>
                <span className="slider-value">{answers.flightsPerYear} flights</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={answers.flightsPerYear}
                onChange={e => updateAnswers({ flightsPerYear: parseInt(e.target.value) })}
                className="slider-input"
              />
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid hsl(var(--accent-mint))' }}>
              <p style={{ fontSize: '0.85rem' }}>
                💡 Estimated Transportation Carbon: <strong style={{ color: 'hsl(var(--accent-mint))' }}>{calculatedFootprint.transport}</strong> metric tons CO₂e / year.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Diet */}
        {step === 1 && (
          <div className="view-transition">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                <Utensils size={24} style={{ color: 'hsl(var(--accent-mint))' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Dietary Habits</h3>
                <p style={{ fontSize: '0.85rem' }}>What we eat influences resource consumption and agriculture emissions.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '24px' }}>
              {[
                { type: 'vegan' as DietType, title: 'Vegan', desc: 'Fully plant-based, zero animal products. Lowest footprint (~1.2t / year).' },
                { type: 'vegetarian' as DietType, title: 'Vegetarian', desc: 'No meat, but eat dairy/eggs. Moderately low footprint (~1.7t / year).' },
                { type: 'low-meat' as DietType, title: 'Low Meat / Flexitarian', desc: 'Rarely eat red meat, focus on chicken/fish/plants (~2.3t / year).' },
                { type: 'high-meat' as DietType, title: 'High Meat Consumer', desc: 'Eat beef, pork, or poultry daily (~3.3t / year).' },
              ].map(d => (
                <div
                  key={d.type}
                  onClick={() => updateAnswers({ dietType: d.type })}
                  className="glass-card-interactive"
                  style={{
                    padding: '16px',
                    borderColor: answers.dietType === d.type ? 'hsl(var(--accent-mint))' : 'var(--border-glass)',
                    background: answers.dietType === d.type ? 'rgba(16, 185, 129, 0.05)' : 'rgba(20, 26, 23, 0.4)',
                    boxShadow: answers.dietType === d.type ? 'var(--glow-mint)' : 'none',
                    transform: 'none', // Override standard hover translate to avoid layout shifts in estimator
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ textAlign: 'left' }}>
                      <h4 style={{ color: answers.dietType === d.type ? 'hsl(var(--accent-mint))' : 'hsl(var(--text-primary))' }}>{d.title}</h4>
                      <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>{d.desc}</p>
                    </div>
                    {answers.dietType === d.type && (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'hsl(var(--accent-mint))', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
                        <Check size={12} color="black" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid hsl(var(--accent-mint))' }}>
              <p style={{ fontSize: '0.85rem' }}>
                💡 Estimated Food Carbon: <strong style={{ color: 'hsl(var(--accent-mint))' }}>{calculatedFootprint.diet}</strong> metric tons CO₂e / year.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Home Energy */}
        {step === 2 && (
          <div className="view-transition">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                <Flame size={24} style={{ color: 'hsl(var(--accent-mint))' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Household Energy</h3>
                <p style={{ fontSize: '0.85rem' }}>Household power, heating, and clean energy contracts make up ~20% of emissions.</p>
              </div>
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Average electricity bill (per month)</span>
                <span className="slider-value">${answers.electricBill}</span>
              </div>
              <input
                type="range"
                min="10"
                max="400"
                step="10"
                value={answers.electricBill}
                onChange={e => updateAnswers({ electricBill: parseInt(e.target.value) })}
                className="slider-input"
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Clean Energy Share (Solar/Wind Contract)</span>
                <span className="slider-value">{answers.cleanEnergyRatio}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={answers.cleanEnergyRatio}
                onChange={e => updateAnswers({ cleanEnergyRatio: parseInt(e.target.value) })}
                className="slider-input"
              />
              <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '-4px' }}>
                Specify if your grid provider guarantees clean offsets, or if you have rooftop solar.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.95rem' }}>
                Primary home heating source:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {[
                  { type: 'gas' as HeatingType, title: 'Natural Gas Boiler' },
                  { type: 'electric' as HeatingType, title: 'Electric Resistance' },
                  { type: 'heatpump' as HeatingType, title: 'Heat Pump (Highly Efficient)' },
                  { type: 'other' as HeatingType, title: 'Wood/Coal/Oil/Other' },
                ].map(h => (
                  <button
                    key={h.type}
                    type="button"
                    onClick={() => updateAnswers({ heatingType: h.type })}
                    className="tab-btn"
                    style={{
                      justifyContent: 'center',
                      backgroundColor: answers.heatingType === h.type ? 'hsl(var(--accent-mint))' : 'rgba(255, 255, 255, 0.03)',
                      color: answers.heatingType === h.type ? 'hsl(var(--bg-obsidian))' : 'hsl(var(--text-secondary))',
                      border: '1px solid',
                      borderColor: answers.heatingType === h.type ? 'hsl(var(--accent-mint))' : 'var(--border-glass)',
                      padding: '10px',
                      fontSize: '0.85rem',
                    }}
                  >
                    {h.title}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid hsl(var(--accent-mint))' }}>
              <p style={{ fontSize: '0.85rem' }}>
                💡 Estimated Energy Carbon: <strong style={{ color: 'hsl(var(--accent-mint))' }}>{calculatedFootprint.energy}</strong> metric tons CO₂e / year.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Consumption */}
        {step === 3 && (
          <div className="view-transition">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                <ShoppingBag size={24} style={{ color: 'hsl(var(--accent-mint))' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Consumption & Waste</h3>
                <p style={{ fontSize: '0.85rem' }}>Material consumption, retail shopping, packaging, and waste disposal impacts.</p>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.95rem' }}>
                Describe your general purchasing/shopping habits:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { key: 'minimalist' as const, label: 'Minimalist', desc: 'Rarely buy new items, repair/thrift' },
                  { key: 'average' as const, label: 'Average', desc: 'Normal shopping, buy updates occasionally' },
                  { key: 'shopper' as const, label: 'Frequent', desc: 'Love shopping, buy new tech/clothes monthly' },
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => updateAnswers({ shoppingHabits: item.key })}
                    className="tab-btn"
                    style={{
                      flexDirection: 'column',
                      height: '75px',
                      justifyContent: 'center',
                      backgroundColor: answers.shoppingHabits === item.key ? 'hsl(var(--accent-mint))' : 'rgba(255, 255, 255, 0.03)',
                      color: answers.shoppingHabits === item.key ? 'hsl(var(--bg-obsidian))' : 'hsl(var(--text-secondary))',
                      border: '1px solid',
                      borderColor: answers.shoppingHabits === item.key ? 'hsl(var(--accent-mint))' : 'var(--border-glass)',
                      padding: '8px',
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.label}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.8, textAlign: 'center', marginTop: '4px' }}>{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">How much trash do you actively recycle?</span>
                <span className="slider-value">{answers.recyclingRatio}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={answers.recyclingRatio}
                onChange={e => updateAnswers({ recyclingRatio: parseInt(e.target.value) })}
                className="slider-input"
              />
              <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '-4px' }}>
                Includes organic composting, plastic recycling, paper sorting, and bottle returns.
              </p>
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid hsl(var(--accent-mint))' }}>
              <p style={{ fontSize: '0.85rem' }}>
                💡 Estimated Shopping Carbon: <strong style={{ color: 'hsl(var(--accent-mint))' }}>{calculatedFootprint.consumption}</strong> metric tons CO₂e / year.
              </p>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
          <button
            type="button"
            onClick={handleBack}
            className="btn-secondary"
            disabled={step === 0}
            style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            className="btn-primary"
          >
            {step === steps.length - 1 ? (
              <>
                Save & View Dashboard <Check size={16} />
              </>
            ) : (
              <>
                Next Step <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
