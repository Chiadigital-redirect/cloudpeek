import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    createdAt: v.number(),
  }).index('by_clerkId', ['clerkId']),

  scans: defineTable({
    userId: v.string(), // clerkId
    cloudType: v.string(),
    emoji: v.string(),
    rarity: v.string(),
    points: v.number(),
    imageUrl: v.optional(v.string()),
    scannedAt: v.number(),
  }).index('by_userId', ['userId']),
});
