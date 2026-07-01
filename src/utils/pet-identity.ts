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

export const PET_IDENTITY_COLORS = [
    'teal',
    'yellow',
    'violet',
    'green',
    'orange',
    'cyan',
    'indigo',
    'grape',
    'lime',
];

export function getPetIdentityColor(id: string): string {
    if (!id) return 'teal';

    // Simple hashing consistent across re-renders
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % PET_IDENTITY_COLORS.length;
    return PET_IDENTITY_COLORS[index];
}
