import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/** Save a scan to the database */
export const saveScan = mutation({
  args: {
    clerkId: v.string(),
    cloudType: v.string(),
    emoji: v.string(),
    rarity: v.string(),
    points: v.number(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('scans', {
      userId: args.clerkId,
      cloudType: args.cloudType,
      emoji: args.emoji,
      rarity: args.rarity,
      points: args.points,
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
