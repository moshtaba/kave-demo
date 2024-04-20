import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/util/react-query-provider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <main className="p-5">{children}</main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
