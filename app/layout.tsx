import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { MISSION, SITE } from "@/lib/canon";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.descriptor.text}`,
  description: MISSION.text,
  openGraph: {
    title: `${SITE.name} — ${SITE.descriptor.text}`,
    description: MISSION.text,
    type: "website",
    siteName: SITE.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a
          href="#overlook"
          className="microlabel sr-only z-[70] bg-void px-4 py-2 text-phosphor focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
