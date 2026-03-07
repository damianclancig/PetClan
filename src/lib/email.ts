import { IUser } from '@/models/User';
import https from 'https';

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

/**
 * Genera el layout base para todos los correos de PetClan.
 * Asegura consistencia visual, logo premium y footer legal.
 */
function getEmailLayout(content: string) {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://petclan.com.ar';
    const logoUrl = 'https://res.cloudinary.com/dqh1coa3c/image/upload/v1770054971/PetClan/Logo_PetClan_h9vtjo.png';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #334155; 
            margin: 0; 
            padding: 0; 
            background-color: #f8fafc; 
        }
        .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: #ffffff; 
            border-radius: 16px; 
            overflow: hidden; 
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
            border: 1px solid #e2e8f0; 
        }
        .header { 
            padding: 40px 20px; 
            text-align: center; 
            background-color: #ffffff; 
            border-bottom: 1px solid #f1f5f9; 
        }
        .logo { 
            max-width: 280px; 
            height: auto; 
        }
        .content { 
            padding: 40px 35px; 
        }
        .footer { 
            padding: 35px; 
            text-align: center; 
            background-color: #f1f5f9; 
            color: #64748b; 
            font-size: 13px; 
        }
        .footer a { 
            color: #0d9488; 
            text-decoration: none; 
            margin: 0 10px; 
            font-weight: 600; 
        }
        h1, h2, h3 { 
            color: #0f172a; 
            margin-top: 0; 
            font-weight: 700;
        }
        p { 
            margin-bottom: 1.5em; 
            font-size: 16px;
        }
        .btn { 
            display: inline-block; 
            background-color: #0d9488; 
            color: #ffffff !important; 
            padding: 14px 32px; 
            text-decoration: none; 
            border-radius: 10px; 
            font-weight: 600; 
            font-size: 16px; 
            box-shadow: 0 4px 6px -1px rgba(13, 148, 136, 0.2);
        }
        .card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
        }
        .text-dimmed { color: #64748b; }
        .divider { border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${logoUrl}" alt="PetClan" class="logo">
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p style="margin-bottom: 15px; font-weight: 500;">PetClan — Tu manada, conectada.</p>
            <p style="margin-bottom: 20px;">&copy; ${new Date().getFullYear()} PetClan. Todos los derechos reservados.</p>
            <div>
                <a href="${baseUrl}/terms">Términos y Condiciones</a>
                <span style="color: #cbd5e1;">&bull;</span>
                <a href="${baseUrl}/privacy-policy">Política de Privacidad</a>
            </div>
        </div>
    </div>
</body>
</html>
    `;
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

    let retries = 3;
    while (retries > 0) {
        try {
            if (!apiKey) throw new Error('MAILEROO_API_KEY is missing');

            const postData = JSON.stringify(payload);

            const result = await new Promise<{ success: boolean; data?: any }>((resolve, reject) => {
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Api-Key': apiKey,
                        'Content-Length': Buffer.byteLength(postData),
                    },
                    timeout: 30000, // 30s
                };

                const req = https.request(MAILEROO_API_URL, options, (res) => {
                    let body = '';
                    res.on('data', (chunk) => (body += chunk));
                    res.on('end', () => {
                        try {
                            resolve(JSON.parse(body));
                        } catch (e) {
                            reject(new Error('Invalid JSON response from Maileroo'));
                        }
                    });
                });

                req.on('error', (err) => reject(err));
                req.on('timeout', () => {
                    req.destroy();
                    reject(new Error('ETIMEDOUT'));
                });

                req.write(postData);
                req.end();
            });

            if (!result.success) {
                console.error('Maileroo API Error:', result);
                return false;
            }

            console.log(`[Maileroo] Email enviado exitosamente a ${toEmail}`);
            return true;

        } catch (error: any) {
            console.error(`Error sending email with Maileroo (Attempts left: ${retries - 1}):`, error.message || error);
            retries--;
            if (retries === 0) return false;
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    return false;
}

export async function sendWelcomeEmail(user: { email: string; name: string }) {
    const subject = '¡Bienvenido a PetClan! 🐾';
    const content = `
        <h1 style="color: #0d9488;">¡Hola ${user.name}!</h1>
        <p>Gracias por unirte a <strong>PetClan</strong>, la libreta sanitaria digital definitiva para tus mascotas.</p>
        <p>A partir de ahora, tienes el control total para:</p>
        <ul style="padding-left: 20px; color: #475569;">
            <li type="circle" style="margin-bottom: 8px;">Registrar y gestionar todos tus peludos en un solo lugar.</li>
            <li type="circle" style="margin-bottom: 8px;">Llevar el control riguroso de vacunas y desparasitaciones.</li>
            <li type="circle" style="margin-bottom: 8px;">Recibir recordatorios inteligentes para que nunca se te pase una dosis.</li>
        </ul>
        <div class="card">
            <p style="margin: 0; font-weight: 500; text-align: center;">¡Esperamos que disfrutes la experiencia y tus mascotas también!</p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="btn">Ir a mi Dashboard</a>
        </div>
    `;

    return sendMailerooEmail(user.email, user.name, subject, getEmailLayout(content));
}

export async function sendReminderEmail(
    user: { email: string; name: string },
    petName: string,
    recordTitle: string,
    date: Date
) {
    const subject = `Recordatorio para ${petName}: ${recordTitle} 📅`;
    const dateStr = date.toLocaleDateString('es-AR', { dateStyle: 'long' });

    const content = `
        <h2 style="color: #d97706;">Recordatorio de Salud</h2>
        <p>Hola <strong>${user.name}</strong>,</p>
        <p>Te recordamos que se acerca una fecha importante para el cuidado de <strong>${petName}</strong>:</p>
        
        <div class="card" style="border-left: 4px solid #d97706;">
            <h3 style="margin: 0; color: #111;">${recordTitle}</h3>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Fecha: <strong>${dateStr}</strong></p>
        </div>
        
        <p>Es fundamental mantener al día estas actividades para garantizar el bienestar de tu mascota.</p>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="btn" style="background-color: #d97706; box-shadow: 0 4px 6px -1px rgba(217, 119, 6, 0.2);">Ver Pendientes</a>
        </div>
    `;

    return sendMailerooEmail(user.email, user.name, subject, getEmailLayout(content));
}

export async function sendPetUpdateEmail(
    user: { email: string; name: string },
    petName: string,
    updatedBy: string,
    modifiedFields: { label: string; value: string }[] = []
) {
    const subject = `Actualización en el perfil de ${petName} 🐾`;

    let changesHtml = '';
    if (modifiedFields.length > 0) {
        changesHtml = `
            <div style="margin-top: 25px; padding: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #475569; font-weight: bold;">DETALLE DE CAMBIOS:</p>
                ${modifiedFields.map(field => `
                    <p style="margin: 5px 0; font-size: 14px; border-bottom: 1px solid #f1f5f9; padding-bottom: 5px;">
                        <span style="color: #64748b;">${field.label}:</span> 
                        <strong style="color: #1e293b;">${field.value}</strong>
                    </p>
                `).join('')}
            </div>
        `;
    }

    const content = `
        <h2 style="color: #0d9488;">Cambios en el perfil</h2>
        <p>Hola <strong>${user.name}</strong>,</p>
        <p>Te informamos que <strong>${updatedBy}</strong> ha realizado cambios en el perfil de tu mascota compartida, <strong>${petName}</strong>.</p>
        
        ${changesHtml}

        <div class="card" style="margin-top: 20px; padding: 15px; background-color: #fffbeb; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">Puedes revisar los detalles actualizados y el historial médico desde tu panel de control.</p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="btn" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Ver Perfil de ${petName}</a>
        </div>
    `;

    return sendMailerooEmail(user.email, user.name, subject, getEmailLayout(content));
}

export async function sendInvitationEmail(
    toEmail: string,
    inviterName: string,
    petName: string,
    invitationUrl: string
) {
    const subject = `¡${inviterName} te invitó a unirte a PetClan! 🐾`;
    const actionUrl = invitationUrl || `${process.env.NEXTAUTH_URL}/login`;

    const content = `
        <h1 style="color: #0d9488; font-size: 24px;">¡Has sido invitado a PetClan!</h1>
        <p>Hola,</p>
        <p><strong>${inviterName}</strong> quiere compartir contigo el cuidado de <strong>${petName}</strong>. Al aceptar esta invitación, podrán gestionar juntos el historial médico, vacunas y recordatorios de la mascota.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${actionUrl}" class="btn">
                Ver Invitación
            </a>
        </div>
        
        <p style="font-size: 14px; color: #64748b; background: #f1f5f9; padding: 15px; border-radius: 8px;">
            <strong>Nota:</strong> Si ya tienes una cuenta con otro correo, pídele a ${inviterName} que te reenvíe la invitación a esa dirección.
        </p>
    `;

    return sendMailerooEmail(toEmail, 'Futuro Usuario', subject, getEmailLayout(content));
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

    const content = `
        <h2 style="color: #0d9488;">Nuevo Registro Médico</h2>
        <p>Hola <strong>${toName}</strong>,</p>
        <p><strong>${createdBy}</strong> ha agregado una nueva entrada a la historia clínica de <strong>${petName}</strong>.</p>
        
        <div class="card">
            <p style="margin: 0; color: #0d9488; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">${recordType}</p>
            <h3 style="margin: 8px 0 0 0; color: #1e293b; font-size: 20px;">${recordTitle}</h3>
        </div>

        <p>Mantener el historial actualizado es clave para la salud a largo plazo de tus mascotas.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" class="btn">
                Ver Historia Clínica
            </a>
        </div>
    `;

    return sendMailerooEmail(toEmail, toName, subject, getEmailLayout(content));
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

    const statusColor = accepted ? '#0d9488' : '#e11d48';

    const content = `
        <h2 style="color: ${statusColor};">
            Invitación ${accepted ? 'Aceptada' : 'Rechazada'}
        </h2>
        <p>Hola <strong>${inviterName}</strong>,</p>
        <p>
            <strong>${inviteeName}</strong> ha ${accepted ? 'aceptado' : 'rechazado'} 
            la invitación para colaborar en el cuidado de <strong>${petName}</strong>.
        </p>
        
        ${accepted ? `
        <div class="card">
            <p style="margin: 0;">¡Excelente noticia! Ahora ambos pueden visualizar y gestionar el perfil de <strong>${petName}</strong>.</p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="btn">Ir al Dashboard</a>
        </div>
        ` : `
        <div class="card" style="border-left: 4px solid #e11d48;">
            <p style="margin: 0;">Si crees que esto fue un error, puedes intentar enviar la invitación nuevamente desde los ajustes de la mascota.</p>
        </div>
        `}
    `;

    return sendMailerooEmail(inviterEmail, inviterName, subject, getEmailLayout(content));
}

export async function sendRemovalRequestEmail(
    toEmail: string,
    toName: string,
    requesterName: string,
    petName: string,
    requestUrl: string
) {
    const subject = `Solicitud de baja para ${petName} ⚠️`;
    const content = `
        <h2 style="color: #e11d48;">Solicitud de Baja</h2>
        <p>Hola <strong>${toName}</strong>,</p>
        <p><strong>${requesterName}</strong> ha solicitado que dejes de ser copropietario de <strong>${petName}</strong>.</p>
        <div class="card" style="border-left: 4px solid #e11d48;">
            <p style="margin: 0;">Esta acción requiere tu validación. Por favor, revisa la solicitud para aceptar o rechazar el cambio.</p>
        </div>
        
        <div style="text-align: center; margin-top: 35px;">
            <a href="${requestUrl}" class="btn" style="background-color: #e11d48; box-shadow: 0 4px 6px -1px rgba(225, 29, 72, 0.2);">
                Revisar Solicitud
            </a>
        </div>
    `;
    return sendMailerooEmail(toEmail, toName, subject, getEmailLayout(content));
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

    const statusColor = accepted ? '#0d9488' : '#e11d48';

    const content = `
        <h2 style="color: ${statusColor};">Solicitud ${accepted ? 'Aceptada' : 'Rechazada'}</h2>
        <p>Hola <strong>${toName}</strong>,</p>
        <p><strong>${responderName}</strong> ha ${accepted ? 'aceptado' : 'rechazado'} tu solicitud para dejar de ser dueño de <strong>${petName}</strong>.</p>
        
        <div class="card">
            <p style="margin: 0;">${accepted
            ? `${responderName} ya no tiene acceso a la mascota.`
            : `${responderName} sigue manteniendo el acceso como copropietario.`
        }</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="btn">Ir al Dashboard</a>
        </div>
    `;
    return sendMailerooEmail(toEmail, toName, subject, getEmailLayout(content));
}

export async function sendOwnerLeftEmail(
    toEmail: string,
    toName: string,
    leaverName: string,
    petName: string
) {
    const subject = `${leaverName} dejó de compartir a ${petName} 🚶`;
    const content = `
        <h2 style="color: #0d9488;">Cambio en el equipo de cuidado</h2>
        <p>Hola <strong>${toName}</strong>,</p>
        <p>Te informamos que <strong>${leaverName}</strong> ha decidido dejar de compartir la mascota <strong>${petName}</strong> voluntariamente.</p>
        <div class="card">
            <p style="margin: 0;">No te preocupes, tú sigues manteniendo el acceso y control total sobre el perfil y los registros médicos.</p>
        </div>
    `;
    return sendMailerooEmail(toEmail, toName, subject, getEmailLayout(content));
}
