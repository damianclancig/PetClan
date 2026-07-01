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

'use client';

import { Box, Container } from '@mantine/core';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { BenefitsSection } from './BenefitsSection';
import { CallToAction } from './CallToAction';
import { Footer } from '../layout/Footer';

export function LandingPage() {
    return (
        <Box>
            <LandingHeader />
            <HeroSection />
            <FeaturesSection />
            <BenefitsSection />
            <CallToAction />
            <Box component="footer" py="xl" style={{ borderTop: '1px solid var(--mantine-color-gray-2)', backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))' }}>
                <Container size="lg">
                    <Footer />
                </Container>
            </Box>
        </Box>
    );
}
