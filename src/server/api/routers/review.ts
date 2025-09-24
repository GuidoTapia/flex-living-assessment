import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const reviewRouter = createTRPCRouter({
  
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        propertyId: z.string().optional(),
        listingId: z.string().optional(),
        approved: z.boolean().optional(),
        channel: z.string().optional(),
        ratingMin: z.number().min(1).max(5).optional(),
        ratingMax: z.number().min(1).max(5).optional(),
        categoryId: z.string().optional(),
        dateFrom: z.date().optional(),
        dateTo: z.date().optional(),
        sortBy: z.enum(["createdAt", "rating", "updatedAt"]).default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, propertyId, listingId, approved, channel, ratingMin, ratingMax, categoryId, dateFrom, dateTo, sortBy, sortOrder } = input;

      const reviews = await ctx.db.review.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          ...(propertyId && { propertyId }),
          ...(listingId && { listingId }),
          ...(approved !== undefined && { approved }),
          ...(channel && { channel }),
          ...(ratingMin && { rating: { gte: ratingMin } }),
          ...(ratingMax && { rating: { lte: ratingMax } }),
          ...(categoryId && { categories: { some: { id: categoryId } } }),
          ...(dateFrom && { createdAt: { gte: dateFrom } }),
          ...(dateTo && { createdAt: { lte: dateTo } }),
        },
        include: {
          listing: true,
          property: true,
          categories: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (reviews.length > limit) {
        const nextItem = reviews.pop();
        nextCursor = nextItem?.id;
      }

      return {
        reviews,
        nextCursor,
      };
    }),

  
  getByProperty: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const property = await ctx.db.property.findUnique({
        where: { slug: input.slug },
        include: {
          reviews: {
            where: { approved: true },
            include: {
              listing: true,
              categories: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      return property;
    }),

  
  getStats: protectedProcedure
    .input(
      z.object({
        propertyId: z.string().optional(),
        listingId: z.string().optional(),
        dateFrom: z.date().optional(),
        dateTo: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { propertyId, listingId, dateFrom, dateTo } = input;

      const whereClause = {
        ...(propertyId && { propertyId }),
        ...(listingId && { listingId }),
        ...(dateFrom && { createdAt: { gte: dateFrom } }),
        ...(dateTo && { createdAt: { lte: dateTo } }),
      };

      const [totalReviews, approvedReviews, avgRating, channelStats, categoryStats] = await Promise.all([
        ctx.db.review.count({ where: whereClause }),
        ctx.db.review.count({ where: { ...whereClause, approved: true } }),
        ctx.db.review.aggregate({
          where: whereClause,
          _avg: { rating: true },
        }),
        ctx.db.review.groupBy({
          by: ["channel"],
          where: whereClause,
          _count: { channel: true },
          _avg: { rating: true },
        }),
        ctx.db.review.findMany({
          where: whereClause,
          include: { categories: true },
        }),
      ]);

      
      const categoryMap = new Map<string, { count: number; totalRating: number; name: string }>();
      categoryStats.forEach((review: { rating: number; categories: Array<{ id: string; name: string }> }) => {
        review.categories.forEach((category: { id: string; name: string }) => {
          const existing = categoryMap.get(category.id) || { count: 0, totalRating: 0, name: category.name };
          categoryMap.set(category.id, {
            ...existing,
            count: existing.count + 1,
            totalRating: existing.totalRating + review.rating,
          });
        });
      });

      const processedCategoryStats = Array.from(categoryMap.values()).map((cat) => ({
        name: cat.name,
        count: cat.count,
        avgRating: cat.totalRating / cat.count,
      }));

      return {
        totalReviews,
        approvedReviews,
        pendingReviews: totalReviews - approvedReviews,
        avgRating: avgRating._avg.rating || 0,
        channelStats,
        categoryStats: processedCategoryStats,
      };
    }),

  
  updateApproval: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        approved: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.review.update({
        where: { id: input.id },
        data: { approved: input.approved },
      });
    }),

  
  bulkUpdateApproval: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
        approved: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.review.updateMany({
        where: { id: { in: input.ids } },
        data: { approved: input.approved },
      });
    }),

  
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.review.findUnique({
        where: { id: input.id },
        include: {
          listing: true,
          property: true,
          categories: true,
        },
      });
    }),
});
