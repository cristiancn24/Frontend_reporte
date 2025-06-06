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
    setVisible(false); // Cerrar diálogo inmediatamente

    try {
      // 1. Mostrar Toast primero
      toastRef.current?.show({
        severity: 'success',
        summary: 'Sesión cerrada',
        detail: 'Has salido del sistema correctamente',
        life: 9000
      });

      // 2. Esperar 500ms para asegurar que el Toast se muestra
      await new Promise(resolve => setTimeout(resolve, 500));

      // 3. Cerrar sesión (sin esperar, se ejecuta en segundo plano)
      signOut({ redirect: false }).catch(console.error);

      // 4. Redirigir después de 7 segundos (tiempo del Toast)
      setTimeout(() => {
        router.push('/login');
      }, 9000);

    } catch (error) {
      console.error('Error:', error);
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un problema',
        life: 9000
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
        header="Confirmar cierre"
        visible={visible}
        style={{ width: 'min(90vw, 400px)' }}
        footer={dialogFooter}
        onHide={() => !loading && setVisible(false)}
        closable={!loading}
        dismissableMask={!loading}
      >
        <div className="flex align-items-center gap-3">
          <i className="pi pi-exclamation-circle text-2xl text-primary" />
          <p>¿Estás seguro de salir del sistema?</p>
        </div>
      </Dialog>
    </>
  );
}