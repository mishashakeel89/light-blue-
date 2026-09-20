import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DiamondDust } from "@/components/DiamondDust";
import { Guestbook } from "@/components/Guestbook";

// To re-theme for a new event, replace these two files in the public/ folder:
const INVITATION_SRC = "/invitation.webp";
const GATE_SRC = "/gate.webp";

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
      { rel: "preload", as: "image", href: GATE_SRC, fetchPriority: "high" },
      { rel: "prefetch", as: "image", href: INVITATION_SRC },
    ],
  }),

  component: Index,
});

function Index() {
  const [opened, setOpened] = useState(false);
  const [guestbookOpen, setGuestbookOpen] = useState(false);
  const [gateLoaded, setGateLoaded] = useState(false);
  const [invitationLoaded, setInvitationLoaded] = useState(false);
  const assetsLoaded = gateLoaded && invitationLoaded;

  useEffect(() => {
    const gateImage = new Image();
    const invitationImage = new Image();

    gateImage.onload = () => setGateLoaded(true);
    gateImage.onerror = () => setGateLoaded(true);
    invitationImage.onload = () => setInvitationLoaded(true);
    invitationImage.onerror = () => setInvitationLoaded(true);
    gateImage.src = GATE_SRC;
    invitationImage.src = INVITATION_SRC;

    return () => {
      gateImage.onload = null;
      gateImage.onerror = null;
      invitationImage.onload = null;
      invitationImage.onerror = null;
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-primary">
      {/* Invitation background */}
        <div
  className={`fixed inset-0 z-0 bg-contain bg-center bg-no-repeat transition-opacity duration-500 ${
    opened && invitationLoaded ? "opacity-100" : "opacity-0"
  }`}
  style={{ 
    backgroundImage: `url(${INVITATION_SRC})`,
    backgroundColor: '#000000' 
  }}
/>

      {opened ? <DiamondDust /> : null}

      {/* Guestbook button */}
      <div
        className={`fixed inset-x-0 bottom-6 z-30 flex justify-center transition-opacity duration-500 ${
          opened ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          data-no-sparks
          onClick={() => setGuestbookOpen(true)}
          className="rounded-full border border-[#FFFFFF]/50 bg-black/30 px-7 py-2.5 font-body text-sm tracking-widest text-[#F4F4F4] uppercase backdrop-blur-md transition-all hover:shadow-[#FFFFFF] hover:bg-[#FFFFFF]/20 hover:shadow-[0_0_20px_rgba(184,134,11,0.5)]"
        >
          Guestbook
        </button>
      </div>

      {guestbookOpen ? <Guestbook onClose={() => setGuestbookOpen(false)} /> : null}

      {/* The Gate */}
      <div
        className={`fixed inset-0 z-40 cursor-pointer ${opened || !assetsLoaded ? "pointer-events-none" : ""}`}
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

      {/* Opaque cover prevents the invitation from flashing before both images are ready. */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed inset-0 z-50 flex items-center justify-center bg-primary transition-opacity duration-500 ${
          assetsLoaded ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <span className="font-body text-sm uppercase tracking-[0.3em] text-primary-foreground">
          Loading
        </span>
      </div>
    </main>
  );
}
