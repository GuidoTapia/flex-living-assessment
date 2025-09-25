/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import urlImages from "./url-images";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME;

  if (!adminEmail || !adminPassword || !adminName) {
    throw new Error(
      "Missing required environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME"
    );
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const demoUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: adminName,
      password: hashedPassword,
    },
  });

  

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Cleanliness" },
      update: {},
      create: { name: "Cleanliness" },
    }),
    prisma.category.upsert({
      where: { name: "Location" },
      update: {},
      create: { name: "Location" },
    }),
    prisma.category.upsert({
      where: { name: "Staff" },
      update: {},
      create: { name: "Staff" },
    }),
    prisma.category.upsert({
      where: { name: "Noise" },
      update: {},
      create: { name: "Noise" },
    }),
    prisma.category.upsert({
      where: { name: "Value" },
      update: {},
      create: { name: "Value" },
    }),
  ]);

  

  const properties = await Promise.all([
    prisma.property.upsert({
      where: { slug: "luxury-beachfront-villa" },
      update: {},
      create: {
        slug: "luxury-beachfront-villa",
        name: "Luxury Beachfront Villa",
        address: "123 Ocean Drive",
        city: "London",
        country: "UK",
        ratingAvg: 4.8,
        price: 899,
        bedrooms: 4,
        bathrooms: 3,
        guests: 8,
        image: urlImages[0],
      },
    }),
    prisma.property.upsert({
      where: { slug: "modern-urban-loft" },
      update: {},
      create: {
        slug: "modern-urban-loft",
        name: "Modern Urban Loft",
        address: "456 Downtown Ave",
        city: "Algiers",
        country: "Algeria",
        ratingAvg: 4.6,
        price: 599,
        bedrooms: 2,
        bathrooms: 2,
        guests: 4,
        image: urlImages[1],
      },
    }),
    prisma.property.upsert({
      where: { slug: "cozy-mountain-cabin" },
      update: {},
      create: {
        slug: "cozy-mountain-cabin",
        name: "Cozy Mountain Cabin",
        address: "789 Forest Trail",
        city: "Lisbon",
        country: "Portugal",
        ratingAvg: 4.9,
        price: 749,
        bedrooms: 3,
        bathrooms: 2,
        guests: 6,
        image: urlImages[2],
      },
    }),
    prisma.property.upsert({
      where: { slug: "london-townhouse" },
      update: {},
      create: {
        slug: "london-townhouse",
        name: "Elegant London Townhouse",
        address: "42 Baker Street",
        city: "London",
        country: "UK",
        ratingAvg: 4.6,
        price: 450,
        bedrooms: 2,
        bathrooms: 2,
        guests: 4,
        image: urlImages[3],
      },
    }),
    prisma.property.upsert({
      where: { slug: "parisian-apartment" },
      update: {},
      create: {
        slug: "parisian-apartment",
        name: "Charming Parisian Apartment",
        address: "15 Rue de Rivoli",
        city: "Paris",
        country: "France",
        ratingAvg: 4.7,
        price: 380,
        bedrooms: 1,
        bathrooms: 1,
        guests: 2,
        image: urlImages[4],
      },
    }),
  ]);

  

  const listings = await Promise.all([
    prisma.listing.upsert({
      where: { externalId: "luxury-villa-airbnb" },
      update: {},
      create: {
        externalId: "luxury-villa-airbnb",
        name: "Luxury Beachfront Villa - Airbnb",
        channel: "airbnb",
      },
    }),
    prisma.listing.upsert({
      where: { externalId: "urban-loft-booking" },
      update: {},
      create: {
        externalId: "urban-loft-booking",
        name: "Modern Urban Loft - Booking.com",
        channel: "booking",
      },
    }),
    prisma.listing.upsert({
      where: { externalId: "mountain-cabin-direct" },
      update: {},
      create: {
        externalId: "mountain-cabin-direct",
        name: "Cozy Mountain Cabin - Direct",
        channel: "direct",
      },
    }),
    prisma.listing.upsert({
      where: { externalId: "london-townhouse" },
      update: {},
      create: {
        externalId: "london-townhouse",
        name: "Elegant London Townhouse - Booking.com",
        channel: "booking",
      },
    }),
    prisma.listing.upsert({
      where: { externalId: "parisian-apartmen" },
      update: {},
      create: {
        externalId: "parisian-apartmen",
        name: "Charming Parisian Apartment - Direct",
        channel: "direct",
      },
    }),
  ]);

  

  const reviews = await Promise.all([
    prisma.review.upsert({
      where: {
        externalId_source: { externalId: "review-001", source: "hostaway" },
      },
      update: {},
      create: {
        source: "hostaway",
        externalId: "review-001",
        listingId: listings[0]!.id,
        propertyId: properties[0]!.id,
        reviewType: "guest_to_host",
        channel: "airbnb",
        rating: 5.0,
        title: "Absolutely Amazing!",
        body: "This villa exceeded all our expectations. The location is perfect, right on the beach with stunning ocean views. The property was immaculately clean and beautifully decorated. The host was incredibly responsive and helpful throughout our stay.",
        authorName: "Sarah M.",
        language: "en",
        createdAt: new Date("2024-01-15"),
        approved: true,
      },
    }),
    prisma.review.upsert({
      where: {
        externalId_source: { externalId: "review-002", source: "hostaway" },
      },
      update: {},
      create: {
        source: "hostaway",
        externalId: "review-002",
        listingId: listings[1]!.id,
        propertyId: properties[1]!.id,
        reviewType: "guest_to_host",
        channel: "booking",
        rating: 4.5,
        title: "Great location, minor issues",
        body: "The loft is in a fantastic location with easy access to everything. The space is modern and well-equipped. Had a small issue with the heating but the host resolved it quickly.",
        authorName: "John D.",
        language: "en",
        createdAt: new Date("2024-01-20"),
        approved: true,
      },
    }),
    prisma.review.upsert({
      where: {
        externalId_source: { externalId: "review-003", source: "hostaway" },
      },
      update: {},
      create: {
        source: "hostaway",
        externalId: "review-003",
        listingId: listings[2]!.id,
        propertyId: properties[2]!.id,
        reviewType: "guest_to_host",
        channel: "direct",
        rating: 4.8,
        title: "Perfect mountain retreat",
        body: "The cabin was exactly what we needed for a peaceful getaway. Surrounded by nature, cozy and comfortable. The fireplace was perfect for cold evenings.",
        authorName: "Emma L.",
        language: "en",
        createdAt: new Date("2024-01-25"),
        approved: true,
      },
    }),
    prisma.review.upsert({
      where: {
        externalId_source: { externalId: "review-004", source: "google" },
      },
      update: {},
      create: {
        source: "google",
        externalId: "review-004",
        listingId: listings[0]!.id,
        propertyId: properties[0]!.id,
        reviewType: "public",
        channel: "google",
        rating: 4.2,
        title: "Good but could be better",
        body: "Nice place overall but the wifi was slow and there was some noise from construction nearby. The host was accommodating though.",
        authorName: "Mike R.",
        language: "en",
        createdAt: new Date("2024-02-01"),
        approved: false,
      },
    }),
    prisma.review.upsert({
      where: {
        externalId_source: { externalId: "review-005", source: "airbnb" },
      },
      update: {},
      create: {
        source: "airbnb",
        externalId: "review-005",
        listingId: listings[1]!.id,
        propertyId: properties[1]!.id,
        reviewType: "guest_to_host",
        channel: "airbnb",
        rating: 4.9,
        title: "Wonderful stay in the city",
        body: "Loved the modern design and the central location. The host was very helpful and check-in was smooth.",
        authorName: "Linda P.",
        language: "en",
        createdAt: new Date("2024-02-10"),
        approved: false,
      },
    }),
    prisma.review.upsert({
      where: {
        externalId_source: { externalId: "review-006", source: "booking" },
      },
      update: {},
      create: {
        source: "booking",
        externalId: "review-006",
        listingId: listings[2]!.id,
        propertyId: properties[2]!.id,
        reviewType: "guest_to_host",
        channel: "booking",
        rating: 4.0,
        title: "Cozy but a bit remote",
        body: "The cabin was very cozy and clean, but it was a bit far from the nearest town. Great for a quiet retreat.",
        authorName: "Carlos G.",
        language: "en",
        createdAt: new Date("2024-02-15"),
        approved: true,
      },
    }),
    prisma.review.upsert({
      where: {
        externalId_source: { externalId: "review-007", source: "direct" },
      },
      update: {},
      create: {
        source: "direct",
        externalId: "review-007",
        listingId: listings[3]!.id,
        propertyId: properties[3]!.id,
        reviewType: "guest_to_host",
        channel: "direct",
        rating: 3.8,
        title: "Nice villa, but noisy",
        body: "The villa was beautiful but there was some noise from the street at night. Otherwise, a great stay.",
        authorName: "Anna S.",
        language: "en",
        createdAt: new Date("2024-02-18"),
        approved: false,
      },
    }),
    prisma.review.upsert({
      where: {
        externalId_source: { externalId: "review-008", source: "airbnb" },
      },
      update: {},
      create: {
        source: "airbnb",
        externalId: "review-008",
        listingId: listings[4]!.id,
        propertyId: properties[4]!.id,
        reviewType: "guest_to_host",
        channel: "airbnb",
        rating: 5.0,
        title: "Best cabin experience",
        body: "Absolutely loved our stay! The views were breathtaking and the cabin had everything we needed.",
        authorName: "Tom H.",
        language: "en",
        createdAt: new Date("2024-02-20"),
        approved: true,
      },
    }),
    prisma.review.upsert({
      where: {
        externalId_source: { externalId: "review-009", source: "booking" },
      },
      update: {},
      create: {
        source: "booking",
        externalId: "review-009",
        listingId: listings[3]!.id,
        propertyId: properties[3]!.id,
        reviewType: "guest_to_host",
        channel: "booking",
        rating: 4.3,
        title: "Great for business trip",
        body: "Stayed here for a work trip. The apartment was clean and had fast wifi. Would recommend for business travelers.",
        authorName: "James K.",
        language: "en",
        createdAt: new Date("2024-02-22"),
        approved: false,
      },
    }),
    prisma.review.upsert({
      where: {
        externalId_source: { externalId: "review-010", source: "google" },
      },
      update: {},
      create: {
        source: "google",
        externalId: "review-010",
        listingId: listings[0]!.id,
        propertyId: properties[0]!.id,
        reviewType: "public",
        channel: "google",
        rating: 4.7,
        title: "Fantastic family holiday",
        body: "We had a wonderful family holiday at the villa. The kids loved the pool and the beach was just steps away.",
        authorName: "Sophie W.",
        language: "en",
        createdAt: new Date("2024-02-25"),
        approved: true,
      },
    }),
    prisma.review.upsert({
      where: {
        externalId_source: { externalId: "review-011", source: "hostaway" },
      },
      update: {},
      create: {
        source: "hostaway",
        externalId: "review-011",
        listingId: listings[1]!.id,
        propertyId: properties[1]!.id,
        reviewType: "guest_to_host",
        channel: "airbnb",
        rating: 4.6,
        title: "Lovely Parisian apartment",
        body: "The apartment was charming and close to all the main attractions. Would definitely stay again.",
        authorName: "Marie C.",
        language: "en",
        createdAt: new Date("2024-03-01"),
        approved: false,
      },
    }),
    prisma.review.upsert({
      where: {
        externalId_source: { externalId: "review-012", source: "booking" },
      },
      update: {},
      create: {
        source: "booking",
        externalId: "review-012",
        listingId: listings[4]!.id,
        propertyId: properties[4]!.id,
        reviewType: "guest_to_host",
        channel: "booking",
        rating: 4.4,
        title: "Peaceful and relaxing",
        body: "We enjoyed the peace and quiet of the mountains. The cabin was well equipped and very comfortable.",
        authorName: "Nina F.",
        language: "en",
        createdAt: new Date("2024-03-05"),
        approved: false,
      },
    }),
  ]);

  

  await Promise.all([
    prisma.review.update({
      where: { id: reviews[0]!.id },
      data: {
        categories: {
          connect: [
            { id: categories.find((c) => c.name === "Cleanliness")!.id },
            { id: categories.find((c) => c.name === "Location")!.id },
            { id: categories.find((c) => c.name === "Staff")!.id },
          ],
        },
      },
    }),

    prisma.review.update({
      where: { id: reviews[1]!.id },
      data: {
        categories: {
          connect: [
            { id: categories.find((c) => c.name === "Location")!.id },
            { id: categories.find((c) => c.name === "Value")!.id },
          ],
        },
      },
    }),

    prisma.review.update({
      where: { id: reviews[2]!.id },
      data: {
        categories: {
          connect: [
            { id: categories.find((c) => c.name === "Location")!.id },
            { id: categories.find((c) => c.name === "Noise")!.id },
          ],
        },
      },
    }),

    prisma.review.update({
      where: { id: reviews[3]!.id },
      data: {
        categories: {
          connect: [
            { id: categories.find((c) => c.name === "Noise")!.id },
            { id: categories.find((c) => c.name === "Value")!.id },
          ],
        },
      },
    }),
  ]);

  
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
