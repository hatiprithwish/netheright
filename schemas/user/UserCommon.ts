export interface CurrentUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  roleId: string;
  roleName: string;
  features: string[];
}
