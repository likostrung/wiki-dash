import React, { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState({});
  const coins = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT"];

  const fetchData = async () => {
    try {
      // 1. Busca os preços direto da Binance
      const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${JSON.stringify(coins)}`);
      const prices = await res.json();
      
      // 2. Para cada moeda, busca a análise da IA no seu Render
      for (const item of prices) {
        const symbol = item.symbol.replace('USDT', '');
        const price = parseFloat(item.price).toFixed(2);
        
        try {
          const aiRes = await fetch(`https://wiki-dash.onrender.com/api/ia-predict?ativo=${symbol}&preco=${price}&rsi=55`);
          const aiData = await aiRes.json();
          
          setData(prev => ({ 
            ...prev, 
            [symbol]: { price, ai: aiData } 
          }));
        } catch (err) {
          console.error(`Erro na IA para ${symbol}:`, err);
        }
      }
    } catch (e) {
      console.error("Erro ao buscar preços:", e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Atualiza a cada 1 minuto
    return () => clearInterval(interval);
  }, []);

  // Estilos simples para o Dashboard não quebrar
  const styles = {
    container: { background: '#050505', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '40px' },
    card: { background: '#111', padding: '25px', borderRadius: '15px', border: '1px solid #333', textAlign: 'center' },
    price: { fontSize: '2.5rem', color: '#00ff88', fontWeight: 'bold', margin: '10px 0' },
    iaBox: { marginTop: '15px', background: '#1a1a1a', padding: '15px', borderRadius: '10px' },
    signal: { fontWeight: 'bold', fontSize: '1.2rem', color: '#fff', textTransform: 'uppercase' }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: 'center', letterSpacing: '2px' }}>WIKI DASH <span style={{ color: '#00ff88' }}>PRO 2.0</span></h1>
      
      <div style={styles.grid}>
        {Object.keys(data).map(coin => (
          <div key={coin} style={styles.card}>
            <h2 style={{ color: '#888' }}>{coin} / USDT</h2>
            <div style={styles.price}>${data[coin].price}</div>
            
            {data[coin].ai ? (
              <div style={styles.iaBox}>
                <div style={styles.signal}>{data[coin].ai.sinal}</div>
                <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#aaa' }}>
                  S: ${data[coin].ai.suporte} | R: ${data[coin].ai.resistencia}
                </div>
              </div>
            ) : (
              <div style={{ color: '#444' }}>Conectando IA...</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}