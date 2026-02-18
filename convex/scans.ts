import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/** Save a scan to the database */
export const saveScan = mutation({
  args: {
    clerkId: v.string(),
    cloudType: v.string(),
    cloudId: v.optional(v.string()),
    emoji: v.string(),
    description: v.optional(v.string()),
    rarity: v.string(),
    points: v.number(),
    mood: v.optional(v.string()),
    funFacts: v.optional(v.array(v.string())),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('scans', {
      userId: args.clerkId,
      cloudType: args.cloudType,
      cloudId: args.cloudId,
      emoji: args.emoji,
      description: args.description,
      rarity: args.rarity,
      points: args.points,
      mood: args.mood,
      funFacts: args.funFacts,
      imageUrl: args.imageUrl,
      scannedAt: Date.now(),
    });
    return id;
  },
});

/** Get all scans for a user */
export const getUserScans = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('scans')
      .withIndex('by_userId', q => q.eq('userId', args.clerkId))
      .order('desc')
      .collect();
  },
});

/** Get scan count for a user */
export const getScanCount = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const scans = await ctx.db
      .query('scans')
      .withIndex('by_userId', q => q.eq('userId', args.clerkId))
      .collect();
    return scans.length;
  },
});
