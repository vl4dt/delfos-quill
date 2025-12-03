import React from 'react';
import { BrandCheckResult, GroundingChunk } from '../types';
import { ExternalLink, Search, Globe, ShieldCheck, AlertTriangle, Sparkles, Lightbulb, Download, Copy, Check, ShoppingCart } from 'lucide-react';

interface ResultsViewProps {
  result: BrandCheckResult;
  brandNameQuery?: string;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, brandNameQuery }) => {
  const { text, groundingChunks } = result;
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delfos-quill-pro-report-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to safely render bold text
  const FormattedText = ({ content }: { content: string }) => {
      const parts = content.split(/(<strong>.*?<\/strong>)/g);
      return (
          <span>
              {parts.map((part, i) => {
                  if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
                      return <strong key={i} className="text-white font-semibold">{part.replace(/<\/?strong>/g, '')}</strong>;
                  }
                  return part;
              })}
          </span>
      );
  };
  
  const renderContentSafe = (content: string) => {
      const sections = content.split(/(?=# )/g);
      return sections.map((section, index) => {
          if(!section.trim()) return null;
          const lines = section.trim().split('\n');
          const titleLine = lines[0];
          const title = titleLine.replace(/^#+\s*/, '').replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim(); 
          const body = lines.slice(1).join('\n').trim();

          let icon = <Search className="w-5 h-5" />;
          let headerClass = "text-slate-200 border-slate-700";
          let bgClass = "bg-slate-900/40";

          // Theme Logic: Oracle & Precious Metals
          if (titleLine.includes("Verdict")) {
               headerClass = "text-emerald-300 border-emerald-500/20";
               bgClass = "bg-emerald-950/20";
               icon = <ShieldCheck className="w-5 h-5 text-emerald-400" />;
          } else if (titleLine.includes("Conflicts")) {
               headerClass = "text-amber-300 border-amber-500/20";
               bgClass = "bg-amber-950/20";
               icon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
          } else if (titleLine.includes("Alternatives")) {
               headerClass = "text-cyan-300 border-cyan-500/20";
               bgClass = "bg-cyan-950/20";
               icon = <Globe className="w-5 h-5 text-cyan-400" />;
          } else if (titleLine.includes("Recommended Names")) {
               headerClass = "text-purple-300 border-purple-500/20";
               bgClass = "bg-purple-950/20";
               icon = <Sparkles className="w-5 h-5 text-purple-400" />;
          } else if (titleLine.includes("Strategy") || titleLine.includes("Naming")) {
               headerClass = "text-amber-200 border-amber-500/20";
               bgClass = "bg-amber-950/10";
               icon = <Lightbulb className="w-5 h-5 text-amber-400" />;
          } else if (titleLine.includes("Domain")) {
               headerClass = "text-indigo-300 border-indigo-500/20";
               bgClass = "bg-indigo-950/20";
               icon = <Globe className="w-5 h-5 text-indigo-400" />;
          }

          return (
              <div key={index} className={`mb-6 rounded-xl border ${headerClass.split(' ')[1]} ${bgClass} overflow-hidden backdrop-blur-sm shadow-sm`}>
                  <div className="px-6 py-4 border-b border-inherit flex items-center gap-3 bg-black/20">
                      {icon}
                      <h3 className={`font-serif font-bold text-xl tracking-wide ${headerClass.split(' ')[0]}`}>{title}</h3>
                  </div>
                  <div className="p-6 text-slate-300 leading-relaxed whitespace-pre-wrap">
                      <FormattedText content={body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')} />
                      
                      {/* Monetization Hook */}
                      {titleLine.includes("Domain") && brandNameQuery && (
                        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                          <a 
                            href={`https://www.namecheap.com/domains/registration/results/?domain=${brandNameQuery}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm shadow-lg shadow-amber-900/20"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Claim {brandNameQuery}.com
                          </a>
                           <a 
                            href={`https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${brandNameQuery}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm border border-slate-700"
                          >
                            <Search className="w-4 h-4" />
                            Check Registrars
                          </a>
                        </div>
                      )}
                  </div>
              </div>
          )
      })
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-fadeIn pb-24">
      
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 gap-4">
        <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-emerald-500/10 rounded-full">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
                <span className="font-serif font-bold text-slate-200 block">Oracle Report Ready</span>
                <span className="text-xs text-slate-500">Generated by Delfos Quill Pro</span>
            </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
            <button 
                onClick={handleCopy}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
            </button>
            <button 
                onClick={handleExport}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-purple-200 hover:text-white bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30 rounded-lg transition-colors"
            >
                <Download className="w-4 h-4" />
                Export PDF/MD
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analysis Column */}
        <div className="lg:col-span-2">
            {renderContentSafe(text)}
        </div>

        {/* Sidebar for Sources */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Upsell / Pro Feature */}
          <div className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] border border-indigo-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-24 h-24 text-white" />
             </div>
             <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <h4 className="font-serif font-bold text-indigo-100 text-lg">Deep Legal Search</h4>
                 </div>
                 <p className="text-sm text-indigo-200/80 mb-5 leading-relaxed">
                    AI is powerful, but legal certainty requires human experts. Get a comprehensive trademark filing report.
                 </p>
                 <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-sm font-medium transition-colors">
                    Find IP Attorneys
                 </button>
             </div>
          </div>

          {/* Sources Card */}
          <div className="bg-slate-900/60 backdrop-blur rounded-xl p-6 border border-slate-800 sticky top-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <Search className="w-3 h-3" />
              Intelligence Sources
            </h3>
            
            {groundingChunks.length > 0 ? (
              <div className="space-y-3">
                {groundingChunks.map((chunk, idx) => (
                   chunk.web ? (
                    <a 
                      key={idx}
                      href={chunk.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-black/40 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 transition-all group"
                    >
                      <div className="text-sm font-medium text-slate-300 truncate group-hover:text-cyan-300 font-serif">
                        {chunk.web.title}
                      </div>
                      <div className="text-xs text-slate-600 truncate mt-1 flex items-center gap-1 group-hover:text-slate-500">
                        <ExternalLink className="w-3 h-3" />
                        {new URL(chunk.web.uri).hostname}
                      </div>
                    </a>
                   ) : null
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600 italic border-l-2 border-slate-800 pl-3">
                  The oracle synthesized this knowledge from its internal training data. No external scrolls were cited directly.
              </p>
            )}

            <div className="mt-8 pt-6 border-t border-slate-800/50">
                <p className="text-[10px] text-slate-600 text-center leading-relaxed">
                    Delfos Quill Pro &bull; Powered by Gemini Flash 2.5 <br/> 
                    Results are for ideation purposes.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};