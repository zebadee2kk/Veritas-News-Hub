import { useState, useEffect, useRef } from 'react';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import SetupGuide from './components/SetupGuide';
import { NewsArticle, NewsResponse } from './types';
import { Shield, Globe, AlertCircle, RefreshCcw } from 'lucide-react';
import { translateArticle } from './services/intelligence';

export default function App() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState('Initializing Satellite Uplink...');
  const [error, setError] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchingRef = useRef<boolean>(false);

  const checkConfig = () => {
    const geminiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    const mapsKey = process.env.GOOGLE_MAPS_PLATFORM_KEY;
    const newsKey = process.env.NEWS_API_KEY;

    const isPlaceholder = (key: string | undefined) => {
      if (!key) return true;
      const p = key.trim();
      if (p === '') return true;
      const up = p.toUpperCase();
      // Only flag as placeholder if it's a very common placeholder string
      return [
        'API_KEY', 
        'YOUR_API_KEY', 
        'MY_API_KEY', 
        'PLACEHOLDER', 
        'YOUR_GEMINI_API_KEY', 
        'MY_GEMINI_API_KEY',
        'YOUR_GOOGLE_MAPS_PLATFORM_KEY',
        'YOUR_NEWS_API_KEY'
      ].includes(up) || up.startsWith('YOUR_') || up.startsWith('MY_');
    };

    const mask = (key: string | undefined) => {
      if (!key) return 'MISSING';
      if (key.length < 8) return 'TOO_SHORT';
      return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
    };

    console.log("Intelligence Node Config Check:", {
      gemini: mask(geminiKey),
      gemini_raw_exists: Boolean(geminiKey),
      gemini_len: geminiKey?.length || 0,
      maps: mask(mapsKey),
      news: mask(newsKey)
    });

    const geminiOk = !isPlaceholder(geminiKey);
    const mapsOk = !isPlaceholder(mapsKey);
    const newsOk = !isPlaceholder(newsKey);

    console.log("Intelligence Node Status:", {
      gemini: geminiOk ? 'ACTIVE' : 'OFFLINE',
      maps: mapsOk ? 'ACTIVE' : 'OFFLINE',
      news: newsOk ? 'ACTIVE' : 'OFFLINE'
    });

    const isConfigured = geminiOk && mapsOk && newsOk;

    return isConfigured;
  };

  const [bypassActive, setBypassActive] = useState(false);

  useEffect(() => {
    const isConfigured = checkConfig();
    if (!isConfigured && !bypassActive) {
      setShowSetup(true);
    }
  }, [bypassActive]);

  const handleBypass = () => {
    console.warn("Manual override: Bypassing configuration checks.");
    setBypassActive(true);
    setShowSetup(false);
    // Ensure loading is reset before re-fetching
    setLoading(true);
    setError(null);
    // Trigger news fetch immediately after bypass
    setTimeout(() => fetchNews(), 100);
  };

  const fetchNews = async () => {
    if (fetchingRef.current) {
      console.log("Fetch already in progress, skipping.");
      return;
    }
    
    const isConfigured = checkConfig();
    if (!isConfigured && !bypassActive) {
      console.log("Configuration check failed, showing setup guide.");
      setShowSetup(true);
      return;
    }
    
    fetchingRef.current = true;
    console.log("Starting news fetch sequence...");
    setLoading(true);
    setLoadingProgress(0);
    setLoadingStep('Establishing Secure Handshake...');
    setError(null);

    // Safety timeout to prevent infinite loading
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    safetyTimeoutRef.current = setTimeout(() => {
      setLoading(currentLoading => {
        if (currentLoading) {
          console.warn("Safety timeout triggered: System still loading after 45s.");
          setError(prevError => {
            if (!prevError) {
              return 'System timeout: No global feeds detected. Please verify your NewsAPI key and network connection.';
            }
            return prevError;
          });
          return false;
        }
        return currentLoading;
      });
    }, 45000);

    const steps = [
      { msg: 'Establishing Secure Handshake...', p: 10 },
      { msg: 'Ingesting Global News Feeds...', p: 30 },
      { msg: 'Translating Intelligence Data...', p: 50 },
      { msg: 'Syncing Geospatial Intelligence...', p: 70 },
      { msg: 'Calibrating Truth Index Engines...', p: 90 },
      { msg: 'Finalizing Intelligence Dashboard...', p: 100 },
    ];

    let currentStepIdx = 0;
    if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    
    loadingIntervalRef.current = setInterval(() => {
      setLoadingProgress(prev => {
        const target = steps[currentStepIdx].p;
        if (prev < target) {
          return prev + 1;
        } else if (currentStepIdx < steps.length - 1) {
          currentStepIdx++;
          setLoadingStep(steps[currentStepIdx].msg);
          console.log(`Loading Step: ${steps[currentStepIdx].msg} (${steps[currentStepIdx].p}%)`);
        }
        return prev;
      });
    }, 50);

    try {
      console.log("Requesting intelligence from /api/news...");
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort();
        console.warn("Fetch News: Client-side timeout reached (15s).");
      }, 15000); // 15s timeout
      
      const response = await fetch('/api/news?pageSize=40', { 
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeout);
      
      console.log("Response received from /api/news:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error detail:", errorText);
        let errorMsg = `Server returned ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMsg = errorJson.error || errorMsg;
        } catch (e) {
          // Not JSON
        }
        throw new Error(errorMsg);
      }

      const data: NewsResponse = await response.json();
      console.log("Intelligence data parsed successfully. Articles:", data.articles?.length);
      if (data.articles?.length > 0) {
        console.log("First article title:", data.articles[0].title);
      }
      
      if (data.status === 'ok') {
        const rawArticles = data.articles || [];
        
        // Translate articles if they are not in English
        // We only translate the first 8 to keep it fast
        setLoadingStep('Translating Intelligence Data...');
        const translationResults = await Promise.allSettled(
          rawArticles.slice(0, 8).map(article => translateArticle(article))
        );
        
        const translatedArticles = translationResults.map((result, idx) => {
          if (result.status === 'fulfilled') {
            console.log(`Translation ${idx} successful.`);
            return result.value;
          } else {
            console.warn(`Translation failed for article ${idx}:`, result.reason);
            return rawArticles[idx];
          }
        });
        
        // Combine translated and remaining raw articles
        const finalArticles = [...translatedArticles, ...rawArticles.slice(8)];
        
        setArticles(finalArticles);
        if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
        setLoadingProgress(100);
        setLoadingStep('Intelligence Feed Active.');
        console.log("Fetch News Success: Articles loaded.");
      } else {
        const errorMsg = data.error || 'Failed to fetch global feeds. Check API configuration.';
        console.error("NewsAPI returned error status:", errorMsg);
        setError(errorMsg);
        if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
      }
    } catch (err) {
      console.error("Critical Fetch News Error:", err);
      setError(err instanceof Error ? err.message : 'Network error connecting to intelligence server.');
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    } finally {
      fetchingRef.current = false;
      // Delay hiding the loading screen slightly for visual smoothness
      setTimeout(() => {
        setLoading(false);
        console.log("Loading sequence finalized.");
      }, 1000);
      // Clear safety timeout
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
    }
  };

  useEffect(() => {
    console.log("System Booting. Initializing intelligence nodes...");
    fetchNews();
  }, []);

  if (showSetup) {
    return <SetupGuide onComplete={() => setShowSetup(false)} onBypass={handleBypass} />;
  }

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <Sidebar 
        articles={articles} 
        selectedArticle={selectedArticle} 
        onSelect={setSelectedArticle}
        loading={loading}
        onRefresh={fetchNews}
      />

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col">
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 z-10 p-6 pointer-events-none flex justify-between items-start">
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-4 rounded shadow-2xl pointer-events-auto">
            <div className="flex items-center gap-4">
              {bypassActive && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[8px] font-bold text-amber-500 uppercase tracking-widest">
                  <AlertCircle size={8} />
                  Limited Mode
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">System Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase">Operational</span>
                </div>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active Sources</span>
                <span className="text-xs font-bold uppercase">{articles.length} Global Nodes</span>
              </div>
              <button 
                onClick={fetchNews}
                className="p-2 hover:bg-zinc-800 rounded transition-colors pointer-events-auto"
                title="Refresh Feeds"
              >
                <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          <div className="flex gap-2 pointer-events-auto">
            <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 px-4 py-2 rounded shadow-2xl flex items-center gap-2">
              <Shield size={14} className="text-emerald-500" />
              <span className="text-[10px] font-mono uppercase tracking-tighter">Misinfo Filter: Active</span>
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="flex-1">
          <MapView 
            articles={articles} 
            onArticleSelect={setSelectedArticle} 
            bypassActive={bypassActive}
          />
        </div>

        {/* Loading Overlay */}
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/90 backdrop-blur-md z-[60]">
            <div className="max-w-md w-full p-8 space-y-8">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Globe className="text-emerald-500 animate-pulse" size={48} />
                  <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold uppercase tracking-tighter italic">Veritas Intelligence</h2>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Global Node Ingestion in Progress</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-mono text-emerald-500 uppercase animate-pulse">{loadingStep}</span>
                  <span className="text-xs font-mono text-zinc-400">{loadingProgress}%</span>
                </div>
                <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
                  <span>Est. Completion: {Math.max(0, Math.ceil((100 - loadingProgress) / 10))}s</span>
                  <span>Buffer: 12.4 GB/s</span>
                </div>
              </div>

              {loading && (
                <div className="flex justify-center">
                  <button 
                    onClick={() => {
                      setLoading(false);
                      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
                      if (articles.length === 0) {
                        // If no articles, add a dummy one so the map isn't empty
                        setArticles([{
                          source: { id: 'fallback', name: 'System Recovery' },
                          author: 'Veritas AI',
                          title: 'Intelligence Feed Interrupted: Using Local Cache',
                          description: 'The global intelligence feed is currently unreachable. System is operating on local heuristics.',
                          url: '#',
                          urlToImage: null,
                          publishedAt: new Date().toISOString(),
                          content: 'Manual bypass engaged. Please check network connectivity and API keys.',
                          location: { lat: 0, lng: 0, name: 'Global' }
                        }]);
                      }
                    }}
                    className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded transition-colors"
                  >
                    Force Start System
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-50">
            <div className="bg-zinc-900 border border-red-900/50 p-8 max-w-md text-center space-y-4 shadow-2xl">
              <AlertCircle className="mx-auto text-red-500" size={48} />
              <h2 className="text-xl font-bold uppercase tracking-tighter">System Error</h2>
              <p className="text-sm text-zinc-400 font-mono">{error}</p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={fetchNews}
                  className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Retry Connection
                </button>
                <button 
                  onClick={() => setError(null)}
                  className="px-6 py-2 text-[10px] text-zinc-500 hover:text-zinc-400 uppercase tracking-widest transition-colors"
                >
                  Bypass Error
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}
