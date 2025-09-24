import Link from "next/link";
import { api } from "~/trpc/server";
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Group,
  Badge,
  Button,
  Stack,
  Avatar,
  Rating,
} from "@mantine/core";
import { IconStar, IconMapPin, IconCalendar, IconUsers } from "@tabler/icons-react";

export default async function PropertiesPage() {
  
  const mockProperties = [
    {
      id: "1",
      slug: "luxury-beachfront-villa",
      name: "Luxury Beachfront Villa",
      address: "123 Ocean Drive",
      city: "Malibu",
      country: "California, USA",
      ratingAvg: 4.8,
      reviewCount: 127,
      price: 899,
      bedrooms: 4,
      bathrooms: 3,
      guests: 8,
      image: "/api/placeholder/400/300",
    },
    {
      id: "2",
      slug: "modern-urban-loft",
      name: "Modern Urban Loft",
      address: "456 Downtown Ave",
      city: "New York",
      country: "New York, USA",
      ratingAvg: 4.6,
      reviewCount: 89,
      price: 599,
      bedrooms: 2,
      bathrooms: 2,
      guests: 4,
      image: "/api/placeholder/400/300",
    },
    {
      id: "3",
      slug: "cozy-mountain-cabin",
      name: "Cozy Mountain Cabin",
      address: "789 Forest Trail",
      city: "Aspen",
      country: "Colorado, USA",
      ratingAvg: 4.9,
      reviewCount: 156,
      price: 749,
      bedrooms: 3,
      bathrooms: 2,
      guests: 6,
      image: "/api/placeholder/400/300",
    },
    {
      id: "4",
      slug: "historic-city-apartment",
      name: "Historic City Apartment",
      address: "321 Heritage Street",
      city: "Boston",
      country: "Massachusetts, USA",
      ratingAvg: 4.5,
      reviewCount: 73,
      price: 449,
      bedrooms: 1,
      bathrooms: 1,
      guests: 2,
      image: "/api/placeholder/400/300",
    },
    {
      id: "5",
      slug: "tropical-paradise-bungalow",
      name: "Tropical Paradise Bungalow",
      address: "654 Palm Beach Road",
      city: "Miami",
      country: "Florida, USA",
      ratingAvg: 4.7,
      reviewCount: 94,
      price: 699,
      bedrooms: 2,
      bathrooms: 2,
      guests: 4,
      image: "/api/placeholder/400/300",
    },
    {
      id: "6",
      slug: "desert-oasis-retreat",
      name: "Desert Oasis Retreat",
      address: "987 Cactus Canyon",
      city: "Sedona",
      country: "Arizona, USA",
      ratingAvg: 4.8,
      reviewCount: 112,
      price: 799,
      bedrooms: 3,
      bathrooms: 3,
      guests: 6,
      image: "/api/placeholder/400/300",
    },
  ];

  return (
    <Container size="xl" py="md">
      <div className="text-center mb-12">
        <Title order={1} mb="md">
          Our Properties
        </Title>
        <Text size="lg" c="dimmed">
          Discover our carefully curated collection of premium accommodations
        </Text>
      </div>

      <Grid gutter="lg">
        {mockProperties.map((property) => (
          <Grid.Col key={property.id} span={12} md={6} lg={4}>
            <Card withBorder shadow="sm" radius="md" className="h-full">
              <Card.Section>
                <div className="relative">
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <Text c="dimmed">Property Image</Text>
                  </div>
                  <Badge
                    className="absolute top-4 right-4"
                    color="blue"
                    variant="filled"
                  >
                    ${property.price}/night
                  </Badge>
                </div>
              </Card.Section>

              <Card.Section p="md">
                <Stack gap="sm">
                  <Title order={3} size="h4">
                    {property.name}
                  </Title>
                  
                  <Group gap="xs" c="dimmed">
                    <IconMapPin size={16} />
                    <Text size="sm">
                      {property.address}, {property.city}, {property.country}
                    </Text>
                  </Group>

                  <Group gap="lg">
                    <Group gap="xs">
                      <IconUsers size={16} />
                      <Text size="sm">{property.guests} guests</Text>
                    </Group>
                    <Group gap="xs">
                      <Text size="sm">{property.bedrooms} bedrooms</Text>
                    </Group>
                    <Group gap="xs">
                      <Text size="sm">{property.bathrooms} bathrooms</Text>
                    </Group>
                  </Group>

                  <Group justify="space-between" align="center">
                    <Group gap="xs">
                      <Group gap="xs">
                        <IconStar size={16} fill="gold" color="gold" />
                        <Text fw={500}>{property.ratingAvg}</Text>
                      </Group>
                      <Text size="sm" c="dimmed">
                        ({property.reviewCount} reviews)
                      </Text>
                    </Group>
                  </Group>
                </Stack>
              </Card.Section>

              <Card.Section p="md" pt={0}>
                <Button
                  component={Link}
                  href={`/property/${property.slug}`}
                  fullWidth
                  variant="light"
                >
                  View Property & Reviews
                </Button>
              </Card.Section>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {mockProperties.length === 0 && (
        <Card withBorder p="xl" className="text-center">
          <Stack gap="md">
            <Title order={3} c="dimmed">
              No properties available
            </Title>
            <Text c="dimmed">
              Check back soon for new property listings and guest reviews.
            </Text>
          </Stack>
        </Card>
      )}
    </Container>
  );
}
