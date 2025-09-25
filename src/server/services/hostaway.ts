import { env } from "~/env.js";

interface HostawayAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface HostawayReviewCategory {
  category: string;
  rating: number;
}

interface HostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: HostawayReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

interface HostawayReviewsResponse {
  result: HostawayReview[];
  totalCount: number;
  limit: number;
  offset: number;
}

class HostawayService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private readonly baseUrl = "https://api.hostaway.com/v1";
  private readonly accountId: string;
  private readonly apiKey: string;

  constructor() {
    this.accountId = env.HOSTAWAY_ACCOUNT_ID || "";
    this.apiKey = env.HOSTAWAY_API_KEY || "";
    
    if (!this.accountId || !this.apiKey) {
      console.warn("Hostaway API credentials not found. Hostaway integration will be disabled.");
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!(this.accountId && this.apiKey);
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  private async getAccessToken(): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error("Hostaway API credentials not configured");
    }
    const now = Date.now();

    if (this.accessToken && this.tokenExpiry > now + 60000) {
      return this.accessToken;
    }

    const formData = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.accountId,
      client_secret: this.apiKey,
      scope: "general",
    });

    const response = await fetch(`${this.baseUrl}/accessTokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-control": "no-cache",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to get access token: ${response.status} ${errorText}`,
      );
    }

    const tokenData: HostawayAccessToken = await response.json();

    this.accessToken = tokenData.access_token;
    this.tokenExpiry = now + tokenData.expires_in * 1000;

    return this.accessToken;
  }

  /**
   * Fetch reviews from Hostaway API
   */
  async fetchReviews(
    limit = 100,
    offset = 0,
  ): Promise<HostawayReviewsResponse> {
    if (!this.isConfigured()) {
      throw new Error("Hostaway API credentials not configured");
    }
    
    const token = await this.getAccessToken();

    const url = new URL(`${this.baseUrl}/reviews`);
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("offset", offset.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch reviews: ${response.status} ${errorText}`,
      );
    }

    return await response.json();
  }

  /**
   * Normalize Hostaway review data to match our database schema
   */
  normalizeReview(hostawayReview: HostawayReview) {
    const averageRating =
      hostawayReview.rating ||
      (hostawayReview.reviewCategory.length > 0
        ? hostawayReview.reviewCategory.reduce(
            (sum, cat) => sum + cat.rating,
            0,
          ) / hostawayReview.reviewCategory.length
        : 0);

    return {
      source: "hostaway" as const,
      externalId: hostawayReview.id.toString(),
      listingId: hostawayReview.listingName,
      propertyId: null,
      reviewType: this.mapReviewType(hostawayReview.type),
      channel: "unknown",
      rating: averageRating,
      title: null,
      body: hostawayReview.publicReview,
      authorName: hostawayReview.guestName || null,
      language: "en",
      createdAt: new Date(hostawayReview.submittedAt),
      approved: hostawayReview.status === "published",

      categoryRatings: hostawayReview.reviewCategory,
    };
  }

  /**
   * Map Hostaway review types to our review type enum
   */
  private mapReviewType(type: string): string {
    const typeMap: Record<string, string> = {
      "host-to-guest": "host_to_guest",
      "guest-to-host": "guest_to_host",
      public: "public",
    };

    return typeMap[type] || "guest_to_host";
  }

  /**
   * Map Hostaway channel names to our channel enum
   */
  private mapChannelName(channelName: string): string {
    const channelMap: Record<string, string> = {
      Airbnb: "airbnb",
      "Booking.com": "booking",
      VRBO: "vrbo",
      Direct: "direct",
      Expedia: "expedia",
      TripAdvisor: "tripadvisor",
    };

    return channelMap[channelName] || "unknown";
  }

  /**
   * Fetch all reviews with pagination
   */
  async fetchAllReviews(): Promise<HostawayReview[]> {
    if (!this.isConfigured()) {
      throw new Error("Hostaway API credentials not configured");
    }
    
    const allReviews: HostawayReview[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await this.fetchReviews(limit, offset);
      allReviews.push(...response.result);

      hasMore = response.result.length === limit;
      offset += limit;
    }

    return allReviews;
  }
}

export const hostawayService = new HostawayService();
export type { HostawayReview, HostawayReviewsResponse };
