'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

/**
 * Invisible component that syncs the Clerk user to Convex on sign-in.
 * Mount this inside ConvexClientProvider + ClerkProvider.
 */
export default function UserSync() {
  const { user, isSignedIn } = useUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  useEffect(() => {
    if (isSignedIn && user) {
      const email = user.emailAddresses[0]?.emailAddress ?? '';
      createOrUpdateUser({ clerkId: user.id, email }).catch(console.error);
    }
  // Only re-run when user id changes (sign-in / sign-out)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, user?.id]);

  return null;
}
