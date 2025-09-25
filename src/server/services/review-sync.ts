import { db as prisma } from "~/server/db";
import { hostawayService, type HostawayReview } from "./hostaway";

interface SyncResult {
  syncedCount: number;
  errorCount: number;
  totalFetched: number;
  errors: Array<{ reviewId: string; error: string }>;
}

export class ReviewSyncService {
  async syncHostawayReviews(): Promise<SyncResult> {
    console.log("Starting Hostaway reviews sync...");

    const result: SyncResult = {
      syncedCount: 0,
      errorCount: 0,
      totalFetched: 0,
      errors: [],
    };

    try {
      const hostawayReviews = await hostawayService.fetchAllReviews();
      result.totalFetched = hostawayReviews.length;

      console.log(`Fetched ${hostawayReviews.length} reviews from Hostaway`);

      for (const hostawayReview of hostawayReviews) {
        try {
          await this.processHostawayReview(hostawayReview);
          result.syncedCount++;
        } catch (error) {
          result.errorCount++;
          result.errors.push({
            reviewId: hostawayReview.id.toString(),
            error: error instanceof Error ? error.message : "Unknown error",
          });
          console.error(`Error processing review ${hostawayReview.id}:`, error);
        }
      }

      console.log(
        `Sync completed: ${result.syncedCount} synced, ${result.errorCount} errors`,
      );
      return result;
    } catch (error) {
      console.error("Error in sync process:", error);
      throw error;
    }
  }

  /**
   * Process a single Hostaway review and sync to database
   */
  private async processHostawayReview(
    hostawayReview: HostawayReview,
  ): Promise<void> {
    const normalizedReview = hostawayService.normalizeReview(hostawayReview);

    const listing = await this.findOrCreateListing(normalizedReview);

    const property = await this.findMatchingProperty(
      hostawayReview,
      { ...listing, channel: listing.channel ?? "" }
    );

    await prisma.review.upsert({
      where: {
        externalId_source: {
          externalId: normalizedReview.externalId,
          source: normalizedReview.source,
        },
      },
      update: {
        listingId: listing.id,
        propertyId: property?.id ?? null,
        reviewType: normalizedReview.reviewType,
        channel: normalizedReview.channel,
        rating: normalizedReview.rating,
        title: normalizedReview.title,
        body: normalizedReview.body,
        authorName: normalizedReview.authorName,
        language: normalizedReview.language,
        createdAt: normalizedReview.createdAt,
        approved: normalizedReview.approved,
      },
      create: {
        ...normalizedReview,
        listingId: listing.id,
        propertyId: property?.id ?? null,
      },
    });
  }

  private async findOrCreateListing(normalizedReview: { listingId: string; channel: string }) {
    let listing = await prisma.listing.findFirst({
      where: { externalId: normalizedReview.listingId },
    });

    listing ??= await prisma.listing.create({
      data: {
        externalId: normalizedReview.listingId,
        name: `Hostaway Listing ${normalizedReview.listingId}`,
        channel: normalizedReview.channel,
      },
    });

    return listing;
  }

  /**
   * Try to find a matching property for the listing
   * This is a basic implementation - you might want to enhance this based on your business logic
   */
  private async findMatchingProperty(
    _hostawayReview: HostawayReview,
    _listing: { id: string; externalId: string; name: string; channel: string },
  ) {
    const property = await prisma.property.findFirst({
      where: {},
    });

    return property;
  }

  /**
   * Get sync statistics
   */
  async getSyncStats() {
    const totalReviews = await prisma.review.count();
    const hostawayReviews = await prisma.review.count({
      where: { source: "hostaway" },
    });
    const approvedReviews = await prisma.review.count({
      where: { approved: true },
    });
    const totalListings = await prisma.listing.count();

    return {
      totalReviews,
      hostawayReviews,
      approvedReviews,
      totalListings,
      pendingApproval: totalReviews - approvedReviews,
    };
  }

  /**
   * Clean up old reviews (optional utility)
   */
  async cleanupOldReviews(daysOld = 365) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const deletedCount = await prisma.review.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
        approved: false,
      },
    });

    return deletedCount.count;
  }
}

export const reviewSyncService = new ReviewSyncService();
