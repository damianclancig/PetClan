import React from 'react';
import { BoxProps } from '@mantine/core';

interface AnimatedBackgroundProps extends BoxProps {
    className?: string;
}

export function AnimatedBackground({ className, style, ...props }: AnimatedBackgroundProps) {
    // Image source is now handled by CSS classes for Theming support (light/dark pngs)

    return (
        <div
            className={`pet-pattern ${className || ''}`}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url("/assets/images/pet-pattern.png")',
                backgroundRepeat: 'repeat',
                backgroundSize: '300px',
                zIndex: 0,
                opacity: 0.3, // Enforced inline to guarantee subtlety
                pointerEvents: 'none',
                ...(style as any)
            }}
            {...props}
        />
    );
}
