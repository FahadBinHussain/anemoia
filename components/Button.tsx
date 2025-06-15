
import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  leftIcon,
  rightIcon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantStyles = {
    primary: "bg-cyan-500 text-slate-900 hover:bg-cyan-400 focus:ring-cyan-500 shadow-md shadow-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/50",
    secondary: "bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-500 shadow-md shadow-pink-500/30 hover:shadow-lg hover:shadow-pink-500/50",
    outline: "border border-current text-current hover:bg-current hover:text-slate-950 focus:ring-current", // Relies on className for specific colors like text-cyan-400, border-cyan-400, hover:bg-cyan-500 etc.
    ghost: "text-slate-300 hover:bg-slate-700 hover:text-white focus:ring-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md shadow-red-600/30 hover:shadow-lg hover:shadow-red-600/50",
  };
  
  const finalVariantStyle = variantStyles[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${finalVariantStyle} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2 -ml-1 h-5 w-5">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 -mr-1 h-5 w-5">{rightIcon}</span>}
    </button>
  );
};

export default Button;
