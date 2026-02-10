export enum Role {
  ADMIN = 'ADMIN',
  USUARIO = 'USUARIO',
  VISUALIZADOR = 'VISUALIZADOR',
}

export const ROLE_PERMISSIONS = {
  ADMIN: {
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canCreateContracts: true,
    canEditContracts: true,
    canDeleteContracts: true,
    canViewDashboard: true,
    canGenerateReports: true,
    canManageTemplates: true,
  },
  USUARIO: {
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canCreateContracts: true,
    canEditContracts: true,
    canDeleteContracts: false,
    canViewDashboard: false,
    canGenerateReports: false,
    canManageTemplates: false,
  },
  VISUALIZADOR: {
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canCreateContracts: false,
    canEditContracts: false,
    canDeleteContracts: false,
    canViewDashboard: true,
    canGenerateReports: true,
    canManageTemplates: false,
  },
};

export const ROLE_LABELS = {
  ADMIN: 'Administrador',
  USUARIO: 'Usuario',
  VISUALIZADOR: 'Visualizador',
};

export function hasPermission(role: Role, permission: keyof typeof ROLE_PERMISSIONS.ADMIN): boolean {
  return ROLE_PERMISSIONS[role][permission] || false;
}
