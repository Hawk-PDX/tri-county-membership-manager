/**
 * API routes for waitlist management
 */

import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { 
  apiHandler, 
  createSuccessResponse, 
  createErrorResponse 
} from '@/utils/api-utils';
import { HttpStatus } from '@/types/api';
import { 
  WaitlistMember, 
  WaitlistStatus, 
  WaitlistResponse, 
  WaitlistRequest,
  Member,
  MemberStatus,
  MemberRequest,
  MEMBERSHIP_LIMITS
} from '@/types/members';
import { 
  Permission, 
  UserRole, 
  Session 
} from '@/types/auth';

// Mock database (would be replaced with real database in production)
let waitlistMembers: WaitlistMember[] = [];

// Reference to the members array (simulating database relationship)
// In a real application, this would be handled by database queries
declare const members: Member[];

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
        Permission.VIEW_WAITLIST,
        Permission.UPDATE_WAITLIST,
        Permission.APPROVE_WAITLIST,
        Permission.CREATE_MEMBER
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
 * Recalculate positions for all waitlist members
 * Called whenever waitlist members are added, removed, or status changes
 */
function recalculateWaitlistPositions() {
  // Only assign positions to PENDING members
  const pendingMembers = waitlistMembers
    .filter(m => m.status === WaitlistStatus.PENDING)
    .sort((a, b) => a.applicationDate.getTime() - b.applicationDate.getTime());
  
  // Assign positions based on order
  pendingMembers.forEach((member, index) => {
    member.position = index + 1;
  });
}

/**
 * GET handler for retrieving waitlist members
 * Supports pagination and filtering
 */
