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
