# Google Places Integration

## Overview

This integration provides **limited** Google Places functionality due to Google's API restrictions. While we cannot access individual Google Reviews, we can fetch basic place information and overall ratings.

**✅ Now using the official `@googlemaps/places` SDK** for better type safety, automatic retries, and proper authentication handling.

## ⚠️ Important Limitations

### ❌ **What We CANNOT Do:**
- Fetch individual Google Reviews
- Access review text, author names, or detailed review data
- Get review timestamps or review counts by category
- Access any review content beyond overall rating

### ✅ **What We CAN Do:**
- Fetch basic place information (name, address, phone, website)
- Get overall Google rating (1-5 stars)
- Get total number of ratings
- Fetch place photos
- Get business status and types

## Setup

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Places API (New)** - **NOT the legacy Places API**
4. Create credentials (API Key)
5. Restrict the API key to Places API only

**Important:** Make sure to enable "Places API (New)" and NOT the legacy "Places API". The legacy API is deprecated and will return REQUEST_DENIED errors.

### 2. Install Dependencies

The integration uses the official Google Maps Places SDK:

```bash
pnpm add @googlemaps/places
```

### 3. Environment Configuration

Add to your `.env` file:

```bash
GOOGLE_PLACES_API_KEY=your_api_key_here
```

### 4. API Key Restrictions (Recommended)

For security, restrict your API key to:
- **Application restrictions**: HTTP referrers (your domain)
- **API restrictions**: Places API only

## API Endpoints

### 1. Search Places
**GET** `/api/places/google?query=search_term`

Search for places by text query.

**Query Parameters:**
- `query` (required): Search term
- `location` (optional): Location bias (lat,lng)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "placeId": "ChIJ...",
      "name": "Property Name",
      "rating": 4.2,
      "totalRatings": 150,
      "vicinity": "123 Main St, City",
      "types": ["lodging", "establishment"]
    }
  ],
  "source": "google_places",
  "count": 1
}
```

### 2. Get Place Details
**GET** `/api/places/google?placeId=ChIJ...`

Get detailed information about a specific place.

**Response:**
```json
{
  "success": true,
  "data": {
    "googlePlaceId": "ChIJ...",
    "name": "Property Name",
    "address": "123 Main St, City, State",
    "rating": 4.2,
    "totalRatings": 150,
    "website": "https://property-website.com",
    "phoneNumber": "+1 555-123-4567",
    "businessStatus": "OPERATIONAL",
    "types": ["lodging", "establishment"],
    "photos": [
      {
        "reference": "photo_ref_123",
        "url": "https://maps.googleapis.com/...",
        "width": 400,
        "height": 300
      }
    ]
  },
  "source": "google_places"
}
```

### 3. Find by Property
**GET** `/api/places/google?propertyName=Hotel Name&address=123 Main St`

Find a place by property name and address.

## Property Integration

The property endpoint (`/api/properties/[slug]`) now includes Google Places data:

```json
{
  "id": "property-id",
  "name": "Luxury Beachfront Villa",
  "address": "123 Ocean Drive",
  "ratingAvg": 4.8,
  "reviews": [...],
  "googlePlaces": {
    "googlePlaceId": "ChIJ...",
    "name": "Luxury Beachfront Villa",
    "address": "123 Ocean Drive, London, UK",
    "rating": 4.2,
    "totalRatings": 150,
    "website": "https://property-website.com",
    "phoneNumber": "+44 20 1234 5678",
    "businessStatus": "OPERATIONAL",
    "types": ["lodging", "establishment"],
    "photos": [...]
  }
}
```

## Usage Examples

### 1. Test Google Places Integration
```bash
# Test if API is configured
curl "http://localhost:3000/api/places/google?query=hotel london"

# Get place details
curl "http://localhost:3000/api/places/google?placeId=ChIJN1t_tDeuEmsRUsoyG83frY4"

# Find by property
curl "http://localhost:3000/api/places/google?propertyName=Luxury%20Beachfront%20Villa&address=123%20Ocean%20Drive"
```

### 2. Property with Google Data
```bash
# Get property with Google Places data
curl "http://localhost:3000/api/trpc/property.getBySlug?input=%7B%22slug%22%3A%22luxury-beachfront-villa%22%7D"
```

## Cost Considerations

Google Places API (New) pricing (as of 2024):
- **Text Search**: $17 per 1,000 requests
- **Place Details**: $17 per 1,000 requests
- **Photos**: $7 per 1,000 requests

**Recommendations:**
- Cache results to minimize API calls
- Only fetch data when needed
- Consider implementing rate limiting
- Use field masks to only request needed data

## Error Handling

The service gracefully handles:
- Missing API key (returns 503 with helpful message)
- Place not found (returns 404)
- API rate limits (returns 429)
- Network errors (returns 500)

## Future Considerations

### Alternative Approaches for Reviews

Since Google Reviews are not accessible via API, consider:

1. **Manual Review Entry**: Allow property managers to manually enter Google Reviews
2. **Review Widgets**: Use Google's official review widgets for display
3. **Third-Party Services**: Use services like BrightLocal (expensive, limited)
4. **Focus on Available Sources**: Prioritize APIs that do provide review access

### Potential Enhancements

1. **Caching**: Implement Redis caching for place data
2. **Batch Processing**: Process multiple properties at once
3. **Photo Optimization**: Resize and optimize photos
4. **Location Services**: Add geocoding and distance calculations

## Conclusion

While Google Reviews integration is not possible due to API limitations, this integration provides valuable place information that can enhance property listings with:

- ✅ Official Google ratings
- ✅ Contact information
- ✅ Photos
- ✅ Business verification
- ✅ Location accuracy

This data can be used to improve property listings and provide users with additional context about properties.
