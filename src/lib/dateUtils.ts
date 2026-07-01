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
 * Converts a stored date string (UTC midnight) to a local Date object preserving the calendar day.
 * Useful for component inputs like DatePicker or DateInput that operate in local time.
 */
export function toLocalDate(date: string | Date | undefined | null): Date | null {
    if (!date) return null;
    const d = dayjs(date).utc();
    return new Date(d.year(), d.month(), d.date());
}

/**
 * Parses a date value into a dayjs object, ensuring string dates preserve their calendar day.
 */
export function parseDate(date: string | Date | undefined | null) {
    if (!date) return null;
    if (typeof date === 'string') {
        const d = dayjs(date).utc();
        return dayjs(new Date(d.year(), d.month(), d.date()));
    }
    return dayjs(date);
}

/**
 * Formats a date for display (e.g. DD/MM/YYYY).
 * Forces UTC interpretation for string dates (which represent pure calendar dates) to avoid timezone shifts.
 */
export function formatDate(date: string | Date | undefined | null, format: string = DATE_FORMAT_DISPLAY) {
    if (!date) return '';
    if (typeof date === 'string') {
        return dayjs(date).utc().format(format);
    }
    return dayjs(date).format(format);
}

/**
 * Formats a date for input values (YYYY-MM-DD).
 * Useful for editing forms.
 */
export function formatDateForInput(date: string | Date | undefined | null) {
    if (!date) return '';
    return dayjs(date).utc().format(DATE_FORMAT_INPUT);
}

export function calculateAge(birthDate: string | Date) {
    const birthStr = typeof birthDate === 'string'
        ? dayjs(birthDate).utc().format('YYYY-MM-DD')
        : dayjs(birthDate).format('YYYY-MM-DD');
    const nowStr = dayjs().format('YYYY-MM-DD');
    return dayjs.utc(nowStr).diff(dayjs.utc(birthStr), 'year');
}

/**
 * Formats age dynamically (Fallback for backend/non-translated context):
 * - >= 1 year: "X años"
 * - >= 1 month & < 1 year: "X meses"
 * - < 1 month: "X días"
 */
export function formatAge(birthDate: string | Date | undefined) {
    if (!birthDate) return '';

    const { days, months, years } = getPetAge(birthDate);

    if (years >= 1) {
        return years === 1 ? '1 año' : `${years} años`;
    }

    if (days > 60) {
        return months === 1 ? '1 mes' : `${months} meses`;
    }

    return days === 1 ? '1 día' : `${days} días`;
}

/**
 * Formats age dynamically using provided translation function:
 * - >= 1 year: Translated "(Count) years"
 * - >= 1 month & < 1 year: Translated "(Count) months"
 * - < 1 month: Translated "(Count) days"
 */
export function formatAgeTranslated(birthDate: string | Date | undefined, t: (key: string, values?: any) => string) {
    if (!birthDate) return '';

    const { days, months, years } = getPetAge(birthDate);

    if (years >= 1) return t('ageYears', { count: years });
    if (days > 60) return t('ageMonths', { count: months });
    return t('ageDays', { count: days === 0 ? 1 : days });
}

/**
 * Calculates pet age in multiple units using Calendar Day logic (Start of Day).
 * Treats dates in UTC to avoid timezone shifts.
 */
export function getPetAge(birthDate: string | Date) {
    const birthStr = typeof birthDate === 'string'
        ? dayjs(birthDate).utc().format('YYYY-MM-DD')
        : dayjs(birthDate).format('YYYY-MM-DD');
    const nowStr = dayjs().format('YYYY-MM-DD');

    const birth = dayjs.utc(birthStr);
    const now = dayjs.utc(nowStr);

    // Calendar differences (ignoring time)
    const days = now.diff(birth, 'days');
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
