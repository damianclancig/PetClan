import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';

// Configure dayjs once
dayjs.extend(utc);
dayjs.extend(relativeTime);

export const DATE_FORMAT_DISPLAY = 'DD/MM/YYYY';
export const DATE_FORMAT_INPUT = 'YYYY-MM-DD';

/**
 * Returns the current date object wrapped in dayjs, in UTC/Local as configured.
 * Currently defaulting to standard dayjs() which is local, but extended with plugins.
 * Can be enhanced to force UTC system-wide if needed.
 */
export function now() {
    return dayjs();
}

/**
 * Parses a date value into a dayjs object.
 */
export function parseDate(date: string | Date | undefined | null) {
    if (!date) return null;
    return dayjs(date);
}

/**
 * Formats a date for display (e.g. DD/MM/YYYY).
 * Forces UTC interpretation to avoid timezone shifts for stored dates (midnight UTC).
 */
export function formatDate(date: string | Date | undefined | null, format: string = DATE_FORMAT_DISPLAY) {
    if (!date) return '';
    return dayjs(date).utc().format(format);
}

/**
 * Formats a date for input values (YYYY-MM-DD).
 * Useful for editing forms.
 */
export function formatDateForInput(date: string | Date | undefined | null) {
    if (!date) return '';
    // If it's a stored date (UTC midnight), .utc() keeps it as is.
    return dayjs(date).utc().format(DATE_FORMAT_INPUT);
}

export function calculateAge(birthDate: string | Date) {
    return dayjs().diff(birthDate, 'year');
}

/**
 * Formats age dynamically:
 * - >= 1 year: "X años"
 * - >= 2 months & < 1 year: "X meses"
 * - < 2 months: "X días"
 */
export function formatAge(birthDate: string | Date | undefined) {
    if (!birthDate) return '';

    const now = dayjs();
    const birth = dayjs(birthDate);
    const years = now.diff(birth, 'year');

    if (years >= 1) {
        return years === 1 ? '1 año' : `${years} años`;
    }

    const months = now.diff(birth, 'month');
    if (months >= 2) {
        return `${months} meses`;
    }

    const days = now.diff(birth, 'day');
    return days === 1 ? '1 día' : `${days} días`;
}

/**
 * Returns the "start of tomorrow" in UTC.
 * Useful for querying ranges internally.
 */
export function getTomorrowRange() {
    const tomorrow = dayjs().add(1, 'day').utc();
    return {
        start: tomorrow.startOf('day').toDate(),
        end: tomorrow.endOf('day').toDate()
    };
}

// Export raw dayjs if absolutely needed for complex calculations not covered here
export { dayjs };
