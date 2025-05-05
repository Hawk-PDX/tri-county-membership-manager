/**
 * API routes for member management
 */

import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this package
import { 
  apiHandler, 
  createSuccessResponse, 
  createErrorResponse 
} from '@/utils/api-utils';
import { HttpStatus } from '@/types/api';
import { 
  Member, 
  MemberStatus, 
  MembersResponse, 
  MemberRequest,
  MEMBERSHIP_LIMITS
} from '@/types/members';
import { 
  Permission, 
  UserRole, 
  Session 
} from '@/types/auth';

// Mock database (would be replaced with real database in production)
let members: Member[] = [];

// Mock authentication function (would be replaced with real auth in production)
async function getSession(request: NextRequest): Promise<Session | null> {
  // In a real implementation, this would validate the auth token from headers
  // and return the user session
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  // Mock session for development
  return {
    user: {
      id: '1',
      email: 'admin@example.com',
      role: UserRole.ADMIN,
      permissions: [
        Permission.VIEW_MEMBERS,
        Permission.CREATE_MEMBER,
        Permission.UPDATE_MEMBER,
        Permission.DELETE_MEMBER
      ]
    },
    token: authHeader.split(' ')[1],
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    createdAt: new Date()
  };
}

// Authentication middleware
async function requirePermission(
  request: NextRequest,
  permission: Permission
): Promise<{ isAuthorized: boolean; session: Session | null }> {
  const session = await getSession(request);
  
  if (!session) {
    return { isAuthorized: false, session: null };
  }
  
  const hasPermission = session.user.permissions.includes(permission);
  
  return {
    isAuthorized: hasPermission,
    session
  };
}

/**
 * GET handler for retrieving members
 * Supports pagination and filtering
 */
export async function GET(request: NextRequest) {
  return apiHandler<MembersResponse>(request, async () => {
    // Check permissions
    const { isAuthorized, session } = await requirePermission(
      request, 
      Permission.VIEW_MEMBERS
    );
    
    if (!isAuthorized) {
      return createErrorResponse(
        'Unauthorized access', 
        HttpStatus.UNAUTHORIZED,
        'unauthorized'
      );
    }
    
    // Parse pagination parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const status = searchParams.get('status') as MemberStatus | null;
    
    // Apply filters (basic implementation)
    let filteredMembers = [...members];
    if (status) {
      filteredMembers = filteredMembers.filter(member => member.status === status);
    }
    
    // Apply pagination
    const paginatedMembers = filteredMembers.slice(offset, offset + limit);
    
    // Return response
    return createSuccessResponse<MembersResponse>(
      {
        members: paginatedMembers,
        total: filteredMembers.length,
        limit,
        offset
      },
      HttpStatus.OK
    );
  });
}

/**
 * POST handler for creating a new member
 */
export async function POST(request: NextRequest) {
  return apiHandler<Member>(request, async () => {
    // Check permissions
    const { isAuthorized, session } = await requirePermission(
      request, 
      Permission.CREATE_MEMBER
    );
    
    if (!isAuthorized) {
      return createErrorResponse(
        'Unauthorized access', 
        HttpStatus.UNAUTHORIZED,
        'unauthorized'
      );
    }
    
    // Check active member limit
    if (members.filter(m => m.status === MemberStatus.ACTIVE).length >= MEMBERSHIP_LIMITS.ACTIVE_MEMBERS_MAX) {
      return createErrorResponse(
        'Maximum number of active members reached',
        HttpStatus.CONFLICT,
        'max_members_reached'
      );
    }
    
    // Parse request body
    const memberData: MemberRequest = await request.json();
    
    // Basic validation
    if (!memberData.email || !memberData.firstName || !memberData.lastName) {
      return createErrorResponse(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
        'invalid_request'
      );
    }
    
    // Check if email is already in use
    if (members.some(member => member.email === memberData.email)) {
      return createErrorResponse(
        'Email already in use',
        HttpStatus.CONFLICT,
        'email_conflict'
      );
    }
    
    // Create new member
    const now = new Date();
    const newMember: Member = {
      id: uuidv4(),
      email: memberData.email,
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      phone: memberData.phone,
      status: MemberStatus.ACTIVE,
      memberSince: now,
      membershipId: `MEM-${Math.floor(100000 + Math.random() * 900000)}`, // Simple ID generation
      profilePicture: memberData.profilePicture,
      bio: memberData.bio,
      address: memberData.address,
      preferences: memberData.preferences || {
        receiveEmails: true,
        receiveNotifications: true,
        isPublicProfile: false
      },
      createdAt: now,
      updatedAt: now
    };
    
    // Add to "database"
    members.push(newMember);
    
    return createSuccessResponse<Member>(
      newMember,
      HttpStatus.CREATED
    );
  });
}

