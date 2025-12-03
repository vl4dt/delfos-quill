import React, { useState, useEffect } from 'react';
import { Search, Globe, Sparkles, LayoutGrid, Smartphone, Monitor, Database, ShoppingBag, Gamepad2, Briefcase, ShieldCheck, Puzzle, Layers, Clock, ArrowRight, Trash2 } from 'lucide-react';
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
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(true); // Default true to prevent flash, checked in useEffect

  useEffect(() => {
    // Load History
    const savedHistory = localStorage.getItem('delfosQuillHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    // Check Terms Acceptance
    const accepted = localStorage.getItem('delfosQuillTermsAccepted');
    if (!accepted) {
      setHasAcceptedTerms(false);
    }
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem('delfosQuillTermsAccepted', 'true');
    setHasAcceptedTerms(true);
  };

  const addToHistory = (name: string, pType: ProductType, ctx: string, type: 'check' | 'generate') => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      brandName: name || "Generated Ideas",
      productType: pType,
      context: ctx,
      type
    };
    const updatedHistory = [newItem, ...history].slice(0, 10); // Keep last 10
    setHistory(updatedHistory);
    localStorage.setItem('delfosQuillHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
      setHistory([]);
      localStorage.removeItem('delfosQuillHistory');
  };

  const loadFromHistory = (item: HistoryItem) => {
      setBrandName(item.brandName === "Generated Ideas" ? "" : item.brandName);
      setProductType(item.productType);
      setContext(item.context);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) {
        setError("Please enter a brand name to check.");
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
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      setLoadingMode(null);
    }
  };

  const handleGenerate = async () => {
    if (!context.trim() && !brandName.trim()) {
      setError("Please provide a Context/Description or a Brand Name seed to generate ideas.");
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
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {!hasAcceptedTerms && <LegalModal onAccept={handleAcceptTerms} />}

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Delfos Quill <span className="text-xs font-normal text-indigo-400 px-1.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 ml-2 align-middle">PRO</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setShowHistory(!showHistory)} className="p-2 text-slate-400 hover:text-white transition-colors relative">
                <Clock className="w-5 h-5" />
                {history.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>}
             </button>
             <button className="hidden sm:block text-sm font-medium bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors border border-slate-700">
                Log In
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Secure your global <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">brand identity</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Check availability, generate names, and analyze conflicts across global domains and app stores using enterprise-grade AI.
          </p>
        </div>

        {/* Search Card */}
        <div className="w-full max-w-3xl bg-slate-800/40 backdrop-blur-xl border border-slate-700 rounded-2xl p-1 shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>
          <form onSubmit={handleCheck} className="p-6 sm:p-8 space-y-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Brand Name (Optional for Generator)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Sparkles className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-300 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-slate-500 transition-all text-lg"
                    placeholder="e.g. Nexus, StreamFlow... (or leave empty to generate)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Product Type</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        {getProductIcon(productType)}
                     </div>
                    <select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value as ProductType)}
                      className="block w-full pl-10 pr-10 py-3 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white appearance-none transition-all cursor-pointer"
                    >
                      {Object.values(ProductType).map((type) => (
                        <option key={type} value={type} className="bg-slate-800">{type}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Context</label>
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-slate-500 transition-all"
                    placeholder="Describe your product (Required for ideas)"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                type="submit" 
                className="w-full text-lg shadow-indigo-500/20"
                isLoading={loadingMode === 'checking'}
                disabled={loadingMode === 'generating'}
              >
                {loadingMode === 'checking' ? 'Scanning Global DB...' : 'Check Availability'}
              </Button>
              <Button 
                type="button"
                variant="secondary"
                onClick={handleGenerate}
                className="w-full text-lg"
                isLoading={loadingMode === 'generating'}
                disabled={loadingMode === 'checking'}
              >
                 {loadingMode === 'generating' ? 'Brainstorming...' : 'Generate Ideas'}
              </Button>
            </div>

            {/* Recent Searches (Mini) */}
            {history.length > 0 && !showHistory && (
                 <div className="pt-4 border-t border-slate-700/50 flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold mr-2">Recent:</span>
                    {history.slice(0, 3).map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => loadFromHistory(item)}
                            className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full text-slate-300 transition-colors truncate max-w-[150px]"
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
             <div className="w-full max-w-3xl bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-4 mb-8 animate-fadeIn">
                <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                    <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Search History
                    </h3>
                    <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Clear
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {history.map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => loadFromHistory(item)}
                            className="text-left p-3 rounded-lg bg-slate-900/40 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 transition-all group flex justify-between items-center"
                        >
                            <div className="overflow-hidden">
                                <div className="font-medium text-slate-200 truncate">{item.brandName}</div>
                                <div className="text-xs text-slate-500 truncate">{item.productType}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400" />
                        </button>
                    ))}
                    {history.length === 0 && <p className="text-sm text-slate-500 italic p-2">No recent history.</p>}
                </div>
             </div>
        )}

        {/* Results Area */}
        <div className="w-full">
          {error && (
            <div className="max-w-2xl mx-auto p-4 mb-8 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              {error}
            </div>
          )}

          {result && (
            <ResultsView result={result} brandNameQuery={brandName} />
          )}

          {!result && !isLoading && !error && (
            <div className="text-center text-slate-500 mt-12">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto opacity-50">
                  <div className="flex flex-col items-center gap-3">
                     <Globe className="w-8 h-8 mb-2" />
                     <span className="text-sm">Global Search</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                     <Database className="w-8 h-8 mb-2" />
                     <span className="text-sm">App Stores</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                     <ShieldCheck className="w-8 h-8 mb-2" />
                     <span className="text-sm">Trademark Scan</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                     <Sparkles className="w-8 h-8 mb-2" />
                     <span className="text-sm">AI Brainstorm</span>
                  </div>
               </div>
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-slate-800/50 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Delfos Quill Pro. Powered by Google Gemini.</p>
        <div className="mt-2 flex justify-center gap-4 text-xs">
            <a href="#" className="hover:text-indigo-400">Terms</a>
            <a href="#" className="hover:text-indigo-400">Privacy</a>
            <a href="#" className="hover:text-indigo-400">API</a>
        </div>
      </footer>
    </div>
  );
}

export default App;