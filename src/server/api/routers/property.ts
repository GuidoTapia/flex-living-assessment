import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  findPlaceByAddress,
  normalizePlaceData,
  isConfigured,
} from "~/server/services/google-places";

export const propertyRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().nullish(),
        search: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        ratingMin: z.number().min(1).max(5).optional(),
        priceMin: z.number().min(0).optional(),
        priceMax: z.number().min(0).optional(),
        guests: z.number().min(1).optional(),
        bedrooms: z.number().min(1).optional(),
        bathrooms: z.number().min(1).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        limit,
        cursor,
        search,
        city,
        country,
        ratingMin,
        priceMin,
        priceMax,
        guests,
        bedrooms,
        bathrooms,
      } = input;

      const properties = await ctx.db.property.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          ...(search && {
            OR: [
              { name: { contains: search } },
              { address: { contains: search } },
              { city: { contains: search } },
            ],
          }),
          ...(city && { city: { contains: city } }),
          ...(country && { country: { contains: country } }),
          ...(ratingMin && { ratingAvg: { gte: ratingMin } }),
          ...(priceMin && { price: { gte: priceMin } }),
          ...(priceMax && { price: { lte: priceMax } }),
          ...(guests && { guests: { gte: guests } }),
          ...(bedrooms && { bedrooms: { gte: bedrooms } }),
          ...(bathrooms && { bathrooms: { gte: bathrooms } }),
        },
        select: {
          id: true,
          slug: true,
          name: true,
          address: true,
          city: true,
          country: true,
          ratingAvg: true,
          price: true,
          bedrooms: true,
          bathrooms: true,
          guests: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          reviews: {
            where: { approved: true },
            select: {
              id: true,
              rating: true,
              title: true,
              body: true,
              authorName: true,
              createdAt: true,
              channel: true,
            },
            orderBy: { createdAt: "desc" },
          },
          _count: {
            select: {
              reviews: {
                where: { approved: true },
              },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (properties.length > limit) {
        const nextItem = properties.pop();
        nextCursor = nextItem?.id;
      }

      const propertiesWithMetrics = properties.map((property) => {
        const approvedReviews = property.reviews;
        const totalReviews = approvedReviews.length;
        const avgRating =
          totalReviews > 0
            ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) /
              totalReviews
            : 0;

        return {
          ...property,
          ratingAvg: avgRating,
          reviewCount: totalReviews,
        };
      });

      return {
        properties: propertiesWithMetrics,
        nextCursor,
      };
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        search: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        ratingMin: z.number().min(1).max(5).optional(),
        dateFrom: z.date().optional(),
        dateTo: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        limit,
        cursor,
        search,
        city,
        country,
        ratingMin,
        dateFrom,
        dateTo,
      } = input;

      const properties = await ctx.db.property.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          ...(search && {
            OR: [
              { name: { contains: search } },
              { address: { contains: search } },
              { city: { contains: search } },
            ],
          }),
          ...(city && { city }),
          ...(country && { country }),
          ...(ratingMin && { ratingAvg: { gte: ratingMin } }),
        },
        include: {
          reviews: {
            where: {
              ...(dateFrom && { createdAt: { gte: dateFrom } }),
              ...(dateTo && { createdAt: { lte: dateTo } }),
            },
            include: {
              listing: true,
              categories: true,
            },
          },
          _count: {
            select: {
              reviews: {
                where: {
                  ...(dateFrom && { createdAt: { gte: dateFrom } }),
                  ...(dateTo && { createdAt: { lte: dateTo } }),
                },
              },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (properties.length > limit) {
        const nextItem = properties.pop();
        nextCursor = nextItem?.id;
      }

      const propertiesWithMetrics = properties.map((property) => {
        const reviews = property.reviews;
        const totalReviews = reviews.length;
        const approvedReviews = reviews.filter((r) => r.approved).length;
        const avgRating =
          reviews.length > 0
            ? reviews.reduce((sum: number, r) => sum + r.rating, 0) /
              reviews.length
            : 0;

        const channelStats = reviews.reduce(
          (acc: Record<string, number>, review) => {
            acc[review.channel] = (acc[review.channel] ?? 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        const categoryStats = reviews.reduce(
          (acc: Record<string, number>, review) => {
            review.categories.forEach((category) => {
              acc[category.name] = (acc[category.name] ?? 0) + 1;
            });
            return acc;
          },
          {} as Record<string, number>,
        );

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentReviews = reviews.filter(
          (r) => r.createdAt >= thirtyDaysAgo,
        ).length;

        return {
          ...property,
          metrics: {
            totalReviews,
            approvedReviews,
            pendingReviews: totalReviews - approvedReviews,
            avgRating,
            channelStats,
            categoryStats,
            recentReviews,
            approvalRate:
              totalReviews > 0 ? (approvedReviews / totalReviews) * 100 : 0,
          },
        };
      });

      return {
        properties: propertiesWithMetrics,
        nextCursor,
      };
    }),

  getBySlug: publicProcedure
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

      if (!property) {
        return null;
      }

      // Try to get Google Places data if API is configured
      let googlePlacesData = null;

      console.log("property.name", property.name);
      console.log("property.address", property.address);
      if (isConfigured() && property.name && property.address) {
        try {
          const googlePlace = await findPlaceByAddress(
            property.address,
            property.city ?? "",
            property.country ?? "",
          );
          console.log("googlePlace", googlePlace);
          if (googlePlace) {
            googlePlacesData = normalizePlaceData(googlePlace);
          }
        } catch (error) {
          console.warn("Failed to fetch Google Places data:", error);
        }
      }

      console.log("googlePlacesData", googlePlacesData);

      return {
        ...property,
        googlePlaces: googlePlacesData,
      };
    }),

  getPerformanceSummary: protectedProcedure
    .input(
      z.object({
        propertyId: z.string().optional(),
        dateFrom: z.date().optional(),
        dateTo: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { propertyId, dateFrom, dateTo } = input;

      const whereClause = {
        ...(propertyId && { propertyId }),
        ...(dateFrom && { createdAt: { gte: dateFrom } }),
        ...(dateTo && { createdAt: { lte: dateTo } }),
      };

      const [
        totalReviews,
        approvedReviews,
        avgRating,
        channelBreakdown,
        categoryBreakdown,
      ] = await Promise.all([
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

      const categoryMap = new Map<
        string,
        { count: number; totalRating: number }
      >();
      categoryBreakdown.forEach(
        (review: { rating: number; categories: Array<{ name: string }> }) => {
          review.categories.forEach((category: { name: string }) => {
            const existing = categoryMap.get(category.name) ?? {
              count: 0,
              totalRating: 0,
            };
            categoryMap.set(category.name, {
              count: existing.count + 1,
              totalRating: existing.totalRating + review.rating,
            });
          });
        },
      );

      const processedCategoryBreakdown = Array.from(categoryMap.entries()).map(
        ([name, data]) => ({
          name,
          count: data.count,
          avgRating: data.totalRating / data.count,
          percentage: totalReviews > 0 ? (data.count / totalReviews) * 100 : 0,
        }),
      );

      return {
        totalReviews,
        approvedReviews,
        pendingReviews: totalReviews - approvedReviews,
        avgRating: avgRating._avg.rating ?? 0,
        approvalRate:
          totalReviews > 0 ? (approvedReviews / totalReviews) * 100 : 0,
        channelBreakdown,
        categoryBreakdown: processedCategoryBreakdown,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        name: z.string(),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.property.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        slug: z.string().optional(),
        name: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      return await ctx.db.property.update({
        where: { id },
        data: updateData,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.property.delete({
        where: { id: input.id },
      });
    }),
});