/**
 * PATCH handler for updating a member
 */
export async function PATCH(request: NextRequest) {
  return apiHandler<Member>(request, async () => {
    // Get member ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const memberId = pathParts[pathParts.length - 1];
    
    if (!memberId || memberId === 'members') {
      return createErrorResponse(
        'Member ID is required',
        HttpStatus.BAD_REQUEST,
        'missing_id'
      );
    }
    
    // Check permissions
    const { isAuthorized, session } = await requirePermission(
      request, 
      Permission.UPDATE_MEMBER
    );
    
    // Allow members to update their own profile
    const isSelfUpdate = session?.user.role === UserRole.MEMBER && 
                        session.user.id === memberId;
                        
    if (!isAuthorized && !isSelfUpdate) {
      return createErrorResponse(
        'Unauthorized access', 
        HttpStatus.UNAUTHORIZED,
        'unauthorized'
      );
    }
    
    // Find member
    const memberIndex = members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      return createErrorResponse(
        'Member not found',
        HttpStatus.NOT_FOUND,
        'not_found'
      );
    }
    
    // Parse request body
    const updates: Partial<MemberRequest> = await request.json();
    
    // Apply updates (with restrictions for self-update)
    const updatedMember = { ...members[memberIndex] };
    
    if (isSelfUpdate) {
      // Self-update restrictions - only allow certain fields
      if (updates.firstName) updatedMember.firstName = updates.firstName;
      if (updates.lastName) updatedMember.lastName = updates.lastName;
      if (updates.phone) updatedMember.phone = updates.phone;
      if (updates.bio) updatedMember.bio = updates.bio;
      if (updates.profilePicture) updatedMember.profilePicture = updates.profilePicture;
      if (updates.address) updatedMember.address = updates.address;
      if (updates.preferences) updatedMember.preferences = { 
        ...updatedMember.preferences, 
        ...updates.preferences 
      };
    } else {
      // Admin update - allow all fields
      if (updates.email) updatedMember.email = updates.email;
      if (updates.firstName) updatedMember.firstName = updates.firstName;
      if (updates.lastName) updatedMember.lastName = updates.lastName;
      if (updates.phone) updatedMember.phone = updates.phone;
      if (updates.bio) updatedMember.bio = updates.bio;
      if (updates.profilePicture) updatedMember.profilePicture = updates.profilePicture;
      if (updates.address) updatedMember.address = updates.address;
      if (updates.preferences) updatedMember.preferences = { 
        ...updatedMember.preferences, 
        ...updates.preferences 
      };
    }
    
    // Update timestamp
    updatedMember.updatedAt = new Date();
    
    // Save to "database"
    members[memberIndex] = updatedMember;
    
    return createSuccessResponse<Member>(
      updatedMember,
      HttpStatus.OK
    );
  });
}

/**
 * DELETE handler for removing a member
 */
export async function DELETE(request: NextRequest) {
  return apiHandler(request, async () => {
    // Get member ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const memberId = pathParts[pathParts.length - 1];
    
    if (!memberId || memberId === 'members') {
      return createErrorResponse(
        'Member ID is required',
        HttpStatus.BAD_REQUEST,
        'missing_id'
      );
    }
    
    // Check permissions
    const { isAuthorized } = await requirePermission(
      request, 
      Permission.DELETE_MEMBER
    );
    
    if (!isAuthorized) {
      return createErrorResponse(
        'Unauthorized access', 
        HttpStatus.UNAUTHORIZED,
        'unauthorized'
      );
    }
    
    // Find member
    const memberIndex = members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      return createErrorResponse(
        'Member not found',
        HttpStatus.NOT_FOUND,
        'not_found'
      );
    }
    
    // Get the member for response
    const deletedMember = members[memberIndex];
    
    // Remove from "database"
    members.splice(memberIndex, 1);
    
    // Return success with no content
    return createSuccessResponse(
      { id: memberId, deleted: true },
      HttpStatus.OK
    );
  });
}
