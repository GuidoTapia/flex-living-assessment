"use client";

import { useState, useEffect } from "react";
import { signIn, getSession, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
  Alert,
  Group,
  Box,
  ThemeIcon,
  Image,
  Flex,
} from "@mantine/core";
import { IconMail, IconLock, IconAlertCircle, IconBuilding } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  
  useEffect(() => {
    console.log("SignIn - Auth status:", status);
    console.log("SignIn - Session:", !!session);
    if (status === "authenticated") {
      console.log("SignIn - Redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("SignIn - Attempting sign in for:", email);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("SignIn - Result:", result);
      console.log("SignIn - Result.ok:", result?.ok);
      console.log("SignIn - Result.error:", result?.error);
      console.log("SignIn - Result.url:", result?.url);

      if (result?.error) {
        console.log("SignIn - Error:", result.error);
        setError("Invalid email or password");
        notifications.show({
          title: "Login Failed",
          message: "Invalid email or password",
          color: "red",
        });
        setLoading(false);
      } else if (result?.ok) {
        console.log("SignIn - Success, redirecting to dashboard");
        notifications.show({
          title: "Login Successful",
          message: "Welcome back!",
          color: "green",
        });
        
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("An unexpected error occurred");
      notifications.show({
        title: "Error",
        message: "An unexpected error occurred",
        color: "red",
      });
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Paper radius="md" p="xl" withBorder>
        <Flex align="center" justify="center" direction="column" mb="xl" gap="sm">
        <Image
                  src="/the-flex.webp"
                  alt="The Flex"
                  h={32}
                  w="auto"
                />
          <Text c="dimmed" size="sm">
            Sign in to your account
          </Text>
          </Flex>

        <form onSubmit={handleSubmit}>
          <Stack>
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red">
                {error}
              </Alert>
            )}

            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftSection={<IconMail size={16} />}
              size="md"
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftSection={<IconLock size={16} />}
              size="md"
            />

            <Button
              type="submit"
              fullWidth
              size="md"
              loading={loading}
              disabled={!email || !password}
            >
              Sign in
            </Button>

            <Group justify="space-between" mt="md">
              <Text size="sm" c="dimmed">
                Demo credentials:
              </Text>
              <Text size="xs" c="dimmed">
                admin@flexliving.com / admin123
              </Text>
            </Group>
          </Stack>
        </form>

        <Box ta="center" mt="xl">
          <Text size="sm" c="dimmed">
            Need access? Contact your administrator.
          </Text>
        </Box>
      </Paper>
    </Container>
  );
}
