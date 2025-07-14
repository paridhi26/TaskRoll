import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Game of Life",
  description: "A daily quest tracker that turns your real-life tasks into XP, levels, and adventure!",
  openGraph: {
    title: "Game of Life",
    description: "Be the player of your own life. Track tasks, earn XP, and hand off to tomorrow's you.",
    url: "https://task-roll-nine.vercel.app",
    siteName: "Game of Life",
    images: [
      {
        url: "/preview.png", // Add this image to your /public folder
        width: 1200,
        height: 630,
        alt: "Game of Life App Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game of Life",
    description: "Your life, now with XP and quests.",
    images: ["/preview.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
