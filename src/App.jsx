import React, { useState, useEffect } from 'react';

// --- CONFIGURAÇÃO DE AMBIENTE ---
const API_URL = 'https://wiki-dash.onrender.com'; 

const App = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [coins, setCoins] = useState([
    { id: 'btc', name: 'BTC', symbol: 'btcusdt', vol: '0M', price: 0, var24h: 0, rsi: 50, suporte: 0, resistencia: 0, sinal: 'WAIT' },
    { id: 'sol', name: 'SOL', symbol: 'solusdt', vol: '0M', price: 0, var24h: 0, rsi: 50, suporte: 0, resistencia: 0, sinal: 'WAIT' },
    { id: 'xrp', name: 'XRP', symbol: 'xrpusdt', vol: '0M', price: 0, var24h: 0, rsi: 50, suporte: 0, resistencia: 0, sinal: 'WAIT' },
    { id: 'hbar', name: 'HBAR', symbol: 'hbarusdt', vol: '0M', price: 0, var24h: 0, rsi: 50, suporte: 0, resistencia: 0, sinal: 'WAIT' },
  ]);

  const formatCurrency = (val) => {
    return `$${parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  };

  const addAlert = (coin, tipo, valor) => {
    const novoAlerta = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      msg: `${coin} atingiu ${tipo}: ${formatCurrency(valor)}`
    };
    setAlerts(prev => [novoAlerta, ...prev].slice(0, 5));
  };

  // MOTOR 1: BINANCE WEBSOCKET (CORRIGIDO PARA NÃO TRAVAR)
  useEffect(() => {
    const streams = coins.map(c => `${c.symbol}@ticker`).join('/');
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCoins(prev => prev.map(c => {
        if (c.symbol === data.s.toLowerCase()) {
          const newPrice = parseFloat(data.c);
          return { 
            ...c, 
            price: newPrice, 
            var24h: parseFloat(data.P), 
            vol: (parseFloat(data.q) / 1000000).toFixed(1) + 'M' 
          };
        }
        return c;
      }));
    };
    return () => ws.close();
  }, []); // Dependência vazia para o motor rodar direto

  // MOTOR 2: IA GEMINI (CHAMADA SEGURA)
  useEffect(() => {
    const runIA = async () => {
      setIsCalculating(true);
      try {
        const updated = await Promise.all(coins.map(async (c) => {
          try {
            const res = await fetch(`${API_URL}/api/ia-predict?ativo=${c.name}&preco=${c.price}&rsi=${c.rsi}`);
            const data = await res.json();
            return data ? { ...c, suporte: data.suporte, resistencia: data.resistencia, sinal: data.sinal } : c;
          } catch (e) { return c; }
        }));
        setCoins(updated);
      } finally {
        setIsCalculating(false);
      }
    };
    const interval = setInterval(runIA, 60000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#22d3ee', letterSpacing: '2px', fontWeight: 'bold' }}>WIKI COMMAND</h1>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isCalculating ? '#a855f7' : '#4ade80', boxShadow: isCalculating ? '0 0 8px #a855f7' : '0 0 5px #4ade80', transition: '0.4s' }}></div>
        </div>
        <div style={{ textAlign: 'right', color: '#4ade80', fontSize: '0.8rem' }}>
          ● CLOUD_LIVE_MODE
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
        <thead>
          <tr style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase' }}>
            <th style={{ textAlign: 'left', paddingLeft: '20px' }}>Ativo / Volume</th>
            <th>Preço Atual</th>
            <th>Var 24h</th>
            <th>RSI</th>
            <th style={{ color: '#22d3ee' }}>Suporte (S)</th>
            <th style={{ color: '#f59e0b' }}>Resistência (R)</th>
          </tr>
        </thead>
        <tbody>
          {coins.map(coin => {
            const atingiuS = coin.price > 0 && coin.price <= coin.suporte;
            const atingiuR = coin.price > 0 && coin.price >= coin.resistencia;
            return (
              <tr key={coin.id} style={{ 
                backgroundColor: '#0f172a',
                outline: atingiuS ? '2px solid #22d3ee' : atingiuR ? '2px solid #f59e0b' : 'none',
                boxShadow: atingiuS ? '0 0 15px #22d3ee33' : atingiuR ? '0 0 15px #f59e0b33' : 'none',
                borderRadius: '12px', transition: '0.3s'
              }}>
                <td style={{ padding: '20px', borderRadius: '12px 0 0 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{coin.name}</span>
                    <span style={{ fontSize: '0.6rem', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', backgroundColor: coin.sinal === 'BUY' ? '#064e3b' : coin.sinal === 'SELL' ? '#7f1d1d' : '#1e293b', color: coin.sinal === 'BUY' ? '#4ade80' : coin.sinal === 'SELL' ? '#f87171' : '#94a3b8' }}>{coin.sinal}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '4px' }}>VOL {coin.vol}</div>
                </td>
                <td style={{ textAlign: 'center', color: '#4ade80', fontWeight: 'bold', fontSize: '1.6rem' }}>{formatCurrency(coin.price)}</td>
                <td style={{ textAlign: 'center', color: coin.var24h < 0 ? '#f87171' : '#4ade80', fontWeight: 'bold' }}>{coin.var24h}%</td>
                <td style={{ textAlign: 'center' }}><span style={{ border: '1px solid #059669', color: '#4ade80', padding: '4px 12px', borderRadius: '15px', fontSize: '0.8rem' }}>{coin.rsi}</span></td>
                <td style={{ textAlign: 'center', color: '#22d3ee', fontWeight: 'bold', fontSize: '1.3rem' }}>{formatCurrency(coin.suporte)}</td>
                <td style={{ textAlign: 'center', color: '#f59e0b', fontWeight: 'bold', fontSize: '1.3rem', borderRadius: '0 12px 12px 0' }}>{formatCurrency(coin.resistencia)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: '40px', backgroundColor: '#0f172a', borderRadius: '12px', padding: '20px', border: '1px solid #1e293b' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Recent Target Hits</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {alerts.length === 0 ? (
            <div style={{ color: '#334155', fontSize: '0.85rem' }}>Aguardando monitoramento de alvos...</div>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '8px', borderLeft: '3px solid #4ade80', backgroundColor: '#1e293b55' }}>
                <span style={{ color: '#e2e8f0' }}>{alert.msg}</span>
                <span style={{ color: '#64748b' }}>{alert.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;