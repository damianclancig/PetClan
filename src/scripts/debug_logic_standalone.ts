
const dayjs = require('dayjs');

// --- MOCK DATA ---

const VACCINES = {
    sextuple_canina: { id: 'sextuple_canina', name: 'Séxtuple / Óctuple', type: 'core', description: 'Parvovirus...', intervalDays: 365 },
    antirrabica: { id: 'antirrabica', name: 'Antirrábica', type: 'mandatory', description: 'Obligatoria', intervalDays: 365 },
};

const VACCINATION_SCHEDULE = {
    dog: {
        puppy: [
            { ageDays: 45, vaccineId: 'sextuple_canina', doseNumber: 1, mandatory: true },
            { ageDays: 60, vaccineId: 'sextuple_canina', doseNumber: 2, mandatory: true },
        ],
        adult: []
    }
};

// --- LOGIC UNDER TEST ---

function getVaccinationStatus(pet, healthRecords) {
    const birthDate = dayjs(pet.birthDate);
    const today = dayjs();
    const species = pet.species;

    // ... Simplified map logic ...
    const vaccineStatusMap = { 'sextuple_canina': { count: 0 }, 'antirrabica': { count: 0 } };

    const youngSchedule = VACCINATION_SCHEDULE.dog.puppy;
    const schedule = [];

    youngSchedule.forEach((event) => {
        const dueDate = birthDate.add(event.ageDays, 'day');
        let status = 'pending';

        if (vaccineStatusMap[event.vaccineId].count >= event.doseNumber) {
            status = 'applied';
        } else {
            // Updated logic from vaccinationLogic.ts
            if (dayjs(dueDate).isBefore(today.subtract(14, 'day'))) {
                // skipping complicated overdue logic for simplicity as we test UPCOMING
            }

            // Check details
            if (dayjs(dueDate).isBefore(today.subtract(7, 'day'))) {
                status = 'overdue';
            } else if (dueDate.diff(today, 'day') <= 30) {
                status = 'upcoming';
            }
        }

        schedule.push({
            vaccineName: VACCINES[event.vaccineId].name,
            dueDate: dueDate.toDate(),
            status: status,
            doseNumber: event.doseNumber
        });
    });

    return schedule;
}

// --- EXECUTION ---

// Case: Pet born 43 days ago.
// 45 days dose is due in 2 days.
const today = dayjs();
const birthDate = today.subtract(43, 'day').toDate();

const mockPet = {
    birthDate: birthDate,
    species: 'dog'
};

console.log('--- TEST ---');
console.log('Today:', today.format('YYYY-MM-DD'));
console.log('Birth:', dayjs(birthDate).format('YYYY-MM-DD'));

const result = getVaccinationStatus(mockPet, []);

result.forEach(r => {
    const diff = dayjs(r.dueDate).diff(today, 'day');
    console.log(`[${r.status.toUpperCase()}] ${r.vaccineName} #${r.doseNumber} | Due: ${dayjs(r.dueDate).format('YYYY-MM-DD')} (Diff: ${diff})`);
});
