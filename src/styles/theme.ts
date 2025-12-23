import { createTheme } from '@mantine/core';

export const theme = createTheme({
    primaryColor: 'teal',
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    headings: {
        fontFamily: 'var(--font-poppins), system-ui, sans-serif',
    },
    defaultRadius: 'md',
    // We can add other global overrides here
});
