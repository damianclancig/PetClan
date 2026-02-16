import { Group, ActionIcon, NumberInput, Text } from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { useRef, useEffect } from 'react';

interface WeightInputProps {
    value: number | string;
    onChange: (value: number) => void;
    error?: string;
}

export function WeightInput({ value, onChange, error }: WeightInputProps) {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const valueRef = useRef(value);

    // Keep valueRef updated with latest value for the interval closure
    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    const stopAction = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleAction = (direction: 'up' | 'down') => {
        const current = Number(valueRef.current) || 0;
        let next: number;

        if (direction === 'up') {
            next = Math.min(100, Number((current + 0.1).toFixed(1)));
        } else {
            next = Math.max(0.1, Number((current - 0.1).toFixed(1)));
        }

        onChange(next);
    };

    const startAction = (direction: 'up' | 'down') => {
        stopAction(); // Clear any existing timers
        handleAction(direction); // Immediate trigger

        // Start delay before rapid fire
        timeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                handleAction(direction);
            }, 100); // 100ms interval for rapid fire
        }, 500); // 500ms delay before rapid fire starts
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => stopAction();
    }, []);

    return (
        <Group justify="center" gap="md">
            <ActionIcon
                size={42}
                variant="light"
                color="cyan"
                radius="xl"
                onPointerDown={() => startAction('down')}
                onPointerUp={stopAction}
                onPointerLeave={stopAction}
                disabled={!value || Number(value) <= 0.1}
                aria-label="Disminuir peso"
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
                onPointerDown={() => startAction('up')}
                onPointerUp={stopAction}
                onPointerLeave={stopAction}
                aria-label="Aumentar peso"
            >
                <IconPlus size={24} />
            </ActionIcon>
        </Group>
    );
}
