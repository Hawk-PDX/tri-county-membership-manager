import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

// Font configuration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// API Project metadata
export const metadata: Metadata = {
  title: "Next.js API Project",
  description: "A Next.js application focused on API development with TypeScript",
  keywords: ["nextjs", "api", "typescript", "react"],
  authors: [{ name: "Developer" }],
};

// Define the type for navigation items
type NavItem = {
  label: string;
  href: string;
};

// Navigation items
const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "API Docs", href: "/api-docs" },
  { label: "Endpoints", href: "/endpoints" },
  { label: "Examples", href: "/examples" },
];

// Root layout component with proper TypeScript typing
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="bg-zinc-800 text-white p-4 shadow-md">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
            <div className="text-xl font-bold mb-4 sm:mb-0">
              <Link href="/" className="hover:text-blue-300 transition-colors">
                Next.js API Project
              </Link>
            </div>
            <nav>
              <ul className="flex space-x-6">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="hover:text-blue-300 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-zinc-800 text-white p-4 mt-8">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Next.js API Project</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
