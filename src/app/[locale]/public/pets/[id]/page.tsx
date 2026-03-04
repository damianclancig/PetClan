import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';
import User from '@/models/User';
import HealthRecord from '@/models/HealthRecord';
import { notFound } from 'next/navigation';
import { calculateVaccineStatus } from '@/lib/healthUtils';
import { getTranslations, getMessages } from 'next-intl/server';
import PublicPetProfile from '@/components/public-pet/PublicPetProfile';

// Ensure User is registered to prevent MissingSchemaError on populate
if (!User) {
    console.warn("User model not loaded.");
}

export const dynamic = 'force-dynamic';

export default async function PublicPetPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
    const { id } = await params;

    await dbConnect();

    let pet;
    let rawRecords: any[] = [];
    let ownersList: any[] = [];

    try {
        pet = await Pet.findById(id).populate('owners', 'name image email');
        if (pet) {
            rawRecords = await HealthRecord.find({
                petId: id,
                type: { $in: ['vaccine', 'deworming'] }
            }).sort({ appliedAt: -1 }).lean();
            ownersList = JSON.parse(JSON.stringify(pet.owners || []));
        }
    } catch (e) {
        console.error("Error fetching pet data:", e);
        notFound();
    }

    if (!pet) {
        notFound();
    }

    const petData = JSON.parse(JSON.stringify(pet));
    const vaccineStatus = calculateVaccineStatus(rawRecords);
    const healthRecords = JSON.parse(JSON.stringify(
        rawRecords
            .filter(r => ['vaccine', 'deworming'].includes(r.type))
            .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
            .slice(0, 30)
    ));

    return (
        <PublicPetProfile
            pet={petData}
            owners={ownersList}
            vaccineStatus={vaccineStatus}
            healthRecords={healthRecords}
        />
    );
}
