import "./globals.css";

export const metadata = {
  title: "My Creative Space",
  description: "A gallery, blog, and live stream hub.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
