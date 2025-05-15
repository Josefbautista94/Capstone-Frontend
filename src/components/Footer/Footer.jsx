import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} NYC Crime Tracker. Built by Jose Bautista 💻</p>
    </footer>
  );
}