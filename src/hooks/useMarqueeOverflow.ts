import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook para calcular el desbordamiento horizontal de un contenedor y su contenido,
 * permitiendo activar animaciones de tipo marquesina únicamente cuando el texto no cabe.
 * Sigue principios SRP separando la lógica de medición de la capa de presentación.
 */
export function useMarqueeOverflow<T extends HTMLElement = HTMLDivElement, C extends HTMLElement = HTMLDivElement>() {
    const containerRef = useRef<T>(null);
    const contentRef = useRef<C>(null);
    const [overflowWidth, setOverflowWidth] = useState(0);

    const checkOverflow = useCallback(() => {
        if (containerRef.current && contentRef.current) {
            const containerW = containerRef.current.clientWidth;
            const contentW = contentRef.current.scrollWidth;
            if (contentW > containerW) {
                // Añadimos un pequeño margen (6px) para dar respiración a la última letra al desplazarse
                setOverflowWidth(contentW - containerW + 6);
            } else {
                setOverflowWidth(0);
            }
        }
    }, []);

    useEffect(() => {
        checkOverflow();

        const handleResize = () => checkOverflow();
        window.addEventListener('resize', handleResize);

        let observer: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
            observer = new ResizeObserver(() => checkOverflow());
            observer.observe(containerRef.current);
            if (contentRef.current) {
                observer.observe(contentRef.current);
            }
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            if (observer) observer.disconnect();
        };
    }, [checkOverflow]);

    return { containerRef, contentRef, overflowWidth, isOverflowing: overflowWidth > 0 };
}
