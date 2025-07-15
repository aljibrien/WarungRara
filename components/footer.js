export default function Footer() {
  return (
    <footer className="text-white d-flex justify-content-center align-items-center custom-footer user-layout">
      <div className="text-center">
        <small>&copy; {new Date().getFullYear()} Warung Rara. Terima kasih sudah berkunjung!</small>
      </div>
    </footer>
  );
}
