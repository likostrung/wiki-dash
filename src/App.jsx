import React, { useState, useEffect } from 'react';

const App = () => {
  const [coins, setCoins] = useState([
    { id: 'btc', name: 'BTC', symbol: 'btcusdt', vol: '$1114.7M', price: 68411.76, var24h: -2.84, rsi: 36.48, suporte: 68300, resistencia: 69200 },
    { id: 'sol', name: 'SOL', symbol: 'solusdt', vol: '$181.8M', price: 87.05, var24h: -3.16, rsi: 38.86, suporte: 86.93, resistencia: 89.01 },
    { id: 'xrp', name: 'XRP', symbol: 'xrpusdt', vol: '$114.2M', price: 1.388, var24h: -3.56, rsi: 39.33, suporte: 1.38, resistencia: 1.4 },
    { id: 'hbar', name: 'HBAR', symbol: 'hbarusdt', vol: '$7.8M', price: 0.0894, var24h: -4.00, rsi: 40.21, suporte: 0.088, resistencia: 0.094 },
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

  return (
    <div style={{ backgroundColor: '#02040a', color: '#e6edf3', minHeight: '100vh', padding: '30px', fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px' }}>
      
      {/* Header Estilizado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontStyle: 'italic', color: '#00f2ff', textShadow: '0 0 10px rgba(0,242,255,0.5)' }}>
            WIKI COMMAND <span style={{ fontSize: '12px', color: '#00f2ff', opacity: 0.7 }}>v3.1 PRO</span>
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: '#8b949e', marginBottom: '5px' }}>TRADING TERMINAL</div>
          <div style={{ fontSize: '12px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#4ade80', borderRadius: '50%' }}></span> LIVE_FEED_8001
          </div>
        </div>
      </div>

      {/* Tabela de Trading */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#484f58', fontSize: '11px', textTransform: 'uppercase', borderBottom: '1px solid #21262d' }}>
              <th style={{ textAlign: 'left', padding: '15px' }}>Ativo / Volume</th>
              <th style={{ textAlign: 'right', padding: '15px' }}>Preço</th>
              <th style={{ textAlign: 'right', padding: '15px' }}>Var 24h</th>
              <th style={{ textAlign: 'center', padding: '15px' }}>RSI (15M)</th>
              <th style={{ textAlign: 'right', padding: '15px', color: '#58a6ff' }}>Suporte (S)</th>
              <th style={{ textAlign: 'right', padding: '15px', color: '#f0883e' }}>Resistência (R)</th>
              <th style={{ textAlign: 'center', padding: '15px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr key={coin.id} style={{ borderBottom: '1px solid #21262d', transition: 'background 0.2s' }} 
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0d1117'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                
                <td style={{ padding: '20px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{coin.name}</div>
                  <div style={{ fontSize: '10px', color: '#58a6ff', marginTop: '5px', backgroundColor: '#0d1117', display: 'inline-block', padding: '2px 6px', borderRadius: '3px' }}>
                    VOL {coin.vol}
                  </div>
                </td>

                <td style={{ textAlign: 'right', padding: '20px', fontSize: '22px', fontWeight: 'bold', color: '#00f2ff' }}>
                  ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </td>

                <td style={{ textAlign: 'right', padding: '20px', color: coin.var24h < 0 ? '#ff4d4d' : '#00f2ff', fontWeight: 'bold' }}>
                  {coin.var24h.toFixed(2)}%
                </td>

                <td style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ border: '1px solid #30363d', color: '#8b949e', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', display: 'inline-block' }}>
                    {coin.rsi}
                  </div>
                </td>

                <td style={{ textAlign: 'right', padding: '20px', color: '#58a6ff', fontWeight: 'bold', fontSize: '18px' }}>
                  {coin.suporte}
                </td>

                <td style={{ textAlign: 'right', padding: '20px', color: '#f0883e', fontWeight: 'bold', fontSize: '18px' }}>
                  {coin.resistencia}
                </td>

                <td style={{ textAlign: 'center', padding: '20px' }}>
                  <button style={{ backgroundColor: '#161b22', border: '1px solid #30363d', color: '#8b949e', padding: '6px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '10px', textTransform: 'uppercase' }}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer do Print */}
      <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#30363d', textTransform: 'uppercase', letterSpacing: '2px' }}>
        <div>Wiki Gameplay - Trading Analytics</div>
        <div>Powered by Binance Cloud - 2026</div>
      </div>
    </div>
  );
};

export default App;