import "./globals.css";

export const metadata = {
  title: "Respectful Mother",
  description: "Gallery, Blog, etc.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
