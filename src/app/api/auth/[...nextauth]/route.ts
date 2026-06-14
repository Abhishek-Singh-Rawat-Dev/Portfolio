import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_client_secret",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const allowedAdmin = "abhishekpersona1402@gmail.com";
      if (user.email === allowedAdmin) {
        return true;
      }
      return false; // Block anyone else from signing in
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_local_dev",
});

export { handler as GET, handler as POST };
