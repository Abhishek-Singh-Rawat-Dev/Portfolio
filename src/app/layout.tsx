import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Abhishek Singh Rawat | Software Engineer Portfolio",
  description: "Portfolio of Abhishek Singh Rawat, a Software Engineer and B.Tech student specializing in C++, Web Development, and Competitive Programming. View his projects, skills, and coding achievements.",
  keywords: ["Abhishek Singh Rawat", "Software Engineer", "Portfolio", "Developer", "C++", "Web Development", "LeetCode", "GeeksforGeeks", "Github", "projects"],
  authors: [{ name: "Abhishek Singh Rawat" }],
  openGraph: {
    title: "Abhishek Singh Rawat | Software Engineer Portfolio",
    description: "Curiosity-driven software developer building modern web applications and mastering C++ & data structures. Explore my coding achievements and projects.",
    type: "website",
    url: "https://github.com/Abhishek-Singh-Rawat-Dev",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        {/* FontAwesome & Devicon Icons CDN */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
