import { useEffect, useMemo, useState } from 'react';
import {
  Activity, BrainCircuit, CalendarClock, CheckCircle2, CircleAlert,
  LoaderCircle, RefreshCw, Sparkles, TrendingUp, Wheat
} from 'lucide-react';
import commodityService from '../services/commodityService';
import { apiRequest } from '../services/api';
import './AIForecast.css';

const copy = {
  mr: {
    eyebrow: 'AI-आधारित नियोजन', title: 'AI धान्य मागणी अंदाज',
    subtitle: 'मागील मागणीच्या आधारे पुढील गरजेचा अंदाज घ्या आणि साठ्याचे नियोजन करा.',
    dbMode: 'डेटाबेसमधून अंदाज', manualMode: 'मागणी टाकून अंदाज', commodity: 'धान्याचा प्रकार',
    choose: 'धान्य निवडा', run: 'AI अंदाज काढा', running: 'अंदाज काढत आहे...',
    refresh: 'पुन्हा लोड करा', predicted: 'अंदाजित मागणी', method: 'पद्धत', note: 'AI निरीक्षण',
    historyTitle: 'मागील महिन्यांची मागणी', historyHelp: 'किमान ३ महिन्यांची मागणी टाका.',
    item: 'धान्याचे नाव', unit: 'एकक', demand: 'मागणी', months: 'महिन्यानुसार मागणी',
    success: 'अंदाज तयार झाला', dbEmpty: 'या धान्यासाठी वितरणाचा पुरेसा इतिहास उपलब्ध नाही. खालील पर्यायातून किमान ३ महिन्यांची मागणी टाकून अंदाज काढा.',
    loadError: 'धान्यांची यादी लोड झाली नाही.', runError: 'अंदाज तयार करता आला नाही. Backend आणि AI service सुरू आहेत का ते तपासा.',
    noCommodity: 'आधी धान्याचा प्रकार जोडा.', how: 'कसे काम करते?', howText: 'सिस्टम मागील वितरण डेटा वापरते. पुरेसा डेटा नसल्यास तुम्ही मागणीची माहिती देऊन अंदाज काढू शकता.',
    month: 'महिना', units: 'मात्रा', enter: 'मागणीची मात्रा', forecastTip: 'हा अंदाज नियोजनासाठी आहे; प्रत्यक्ष वितरण व उपलब्ध साठा तपासून निर्णय घ्या.'
  },
  en: {
    eyebrow: 'AI-powered planning', title: 'AI Grain Demand Forecast',
    subtitle: 'Estimate upcoming demand from past distribution and plan stock more confidently.',
    dbMode: 'Forecast from database', manualMode: 'Enter demand manually', commodity: 'Commodity',
    choose: 'Choose a commodity', run: 'Generate AI forecast', running: 'Generating forecast...',
    refresh: 'Reload list', predicted: 'Predicted demand', method: 'Method', note: 'AI insight',
    historyTitle: 'Historical monthly demand', historyHelp: 'Enter demand for at least 3 months.',
    item: 'Commodity name', unit: 'Unit', demand: 'Demand', months: 'Monthly demand',
    success: 'Forecast generated', dbEmpty: 'There is not enough distribution history for this commodity. Enter at least 3 months of demand in the manual option to generate a forecast.',
    loadError: 'Could not load commodities.', runError: 'Could not generate a forecast. Check that the backend and AI service are running.',
    noCommodity: 'Add a commodity first.', how: 'How it works', howText: 'The system uses past distribution data. If history is insufficient, enter demand manually to generate an estimate.',
    month: 'Month', units: 'Quantity', enter: 'Enter demand quantity', forecastTip: 'This estimate supports planning. Check actual distribution and available stock before making decisions.'
  },
  hi: {
    eyebrow: 'AI आधारित योजना', title: 'AI अनाज मांग पूर्वानुमान',
    subtitle: 'पिछले वितरण के आधार पर आने वाली मांग का अनुमान लगाएँ और स्टॉक की योजना बनाएँ।',
    dbMode: 'डेटाबेस से अनुमान', manualMode: 'मांग दर्ज करें', commodity: 'अनाज का प्रकार',
    choose: 'अनाज चुनें', run: 'AI अनुमान बनाएँ', running: 'अनुमान बन रहा है...',
    refresh: 'सूची फिर लोड करें', predicted: 'अनुमानित मांग', method: 'तरीका', note: 'AI जानकारी',
    historyTitle: 'पिछले महीनों की मांग', historyHelp: 'कम से कम 3 महीनों की मांग दर्ज करें।',
    item: 'अनाज का नाम', unit: 'इकाई', demand: 'मांग', months: 'मासिक मांग',
    success: 'अनुमान तैयार है', dbEmpty: 'इस अनाज के लिए पर्याप्त वितरण इतिहास नहीं है। मैन्युअल विकल्प में कम से कम 3 महीनों की मांग दर्ज करें।',
    loadError: 'अनाज की सूची लोड नहीं हुई।', runError: 'अनुमान नहीं बन सका। Backend और AI service जाँचें।',
    noCommodity: 'पहले अनाज जोड़ें।', how: 'यह कैसे काम करता है?', howText: 'सिस्टम पिछले वितरण डेटा का उपयोग करता है। डेटा कम होने पर आप मांग खुद दर्ज कर सकते हैं।',
    month: 'महीना', units: 'मात्रा', enter: 'मांग की मात्रा दर्ज करें', forecastTip: 'यह अनुमान योजना बनाने में मदद करता है। निर्णय से पहले वास्तविक वितरण और उपलब्ध स्टॉक जाँचें।'
  }
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AIForecast({ language = 'mr', token, role = 'USER' }) {
  const t = copy[language] || copy.mr;
  const canRunManual = ['ADMIN', 'OFFICER'].includes(String(role).toUpperCase());
  const [mode, setMode] = useState('database');
  const [commodities, setCommodities] = useState([]);
  const [commodityId, setCommodityId] = useState('');
  const [loadingList, setLoadingList] = useState(false);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [result, setResult] = useState(null);
  const [itemName, setItemName] = useState('');
  const [unit, setUnit] = useState('KG');
  const [demands, setDemands] = useState(['', '', '', '', '', '']);

  const selectedCommodity = useMemo(
    () => commodities.find((item) => String(item.id) === String(commodityId)),
    [commodities, commodityId]
  );

  async function loadCommodities() {
    setLoadingList(true);
    setError('');
    try {
      const data = await commodityService.getAll();
      const list = Array.isArray(data) ? data : [];
      setCommodities(list);
      if (!commodityId && list.length) {
        setCommodityId(String(list[0].id));
        setItemName(list[0].name || '');
        setUnit(list[0].unit || 'KG');
      }
    } catch (e) {
      setError(e.message || t.loadError);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => { loadCommodities(); /* load once on mount */ }, []);

  useEffect(() => {
    if (selectedCommodity) {
      setItemName(selectedCommodity.name || '');
      setUnit(selectedCommodity.unit || 'KG');
    }
  }, [selectedCommodity]);

  async function generateDatabaseForecast() {
    if (!commodityId) { setError(t.noCommodity); return; }
    setLoadingForecast(true); setError(''); setInfo(''); setResult(null);
    try {
      const response = await apiRequest(`/ai/forecast/commodity/${commodityId}`, {}, token);
      setResult(response);
      setInfo(t.success);
    } catch (e) {
      if (/no demand history|insufficient|not found/i.test(e.message || '')) setInfo(t.dbEmpty);
      else setError(`${e.message || t.runError} ${t.dbEmpty}`);
    } finally { setLoadingForecast(false); }
  }

  async function generateManualForecast(event) {
    event.preventDefault();
    const values = demands.map((value) => value.trim() === '' ? null : Number(value));
    if (!itemName.trim() || values.filter((value) => value !== null && Number.isFinite(value) && value >= 0).length < 3) {
      setError(t.historyHelp); return;
    }
    const monthlyDemand = values.filter((value) => value !== null && Number.isFinite(value) && value >= 0);
    if (monthlyDemand.length < 3) { setError(t.historyHelp); return; }
    setLoadingForecast(true); setError(''); setInfo(''); setResult(null);
    try {
      const response = await apiRequest('/ai/forecast', {
        method: 'POST',
        body: JSON.stringify({ itemName: itemName.trim(), unit: unit || 'KG', monthlyDemand }),
      }, token);
      setResult(response); setInfo(t.success);
    } catch (e) { setError(e.message || t.runError); }
    finally { setLoadingForecast(false); }
  }

  const formattedPrediction = Number.isFinite(Number(result?.predicted_demand))
    ? Number(result.predicted_demand).toLocaleString(undefined, { maximumFractionDigits: 2 })
    : '—';

  return (
    <section className="ai-forecast-page">
      <div className="forecast-heading">
        <div className="forecast-heading-copy">
          <span className="forecast-eyebrow"><Sparkles size={15} /> {t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="forecast-hero-icon"><BrainCircuit size={34} /></div>
      </div>

      <div className="forecast-mode-switch" role="tablist" aria-label={t.title}>
        <button type="button" role="tab" aria-selected={mode === 'database'} className={mode === 'database' ? 'active' : ''} onClick={() => { setMode('database'); setError(''); setInfo(''); setResult(null); }}>
          <Activity size={17} /> {t.dbMode}
        </button>
        <button type="button" role="tab" aria-selected={mode === 'manual'} className={mode === 'manual' ? 'active' : ''} disabled={!canRunManual} title={!canRunManual ? 'Admin or Officer permission required' : ''} onClick={() => { if (!canRunManual) return; setMode('manual'); setError(''); setInfo(''); setResult(null); }}>
          <CalendarClock size={17} /> {t.manualMode}
        </button>
      </div>

      {error && <div className="forecast-alert error"><CircleAlert size={18} /><span>{error}</span></div>}
      {info && <div className="forecast-alert info"><CheckCircle2 size={18} /><span>{info}</span></div>}

      {mode === 'database' ? (
        <div className="forecast-panel">
          <div className="forecast-panel-title"><div className="mini-icon"><Wheat size={20} /></div><div><h2>{t.dbMode}</h2><p>{t.howText}</p></div></div>
          <div className="forecast-form-row">
            <label className="forecast-field"><span>{t.commodity}</span>
              <select value={commodityId} onChange={(e) => { setCommodityId(e.target.value); setResult(null); setInfo(''); }} disabled={loadingList || !commodities.length}>
                <option value="">{loadingList ? 'Loading...' : t.choose}</option>
                {commodities.map((item) => <option key={item.id} value={item.id}>{item.name} {item.unit ? `(${item.unit})` : ''}</option>)}
              </select>
            </label>
            <button type="button" className="forecast-secondary-button" onClick={loadCommodities} disabled={loadingList}><RefreshCw size={16} className={loadingList ? 'spin' : ''} /> {t.refresh}</button>
          </div>
          <button type="button" className="forecast-primary-button" onClick={generateDatabaseForecast} disabled={loadingForecast || !commodityId}>
            {loadingForecast ? <LoaderCircle size={18} className="spin" /> : <Sparkles size={18} />}{loadingForecast ? t.running : t.run}
          </button>
          {!commodities.length && !loadingList && <p className="forecast-empty-note">{t.noCommodity}</p>}
        </div>
      ) : (
        <form className="forecast-panel" onSubmit={generateManualForecast}>
          <div className="forecast-panel-title"><div className="mini-icon"><CalendarClock size={20} /></div><div><h2>{t.historyTitle}</h2><p>{t.historyHelp}</p></div></div>
          <div className="forecast-form-row">
            <label className="forecast-field"><span>{t.item}</span><input value={itemName} onChange={(e) => setItemName(e.target.value)} required placeholder={t.item} /></label>
            <label className="forecast-field unit-field"><span>{t.unit}</span><select value={unit} onChange={(e) => setUnit(e.target.value)}><option value="KG">KG</option><option value="Quintal">Quintal</option><option value="Ton">Ton</option><option value="Packets">Packets</option></select></label>
          </div>
          <div className="forecast-demand-grid">
            {demands.map((value, index) => <label className="forecast-field" key={index}><span>{t.month} {index + 1}</span><input type="number" min="0" step="0.01" value={value} onChange={(e) => setDemands((old) => old.map((item, i) => i === index ? e.target.value : item))} placeholder={t.enter} /></label>)}
          </div>
          <button type="submit" className="forecast-primary-button" disabled={loadingForecast}>{loadingForecast ? <LoaderCircle size={18} className="spin" /> : <Sparkles size={18} />}{loadingForecast ? t.running : t.run}</button>
        </form>
      )}

      {result && <div className="forecast-result-card">
        <div className="forecast-result-top"><span className="forecast-result-kicker"><CheckCircle2 size={16} /> {t.success}</span><span className="forecast-method">{result.method || 'AI'}</span></div>
        <div className="forecast-result-main"><div><p>{t.predicted}</p><div className="forecast-number">{formattedPrediction} <small>{result.unit || unit || 'KG'}</small></div><span className="forecast-item-name">{result.item_name || itemName || selectedCommodity?.name}</span></div><div className="forecast-result-graphic"><TrendingUp size={31} /></div></div>
        {result.note && <div className="forecast-note"><Sparkles size={17} /><div><strong>{t.note}</strong><p>{result.note}</p></div></div>}
        <p className="forecast-tip">{t.forecastTip}</p>
      </div>}

      <div className="forecast-help-card"><div className="mini-icon"><BrainCircuit size={20} /></div><div><h3>{t.how}</h3><p>{t.howText}</p></div></div>
    </section>
  );
}
