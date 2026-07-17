import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const THRESHOLD = 60;

export function usePullToRefresh(onRefresh) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);

  const onTouchStart = (e) => {
    if (window.scrollY <= 0 && !refreshing) {
      if (e.target.closest(".fixed")) return;
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    }
  };

  const onTouchMove = (e) => {
    if (!pulling.current || refreshing) return;
    const diff = e.touches[0].clientY - startY.current;
    if (diff > 0) setPull(Math.min(diff, 80));
  };

  const onTouchEnd = async () => {
    if (!pulling.current) return;
    pulling.current = false;
    if (pull >= THRESHOLD) {
      setRefreshing(true);
      setPull(0);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    } else {
      setPull(0);
    }
  };

  const pullIndicator =
    pull > 0 || refreshing ? (
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{
          height: refreshing ? 40 : pull,
          transition: refreshing ? "height 0.2s ease" : "none",
        }}
      >
        <Loader2
          className={`w-5 h-5 text-cockpit-amber ${refreshing ? "animate-spin" : ""}`}
          style={{ opacity: refreshing ? 1 : Math.min(pull / THRESHOLD, 1) }}
        />
      </div>
    ) : null;

  return { onTouchStart, onTouchMove, onTouchEnd, pullIndicator };
}