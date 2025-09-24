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
  Flex,
  BackgroundImage,
  Box,
} from "@mantine/core";
import {
  IconChartBar,
  IconHome,
  IconMessageCircle,
  IconTrendingUp,
} from "@tabler/icons-react";

import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import Layout from "./_components/layout";
import SearchForm from "~/app/_components/search-form";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  return (
    <HydrateClient>
      <Layout>
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

              <SearchForm />
            </Container>
          </Flex>
        </BackgroundImage>
      </Layout>
    </HydrateClient>
  );
}
