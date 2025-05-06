import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserProvider";
import { Inter } from "next/font/google";
import { Poetsen_One } from "next/font/google";
import { KeyBindProvider } from "@/context/KeybindContext";
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
        <KeyBindProvider userId={""}>
          <UserProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </UserProvider>
        </KeyBindProvider>
      </body>
    </html>
  );
}
