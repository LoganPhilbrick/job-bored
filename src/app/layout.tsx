"use client";

import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const nunito = Nunito({
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <html lang="en">
        <body className={`${nunito.className} antialiased`}>
          <Header />
          <main>{children}</main>
        </body>
      </html>
    </QueryClientProvider>
  );
}
