/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
