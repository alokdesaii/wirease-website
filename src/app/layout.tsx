import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const jbm = JetBrains_Mono({
  variable: "--font-jbm",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Wirease | International Payments, FX and Wholesale Banknotes",
  description:
    "Hong Kong based international payments, currency exchange and wholesale banknote provider since 2010. Regulated in Hong Kong and Australia, reaching 100+ countries.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${jbm.variable} antialiased`}>
      <body>
        <Loader />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
