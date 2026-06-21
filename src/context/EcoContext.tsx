import React, { createContext, useContext, useState, useEffect } from 'react';

// Vehicle type multiplier
export type VehicleType = 'gas' | 'hybrid' | 'ev' | 'none';

// Diet type
export type DietType = 'vegan' | 'vegetarian' | 'low-meat' | 'high-meat';

// Heating type
export type HeatingType = 'electric' | 'gas' | 'heatpump' | 'other';

export interface EcoAnswers {
  // Transport
  carMilesPerWeek: number;
  vehicleType: VehicleType;
  transitMilesPerWeek: number;
  flightsPerYear: number;

  // Diet
  dietType: DietType;

  // Energy
  electricBill: number; // monthly avg
  cleanEnergyRatio: number; // 0 to 100 percentage
  heatingType: HeatingType;

  // Consumption
  shoppingHabits: 'minimalist' | 'average' | 'shopper';
  recyclingRatio: number; // 0 to 100 percentage
}

export interface DailyActions {
  commutedGreen: boolean;
  atePlantBased: boolean;
  savedEnergy: boolean;
  reusedOrRecycled: boolean;
  avoidedPlastic: boolean;
}

export interface EcoChallenge {
  id: string;
  title: string;
  category: 'transport' | 'diet' | 'energy' | 'consumption';
  description: string;
  impact: 'low' | 'medium' | 'high';
  carbonSaving: number; // tons saved per year if adopted
  points: number;
}

export interface EcoContextProps {
  answers: EcoAnswers;
  updateAnswers: (updates: Partial<EcoAnswers>) => void;
  calculatedFootprint: {
    transport: number;
    diet: number;
    energy: number;
    consumption: number;
    total: number;
  };
  activeChallenges: string[];
  completedChallenges: string[];
  commitChallenge: (id: string) => void;
  uncommitChallenge: (id: string) => void;
  completeChallenge: (id: string) => void;
  dailyActions: DailyActions;
  toggleDailyAction: (actionKey: keyof DailyActions) => void;
  ecoPoints: number;
  streak: number;
  history: { date: string; score: number }[];
  addHistoryPoint: (score: number) => void;
  resetAllData: () => void;
  availableChallenges: EcoChallenge[];
  level: number;
  xpPercentage: number;
  levelTitle: string;
  redeemedCoupons: string[];
  redeemCoupon: (id: string, costPoints: number) => boolean;
}

const defaultAnswers: EcoAnswers = {
  carMilesPerWeek: 120,
  vehicleType: 'gas',
  transitMilesPerWeek: 20,
  flightsPerYear: 2,
  dietType: 'low-meat',
  electricBill: 100,
  cleanEnergyRatio: 10,
  heatingType: 'gas',
  shoppingHabits: 'average',
  recyclingRatio: 50,
};

const defaultDailyActions: DailyActions = {
  commutedGreen: false,
  atePlantBased: false,
  savedEnergy: false,
  reusedOrRecycled: false,
  avoidedPlastic: false,
};

const staticChallenges: EcoChallenge[] = [
  { id: 't1', title: 'Car-Free Commute', category: 'transport', description: 'Swap driving for cycling, walking, or public transit for a week.', impact: 'high', carbonSaving: 0.8, points: 150 },
  { id: 't2', title: 'Flight Free Summer', category: 'transport', description: 'Opt for train rides or local staycations instead of flying this holiday season.', impact: 'high', carbonSaving: 1.6, points: 300 },
  { id: 't3', title: 'Eco-Speed Limit', category: 'transport', description: 'Drive at optimal speeds (55-60 mph) on highways to improve fuel efficiency.', impact: 'low', carbonSaving: 0.15, points: 50 },
  { id: 'd1', title: 'Plant-Based Weekdays', category: 'diet', description: 'Avoid meat and dairy from Monday to Friday to significantly lower diet footprint.', impact: 'high', carbonSaving: 0.9, points: 200 },
  { id: 'd2', title: 'Local Produce Advocate', category: 'diet', description: 'Source at least 70% of your groceries from local farmers or organic markets.', impact: 'medium', carbonSaving: 0.3, points: 100 },
  { id: 'd3', title: 'Zero Food Waste', category: 'diet', description: 'Plan meals, compost scraps, and finish all leftovers to avoid food waste.', impact: 'medium', carbonSaving: 0.4, points: 120 },
  { id: 'e1', title: 'LED Overhaul', category: 'energy', description: 'Replace all remaining incandescent light bulbs in your house with LEDs.', impact: 'medium', carbonSaving: 0.25, points: 80 },
  { id: 'e2', title: 'Cold Water Wash', category: 'energy', description: 'Do laundry with cold water instead of hot. Save heater energy.', impact: 'low', carbonSaving: 0.12, points: 40 },
  { id: 'e3', title: 'Thermostat Dial-Down', category: 'energy', description: 'Lower your thermostat by 2°F in winter and raise it by 2°F in summer.', impact: 'medium', carbonSaving: 0.35, points: 100 },
  { id: 'c1', title: 'Second-Hand First', category: 'consumption', description: 'Commit to buying only thrifted or second-hand clothes for three months.', impact: 'medium', carbonSaving: 0.4, points: 150 },
  { id: 'c2', title: 'Digital Detox Shopping', category: 'consumption', description: 'Decline single-use packaging and carry a reusable tote wherever you go.', impact: 'low', carbonSaving: 0.08, points: 50 },
  { id: 'c3', title: 'Composting Champion', category: 'consumption', description: 'Set up an organic waste compost bin and reduce landfill trash by 40%.', impact: 'medium', carbonSaving: 0.3, points: 110 },
];

