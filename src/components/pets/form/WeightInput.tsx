import { Group, ActionIcon, NumberInput, Text } from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons-react';

interface WeightInputProps {
    value: number | string;
    onChange: (value: number) => void;
    error?: string;
}

export function WeightInput({ value, onChange, error }: WeightInputProps) {
    return (
        <Group justify="center" gap="md">
            <ActionIcon
                size={42}
                variant="light"
                color="cyan"
                radius="xl"
                onClick={() => {
                    const current = Number(value) || 0;
                    const next = Math.max(0.1, Number((current - 0.1).toFixed(1)));
                    onChange(next);
                }}
                disabled={!value || Number(value) <= 0.1}
            >
                <IconMinus size={24} />
            </ActionIcon>

            <NumberInput
                value={value}
                onChange={(val) => onChange(Number(val))}
                min={0.1}
                max={100}
                step={0.1}
                allowNegative={false}
                clampBehavior="strict"
                decimalScale={1}
                fixedDecimalScale
                w={120}
                size="lg"
                radius="md"
                styles={{ input: { textAlign: 'center', fontSize: 24, fontWeight: 'bold' } }}
                rightSection={<Text size="xs" c="dimmed" mr={10}>kg</Text>}
                rightSectionWidth={40}
                error={error}
            />

            <ActionIcon
                size={42}
                variant="filled"
                color="cyan"
                radius="xl"
                onClick={() => {
                    const current = Number(value) || 0;
                    const next = Math.min(100, Number((current + 0.1).toFixed(1)));
                    onChange(next);
                }}
            >
                <IconPlus size={24} />
            </ActionIcon>
        </Group>
    );
}
