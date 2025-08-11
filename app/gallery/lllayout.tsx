// app/layout.tsx (or app/gallery/layout.tsx if you only want modals in gallery)
export default function Layout({
  children,
  modal
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      {children}    {/* normal page */}
      {modal}       {/* modal slot */}
    </>
  );
}
