import { Shield, Key, Globe, Map as MapIcon, Cpu, CheckCircle2, AlertCircle, ExternalLink, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface SetupGuideProps {
  onComplete: () => void;
  onBypass: () => void;
}

export default function SetupGuide({ onComplete, onBypass }: SetupGuideProps) {
  const isPlaceholder = (key: string | undefined) => {
    if (!key) return true;
    const p = key.trim();
    if (p === '') return true;
    const up = p.toUpperCase();
    return [
      'API_KEY', 
      'YOUR_API_KEY', 
      'MY_API_KEY', 
      'PLACEHOLDER', 
      'YOUR_GEMINI_API_KEY', 
      'MY_GEMINI_API_KEY'
    ].includes(up) || up.startsWith('YOUR_') || up.startsWith('MY_');
  };

  const mask = (key: string | undefined) => {
    if (!key) return 'MISSING';
    if (key.length < 8) return 'TOO_SHORT';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  const geminiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  const keys = [
    {
      id: 'GEMINI_API_KEY',
      name: 'Gemini AI API Key',
      description: 'Powers the intelligence engine, bot detection, and article summarization.',
      url: 'https://aistudio.google.com/app/apikey',
      icon: <Cpu className="text-purple-500" size={20} />,
      status: !isPlaceholder(geminiKey),
      masked: mask(geminiKey),
      required: true,
    },
    {
      id: 'GOOGLE_MAPS_PLATFORM_KEY',
      name: 'Google Maps API Key',
      description: 'Enables the global situation map and geospatial intelligence visualization.',
      url: 'https://console.cloud.google.com/google/maps-apis/credentials',
      icon: <MapIcon className="text-blue-500" size={20} />,
      status: !isPlaceholder(process.env.GOOGLE_MAPS_PLATFORM_KEY),
      masked: mask(process.env.GOOGLE_MAPS_PLATFORM_KEY),
      required: true,
    },
    {
      id: 'NEWS_API_KEY',
      name: 'NewsAPI Key',
      description: 'Provides the global news feed backbone for real-time ingestion.',
      url: 'https://newsapi.org/register',
      icon: <Globe className="text-emerald-500" size={20} />,
      status: !isPlaceholder(process.env.NEWS_API_KEY),
      masked: mask(process.env.NEWS_API_KEY),
      required: true,
    },
    {
      id: 'TWITTER_BEARER_TOKEN',
      name: 'X (Twitter) Bearer Token',
      description: 'Optional: Enables real-time social sentiment and local chatter analysis.',
      url: 'https://developer.x.com/en/portal/dashboard',
      icon: <Globe className="text-sky-500" size={20} />,
      status: !isPlaceholder(process.env.TWITTER_BEARER_TOKEN),
      masked: mask(process.env.TWITTER_BEARER_TOKEN),
      required: false,
    },
    {
      id: 'GROK_API_KEY',
      name: 'Grok (xAI) API Key',
      description: 'Optional: Enables secondary intelligence comparison for contrastive analysis.',
      url: 'https://console.x.ai/',
      icon: <Cpu className="text-zinc-400" size={20} />,
      status: !isPlaceholder(process.env.GROK_API_KEY),
      masked: mask(process.env.GROK_API_KEY),
      required: false,
    },
  ];

  const allConfigured = keys.filter(k => k.required).every(k => k.status);
  const geminiConfigured = keys.find(k => k.id === 'GEMINI_API_KEY')?.status;

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-emerald-500" size={32} />
            <h1 className="text-2xl font-bold tracking-tighter uppercase italic">System Initialization</h1>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Veritas requires secure API credentials to activate its global intelligence layers. 
            Follow the guide below to configure your environment.
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            {keys.map((key) => (
              <div 
                key={key.id}
                className={`p-4 rounded-lg border transition-all ${
                  key.status 
                    ? 'bg-emerald-500/5 border-emerald-500/20' 
                    : key.required ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-900/30 border-zinc-800/50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className={`p-2 rounded-md ${key.status ? 'bg-emerald-500/10' : 'bg-zinc-900'}`}>
                      {key.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                        {key.name}
                        {key.status && <CheckCircle2 size={14} className="text-emerald-500" />}
                        {!key.required && <span className="text-[8px] font-mono text-zinc-500 border border-zinc-700 px-1 rounded">OPTIONAL</span>}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        {key.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Current:</span>
                        <code className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${key.status ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                          {key.masked}
                        </code>
                      </div>
                      {!key.status && (
                        <a 
                          href={key.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 mt-3 uppercase tracking-wider"
                        >
                          Obtain Key <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                  {!key.status && (
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-mono ${key.required ? 'text-amber-500 bg-amber-500/10' : 'text-zinc-600 bg-zinc-800/50'} px-2 py-0.5 rounded uppercase`}>
                        {key.required ? 'Missing' : 'Inactive'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-zinc-300">
              <Key size={16} />
              <h4 className="text-xs font-bold uppercase tracking-widest">How to set variables</h4>
            </div>
            <div className="space-y-3 text-xs text-zinc-500 leading-relaxed">
              <p>
                1. Open the <strong className="text-zinc-300">Settings</strong> (⚙️ gear icon) in the top-right corner of AI Studio.
              </p>
              <p>
                2. Select <strong className="text-zinc-300">Secrets</strong> from the menu.
              </p>
              <p>
                3. Add each missing variable name (e.g., <code className="text-emerald-400">NEWS_API_KEY</code>) and paste your key as the value.
              </p>
              <p>
                4. <strong className="text-red-400 uppercase tracking-tighter font-bold">Important:</strong> Ensure the <strong className="text-zinc-300">Maps JavaScript API</strong> is enabled in your <a href="https://console.cloud.google.com/google/maps-apis/api/maps-backend.googleapis.com/overview" target="_blank" className="underline">Google Cloud Console</a>.
              </p>
              <p>
                5. The application will <strong className="text-zinc-300">automatically rebuild</strong> once you press Enter.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onComplete}
              disabled={!allConfigured}
              className={`w-full py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-sm transition-all ${
                allConfigured 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {allConfigured ? 'Initialize Veritas Intelligence' : 'Awaiting Full Configuration...'}
            </button>

            {!allConfigured && geminiConfigured && (
              <button
                onClick={onBypass}
                className="w-full py-3 rounded-lg font-bold uppercase tracking-[0.1em] text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all border border-zinc-700"
              >
                Initialize in Limited Mode (Gemini Only)
              </button>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-4">
            {!allConfigured && (
              <p className="text-center text-[10px] text-zinc-600 uppercase tracking-widest leading-relaxed">
                System remains in standby mode until all nodes are active.<br/>
                If you just added a secret, wait a few seconds for the rebuild.
              </p>
            )}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors"
              >
                <RefreshCcw size={12} />
                Refresh App
              </button>
              <button 
                onClick={onBypass}
                className="text-[10px] font-mono text-zinc-700 hover:text-zinc-500 uppercase tracking-widest transition-colors border-l border-zinc-800 pl-4"
              >
                Debug: Force Initialize
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
