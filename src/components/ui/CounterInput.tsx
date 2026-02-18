import { Group, ActionIcon, NumberInput, Text } from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { useRef, useEffect } from 'react';

interface CounterInputProps {
    value: number | '';
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    decimalScale?: number; // 0 for integers, 1+ for decimals
    suffix?: string;
    width?: number;
}

export function CounterInput({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    decimalScale = 0,
    suffix = '',
    width = 120
}: CounterInputProps) {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const valueRef = useRef(value);

    // Keep valueRef updated
    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    const stopAction = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleAction = (direction: 'up' | 'down') => {
        const current = Number(valueRef.current) || min;
        let next: number;

        // Use precise floating point arithmetic if decimals involved
        const precision = Math.pow(10, decimalScale);

        if (direction === 'up') {
            const rawNext = current + step;
            next = Math.min(max, Math.round(rawNext * precision) / precision);
        } else {
            const rawNext = current - step;
            next = Math.max(min, Math.round(rawNext * precision) / precision);
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

    const isMinCheck = (val: number | '') => {
        if (val === '') return true; // Can't go below empty? Or treat as min.
        return Number(val) <= min;
    };

    const isMaxCheck = (val: number | '') => {
        if (val === '') return false;
        return Number(val) >= max;
    };

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
                disabled={isMinCheck(value)}
                aria-label="Disminuir valor"
            >
                <IconMinus size={24} />
            </ActionIcon>

            <NumberInput
                value={value}
                onChange={(val) => onChange(Number(val))}
                min={min}
                max={max}
                step={step}
                allowNegative={false}
                clampBehavior="strict"
                decimalScale={decimalScale}
                fixedDecimalScale={decimalScale > 0}
                w={width}
                size="lg"
                radius="md"
                styles={{ input: { textAlign: 'center', fontSize: 24, fontWeight: 'bold' } }}
                rightSection={suffix ? <Text size="xs" c="dimmed" mr={10}>{suffix}</Text> : null}
                rightSectionWidth={suffix ? 40 : 0}
            />

            <ActionIcon
                size={42}
                variant="filled"
                color="cyan"
                radius="xl"
                onPointerDown={() => startAction('up')}
                onPointerUp={stopAction}
                onPointerLeave={stopAction}
                disabled={isMaxCheck(value)}
                aria-label="Aumentar valor"
            >
                <IconPlus size={24} />
            </ActionIcon>
        </Group>
    );
}
