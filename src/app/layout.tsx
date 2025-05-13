import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserProvider";
import { Poetsen_One } from "next/font/google";
import { KeyBindProvider } from "@/context/KeybindContext";
import "./globals.css";
import { SocketProvider } from "@/context/SocketContext";
import { ToastContainer } from "react-toastify";

const poetsenOne = Poetsen_One({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poetsenOne.className}>
      <body>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <UserProvider>
          <SocketProvider>
            <KeyBindProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </KeyBindProvider>
          </SocketProvider>
        </UserProvider>
      </body>
    </html>
  );
}
