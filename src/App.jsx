import React, { useState, useEffect } from 'react';

const App = () => {
  const [alerts, setAlerts] = useState([]);
  const [coins, setCoins] = useState([
    { id: 'btc', name: 'BTC', symbol: 'btcusdt', price: 0, var24h: 0, vol: '0M', suporte: 62000, resistencia: 68000 },
    { id: 'sol', name: 'SOL', symbol: 'solusdt', price: 0, var24h: 0, vol: '0M', suporte: 140, resistencia: 160 },
    { id: 'xrp', name: 'XRP', symbol: 'xrpusdt', price: 0, var24h: 0, vol: '0M', suporte: 0.55, resistencia: 0.65 },
    { id: 'hbar', name: 'HBAR', symbol: 'hbarusdt', price: 0, var24h: 0, vol: '0M', suporte: 0.07, resistencia: 0.12 },
  ]);

  const formatCurrency = (val) => {
    return `$${parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  };

  // MOTOR BINANCE - CONEXÃO DIRETA
  useEffect(() => {
    const streams = 'btcusdt@ticker/solusdt@ticker/xrpusdt@ticker/hbarusdt@ticker';
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCoins(prev => prev.map(c => {
        if (c.symbol === data.s.toLowerCase()) {
          return { 
            ...c, 
            price: parseFloat(data.c), 
            var24h: parseFloat(data.P),
            vol: (parseFloat(data.q) / 1000000).toFixed(1) + 'M'
          };
        }
        return c;
      }));
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#22d3ee', letterSpacing: '2px' }}>WIKI COMMAND <span style={{fontSize: '12px', color: '#4ade80'}}>● LIVE MARKET</span></h1>
      
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
        <thead>
          <tr style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'left' }}>
            <th style={{ paddingLeft: '20px' }}>ATIVO</th>
            <th>PREÇO ATUAL</th>
            <th>VAR 24H</th>
            <th style={{ color: '#22d3ee' }}>SUPORTE</th>
            <th style={{ color: '#f59e0b' }}>RESISTÊNCIA</th>
          </tr>
        </thead>
        <tbody>
          {coins.map(coin => (
            <tr key={coin.id} style={{ backgroundColor: '#0f172a', borderRadius: '12px' }}>
              <td style={{ padding: '20px', borderRadius: '12px 0 0 12px' }}>
                <b style={{fontSize: '1.2rem'}}>{coin.name}</b>
                <div style={{fontSize: '0.7rem', color: '#475569'}}>VOL {coin.vol}</div>
              </td>
              <td style={{ color: '#4ade80', fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(coin.price)}</td>
              <td style={{ color: coin.var24h < 0 ? '#f87171' : '#4ade80' }}>{coin.var24h}%</td>
              <td style={{ color: '#22d3ee', fontWeight: 'bold' }}>{formatCurrency(coin.suporte)}</td>
              <td style={{ color: '#f59e0b', fontWeight: 'bold', borderRadius: '0 12px 12px 0' }}>{formatCurrency(coin.resistencia)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;