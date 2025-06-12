"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

export default function LogoutButton({ className = "" }) {
  const router = useRouter();
  const toastRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    setVisible(false);

    try {
      // Mostrar Toast de confirmación
      toastRef.current?.show({
        severity: 'success',
        summary: 'Sesión cerrada',
        detail: 'Has salido del sistema correctamente',
        life: 3000
      });

      // Cerrar sesión CON redirección explícita
      await signOut({
        redirect: false, // Desactivar redirección automática
        callbackUrl: '/login' // Forzar URL limpia de redirección
      });

      // Redirigir manualmente después de breve retraso
      setTimeout(() => {
        router.push('/login');
        router.refresh(); // Crucial: actualiza el estado de la app
      }, 1000);

    } catch (error) {
      console.error('Error durante logout:', error);
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un problema al cerrar sesión',
        life: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const dialogFooter = (
    <div className="flex justify-end gap-2">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
        disabled={loading}
      />
      <Button
        label={loading ? 'Cerrando...' : 'Confirmar'}
        icon={loading ? 'pi pi-spinner pi-spin' : 'pi pi-check'}
        onClick={handleLogout}
        className={loading ? 'p-button-secondary' : 'p-button-danger'}
        disabled={loading}
        autoFocus
      />
    </div>
  );

  return (
    <>
      <Toast ref={toastRef} position="top-center" />

      <Button
        icon="pi pi-sign-out"
        className={`p-button-text p-button-danger ${className}`}
        onClick={() => setVisible(true)}
        tooltip="Cerrar sesión"
        tooltipOptions={{ position: 'left', mouseTrack: true }}
        aria-label="Cerrar sesión"
      />

      <Dialog
        header="Confirmar cierre de sesión"
        visible={visible}
        style={{ width: 'min(90vw, 400px)' }}
        footer={dialogFooter}
        onHide={() => !loading && setVisible(false)}
        closable={!loading}
        dismissableMask={!loading}
      >
        <div className="flex align-items-center gap-3">
          <i className="pi pi-exclamation-circle text-2xl text-primary" />
          <p>¿Estás seguro de que deseas cerrar sesión?</p>
        </div>
      </Dialog>
    </>
  );
}