import AppNav from "./AppNav";
import Logo from "./Logo";

import styles from "../components/Sidebar.module.css";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />

      <AppNav />

      <p>List of cities</p>

      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; Copyright {new Date().getFullYear()} WorldWise Inc.
        </p>
      </footer>
    </div>
  );
}
