import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, HelpCircle } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const AIAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hello! I am PulseAI, your carbon reduction specialist. Ask me anything about reducing energy bills, travel emissions, diet impacts, or setting up a composting bin!',
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presetQuestions = [
    'How do I lower home electric bills?',
    'Carbon footprint of dairy vs almond milk?',
    'Is public transit better than electric cars?',
    'Why does composting reduce methane?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getAIResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    if (q.includes('electric') || q.includes('bill') || q.includes('energy') || q.includes('power')) {
      return `🏠 **Reducing Household Energy Emissions:**\n\n1. **Upgrade to LEDs**: Lighting makes up 15% of household energy. Replacing incandescent bulbs with LEDs saves ~220kg of CO₂/yr.\n2. **Thermostat Management**: Adjusting heating down by just 2°F in winter can save 350kg of CO₂ annually.\n3. **Power Strips**: Unplugging electronics when not in use stops "vampire loads" (which account for 5% of household electric bills).\n4. **Cold Water Laundry**: Washing clothes in cold water saves up to 90% of washing machine energy.`;
    }
    
    if (q.includes('milk') || q.includes('dairy') || q.includes('diet') || q.includes('food') || q.includes('meat')) {
      return `🥛 **Dietary Footprint Comparison:**\n\n- **Dairy Milk**: Produces ~3.2kg of CO₂ per liter due to cattle methane emissions.\n- **Almond Milk**: Produces ~0.7kg of CO₂ per liter, but requires significant water usage.\n- **Oat Milk (Recommended)**: Produces ~0.9kg of CO₂ per liter and uses minimal land and water.\n\n💡 *Action Tip: Swapping one steak meal per week for a plant-based alternative avoids over 300kg of CO₂ annually!*`;
    }
    
    if (q.includes('transit') || q.includes('car') || q.includes('ev') || q.includes('vehicle') || q.includes('travel')) {
      return `🚗 **Transportation Emissions Breakdown:**\n\n- **Gasoline Car**: Outputs ~404 grams of CO₂ per mile driven. Averaging 10k miles/year = **4.0 metric tons**.\n- **Electric Vehicle (EV)**: Emissions depend on your grid. On the average US grid, an EV outputs ~100-150g CO₂/mile, dropping to **0g** if charged using solar panels.\n- **Public Bus/Train**: Bus outputs ~140g per passenger-mile. Trains output ~80g, making rail travel the most carbon-friendly option.\n\n💡 *Action Tip: Swapping a car commute for a train or bicycle 2 days a week cuts transport emissions by 40%.*`;
    }
    
    if (q.includes('compost') || q.includes('trash') || q.includes('waste') || q.includes('recycl')) {
      return `🌱 **Why Composting is Crucial:**\n\nWhen food scraps go to landfills, they are packed under layers of trash. This creates an anaerobic (oxygen-free) environment, causing organic material to decompose into **Methane (CH₄)**—a greenhouse gas 28x more potent than CO₂.\n\n- **Composting** exposes waste to oxygen, allowing aerobic decomposition which creates harmless CO₂ and mineral-rich humus soil.\n- Composting saves up to **300kg of CO₂e** per household annually by keeping organic waste out of landfill.`;
    }

    return `🌍 **Carbon Footprint Insights:**\n\nIndividual action matters! By adopting 3 simple changes (LED bulbs, eating plant-based 2 days/week, and carpooling/taking transit), you can reduce your annual carbon footprint by up to **2.5 metric tons** (approx. 20% of the average footprint).\n\nFeel free to ask me more specific questions about *transportation, household heating, dairy/meat alternatives, or solar energy!*`;
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking and typing delay
    setTimeout(() => {
      const botResponse: Message = {
        sender: 'bot',
        text: getAIResponse(text),
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="view-transition" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
          <Bot size={24} style={{ color: 'hsl(var(--accent-mint))' }} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.8rem', textAlign: 'left' }}>PulseAI Eco-Advisor</h2>
          <p style={{ fontSize: '0.9rem', textAlign: 'left' }}>Get personalized tips and answers to your sustainability queries.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        
        {/* Chat Interface Container */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '480px',
            padding: '20px',
            justifyContent: 'space-between',
          }}
        >
          {/* Message List */}
          <div
            style={{
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              paddingRight: '6px',
              marginBottom: '20px',
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                {msg.sender === 'bot' && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={16} style={{ color: 'hsl(var(--accent-mint))' }} />
                  </div>
                )}
                
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    borderTopRightRadius: msg.sender === 'user' ? '4px' : '16px',
                    borderTopLeftRadius: msg.sender === 'bot' ? '4px' : '16px',
                    background: msg.sender === 'user' ? 'hsl(var(--accent-mint))' : 'rgba(255, 255, 255, 0.04)',
                    color: msg.sender === 'user' ? 'black' : 'white',
                    border: '1px solid',
                    borderColor: msg.sender === 'user' ? 'hsl(var(--accent-mint))' : 'var(--border-glass)',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {/* Dynamic simple markdown formatting for bold and lists */}
                  {msg.text.split('\n').map((line, lidx) => {
                    return (
                      <p key={lidx} style={{ color: 'inherit', margin: '4px 0', fontSize: 'inherit' }}>
                        {line.startsWith('-') || line.match(/^\d\./) ? (
                          <span style={{ paddingLeft: '8px', display: 'block', color: 'inherit' }}>{line}</span>
                        ) : (
                          // simple parse for bold text
                          line.split('**').map((chunk, cidx) => {
                            if (cidx % 2 === 1) return <strong key={cidx} style={{ color: 'inherit', fontWeight: 700 }}>{chunk}</strong>;
                            return chunk;
                          })
                        )}
                      </p>
                    );
                  })}
                  
                  <span style={{ display: 'block', fontSize: '0.65rem', textAlign: 'right', marginTop: '6px', opacity: 0.6, color: 'inherit' }}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <User size={16} style={{ color: 'white' }} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={16} style={{ color: 'hsl(var(--accent-mint))' }} />
                </div>
                <div style={{ padding: '10px 16px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-glass)', display: 'flex', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'hsl(var(--text-muted))', animation: 'float 1s infinite' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'hsl(var(--text-muted))', animation: 'float 1s infinite 0.2s' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'hsl(var(--text-muted))', animation: 'float 1s infinite 0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Area */}
          <form
            onSubmit={e => { e.preventDefault(); handleSendMessage(inputValue); }}
            style={{ display: 'flex', gap: '10px' }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Ask a question about carbon reduction..."
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-glass)',
                color: 'white',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '12px 16px', borderRadius: '12px' }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* Suggestion Prompts */}
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'hsl(var(--text-muted))', marginBottom: '10px' }}>
            <HelpCircle size={14} /> Tap to ask:
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="btn-secondary"
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Sparkles size={12} className="text-mint" style={{ color: 'hsl(var(--accent-mint))' }} /> {q}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
