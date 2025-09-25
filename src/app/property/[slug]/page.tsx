import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import PropertyDetails from "./_components/property-details";
import {
  Container,
  Title,
  Text,
  Group,
  Stack,
  Grid,
  Avatar,
  Badge,
  Rating,
  Flex,
  Box,
  BackgroundImage,
  Card,
  GridCol,
  CardSection,
  Divider,
  ThemeIcon,
} from "@mantine/core";
import { IconBed, IconBath, IconUsers } from "@tabler/icons-react";
import Layout from "~/app/_components/layout";

interface PropertyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await api.property.getBySlug({ slug });

  if (!property) {
    notFound();
  }

  return (
    <Layout>
      <Box bg="light.0" style={{ minHeight: "100vh" }}>
        <Container size="xl" py="xl" px="xl">
          <Flex direction="column" gap="xl">
            <BackgroundImage
              src={property.image}
              radius="md"
              w="100%"
              h={480}
              mb="md"
            />

            <Stack flex={1} gap="md">
              <Title order={3}>{property.name}</Title>

              <Group gap="xl">
                {property.guests && (
                  <Group gap="xs" align="center">
                    <ThemeIcon color="brand" variant="transparent">
                      <IconUsers size={22} />
                    </ThemeIcon>
                    <Stack gap={0} align="center">
                      <Text size="sm">{property.guests}</Text>
                      <Text size="sm">Guests</Text>
                    </Stack>
                  </Group>
                )}
                {property.bedrooms && (
                  <Group gap="xs" align="center">
                    <ThemeIcon color="brand" variant="transparent">
                      <IconBed size={22} />
                    </ThemeIcon>
                    <Stack gap={0} align="center">
                      <Text size="sm">{property.bedrooms}</Text>
                      <Text size="sm">Bedrooms</Text>
                    </Stack>
                  </Group>
                )}
                {property.bathrooms && (
                  <Group gap="xs">
                    <ThemeIcon color="brand" variant="transparent">
                      <IconBath size={22} />
                    </ThemeIcon>
                    <Stack gap={0} align="center">
                      <Text size="sm">{property.bathrooms}</Text>
                      <Text size="sm">Bathrooms</Text>
                    </Stack>
                  </Group>
                )}
                {property.bedrooms && (
                  <Group gap="xs" align="center">
                    <ThemeIcon color="brand" variant="transparent">
                      <IconBed size={22} />
                    </ThemeIcon>
                    <Stack gap={0} align="center">
                      <Text size="sm">{property.bedrooms}</Text>
                      <Text size="sm">Beds</Text>
                    </Stack>
                  </Group>
                )}
              </Group>
            </Stack>
          </Flex>
          <Divider my="xl" />

          <Grid gutter="xl">
            <GridCol span={{ base: 12, lg: 8 }}>
              <PropertyDetails property={property} />
            </GridCol>

            <GridCol span={{ base: 12, lg: 4 }}>
              <Card shadow="sm" radius="md">
                <CardSection bg="brand.6" p="lg">
                  <Stack gap="sm">
                    <Title order={5} c="light.0">
                      Guest Reviews
                    </Title>

                    <Group gap="lg" align="center" justify="space-between">
                      <Group gap="xs">
                        <Rating
                          value={property.ratingAvg}
                          readOnly
                          size="sm"
                          fractions={2}
                        />
                        <Text size="lg" fw={600} variant="light" c="brand.0">
                          {property.ratingAvg.toFixed(1)}
                        </Text>
                      </Group>
                      <Text size="md" variant="light" c="brand.0">
                        {property.reviews.length} reviews
                      </Text>
                    </Group>
                  </Stack>
                </CardSection>
                <Stack gap="md" mt="md">
                  {property.reviews.length === 0 ? (
                    <Text c="dimmed" ta="center" py="xl">
                      No reviews yet
                    </Text>
                  ) : (
                    property.reviews.map((review) => (
                      <Card key={review.id} withBorder p="md" radius="md">
                        <Stack gap="sm">
                          <Group justify="space-between">
                            <Group gap="sm">
                              <Avatar size="sm" color="brand">
                                {review.authorName?.charAt(0) ?? "G"}
                              </Avatar>
                              <Stack gap={2}>
                                <Text size="sm" fw={500}>
                                  {review.authorName ?? "Anonymous Guest"}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {new Date(
                                    review.createdAt,
                                  ).toLocaleDateString()}
                                </Text>
                              </Stack>
                            </Group>
                            <Group gap="xs">
                              <Rating
                                value={review.rating}
                                readOnly
                                size="xs"
                              />
                              <Text size="sm" fw={500}>
                                {review.rating}
                              </Text>
                            </Group>
                          </Group>

                          {review.title && (
                            <Text fw={500} size="sm">
                              {review.title}
                            </Text>
                          )}

                          <Text size="sm" c="dimmed">
                            {review.body}
                          </Text>

                          <Group gap="xs">
                            <Badge size="xs" variant="light">
                              {review.channel}
                            </Badge>
                            {review.categories.map((category, idx) => (
                              <Badge
                                key={idx}
                                size="xs"
                                variant="light"
                                color="brand"
                              >
                                {category.name}
                              </Badge>
                            ))}
                          </Group>
                        </Stack>
                      </Card>
                    ))
                  )}
                </Stack>
              </Card>
            </GridCol>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
}
