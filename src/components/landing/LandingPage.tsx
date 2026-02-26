'use client';

import { Box, Container } from '@mantine/core';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { BenefitsSection } from './BenefitsSection';
import { CallToAction } from './CallToAction';
import { Footer } from '../layout/Footer';

export function LandingPage() {
    return (
        <Box>
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
