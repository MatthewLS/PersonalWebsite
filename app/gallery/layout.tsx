export default function GalleryLayout({
  children,
  modal, // parallel route slot
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal} {/* This is where your portal/modal will show */}
      <div id="modal-root" />
    </>
  );
}
