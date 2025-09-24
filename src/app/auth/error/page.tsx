"use client";

import { useSearchParams } from "next/navigation";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Alert,
  Group,
} from "@mantine/core";
import { IconAlertCircle, IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <Container size={420} my={40}>
      <Paper radius="md" p="xl" withBorder>
        <Stack align="center" gap="lg">
          <Title order={2} size="h2" ta="center">
            Authentication Error
          </Title>

          <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
            {errorMessage}
          </Alert>

          <Text size="sm" c="dimmed" ta="center">
            Please try signing in again or contact support if the problem
            persists.
          </Text>

          <Group>
            <Button
              component={Link}
              href="/auth/signin"
              variant="outline"
              leftSection={<IconArrowLeft size={16} />}
            >
              Back to Sign In
            </Button>
            <Button component={Link} href="/">
              Go Home
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
