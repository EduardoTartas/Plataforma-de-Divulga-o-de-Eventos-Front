import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";

/**
 * Função auxiliar para renovar o access token usando o refresh token.
 */
async function refreshAccessToken(token: JWT) {
  try {
    const res = await fetch(`${process.env.API_URL_SERVER_SIDED}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshtoken: token.refreshtoken }),
    });

    if (!res.ok) throw new Error("Falha ao renovar token");

    const json = await res.json();
    const data = json.data;

    return {
      ...token,
      accesstoken: data.accesstoken,
      refreshtoken: data.refreshtoken ?? token.refreshtoken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // ✅ 1 hora (ou data.expires_in se existir)
      user: data.usuario ?? token.user, // opcional, caso queira atualizar dados do usuário
    };
  } catch (err) {
    console.error("Erro ao renovar token:", err);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}



export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.senha) return null;

        const res = await fetch(`${process.env.API_URL_SERVER_SIDED}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            senha: credentials.senha,
          }),
        });

        if (!res.ok) return null;

        const json = await res.json();
        const data = json.data;

        if (data && data.user._id) {
          return {
            id: data.user._id,
            _id: data.user._id,
            nome: data.user.nome ?? "",
            email: data.user.email ?? "",
            senha: data.user.senha ?? "",
            status: data.user.status ?? "",
            updatedAt: data.user.updatedAt ?? "",
            accesstoken: data.accesstoken ?? "",
            refreshtoken: data.refreshtoken ?? "",
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          id: user.id,
          _id: user._id,
          nome: user.nome,
          email: user.email,
          status: user.status,
          updatedAt: user.updatedAt,
          accesstoken: user.accesstoken,
          refreshtoken: user.refreshtoken,
          accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hora
        };
      }

      // 2️⃣ Token ainda válido
      if (Date.now() < Number(token.accessTokenExpires ?? 0)) {
        return token;
      }

      // 3️⃣ Token expirou → tenta renovar
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user = {
          id: token.id,
          _id: token._id,
          nome: token.nome,
          email: token.email,
          status: token.status,
          updatedAt: token.updatedAt,
          accesstoken: token.accesstoken,
          refreshtoken: token.refreshtoken,
        };
      }

      // Se o refresh falhou, forçar logout no cliente
      if (token?.error === "RefreshAccessTokenError" && typeof window !== "undefined") {
        window.location.href = "/logout";
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
