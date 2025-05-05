/**
 * API routes for authentication and authorization
 */

import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { 
  apiHandler, 
  createSuccessResponse, 
  createErrorResponse 
} from '@/utils/api-utils';
import { HttpStatus } from '@/types/api';
import { 
  Member, 
  MemberStatus,
  WaitlistMember,
  WaitlistStatus, 
  MEMBERSHIP_LIMITS
} from '@/types/members';
import { 
  UserRole,
  AdminRole,
  Permission,
  Session,
  LoginRequest,
  RegistrationRequest,
  AuthResponse,
  PASSWORD_REQUIREMENTS,
  PasswordValidationResult,
  ROLE_PERMISSIONS,
  ADMIN_ROLE_PERMISSIONS,
  AdminUser
} from '@/types/auth';

// Mock database - would be replaced with real database in production
interface UserCredential {
  id: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  role: UserRole;
  adminRole?: AdminRole;
}

// Mock database collections
let userCredentials: UserCredential[] = [];
let activeSessions: Session[] = [];
let adminUsers: AdminUser[] = [];

// External reference to member collections (simulated database relationship)
declare const members: Member[];
declare const waitlistMembers: WaitlistMember[];

/**
 * Generate a secure random salt for password hashing
 */
function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Hash a password with the provided salt
 */
function hashPassword(password: string, salt: string): string {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
}

/**
 * Verify a password against a hash
 */
function verifyPassword(password: string, hash: string, salt: string): boolean {
  const passwordHash = hashPassword(password, salt);
  return passwordHash === hash;
}

/**
 * Generate a JWT-like token (simplified for example)
 */
function generateToken(): string {
  return uuidv4() + '.' + Date.now() + '.' + crypto.randomBytes(16).toString('hex');
}

/**
 * Validate password against requirements
 */
