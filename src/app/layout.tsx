import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Asap as Font } from "next/font/google";
import Script from "next/script";
import { z } from "zod";

const envSchema = z.object({
  ANALYTICS_SCRIPT_URL: z.string().optional(),
  ANALYTICS_ID: z.string().optional(),
  ANALYTICS_DOMAINS: z.string().optional(),
  NEXT_PUBLIC_PAGE_TITLE: z.string(),
  NEXT_PUBLIC_PAGE_DESCRIPTION: z.string(),
});

const env = envSchema.parse(process.env);

const inter = Font({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_PAGE_TITLE,
  description: env.NEXT_PUBLIC_PAGE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {env.ANALYTICS_SCRIPT_URL && (
        <head>
          <Script
            async
            src={env.ANALYTICS_SCRIPT_URL}
            data-website-id={env.ANALYTICS_ID}
            data-domains={env.ANALYTICS_DOMAINS}
          />
        </head>
      )}
      <body className={`min-h-screen bg-background ${inter.className}`}>
        <div className="mx-auto flex w-11/12 max-w-screen-md flex-col">
          <div className="flex min-h-screen flex-col">
            <NavBar />
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
