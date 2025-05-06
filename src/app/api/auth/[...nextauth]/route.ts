import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "./../../../../lib/models/User";
import connectToDatabase from "./../../../../lib/mongodb";
import jwt from "jsonwebtoken";

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                await connectToDatabase();

                let existingUser = await User.findOne({ email: profile.email });
                if (!existingUser) {
                    existingUser = await User.create({
                        fullName: profile.name,
                        email: profile.email,
                        verified: true,
                        [`${account.provider}Id`]: profile.sub,
                    });
                }

                const token = jwt.sign(
                    {
                        userId: existingUser._id,
                        email: existingUser.email,
                        name: existingUser.fullName
                    },
                    process.env.JWT_SECRET!,
                    { expiresIn: '7d' }
                );

                // Store token in user object
                user.customToken = token;
                return true;
            } catch (error) {
                console.error("Sign in error:", error);
                return false;
            }
        },
        async redirect({ url, baseUrl }) {
            // Always redirect to dashboard after authentication
            return `${baseUrl}/dashboard`;
        },

        async session({ session, token }) {
            // Pass the custom token to the session
            if (token.customToken) {
                session.customToken = token.customToken;
            }
            return session;
        },

        async jwt({ token, user, account }) {
            // Pass the custom token from user to JWT token
            if (user?.customToken) {
                token.customToken = user.customToken;
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };