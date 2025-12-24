import { getVaccinationStatus } from '../utils/vaccinationLogic';
import dayjs from 'dayjs';

// Mock Pet: Born 43 days ago
// Vaccine due at 45 days (Sextuple 1st Dose)
// Due Date = Born + 45 = (Today - 43) + 45 = Today + 2 days
const today = dayjs();
const birthDate = today.subtract(43, 'day').toDate();

const mockPet = {
    _id: 'debug-pet-id',
    name: 'Puppy Debug',
    species: 'dog',
    birthDate: birthDate,
    gender: 'male',
    users: [],
    owners: [],
    createdAt: new Date(),
    updatedAt: new Date()
};

const mockRecords: any[] = [];

console.log('--- DEBUG VACCINATION STATUS ---');
console.log(`Today: ${today.format('YYYY-MM-DD')}`);
console.log(`BirthDate: ${dayjs(birthDate).format('YYYY-MM-DD')}`);

const status = getVaccinationStatus(mockPet as any, mockRecords);

console.log('\n--- RESULTS ---');
status.forEach(item => {
    const diff = dayjs(item.dueDate).diff(today, 'day');
    console.log(`[${item.status.toUpperCase()}] ${item.vaccineName} dose #${item.doseNumber}`);
    console.log(`   Due: ${dayjs(item.dueDate).format('YYYY-MM-DD')} (Diff: ${diff} days)`);
});
