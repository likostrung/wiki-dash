import React, { useState, useEffect } from 'react';

// Mantendo seu estilo original de Dashboard Black/Neon
const styles = {
  container: { backgroundColor: '#050505', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' },
  header: { textAlign: 'center', marginBottom: '50px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto' },
  card: { 
    background: 'rgba(255, 255, 255, 0.03)', 
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '30px', 
    borderRadius: '20px', 
    textAlign: 'center',
    transition: 'transform 0.3s ease'
  },
  price: { fontSize: '2.8rem', fontWeight: '900', color: '#00ff88', textShadow: '0 0 20px rgba(0, 255, 136, 0.3)' },
  badge: { padding: '8px 15px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px', display: 'inline-block' },
  infoBox: { marginTop: '20px', padding: '15px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid #222' },
  signal: { fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px', marginTop: '10px' }
};

function App() {
  const [data, setData] = useState({
    BTC: { price: "0.00", ai: null },
    ETH: { price: "0.00", ai: null },
    SOL: { price: "0.00", ai: null },
    XRP: { price: "0.00", ai: null }
  });

  const fetchData = async () => {
    try {
      const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT"];
      const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${JSON.stringify(symbols)}`);
      const prices = await res.json();
      
      prices.forEach(async (item) => {
        const coin = item.symbol.replace('USDT', '');
        const currentPrice = parseFloat(item.price).toFixed(2);

        // LINHA CORRIGIDA: APONTANDO PARA O SEU RENDER
        try {
          const aiRes = await fetch(`https://wiki-dash.onrender.com/api/ia-predict?ativo=${coin}&preco=${currentPrice}&rsi=55`);
          const aiData = await aiRes.json();
          setData(prev => ({ ...prev, [coin]: { price: currentPrice, ai: aiData } }));
        } catch (e) { console.error("Erro na IA:", e); }
      });
    } catch (e) { console.error("Erro Binance:", e); }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ fontSize: '2.5rem', letterSpacing: '5px' }}>WIKI DASH <span style={{ color: '#00ff88' }}>PRO</span></h1>
        <p style={{ color: '#666' }}>Sinais em tempo real via Motor IA Render</p>
      </div>

      <div style={styles.grid}>
        {Object.keys(data).map(coin => (
          <div key={coin} style={styles.card}>
            <span style={{...styles.badge, border: '1px solid #00ff88', color: '#00ff88'}}>LIVE MARKET</span>
            <h2 style={{ fontSize: '1.5rem', color: '#888', margin: '10px 0' }}>{coin} / USDT</h2>
            <div style={styles.price}>${data[coin].price}</div>

            {data[coin].ai ? (
              <div style={styles.infoBox}>
                <div style={{...styles.signal, color: data[coin].ai.sinal === 'BUY' ? '#00ff88' : data[coin].ai.sinal === 'SELL' ? '#ff4444' : '#888'}}>
                  SINAL: {data[coin].ai.sinal}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '0.8rem', color: '#555' }}>
                  <span>SUP: ${data[coin].ai.suporte}</span>
                  <span>RES: ${data[coin].ai.resistencia}</span>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '20px', color: '#333' }}>SINCRONIZANDO IA...</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;