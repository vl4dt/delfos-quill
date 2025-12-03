import React, { useState, useEffect } from 'react';
import { Search, Globe, Sparkles, LayoutGrid, Smartphone, Monitor, Database, ShoppingBag, Gamepad2, Briefcase, ShieldCheck, Puzzle, Layers, Clock, ArrowRight, Trash2, Feather } from 'lucide-react';
import { ProductType, BrandCheckResult, HistoryItem } from './types';
import { checkBrandAvailability, generateBrandNames } from './services/geminiService';
import { Button } from './components/ui/Button';
import { ResultsView } from './components/ResultsView';
import { LegalModal } from './components/LegalModal';

function App() {
  const [brandName, setBrandName] = useState('');
  const [productType, setProductType] = useState<ProductType>(ProductType.ALL);
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMode, setLoadingMode] = useState<'checking' | 'generating' | null>(null);
  const [result, setResult] = useState<BrandCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(true);

  // New Storage Keys for the new Brand
  const STORAGE_KEY_HISTORY = 'delfosQuillProHistory';
  const STORAGE_KEY_TERMS = 'delfosQuillProTermsAccepted';

  useEffect(() => {
    // Load History
    const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    // Check Terms Acceptance
    const accepted = localStorage.getItem(STORAGE_KEY_TERMS);
    if (!accepted) {
      setHasAcceptedTerms(false);
    }
  }, []);

  // SEO: Update Page Title based on State
  useEffect(() => {
    if (result && brandName) {
        document.title = `Analysis: ${brandName} | Delfos Quill Pro`;
    } else if (result && !brandName) {
        document.title = `Generated Ideas | Delfos Quill Pro`;
    } else {
        document.title = `Delfos Quill Pro - AI Brand Name Generator & Availability Check`;
    }
  }, [result, brandName]);

  const handleAcceptTerms = () => {
    localStorage.setItem(STORAGE_KEY_TERMS, 'true');
    setHasAcceptedTerms(true);
  };

  const addToHistory = (name: string, pType: ProductType, ctx: string, type: 'check' | 'generate') => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      brandName: name || "Oracle Suggestions",
      productType: pType,
      context: ctx,
      type
    };
    const updatedHistory = [newItem, ...history].slice(0, 10); // Keep last 10
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY_HISTORY);
  };

  const loadFromHistory = (item: HistoryItem) => {
      setBrandName(item.brandName === "Oracle Suggestions" ? "" : item.brandName);
      setProductType(item.productType);
      setContext(item.context);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) {
        setError("The Oracle requires a name to consult the archives.");
        return;
    }

    setIsLoading(true);
    setLoadingMode('checking');
    setError(null);
    setResult(null);

    try {
      const data = await checkBrandAvailability(brandName, productType, context);
      setResult(data);
      addToHistory(brandName, productType, context, 'check');
    } catch (err: any) {
      setError(err.message || "The spirits are quiet. An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      setLoadingMode(null);
    }
  };

  const handleGenerate = async () => {
    if (!context.trim() && !brandName.trim()) {
      setError("Provide a context or seed word to invoke the naming spirits.");
      return;
    }

    setIsLoading(true);
    setLoadingMode('generating');
    setError(null);
    setResult(null);

    try {
      const data = await generateBrandNames(productType, context, brandName);
      setResult(data);
      addToHistory(brandName, productType, context, 'generate');
    } catch (err: any) {
      setError(err.message || "Failed to generate names.");
    } finally {
      setIsLoading(false);
      setLoadingMode(null);
    }
  };

  const getProductIcon = (type: ProductType) => {
    switch(type) {
      case ProductType.ALL: return <Layers className="w-5 h-5" />;
      case ProductType.MOBILE_APP: return <Smartphone className="w-5 h-5" />;
      case ProductType.DESKTOP_APP: return <Monitor className="w-5 h-5" />;
      case ProductType.CHROME_EXTENSION: return <Puzzle className="w-5 h-5" />;
      case ProductType.SAAS: return <Database className="w-5 h-5" />;
      case ProductType.ECOMMERCE: return <ShoppingBag className="w-5 h-5" />;
      case ProductType.GAME: return <Gamepad2 className="w-5 h-5" />;
      case ProductType.AGENCY: return <Briefcase className="w-5 h-5" />;
      default: return <LayoutGrid className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-purple-500/40">
      
      {!hasAcceptedTerms && <LegalModal onAccept={handleAcceptTerms} />}

      {/* Atmospheric Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-[#3b0764] rounded-full blur-[140px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#0e7490] rounded-full blur-[140px] opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-[40%] left-[-10%] w-[30%] h-[30%] bg-[#4338ca] rounded-full blur-[120px] opacity-10"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#020617]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                    <Feather className="w-5 h-5 text-amber-400" />
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold font-serif text-slate-100 tracking-tight leading-none">
                Delfos Quill
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-500 font-medium">Pro Edition</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setShowHistory(!showHistory)} className="p-2 text-slate-400 hover:text-amber-400 transition-colors relative group">
                <Clock className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] transition-all" />
                {history.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_5px_rgba(6,182,212,0.8)]"></span>}
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-serif tracking-tight text-white drop-shadow-2xl">
            The Oracle of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-300 to-cyan-300 animate-gradient-x">Modern Branding</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-light">
            Divine your brand's future. Analyze global conflicts, check availability, and summon creative names with the precision of AI.
          </p>
        </div>

        {/* Search/Input Interface */}
        <div className="w-full max-w-4xl glass-panel rounded-2xl p-1 shadow-2xl mb-12 relative overflow-hidden oracle-glow group transition-all duration-500 hover:shadow-[0_0_60px_-15px_rgba(124,58,237,0.4)]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          
          <form onSubmit={handleCheck} className="p-6 sm:p-10 space-y-8 bg-[#0B1121]/80 rounded-2xl">
            
            <div className="space-y-6">
              {/* Brand Name Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3 ml-1">Brand Identity</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Feather className="h-6 w-6 text-slate-500 group-focus-within/input:text-amber-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="block w-full pl-14 pr-4 py-5 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-slate-600 transition-all text-xl font-medium tracking-wide shadow-inner"
                    placeholder="Enter name to consult..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3 ml-1">Domain & Sector</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                        {getProductIcon(productType)}
                     </div>
                    <select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value as ProductType)}
                      className="block w-full pl-12 pr-10 py-4 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-slate-200 appearance-none transition-all cursor-pointer shadow-inner"
                    >
                      {Object.values(ProductType).map((type) => (
                        <option key={type} value={type} className="bg-slate-900">{type}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-600">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3 ml-1">Context / Intent</label>
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="block w-full px-5 py-4 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-slate-200 placeholder-slate-600 transition-all shadow-inner"
                    placeholder="Describe the essence..."
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <Button 
                type="submit" 
                className="w-full text-lg h-14"
                isLoading={loadingMode === 'checking'}
                disabled={loadingMode === 'generating'}
              >
                {loadingMode === 'checking' ? 'Consulting the Oracle...' : 'Check Availability'}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={handleGenerate}
                className="w-full text-lg h-14 border-slate-700 text-slate-300 hover:text-white hover:border-amber-500/50 hover:bg-amber-900/10"
                isLoading={loadingMode === 'generating'}
                disabled={loadingMode === 'checking'}
              >
                 {loadingMode === 'generating' ? 'Divining Names...' : 'Generate Ideas'}
              </Button>
            </div>

            {/* Recent Searches (Mini) */}
            {history.length > 0 && !showHistory && (
                 <div className="pt-6 border-t border-slate-800 flex flex-wrap gap-3 items-center justify-center sm:justify-start">
                    <span className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">Recent Consultations:</span>
                    {history.slice(0, 4).map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => loadFromHistory(item)}
                            className="text-xs px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/30 rounded-full text-slate-400 hover:text-purple-300 transition-all truncate max-w-[120px]"
                        >
                            {item.brandName}
                        </button>
                    ))}
                 </div>
            )}
          </form>
        </div>

        {/* History Panel (Collapsible) */}
        {showHistory && (
             <div className="w-full max-w-4xl bg-[#0f172a]/90 backdrop-blur border border-slate-800 rounded-xl p-6 mb-12 animate-fadeIn shadow-2xl">
                <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                    <h3 className="font-serif text-xl text-slate-200 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-cyan-500" /> Archives
                    </h3>
                    <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-3 py-1 rounded-full hover:bg-red-900/20 transition-colors">
                        <Trash2 className="w-3 h-3" /> Clear History
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {history.map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => loadFromHistory(item)}
                            className="text-left p-4 rounded-lg bg-slate-950/50 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all group flex justify-between items-center"
                        >
                            <div className="overflow-hidden">
                                <div className="font-medium text-slate-200 truncate font-serif tracking-wide">{item.brandName}</div>
                                <div className="text-xs text-slate-500 truncate mt-1">{item.productType}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-amber-400 transition-colors" />
                        </button>
                    ))}
                    {history.length === 0 && <p className="text-sm text-slate-500 italic p-4 text-center w-full col-span-2">The archives are empty.</p>}
                </div>
             </div>
        )}

        {/* Results Area */}
        <div className="w-full max-w-6xl">
          {error && (
            <div className="max-w-2xl mx-auto p-6 mb-12 bg-red-950/30 border border-red-900/50 rounded-xl text-red-200 flex items-center gap-4 shadow-lg backdrop-blur-sm">
              <ShieldCheck className="w-6 h-6 text-red-500" />
              <span className="text-lg">{error}</span>
            </div>
          )}

          {result && (
            <ResultsView result={result} brandNameQuery={brandName} />
          )}

          {!result && !isLoading && !error && (
            <div className="text-center text-slate-600 mt-20">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl mx-auto opacity-40 hover:opacity-100 transition-opacity duration-700">
                  <div className="flex flex-col items-center gap-4 group">
                     <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-purple-500/50 transition-colors">
                        <Globe className="w-7 h-7 text-slate-500 group-hover:text-purple-400" />
                     </div>
                     <span className="text-sm uppercase tracking-widest font-medium">Global</span>
                  </div>
                  <div className="flex flex-col items-center gap-4 group">
                     <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                         <Database className="w-7 h-7 text-slate-500 group-hover:text-cyan-400" />
                     </div>
                     <span className="text-sm uppercase tracking-widest font-medium">Markets</span>
                  </div>
                  <div className="flex flex-col items-center gap-4 group">
                     <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-amber-500/50 transition-colors">
                        <ShieldCheck className="w-7 h-7 text-slate-500 group-hover:text-amber-400" />
                     </div>
                     <span className="text-sm uppercase tracking-widest font-medium">Safety</span>
                  </div>
                  <div className="flex flex-col items-center gap-4 group">
                     <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-pink-500/50 transition-colors">
                         <Sparkles className="w-7 h-7 text-slate-500 group-hover:text-pink-400" />
                     </div>
                     <span className="text-sm uppercase tracking-widest font-medium">Ideation</span>
                  </div>
               </div>
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-slate-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <Feather className="w-4 h-4 text-slate-500" />
            <span className="font-serif text-slate-400 text-lg">Delfos Quill Pro</span>
        </div>
        <p className="text-slate-600 text-sm mb-6">&copy; {new Date().getFullYear()} All rights reserved. Powered by Google Gemini 2.5.</p>
        <div className="flex justify-center gap-6 text-xs text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Enterprise API</a>
        </div>
      </footer>
    </div>
  );
}

export default App;