// utils/roles.js
export const getRoleName = (role_id) => {

    const roles = {
    1: "Super Administrador",
    2: "Administrador",
    3: "Supervisor",
    4: "Soporte Técnico",
    5: "Asignador(a) de las tareas",
    6: "Encargado(a) Área Corporativa",
    7: "Manager",
    8: "Usuario",
    9: "Pei",
    10: "RRHH",
    11: "Soporte de Sistemas",
    };

    return roles[role_id] || "Invitado";


  };