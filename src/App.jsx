import React, { useState, useEffect } from 'react';

const App = () => {
  const [coins, setCoins] = useState([
    { id: 'btc', name: 'BTC', symbol: 'btcusdt', vol: '$0.0M', price: 68411.76, var24h: 0, rsi: 42.5, suporte: 68200, resistencia: 74050 },
    { id: 'eth', name: 'ETH', symbol: 'ethusdt', vol: '$0.0M', price: 2050.00, var24h: 0, rsi: 38.2, suporte: 2000, resistencia: 2120 },
    { id: 'sol', name: 'SOL', symbol: 'solusdt', vol: '$0.0M', price: 87.05, var24h: 0, rsi: 38.86, suporte: 80.00, resistencia: 94.00 },
    { id: 'bnb', name: 'BNB', symbol: 'bnbusdt', vol: '$0.0M', price: 602.40, var24h: 0, rsi: 45.1, suporte: 585, resistencia: 620 },
    { id: 'xrp', name: 'XRP', symbol: 'xrpusdt', vol: '$0.0M', price: 1.388, var24h: 0, rsi: 39.33, suporte: 1.35, resistencia: 1.48 },
    { id: 'hbar', name: 'HBAR', symbol: 'hbarusdt', vol: '$0.0M', price: 0.0894, var24h: 0, rsi: 40.21, suporte: 0.090, resistencia: 0.110 },
    { id: 'bat', name: 'BAT', symbol: 'batusdt', vol: '$0.0M', price: 0.0950, var24h: 0, rsi: 31.0, suporte: 0.088, resistencia: 0.105 },
    { id: 'ron', name: 'RON', symbol: 'roninusdt', vol: '$0.0M', price: 2.95, var24h: 0, rsi: 44.2, suporte: 2.80, resistencia: 3.15 },
  ]);

  useEffect(() => {
    const streams = coins.map(c => `${c.symbol}@ticker`).join('/');
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCoins(prev => prev.map(c => {
        if (c.symbol === data.s.toLowerCase()) {
          return { 
            ...c, 
            price: parseFloat(data.c), 
            var24h: parseFloat(data.P),
            vol: `$${(parseFloat(data.q) / 1000000).toFixed(1)}M`
          };
        }
        return c;
      }));
    };
    return () => ws.close();
  }, []);

  const handleEdit = (id) => {
    const coinToEdit = coins.find(c => c.id === id);
    const novoSuporte = prompt(`Novo Suporte para ${coinToEdit.name}:`, coinToEdit.suporte);
    const novaResistencia = prompt(`Nova Resistência para ${coinToEdit.name}:`, coinToEdit.resistencia);

    if (novoSuporte !== null && novaResistencia !== null) {
      setCoins(prev => prev.map(c => 
        c.id === id 
          ? { ...c, suporte: parseFloat(novoSuporte), resistencia: parseFloat(novaResistencia) } 
          : c
      ));
    }
  };

  const getAlertStyle = (coin) => {
    if (coin.price <= coin.suporte) {
      return { backgroundColor: 'rgba(255, 77, 77, 0.1)', boxShadow: 'inset 0 0 20px rgba(255, 77, 77, 0.2)' };
    }
    if (coin.price >= coin.resistencia) {
      return { backgroundColor: 'rgba(240, 136, 62, 0.1)', boxShadow: 'inset 0 0 20px rgba(240, 136, 62, 0.2)' };
    }
    return {};
  };

  return (
    <div style={{ backgroundColor: '#02040a', color: '#e6edf3', minHeight: '100vh', padding: '40px', fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px' }}>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        @keyframes neonFlicker {
          0%, 18%, 22%, 25%, 53%, 57%, 100% { text-shadow: 0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #00f2ff, 0 0 80px #00f2ff; }
          20%, 24%, 55% { text-shadow: none; }
        }
      `}</style>

      {/* Header com Título Neon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '32px', 
            fontWeight: '900',
            fontStyle: 'italic', 
            color: '#fff', 
            textTransform: 'uppercase',
            animation: 'neonFlicker 3s infinite alternate',
            borderLeft: '5px solid #00f2ff',
            paddingLeft: '15px'
          }}>
            WIKI COMMAND <span style={{ fontSize: '14px', verticalAlign: 'middle', color: '#00f2ff', opacity: 0.8 }}>SYSTEM_v3.1_PRO</span>
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: '#58a6ff', marginBottom: '5px', fontWeight: 'bold' }}>NETWORK STATUS</div>
          <div style={{ fontSize: '12px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%', boxShadow: '0 0 10px #4ade80' }}></span> 
            CONNECTED_CORE
          </div>
        </div>
      </div>

      {/* Quadro com Bordas Neon */}
      <div style={{ 
        width: '100%', 
        overflowX: 'auto',
        border: '1px solid #00f2ff',
        borderRadius: '8px',
        boxShadow: '0 0 15px rgba(0, 242, 255, 0.3), inset 0 0 10px rgba(0, 242, 255, 0.1)',
        backgroundColor: 'rgba(13, 17, 23, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#8b949e', fontSize: '11px', textTransform: 'uppercase', borderBottom: '2px solid #00f2ff' }}>
              <th style={{ textAlign: 'left', padding: '20px' }}>Asset / Volume</th>
              <th style={{ textAlign: 'right', padding: '20px' }}>Price (USD)</th>
              <th style={{ textAlign: 'right', padding: '20px' }}>24h Delta</th>
              <th style={{ textAlign: 'center', padding: '20px' }}>RSI Index</th>
              <th style={{ textAlign: 'right', padding: '20px', color: '#58a6ff' }}>Support</th>
              <th style={{ textAlign: 'right', padding: '20px', color: '#f0883e' }}>Resistance</th>
              <th style={{ textAlign: 'center', padding: '20px' }}>Control</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => {
              const alertStyle = getAlertStyle(coin);
              const hasAlert = Object.keys(alertStyle).length > 0;

              return (
                <tr 
                  key={coin.id} 
                  style={{ 
                    borderBottom: '1px solid #21262d', 
                    transition: 'all 0.3s ease',
                    ...alertStyle,
                    animation: hasAlert ? 'pulse 2s infinite' : 'none'
                  }} 
                  onMouseOver={(e) => !hasAlert && (e.currentTarget.style.backgroundColor = 'rgba(88, 166, 255, 0.05)')}
                  onMouseOut={(e) => !hasAlert && (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '20px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{coin.name}</div>
                    <div style={{ fontSize: '10px', color: '#58a6ff', marginTop: '5px', letterSpacing: '2px' }}>
                       {coin.vol}
                    </div>
                  </td>

                  <td style={{ textAlign: 'right', padding: '20px', fontSize: '20px', fontWeight: 'bold', color: '#00f2ff', textShadow: '0 0 5px rgba(0,242,255,0.3)' }}>
                    ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </td>

                  <td style={{ textAlign: 'right', padding: '20px', color: coin.var24h < 0 ? '#ff4d4d' : '#4ade80', fontWeight: 'bold' }}>
                    {coin.var24h > 0 ? '+' : ''}{coin.var24h.toFixed(2)}%
                  </td>

                  <td style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ border: '1px solid #30363d', color: '#8b949e', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', display: 'inline-block', backgroundColor: '#02040a' }}>
                      {coin.rsi}
                    </div>
                  </td>

                  <td style={{ textAlign: 'right', padding: '20px', color: '#58a6ff', fontWeight: 'bold', fontSize: '16px' }}>
                    {coin.suporte}
                  </td>

                  <td style={{ textAlign: 'right', padding: '20px', color: '#f0883e', fontWeight: 'bold', fontSize: '16px' }}>
                    {coin.resistencia}
                  </td>

                  <td style={{ textAlign: 'center', padding: '20px' }}>
                    <button 
                      onClick={() => handleEdit(coin.id)}
                      style={{ 
                        backgroundColor: 'transparent', 
                        border: '1px solid #00f2ff', 
                        color: '#00f2ff', 
                        padding: '8px 18px', 
                        borderRadius: '4px', 
                        cursor: 'pointer', 
                        fontSize: '10px', 
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        boxShadow: '0 0 5px rgba(0, 242, 255, 0.2)',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#00f2ff';
                        e.currentTarget.style.color = '#02040a';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#00f2ff';
                      }}
                    >
                      Override
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#484f58', textTransform: 'uppercase', letterSpacing: '3px' }}>
        <div>// DATA_STREAM_ENCRYPTED</div>
        <div>TERMINAL_REF: {new Date().getFullYear()} // WIKI_COMMAND</div>
      </div>
    </div>
  );
};

export default App;