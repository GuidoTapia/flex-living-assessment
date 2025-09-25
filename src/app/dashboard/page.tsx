"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Badge,
  Button,
  Group,
  Select,
  TextInput,
  NumberInput,
  Stack,
  Table,
  Checkbox,
  ActionIcon,
  Tooltip,
  Progress,
  Tabs,
  Paper,
  SimpleGrid,
  ThemeIcon,
} from "@mantine/core";
import { api } from "~/trpc/react";
import {
  IconSearch,
  IconEye,
  IconStar,
  IconBuilding,
  IconMessageCircle,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import Layout from "../_components/layout";

export default function ManagerDashboard() {
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [filters, setFilters] = useState({
    search: "",
    channel: "",
    ratingMin: undefined as number | undefined,
    ratingMax: undefined as number | undefined,
    dateFrom: undefined as Date | null | undefined,
    dateTo: undefined as Date | null | undefined,
    approved: undefined as boolean | undefined,
  });
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);

  const { data: propertiesData, isLoading: propertiesLoading } =
    api.property.getAll.useQuery({
      limit: 50,
      search: filters.search,
      ratingMin: filters.ratingMin,
      dateFrom: filters.dateFrom ?? undefined,
      dateTo: filters.dateTo ?? undefined,
    });

  const { data: reviewsData, isLoading: reviewsLoading } =
    api.review.getAll.useQuery({
      limit: 100,
      propertyId: selectedProperty ?? undefined,
      approved: filters.approved,
      channel: filters.channel ?? undefined,
      ratingMin: filters.ratingMin,
      ratingMax: filters.ratingMax,
      dateFrom: filters.dateFrom ?? undefined,
      dateTo: filters.dateTo ?? undefined,
    });

  const { data: performanceData } = api.property.getPerformanceSummary.useQuery(
    {
      propertyId: selectedProperty ?? undefined,
      dateFrom: filters.dateFrom ?? undefined,
      dateTo: filters.dateTo ?? undefined,
    },
  );

  const { data: reviewStats } = api.review.getStats.useQuery({
    propertyId: selectedProperty ?? undefined,
    dateFrom: filters.dateFrom ?? undefined,
    dateTo: filters.dateTo ?? undefined,
  });

  const updateApprovalMutation = api.review.updateApproval.useMutation({
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Review approval status updated",
        color: "green",
      });
    },
  });

  const bulkUpdateApprovalMutation = api.review.bulkUpdateApproval.useMutation({
    onSuccess: () => {
      setSelectedReviews([]);
      notifications.show({
        title: "Success",
        message: "Bulk approval status updated",
        color: "green",
      });
    },
  });

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Dashboard - Auth status:", status);
    console.log("Dashboard - Session:", !!session);
    if (status === "unauthenticated") {
      console.log("Dashboard - Redirecting to sign in");
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Container size="xl" py="xl">
        <div>Loading...</div>
      </Container>
    );
  }

  if (!session) {
    return null;
  }

  const handleApprovalToggle = (reviewId: string, approved: boolean) => {
    updateApprovalMutation.mutate({ id: reviewId, approved });
  };

  const handleBulkApproval = (approved: boolean) => {
    if (selectedReviews.length === 0) return;
    bulkUpdateApprovalMutation.mutate({ ids: selectedReviews, approved });
  };

  const handleSelectAll = () => {
    if (selectedReviews.length === reviewsData?.reviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviewsData?.reviews.map((r) => r.id) ?? []);
    }
  };

  const handleSelectReview = (reviewId: string) => {
    setSelectedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id: string) => id !== reviewId)
        : [...prev, reviewId],
    );
  };

  if (propertiesLoading) {
    return (
      <Container size="xl" py="md">
        <Text>Loading dashboard...</Text>
      </Container>
    );
  }

  return (
    <Layout logOut>
      <Container size="xl" py="md">
        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconBuilding size={16} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab
              value="reviews"
              leftSection={<IconMessageCircle size={16} />}
            >
              Reviews
            </Tabs.Tab>
            <Tabs.Tab
              value="properties"
              leftSection={<IconBuilding size={16} />}
            >
              Properties
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="md">
            <Grid>
              <Grid.Col span={12}>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
                  <Paper p="md" withBorder>
                    <Group justify="space-between">
                      <div>
                        <Text size="sm" c="dimmed">
                          Total Reviews
                        </Text>
                        <Text size="xl" fw={700}>
                          {reviewStats?.totalReviews ?? 0}
                        </Text>
                      </div>
                      <ThemeIcon color="blue" variant="light" size="lg">
                        <IconMessageCircle size={20} />
                      </ThemeIcon>
                    </Group>
                  </Paper>

                  <Paper p="md" withBorder>
                    <Group justify="space-between">
                      <div>
                        <Text size="sm" c="dimmed">
                          Approved Reviews
                        </Text>
                        <Text size="xl" fw={700}>
                          {reviewStats?.approvedReviews ?? 0}
                        </Text>
                      </div>
                      <ThemeIcon color="green" variant="light" size="lg">
                        <IconCheck size={20} />
                      </ThemeIcon>
                    </Group>
                  </Paper>

                  <Paper p="md" withBorder>
                    <Group justify="space-between">
                      <div>
                        <Text size="sm" c="dimmed">
                          Pending Reviews
                        </Text>
                        <Text size="xl" fw={700}>
                          {reviewStats?.pendingReviews ?? 0}
                        </Text>
                      </div>
                      <ThemeIcon color="orange" variant="light" size="lg">
                        <IconEye size={20} />
                      </ThemeIcon>
                    </Group>
                  </Paper>

                  <Paper p="md" withBorder>
                    <Group justify="space-between">
                      <div>
                        <Text size="sm" c="dimmed">
                          Average Rating
                        </Text>
                        <Text size="xl" fw={700}>
                          {reviewStats?.avgRating?.toFixed(1) ?? "0.0"}
                        </Text>
                      </div>
                      <ThemeIcon color="yellow" variant="light" size="lg">
                        <IconStar size={20} />
                      </ThemeIcon>
                    </Group>
                  </Paper>
                </SimpleGrid>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card withBorder>
                  <Card.Section p="md">
                    <Title order={3}>Reviews by Channel</Title>
                  </Card.Section>
                  <Card.Section p="md">
                    <Stack gap="sm">
                      {reviewStats?.channelStats?.map((channel) => (
                        <div key={channel.channel}>
                          <Group justify="space-between" mb="xs">
                            <Text fw={500} tt="capitalize">
                              {channel.channel}
                            </Text>
                            <Text size="sm" c="dimmed">
                              {channel._count.channel} reviews
                            </Text>
                          </Group>
                          <Progress
                            value={
                              (channel._count.channel /
                                (reviewStats?.totalReviews ?? 1)) *
                              100
                            }
                            size="sm"
                          />
                        </div>
                      ))}
                    </Stack>
                  </Card.Section>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card withBorder>
                  <Card.Section p="md">
                    <Title order={3}>Reviews by Category</Title>
                  </Card.Section>
                  <Card.Section p="md">
                    <Stack gap="sm">
                      {reviewStats?.categoryStats?.map((category) => (
                        <div key={category.name}>
                          <Group justify="space-between" mb="xs">
                            <Text fw={500}>{category.name}</Text>
                            <Text size="sm" c="dimmed">
                              {category.count} reviews
                            </Text>
                          </Group>
                          <Progress
                            value={
                              (category.count /
                                (reviewStats?.totalReviews ?? 1)) *
                              100
                            }
                            size="sm"
                          />
                        </div>
                      ))}
                    </Stack>
                  </Card.Section>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="reviews" pt="md">
            <Card withBorder mb="md">
              <Card.Section p="md">
                <Title order={3} mb="md">
                  Filters
                </Title>
                <Grid>
                  
                  <Grid.Col span={{ base: 12, md: 2 }}>
                    <Select
                      placeholder="Channel"
                      data={[
                        { value: "airbnb", label: "Airbnb" },
                        { value: "booking", label: "Booking.com" },
                        { value: "direct", label: "Direct" },
                        { value: "google", label: "Google" },
                      ]}
                      value={filters.channel}
                      onChange={(value) =>
                        setFilters({ ...filters, channel: value ?? "" })
                      }
                      clearable
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 2 }}>
                    <Select
                      placeholder="Status"
                      data={[
                        { value: "true", label: "Approved" },
                        { value: "false", label: "Pending" },
                      ]}
                      value={filters.approved?.toString()}
                      onChange={(value) =>
                        setFilters({
                          ...filters,
                          approved: value ? value === "true" : undefined,
                        })
                      }
                      clearable
                    />
                  </Grid.Col>
                  
                </Grid>
              </Card.Section>
            </Card>

            {selectedReviews.length > 0 && (
              <Card withBorder mb="md">
                <Card.Section p="md">
                  <Group>
                    <Text fw={500}>
                      {selectedReviews.length} review
                      {selectedReviews.length > 1 ? "s" : ""} selected
                    </Text>
                    <Button
                      size="xs"
                      color="green"
                      onClick={() => handleBulkApproval(true)}
                      loading={bulkUpdateApprovalMutation.isPending}
                    >
                      Approve Selected
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      onClick={() => handleBulkApproval(false)}
                      loading={bulkUpdateApprovalMutation.isPending}
                    >
                      Reject Selected
                    </Button>
                  </Group>
                </Card.Section>
              </Card>
            )}

            <Card withBorder>
              <Card.Section p="md">
                <Group justify="space-between" mb="md">
                  <Title order={3}>Reviews</Title>
                  <Badge size="lg" variant="light">
                    {reviewsData?.reviews.length ?? 0} total
                  </Badge>
                </Group>

                {reviewsLoading ? (
                  <Text>Loading reviews...</Text>
                ) : (
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>
                          <Checkbox
                            checked={
                              selectedReviews.length ===
                                reviewsData?.reviews.length &&
                              reviewsData?.reviews.length > 0
                            }
                            indeterminate={
                              selectedReviews.length > 0 &&
                              selectedReviews.length <
                                (reviewsData?.reviews.length ?? 0)
                            }
                            onChange={handleSelectAll}
                          />
                        </Table.Th>
                        <Table.Th>Rating</Table.Th>
                        <Table.Th>Author</Table.Th>
                        <Table.Th>Channel</Table.Th>
                        <Table.Th>Title</Table.Th>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {reviewsData?.reviews.map((review) => (
                        <Table.Tr key={review.id}>
                          <Table.Td>
                            <Checkbox
                              checked={selectedReviews.includes(review.id)}
                              onChange={() => handleSelectReview(review.id)}
                            />
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <IconStar size={16} fill="gold" color="gold" />
                              <Text fw={500}>{review.rating}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">
                              {review.authorName ?? "Anonymous"}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge size="sm" variant="light" tt="capitalize">
                              {review.channel}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" lineClamp={1}>
                              {review.title ?? "No title"}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" c="dimmed">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              color={review.approved ? "green" : "orange"}
                              variant="light"
                              size="sm"
                            >
                              {review.approved ? "Approved" : "Pending"}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <Tooltip
                                label={review.approved ? "Reject" : "Approve"}
                              >
                                <ActionIcon
                                  color={review.approved ? "red" : "green"}
                                  variant="light"
                                  size="sm"
                                  onClick={() =>
                                    handleApprovalToggle(
                                      review.id,
                                      !review.approved,
                                    )
                                  }
                                  loading={updateApprovalMutation.isPending}
                                >
                                  {review.approved ? (
                                    <IconX size={14} />
                                  ) : (
                                    <IconCheck size={14} />
                                  )}
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                )}
              </Card.Section>
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="properties" pt="md">
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
              {propertiesData?.properties.map((property) => (
                <Card key={property.id} withBorder>
                  <Card.Section p="md">
                    <Title order={5} mb="md">
                      {property.name}
                    </Title>
                    <Group justify="space-between" mb="xs" align="center">
                      <Text size="sm" c="dimmed">
                        {property.city}, {property.country}
                      </Text>
                      <Badge color="brand" variant="light">
                        {property.metrics.totalReviews} reviews
                      </Badge>
                    </Group>
                  </Card.Section>

                  <Card.Section p="md" pt={0}>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text size="sm">Average Rating</Text>
                        <Group gap="xs">
                          <IconStar size={16} fill="gold" color="gold" />
                          <Text fw={500}>
                            {property.metrics.avgRating.toFixed(1)}
                          </Text>
                        </Group>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Approval Rate</Text>
                        <Text fw={500}>
                          {property.metrics.approvalRate.toFixed(1)}%
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Pending Reviews</Text>
                        <Badge color="orange" variant="light" size="sm">
                          {property.metrics.pendingReviews}
                        </Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Recent Reviews</Text>
                        <Text fw={500}>{property.metrics.recentReviews}</Text>
                      </Group>
                    </Stack>
                  </Card.Section>

                  <Card.Section p="md" pt={0}>
                    <Button
                      fullWidth
                      onClick={() => router.push(`/property/${property.slug}`)}
                    >
                      View Property
                    </Button>
                  </Card.Section>
                </Card>
              ))}
            </SimpleGrid>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Layout>
  );
}
