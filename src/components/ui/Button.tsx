import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'ink';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth,
    className,
    ...props
}: ButtonProps) {
    const baseStyles = "relative font-bold uppercase transition-transform active:scale-95 flex items-center justify-center overflow-hidden";

    const variants = {
        primary: "bg-splat-yellow text-splat-black splat-shadow organic-shape hover:bg-yellow-400",
        secondary: "bg-splat-blue text-white splat-shadow organic-shape-2 hover:bg-blue-600",
        danger: "bg-splat-pink text-white splat-shadow organic-shape hover:bg-pink-600",
        ghost: "bg-transparent text-white hover:bg-white/10 rounded-xl",
        ink: "bg-splat-green text-splat-black splat-shadow skew-btn hover:bg-green-400"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-3 text-lg",
        lg: "px-8 py-4 text-xl"
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && "w-full",
                className
            )}
            {...props}
        >
            <span className={cn("relative z-10", variant === 'ink' && "skew-btn-content")}>
                {children}
            </span>
            {variant !== 'ghost' && (
                <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity z-0 pointer-events-none" />
            )}
        </button>
    );
}
