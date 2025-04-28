import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from '@/context/UserProvider';
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
        <UserProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
