import React from "react";

export const BRAND_ASSETS = {
  mark: "https://media.base44.com/images/public/6a455fc5475b58bb52305622/a0460c0c0_pilothobb-mark.svg",
  logo: "https://media.base44.com/images/public/6a455fc5475b58bb52305622/ff105505c_pilothobb-logo.svg",
  icon: "https://media.base44.com/images/public/6a455fc5475b58bb52305622/18e6981fd_pilothobb-icon.svg",
  iconPng: "https://media.base44.com/images/public/6a455fc5475b58bb52305622/1a9086f0b_pilothobb-icon-appstore-1024.png",
};

export default function Logo({ size = 36, showWordmark = true }) {
  return (
    <img
      src={showWordmark ? BRAND_ASSETS.logo : BRAND_ASSETS.mark}
      onError={(e) => { e.currentTarget.src = BRAND_ASSETS.iconPng; }}
      alt="PilotHobb"
      style={{ height: size, width: "auto" }}
      className="shrink-0 select-none"
      draggable={false}
    />
  );
}