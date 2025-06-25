// src/components/LevelUpPopup.jsx
import { motion, AnimatePresence } from "framer-motion";

export default function LevelUpPopup({ show, level }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-xl shadow-xl z-50 text-lg font-semibold"
        >
          🎉 Congrats! You reached Level {level}!
        </motion.div>
      )}
    </AnimatePresence>
  );
}
