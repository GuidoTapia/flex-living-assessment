import Link from "next/link";
import {
  Card,
  Group,
  Stack,
  Title,
  Text,
  BackgroundImage,
  Paper,
  Flex,
  useMantineTheme,
  Box,
} from "@mantine/core";
import {
  IconMapPin,
  IconBed,
  IconBath,
  IconUsers,
  IconStar,
} from "@tabler/icons-react";

interface PropertyCardProps {
  property: {
    id: string;
    slug: string;
    name: string;
    address: string | null;
    city: string | null;
    country: string | null;
    ratingAvg: number;
    price?: number | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    guests?: number | null;
    image?: string | null;
    reviewCount: number;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const theme = useMantineTheme();
  return (
    <Card
      withBorder
      shadow="lg"
      radius="md"
      className="h-full"
      component={Link}
      href={`/property/${property.slug}`}
    >
      <Box>
        <Box style={{ position: "relative" }}>
          <BackgroundImage src={property.image} w="100%" h="224px" p="xs">
            <Flex justify="flex-end">
              {property.price && (
                <Paper bg="light.0" p={4}>
                  <Flex align="center" direction="column">
                    <Text size="md" c="brand" fw={700}>
                      ${property.price}
                    </Text>
                    <Text size="xs" c="brand">
                      per night
                    </Text>
                  </Flex>
                </Paper>
              )}
            </Flex>
          </BackgroundImage>
        </Box>
      </Box>

      <Box p="md">
        <Stack gap="sm">
          <Title order={3} size="h4">
            {property.name}
          </Title>

          <Group gap="xs" c="dimmed">
            <IconMapPin size={16} />
            <Text size="sm">{property.city}</Text>
          </Group>

          <Group gap="lg">
            {property.bedrooms && (
              <Group gap="xs">
                <IconBed size={16} />
                <Text size="sm">{property.bedrooms} bedrooms</Text>
              </Group>
            )}
            {property.bathrooms && (
              <Group gap="xs">
                <IconBath size={16} />
                <Text size="sm">{property.bathrooms} bathrooms</Text>
              </Group>
            )}
            {property.guests && (
              <Group gap="xs">
                <IconUsers size={16} />
                <Text size="sm">Up to {property.guests} guests</Text>
              </Group>
            )}
          </Group>

          <Group justify="space-between" align="center">
            <Group gap="xs">
              <Group gap="xs">
                <IconStar
                  size={16}
                  fill={theme.colors.brand?.[5]}
                  color={theme.colors.brand?.[5]}
                />
                <Text fw={500}>{property.ratingAvg.toFixed(1)}</Text>
              </Group>
              <Text size="sm" c="dimmed">
                ({property.reviewCount} reviews)
              </Text>
            </Group>
          </Group>
        </Stack>
      </Box>
    </Card>
  );
}
