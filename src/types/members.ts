/**
 * Member management types
 */

// Common base user interface
export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Status options for active members
export enum MemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

// Active member interface
export interface Member extends BaseUser {
  status: MemberStatus;
  memberSince: Date;
  membershipId: string;
  profilePicture?: string;
  bio?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    receiveEmails: boolean;
    receiveNotifications: boolean;
    isPublicProfile: boolean;
  };
  lastLogin?: Date;
}

// Status options for waitlist members
export enum WaitlistStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Waitlist member interface
export interface WaitlistMember extends BaseUser {
  status: WaitlistStatus;
  applicationDate: Date;
  position: number; // Position in the waitlist queue
  reasonForJoining?: string;
  referredBy?: string;
}

// System capacities and constraints
export const MEMBERSHIP_LIMITS = {
  ACTIVE_MEMBERS_MAX: 200,
  WAITLIST_MAX: 100,
};

// Response when retrieving members
export interface MembersResponse {
  members: Member[];
  total: number;
  limit: number;
  offset: number;
}

// Response when retrieving waitlist members
export interface WaitlistResponse {
  waitlistMembers: WaitlistMember[];
  total: number;
  limit: number;
  offset: number;
}

// Member creation/update request
export interface MemberRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePicture?: string;
  bio?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    receiveEmails: boolean;
    receiveNotifications: boolean;
    isPublicProfile: boolean;
  };
}

// Waitlist member creation request
export interface WaitlistRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  reasonForJoining?: string;
  referredBy?: string;
}

