"use client";

import {
  AppShell,
  Group,
  Title,
  Button,
  Image,
  Transition,
} from "@mantine/core";
import { IconBuilding, IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

interface LayoutProps {
  children: React.ReactNode;
  logOut?: boolean;
}

export default function Layout({ children, logOut }: LayoutProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppShell header={{ height: 88 }}>
      <AppShell.Header
        py={16}
        bg={scrolled ? "brand.6" : "light.0"}
        style={{
          transition: "background-color 0.3s ease, box-shadow 0.3s ease",
          boxShadow: scrolled ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none",
          border: 0,
        }}
      >
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Group gap="sm">
                <Image
                  src={scrolled ? "/the-flex-negative.webp" : "/the-flex.webp"}
                  alt="The Flex"
                  h={32}
                  w="auto"
                />
              </Group>
            </Link>
          </Group>

            <Group>
              {logOut ? (
                <Button
                  variant="transparent"
                  leftSection={<IconLogout size={16} />}
                  color={scrolled ? "light.0" : "brand.6"}
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  component={Link}
                  href="/auth/signin"
                  variant="transparent"
                  leftSection={<IconBuilding size={16} />}
                  color={scrolled ? "light.0" : "brand.6"}
                >
                  Manage Properties
                </Button>
              )}
            </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main h="100vh">{children}</AppShell.Main>
    </AppShell>
  );
}
