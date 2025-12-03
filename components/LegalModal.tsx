import React from 'react';
import { ShieldAlert, Check } from 'lucide-react';
import { Button } from './ui/Button';

interface LegalModalProps {
  onAccept: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all animate-scaleIn">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 text-amber-400">
            <ShieldAlert className="w-8 h-8" />
            <h2 className="text-xl font-bold text-white">Legal Disclaimer</h2>
          </div>
          
          <div className="prose prose-invert prose-sm text-slate-300 max-h-60 overflow-y-auto custom-scrollbar mb-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <p className="mb-2"><strong>Please read carefully before proceeding:</strong></p>
            <ul className="list-disc pl-4 space-y-2">
              <li>
                <strong>Not Legal Advice:</strong> Delfos Quill Pro is an AI-powered research tool. The results provided are for informational purposes only and do not constitute legal advice, trademark clearance, or a guarantee of availability.
              </li>
              <li>
                <strong>AI Limitations:</strong> Artificial Intelligence can hallucinate or miss specific trademark filings. Always verify results with a qualified intellectual property attorney or official trademark database (USPTO, WIPO, etc.).
              </li>
              <li>
                <strong>No Liability:</strong> By using this tool, you agree that the operators of Delfos Quill Pro are not liable for any business decisions, legal disputes, or financial losses resulting from the use of this data.
              </li>
              <li>
                <strong>Affiliate Disclosure:</strong> This application may contain affiliate links to domain registrars or other services. We may earn a commission from qualifying purchases.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={onAccept} className="w-full justify-center">
              <Check className="w-4 h-4" />
              I Understand & Accept
            </Button>
            <p className="text-xs text-center text-slate-500">
              By clicking accept, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};