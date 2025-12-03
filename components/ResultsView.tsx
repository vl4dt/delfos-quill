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
    a.download = `delfos-quill-report-${new Date().toISOString().slice(0, 10)}.md`;
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
          let headerClass = "text-slate-200 border-slate-600";
          let bgClass = "bg-slate-800/40";

          if (titleLine.includes("Verdict")) {
               headerClass = "text-emerald-300 border-emerald-500/30";
               bgClass = "bg-emerald-900/10";
               icon = <ShieldCheck className="w-5 h-5 text-emerald-400" />;
          } else if (titleLine.includes("Conflicts")) {
               headerClass = "text-amber-300 border-amber-500/30";
               bgClass = "bg-amber-900/10";
               icon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
          } else if (titleLine.includes("Alternatives")) {
               headerClass = "text-blue-300 border-blue-500/30";
               bgClass = "bg-blue-900/10";
               icon = <Globe className="w-5 h-5 text-blue-400" />;
          } else if (titleLine.includes("Recommended Names")) {
               headerClass = "text-purple-300 border-purple-500/30";
               bgClass = "bg-purple-900/10";
               icon = <Sparkles className="w-5 h-5 text-purple-400" />;
          } else if (titleLine.includes("Strategy") || titleLine.includes("Naming")) {
               headerClass = "text-cyan-300 border-cyan-500/30";
               bgClass = "bg-cyan-900/10";
               icon = <Lightbulb className="w-5 h-5 text-cyan-400" />;
          } else if (titleLine.includes("Domain")) {
               headerClass = "text-indigo-300 border-indigo-500/30";
               bgClass = "bg-indigo-900/10";
               icon = <Globe className="w-5 h-5 text-indigo-400" />;
          }

          return (
              <div key={index} className={`mb-6 rounded-xl border ${headerClass.split(' ')[1]} ${bgClass} overflow-hidden`}>
                  <div className="px-6 py-4 border-b border-inherit flex items-center gap-3">
                      {icon}
                      <h3 className={`font-bold text-lg ${headerClass.split(' ')[0]}`}>{title}</h3>
                  </div>
                  <div className="p-6 text-slate-300 leading-relaxed whitespace-pre-wrap">
                      <FormattedText content={body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')} />
                      
                      {/* Monetization Hook: If this is the Domain section, add a CTA */}
                      {titleLine.includes("Domain") && brandNameQuery && (
                        <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col sm:flex-row gap-3">
                          <a 
                            href={`https://www.namecheap.com/domains/registration/results/?domain=${brandNameQuery}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Buy {brandNameQuery}.com
                          </a>
                           <a 
                            href={`https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${brandNameQuery}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                          >
                            <Search className="w-4 h-4" />
                            Check GoDaddy
                          </a>
                        </div>
                      )}
                  </div>
              </div>
          )
      })
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeIn pb-20">
      
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6 bg-slate-800/60 backdrop-blur border border-slate-700 rounded-xl p-3">
        <div className="flex items-center gap-2 px-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-slate-200">Analysis Complete</span>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
            >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
            </button>
            <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg transition-colors"
            >
                <Download className="w-4 h-4" />
                Export Report
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
          
          {/* Pro Tip Upsell (Visual Only) */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-5">
             <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <h4 className="font-bold text-indigo-100">Unlock Full Potential</h4>
             </div>
             <p className="text-sm text-indigo-200/70 mb-4">
                Need a comprehensive legal trademark search or logo design?
             </p>
             <button className="w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 text-indigo-300 rounded-lg text-sm font-medium transition-colors">
                Find Agency Partners
             </button>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 sticky top-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Sources found
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
                      className="block p-3 rounded-lg bg-slate-900/50 hover:bg-slate-700 border border-slate-700/50 hover:border-indigo-500/50 transition-all group"
                    >
                      <div className="text-sm font-medium text-slate-200 truncate group-hover:text-indigo-300">
                        {chunk.web.title}
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-1 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        {new URL(chunk.web.uri).hostname}
                      </div>
                    </a>
                   ) : null
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No direct web sources returned by the search grounding tool, or the model synthesized general knowledge.</p>
            )}

            <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-xs text-slate-500 text-center">
                    Analysis generated by Gemini 2.5 Flash. <br/> Always verify with legal counsel.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};