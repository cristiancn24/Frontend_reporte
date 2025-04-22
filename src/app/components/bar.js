"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Avatar from '@mui/material/Avatar';
import LogoutButton from './LogoutButton';

export default function Bar() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState({
    displayName: 'Cargando...',
    avatarLetter: 'U'
  });

  useEffect(() => {

    
    if (status === 'authenticated' && session?.user) {
      const user = session.user;
      
      // Usamos los nombres de campos que vienen del backend
      const nombreCompleto = user.nombre && user.apellido 
        ? `${user.nombre} ${user.apellido}`
        : user.name || user.email?.split('@')[0] || 'Usuario';

      const primeraLetra = (nombreCompleto[0] || 'U').toUpperCase();

      setUserData({
        displayName: nombreCompleto,
        avatarLetter: primeraLetra
      });
    } else if (status === 'unauthenticated') {
      setUserData({
        displayName: 'Invitado',
        avatarLetter: 'I'
      });
    }
  }, [session, status]);

  if (status === 'loading') {
    return (
      <div className="flex items-center w-full h-[10vh] bg-[#1282a2] shadow-lg p-8 text-white">
        <div className="animate-pulse flex items-center space-x-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center w-full h-[10vh] bg-[#1282a2] shadow-lg p-8 text-white">
      <img src="/assets/logo_pasaporte.png" alt="Logo Pasaporte" className="h-10" />
      <h1 className="text-2xl font-bold ml-4">Reporte de Soportes</h1>
      <div className='flex-grow'></div>
      <div className="flex items-center space-x-4">
        <Avatar sx={{ bgcolor: 'white', color: '#1282a2' }}>
          {userData.avatarLetter}
        </Avatar>
        <h3 className="text-lg font-semibold">{userData.displayName}</h3>
      </div>
      <LogoutButton />
    </div>
  );
}