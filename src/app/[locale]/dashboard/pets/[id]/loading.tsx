import { PetProfileSkeleton } from '@/components/ui/Skeletons';
import { PageContainer } from '@/components/layout/PageContainer';

export default function Loading() {
    return (
        <PageContainer>
            <PetProfileSkeleton />
        </PageContainer>
    );
}
