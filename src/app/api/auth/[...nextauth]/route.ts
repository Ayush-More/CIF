import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import User from "./../../../../lib/models/User";
import connectToDatabase from "./../../../../lib/mongodb";
import jwt from "jsonwebtoken";

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID!,
            clientSecret: process.env.FACEBOOK_SECRET!,
        }),
    ],

    callbacks: {
        // async signIn({ user, account, profile }) {
        //     await connectToDatabase();

        //     let existingUser = await User.findOne({ email: profile.email });

        //     if (!existingUser) {
        //         existingUser = await User.create({
        //             fullName: profile.name,
        //             email: profile.email,
        //             verified: true,
        //             [`${account.provider}Id`]: profile.id || profile.sub,
        //         });
        //     }

        //     // Create custom JWT
        //     const token = jwt.sign(
        //         { userId: existingUser._id, email: existingUser.email },
        //         process.env.JWT_SECRET!,
        //         { expiresIn: '7d' }
        //     );

        //     // Store token in the account object for use in the redirect callback
        //     account.token = token;

        //     return true;
        // },

        // async redirect({ url, baseUrl, account }) {
        //     if (account?.token) {
        //         return `${baseUrl}/api/auth/set-cookie?token=${account.token}`;
        //     }
        //     return url.startsWith("/") ? `${baseUrl}${url}` : url;
        // },

        // async jwt({ token, user }) {
        //     if (user) {
        //         token.id = user.id || user._id; // Ensure user ID is set correctly
        //         token.email = user.email;
        //     }
        //     return token;
        // },

        // async session({ session, token }) {
        //     session.user.id = token.id;
        //     return session;
        // },
        async signIn({ user, account, profile }) {
            try {
                await connectToDatabase();

                // Find or create user
                let existingUser = await User.findOne({ email: profile.email });
                if (!existingUser) {
                    existingUser = await User.create({
                        fullName: profile.name,
                        email: profile.email,
                        verified: true,
                        [`${account.provider}Id`]: profile.sub, // Changed from profile.id to profile.sub for Google
                    });
                }

                // Create JWT token
                const token = jwt.sign(
                    {
                        userId: existingUser._id,
                        email: existingUser.email,
                        name: existingUser.fullName
                    },
                    process.env.JWT_SECRET!,
                    { expiresIn: '7d' }
                );

                // Store token for use in redirect callback
                account.token = token;
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

        async jwt({ token, user, account }) {
            if (account?.token) {
                token.customToken = account.token;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub;
                session.customToken = token.customToken;
            }
            return session;
        },
    },
    site: 'https://careforindians.com',
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };