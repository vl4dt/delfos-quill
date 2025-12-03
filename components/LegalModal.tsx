import React from 'react';
import { ShieldAlert, Check, FileText } from 'lucide-react';
import { Button } from './ui/Button';

interface LegalModalProps {
  onAccept: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all animate-scaleIn">
        
        <div className="bg-slate-900/50 p-6 border-b border-slate-800 flex items-center gap-3">
             <div className="p-2 bg-amber-500/10 rounded-lg">
                <ShieldAlert className="w-6 h-6 text-amber-500" />
             </div>
             <h2 className="text-xl font-serif font-bold text-white tracking-wide">Usage Disclaimer</h2>
        </div>

        <div className="p-6">
          <div className="prose prose-invert prose-sm text-slate-400 max-h-64 overflow-y-auto custom-scrollbar mb-6 bg-black/30 p-4 rounded-xl border border-white/5">
            <p className="mb-2 text-slate-200 font-medium">Please review before accessing Delfos Quill Pro:</p>
            <ul className="list-disc pl-4 space-y-3">
              <li>
                <strong>Informational Use Only:</strong> Delfos Quill Pro is an advanced AI research tool. Its outputs do not constitute legal advice, trademark clearance, or professional counsel.
              </li>
              <li>
                <strong>AI Accuracy:</strong> While powered by state-of-the-art models (Gemini), results may occasionally be incomplete or inaccurate ("hallucinations"). Always verify trademark availability with official government databases (USPTO, EUIPO, etc.).
              </li>
              <li>
                <strong>Liability Waiver:</strong> By entering, you agree that the creators of Delfos Quill Pro are not liable for any financial losses, legal disputes, or business failures resulting from reliance on this data.
              </li>
              <li>
                <strong>Monetization:</strong> We may receive compensation for referrals to domain registrars or third-party service providers.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <Button onClick={onAccept} className="w-full justify-center text-base py-4">
              <Check className="w-5 h-5" />
              I Acknowledge & Enter
            </Button>
            <div className="flex justify-center gap-4 text-xs text-slate-600">
                <a href="#" className="hover:text-slate-400 flex items-center gap-1"><FileText className="w-3 h-3"/> Terms of Service</a>
                <a href="#" className="hover:text-slate-400 flex items-center gap-1"><FileText className="w-3 h-3"/> Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};