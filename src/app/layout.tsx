import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "~/trpc/react";
import { theme } from "~/styles/theme";

export const metadata: Metadata = {
  title: "Flex Living Reviews System",
  description: "Manage guest reviews and showcase your property's best features",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <SessionProvider>
          <MantineProvider theme={theme} defaultColorScheme="light">
            <Notifications />
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </MantineProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
