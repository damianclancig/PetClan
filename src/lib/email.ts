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
    petName: string,
    invitationUrl: string
) {
    const subject = `¡${inviterName} te invitó a unirte a PetClan! 🐾`;

    // Fallback if empty, though caller should provide it
    const actionUrl = invitationUrl || `${process.env.NEXTAUTH_URL}/login`;

    const html = `
        <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: #0d9488;">¡Has sido invitado a PetClan!</h2>
            <p>Hola,</p>
            <p><strong>${inviterName}</strong> quiere compartir contigo el cuidado de su mascota <strong>${petName}</strong> en PetClan.</p>
            <p>Para poder acceder y gestionar la ficha de esta mascota, necesitas ingresar con tu cuenta.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${actionUrl}" style="background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                    Ver Invitación
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

export async function sendHealthRecordEmail(
    toEmail: string,
    toName: string,
    petName: string,
    recordType: string,
    recordTitle: string,
    createdBy: string,
    petId: string
) {
    const subject = `Nuevo registro médico para ${petName} 🩺`;
    const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard/pets/${petId}`;

    const html = `
        <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: #0d9488;">Nuevo Registro Médico</h2>
            <p>Hola <strong>${toName}</strong>,</p>
            <p><strong>${createdBy}</strong> ha agregado un nuevo registro a la historia clínica de <strong>${petName}</strong>.</p>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #666; font-size: 0.9em; text-transform: uppercase;">${recordType}</p>
                <h3 style="margin: 5px 0 0 0; color: #111;">${recordTitle}</h3>
            </div>

            <p>Puedes ver los detalles completos en el perfil de la mascota.</p>
            
            <div style="margin: 25px 0;">
                <a href="${dashboardUrl}" style="background: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Ver Historia Clínica
                </a>
            </div>
            
            <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
            <small style="color: #666;">PetClan - Tus mascotas, conectadas.</small>
        </div>
    `;

    return sendMailerooEmail(toEmail, toName, subject, html);
}

export async function sendInvitationResultEmail(
    inviterEmail: string,
    inviterName: string,
    inviteeName: string,
    petName: string,
    accepted: boolean
) {
    const subject = accepted
        ? `¡${inviteeName} aceptó tu invitación! 🎉`
        : `${inviteeName} rechazó tu invitación`;

    const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;

    const html = `
        <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: ${accepted ? '#0d9488' : '#e11d48'};">
                Invitación ${accepted ? 'Aceptada' : 'Rechazada'}
            </h2>
            <p>Hola <strong>${inviterName}</strong>,</p>
            <p>
                <strong>${inviteeName}</strong> ha ${accepted ? 'aceptado' : 'rechazado'} 
                la invitación para colaborar en el cuidado de <strong>${petName}</strong>.
            </p>
            
            ${accepted ? `
            <p>Ahora ambos tienen acceso al perfil y registros médicos de la mascota.</p>
            <div style="margin: 25px 0;">
                <a href="${dashboardUrl}" style="background: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Ir al Dashboard
                </a>
            </div>
            ` : ''}

            <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
            <small style="color: #666;">PetClan - Tus mascotas, conectadas.</small>
        </div>
    `;

    return sendMailerooEmail(inviterEmail, inviterName, subject, html);
}

export async function sendRemovalRequestEmail(
    toEmail: string,
    toName: string,
    requesterName: string,
    petName: string,
    requestUrl: string
) {
    const subject = `Solicitud de baja para ${petName} ⚠️`;
    const html = `
        <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: #e11d48;">Solicitud de Baja</h2>
            <p>Hola <strong>${toName}</strong>,</p>
            <p><strong>${requesterName}</strong> ha solicitado que dejes de ser copropietario de <strong>${petName}</strong>.</p>
            <p>Por favor, revisa la solicitud para aceptar o rechazar.</p>
            
            <div style="margin: 25px 0;">
                <a href="${requestUrl}" style="background: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Revisar Solicitud
                </a>
            </div>
            
            <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
            <small style="color: #666;">PetClan - Tus mascotas, conectadas.</small>
        </div>
    `;
    return sendMailerooEmail(toEmail, toName, subject, html);
}

export async function sendRemovalResultEmail(
    toEmail: string,
    toName: string,
    responderName: string,
    petName: string,
    accepted: boolean
) {
    const subject = accepted
        ? `Solicitud de baja ACEPTADA para ${petName} ✅`
        : `Solicitud de baja RECHAZADA para ${petName} ❌`;

    const html = `
        <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: ${accepted ? '#0d9488' : '#e11d48'};">Solicitud ${accepted ? 'Aceptada' : 'Rechazada'}</h2>
            <p>Hola <strong>${toName}</strong>,</p>
            <p><strong>${responderName}</strong> ha ${accepted ? 'aceptado' : 'rechazado'} tu solicitud para dejar de ser dueño de <strong>${petName}</strong>.</p>
            
            ${accepted ? `<p>${responderName} ya no tiene acceso a la mascota.</p>` : `<p>${responderName} sigue siendo copropietario.</p>`}
            
            <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
            <small style="color: #666;">PetClan - Tus mascotas, conectadas.</small>
        </div>
    `;
    return sendMailerooEmail(toEmail, toName, subject, html);
}

export async function sendOwnerLeftEmail(
    toEmail: string,
    toName: string,
    leaverName: string,
    petName: string
) {
    const subject = `${leaverName} dejó de compartir a ${petName} 🚶`;
    const html = `
        <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: #0d9488;">Cambio en Copropietarios</h2>
            <p>Hola <strong>${toName}</strong>,</p>
            <p>te informamos que <strong>${leaverName}</strong> ha dejado de compartir la mascota <strong>${petName}</strong> voluntariamente.</p>
            <p>Tú sigues teniendo acceso normal.</p>
            
            <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
            <small style="color: #666;">PetClan - Tus mascotas, conectadas.</small>
        </div>
    `;
    return sendMailerooEmail(toEmail, toName, subject, html);
}
