"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Paper, Flex, Select, NumberInput, Button } from "@mantine/core";
import {
  IconSearch,
  IconCalendar,
  IconUsers,
  IconMapPin,
} from "@tabler/icons-react";
import {
  DatePickerInput,
  type DateValue,
  type DatesRangeValue,
} from "@mantine/dates";
import cities from "../shared/cities";

export default function SearchForm() {
  const [searchParams, setSearchParams] = useState({
    city: "",
    dateRange: undefined as DatesRangeValue<DateValue> | undefined,
    guests: 1,
  });
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Build search parameters
    const params = new URLSearchParams();
    if (searchParams.city) params.set("city", searchParams.city);
    if (searchParams.dateRange && searchParams.dateRange[0]) {
      const checkInDate = searchParams.dateRange[0];
      const checkInString =
        typeof checkInDate === "string"
          ? checkInDate
          : checkInDate.toISOString();
      params.set("checkIn", checkInString);
    }
    if (searchParams.dateRange && searchParams.dateRange[1]) {
      const checkOutDate = searchParams.dateRange[1];
      const checkOutString =
        typeof checkOutDate === "string"
          ? checkOutDate
          : checkOutDate.toISOString();
      params.set("checkOut", checkOutString);
    }
    if (searchParams.guests)
      params.set("guests", searchParams.guests.toString());

    // Navigate to properties page with search parameters
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <Paper shadow="xxl" p="lg" radius="xl" w="100%" bg="light.0">
      <form onSubmit={handleSearch}>
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
            data={cities}
            value={searchParams.city}
            onChange={(value) =>
              setSearchParams((prev) => ({ ...prev, city: value || "" }))
            }
            variant="unstyled"
          />
          <DatePickerInput
            placeholder="Dates"
                
            leftSection={<IconCalendar size={18} />}
            size="lg"
            radius="lg"
            style={{ flex: 1 }}
            value={searchParams.dateRange}
            onChange={(value) =>
              setSearchParams((prev) => ({ ...prev, dateRange: value }))
            }
            variant="unstyled"
            type="range"
            color="brand"
            minDate={new Date()}
            valueFormat="MMM DD, YYYY"
          />
          <NumberInput
            placeholder="Guests"
            leftSection={<IconUsers size={18} />}
            size="lg"
            radius="lg"
            min={1}
            max={20}
            variant="unstyled"
            value={searchParams.guests}
            onChange={(value) =>
              setSearchParams((prev) => ({
                ...prev,
                guests: Number(value) || 1,
              }))
            }
          />
          <Button
            type="submit"
            size="lg"
            color="brand"
            radius="lg"
            style={{ minWidth: "140px" }}
            fw={600}
            leftSection={<IconSearch size={18} />}
          >
            Search
          </Button>
        </Flex>
      </form>
    </Paper>
  );
}
