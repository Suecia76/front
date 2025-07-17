import { motion, AnimatePresence } from "framer-motion";
import logo from "../.././assets/logo.png"; // Ajusta la ruta

const Loader = ({ isLoading }) => (
  <AnimatePresence>
    {isLoading && (
      <motion.div
        className="loader-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "#EFF3FF",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.img
          src={logo}
          alt="Logo"
          style={{ width: 120, height: 120 }}
          animate={{
            rotate: 360,
            transition: {
              repeat: Infinity,
              duration: 1.2,
              ease: "linear",
            },
          }}
        />
      </motion.div>
    )}
  </AnimatePresence>
);

export default Loader;
