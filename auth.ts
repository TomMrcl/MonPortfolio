import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // C'est ici qu'on vérifie que c'est bien toi
      // Si l'email ne correspond pas au tien → accès refusé
      return user.email === process.env.ADMIN_EMAIL
    },
  },
})