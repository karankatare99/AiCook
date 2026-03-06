import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          await prisma.user.upsert({
            where: { email: user.email },
            update: { name: user.name!, profile: user.image },
            create: {
              name: user.name!,
              email: user.email,
              profile: user.image,
            }
          });
        } catch (e) {
          return false;
        }
      }
      return true;
    },
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);