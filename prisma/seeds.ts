/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  const hashedPassword = await bcrypt.hash("admin123", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "admin@flexliving.com" },
    update: {},
    create: {
      email: "admin@flexliving.com",
      name: "Admin User",
      password: hashedPassword,
    },
  });

  console.log(`Created demo user: ${demoUser.email}`);

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

  console.log(`Created ${categories.length} categories`);

  const properties = await Promise.all([
    prisma.property.upsert({
      where: { slug: "luxury-beachfront-villa" },
      update: {},
      create: {
        slug: "luxury-beachfront-villa",
        name: "Luxury Beachfront Villa",
        address: "123 Ocean Drive",
        city: "Malibu",
        country: "California, USA",
        ratingAvg: 4.8,
        price: 899,
        bedrooms: 4,
        bathrooms: 3,
        guests: 8,
        image: "/api/placeholder/400/300",
      },
    }),
    prisma.property.upsert({
      where: { slug: "modern-urban-loft" },
      update: {},
      create: {
        slug: "modern-urban-loft",
        name: "Modern Urban Loft",
        address: "456 Downtown Ave",
        city: "New York",
        country: "New York, USA",
        ratingAvg: 4.6,
        price: 599,
        bedrooms: 2,
        bathrooms: 2,
        guests: 4,
        image: "/api/placeholder/400/300",
      },
    }),
    prisma.property.upsert({
      where: { slug: "cozy-mountain-cabin" },
      update: {},
      create: {
        slug: "cozy-mountain-cabin",
        name: "Cozy Mountain Cabin",
        address: "789 Forest Trail",
        city: "Aspen",
        country: "Colorado, USA",
        ratingAvg: 4.9,
        price: 749,
        bedrooms: 3,
        bathrooms: 2,
        guests: 6,
        image: "/api/placeholder/400/300",
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
        image: "/api/placeholder/400/300",
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
        image: "/api/placeholder/400/300",
      },
    }),
  ]);

  console.log(`Created ${properties.length} properties`);

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
  ]);

  console.log(`Created ${listings.length} listings`);

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
  ]);

  console.log(`Created ${reviews.length} reviews`);

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

  console.log("Seed completed successfully!");
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
