import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
const INVITATION_SRC = "/invitation.webp";
const GATE_SRC = "/gate-new.webp";
import { DiamondDust } from "@/components/DiamondDust";
import { Guestbook } from "@/components/Guestbook";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maha Zubair | Ali Haider | Wedding Ceremony" },
      {
        name: "description",
        content:
          "Join us for the Wedding Ceremony of Maha Zubair and Ali Haider on Sunday, 12 May 2026 at The Grande Banquet.",
      },
      { property: "og:title", content: "Maha Zubair | Ali Haider | Wedding Ceremony" },
      {
        property: "og:description",
        content: "Sunday | 12 May | 2026 | The Grande Banquet | Baraat at 7 PM",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preload", as: "image", href: GATE_SRC, fetchpriority: "high" },
      { rel: "prefetch", as: "image", href: INVITATION_SRC },
    ],
  }),

  component: Index,
});

function Index() {
  const [opened, setOpened] = useState(false);
  const [guestbookOpen, setGuestbookOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Invitation background */}
      <div
        className="fixed inset-0 z-0 bg-contain bg-center bg-no-repeat sm:bg-contain"
        style={{ backgroundImage: `url(${INVITATION_SRC})` }}
        aria-label="Wedding invitation with gold and ivory roses"
        role="img"
      />

      <DiamondDust />

      {/* Guestbook button */}
      <div className="fixed inset-x-0 bottom-6 z-30 flex justify-center">
        <button
          data-no-sparks
          onClick={() => setGuestbookOpen(true)}
          className="rounded-full border border-[#d29d98]/50 bg-black/30 px-7 py-2.5 font-body text-sm tracking-widest text-[#F4F4F4] uppercase backdrop-blur-md transition-all hover:shadow-[0_0_20px_rgba(210,157,152,0.45)]"
        >
          Guestbook
        </button>
      </div>

      {guestbookOpen ? <Guestbook onClose={() => setGuestbookOpen(false)} /> : null}

      {/* The Gate */}
      <div
        className={`fixed inset-0 z-40 cursor-pointer ${opened ? "pointer-events-none" : ""}`}
        aria-hidden={opened}
        onClick={() => setOpened(true)}
      >
        <div
          className={`absolute inset-y-0 left-0 w-1/2 overflow-hidden transition-transform duration-[1800ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
            opened ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <div
            className="absolute inset-y-0 left-0 w-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${GATE_SRC})` }}
          />
        </div>
        <div
          className={`absolute inset-y-0 right-0 w-1/2 overflow-hidden transition-transform duration-[1800ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
            opened ? "translate-x-full" : "translate-x-0"
          }`}
        >
          <div
            className="absolute inset-y-0 right-0 w-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${GATE_SRC})` }}
          />
        </div>

        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ${
            opened ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <span className="font-body text-xs tracking-[0.3em] text-black uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.65)]">
            Tap anywhere
          </span>
        </div>
      </div>
    </main>
  );
}
