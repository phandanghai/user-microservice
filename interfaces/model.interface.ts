export enum RoleUser {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum StatusUser {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Interface User
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  country?: string;
  city?: string;
  address?: string;
  region?: string;
  phoneNumber?: string;
  lastUpdatePassword: Date;
  role: RoleUser;
  status: StatusUser;
  balance: string | number; // Prisma Decimal, map sang string hoặc number
  authentication: boolean;
  createdAt: Date;
  updatedAt: Date;
}
