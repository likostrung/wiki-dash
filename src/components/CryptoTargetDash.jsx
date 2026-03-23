import React, { useState, useEffect } from 'react';

const CryptoTargetDash = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados do seu backend Python (FastAPI)
  const fetchData = async () => {
    try {
      // Certifique-se que o seu Python está rodando na porta 8000
      const response = await fetch('http://localhost:8000/api/v1/market-status');
      const result = await response.json();
      setAssets(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao conectar com o Wiki Dash Backend:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Atualiza a cada 15 segundos
    return () => clearInterval(interval);
  }, []);

  // Lógica de alerta visual: muda a cor se estiver perto do suporte ou resistência
  const getRowStyle = (price, support, resistance) => {
    const margin = 0.005; // Margem de 0.5% para o alerta
    if (price <= support * (1 + margin)) return 'bg-blue-900/20 border-l-4 border-blue-500'; 
    if (price >= resistance * (1 - margin)) return 'bg-orange-900/20 border-l-4 border-orange-500';
    return 'border-l-4 border-transparent hover:bg-slate-800/40';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 text-slate-400 animate-pulse">
        Conectando ao Wiki Dash Backend...
      </div>
    );
  }

  return (
    <div className="bg-slate-950 p-6 rounded-2xl shadow-2xl border border-slate-800 text-slate-100 font-sans max-w-4xl mx-auto my-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-blue-400">Wiki Dash</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Market Stability Monitor (USD)</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] text-slate-400">LIVE</span>
        </div>
      </div>
      
      <div className="overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
              <th className="pb-3 pl-4">Ativo</th>
              <th className="pb-3 text-right">Preço Atual</th>
              <th className="pb-3 text-center">RSI (15m)</th>
              <th className="pb-3 text-right">Alvos (S / R)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {assets.map((asset) => (
              <tr key={asset.ticker} className={`${getRowStyle(asset.price, asset.support, asset.resistance)} transition-all duration-300`}>
                <td className="py-4 pl-4 font-bold text-lg">{asset.ticker}</td>
                <td className="py-4 text-right font-mono text-emerald-400 font-medium">
                  ${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.price < 1 ? 4 : 2 })}
                </td>
                <td className="py-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${asset.rsi < 35 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-300'}`}>
                    {asset.rsi}
                  </span>
                </td>
                <td className="py-4 text-right font-mono text-xs">
                  <span className="text-blue-400 font-bold">${asset.support}</span>
                  <span className="mx-2 text-slate-700">|</span>
                  <span className="text-orange-400 font-bold">${asset.resistance}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-6 text-[10px] text-slate-500 uppercase tracking-widest justify-center border-t border-slate-900 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Zona de Estabilidade
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div> Zona de Resistência
        </div>
      </div>
    </div>
  );
};

export default CryptoTargetDash;