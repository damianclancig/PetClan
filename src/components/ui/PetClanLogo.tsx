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

import { Group, Box } from '@mantine/core';
import Image from 'next/image';

interface PetClanLogoProps {
    hideTextOnMobile?: boolean;
    textWidth?: { base: number; sm: number } | number;
    textHeight?: number;
    priority?: boolean;
}

export function PetClanLogo({
    hideTextOnMobile = false,
    textWidth = { base: 100, sm: 150 },
    textHeight = 45,
    priority = true,
}: PetClanLogoProps) {
    return (
        <Group gap="xs" wrap="nowrap" align="center">
            <Box w={34} h={34} style={{ position: 'relative' }}>
                <Image
                    src="/assets/logo-icon.png"
                    alt="PetClan Isotype"
                    fill
                    sizes="34px"
                    style={{ objectFit: 'contain' }}
                    priority={priority}
                    unoptimized
                />
            </Box>
            <Box
                w={textWidth}
                h={textHeight}
                visibleFrom={hideTextOnMobile ? 'sm' : undefined}
                style={{ position: 'relative' }}
            >
                <Image
                    src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1770054970/PetClan/Logo_PetClan_text_k9ibqy.png"
                    alt="PetClan"
                    fill
                    sizes="(max-width: 768px) 110px, 160px"
                    style={{ objectFit: 'contain', objectPosition: 'left center' }}
                    priority={priority}
                />
            </Box>
        </Group>
    );
}
