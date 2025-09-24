"use client";

import { useState } from "react";
import {
  Card,
  Title,
  Text,
  Group,
  Stack,
  Badge,
  Button,
  Avatar,
  Divider,
  Modal,
  Select,
  TextInput,
  Textarea,
  Rating,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconStar,
  IconStarFilled,
  IconMessageCircle,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";

interface Review {
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
}

interface ReviewsSectionProps {
  reviews: Review[];
  propertyName: string;
}

export default function ReviewsSection({ reviews, propertyName }: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating">("newest");
  const [filterChannel, setFilterChannel] = useState<string>("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => Math.round(r.rating) === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => Math.round(r.rating) === rating).length / reviews.length) * 100 
      : 0,
  }));

  
  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (filterChannel && review.channel !== filterChannel) return false;
      if (filterRating && Math.round(review.rating) !== filterRating) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
    open();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <IconStar
        key={i}
        size={16}
        fill={i < rating ? "gold" : "none"}
        color={i < rating ? "gold" : "#d1d5db"}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card withBorder>
        <Card.Section p="md">
          <Group justify="space-between" mb="md">
            <Title order={3}>
              <Group gap="xs">
                <IconMessageCircle size={20} />
                Guest Reviews
              </Group>
            </Title>
            <Badge size="lg" variant="light">
              {reviews.length} reviews
            </Badge>
          </Group>

          {/* Average Rating */}
          <Group gap="md" mb="md">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
              <Group justify="center" gap="xs" mt="xs">
                {renderStars(Math.round(averageRating))}
              </Group>
            </div>
            
            {/* Rating Distribution */}
            <div className="flex-1">
              <Stack gap="xs">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <Group key={rating} gap="sm">
                    <Text size="sm" w={20}>
                      {rating}
                    </Text>
                    <IconStar size={14} fill="gold" color="gold" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <Text size="sm" c="dimmed" w={30}>
                      {count}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </div>
          </Group>
        </Card.Section>
      </Card>

      {/* Filters */}
      <Card withBorder>
        <Card.Section p="md">
          <Title order={4} mb="md">
            Filter Reviews
          </Title>
          <Stack gap="md">
            <Group grow>
              <Select
                placeholder="Sort by"
                data={[
                  { value: "newest", label: "Newest first" },
                  { value: "oldest", label: "Oldest first" },
                  { value: "rating", label: "Highest rating" },
                ]}
                value={sortBy}
                onChange={(value) => setSortBy(value as "newest" | "oldest" | "rating")}
                leftSection={<IconSortAscending size={16} />}
              />
            </Group>
            
            <Group grow>
              <Select
                placeholder="Filter by channel"
                data={[
                  { value: "airbnb", label: "Airbnb" },
                  { value: "booking", label: "Booking.com" },
                  { value: "direct", label: "Direct" },
                  { value: "google", label: "Google" },
                ]}
                value={filterChannel}
                onChange={(value) => setFilterChannel(value || "")}
                clearable
                leftSection={<IconFilter size={16} />}
              />
              
              <Select
                placeholder="Filter by rating"
                data={[
                  { value: "5", label: "5 stars" },
                  { value: "4", label: "4 stars" },
                  { value: "3", label: "3 stars" },
                  { value: "2", label: "2 stars" },
                  { value: "1", label: "1 star" },
                ]}
                value={filterRating?.toString()}
                onChange={(value) => setFilterRating(value ? parseInt(value) : null)}
                clearable
              />
            </Group>
          </Stack>
        </Card.Section>
      </Card>

      {/* Reviews List */}
      <Card withBorder>
        <Card.Section p="md">
          <Title order={4} mb="md">
            Guest Reviews ({filteredAndSortedReviews.length})
          </Title>
          
          <Stack gap="md">
            {filteredAndSortedReviews.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No reviews match your filters
              </Text>
            ) : (
              filteredAndSortedReviews.map((review, index) => (
                <div key={review.id}>
                  <div
                    className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                    onClick={() => handleReviewClick(review)}
                  >
                    <Group justify="space-between" mb="xs">
                      <Group gap="xs">
                        <Avatar size="sm" color="blue">
                          {review.authorName?.charAt(0) || "G"}
                        </Avatar>
                        <div>
                          <Text size="sm" fw={500}>
                            {review.authorName || "Anonymous Guest"}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Text>
                        </div>
                      </Group>
                      
                      <Group gap="xs">
                        <Badge size="sm" variant="light" tt="capitalize">
                          {review.channel}
                        </Badge>
                        <Group gap="xs">
                          {renderStars(Math.round(review.rating))}
                          <Text size="sm" fw={500}>
                            {review.rating}
                          </Text>
                        </Group>
                      </Group>
                    </Group>
                    
                    {review.title && (
                      <Text size="sm" fw={500} mb="xs">
                        {review.title}
                      </Text>
                    )}
                    
                    <Text size="sm" c="dimmed" lineClamp={2}>
                      {review.body}
                    </Text>
                    
                    {review.categories.length > 0 && (
                      <Group gap="xs" mt="xs">
                        {review.categories.map((category, idx) => (
                          <Badge key={idx} size="xs" variant="outline">
                            {category.name}
                          </Badge>
                        ))}
                      </Group>
                    )}
                  </div>
                  
                  {index < filteredAndSortedReviews.length - 1 && <Divider mt="md" />}
                </div>
              ))
            )}
          </Stack>
        </Card.Section>
      </Card>

      {/* Review Detail Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Review Details"
        size="lg"
      >
        {selectedReview && (
          <Stack gap="md">
            <Group justify="space-between">
              <Group gap="md">
                <Avatar size="lg" color="blue">
                  {selectedReview.authorName?.charAt(0) || "G"}
                </Avatar>
                <div>
                  <Text fw={500} size="lg">
                    {selectedReview.authorName || "Anonymous Guest"}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {new Date(selectedReview.createdAt).toLocaleDateString()}
                  </Text>
                  <Group gap="xs" mt="xs">
                    {renderStars(Math.round(selectedReview.rating))}
                    <Text size="sm" fw={500}>
                      {selectedReview.rating}/5
                    </Text>
                  </Group>
                </div>
              </Group>
              
              <Badge size="lg" variant="light" tt="capitalize">
                {selectedReview.channel}
              </Badge>
            </Group>
            
            <Divider />
            
            {selectedReview.title && (
              <Text fw={500} size="lg">
                {selectedReview.title}
              </Text>
            )}
            
            <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
              {selectedReview.body}
            </Text>
            
            {selectedReview.categories.length > 0 && (
              <div>
                <Text size="sm" fw={500} mb="xs">
                  Categories:
                </Text>
                <Group gap="xs">
                  {selectedReview.categories.map((category, idx) => (
                    <Badge key={idx} variant="outline">
                      {category.name}
                    </Badge>
                  ))}
                </Group>
              </div>
            )}
          </Stack>
        )}
      </Modal>
    </div>
  );
}
