// src/app/api/auth/[...nextauth]/route.js
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
          const res = await fetch("http://localhost:4000/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            
            // Personalizar mensajes según el código de estado
            let errorMessage;
            switch(res.status) {
              case 401:
                errorMessage = "Credenciales inválidas";
                break;
              case 403:
                errorMessage = "Acceso restringido a administradores";
                break;
              case 404:
                errorMessage = "Usuario no encontrado";
                break;
              default:
                errorMessage = errorData.message || "Error al iniciar sesión";
            }
            
            // Lanzar error con mensaje personalizado
            throw new Error(errorMessage);
          }

          const user = await res.json();
          
          if (user && user.token) {
            return {
              id: user.id,
              name: `${user.first_name} ${user.last_name}`,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              token: user.token,
              role: user.role, // Asegúrate de incluir el rol si existe
              ...user
            };
          }
          
          throw new Error("Datos de usuario incompletos");
          
        } catch (error) {
          // Lanzar error con mensaje personalizado
          throw new Error(error.message || "Error en el servidor");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role, // Incluir el rol en el token
          ...user
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login?error=true" // Redirige a login con parámetro de error
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };