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
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem('auth_token', token)
                }

                // Store token in user object
                user.customToken = token;
                return true;
            } catch (error) {
                console.error("Sign in error:", error);
                return false;
            }
        },
        async redirect({ url, baseUrl, account }) {
            try {
                if (account?.token) {
                    // Redirect to set-cookie endpoint with token
                    return `${baseUrl}/api/auth/set-cookie?token=${account.token}`;
                }
                // Default redirect
                return url.startsWith(baseUrl) ? url : baseUrl;
            } catch (error) {
                console.error("Redirect error:", error);
                return baseUrl;
            }
        },

        async session({ session, token, user }) {
            // Pass the custom token to the session
            session.customToken = token.customToken;
            return session;
        },

        async jwt({ token, user }) {
            // Pass the custom token from user to JWT token
            if (user?.customToken) {
                token.customToken = user.customToken;
            }
            return token;
        }

    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };