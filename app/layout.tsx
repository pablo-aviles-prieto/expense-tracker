import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "filepond/dist/filepond.min.css";
import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

// TODO: Check the height of the viewport to display only 1 calendar instead of 2
// TODO: En las tablas con paginación, añadir la paginación en la línea de las rows
// TODO?: Restablecer le initialFocus en lso calendars ? No deberian crashear
// TODO: Add a readme
// TODO: Check not leaking any key into the client!
// TODO: Create a sample video

export const metadata: Metadata = {
  title: "Expense Tracker - Simplify Your Financial Management",
  description:
    "Expense Tracker is an intuitive app designed to help you manage your finances effortlessly. Keep track of your incomes, expenses, and subscriptions, analyze your financial habits, and make informed decisions. Featuring a user-friendly dashboard, transaction filtering, bulk CSV uploads, and subscription management.",
  keywords: [
    "expense tracker",
    "financial management",
    "budgeting",
    "income tracking",
    "expense tracking",
    "subscription management",
  ],
  authors: [{ name: "Pablo Avilés Prieto", url: "https://www.pabloaviles.es" }],
  applicationName: "Expense Tracker",
  icons: [{ rel: "icon", url: "/images/favicon.ico" }],
  openGraph: {
    type: "website",
    url: "https://www.expense-tracker.pabloaviles.es",
    title: "Manage Your Finances with Ease | Expense Tracker",
    description:
      "Track your incomes and expenses, manage subscriptions, and get insights into your financial habits with Expense Tracker. Start simplifying your financial management today.",
    images: [
      {
        url: "https://www.expense-tracker.pabloaviles.es/images/social-networks-preview.png",
      },
    ],
    siteName: "Expense Tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manage Your Finances with Ease | Expense Tracker",
    description:
      "Track your incomes and expenses, manage subscriptions, and get insights into your financial habits with Expense Tracker. Start simplifying your financial management today.",
    images:
      "https://www.expense-tracker.pabloaviles.es/images/social-networks-preview.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <Providers session={session}>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
