import { ThemeProvider } from "@/context/ThemeContext";
import { Inter } from "next/font/google";
import { Poetsen_One } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const poetsenOne = Poetsen_One({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className={`${poetsenOne.className}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
