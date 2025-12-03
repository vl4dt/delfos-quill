import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'premium';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-medium tracking-wide transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";
  
  // New Oracle Palette:
  // Primary: Deep Purple to Violet Gradient with Gold shadow
  // Secondary: Slate/Dark with Cyan hover
  // Outline: Subtle border with glow on hover
  // Premium: Gold/Amber gradient for monetization actions
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/40 border border-white/5",
    secondary: "bg-cyan-900/20 hover:bg-cyan-800/30 text-cyan-100 border border-cyan-700/30 shadow-lg shadow-cyan-900/10",
    outline: "bg-transparent border border-slate-600 text-slate-300 hover:border-amber-500/50 hover:text-amber-100 hover:bg-amber-900/10 hover:shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]",
    premium: "bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white shadow-lg shadow-amber-900/40 border border-white/10"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-serif italic tracking-wider">Processing...</span>
        </>
      ) : children}
    </button>
  );
};