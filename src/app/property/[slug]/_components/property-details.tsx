import {
  Card,
  Title,
  Text,
  Grid,
  Badge,
  Group,
  Stack,
  ThemeIcon,
  Divider,
  Box,
  GridCol,
  Paper,
} from "@mantine/core";
import {
  IconWifi,
  IconParking,
  IconPool,
  IconAirConditioning,
  IconChefHat,
  IconWashMachine,
  IconDeviceTv,
  IconCar,
  IconSwimming,
  IconCoffee,
  IconClock,
  IconShield,
  IconCalendarClock,
  IconBan,
  IconPaw,
  IconConfetti,
} from "@tabler/icons-react";

interface PropertyDetailsProps {
  property: {
    id: string;
    name: string;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    description?: string | null;
    ratingAvg: number;
    reviews: Array<{
      id: string;
      rating: number;
      title?: string | null;
      body: string;
      authorName?: string | null;
      channel: string;
      createdAt: Date;
      categories: Array<{
        name: string;
      }>;
    }>;
  };
}

const amenities = [
  { icon: IconWifi, label: "Free WiFi", available: true },
  { icon: IconParking, label: "Parking", available: true },
  { icon: IconPool, label: "Pool", available: true },
  { icon: IconAirConditioning, label: "Air Conditioning", available: true },
  { icon: IconChefHat, label: "Kitchen", available: true },
  { icon: IconWashMachine, label: "Washing Machine", available: true },
  { icon: IconDeviceTv, label: "TV", available: true },
  { icon: IconCar, label: "Car Rental", available: false },
  { icon: IconSwimming, label: "Swimming Pool", available: true },
  { icon: IconCoffee, label: "Coffee Machine", available: true },
];

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  return (
    <Stack gap="xl">
      {/* Description */}
      <Card shadow="lg" p="lg">
        <Title order={4} mb="md">
          About this property
        </Title>
        <Text size="md">
          Welcome to {property.name}, a beautifully designed property located in
          the heart of {property.city}, {property.country}. This spacious
          accommodation offers modern amenities and comfortable living spaces
          perfect for families, business travelers, and vacationers alike.
        </Text>

        {property.description && <Text size="md">{property.description}</Text>}
      </Card>

      {/* Amenities */}
      <Card shadow="lg" p="lg">
        <Title order={4} mb="md">
          Amenities
        </Title>
        <Grid>
          {amenities.map((amenity, index) => (
            <GridCol key={index} span={{ base: 6, md: 4 }}>
              <Group gap="sm">
                <ThemeIcon
                  color={amenity.available ? "brand" : "gray"}
                  variant="light"
                  size="sm"
                >
                  <amenity.icon size={16} />
                </ThemeIcon>
                <Text
                  size="sm"
                  c={amenity.available ? "dark" : "dimmed"}
                  td={amenity.available ? "none" : "line-through"}
                >
                  {amenity.label}
                </Text>
              </Group>
            </GridCol>
          ))}
        </Grid>
      </Card>

      {/* Stay Policies */}
      <Card shadow="lg" p="lg">
        <Title order={4} mb="xl" c="dark">
          Stay Policies
        </Title>
        <Stack gap="xl">
          {/* Check-in & Check-out */}
          <Paper bg="brand.0" p="xl" radius="xl" shadow="xs">
            <Group gap="md" mb="md">
              <ThemeIcon color="brand" variant="light" size="lg" radius="xl">
                <IconClock size={20} />
              </ThemeIcon>
              <Title order={5} c="dark">
                Check-in & Check-out
              </Title>
            </Group>
            <Grid>
              <GridCol span={{ base: 12, md: 6 }}>
                <Paper bg="white" p="md" radius="lg" shadow="xs">
                  <Text size="sm" c="dimmed" mb="xs">
                    Check-in Time
                  </Text>
                  <Text size="lg" fw={600} c="dark">
                    3:00 PM
                  </Text>
                </Paper>
              </GridCol>
              <GridCol span={{ base: 12, md: 6 }}>
                <Paper bg="white" p="md" radius="lg" shadow="xs">
                  <Text size="sm" c="dimmed" mb="xs">
                    Check-out Time
                  </Text>
                  <Text size="lg" fw={600} c="dark">
                    10:00 AM
                  </Text>
                </Paper>
              </GridCol>
            </Grid>
          </Paper>

          {/* House Rules */}
          <Paper bg="brand.0" p="xl" radius="xl" shadow="xs">
            <Group gap="md" mb="md">
              <ThemeIcon color="brand" variant="light" size="lg" radius="xl">
                <IconShield size={20} />
              </ThemeIcon>
              <Title order={5} c="dark">
                House Rules
              </Title>
            </Group>
            <Grid>
              <GridCol span={{ base: 12, md: 6 }}>
                <Paper bg="white" p="md" radius="lg" shadow="xs">
                  <Group gap="md">
                    <ThemeIcon color="dimmed" variant="light" size="sm">
                      <IconBan size={16} />
                    </ThemeIcon>
                    <Text fw={500} c="dark">
                      No smoking
                    </Text>
                  </Group>
                </Paper>
              </GridCol>
              <GridCol span={{ base: 12, md: 6 }}>
                <Paper bg="white" p="md" radius="lg" shadow="xs">
                  <Group gap="md">
                    <ThemeIcon color="dimmed" variant="light" size="sm">
                      <IconPaw size={16} />
                    </ThemeIcon>
                    <Text fw={500} c="dark">
                      No pets
                    </Text>
                  </Group>
                </Paper>
              </GridCol>
              <GridCol span={{ base: 12, md: 6 }}>
                <Paper bg="white" p="md" radius="lg">
                  <Group gap="md">
                    <ThemeIcon color="dimmed" variant="light" size="sm">
                      <IconConfetti size={16} />
                    </ThemeIcon>
                    <Text fw={500} c="dark">
                      No parties or events
                    </Text>
                  </Group>
                </Paper>
              </GridCol>
              <GridCol span={{ base: 12, md: 6 }}>
                <Paper bg="white" p="md" radius="lg">
                  <Group gap="md">
                    <ThemeIcon color="dimmed" variant="light" size="sm">
                      <IconShield size={16} />
                    </ThemeIcon>
                    <Text fw={500} c="dark">
                      Security deposit required
                    </Text>
                  </Group>
                </Paper>
              </GridCol>
            </Grid>
          </Paper>

          {/* Cancellation Policy */}
          <Paper bg="brand.0" p="xl" radius="xl" shadow="xs">
            <Group gap="md" mb="md">
              <ThemeIcon color="brand" variant="light" size="lg" radius="xl">
                <IconCalendarClock size={20} />
              </ThemeIcon>
              <Title order={5} c="dark">
                Cancellation Policy
              </Title>
            </Group>
            <Stack gap="md">
              <Paper bg="white" p="md" radius="lg">
                <Text fw={500} mb="sm" c="dark">
                  For stays less than 28 days
                </Text>
                <Stack gap="xs">
                  <Group gap="xs" align="flex-start">
                    <Box
                      w={8}
                      h={8}
                      bg="brand.6"
                      style={{ borderRadius: "50%", marginTop: 4 }}
                    />
                    <Text size="sm" c="dimmed">
                      Full refund up to 14 days before check-in
                    </Text>
                  </Group>
                  <Group gap="xs" align="flex-start">
                    <Box
                      w={8}
                      h={8}
                      bg="brand.6"
                      style={{ borderRadius: "50%", marginTop: 4 }}
                    />
                    <Text size="sm" c="dimmed">
                      No refund for bookings less than 14 days before check-in
                    </Text>
                  </Group>
                </Stack>
              </Paper>
              <Paper bg="white" p="md" radius="lg">
                <Text fw={500} mb="sm" c="dark">
                  For stays of 28 days or more
                </Text>
                <Stack gap="xs">
                  <Group gap="xs" align="flex-start">
                    <Box
                      w={8}
                      h={8}
                      bg="brand.6"
                      style={{ borderRadius: "50%", marginTop: 4 }}
                    />
                    <Text size="sm" c="dimmed">
                      Full refund up to 30 days before check-in
                    </Text>
                  </Group>
                  <Group gap="xs" align="flex-start">
                    <Box
                      w={8}
                      h={8}
                      bg="brand.6"
                      style={{ borderRadius: "50%", marginTop: 4 }}
                    />
                    <Text size="sm" c="dimmed">
                      No refund for bookings less than 30 days before check-in
                    </Text>
                  </Group>
                </Stack>
              </Paper>
            </Stack>
          </Paper>
        </Stack>
      </Card>

      {/* Location */}
      <Card shadow="lg" p="lg">
        <Title order={3} mb="md">
          Where you'll be
        </Title>
        <Text size="sm" c="dimmed" mb="md">
          {property.address && `${property.address}, `}
          {property.city}, {property.country}
        </Text>

        <Stack gap="sm" mt="md">
          <Text size="sm" fw={500}>
            Popular landmarks nearby:
          </Text>
          <Group gap="sm">
            <Badge variant="light" size="sm">
              City Center - 5 min walk
            </Badge>
            <Badge variant="light" size="sm">
              Beach - 10 min drive
            </Badge>
            <Badge variant="light" size="sm">
              Airport - 25 min drive
            </Badge>
            <Badge variant="light" size="sm">
              Train Station - 8 min walk
            </Badge>
          </Group>
        </Stack>
      </Card>
    </Stack>
  );
}
