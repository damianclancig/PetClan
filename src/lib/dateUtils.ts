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
    // Display in local time to match user's context (e.g. late night entries stored as next day UTC should show as today local)
    return dayjs(date).format(format);
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

    const { days, months, years } = getPetAge(birthDate);

    if (years >= 1) {
        return years === 1 ? '1 año' : `${years} años`;
    }

    if (months >= 2) {
        return `${months} meses`;
    }

    return days === 1 ? '1 día' : `${days} días`;
}

/**
 * Calculates pet age in multiple units using Calendar Day logic (Start of Day).
 * This ensures consistency: If born yesterday at 11PM and now is today 1AM, it is "1 day old".
 */
export function getPetAge(birthDate: string | Date) {
    const now = dayjs();
    const birth = dayjs(birthDate);

    // Calendar differences (ignoring time)
    const days = now.startOf('day').diff(birth.startOf('day'), 'days');
    const weeks = now.diff(birth, 'weeks');
    const months = now.diff(birth, 'months');
    const years = now.diff(birth, 'years');

    return { days, weeks, months, years };
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
