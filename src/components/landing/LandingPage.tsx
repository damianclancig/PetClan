'use client';

import { Box } from '@mantine/core';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { BenefitsSection } from './BenefitsSection';
import { CallToAction } from './CallToAction';

export function LandingPage() {
    return (
        <Box>
            <HeroSection />
            <FeaturesSection />
            <BenefitsSection />
            <CallToAction />
        </Box>
    );
}
