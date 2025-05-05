/**
 * API Route Integration Tests
 * 
 * Tests for member management, waitlist operations, and authentication
 */

import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { HttpStatus } from '@/types/api';
import { MemberStatus, MEMBERSHIP_LIMITS, WaitlistStatus } from '@/types/members';
import { UserRole, AdminRole, Permission } from '@/types/auth';

// Import the handlers directly instead of making HTTP requests
// This allows us to test without a running server
import { GET as getMembers, POST as createMember, PATCH as updateMember, DELETE as deleteMember } from '../members/route';
import { GET as getWaitlist, POST as addToWaitlist, PATCH as updateWaitlist } from '../waitlist/route';
import { POST as authHandler } from '../auth/route';

// Mock data stores - we'll reset these between tests
let members: any[] = [];
let waitlistMembers: any[] = [];
let userCredentials: any[] = [];
let activeSessions: any[] = [];
let adminUsers: any[] = [];

// Make the mock data available to route handlers
(global as any).members = members;
(global as any).waitlistMembers = waitlistMembers;
(global as any).userCredentials = userCredentials;
(global as any).activeSessions = activeSessions;
(global as any).adminUsers = adminUsers;
(global as any).recalculateWaitlistPositions = jest.fn(() => {
  // Simple mock of waitlist position recalculation
  const pendingMembers = waitlistMembers
    .filter(m => m.status === WaitlistStatus.PENDING)
    .sort((a, b) => a.applicationDate.getTime() - b.applicationDate.getTime());
  
  pendingMembers.forEach((member, index) => {
    member.position = index + 1;
  });
});

// Create a mock NextRequest
function createMockRequest(
  method: string, 
  url: string, 
  body?: any, 
  headers: Record<string, string> = {},
  queryParams: Record<string, string> = {}
): NextRequest {
  const baseUrl = 'http://localhost:3000';
  const urlWithParams = new URL(url, baseUrl);
  
  // Add query parameters
  Object.entries(queryParams).forEach(([key, value]) => {
    urlWithParams.searchParams.append(key, value);
  });
  
  // Add default headers
  const allHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };
  
  const requestInit: RequestInit = {
    method,
    headers: allHeaders
  };
  
  if (body) {
    requestInit.body = JSON.stringify(body);
  }
  
  return new NextRequest(urlWithParams, requestInit);
}

// Parse JSON response
async function parseResponse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

// Test setup and teardown
beforeEach(() => {
  // Reset mock data stores before each test
  members.length = 0;
  waitlistMembers.length = 0;
  userCredentials.length = 0;
  activeSessions.length = 0;
  adminUsers.length = 0;
  
  // Reset mocks
  jest.clearAllMocks();
});

