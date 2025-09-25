# Hostaway API Integration

This document describes the Hostaway API integration for fetching and syncing reviews.

## API Endpoints

### Fetch Hostaway Reviews
**GET** `/api/reviews/hostaway`

Fetches reviews from Hostaway API, normalizes them, and optionally includes existing database reviews.

**Query Parameters:**
- `limit` (optional): Number of reviews to fetch (default: 100)
- `offset` (optional): Starting offset (default: 0)
- `includeDb` (optional): Include existing database reviews with source = "hostaway" (default: false)

**Examples:**
- `GET /api/reviews/hostaway` - Normalized Hostaway reviews only
- `GET /api/reviews/hostaway?limit=10` - 10 normalized reviews
- `GET /api/reviews/hostaway?includeDb=true` - Normalized reviews + database reviews

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "source": "hostaway",
      "externalId": "12345",
      "listingId": "listing-uuid",
      "propertyId": "property-uuid",
      "reviewType": "guest_to_host",
      "channel": "unknown",
      "rating": 4.5,
      "title": null,
      "body": "The property was amazing...",
      "authorName": "John D.",
      "language": "en",
      "createdAt": "2024-01-15T10:30:00Z",
      "approved": true,
      "categoryRatings": [
        {
          "category": "cleanliness",
          "rating": 5
        },
        {
          "category": "communication", 
          "rating": 4
        }
      ]
    }
  ],
  "pagination": {
    "totalCount": 150,
    "limit": 100,
    "offset": 0
  },
  "source": "hostaway"
}
```

**Note:** When `includeDb=true`, the response includes both normalized Hostaway reviews and existing database reviews in the same `data` array.

## Configuration

The Hostaway API credentials are configured via environment variables:
- `HOSTAWAY_ACCOUNT_ID` - Your Hostaway account ID
- `HOSTAWAY_API_KEY` - Your Hostaway API key

If these environment variables are not set, the Hostaway integration will be disabled and the API will return a 503 error.

## Data Normalization

The service normalizes Hostaway review data to match the local database schema:

- **Source**: Always set to "hostaway"
- **External ID**: Hostaway review ID as string
- **Channel Mapping**: Maps Hostaway channel names to standardized values
- **Review Type**: Defaults to "guest_to_host"
- **Approval**: Based on Hostaway's `isApproved` and `isPublic` flags

## Error Handling

All endpoints include comprehensive error handling:
- Authentication failures
- API rate limiting
- Data validation errors
- Database connection issues

## Usage Examples

1. **Fetch sample normalized reviews:**
   ```bash
   curl "http://localhost:3000/api/reviews/hostaway?limit=5"
   ```

2. **Fetch reviews with database data:**
   ```bash
   curl "http://localhost:3000/api/reviews/hostaway?limit=10&includeDb=true"
   ```

3. **Fetch with different pagination:**
   ```bash
   curl "http://localhost:3000/api/reviews/hostaway?limit=20&offset=40"
   ```
