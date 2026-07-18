import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le Château des Langues",
  applicationName: "Le Château des Langues",
  description: "تعلّم اللغات داخل عالم القلعة التفاعلي.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Le Château des Langues",
    statusBarStyle: "black-translucent",
  },
};

export { default } from "./kingdom/page";
