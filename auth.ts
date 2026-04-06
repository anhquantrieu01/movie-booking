import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import { Role } from "./generated/prisma/enums";
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        return token;
      }

      if (!token.email) return token;

      const dbUser = await prisma.user.findUnique({
        where: { email: token.email },
        select: { role: true },
      });

      if (dbUser) {
        token.role = dbUser.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token?.role) {
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
});
