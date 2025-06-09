import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

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
  return (
    <html lang="en">
      <body className={`${nunito.className} antialiased`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
