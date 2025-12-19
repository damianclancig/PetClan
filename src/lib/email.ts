import { IUser } from '@/models/User';

const MAILEROO_API_URL = 'https://smtp.maileroo.com/api/v2/emails';

interface EmailAddress {
    address: string;
    display_name: string;
}

interface AttachmentObject {
    file_name: string;
    content_type?: string;
    content: string; // Base64
    inline?: boolean;
}

interface MailerooPayload {
    from: EmailAddress;
    to: EmailAddress[];
    subject: string;
    html: string;
    plain?: string;
    tracking?: boolean;
    attachments?: AttachmentObject[];
}

export async function sendMailerooEmail(
    toEmail: string,
    toName: string,
    subject: string,
    htmlContent: string
): Promise<boolean> {
    const apiKey = process.env.MAILEROO_API_KEY;
    const fromEmail = process.env.MAILEROO_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
        console.error('Maileroo configuration missing');
        return false;
    }

    const payload: MailerooPayload = {
        from: {
            address: fromEmail,
            display_name: 'PetClan',
        },
        to: [
            {
                address: toEmail,
                display_name: toName,
            },
        ],
        subject: subject,
        html: htmlContent,
        tracking: true,
    };

    try {
        const response = await fetch(MAILEROO_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': apiKey,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!data.success) {
            console.error('Maileroo API Error:', data);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error sending email with Maileroo:', error);
        return false;
    }
}

export async function sendWelcomeEmail(user: { email: string; name: string }) {
    const subject = '¡Bienvenido a PetClan! 🐾';
    const html = `
        <div style="font-family: sans-serif; color: #333;">
            <h1 style="color: #0d9488;">¡Hola ${user.name}!</h1>
            <p>Gracias por unirte a <strong>PetClan</strong>, la libreta sanitaria digital para tus mascotas.</p>
            <p>Ahora podrás:</p>
            <ul>
                <li>Registrar a tus mascotas.</li>
                <li>Llevar el control de sus vacunas.</li>
                <li>Recibir recordatorios importantes.</li>
            </ul>
            <p style="margin-top: 20px;">¡Esperamos que disfrutes la experiencia!</p>
            <hr />
            <small>El equipo de PetClan</small>
        </div>
    `;

    return sendMailerooEmail(user.email, user.name, subject, html);
}

// TODO: Define strict types for Pet and HealthRecord if available models are imported
export async function sendReminderEmail(
    user: { email: string; name: string },
    petName: string,
    recordTitle: string,
    date: Date
) {
    const subject = `Recordatorio para ${petName}: ${recordTitle} 📅`;
    const dateStr = date.toLocaleDateString('es-AR', { dateStyle: 'long' });

    const html = `
        <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: #d97706;">Recordatorio PetClan</h2>
            <p>Hola <strong>${user.name}</strong>,</p>
            <p>Te recordamos que se acerca una fecha importante para <strong>${petName}</strong>:</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0; color: #111;">${recordTitle}</h3>
                <p style="margin: 5px 0 0 0;">Fecha: <strong>${dateStr}</strong></p>
            </div>
            <p>¡No olvides registrar la actividad una vez realizada!</p>
            <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ir a mi Dashboard</a>
        </div>
    `;

    return sendMailerooEmail(user.email, user.name, subject, html);
}

export async function sendPetUpdateEmail(
    user: { email: string; name: string },
    petName: string,
    updatedBy: string
) {
    const subject = `Actualización en el perfil de ${petName} 🐾`;
    const html = `
        <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: #0d9488;">Actualización de Mascota</h2>
            <p>Hola <strong>${user.name}</strong>,</p>
            <p>Te informamos que <strong>${updatedBy}</strong> ha realizado cambios en el perfil de tu mascota compartida, <strong>${petName}</strong>.</p>
            <p>Puedes ver los detalles actualizados en tu panel.</p>
            <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Ir al Dashboard</a>
            <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
            <small style="color: #666;">PetClan - Tus mascotas, conectadas.</small>
        </div>
    `;

    return sendMailerooEmail(user.email, user.name, subject, html);
}

export async function sendInvitationEmail(
    toEmail: string,
    inviterName: string,
    petName: string
) {
    const subject = `¡${inviterName} te invitó a unirte a PetClan! 🐾`;
    const signupUrl = `${process.env.NEXTAUTH_URL}/register`; // Assuming register page or just login

    const html = `
        <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: #0d9488;">¡Has sido invitado a PetClan!</h2>
            <p>Hola,</p>
            <p><strong>${inviterName}</strong> quiere compartir contigo el cuidado de su mascota <strong>${petName}</strong> en PetClan.</p>
            <p>Para poder acceder y gestionar la ficha de esta mascota, necesitas activar tu cuenta.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${signupUrl}" style="background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                    Crear mi cuenta en PetClan
                </a>
            </div>
            
            <p style="font-size: 0.9em; color: #666;">Si ya tienes una cuenta con otro correo, pídele a ${inviterName} que te envíe la invitación a ese correo.</p>
            <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
            <small style="color: #666;">PetClan - Tus mascotas, conectadas.</small>
        </div>
    `;

    // We don't have the user's name, so we use empty string or a placeholder
    return sendMailerooEmail(toEmail, 'Futuro Usuario', subject, html);
}
