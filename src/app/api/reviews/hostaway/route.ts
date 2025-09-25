import { NextRequest, NextResponse } from "next/server";
import { hostawayService } from "~/server/services/hostaway";
import { db as prisma } from "~/server/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "100");
    const offset = parseInt(searchParams.get("offset") ?? "0");
    const includeDb = searchParams.get("includeDb") === "true";

    const hostawayResponse = await hostawayService.fetchReviews(limit, offset);

    const dbReviews = includeDb
      ? await prisma.review.findMany({
          where: { source: "hostaway" },
          include: {
            listing: true,
            property: true,
            categories: true,
          },
          orderBy: { createdAt: "desc" },
        })
      : [];

    const normalizedReviews = hostawayResponse.result.map((review) =>
      hostawayService.normalizeReview(review),
    );

    const processedReviews = await Promise.all(
      normalizedReviews.map(async (review) => {
        try {
          let listing = await prisma.listing.findFirst({
            where: { externalId: review.listingId },
          });

          if (!listing) {
            listing = await prisma.listing.create({
              data: {
                externalId: review.listingId,
                name: `Hostaway Listing ${review.listingId}`,
                channel: review.channel,
              },
            });
          }

          const property = await prisma.property.findFirst({
            where: {
              OR: [
                {
                  id: review.propertyId ?? "",
                },
                {
                  slug: review.propertyId ?? "",
                },
              ],
            },
          });

          return {
            ...review,
            listingId: listing.id,
            propertyId: property?.id ?? null,
          };
        } catch (error) {
          console.error(`Error processing review ${review.externalId}:`, error);
          return review;
        }
      }),
    );

    return NextResponse.json({
      success: true,
      data: [...processedReviews, ...(includeDb ? dbReviews : [])],
      pagination: {
        totalCount: hostawayResponse.totalCount,
        limit: hostawayResponse.limit,
        offset: hostawayResponse.offset,
      },
      source: "hostaway",
    });
  } catch (error) {
    console.error("Error fetching Hostaway reviews:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        source: "hostaway",
      },
      { status: 500 },
    );
  }
}
