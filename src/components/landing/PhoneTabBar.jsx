import React from "react";
import { Home, Compass, Plus, Plane, MoreHorizontal } from "lucide-react";

/**
 * Tab bar shared by the marketing phone mockups — matches the native app:
 * Home · Map · (+) · Fleet · More.
 */
export default function PhoneTabBar({ active = "home" }) {
  const Tab = ({ id, icon: Icon, label }) => (
    <div className="flex flex-1 flex-col items-center gap-0.5">
      <Icon className={`h-3.5 w-3.5 ${active === id ? "text-cockpit-amber" : "text-cockpit-muted"}`} />
      <span className={`text-[7px] ${active === id ? "font-semibold text-cockpit-amber" : "text-cockpit-muted"}`}>{label}</span>
    </div>
  );
  return (
    <div className="flex items-center border-t border-cockpit-border bg-cockpit-panel px-2 pb-2.5 pt-2">
      <Tab id="home" icon={Home} label="Home" />
      <Tab id="map" icon={Compass} label="Map" />
      <div className="flex flex-1 justify-center">
        <div className="-mt-5 flex h-9 w-9 items-center justify-center rounded-full bg-cockpit-amber shadow-lg shadow-cockpit-amber/30">
          <Plus className="h-4 w-4 text-cockpit-bg" />
        </div>
      </div>
      <Tab id="fleet" icon={Plane} label="Fleet" />
      <Tab id="more" icon={MoreHorizontal} label="More" />
    </div>
  );
}
