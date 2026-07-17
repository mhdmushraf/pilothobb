import React, { useState, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function BottomSheet({ onClose, children, className = "" }) {
  const [visible, setVisible] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, prefersReducedMotion ? 0 : 200);
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.y > 100 || info.velocity.y > 500) handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={handleClose}
    >
      <motion.div
        className="absolute inset-0 bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className={`relative w-full sm:max-w-md max-h-[85vh] overflow-y-auto app-scroll rounded-t-3xl sm:rounded-3xl bg-cockpit-panel border-t border-cockpit-border safe-bottom ${className}`}
        initial={{ y: "100%" }}
        animate={{ y: visible ? 0 : "100%" }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { type: "spring", damping: 32, stiffness: 320 }
        }
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={handleDragEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          onPointerDown={(e) => dragControls.start(e)}
          className="flex justify-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing"
        >
          <div className="w-10 h-1 rounded-full bg-cockpit-border" />
        </div>
        <div className="px-5 pb-28">{children}</div>
      </motion.div>
    </div>
  );
}