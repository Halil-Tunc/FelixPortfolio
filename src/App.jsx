import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import BackgroundGlow from "./components/ui/BackgroundGlow";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ImageModal from "./components/gallery/ImageModal";
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import AboutPage from "./pages/AboutPage";
import PermissionsPage from "./pages/PermissionsPage";
import ContactPage from "./pages/ContactPage";

const VALID_PAGES = ["home", "gallery", "about", "permissions", "contact"];

function getPageFromHash() {
  const raw = window.location.hash.replace("#", "").trim();
  if (VALID_PAGES.includes(raw)) return raw;
  return "home";
}

export default function App() {
  const [page, setPage] = useState(getPageFromHash());
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = "home";
    }

    const onHashChange = () => {
      setPage(getPageFromHash());
      setMenuOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedItem(null);
      }
    };

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const navigate = (nextPage) => {
    window.location.hash = nextPage;
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-white selection:text-black">
      <BackgroundGlow />

      <Navbar
        page={page}
        navigate={navigate}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.28 }}
          >
            {page === "home" && (
              <HomePage navigate={navigate} setSelectedItem={setSelectedItem} />
            )}
            {page === "gallery" && (
              <GalleryPage setSelectedItem={setSelectedItem} />
            )}
            {page === "about" && <AboutPage />}
            {page === "permissions" && (
              <PermissionsPage setSelectedItem={setSelectedItem} />
            )}
            {page === "contact" && <ContactPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer navigate={navigate} />

      <AnimatePresence>
        {selectedItem && (
          <ImageModal item={selectedItem} close={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
