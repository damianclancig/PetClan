import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendWelcomeEmail } from '@/lib/email';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                await dbConnect();
                try {
                    const existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        await User.create({
                            name: user.name || 'Usuario',
                            email: user.email || '',
                            image: user.image || '',
                            role: 'OWNER',
                        });

                        // Enviar email de bienvenida de forma asíncrona (no bloqueante)
                        if (user.email && user.name) {
                            sendWelcomeEmail({ email: user.email, name: user.name }).catch(err =>
                                console.error('Error sending welcome email:', err)
                            );
                        }
                    }
                    return true;
                } catch (error) {
                    console.error('Error saving user to DB', error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user) {
                // Añadir role a la sesión si lo necesitamos
                // session.user.role = token.role; 
                // session.user.id = token.id;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                await dbConnect();
                const dbUser = await User.findOne({ email: user.email });
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.role = dbUser.role;
                }
            }
            return token;
        },
    },
    pages: {
        signIn: '/login',
    },
};
