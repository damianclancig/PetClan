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

import { Badge, BadgeProps, Group } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { IconCat, IconDog, IconGenderFemale, IconGenderMale, IconPaw } from '@tabler/icons-react';

interface PetSpeciesBadgeProps extends BadgeProps {
    species: string;
    sex: string;
}

export function PetSpeciesBadge({ species, sex, ...props }: PetSpeciesBadgeProps) {
    const tCommon = useTranslations('Common');

    const getSpeciesLabel = () => {
        // Safety: Only append suffix for known species that have female variants.
        const hasFemaleVariant = ['dog', 'cat'].includes(species);
        const suffix = (hasFemaleVariant && sex === 'female') ? '_female' : '';
        const key = `species.${species}${suffix}`;

        return tCommon(key);
    };

    const getSpeciesIcon = () => {
        if (species === 'dog') return <IconDog size={14} />;
        if (species === 'cat') return <IconCat size={14} />;
        return <IconPaw size={14} />;
    };

    const getGenderIcon = () => {
        if (sex === 'male') return <IconGenderMale size={14} color="var(--mantine-color-blue-5)" />;
        if (sex === 'female') return <IconGenderFemale size={14} color="var(--mantine-color-pink-5)" />;
        return null;
    };

    const label = getSpeciesLabel();
    // Remove emoji from translation if present, as we are adding our own icon
    const textOnly = label.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').trim();

    return (
        <Badge
            variant="filled"
            leftSection={getSpeciesIcon()}
            rightSection={getGenderIcon()}
            {...props}
        >
            {textOnly}
        </Badge>
    );
}
