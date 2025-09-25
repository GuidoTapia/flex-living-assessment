import { env } from "~/env.js";

// Types from the Google Maps Places SDK
interface Place {
  id: string;
  displayName?: {
    text: string;
    languageCode: string;
  };
  rating?: number;
  userRatingCount?: number;
  formattedAddress?: string;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  photos?: Array<{
    name: string;
    widthPx: number;
    heightPx: number;
  }>;
  businessStatus?: string;
  types?: string[];
  priceLevel?: string;
}


// Legacy interfaces for backward compatibility
interface GooglePlaceDetails {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  formatted_address: string;
  website?: string;
  formatted_phone_number?: string;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  business_status?: string;
  types?: string[];
}

interface GooglePlaceSearchResult {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  vicinity: string;
  types?: string[];
  priceLevel?: string | null;
  businessStatus?: string | null;
}

const apiKey = env.GOOGLE_PLACES_API_KEY ?? "";

if (!apiKey) {
  console.warn(
    "Google Places API key not found. Google Places integration will be disabled.",
  );
}

/**
 * Check if the service is properly configured
 */
export function isConfigured(): boolean {
  return !!apiKey;
}

/**
 * Search for places by text query using Places API (New) SDK
 */
export async function searchPlaces(
  query: string,
  location?: string,
): Promise<GooglePlaceSearchResult[]> {
  if (!isConfigured()) {
    throw new Error("Google Places API key not configured");
  }

  const requestBody: {
    textQuery: string;
    maxResultCount: number;
    locationBias?: {
      circle: {
        center: { latitude: number; longitude: number };
        radius: number;
      };
    };
  } = {
    textQuery: query,
    maxResultCount: 10,
  };

  if (location) {
    const [lat, lng] = location.split(",").map(Number);
    requestBody.locationBias = {
      circle: {
        center: { latitude: lat ?? 0, longitude: lng ?? 0 },
        radius: 50000, // 50km radius
      },
    };
  }

  
  

  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.rating,places.userRatingCount,places.formattedAddress,places.types,places.priceLevel,places.businessStatus",
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Google Places API error: ${response.status} ${errorText}`,
      );
    }

    const data = await response.json() as { places?: Place[] };
    

    if (!data.places || data.places.length === 0) {
      
      return [];
    }

    // Transform the response to our expected format
    const transformedPlaces = data.places.map((place: Place) => {
      
      
      
      return {
        place_id: place.id ?? "",
        name: place.displayName?.text ?? "",
        rating: place.rating ?? 0,
        user_ratings_total: place.userRatingCount ?? 0,
        vicinity: place.formattedAddress ?? "",
        types: place.types ?? [],
        priceLevel: place.priceLevel ?? null,
        businessStatus: place.businessStatus ?? null,
      };
    });

    
    return transformedPlaces;
  } catch (error) {
    console.error("Error searching places:", error);
    throw error;
  }
}

/**
 * Get detailed information about a specific place using Places API (New) SDK
 */
export async function getPlaceDetails(
  placeId: string,
): Promise<GooglePlaceDetails | null> {
  if (!isConfigured()) {
    throw new Error("Google Places API key not configured");
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "id,displayName,rating,userRatingCount,formattedAddress,websiteUri,nationalPhoneNumber,photos,businessStatus,types,priceLevel",
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorText = await response.text();
      throw new Error(
        `Google Places API error: ${response.status} ${errorText}`,
      );
    }

    const place = await response.json() as Place;

    if (!place) {
      return null;
    }

    // Transform the response to our expected format
    return {
      place_id: place.id ?? "",
      name: place.displayName?.text ?? "",
      rating: place.rating ?? 0,
      user_ratings_total: place.userRatingCount ?? 0,
      formatted_address: place.formattedAddress ?? "",
      website: place.websiteUri ?? undefined,
      formatted_phone_number: place.nationalPhoneNumber ?? undefined,
      business_status: place.businessStatus?.toString() ?? "OPERATIONAL",
      types: place.types ?? [],
    };
  } catch (error) {
    console.error("Error getting place details:", error);
    return null;
  }
}

/**
 * Find a place by property name and address
 */
export async function findPlaceByAddress(
  address: string,
  city: string,
  country: string,
): Promise<GooglePlaceDetails | null> {
  try {
    // First, try to search with the property name and address
    const searchQuery = `${address}, ${city}, ${country}`;
    const searchResults = await searchPlaces(searchQuery);

    if (searchResults.length === 0) {
      return null;
    }

    // Get detailed information for the first result
    const placeDetails = await getPlaceDetails(searchResults[0]!.place_id);
    return placeDetails;
  } catch (error) {
    console.error("Error finding place by property:", error);
    return null;
  }
}

export function normalizePlaceData(place: GooglePlaceDetails) {
  return {
    googlePlaceId: place.place_id,
    name: place.name,
    address: place.formatted_address,
    rating: place.rating ?? 0,
    totalRatings: place.user_ratings_total ?? 0,
    website: place.website ?? null,
    phoneNumber: place.formatted_phone_number ?? null,
    businessStatus: place.business_status ?? "OPERATIONAL",
    types: place.types ?? [],
  };
}

export type { GooglePlaceDetails, GooglePlaceSearchResult };
