import {
  Container,
  Card,
  Text,
  Title,
  Button,
  Group,
  ThemeIcon,
  Badge,
  Stack,
  CardSection,
  TextInput,
  NumberInput,
  Paper,
  Flex,
  BackgroundImage,
  Box,
  Select,
} from "@mantine/core";
import {
  IconChartBar,
  IconHome,
  IconMessageCircle,
  IconTrendingUp,
  IconSearch,
  IconCalendar,
  IconUsers,
  IconMapPin,
} from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";

import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import Layout from "./_components/layout";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  return (
    <HydrateClient>
      <Layout>
        {/* Hero Section with Background */}
        <BackgroundImage src="/Hero_Desktop_Large.webp" h="100%">
          <Flex h="100%" w="100%" justify="center" align="center">
            {/* Hero Content */}
            <Container w="100%" px="xxl" maw="1400px">
              <Box mb="xxl">
                <Title order={1} c="white" fw={700} mb="sm">
                  Book
                </Title>
                <Title order={1} c="white" fw={700}>
                  Beautiful Stays
                </Title>
              </Box>

              <Paper shadow="xxl" p="lg" radius="xl" w="100%" bg="light.0">
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  gap="lg"
                  align={{ base: "stretch", sm: "end" }}
                >
                  <Select
                    placeholder="Where are you going?"
                    leftSection={<IconMapPin size={18} />}
                    size="lg"
                    radius="lg"
                    style={{ flex: 1 }}
                    data={[
                      { value: "London", label: "London, UK" },
                      { value: "Paris", label: "Paris, France" },
                      { value: "Algiers", label: "Algiers, Algeria" },
                      { value: "Lisbon", label: "Lisbon, Portugal" },
                    ]}
                    variant="unstyled"
                  />
                  <DatePickerInput
                    valueFormat="MMM DD, YYYY"
                    placeholder="Dates"
                    leftSection={<IconCalendar size={18} />}
                    size="lg"
                    style={{ flex: 1 }}
                    type="range"
                    variant="unstyled"
                    color="brand"
                    c="brand"
                  />
                  <NumberInput
                    placeholder="Guests"
                    leftSection={<IconUsers size={18} />}
                    size="lg"
                    radius="lg"
                    min={1}
                    max={20}
                    variant="unstyled"
                    defaultValue={1}
                  />
                  <Button
                    size="lg"
                    color="brand"
                    radius="lg"
                    style={{ minWidth: "140px" }}
                    fw={600}
                  >
                    Search
                  </Button>
                </Flex>
              </Paper>
            </Container>
          </Flex>
        </BackgroundImage>
      </Layout>
    </HydrateClient>
  );
}