function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
  }
  
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (PASSWORD_REQUIREMENTS.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (PASSWORD_REQUIREMENTS.requireSpecialChars && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get permissions for user based on role
 */
function getPermissions(role: UserRole, adminRole?: AdminRole): Permission[] {
  if (role === UserRole.ADMIN && adminRole) {
    return ADMIN_ROLE_PERMISSIONS[adminRole];
  }
  
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Create a new user session
 */
function createSession(userId: string, email: string, role: UserRole, adminRole?: AdminRole): Session {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
  
  const session: Session = {
    user: {
      id: userId,
      email,
      role,
      adminRole,
      permissions: getPermissions(role, adminRole)
    },
    token: generateToken(),
    expiresAt,
    createdAt: now
  };
  
  // Add to active sessions
  activeSessions.push(session);
  
  return session;
}

/**
 * Verify and get active session
 */
function getActiveSession(token: string): Session | null {
  const session = activeSessions.find(s => s.token === token);
  
  if (!session) {
    return null;
  }
  
  // Check if expired
  if (session.expiresAt < new Date()) {
    // Remove expired session
    activeSessions = activeSessions.filter(s => s.token !== token);
    return null;
  }
  
  return session;
}

/**
 * Endpoint to handle user registration
 */
export async function POST(request: NextRequest) {
  return apiHandler<AuthResponse>(request, async () => {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle different authentication endpoints
    if (path.endsWith('/register')) {
      return handleRegistration(request);
    } else if (path.endsWith('/login')) {
      return handleLogin(request);
    } else if (path.endsWith('/register-admin')) {
      return handleAdminRegistration(request);
    } else if (path.endsWith('/refresh')) {
      return handleTokenRefresh(request);
    } else if (path.endsWith('/logout')) {
      return handleLogout(request);
    }
    
    return createErrorResponse(
      'Invalid auth endpoint',
      HttpStatus.NOT_FOUND,
      'endpoint_not_found'
    );
  });
}

/**
 * Handle user registration
 */
async function handleRegistration(request: NextRequest) {
  // Parse registration data
  const registrationData: RegistrationRequest = await request.json();
  
  // Basic validation
  if (
    !registrationData.email ||
    !registrationData.password ||
    !registrationData.confirmPassword ||
    !registrationData.firstName ||
    !registrationData.lastName
  ) {
    return createErrorResponse(
      'Missing required fields',
      HttpStatus.BAD_REQUEST,
      'invalid_request'
    );
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(registrationData.email)) {
    return createErrorResponse(
      'Invalid email format',
      HttpStatus.BAD_REQUEST,
      'invalid_email'
    );
  }
  
  // Check if passwords match
  if (registrationData.password !== registrationData.confirmPassword) {
    return createErrorResponse(
      'Passwords do not match',
      HttpStatus.BAD_REQUEST,
      'password_mismatch'
    );
  }
  
  // Validate password
  const passwordValidation = validatePassword(registrationData.password);
  if (!passwordValidation.isValid) {
    return createErrorResponse(
      'Password does not meet requirements',
      HttpStatus.BAD_REQUEST,
      'invalid_password',
      { errors: passwordValidation.errors }
    );
  }
  
  // Check if email is already registered
  if (userCredentials.some(user => user.email === registrationData.email)) {
    return createErrorResponse(
      'Email is already registered',
      HttpStatus.CONFLICT,
      'email_conflict'
    );
  }
  
  // Determine if this will be a member or waitlist registration
  let role = UserRole.WAITLIST;
  const now = new Date();
  const userId = uuidv4();
  
  // Check if we can add as active member (simulated logic)
  if (
    typeof members !== 'undefined' && 
    members.filter(m => m.status === MemberStatus.ACTIVE).length < MEMBERSHIP_LIMITS.ACTIVE_MEMBERS_MAX
  ) {
    // Add as active member
    role = UserRole.MEMBER;
    
    // Create member profile
    const newMember: Member = {
      id: userId,
      email: registrationData.email,
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      phone: registrationData.phone,
      status: MemberStatus.ACTIVE,
      memberSince: now,
      membershipId: `MEM-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: now,
      updatedAt: now,
      preferences: {
        receiveEmails: true,
        receiveNotifications: true,
        isPublicProfile: false
      }
    };
    
    // Add to members collection
    if (typeof members !== 'undefined') {
      members.push(newMember);
    }
  } else {
    // Waitlist is full, check if we can add to waitlist
    if (
      typeof waitlistMembers !== 'undefined' && 
      waitlistMembers.filter(m => m.status === WaitlistStatus.PENDING).length < MEMBERSHIP_LIMITS.WAITLIST_MAX
    ) {
      // Add to waitlist
      const pendingCount = waitlistMembers.filter(
        m => m.status === WaitlistStatus.PENDING
      ).length;
      
      // Create waitlist profile
      const newWaitlistMember: WaitlistMember = {
        id: userId,
        email: registrationData.email,
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        phone: registrationData.phone,
        status: WaitlistStatus.PENDING,
        applicationDate: now,
        position: pendingCount + 1,
        reasonForJoining: registrationData.reasonForJoining,
        referredBy: registrationData.referredBy,
        createdAt: now,
        updatedAt: now
      };
      
      // Add to waitlist collection
      if (typeof waitlistMembers !== 'undefined') {
        waitlistMembers.push(newWaitlistMember);
        
        // Recalculate positions if needed (function would be defined elsewhere)
        if (typeof recalculateWaitlistPositions === 'function') {
          recalculateWaitlistPositions();
        }
      }
    } else {
      return createErrorResponse(
        'Registration is currently closed. Both member list and waitlist are at capacity',
        HttpStatus.CONFLICT,
        'registration_closed'
      );
    }
  }
  
  // Create user credentials
  const salt = generateSalt();
  const passwordHash = hashPassword(registrationData.password, salt);
  
  const newUser: UserCredential = {
    id: userId,
    email: registrationData.email,
    passwordHash,
    passwordSalt: salt,
    role
  };
  
  // Save to database
  userCredentials.push(newUser);
  
  // Create session
  const session = createSession(
    userId,
    registrationData.email,
    role
  );
  
  // Return auth response
  return createSuccessResponse<AuthResponse>({
    user: {
      id: userId,
      email: registrationData.email,
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      role,
    },
    token: session.token,
    expiresAt: session.expiresAt.toISOString(),
  }, HttpStatus.CREATED);
}

/**
 * Handle user login
 */
async function handleLogin(request: NextRequest) {
  // Parse login data
  const loginData: LoginRequest = await request.json();
  
  // Basic validation
  if (!loginData.email || !loginData.password) {
    return createErrorResponse(
      'Email and password required',
      HttpStatus.BAD_REQUEST,
      'invalid_request'
    );
  }
  
  // Find user by email
  const user = userCredentials.find(u => u.email === loginData.email);
  
  if (!user) {
    return createErrorResponse(
      'Invalid email or password',
      HttpStatus.UNAUTHORIZED,
      'invalid_credentials'
    );
  }
  
  // Verify password
  if (!verifyPassword(loginData.password, user.passwordHash, user.passwordSalt)) {
    return createErrorResponse(
      'Invalid email or password',
      HttpStatus.UNAUTHORIZED,
      'invalid_credentials'
    );
  }
  
  // Find user details based on role
  let firstName = '';
  let lastName = '';
  
  if (user.role === UserRole.ADMIN) {
    const adminUser = adminUsers.find(a => a.id === user.id);
    if (adminUser) {
      firstName = adminUser.firstName;
      lastName = adminUser.lastName;
    }
  } else if (user.role === UserRole.MEMBER && typeof members !== 'undefined') {
    const member = members.find(m => m.id === user.id);
    if (member) {
      firstName = member.firstName;
      lastName = member.lastName;
      
      // Update last login time
      member.lastLogin = new Date();
    }
  } else if (user.role === UserRole.WAITLIST && typeof waitlistMembers !== 'undefined') {
    const waitlistMember = waitlistMembers.find(m => m.id === user.id);
    if (waitlistMember) {
      firstName = waitlistMember.firstName;
      lastName = waitlistMember.lastName;
    }
  }
  
  // Create session
  const session = createSession(
    user.id,
    user.email,
    user.role,
    user.adminRole
  );
  
  // Return auth response
  return createSuccessResponse<AuthResponse>({
    user: {
      id: user.id,
      email: user.email,
      firstName,
      lastName,
      role: user.role,
      adminRole: user.adminRole
    },
    token: session.token,
    expiresAt: session.expiresAt.toISOString(),
  }, HttpStatus.OK);
}

/**
 * Handle admin registration (secured endpoint)
 */
async function handleAdminRegistration(request: NextRequest) {
  // Parse auth token
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return createErrorResponse(
      'Unauthorized',
      HttpStatus.UNAUTHORIZED,
      'unauthorized'
    );
  }
  
  const token = authHeader.substring(7);
  const session = getActiveSession(token);
  
  // Verify admin with ASSIGN_ADMIN permission
  if (
    !session || 
    session.user.role !== UserRole.ADMIN || 
    !session.user.permissions.includes(Permission.ASSIGN_ADMIN)
  ) {
    return createErrorResponse(
      'Forbidden. Requires admin with permission to assign admin roles',
      HttpStatus.FORBIDDEN,
      'forbidden'
    );
  }
  
  // Parse registration data
  const registrationData = await request.json();
  
  // Basic validation
  if (
    !registrationData.email ||
    !registrationData.password ||
    !registrationData.confirmPassword ||
    !registrationData.firstName ||
    !registrationData.lastName ||
    !registrationData.adminRole
  ) {
    return createErrorResponse(
      'Missing required fields',
      HttpStatus.BAD_REQUEST,
      'invalid_request'
    );
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(registrationData.email)) {
    return createErrorResponse(
      'Invalid email format',
      HttpStatus.BAD_REQUEST,
      'invalid_email'
    );
  }
  
  // Check if passwords match
  if (registrationData.password !== registrationData.confirmPassword) {
    return createErrorResponse(
      'Passwords do not match',
      HttpStatus.BAD_REQUEST,
      'password_mismatch'
    );
  }
  
  // Validate password
  const passwordValidation = validatePassword(registrationData.password);
  if (!passwordValidation.isValid) {
    return createErrorResponse(
      'Password does not meet requirements',
      HttpStatus.BAD_REQUEST,
      'invalid_password',
      { errors: passwordValidation.errors }
    );
  }
  
  // Check if email is already registered
  if (userCredentials.some(user => user.email === registrationData.email)) {
    return createErrorResponse(
      'Email is already registered',
      HttpStatus.CONFLICT,
      'email_conflict'
    );
  }
  
  // Validate admin role
  const adminRole = registrationData.adminRole as AdminRole;
  if (!Object.values(AdminRole).includes(adminRole)) {
    return createErrorResponse(
      'Invalid admin role',
      HttpStatus.BAD_REQUEST,
      'invalid_role'
    );
  }
  
  // Extra security check for SUPER_ADMIN role
  if (adminRole === AdminRole.SUPER_ADMIN) {
    // Only existing SUPER_ADMINs can create other SUPER_ADMINs
    if (session.user.adminRole !== AdminRole.SUPER_ADMIN) {
      return createErrorResponse(
        'Only super admins can create other super admins',
        HttpStatus.FORBIDDEN,
        'forbidden'
      );
    }
  }
  
  // Create the admin user
  const now = new Date();
  const userId = uuidv4();
  
  // Create user credentials
  const salt = generateSalt();
  const passwordHash = hashPassword(registrationData.password, salt);
  
  const newUser: UserCredential = {
    id: userId,
    email: registrationData.email,
    passwordHash,
    passwordSalt: salt,
    role: UserRole.ADMIN,
    adminRole
  };
  
  // Create admin profile
  const newAdmin: AdminUser = {
    id: userId,
    email: registrationData.email,
    firstName: registrationData.firstName,
    lastName: registrationData.lastName,
    role: UserRole.ADMIN,
    adminRole,
    permissions: getPermissions(UserRole.ADMIN, adminRole),
    createdAt: now,
    updatedAt: now
  };
  
  // Save to "database"
  userCredentials.push(newUser);
  adminUsers.push(newAdmin);
  
  // Return success without creating a session
  return createSuccessResponse(
    {
      id: userId,
      email: registrationData.email,
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      role: UserRole.ADMIN,
      adminRole,
      created: true
    },
    HttpStatus.CREATED
  );
}

/**
 * Handle token refresh
 */
async function handleTokenRefresh(request: NextRequest) {
  // Get token from Authorization header
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return createErrorResponse(
      'Invalid token',
      HttpStatus.UNAUTHORIZED,
      'invalid_token'
    );
  }
  
  const token = authHeader.substring(7);
  const session = getActiveSession(token);
  
  if (!session) {
    return createErrorResponse(
      'Session expired or invalid',
      HttpStatus.UNAUTHORIZED,
      'session_expired'
    );
  }
  
  // Remove the old session
  activeSessions = activeSessions.filter(s => s.token !== token);
  
  // Create a new session with the same user info
  const newSession = createSession(
    session.user.id,
    session.user.email,
    session.user.role,
    session.user.adminRole
  );
  
  // Get user details based on role for response
  let firstName = '';
  let lastName = '';
  
  if (session.user.role === UserRole.ADMIN) {
    const adminUser = adminUsers.find(a => a.id === session.user.id);
    if (adminUser) {
      firstName = adminUser.firstName;
      lastName = adminUser.lastName;
    }
  } else if (session.user.role === UserRole.MEMBER && typeof members !== 'undefined') {
    const member = members.find(m => m.id === session.user.id);
    if (member) {
      firstName = member.firstName;
      lastName = member.lastName;
    }
  } else if (session.user.role === UserRole.WAITLIST && typeof waitlistMembers !== 'undefined') {
    const waitlistMember = waitlistMembers.find(m => m.id === session.user.id);
    if (waitlistMember) {
      firstName = waitlistMember.firstName;
      lastName = waitlistMember.lastName;
    }
  }
  
  // Return auth response with new token
  return createSuccessResponse<AuthResponse>({
    user: {
      id: session.user.id,
      email: session.user.email,
      firstName,
      lastName,
      role: session.user.role,
      adminRole: session.user.adminRole
    },
    token: newSession.token,
    expiresAt: newSession.expiresAt.toISOString(),
  }, HttpStatus.OK);
}

/**
 * Handle logout
 */
async function handleLogout(request: NextRequest) {
  // Get token from Authorization header
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return createErrorResponse(
      'Invalid token',
      HttpStatus.UNAUTHORIZED,
      'invalid_token'
    );
  }
  
  const token = authHeader.substring(7);
  
  // Remove session regardless of whether it exists
  // This ensures idempotent behavior (can call logout multiple times)
  const previousCount = activeSessions.length;
  activeSessions = activeSessions.filter(s => s.token !== token);
  
  const wasRemoved = previousCount > activeSessions.length;
  
  // Return success
  return createSuccessResponse(
    { 
      loggedOut: true,
      sessionTerminated: wasRemoved
    },
    HttpStatus.OK
  );
}