const EcoContext = createContext<EcoContextProps | undefined>(undefined);

export const EcoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or use defaults
  const [answers, setAnswers] = useState<EcoAnswers>(() => {
    const saved = localStorage.getItem('gp_answers');
    return saved ? JSON.parse(saved) : defaultAnswers;
  });

  const [activeChallenges, setActiveChallenges] = useState<string[]>(() => {
    const saved = localStorage.getItem('gp_active_challenges');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedChallenges, setCompletedChallenges] = useState<string[]>(() => {
    const saved = localStorage.getItem('gp_completed_challenges');
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyActions, setDailyActions] = useState<DailyActions>(() => {
    const saved = localStorage.getItem('gp_daily_actions');
    const savedDate = localStorage.getItem('gp_daily_actions_date');
    const today = new Date().toDateString();

    if (savedDate === today && saved) {
      return JSON.parse(saved);
    }
    return defaultDailyActions; // reset daily action checklist on a new day
  });

  const [ecoPoints, setEcoPoints] = useState<number>(() => {
    const saved = localStorage.getItem('gp_eco_points');
    return saved ? parseInt(saved) : 0;
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('gp_streak');
    return saved ? parseInt(saved) : 0;
  });

  const [redeemedCoupons, setRedeemedCoupons] = useState<string[]>(() => {
    const saved = localStorage.getItem('gp_redeemed_coupons');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<{ date: string; score: number }[]>(() => {
    const saved = localStorage.getItem('gp_history');
    if (saved) return JSON.parse(saved);
    // Seed default history
    const today = new Date();
    const seeded = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i * 10);
      seeded.push({
        date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: parseFloat((12.5 - i * 0.4 + Math.random() * 0.6).toFixed(1)),
      });
    }
    return seeded;
  });

  // Calculate carbon footprint based on coefficients
  const [calculatedFootprint, setCalculatedFootprint] = useState<{
    transport: number;
    diet: number;
    energy: number;
    consumption: number;
    total: number;
  }>({ transport: 0, diet: 0, energy: 0, consumption: 0, total: 0 });

  useEffect(() => {
    // 1. Transportation Carbon (Metric tons CO2e / year)
    let transportFootprint = 0;
    
    // Car driving
    if (answers.vehicleType !== 'none') {
      const annualCarMiles = answers.carMilesPerWeek * 52;
      let multiplier = 1.0;
      if (answers.vehicleType === 'hybrid') multiplier = 0.5;
      if (answers.vehicleType === 'ev') multiplier = 0.15;
      // 0.404 kg CO2 per mile for gas cars (EPA metric) = 0.000404 metric tons
      transportFootprint += annualCarMiles * 0.000404 * multiplier;
    }

    // Public Transit
    const annualTransitMiles = answers.transitMilesPerWeek * 52;
    // 0.14 kg CO2 per transit passenger mile = 0.00014 metric tons
    transportFootprint += annualTransitMiles * 0.00014;

    // Flights (0.8 metric tons CO2e per average flight/round-trip)
    transportFootprint += answers.flightsPerYear * 0.8;

    // 2. Diet Carbon (Metric tons CO2e / year)
    let dietFootprint = 2.5; // default low-meat
    if (answers.dietType === 'vegan') dietFootprint = 1.2;
    if (answers.dietType === 'vegetarian') dietFootprint = 1.7;
    if (answers.dietType === 'low-meat') dietFootprint = 2.3;
    if (answers.dietType === 'high-meat') dietFootprint = 3.3;

    // 3. Home Energy Carbon (Metric tons CO2e / year)
    let energyFootprint = 0;
    
    // Electric Footprint: roughly $0.15/kWh, 1 kWh = 0.38 kg CO2 = 0.00038 tons
    // $100 bill = 666 kWh/month * 12 = 8000 kWh/year * 0.00038 = ~3.04 tons
    const annualElectricKWh = (answers.electricBill / 0.15) * 12;
    let electricCarbon = annualElectricKWh * 0.00038;
    // Reduce based on clean energy ratio
    electricCarbon = electricCarbon * (1 - answers.cleanEnergyRatio / 100);
    energyFootprint += electricCarbon;

    // Heating footprint
    if (answers.heatingType === 'gas') energyFootprint += 1.8;
    else if (answers.heatingType === 'electric') energyFootprint += 1.2;
    else if (answers.heatingType === 'heatpump') energyFootprint += 0.4;
    else energyFootprint += 2.2; // wood/coal/other

    // 4. Consumption & Waste Carbon
    let consumptionFootprint = 1.5; // average retail shopper
    if (answers.shoppingHabits === 'minimalist') consumptionFootprint = 0.6;
    if (answers.shoppingHabits === 'shopper') consumptionFootprint = 2.8;

    // Waste reduction by recycling
    // Maximum 0.4 tons saved by perfect recycling
    const recyclingSaving = (answers.recyclingRatio / 100) * 0.4;
    consumptionFootprint = Math.max(0.1, consumptionFootprint - recyclingSaving);

    // Apply completed challenges as credits to the carbon footprint calculations!
    // This connects their actions dynamically to their carbon score!
    completedChallenges.forEach(cid => {
      const challenge = staticChallenges.find(c => c.id === cid);
      if (challenge) {
        if (challenge.category === 'transport') {
          transportFootprint = Math.max(0.1, transportFootprint - challenge.carbonSaving);
        } else if (challenge.category === 'diet') {
          dietFootprint = Math.max(0.4, dietFootprint - challenge.carbonSaving);
        } else if (challenge.category === 'energy') {
          energyFootprint = Math.max(0.1, energyFootprint - challenge.carbonSaving);
        } else if (challenge.category === 'consumption') {
          consumptionFootprint = Math.max(0.1, consumptionFootprint - challenge.carbonSaving);
        }
      }
    });

    // Round scores to 1 decimal place
    const transportVal = parseFloat(transportFootprint.toFixed(1));
    const dietVal = parseFloat(dietFootprint.toFixed(1));
    const energyVal = parseFloat(energyFootprint.toFixed(1));
    const consumptionVal = parseFloat(consumptionFootprint.toFixed(1));
    const totalVal = parseFloat((transportVal + dietVal + energyVal + consumptionVal).toFixed(1));

    setCalculatedFootprint({
      transport: transportVal,
      diet: dietVal,
      energy: energyVal,
      consumption: consumptionVal,
      total: totalVal,
    });
  }, [answers, completedChallenges]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('gp_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('gp_active_challenges', JSON.stringify(activeChallenges));
  }, [activeChallenges]);

  useEffect(() => {
    localStorage.setItem('gp_completed_challenges', JSON.stringify(completedChallenges));
  }, [completedChallenges]);

  useEffect(() => {
    localStorage.setItem('gp_daily_actions', JSON.stringify(dailyActions));
    localStorage.setItem('gp_daily_actions_date', new Date().toDateString());
  }, [dailyActions]);

  useEffect(() => {
    localStorage.setItem('gp_eco_points', ecoPoints.toString());
  }, [ecoPoints]);

  useEffect(() => {
    localStorage.setItem('gp_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('gp_redeemed_coupons', JSON.stringify(redeemedCoupons));
  }, [redeemedCoupons]);

  useEffect(() => {
    localStorage.setItem('gp_history', JSON.stringify(history));
  }, [history]);

  // User Actions
  const updateAnswers = (updates: Partial<EcoAnswers>) => {
    setAnswers(prev => ({ ...prev, ...updates }));
  };

  const commitChallenge = (id: string) => {
    if (!activeChallenges.includes(id) && !completedChallenges.includes(id)) {
      setActiveChallenges(prev => [...prev, id]);
    }
  };

  const uncommitChallenge = (id: string) => {
    setActiveChallenges(prev => prev.filter(c => c !== id));
  };

  const completeChallenge = (id: string) => {
    const challenge = staticChallenges.find(c => c.id === id);
    if (challenge && activeChallenges.includes(id)) {
      // Remove from active
      setActiveChallenges(prev => prev.filter(c => c !== id));
      // Add to completed
      setCompletedChallenges(prev => [...prev, id]);
      // Reward points
    }
  };

  const redeemCoupon = (id: string, costPoints: number): boolean => {
    if (ecoPoints >= costPoints && !redeemedCoupons.includes(id)) {
      setEcoPoints(prev => prev - costPoints);
      setRedeemedCoupons(prev => [...prev, id]);
      return true;
    }
    return false;
  };

  const toggleDailyAction = (actionKey: keyof DailyActions) => {
    const isActivating = !dailyActions[actionKey];
    setDailyActions(prev => ({ ...prev, [actionKey]: isActivating }));

    // Points for daily activity
    if (isActivating) {
      setEcoPoints(prev => prev + 15);
      
      // Calculate streak logic:
      // If today they log their first green action, check if they had a streak going
      const loggedAnyToday = Object.values(dailyActions).some(val => val === true);
      if (!loggedAnyToday) {
        // Check if they logged yesterday
        const lastActivityDate = localStorage.getItem('gp_last_activity_date');
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        const todayStr = new Date().toDateString();
        
        if (lastActivityDate === yesterdayStr) {
          setStreak(prev => prev + 1);
        } else if (lastActivityDate !== todayStr) {
          setStreak(1); // Reset or start new streak
        }
        localStorage.setItem('gp_last_activity_date', todayStr);
      }
    } else {
      setEcoPoints(prev => Math.max(0, prev - 15));
    }
  };

  const addHistoryPoint = (score: number) => {
    const todayStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    setHistory(prev => {
      // Avoid duplicate logs on the same day for rendering charts
      const filtered = prev.filter(h => h.date !== todayStr);
      const newHistory = [...filtered, { date: todayStr, score }];
      if (newHistory.length > 7) {
        newHistory.shift(); // keep last 7 data points
      }
      return newHistory;
    });
  };

  const resetAllData = () => {
    localStorage.removeItem('gp_answers');
    localStorage.removeItem('gp_active_challenges');
    localStorage.removeItem('gp_completed_challenges');
    localStorage.removeItem('gp_daily_actions');
    localStorage.removeItem('gp_daily_actions_date');
    localStorage.removeItem('gp_eco_points');
    localStorage.removeItem('gp_streak');
    localStorage.removeItem('gp_history');
    localStorage.removeItem('gp_last_activity_date');
    localStorage.removeItem('gp_redeemed_coupons');
    
    setAnswers(defaultAnswers);
    setActiveChallenges([]);
    setCompletedChallenges([]);
    setDailyActions(defaultDailyActions);
    setEcoPoints(0);
    setStreak(0);
    setRedeemedCoupons([]);
    
    // Seed default history again
    const today = new Date();
    const seeded = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i * 10);
      seeded.push({
        date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: parseFloat((12.5 - i * 0.4 + Math.random() * 0.6).toFixed(1)),
      });
    }
    setHistory(seeded);
  };

  const level = Math.floor(ecoPoints / 350) + 1;
  const xpPercentage = Math.min(100, Math.round(((ecoPoints % 350) / 350) * 100));
  
  const getLevelTitle = (lvl: number): string => {
    if (lvl === 1) return 'Carbon Onboarder';
    if (lvl === 2) return 'Eco Explorer';
    if (lvl === 3) return 'Leaf Guardian';
    if (lvl === 4) return 'Planet Protector';
    if (lvl === 5) return 'Sustainer Champion';
    return 'Carbon Neutral Hero';
  };
  const levelTitle = getLevelTitle(level);

  return (
    <EcoContext.Provider
      value={{
        answers,
        updateAnswers,
        calculatedFootprint,
        activeChallenges,
        completedChallenges,
        commitChallenge,
        uncommitChallenge,
        completeChallenge,
        dailyActions,
        toggleDailyAction,
        ecoPoints,
        streak,
        history,
        addHistoryPoint,
        resetAllData,
        availableChallenges: staticChallenges,
        level,
        xpPercentage,
        levelTitle,
        redeemedCoupons,
        redeemCoupon,
      }}
    >
      {children}
    </EcoContext.Provider>
  );
};

export const useEco = () => {
  const context = useContext(EcoContext);
  if (context === undefined) {
    throw new Error('useEco must be used within an EcoProvider');
  }
  return context;
};
