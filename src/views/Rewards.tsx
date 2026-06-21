import React, { useState } from 'react';
import { useEco } from '../context/EcoContext';
import { Check, Copy, Ticket, ShieldAlert, Sparkles } from 'lucide-react';

interface RewardCoupon {
  id: string;
  brand: string;
  badge: string;
  pointsCost: number;
  description: string;
  sustainabilityNote: string;
  code: string;
  logoColor: string;
}

export const Rewards: React.FC = () => {
  const { ecoPoints, redeemedCoupons, redeemCoupon } = useEco();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const availableRewards: RewardCoupon[] = [
    {
      id: 'r1',
      brand: 'Patagonia',
      badge: '15% OFF GEAR',
      pointsCost: 200,
      description: 'Unlock 15% off outdoor gear and apparel at Patagonia online store.',
      sustainabilityNote: 'Patagonia pledges 1% of sales to preservation and uses 100% organic cotton.',
      code: 'GREENPULSE-PATA15',
      logoColor: '#e07a5f',
    },
    {
      id: 'r2',
      brand: 'Allbirds',
      badge: '$20 GIFT CARD',
      pointsCost: 350,
      description: '$20 gift voucher applicable on Allbirds sneakers and apparel.',
      sustainabilityNote: 'Allbirds crafted shoes using carbon-negative SweetFoam sugarcane sole and FSC-certified wood.',
      code: 'ECOPULSE-ALLBIRDS20',
      logoColor: '#3d5a80',
    },
    {
      id: 'r3',
      brand: 'Hydro Flask',
      badge: 'FREE SLEEVE & SHIPPING',
      pointsCost: 150,
      description: 'Get free shipping and a free silicone bottle boot sleeve accessory.',
      sustainabilityNote: 'Hydro Flask offsets manufacturing carbon and runs Refill For Good to eliminate single-use plastic.',
      code: 'HYDRO-GREENPULSE',
      logoColor: '#f3a712',
    },
    {
      id: 'r4',
      brand: 'Lush Cosmetics',
      badge: '10% OFF VOUCHER',
      pointsCost: 100,
      description: 'Save 10% on fresh, handmade organic bath sets and solid shampoos.',
      sustainabilityNote: 'Lush is 100% vegetarian, fights animal testing, and uses package-free naked designs.',
      code: 'LUSH-PULSE10',
      logoColor: '#5c677d',
    },
    {
      id: 'r5',
      brand: 'Tentree',
      badge: '20% OFF APPAREL',
      pointsCost: 300,
      description: 'Get 20% off items. Tentree plants 10 native trees for every item purchased.',
      sustainabilityNote: 'Certified B-Corp planting trees globally. Saved over 100 million trees to date.',
      code: 'TENTREE-PULSE20',
      logoColor: '#2a9d8f',
    },
  ];

  const handleRedeem = (id: string, cost: number) => {
    setErrorMessage(null);
    const success = redeemCoupon(id, cost);
    if (!success) {
      setErrorMessage(`Insufficient points! You need ${cost - ecoPoints} more Eco Points to unlock this reward.`);
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="view-transition" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '50px' }}>
      
      {/* Header */}
      <div className="flex-row-center">
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Eco-Rewards Store</h2>
          <p style={{ fontSize: '0.9rem' }}>Redeem your points for exclusive discounts and vouchers from sustainable partners.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(251, 176, 27, 0.08)', border: '1px solid rgba(251, 176, 27, 0.2)', padding: '6px 16px', borderRadius: '12px', color: 'hsl(var(--accent-gold))' }}>
          <Sparkles size={16} />
          <span style={{ fontWeight: 700 }}>{ecoPoints} Points Available</span>
        </div>
      </div>

      {/* Error Message Toast */}
      {errorMessage && (
        <div
          className="view-transition"
          style={{
            background: 'rgba(255, 62, 108, 0.1)',
            border: '1px solid rgba(255, 62, 108, 0.3)',
            color: 'hsl(var(--accent-coral))',
            padding: '12px 18px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
          }}
        >
          <ShieldAlert size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Rewards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {availableRewards.map(reward => {
          const isRedeemed = redeemedCoupons.includes(reward.id);
          const canAfford = ecoPoints >= reward.pointsCost;

          return (
            <div
              key={reward.id}
              className="glass-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: isRedeemed ? 'rgba(251, 176, 27, 0.25)' : 'var(--border-glass)',
                background: isRedeemed ? 'rgba(251, 176, 27, 0.02)' : 'rgba(15, 20, 18, 0.45)',
                minHeight: '260px',
              }}
            >
              <div>
                {/* Brand Header */}
                <div className="flex-row-center" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: reward.logoColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: 'white',
                        fontSize: '1rem',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {reward.brand.charAt(0)}
                    </div>
                    <h3 style={{ fontSize: '1.15rem' }}>{reward.brand}</h3>
                  </div>
                  
                  {isRedeemed ? (
                    <span className="badge badge-gold">UNLOCKED</span>
                  ) : (
                    <span className="badge badge-mint">{reward.pointsCost} pts</span>
                  )}
                </div>

                {/* Badge title */}
                <h4 style={{ color: 'white', fontSize: '0.95rem', marginBottom: '8px', letterSpacing: '0.02em' }}>
                  {reward.badge}
                </h4>
                
                <p style={{ fontSize: '0.8rem', marginBottom: '16px' }}>{reward.description}</p>
                
                {/* Sustainability Note */}
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'hsl(var(--text-muted))',
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    borderLeft: `2.5px solid ${reward.logoColor}`,
                    marginBottom: '20px',
                    textAlign: 'left',
                  }}
                >
                  🌿 <strong>Green Choice:</strong> {reward.sustainabilityNote}
                </div>
              </div>

              {/* Action Area */}
              <div>
                {isRedeemed ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(251, 176, 27, 0.08)',
                      border: '1px dashed rgba(251, 176, 27, 0.3)',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      justifyContent: 'space-between',
                    }}
                  >
                    <code style={{ fontSize: '0.9rem', color: 'white', fontFamily: 'monospace', fontWeight: 700 }}>
                      {reward.code}
                    </code>
                    
                    <button
                      onClick={() => handleCopy(reward.id, reward.code)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: copiedId === reward.id ? 'hsl(var(--accent-mint))' : 'hsl(var(--accent-gold))',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      {copiedId === reward.id ? (
                        <>Copied! <Check size={14} /></>
                      ) : (
                        <>Copy <Copy size={14} /></>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRedeem(reward.id, reward.pointsCost)}
                    className="btn-primary"
                    disabled={!canAfford}
                    style={{
                      width: '100%',
                      background: !canAfford
                        ? 'rgba(255, 255, 255, 0.04)'
                        : 'linear-gradient(135deg, hsl(var(--accent-mint)) 0%, hsl(var(--accent-cyan)) 100%)',
                      border: !canAfford ? '1px solid var(--border-glass)' : 'none',
                      color: !canAfford ? 'hsl(var(--text-muted))' : 'black',
                      boxShadow: !canAfford ? 'none' : '0 4px 15px rgba(27, 242, 147, 0.2)',
                    }}
                  >
                    {canAfford ? (
                      <>Redeem Coupon <Ticket size={16} /></>
                    ) : (
                      <>Needs {reward.pointsCost - ecoPoints} more pts</>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
