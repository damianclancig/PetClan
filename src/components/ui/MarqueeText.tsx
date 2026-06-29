'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useMarqueeOverflow } from '@/hooks/useMarqueeOverflow';

interface MarqueeTextProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * Componente de UI reutilizable para animación de marquesina condicional.
 * Solo anima si el contenido excede el ancho del contenedor.
 * Ciclo de animación solicitado:
 * - Espera 2s al inicio
 * - Desplaza a velocidad media hacia el final
 * - Espera 2s al llegar al final
 * - Retrocede en 1s
 */
export function MarqueeText({ children, className, style }: MarqueeTextProps) {
    const { containerRef, contentRef, overflowWidth, isOverflowing } = useMarqueeOverflow();

    // Calculamos una duración de desplazamiento proporcional para mantener una velocidad media legible
    const forwardDuration = Math.max(3.5, overflowWidth * 0.035);
    const totalDuration = 2 + forwardDuration + 2 + 1; // 2s espera + desplazamiento + 2s espera + 1s retroceso

    // Tiempos normalizados [0, 1] para los keyframes de Framer Motion
    const tStartWait = 2 / totalDuration;
    const tEndForward = (2 + forwardDuration) / totalDuration;
    const tEndWait = (2 + forwardDuration + 2) / totalDuration;

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                width: '100%',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                position: 'relative',
                maskImage: isOverflowing
                    ? 'linear-gradient(90deg, transparent 0%, black 10px, black calc(100% - 22px), transparent 100%)'
                    : undefined,
                WebkitMaskImage: isOverflowing
                    ? 'linear-gradient(90deg, transparent 0%, black 10px, black calc(100% - 22px), transparent 100%)'
                    : undefined,
                ...style
            }}
        >
            <motion.div
                ref={contentRef}
                style={{
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    paddingLeft: isOverflowing ? 4 : 0
                }}
                animate={isOverflowing ? {
                    x: [0, 0, -overflowWidth, -overflowWidth, 0]
                } : { x: 0 }}
                transition={isOverflowing ? {
                    duration: totalDuration,
                    times: [0, tStartWait, tEndForward, tEndWait, 1],
                    ease: ["linear", "easeInOut", "linear", "easeInOut"],
                    repeat: Infinity,
                    repeatType: "loop"
                } : undefined}
            >
                {children}
            </motion.div>
        </div>
    );
}
