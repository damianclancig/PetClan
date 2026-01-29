
import { getVaccineStatus, VaccineSlot } from '../src/utils/vaccinationUtils';
import { IHealthRecord } from '../src/models/HealthRecord';
import dayjs from 'dayjs';
import { Types } from 'mongoose';

// Slot definition
const externalSlot: VaccineSlot = {
    id: 'pup_external',
    label: 'Control Pulgas/Garrapatas',
    ageLabel: 'Mensual / Según Producto',
    minAgeWeeks: 8,
    maxAgeWeeks: 1000,
    vaccineType: ['pipeta', 'pulgas', 'garrapatas', 'bravecto', 'nexgard', 'simparica', 'external', 'externa'],
    isCore: false
};

// Simulation Date: 2026-01-26
const today = dayjs('2026-01-26');
// Monkey patch dayjs() to return our fixed date for testing logic if it uses dayjs() internally without args
// But our utils use `dayjs()` inside. 
// A better approach is to rely on 'daysUntilDue' logic which creates diff from 'now'.
// Since I cannot easily mock dayjs() inside the imported module without a library, 
// I will just rely on the fact that I am running this ON the system where 'now' IS 2026-01-26 (as per metadata).
// Double check metadata: "The current local time is: 2026-01-26" -> Great.

const mockRecord = (title: string, dateStr: string): IHealthRecord => ({
    _id: new Types.ObjectId(),
    petId: new Types.ObjectId(),
    type: 'deworming',
    dewormingType: 'external',
    title: title,
    appliedAt: dayjs(dateStr).toDate(),
    createdBy: new Types.ObjectId(),
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date()
} as any);

const runTest = (title: string, appliedDate: string, expectedStatus: string) => {
    console.log(`Test: "${title}" applied on ${appliedDate}`);
    const records = [mockRecord(title, appliedDate)];

    // Age of pet doesn't matter much for external as long as it's > 8 weeks.
    // Let's say pet born 2025-01-01 (1 year old)
    const birthDate = dayjs('2025-01-01').toDate();

    const result = getVaccineStatus(externalSlot, birthDate, records);

    console.log(`Result Status: ${result.status}`);
    console.log(`Expected:      ${expectedStatus}`);
    console.log(result.status === expectedStatus ? 'PASS' : 'FAIL');
    console.log('---');
};

console.log('--- Debugging External Deworming ---');

// Case 1: The user report. "comprimido de 90 días" on 07/12/2025 (Dec 7).
// If logic is flawed (default 30 days), it expired Jan 6. Status: Overdue.
// If logic is fixed (90 days), it expires Mar 7. Status: Completed/Current.
runTest('Comprimido 90 días', '2025-12-07', 'completed');

// Case 2: Explicit "Bravecto" on same date. Should pass if logic works for keyword.
runTest('Bravecto', '2025-12-07', 'completed');

// Case 3: "Pipeta" (30 days) on same date. Should be overdue.
runTest('Pipeta', '2025-12-07', 'overdue');
