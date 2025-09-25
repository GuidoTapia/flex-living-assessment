"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Title,
  Text,
  Grid,
  Paper,
  Flex,
  Select,
  NumberInput,
  Divider,
  Box,
  Loader,
  Center,
} from "@mantine/core";
import { IconMapPin, IconCalendar, IconUser } from "@tabler/icons-react";
import Layout from "../_components/layout";
import PropertyCard from "../_components/property-card";
import { api } from "~/trpc/react";
import { DatePickerInput } from "@mantine/dates";
import cities from "../shared/cities";

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    city: searchParams.get("city") ?? "",
    checkIn: searchParams.get("checkIn")
      ? new Date(searchParams.get("checkIn")!)
      : null,
    checkOut: searchParams.get("checkOut")
      ? new Date(searchParams.get("checkOut")!)
      : null,
    guests: parseInt(searchParams.get("guests") ?? "1"),
    priceMin: "",
    priceMax: "",
    rating: "",
  });

  const {
    data: propertiesData,
    isLoading,
    error,
    refetch,
  } = api.property.search.useQuery({
    city: filters.city || undefined,
    guests: filters.guests || undefined,
    priceMin: filters.priceMin ? parseFloat(filters.priceMin) : undefined,
    priceMax: filters.priceMax ? parseFloat(filters.priceMax) : undefined,
    ratingMin: filters.rating ? parseFloat(filters.rating) : undefined,
    limit: 20,
  });

  useEffect(() => {
    void refetch();
  }, [filters, refetch]);

  const properties = propertiesData?.properties ?? [];

  return (
    <Layout>
      <Box w="100%">
        <Box p="md">
          <Flex direction={{ base: "column", md: "row" }} gap="md" align="end">
            <Select
              placeholder="City"
              data={cities}
              value={filters.city}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, city: value ?? "" }))
              }
              flex={1}
              leftSection={<IconMapPin size={16} />}
            />
            <DatePickerInput
              placeholder="Dates"
              type="range"
              valueFormat="MMM DD, YYYY"
              value={
                filters.checkIn
                  ? [filters.checkIn, filters.checkOut]
                  : undefined
              }
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  checkIn: value ? value[0] : null,
                  checkOut: value ? value[1] : null,
                }))
              }
              flex={1}
              leftSection={<IconCalendar size={16} />}
            />
            <NumberInput
              placeholder="Guests"
              value={filters.guests}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, guests: value || 1 }))
              }
              flex={1}
              leftSection={<IconUser size={16} />}
              min={1}
            />
          </Flex>
        </Box>

        <Divider />

        {isLoading && (
          <Center p="xl">
            <Loader size="lg" />
          </Center>
        )}

        {error && (
          <Center p="xl">
            <Text c="red">Error loading properties: {error.message}</Text>
          </Center>
        )}

        {!isLoading && !error && (
          <Box w="100%" p="md">
            <Text size="sm" c="dimmed" mb="md">
              {properties.length} properties found
            </Text>

            <Grid gutter="lg">
              {properties.map((property) => (
                <Grid.Col key={property.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <PropertyCard property={property} />
                </Grid.Col>
              ))}
            </Grid>

            {properties.length === 0 && (
              <Paper withBorder p="xl" className="text-center">
                <div className="space-y-4">
                  <Title order={3} c="dimmed">
                    No properties available
                  </Title>
                  <Text c="dimmed">
                    Check back soon for new property listings and guest reviews.
                  </Text>
                </div>
              </Paper>
            )}
          </Box>
        )}
      </Box>
    </Layout>
  );
}
