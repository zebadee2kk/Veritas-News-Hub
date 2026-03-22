import { useState, useEffect } from 'react';
import { NewsArticle, IntelligenceReport, Tweet } from '../types';
import { analyzeArticle, analyzeWithGrok } from '../services/intelligence';
import { fetchRelatedTweets } from '../services/social';
import { Shield, AlertCircle, TrendingUp, TrendingDown, Minus, Loader2, ExternalLink, Globe, Zap, RefreshCcw, Twitter, MessageSquare, Heart, Repeat, Share2, Mail, Linkedin, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';

interface SidebarProps {
  articles: NewsArticle[];
  selectedArticle: NewsArticle | null;
  onSelect: (article: NewsArticle) => void;
  loading: boolean;
  onRefresh?: () => void;
}

export default function Sidebar({ articles, selectedArticle, onSelect, loading, onRefresh }: SidebarProps) {
  const [report, setReport] = useState<IntelligenceReport | null>(null);
  const [grokReport, setGrokReport] = useState<IntelligenceReport | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [socialLoading, setSocialLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [hasGrok, setHasGrok] = useState(false);

  useEffect(() => {
    const key = process.env.GROK_API_KEY;
    setHasGrok(Boolean(key && key !== 'MY_GROK_API_KEY'));
  }, []);

  useEffect(() => {
    if (selectedArticle) {
      console.log(`Article selected for analysis: ${selectedArticle.title}`);
      setAnalyzing(true);
      setAnalysisProgress(0);
      setReport(null);
      setGrokReport(null);
      setTweets([]);
      
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);

      const geminiPromise = analyzeArticle(selectedArticle).then(res => {
        console.log("Gemini analysis report received.");
        setReport(res);
      });
      
      if (hasGrok) {
        console.log("Initiating Grok comparison analysis...");
        analyzeWithGrok(selectedArticle).then(res => {
          console.log("Grok analysis report received.");
          setGrokReport(res);
        });
      }

      // Fetch related tweets
      setSocialLoading(true);
      const searchQuery = selectedArticle.title.split(' ').slice(0, 5).join(' ');
      fetchRelatedTweets(searchQuery).then(res => {
        if (res.data) setTweets(res.data);
        setSocialLoading(false);
      });

      Promise.all([geminiPromise]).finally(() => {
        console.log("All intelligence analysis completed.");
        clearInterval(interval);
        setAnalysisProgress(100);
        setTimeout(() => setAnalyzing(false), 300);
      });
    }
  }, [selectedArticle, hasGrok]);

  return (
    <div className="w-96 h-full border-r border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="text-emerald-500" size={20} />
            <h1 className="text-xl font-bold tracking-tighter uppercase italic">Veritas</h1>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Global Intelligence Feed</p>
        </div>
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className="p-2 text-zinc-600 hover:text-emerald-500 transition-colors"
            title="Refresh Intelligence Feed"
          >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-600 gap-4">
            <Loader2 className="animate-spin" />
            <p className="text-xs font-mono uppercase">Ingesting Global Feeds...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-600 gap-4 p-8 text-center">
            <AlertCircle className="text-zinc-800" size={32} />
            <p className="text-[10px] font-mono uppercase tracking-widest leading-relaxed">
              No global feeds detected. Verify your NewsAPI key and system configuration.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {articles.map((article, idx) => (
              <button
                key={`${article.url}-${idx}`}
                onClick={() => onSelect(article)}
                className={`w-full text-left p-4 transition-colors hover:bg-zinc-900 group ${
                  selectedArticle?.url === article.url ? 'bg-zinc-900 border-l-2 border-emerald-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">{article.source.name}</span>
                  <span className="text-[10px] font-mono text-zinc-600">
                    {formatDistanceToNow(new Date(article.publishedAt))} ago
                  </span>
                </div>
                <h3 className="text-sm font-medium text-zinc-200 line-clamp-2 group-hover:text-white transition-colors">
                  {article.title}
                </h3>
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute bottom-0 left-0 w-96 h-[60%] bg-zinc-900 border-t border-zinc-700 shadow-2xl z-20 flex flex-col"
          >
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Intelligence Report</h2>
              <button onClick={() => onSelect(null as any)} className="text-zinc-500 hover:text-white text-xs">Close</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {analyzing ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
                  <div className="relative">
                    <Loader2 className="animate-spin text-emerald-500" size={32} />
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                  </div>
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                      <span>Analyzing Intelligence</span>
                      <span>{Math.round(analysisProgress)}%</span>
                    </div>
                    <div className="h-0.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                    <p className="text-[8px] font-mono text-zinc-600 text-center uppercase tracking-[0.2em] animate-pulse">
                      Cross-referencing global nodes...
                    </p>
                  </div>
                </div>
              ) : report ? (
                <div className="space-y-6">
                  {/* Comparison Tabs or Side-by-Side */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Gemini Analysis</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-950 p-4 border border-zinc-800 rounded col-span-2">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-[10px] font-mono text-zinc-500 uppercase">Truth Index</p>
                          <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            report.sentiment === 'neutral' ? 'bg-zinc-800 text-zinc-400' : 
                            report.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {report.sentiment}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-4xl font-bold ${report.truthIndex > 70 ? 'text-emerald-500' : report.truthIndex > 40 ? 'text-amber-500' : 'text-red-500'}`}>
                            {report.truthIndex}%
                          </span>
                          <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${report.truthIndex > 70 ? 'bg-emerald-500' : report.truthIndex > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${report.truthIndex}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bg-zinc-950 p-4 border border-zinc-800 rounded">
                        <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Source Cred</p>
                        <div className="flex items-end gap-2">
                          <span className={`text-xl font-bold ${report.credibilityScore > 70 ? 'text-emerald-500' : report.credibilityScore > 40 ? 'text-amber-500' : 'text-red-500'}`}>
                            {report.credibilityScore}%
                          </span>
                        </div>
                      </div>
                      <div className="bg-zinc-950 p-4 border border-zinc-800 rounded">
                        <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Bot Risk</p>
                        <div className="flex items-end gap-2">
                          <span className={`text-xl font-bold ${report.botLikelihood < 30 ? 'text-emerald-500' : report.botLikelihood < 60 ? 'text-amber-500' : 'text-red-500'}`}>
                            {report.botLikelihood}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed italic">"{report.summary}"</p>
                  </div>

                  {hasGrok && grokReport && (
                    <div className="space-y-4 pt-6 border-t border-zinc-800">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-zinc-100 rounded-full" />
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Grok Comparison</h3>
                      </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-950 p-4 border border-zinc-800 rounded col-span-2">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-[10px] font-mono text-zinc-500 uppercase">Truth Index</p>
                          <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            grokReport.sentiment === 'neutral' ? 'bg-zinc-800 text-zinc-400' : 
                            grokReport.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {grokReport.sentiment}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-4xl font-bold ${grokReport.truthIndex > 70 ? 'text-emerald-500' : grokReport.truthIndex > 40 ? 'text-amber-500' : 'text-red-500'}`}>
                            {grokReport.truthIndex}%
                          </span>
                          <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${grokReport.truthIndex > 70 ? 'bg-emerald-500' : grokReport.truthIndex > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${grokReport.truthIndex}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bg-zinc-950 p-4 border border-zinc-800 rounded">
                        <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Source Cred</p>
                        <div className="flex items-end gap-2">
                          <span className={`text-xl font-bold ${grokReport.credibilityScore > 70 ? 'text-emerald-500' : grokReport.credibilityScore > 40 ? 'text-amber-500' : 'text-red-500'}`}>
                            {grokReport.credibilityScore}%
                          </span>
                        </div>
                      </div>
                      <div className="bg-zinc-950 p-4 border border-zinc-800 rounded">
                        <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Bot Risk</p>
                        <div className="flex items-end gap-2">
                          <span className={`text-xl font-bold ${grokReport.botLikelihood < 30 ? 'text-emerald-500' : grokReport.botLikelihood < 60 ? 'text-amber-500' : 'text-red-500'}`}>
                            {grokReport.botLikelihood}%
                          </span>
                        </div>
                      </div>
                    </div>
                      <p className="text-xs text-zinc-400 leading-relaxed italic">"{grokReport.summary}"</p>
                    </div>
                  )}

                  {/* Social Intelligence Section */}
                  <div className="space-y-4 pt-6 border-t border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Twitter className="text-blue-400" size={16} />
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Social Intelligence</h3>
                    </div>
                    
                    {socialLoading ? (
                      <div className="flex items-center gap-2 py-4 text-zinc-600">
                        <Loader2 className="animate-spin" size={12} />
                        <span className="text-[10px] font-mono uppercase">Scanning X/Twitter...</span>
                      </div>
                    ) : tweets.length > 0 ? (
                      <div className="space-y-3">
                        {tweets.slice(0, 3).map(tweet => (
                          <div key={tweet.id} className="bg-zinc-950 p-3 border border-zinc-800 rounded text-[11px] leading-relaxed">
                            <p className="text-zinc-300 mb-2">{tweet.text}</p>
                          <div className="flex justify-between items-center text-zinc-600 font-mono text-[9px]">
                            <div className="flex gap-3">
                              <motion.span 
                                key={tweet.public_metrics?.like_count}
                                initial={{ opacity: 0.5, y: 2 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-1 hover:text-red-400 transition-colors"
                              >
                                <Heart size={10} /> {tweet.public_metrics?.like_count || 0}
                              </motion.span>
                              <motion.span 
                                key={tweet.public_metrics?.retweet_count}
                                initial={{ opacity: 0.5, y: 2 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                              >
                                <Repeat size={10} /> {tweet.public_metrics?.retweet_count || 0}
                              </motion.span>
                              <motion.span 
                                key={tweet.public_metrics?.reply_count}
                                initial={{ opacity: 0.5, y: 2 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                              >
                                <MessageSquare size={10} /> {tweet.public_metrics?.reply_count || 0}
                              </motion.span>
                              {tweet.public_metrics?.quote_count !== undefined && (
                                <motion.span 
                                  key={tweet.public_metrics?.quote_count}
                                  initial={{ opacity: 0.5, y: 2 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex items-center gap-1 hover:text-amber-400 transition-colors"
                                >
                                  <Quote size={10} /> {tweet.public_metrics?.quote_count || 0}
                                </motion.span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <a 
                                href={`https://twitter.com/intent/retweet?tweet_id=${tweet.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-400 transition-colors flex items-center gap-1"
                                title="Retweet"
                              >
                                <Repeat size={10} /> Retweet
                              </a>
                              <a 
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://twitter.com/i/status/${tweet.id}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-400 transition-colors flex items-center gap-1"
                                title="Quote Tweet"
                              >
                                <Quote size={10} /> Quote
                              </a>
                            </div>
                          </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] font-mono text-zinc-600 uppercase italic">No related social signals detected.</p>
                    )}
                  </div>

                  {/* Distribution Section */}
                  <div className="pt-6 border-t border-zinc-800 space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Distribute Intelligence</h3>
                    <div className="flex gap-2">
                      <a 
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedArticle.title)}&url=${encodeURIComponent(selectedArticle.url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white rounded text-[10px] font-mono uppercase transition-all"
                      >
                        <Twitter size={12} /> X
                      </a>
                      <a 
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(selectedArticle.url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white rounded text-[10px] font-mono uppercase transition-all"
                      >
                        <Linkedin size={12} /> LinkedIn
                      </a>
                      <a 
                        href={`mailto:?subject=${encodeURIComponent("Intelligence Report: " + selectedArticle.title)}&body=${encodeURIComponent("Check out this intelligence report on Veritas: " + selectedArticle.url)}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white rounded text-[10px] font-mono uppercase transition-all"
                      >
                        <Mail size={12} /> Email
                      </a>
                    </div>
                  </div>

                  <div className="pt-4">
                    <a 
                      href={selectedArticle.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs uppercase tracking-widest transition-colors"
                    >
                      Read Original Source <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