export async function GET(request: NextRequest) {
  return apiHandler(request, async () => {
    // Check permissions
    const { isAuthorized } = await requirePermission(
      request, 
      Permission.VIEW_WAITLIST
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
    const status = searchParams.get('status') as WaitlistStatus | null;
    
    // Apply filters (basic implementation)
    let filteredMembers = [...waitlistMembers];
    if (status) {
      filteredMembers = filteredMembers.filter(member => member.status === status);
    }
    
    // Sort by position for PENDING, then by application date for others
    filteredMembers.sort((a, b) => {
      if (a.status === WaitlistStatus.PENDING && b.status === WaitlistStatus.PENDING) {
        return a.position - b.position;
      }
      return a.applicationDate.getTime() - b.applicationDate.getTime();
    });
    
    // Apply pagination
    const paginatedMembers = filteredMembers.slice(offset, offset + limit);
    
    // Return response
    return createSuccessResponse<WaitlistResponse>(
      {
        waitlistMembers: paginatedMembers,
        total: filteredMembers.length,
        limit,
        offset
      },
      HttpStatus.OK
    );
  });
}

/**
 * POST handler for adding a new application to waitlist
 */
export async function POST(request: NextRequest) {
  return apiHandler(request, async () => {
    // Parse request body
    const applicationData: WaitlistRequest = await request.json();
    
    // Basic validation
    if (!applicationData.email || !applicationData.firstName || !applicationData.lastName) {
      return createErrorResponse(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
        'invalid_request'
      );
    }
    
    // Check if email is already in use in waitlist
    if (waitlistMembers.some(member => member.email === applicationData.email)) {
      return createErrorResponse(
        'Email already in waitlist',
        HttpStatus.CONFLICT,
        'email_conflict'
      );
    }
    
    // Check if email is already an active member
    if (typeof members !== 'undefined' && members.some(member => member.email === applicationData.email)) {
      return createErrorResponse(
        'Email already belongs to an active member',
        HttpStatus.CONFLICT,
        'email_conflict'
      );
    }
    
    // Check waitlist limit
    const pendingCount = waitlistMembers.filter(
      m => m.status === WaitlistStatus.PENDING
    ).length;
    
    if (pendingCount >= MEMBERSHIP_LIMITS.WAITLIST_MAX) {
      return createErrorResponse(
        'Maximum waitlist capacity reached',
        HttpStatus.CONFLICT,
        'max_waitlist_reached'
      );
    }
    
    // Create new waitlist member
    const now = new Date();
    const newWaitlistMember: WaitlistMember = {
      id: uuidv4(),
      email: applicationData.email,
      firstName: applicationData.firstName,
      lastName: applicationData.lastName,
      phone: applicationData.phone,
      status: WaitlistStatus.PENDING,
      applicationDate: now,
      position: pendingCount + 1, // Will be recalculated 
      reasonForJoining: applicationData.reasonForJoining,
      referredBy: applicationData.referredBy,
      createdAt: now,
      updatedAt: now
    };
    
    // Add to "database"
    waitlistMembers.push(newWaitlistMember);
    
    // Recalculate positions
    recalculateWaitlistPositions();
    
    return createSuccessResponse<WaitlistMember>(
      newWaitlistMember,
      HttpStatus.CREATED
    );
  });
}

/**
 * PATCH handler for updating a waitlist member or changing status
 */
export async function PATCH(request: NextRequest) {
  return apiHandler(request, async () => {
    // Get waitlist member ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const memberId = pathParts[pathParts.length - 1];
    
    if (!memberId || memberId === 'waitlist') {
      return createErrorResponse(
        'Waitlist member ID is required',
        HttpStatus.BAD_REQUEST,
        'missing_id'
      );
    }
    
    // Check permissions
    const { isAuthorized, session } = await requirePermission(
      request, 
      Permission.UPDATE_WAITLIST
    );
    
    // Allow waitlist members to update their own basic info
    const isSelfUpdate = session?.user.role === UserRole.WAITLIST && 
                        session.user.id === memberId;
                        
    if (!isAuthorized && !isSelfUpdate) {
      return createErrorResponse(
        'Unauthorized access', 
        HttpStatus.UNAUTHORIZED,
        'unauthorized'
      );
    }
    
    // Find waitlist member
    const memberIndex = waitlistMembers.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      return createErrorResponse(
        'Waitlist member not found',
        HttpStatus.NOT_FOUND,
        'not_found'
      );
    }
    
    // Parse request body
    const updateData = await request.json();
    
    // Check if this is a status change to APPROVED (promote to member)
    if (
      !isSelfUpdate && 
      updateData.status === WaitlistStatus.APPROVED && 
      waitlistMembers[memberIndex].status !== WaitlistStatus.APPROVED
    ) {
      // Check if user has permission to approve waitlist members
      const canApprove = await requirePermission(request, Permission.APPROVE_WAITLIST);
      if (!canApprove.isAuthorized) {
        return createErrorResponse(
          'Unauthorized to approve waitlist members',
          HttpStatus.FORBIDDEN,
          'unauthorized'
        );
      }
      
      // Check if we can add more active members
      if (
        typeof members !== 'undefined' && 
        members.filter(m => m.status === MemberStatus.ACTIVE).length >= MEMBERSHIP_LIMITS.ACTIVE_MEMBERS_MAX
      ) {
        return createErrorResponse(
          'Maximum number of active members reached',
          HttpStatus.CONFLICT,
          'max_members_reached'
        );
      }
      
      // Create a new member from waitlist member data
      const waitlistMember = waitlistMembers[memberIndex];
      const now = new Date();
      
      const newMember: Member = {
        id: uuidv4(),
        email: waitlistMember.email,
        firstName: waitlistMember.firstName,
        lastName: waitlistMember.lastName,
        phone: waitlistMember.phone,
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
      
      // Update waitlist status to APPROVED
      waitlistMembers[memberIndex].status = WaitlistStatus.APPROVED;
      waitlistMembers[memberIndex].updatedAt = now;
      
      // Add new member to members list
      if (typeof members !== 'undefined') {
        members.push(newMember);
      }
      
      // Recalculate waitlist positions
      recalculateWaitlistPositions();
      
      return createSuccessResponse<Member>(
        newMember,
        HttpStatus.CREATED,
        { moved: true, from: 'waitlist', to: 'member' }
      );
    }
    
    // Regular update of waitlist member information
    const updatedMember = { ...waitlistMembers[memberIndex] };
    
    if (isSelfUpdate) {
      // Self-update restrictions - only allow certain fields
      if (updateData.firstName) updatedMember.firstName = updateData.firstName;
      if (updateData.lastName) updatedMember.lastName = updateData.lastName;
      if (updateData.phone) updatedMember.phone = updateData.phone;
      if (updateData.reasonForJoining) updatedMember.reasonForJoining = updateData.reasonForJoining;
    } else {
      // Admin update - allow all fields except status (handled separately)
      if (updateData.email) updatedMember.email = updateData.email;
      if (updateData.firstName) updatedMember.firstName = updateData.firstName;
      if (updateData.lastName) updatedMember.lastName = updateData.lastName;
      if (updateData.phone) updatedMember.phone = updateData.phone;
      if (updateData.reasonForJoining) updatedMember.reasonForJoining = updateData.reasonForJoining;
      if (updateData.referredBy) updatedMember.referredBy = updateData.referredBy;
      
      // Handle status change (other than APPROVED which was handled earlier)
      if (updateData.status && 
          updateData.status !== WaitlistStatus.APPROVED && 
          updatedMember.status !== updateData.status) {
        updatedMember.status = updateData.status;
        
        // Recalculate positions if status changes
        recalculateWaitlistPositions();
      }
    }
    
    // Update timestamp
    updatedMember.updatedAt = new Date();
    
    // Save to "database"
    waitlistMembers[memberIndex] = updatedMember;
    
    return createSuccessResponse<WaitlistMember>(
      updatedMember,
      HttpStatus.OK
    );
  });
}

/**
 * DELETE handler for removing a waitlist member
 */
export async function DELETE(request: NextRequest) {
  return apiHandler(request, async () => {
    // Get waitlist member ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const memberId = pathParts[pathParts.length - 1];
    
    if (!memberId || memberId === 'waitlist') {
      return createErrorResponse(
        'Waitlist member ID is required',
        HttpStatus.BAD_REQUEST,
        'missing_id'
      );
    }
    
    // Check permissions
    const { isAuthorized } = await requirePermission(
      request, 
      Permission.UPDATE_WAITLIST
    );
    
    if (!isAuthorized) {
      return createErrorResponse(
        'Unauthorized access', 
        HttpStatus.UNAUTHORIZED,
        'unauthorized'
      );
    }
    
    // Find waitlist member
    const memberIndex = waitlistMembers.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      return createErrorResponse(
        'Waitlist member not found',
        HttpStatus.NOT_FOUND,
        'not_found'
      );
    }
    
    // Store for response
    const deletedMemberId = waitlistMembers[memberIndex].id;
    
    // Remove from "database"
    waitlistMembers.splice(memberIndex, 1);
    
    // Recalculate positions
    recalculateWaitlistPositions();
    
    // Return success
    return createSuccessResponse(
      { id: deletedMemberId, deleted: true },
      HttpStatus.OK
    );
  });
}

