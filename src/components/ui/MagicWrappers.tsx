'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, ReactNode } from 'react';

// ----------------------------------------------------------------------
// 1. MagicPulse: Efecto de pulso suave (resplandor)
// ----------------------------------------------------------------------
interface MagicPulseProps {
    children: ReactNode;
    color?: string;
    active?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export const MagicPulse = ({
    children,
    color = 'rgba(56, 189, 248, 0.5)',
    active = true,
    className,
    style
}: MagicPulseProps) => {
    return (
        <div style={{ position: 'relative', display: 'inline-block', ...style }} className={className}>
            {active && (
                <motion.div
                    animate={{
                        boxShadow: [
                            `0 0 0 0px ${color}`,
                            `0 0 0 10px rgba(255, 255, 255, 0)`
                        ]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'inherit',
                        zIndex: -1
                    }}
                />
            )}
            {children}
        </div>
    );
};

// ----------------------------------------------------------------------
// 2. MagicTap: Efecto Ripple al tocar
// ----------------------------------------------------------------------
interface MagicTapProps {
    children: ReactNode;
    color?: string;
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export const MagicTap = ({
    children,
    color = 'rgba(255, 255, 255, 0.3)',
    className,
    onClick,
    style
}: MagicTapProps) => {
    return (
        <motion.div
            className={className}
            style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', ...style }}
            whileTap="tap"
            onClick={onClick}
        >
            {children}
            <motion.div
                variants={{
                    tap: {
                        scale: [0, 2],
                        opacity: [0.5, 0],
                        transition: { duration: 0.4 }
                    }
                }}
                initial={{ scale: 0, opacity: 0 }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    paddingBottom: '100%', // Hacerlo cuadrado
                    borderRadius: '50%',
                    backgroundColor: color,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    zIndex: 10
                }}
            />
        </motion.div>
    );
};

// ----------------------------------------------------------------------
// 3. MagicParticles: Explosión de partículas al clickear
// ----------------------------------------------------------------------
interface MagicParticlesProps {
    children: ReactNode;
    count?: number;
    color?: string | string[];
    className?: string;
    onClick?: () => void;
}

export const MagicParticles = ({
    children,
    count = 8,
    color = '#FFD700', // Dorado por defecto
    className,
    onClick
}: MagicParticlesProps) => {
    const [clicks, setClicks] = useState<number[]>([]);

    const handleClick = () => {
        setClicks(prev => [...prev, Date.now()]);
        if (onClick) onClick();
        // Limpieza automática
        setTimeout(() => {
            setClicks(prev => prev.slice(1));
        }, 1000);
    };

    const colors = Array.isArray(color) ? color : [color];

    return (
        <div style={{ position: 'relative', display: 'inline-flex' }} className={className}>
            <div onClick={handleClick} style={{ cursor: 'pointer' }}>
                {children}
            </div>
            <AnimatePresence>
                {clicks.map((id) => (
                    <ParticleGroup key={id} count={count} colors={colors} />
                ))}
            </AnimatePresence>
        </div>
    );
};

const ParticleGroup = ({ count, colors }: { count: number, colors: string[] }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => {
                const angle = (i / count) * 360;
                const distance = Math.random() * 30 + 20; // 20-50px
                const particleColor = colors[Math.floor(Math.random() * colors.length)];

                return (
                    <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                        animate={{
                            x: Math.cos(angle * Math.PI / 180) * distance,
                            y: Math.sin(angle * Math.PI / 180) * distance,
                            opacity: 0,
                            scale: 0
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: particleColor,
                            pointerEvents: 'none',
                            zIndex: 20
                        }}
                    />
                );
            })}
        </>
    );
}
