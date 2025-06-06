"use client";

import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // app/login/page.js
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/home'
    });

    console.log('SignIn result:', result); // Debug
    
    if (result?.error) {
      const errorMap = {
        "CredentialsSignin": "Credenciales inválidas",
        "Usuario no encontrado": "Usuario no existe",
        "Contraseña incorrecta": "Contraseña incorrecta"
      };
      setError(errorMap[result.error] || result.error);
    } else {
      window.location.href = result?.url || '/home';
    }
  } catch (err) {
    setError('Error de conexión con el servidor');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="relative min-h-[700px] max-h-[90vh] h-auto flex justify-center">
      {/* Fondo con imagen */}
      <div 
        className="fixed inset-0 bg-[url('/assets/fondo_pasaportes.png')] bg-cover bg-center bg-no-repeat z-0"
      />
      
      {/* Overlay semitransparente */}
      <div className="fixed inset-0 bg-[#1282a2] opacity-40 z-10" />
      
      {/* Contenedor del formulario */}
      <div className="relative max-w-md w-full m-4 sm:m-10 bg-white shadow-xl rounded-xl flex justify-center flex-1 z-20">
        <div className="w-full p-6 sm:p-10">
          {/* Encabezado */}
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start mb-8 gap-4">
            <img 
              src="/assets/logo_pasaporte.png" 
              className="w-auto h-12" 
              alt="Logo Pasaportes" 
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-customBlue text-center sm:text-left">
              Reporte de Soportes
            </h1>
          </div>
          
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-customBlue">Inicia Sesión</h2>
          </div>
          
          {/* Mensaje de error */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="w-full max-w-md space-y-6">
              {/* Campo de email */}
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-customBlue mb-2">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@dominio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-medium bg-gray-50 border border-gray-200 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Campo de contraseña */}
              <div>
                <label htmlFor="password" className="block text-lg font-medium text-customBlue mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Ingresa tu contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg font-medium bg-gray-50 border border-gray-200 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 mt-10 rounded-lg font-semibold text-white transition-colors duration-200 ${
                  isLoading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                } flex items-center justify-center`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Procesando...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}