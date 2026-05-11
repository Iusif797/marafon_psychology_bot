import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db/client";
import { adminAccounts } from "@/lib/db/schema";
import { verifyLegacyHash } from "@/lib/auth-legacy";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const [account] = await db
          .select()
          .from(adminAccounts)
          .where(eq(adminAccounts.email, email.toLowerCase()))
          .limit(1);
        if (!account) return null;
        const ok =
          (await bcrypt.compare(password, account.passwordHash).catch(() => false)) ||
          verifyLegacyHash(password, account.passwordHash);
        if (!ok) return null;
        return { id: String(account.id), email: account.email, name: account.name ?? undefined };
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth }) => Boolean(auth?.user),
  },
});
