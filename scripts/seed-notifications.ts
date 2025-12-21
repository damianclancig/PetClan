import dbConnect from '../src/lib/mongodb';
import Notification from '../src/models/Notification';
import User from '../src/models/User';

async function main() {
    await dbConnect();

    // Find a user - picking the first one or a specific one if known
    const user = await User.findOne({});
    if (!user) {
        console.error('No users found to test notifications');
        return;
    }

    console.log(`Seeding notifications for user: ${user.name} (${user.email})`);

    const notifications = [
        {
            userId: user._id,
            type: 'health',
            title: 'Vacuna Vencida',
            message: 'La vacuna Antirrábica de Thor venció ayer. ¡Es importante renovarla!',
            link: '/dashboard/pets',
            isRead: false,
            createdAt: new Date()
        },
        {
            userId: user._id,
            type: 'social',
            title: 'Nuevo Registro',
            message: 'Maria agregó "Consulta General" al historial de Luna.',
            link: '/dashboard/pets',
            isRead: false,
            createdAt: new Date(Date.now() - 3600000) // 1 hour ago
        },
        {
            userId: user._id,
            type: 'invitation',
            title: 'Invitación Recibida',
            message: 'Pedro te invitó a colaborar con "Max". Revisala ahora.',
            link: '/invitations/test-token',
            isRead: true, // Functionally read
            createdAt: new Date(Date.now() - 86400000) // 1 day ago
        },
        {
            userId: user._id,
            type: 'social',
            title: '¡Feliz Cumpleaños! 🎂',
            message: 'Hoy es el cumpleaños de Rocco. ¡Dale un abrazo!',
            link: '/dashboard',
            isRead: false
        }
    ];

    await Notification.insertMany(notifications);
    console.log('✅ Created 4 test notifications.');
    process.exit(0);
}

main().catch(console.error);
