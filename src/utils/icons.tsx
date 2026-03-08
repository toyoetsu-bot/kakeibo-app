import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps {
    name: string;
    size?: number;
    className?: string;
}

export function DynamicIcon({ name, size = 24, className }: IconProps) {
    // @ts-ignore
    const LucideIcon = Icons[name] as React.ElementType;

    if (!LucideIcon) {
        return <Icons.Circle size={size} className={className} />;
    }

    return <LucideIcon size={size} className={className} />;
}
