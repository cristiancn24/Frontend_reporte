// components/LogoutButton.js
"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  const router = useRouter();
  const toastRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Opcional: Llamar al backend para invalidar el token
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      // Cerrar sesión con NextAuth
      await signOut({ redirect: false });
      
      // Mostrar feedback
      toastRef.current.show({
        severity: 'success',
        summary: 'Sesión cerrada',
        detail: 'Has salido correctamente del sistema',
        life: 3000
      });
      
      // Redirigir después de un breve retraso
      setTimeout(() => router.push('/login'), 1000);
    } catch (error) {
      toastRef.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un problema al cerrar sesión',
        life: 3000
      });
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
      setVisible(false);
    }
  };

  const footerContent = (
    <div>
      <Button 
        label="Cancelar" 
        icon="pi pi-times" 
        onClick={() => setVisible(false)} 
        className="p-button-text" 
        disabled={loading}
      />
      <Button 
        label={loading ? 'Cerrando sesión...' : 'Sí, cerrar sesión'} 
        icon={loading ? 'pi pi-spinner pi-spin' : 'pi pi-check'} 
        onClick={handleLogout} 
        autoFocus 
        loading={loading}
        className={loading ? 'p-button-secondary' : 'p-button-danger'}
      />
    </div>
  );

  return (
    <>
      <Toast ref={toastRef} position="top-right" />
      
      <Button
        icon="pi pi-sign-out"
        className="p-button-text p-button-danger"
        onClick={() => setVisible(true)}
        tooltip="Cerrar Sesión"
        tooltipOptions={{ position: 'bottom' }}
      />
      
      <Dialog 
        header="Confirmar cierre de sesión" 
        visible={visible} 
        style={{ width: '30vw' }} 
        footer={footerContent} 
        onHide={() => !loading && setVisible(false)}
        closable={!loading}
      >
        <div className="flex align-items-center">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: 'var(--yellow-500)' }} />
          <span>¿Estás seguro de que deseas cerrar sesión?</span>
        </div>
      </Dialog>
    </>
  );
}