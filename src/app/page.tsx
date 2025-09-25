import { Container, Title, Flex, BackgroundImage, Box } from "@mantine/core";

import { HydrateClient } from "~/trpc/server";
import Layout from "./_components/layout";
import SearchForm from "~/app/_components/search-form";

export default async function Home() {
  return (
    <HydrateClient>
      <Layout>
        <BackgroundImage src="/Hero_Desktop_Large.webp" h="100%">
          <Flex h="100%" w="100%" justify="center" align="center">
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
