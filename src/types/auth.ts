/**
 * Authentication and authorization types
 */
import { Member, WaitlistMember } from './members';

// User roles
export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  WAITLIST = 'waitlist',
  GUEST = 'guest',
}

// Admin specific roles for more granular control
export enum AdminRole {
  SUPER_ADMIN = 'super_admin',    // Full access to all features
  MEMBERSHIP_ADMIN = 'membership_admin',  // Can manage members
  CONTENT_ADMIN = 'content_admin',  // Can manage content but not members
  SUPPORT_ADMIN = 'support_admin',  // Limited admin for support tasks
}

// Permission types
export enum Permission {
  // Member management
  VIEW_MEMBERS = 'view_members',
  CREATE_MEMBER = 'create_member',
  UPDATE_MEMBER = 'update_member',
  DELETE_MEMBER = 'delete_member', 
  
  // Waitlist management
  VIEW_WAITLIST = 'view_waitlist',
  UPDATE_WAITLIST = 'update_waitlist',
  APPROVE_WAITLIST = 'approve_waitlist',
  
  // Admin actions
  ASSIGN_ADMIN = 'assign_admin',
  REVOKE_ADMIN = 'revoke_admin',
  SYSTEM_SETTINGS = 'system_settings',
  
  // Self-service (for members)
  UPDATE_OWN_PROFILE = 'update_own_profile',
  VIEW_OWN_PROFILE = 'view_own_profile',
}

// Role to permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.VIEW_MEMBERS,
    Permission.CREATE_MEMBER,
    Permission.UPDATE_MEMBER,
    Permission.DELETE_MEMBER,
    Permission.VIEW_WAITLIST,
    Permission.UPDATE_WAITLIST,
    Permission.APPROVE_WAITLIST,
    Permission.VIEW_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
  ],
  [UserRole.MEMBER]: [
    Permission.VIEW_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
  ],
  [UserRole.WAITLIST]: [
    Permission.VIEW_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
  ],
  [UserRole.GUEST]: [],
};

// Additional admin role permissions
export const ADMIN_ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  [AdminRole.SUPER_ADMIN]: [
    ...ROLE_PERMISSIONS[UserRole.ADMIN],
    Permission.ASSIGN_ADMIN,
    Permission.REVOKE_ADMIN,
    Permission.SYSTEM_SETTINGS,
  ],
  [AdminRole.MEMBERSHIP_ADMIN]: [
    ...ROLE_PERMISSIONS[UserRole.ADMIN],
  ],
  [AdminRole.CONTENT_ADMIN]: [
    Permission.VIEW_MEMBERS,
    Permission.VIEW_WAITLIST,
    Permission.VIEW_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
  ],
  [AdminRole.SUPPORT_ADMIN]: [
    Permission.VIEW_MEMBERS,
    Permission.VIEW_WAITLIST,
    Permission.VIEW_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
  ],
};

// Admin user interface
export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole.ADMIN;
  adminRole: AdminRole;
  permissions: Permission[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication token
export interface AuthToken {
  token: string;
  expiresAt: Date;
  userId: string;
  role: UserRole;
  adminRole?: AdminRole;
}

// Session with user context
export interface Session {
  user: {
    id: string;
    email: string;
    role: UserRole;
    adminRole?: AdminRole;
    permissions: Permission[];
  };
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// Login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Registration request
export interface RegistrationRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  // For waitlist registration
  reasonForJoining?: string;
  referredBy?: string;
}

// Authentication response
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    adminRole?: AdminRole;
  };
  token: string;
  expiresAt: string; // ISO date string
}

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true, 
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90, // days before password change is required
};

// Password validation utility type
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

