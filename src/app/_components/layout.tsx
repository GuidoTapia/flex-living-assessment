"use client";

import { AppShell, Group, Title, Button, Image } from "@mantine/core";
import { IconBuilding } from "@tabler/icons-react";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <AppShell header={{ height: 88 }}>
      <AppShell.Header py={16} bg="light.0">
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Group gap="sm">
                <Image src="/the-flex.webp" alt="The Flex" h={32} w="auto" />
              </Group>
            </Link>
          </Group>

          <Group>
            <Button
              component={Link}
              href="/auth/signin"
              variant="transparent"
              leftSection={<IconBuilding size={16} />}
            >
              Manage Properties
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main style={{ height: "calc(100vh - 88px)", padding: 0 }}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
