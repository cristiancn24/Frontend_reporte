import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log('Intentando autenticar con:', credentials.email);
          
          const res = await fetch('http://localhost:4000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          const data = await res.json();
          console.log('Respuesta del backend:', data);

          if (!res.ok) {
            throw new Error(data.error || 'Error de autenticación');
          }

          return {
            id: data.user.id.toString(),
            email: data.user.email,
            name: `${data.user.nombre} ${data.user.apellido}`,
            firstName: data.user.nombre,
            lastName: data.user.apellido,
            role: data.user.role_id,
            token: data.token
          };
          
        } catch (error) {
          console.error('Error en authorize:', error);
          throw new Error(error.message || 'No se pudo iniciar sesión');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role_id: user.role,
          name: user.name,
          token: user.token
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/login", // Especifica la página de logout
    error: "/login?error=true"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 horas
  },
  events: {
    async signOut({ token }) {
      // Evento que se dispara al hacer logout
      try {
        await fetch('http://localhost:4000/api/users/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.user?.token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Error durante logout en backend:', error);
      }
    }
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };