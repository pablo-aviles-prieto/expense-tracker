import type { Metadata } from "next";
import Image from "next/image";
import { getRandomItem } from "@/utils/get-random-item";
import quotes from "../../public/data/quotes.json";
import authImages from "../../public/data/auth-images.json";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Signin or signup into expense tracker",
};

// TODO: Add the logo in top of the login/signup panels
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const quoteItem = getRandomItem(quotes);
  const imagePath = getRandomItem(authImages);

  return (
    <div className="relative flex-col items-center justify-center h-screen md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative flex-col hidden h-full p-10 text-white dark:border-r lg:flex">
        <div
          className="absolute inset-0 bg-zinc-900"
          style={{
            backgroundImage: `url('${imagePath}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-20 flex items-center text-lg font-medium gap-x-2 p-0.5 bg-black bg-opacity-20 rounded-lg w-[200px]">
          <Image
            src="/images/logo.webp"
            alt="Expense tracker logo"
            width={45}
            height={45}
          />
          <span className="">Expense tracker</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="p-2 space-y-2 bg-black bg-opacity-50 rounded-lg">
            <p className="text-lg">&ldquo;{quoteItem?.text}&rdquo;</p>
            <footer className="text-sm">{quoteItem?.person}</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center h-full p-4 lg:p-8">{children}</div>
    </div>
  );
}