describe('Member Management API', () => {
  // Set up admin user for authorization
  let adminToken: string;
  
  beforeEach(async () => {
    // Create an admin user
    const adminId = uuidv4();
    const now = new Date();
    
    adminUsers.push({
      id: adminId,
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      adminRole: AdminRole.SUPER_ADMIN,
      permissions: [
        Permission.VIEW_MEMBERS,
        Permission.CREATE_MEMBER,
        Permission.UPDATE_MEMBER,
        Permission.DELETE_MEMBER,
        Permission.VIEW_WAITLIST,
        Permission.UPDATE_WAITLIST,
        Permission.APPROVE_WAITLIST
      ],
      createdAt: now,
      updatedAt: now
    });
    
    userCredentials.push({
      id: adminId,
      email: 'admin@example.com',
      passwordHash: 'mock-hash',  // Not actually checked in tests
      passwordSalt: 'mock-salt',
      role: UserRole.ADMIN,
      adminRole: AdminRole.SUPER_ADMIN
    });
    
    // Mock login to get token
    const loginRequest = createMockRequest(
      'POST',
      '/api/v1/auth/login',
      {
        email: 'admin@example.com',
        password: 'password123'
      }
    );
    
    const loginResponse = await authHandler(loginRequest);
    const loginData = await parseResponse(loginResponse);
    adminToken = loginData.data.token;
  });
  
  test('should create a new member', async () => {
    // Create a new member
    const request = createMockRequest(
      'POST',
      '/api/v1/members',
      {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '555-123-4567'
      },
      {
        'Authorization': `Bearer ${adminToken}`
      }
    );
    
    const response = await createMember(request);
    expect(response.status).toBe(HttpStatus.CREATED);
    
    const data = await parseResponse(response);
    expect(data.success).toBe(true);
    expect(data.data.email).toBe('john@example.com');
    expect(data.data.status).toBe(MemberStatus.ACTIVE);
    
    // Verify member was added to the list
    expect(members.length).toBe(1);
    expect(members[0].email).toBe('john@example.com');
  });
  
  test('should enforce member limit', async () => {
    // Add max number of members
    for (let i = 0; i < MEMBERSHIP_LIMITS.ACTIVE_MEMBERS_MAX; i++) {
      members.push({
        id: uuidv4(),
        email: `member${i}@example.com`,
        firstName: `Member`,
        lastName: `${i}`,
        status: MemberStatus.ACTIVE,
        memberSince: new Date(),
        membershipId: `MEM-${100000 + i}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Try to add one more
    const request = createMockRequest(
      'POST',
      '/api/v1/members',
      {
        email: 'toomany@example.com',
        firstName: 'Too',
        lastName: 'Many',
      },
      {
        'Authorization': `Bearer ${adminToken}`
      }
    );
    
    const response = await createMember(request);
    expect(response.status).toBe(HttpStatus.CONFLICT);
    
    const data = await parseResponse(response);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('max_members_reached');
  });
  
  test('should update member information', async () => {
    // Add a member
    const memberId = uuidv4();
    members.push({
      id: memberId,
      email: 'update@example.com',
      firstName: 'Before',
      lastName: 'Update',
      status: MemberStatus.ACTIVE,
      memberSince: new Date(),
      membershipId: 'MEM-123456',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Update the member
    const request = createMockRequest(
      'PATCH',
      `/api/v1/members/${memberId}`,
      {
        firstName: 'After',
        lastName: 'TheUpdate',
        phone: '555-999-8888'
      },
      {
        'Authorization': `Bearer ${adminToken}`
      }
    );
    
    const response = await updateMember(request);
    expect(response.status).toBe(HttpStatus.OK);
    
    const data = await parseResponse(response);
    expect(data.success).toBe(true);
    expect(data.data.firstName).toBe('After');
    expect(data.data.lastName).toBe('TheUpdate');
    expect(data.data.phone).toBe('555-999-8888');
    
    // Verify member was updated in the list
    expect(members[0].firstName).toBe('After');
  });
  
  test('should list members with pagination', async () => {
    // Add some members
    for (let i = 0; i < 25; i++) {
      members.push({
        id: uuidv4(),
        email: `member${i}@example.com`,
        firstName: `Member`,
        lastName: `${i}`,
        status: MemberStatus.ACTIVE,
        memberSince: new Date(),
        membershipId: `MEM-${100000 + i}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Get first page (10 members)
    const request = createMockRequest(
      'GET',
      '/api/v1/members',
      undefined,
      {
        'Authorization': `Bearer ${adminToken}`
      },
      {
        'limit': '10',
        'offset': '0'
      }
    );
    
    const response = await getMembers(request);
    expect(response.status).toBe(HttpStatus.OK);
    
    const data = await parseResponse(response);
    expect(data.success).toBe(true);
    expect(data.data.members.length).toBe(10);
    expect(data.data.total).toBe(25);
    expect(data.data.limit).toBe(10);
    expect(data.data.offset).toBe(0);
  });
});

describe('Waitlist Operations API', () => {
  // Set up admin user for authorization
  let adminToken: string;
  
  beforeEach(async () => {
    // Create an admin user (same setup as before)
    const adminId = uuidv4();
    const now = new Date();
    
    adminUsers.push({
      id: adminId,
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      adminRole: AdminRole.SUPER_ADMIN,
      permissions: [
        Permission.VIEW_MEMBERS,
        Permission.CREATE_MEMBER,
        Permission.UPDATE_MEMBER,
        Permission.DELETE_MEMBER,
        Permission.VIEW_WAITLIST,
        Permission.UPDATE_WAITLIST,
        Permission.APPROVE_WAITLIST
      ],
      createdAt: now,
      updatedAt: now
    });
    
    userCredentials.push({
      id: adminId,
      email: 'admin@example.com',
      passwordHash: 'mock-hash',
      passwordSalt: 'mock-salt',
      role: UserRole.ADMIN,
      adminRole: AdminRole.SUPER_ADMIN
    });
    
    // Mock login to get token
    const loginRequest = createMockRequest(
      'POST',
      '/api/v1/auth/login',
      {
        email: 'admin@example.com',
        password: 'password123'
      }
    );
    
    const loginResponse = await authHandler(loginRequest);
    const loginData = await parseResponse(loginResponse);
    adminToken = loginData.data.token;
  });
  
  test('should add to waitlist', async () => {
    // Add to waitlist
    const request = createMockRequest(
      'POST',
      '/api/v1/waitlist',
      {
        email: 'waitlist@example.com',
        firstName: 'Wait',
        lastName: 'List',
        reasonForJoining: 'Testing'
      }
    );
    
    const response = await addToWaitlist(request);
    expect(response.status).toBe(HttpStatus.CREATED);
    
    const data = await parseResponse(response);
    expect(data.success).toBe(true);
    expect(data.data.email).toBe('waitlist@example.com');
    expect(data.data.status).toBe(WaitlistStatus.PENDING);
    expect(data.data.position).toBe(1);
    
    // Verify waitlist member was added
    expect(waitlistMembers.length).toBe(1);
    expect(waitlistMembers[0].email).toBe('waitlist@example.com');
  });
  
  test('should maintain waitlist positions', async () => {
    // Add three waitlist members
    for (let i = 0; i < 3; i++) {
      waitlistMembers.push({
        id: uuidv4(),
        email: `wait${i}@example.com`,
        firstName: 'Waitlist',
        lastName: `User ${i}`,
        status: WaitlistStatus.PENDING,
        applicationDate: new Date(Date.now() + i * 1000), // Spaced out by 1 second
        position: i + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Remove the middle one
    const request = createMockRequest(
      'PATCH',
      `/api/v1/waitlist/${waitlistMembers[1].id}`,
      {
        status: WaitlistStatus.REJECTED
      },
      {
        'Authorization': `Bearer ${adminToken}`
      }
    );
    
    const response = await updateWaitlist(request);
    expect(response.status).toBe(HttpStatus.OK);
    
    // Verify positions were updated
    expect(waitlistMembers[0].position).toBe(1);
    expect(waitlistMembers[2].position).toBe(2);
    expect(waitlistMembers[1].status).toBe(WaitlistStatus.REJECTED);
  });
  
  test('should move from waitlist to active', async () => {
    // Ensure we have room for members
    expect(members.length).toBe(0);
    
    // Add a waitlist member
    const waitlistId = uuidv4();
    waitlistMembers.push({
      id: waitlistId,
      email: 'promote@example.com',
      firstName: 'Promote',
      lastName: 'Me',
      status: WaitlistStatus.PENDING,
      applicationDate: new Date(),
      position: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Promote to active member
    const request = createMockRequest(
      'PATCH',
      `/api/v1/waitlist/${waitlistId}`,
      {
        status: WaitlistStatus.APPROVED
      },
      {
        'Authorization': `Bearer ${adminToken}`
      }
    );
    
    const response = await updateWaitlist(request);
    expect(response.status).toBe(HttpStatus.CREATED);
    
    const data = await parseResponse(response);
    expect(data.success).toBe(true);
    expect(data.data.email).toBe('promote@example.com');
    expect(data.data.status).toBe(MemberStatus.ACTIVE);
    
    // Verify waitlist member status was updated
    expect(waitlistMembers[0].status).toBe(WaitlistStatus.APPROVED);
    
    // Verify a new active member was created
    expect(members.length).toBe(1);
    expect(members[0].email).toBe('promote@example.com');
  });
  
  test('should enforce waitlist limit', async () => {
    // Add max number of waitlist members
    for (let i = 0; i < MEMBERSHIP_LIMITS.WAITLIST_MAX; i++) {
      waitlistMembers.push({
        id: uuidv4(),
        email: `waitlist${i}@example.com`,
        firstName: 'Waitlist',
        lastName: `User ${i}`,
        status: WaitlistStatus.PENDING,
        applicationDate: new Date(),
        position: i + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Try to add one more
    const request = createMockRequest(
      'POST',
      '/api/v1/waitlist',
      {
        email: 'toolate@example.com',
        firstName: 'Too',
        lastName: 'Late',
        reasonForJoining: 'Testing limits'
      }
    );
    
    const response = await addToWaitlist(request);
    expect(response.status).toBe(HttpStatus.CONFLICT);
    
    const data = await parseResponse(response);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('max_waitlist_reached');
  });
});

describe('Authentication API', () => {
  test('should register a new user', async () => {
    // Ensure there's room for a new member
    expect(members.length).toBe(0);
    
    // Register a new user
    const request = createMockRequest(
      'POST',
      '/api/v1/auth/register',
      {
        email: 'newuser@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'New',
        lastName: 'User'
      }
    );
    
    const response = await authHandler(request);
    expect(response.status).toBe(HttpStatus.CREATED);
    
    const data = await parseResponse(response);
    expect(data.success).toBe(true);
    expect(data.data.user.email).toBe('newuser@example.com');
    expect(data.data.token).toBeTruthy();
    
    // Verify user was added to members (since there's room)
    expect(members.length).toBe(1);
    expect(members[0].email).toBe('newuser@example.com');
    
    // Verify credentials were created
    expect(userCredentials.length).toBe(1);
    expect(userCredentials[0].email).toBe('newuser@example.com');
    expect(userCredentials[0].role).toBe(UserRole.MEMBER);
  });
  
  test('should route to waitlist when member limit reached', async () => {
    // Add max number of members
    for (let i = 0; i < MEMBERSHIP_LIMITS.ACTIVE_MEMBERS_MAX; i++) {
      members.push({
        id: uuidv4(),
        email: `member${i}@example.com`,
        firstName: 'Member',
        lastName: `${i}`,
        status: MemberStatus.ACTIVE,
        memberSince: new Date(),
        membershipId: `MEM-${100000 + i}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Register a new user
    const request = createMockRequest(
      'POST',
      '/api/v1/auth/register',
      {
        email: 'waitlistuser@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'Waitlist',
        lastName: 'User',
        reasonForJoining: 'Testing waitlist flow'
      }
    );
    
    const response = await authHandler(request);
    expect(response.status).toBe(HttpStatus.CREATED);
    
    const data = await parseResponse(response);
    expect(data.success).toBe(true);
    expect(data.data.user.email).toBe('waitlistuser@example.com');
    expect(data.data.user.role).toBe(UserRole.WAITLIST);
    
    // Verify user was added to waitlist instead of members
    expect(members.length).toBe(MEMBERSHIP_LIMITS.ACTIVE_MEMBERS_MAX);
    expect(waitlistMembers.length).toBe(1);
    expect(waitlistMembers[0].email).toBe('waitlistuser@example.com');
  });
  
  test('should handle login/logout flow', async () => {
    // Set up a user
    const userId = uuidv4();
    const userPassword = 'Password123!';
    const passwordSalt = 'test-salt';
    
    // Function to simulate password hashing (simplified for testing)
    const hashPassword = (password: string, salt: string) => {
      return `hashed:${password}:${salt}`;
    };
    
    userCredentials.push({
      id: userId,
      email: 'logintest@example.com',
      passwordHash: hashPassword(userPassword, passwordSalt),
      passwordSalt: passwordSalt,
      role: UserRole.MEMBER
    });
    
    members.push({
      id: userId,
      email: 'logintest@example.com',
      firstName: 'Login',
      lastName: 'Test',
      status: MemberStatus.ACTIVE,
      memberSince: new Date(),
      membershipId: 'MEM-123456',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Mock the password verification
    (global as any).verifyPassword = jest.fn((password, hash, salt) => {
      return hash === hashPassword(password, salt);
    });
    
    // 1. Login
    const loginRequest = createMockRequest(
      'POST',
      '/api/v1/auth/login',
      {
        email: 'logintest@example.com',
        password: userPassword
      }
    );
    
    const loginResponse = await authHandler(loginRequest);
    expect(loginResponse.status).toBe(HttpStatus.OK);
    
    const loginData = await parseResponse(loginResponse);
    expect(loginData.success).toBe(true);
    expect(loginData.data.user.email).toBe('logintest@example.com');
    expect(loginData.data.token).toBeTruthy();
    
    // Verify session was created
    expect(activeSessions.length).toBe(1);
    expect(activeSessions[0].user.id).toBe(userId);
    
    // 2. Get token for logout
    const token = loginData.data.token;
    
    // 3. Logout
    const logoutRequest = createMockRequest(
      'POST',
      '/api/v1/auth/logout',
      {},
      {
        'Authorization': `Bearer ${token}`
      }
    );
    
    const logoutResponse = await authHandler(logoutRequest);
    expect(logoutResponse.status).toBe(HttpStatus.OK);
    
    // Verify session was removed
    expect(activeSessions.length).toBe(0);
  });
  
  test('should reject login with invalid credentials', async () => {
    // Set up a user
    userCredentials.push({
      id: uuidv4(),
      email: 'security@example.com',
      passwordHash: 'hashed:RealPassword123!:salt',
      passwordSalt: 'salt',
      role: UserRole.MEMBER
    });
    
    // Mock password verification to fail
    (global as any).verifyPassword = jest.fn(() => false);
    
    // Attempt login with wrong password
    const request = createMockRequest(
      'POST',
      '/api/v1/auth/login',
      {
        email: 'security@example.com',
        password: 'WrongPassword123!'
      }
    );
    
    const response = await authHandler(request);
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    
    const data = await parseResponse(response);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('invalid_credentials');
    
    // Verify no session was created
    expect(activeSessions.length).toBe(0);
  });
  
  test('should handle admin role permissions correctly', async () => {
    // Create a regular admin and a super admin
    const regularAdminId = uuidv4();
    const superAdminId = uuidv4();
    const now = new Date();
    
    // Regular admin
    adminUsers.push({
      id: regularAdminId,
      email: 'regularadmin@example.com',
      firstName: 'Regular',
      lastName: 'Admin',
      role: UserRole.ADMIN,
      adminRole: AdminRole.MEMBERSHIP_ADMIN,
      permissions: [
        Permission.VIEW_MEMBERS,
        Permission.CREATE_MEMBER,
        Permission.UPDATE_MEMBER,
        Permission.VIEW_WAITLIST,
        Permission.UPDATE_WAITLIST
      ],
      createdAt: now,
      updatedAt: now
    });
    
    userCredentials.push({
      id: regularAdminId,
      email: 'regularadmin@example.com',
      passwordHash: 'mock-hash',
      passwordSalt: 'mock-salt',
      role: UserRole.ADMIN,
      adminRole: AdminRole.MEMBERSHIP_ADMIN
    });
    
    // Super admin
    adminUsers.push({
      id: superAdminId,
      email: 'superadmin@example.com',
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.ADMIN,
      adminRole: AdminRole.SUPER_ADMIN,
      permissions: [
        Permission.VIEW_MEMBERS,
        Permission.CREATE_MEMBER,
        Permission.UPDATE_MEMBER,
        Permission.DELETE_MEMBER,
        Permission.VIEW_WAITLIST,
        Permission.UPDATE_WAITLIST,
        Permission.APPROVE_WAITLIST,
        Permission.ASSIGN_ADMIN,
        Permission.REVOKE_ADMIN,
        Permission.SYSTEM_SETTINGS
      ],
      createdAt: now,
      updatedAt: now
    });
    
    userCredentials.push({
      id: superAdminId,
      email: 'superadmin@example.com',
      passwordHash: 'mock-hash',
      passwordSalt: 'mock-salt',
      role: UserRole.ADMIN,
      adminRole: AdminRole.SUPER_ADMIN
    });
    
    // Mock login for both admins
    const regularAdminToken = 'regular-admin-token';
    const superAdminToken = 'super-admin-token';
    
    activeSessions.push({
      user: {
        id: regularAdminId,
        email: 'regularadmin@example.com',
        role: UserRole.ADMIN,
        adminRole: AdminRole.MEMBERSHIP_ADMIN,
        permissions: adminUsers[0].permissions
      },
      token: regularAdminToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: now
    });
    
    activeSessions.push({
      user: {
        id: superAdminId,
        email: 'superadmin@example.com',
        role: UserRole.ADMIN,
        adminRole: AdminRole.SUPER_ADMIN,
        permissions: adminUsers[1].permissions
      },
      token: superAdminToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: now
    });
    
    // Test 1: Super admin can create another admin
    const createAdminRequest = createMockRequest(
      'POST',
      '/api/v1/auth/register-admin',
      {
        email: 'newadmin@example.com',
        password: 'Admin123!',
        confirmPassword: 'Admin123!',
        firstName: 'New',
        lastName: 'Admin',
        adminRole: AdminRole.CONTENT_ADMIN
      },
      {
        'Authorization': `Bearer ${superAdminToken}`
      }
    );
    
    const createAdminResponse = await authHandler(createAdminRequest);
    expect(createAdminResponse.status).toBe(HttpStatus.CREATED);
    
    // Verify admin was created
    expect(adminUsers.length).toBe(3);
    expect(userCredentials.length).toBe(3);
    expect(userCredentials[2].email).toBe('newadmin@example.com');
    expect(userCredentials[2].role).toBe(UserRole.ADMIN);
    expect(userCredentials[2].adminRole).toBe(AdminRole.CONTENT_ADMIN);
    
    // Test 2: Regular admin cannot create a super admin
    const attemptSuperAdminRequest = createMockRequest(
      'POST',
      '/api/v1/auth/register-admin',
      {
        email: 'attemptsuper@example.com',
        password: 'Admin123!',
        confirmPassword: 'Admin123!',
        firstName: 'Attempt',
        lastName: 'Super',
        adminRole: AdminRole.SUPER_ADMIN
      },
      {
        'Authorization': `Bearer ${regularAdminToken}`
      }
    );
    
    const attemptSuperAdminResponse = await authHandler(attemptSuperAdminRequest);
    expect(attemptSuperAdminResponse.status).toBe(HttpStatus.FORBIDDEN);
    
    // Verify no new admin was created
    expect(adminUsers.length).toBe(3);
    expect(userCredentials.length).toBe(3);
    
    // Test 3: Permission checks for member deletion
    // Add a test member
    const testMemberId = uuidv4();
    members.push({
      id: testMemberId,
      email: 'testmember@example.com',
      firstName: 'Test',
      lastName: 'Member',
      status: MemberStatus.ACTIVE,
      memberSince: new Date(),
      membershipId: `MEM-111111`,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Regular admin attempts to delete (should fail)
    const regularDeleteRequest = createMockRequest(
      'DELETE',
      `/api/v1/members/${testMemberId}`,
      undefined,
      {
        'Authorization': `Bearer ${regularAdminToken}`
      }
    );
    
    const regularDeleteResponse = await deleteMember(regularDeleteRequest);
    expect(regularDeleteResponse.status).toBe(HttpStatus.UNAUTHORIZED);
    
    // Super admin attempts to delete (should succeed)
    const superDeleteRequest = createMockRequest(
      'DELETE',
      `/api/v1/members/${testMemberId}`,
      undefined,
      {
        'Authorization': `Bearer ${superAdminToken}`
      }
    );
    
    const superDeleteResponse = await deleteMember(superDeleteRequest);
    expect(superDeleteResponse.status).toBe(HttpStatus.OK);
    
    // Verify member was deleted
    expect(members.length).toBe(0);
  });
  
  test('should handle token expiration and refresh', async () => {
    // Setup user with soon-to-expire token
    const userId = uuidv4();
    const now = new Date();
    
    userCredentials.push({
      id: userId,
      email: 'expiring@example.com',
      passwordHash: 'mock-hash',
      passwordSalt: 'mock-salt',
      role: UserRole.MEMBER
    });
    
    members.push({
      id: userId,
      email: 'expiring@example.com',
      firstName: 'Expiring',
      lastName: 'Token',
      status: MemberStatus.ACTIVE,
      memberSince: now,
      membershipId: 'MEM-987654',
      createdAt: now,
      updatedAt: now
    });
    
    // Create an expired token
    const expiredToken = 'expired-token';
    activeSessions.push({
      user: {
        id: userId,
        email: 'expiring@example.com',
        role: UserRole.MEMBER,
        permissions: [Permission.VIEW_OWN_PROFILE, Permission.UPDATE_OWN_PROFILE]
      },
      token: expiredToken,
      expiresAt: new Date(Date.now() - 1000), // Already expired
      createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000) // Created 25 hours ago
    });
    
    // Create an almost-expired token
    const almostExpiredToken = 'almost-expired-token';
    activeSessions.push({
      user: {
        id: userId,
        email: 'expiring@example.com',
        role: UserRole.MEMBER,
        permissions: [Permission.VIEW_OWN_PROFILE, Permission.UPDATE_OWN_PROFILE]
      },
      token: almostExpiredToken,
      expiresAt: new Date(Date.now() + 60 * 1000), // Expires in 1 minute
      createdAt: new Date(Date.now() - 23.9 * 60 * 60 * 1000) // Created 23.9 hours ago
    });
    
    // Test 1: Expired token is rejected
    const expiredRequest = createMockRequest(
      'GET',
      '/api/v1/members',
      undefined,
      {
        'Authorization': `Bearer ${expiredToken}`
      }
    );
    
    const expiredResponse = await getMembers(expiredRequest);
    expect(expiredResponse.status).toBe(HttpStatus.UNAUTHORIZED);
    
    // Test 2: Almost expired token works for API calls
    const almostExpiredRequest = createMockRequest(
      'GET',
      '/api/v1/members',
      undefined,
      {
        'Authorization': `Bearer ${almostExpiredToken}`
      }
    );
    
    // Mock getActiveSession to return valid session for the API call
    (global as any).getActiveSession = jest.fn((token) => {
      if (token === almostExpiredToken) {
        return activeSessions[1];
      }
      return null;
    });
    
    const almostExpiredResponse = await getMembers(almostExpiredRequest);
    expect(almostExpiredResponse.status).toBe(HttpStatus.OK);
    
    // Test 3: Token refresh creates new token
    const refreshRequest = createMockRequest(
      'POST',
      '/api/v1/auth/refresh',
      {},
      {
        'Authorization': `Bearer ${almostExpiredToken}`
      }
    );
    
    // Generate a new token when refreshing
    const newToken = 'refreshed-token-' + Date.now();
    (global as any).generateToken = jest.fn(() => newToken);
    
    const refreshResponse = await authHandler(refreshRequest);
    expect(refreshResponse.status).toBe(HttpStatus.OK);
    
    const refreshData = await parseResponse(refreshResponse);
    expect(refreshData.success).toBe(true);
    expect(refreshData.data.token).toBe(newToken);
    
    // Verify old token was invalidated
    expect(activeSessions.some(s => s.token === almostExpiredToken)).toBe(false);
    
    // Verify new token is valid
    expect(activeSessions.some(s => s.token === newToken)).toBe(true);
    
    // Verify the new expiration is about 24 hours in the future
    const newSession = activeSessions.find(s => s.token === newToken);
    const expiryDiff = newSession!.expiresAt.getTime() - Date.now();
    expect(expiryDiff).toBeGreaterThan(23 * 60 * 60 * 1000); // At least 23 hours
    expect(expiryDiff).toBeLessThan(25 * 60 * 60 * 1000); // Less than 25 hours
  });
});
