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
} from "@tabler/icons-react";

interface PropertyDetailsProps {
  property: {
    id: string;
    name: string;
    address?: string | null;
    city?: string | null;
    country?: string | null;
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
    <div className="space-y-6">
      {/* Description */}
      <Card withBorder>
        <Card.Section p="md">
          <Title order={3} mb="md">
            About this property
          </Title>
          <Text size="sm" c="dimmed" lineClamp={4}>
            Welcome to {property.name}, a beautifully designed property located
            in the heart of {property.city}, {property.country}. This spacious
            accommodation offers modern amenities and comfortable living spaces
            perfect for families, business travelers, and vacationers alike.
          </Text>
          <Text size="sm" c="dimmed" mt="md">
            Experience the perfect blend of comfort and convenience with our
            fully equipped facilities and prime location. Whether you're here
            for business or leisure, our property provides everything you need
            for a memorable stay.
          </Text>
        </Card.Section>
      </Card>

      {/* Amenities */}
      <Card withBorder>
        <Card.Section p="md">
          <Title order={3} mb="md">
            What this place offers
          </Title>
          <Grid>
            {amenities.map((amenity, index) => (
              <Grid.Col key={index} span={6} md={4}>
                <Group gap="sm">
                  <ThemeIcon
                    color={amenity.available ? "green" : "gray"}
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
              </Grid.Col>
            ))}
          </Grid>
        </Card.Section>
      </Card>

      {/* Location */}
      <Card withBorder>
        <Card.Section p="md">
          <Title order={3} mb="md">
            Where you'll be
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            {property.address && `${property.address}, `}
            {property.city}, {property.country}
          </Text>

          {/* Map placeholder */}
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Interactive Map</span>
          </div>

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
        </Card.Section>
      </Card>

      {/* House Rules */}
      <Card withBorder>
        <Card.Section p="md">
          <Title order={3} mb="md">
            House rules
          </Title>
          <Stack gap="sm">
            <Group gap="sm">
              <ThemeIcon color="blue" variant="light" size="sm">
                <IconWifi size={16} />
              </ThemeIcon>
              <Text size="sm">Check-in: 3:00 PM - 11:00 PM</Text>
            </Group>
            <Group gap="sm">
              <ThemeIcon color="blue" variant="light" size="sm">
                <IconWifi size={16} />
              </ThemeIcon>
              <Text size="sm">Check-out: 11:00 AM</Text>
            </Group>
            <Group gap="sm">
              <ThemeIcon color="blue" variant="light" size="sm">
                <IconWifi size={16} />
              </ThemeIcon>
              <Text size="sm">Self check-in with keypad</Text>
            </Group>
            <Group gap="sm">
              <ThemeIcon color="blue" variant="light" size="sm">
                <IconWifi size={16} />
              </ThemeIcon>
              <Text size="sm">No smoking</Text>
            </Group>
            <Group gap="sm">
              <ThemeIcon color="blue" variant="light" size="sm">
                <IconWifi size={16} />
              </ThemeIcon>
              <Text size="sm">No pets allowed</Text>
            </Group>
            <Group gap="sm">
              <ThemeIcon color="blue" variant="light" size="sm">
                <IconWifi size={16} />
              </ThemeIcon>
              <Text size="sm">No parties or events</Text>
            </Group>
          </Stack>
        </Card.Section>
      </Card>
    </div>
  );
}
