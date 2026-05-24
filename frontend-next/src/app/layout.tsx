import type { Metadata } from "next";
import "../styles/globals.scss";
import { IntroProvider } from "@/components/IntroProvider";

export const metadata: Metadata = {
  title: "KAIROS — Online Banking",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="page--intro is-intro-pending" suppressHydrationWarning>
      <head>
        <style id="intro-critical" dangerouslySetInnerHTML={{ __html: `
          html { overflow-y: scroll; }
          html.page--intro body { background: #001b33; overflow: hidden; height: 100%; max-height: 100vh; }
          .intro-curtain { position: fixed; inset: 0; z-index: 10000; background: #001b33; clip-path: inset(0 0 0 0); pointer-events: all; }
        `}} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bruno+Ace&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="is-intro-pending">
        <IntroProvider>
          {children}
        </IntroProvider>
      </body>
    </html>
  );
}
