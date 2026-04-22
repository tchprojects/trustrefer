"use client";

import { Share2, X, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";

const APP_URL = "https://trustrefer.co.uk";
const APP_NAME = "TrustRefer";
const SHARE_TEXT = "Discover trusted referral links on TrustRefer — earn rewards, share referrals, save money.";

interface ShareOption {
  label: string;
  icon: React.ReactNode;
  action: (url: string) => void;
}

function buildOptions(url: string): ShareOption[] {
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(SHARE_TEXT);

  return [
    {
      label: "X (Twitter)",
      icon: <XIcon />,
      action: () => open(`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`),
    },
    {
      label: "Facebook",
      icon: <FacebookIcon />,
      action: () => open(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`),
    },
    {
      label: "WhatsApp",
      icon: <WhatsAppIcon />,
      action: () => open(`https://wa.me/?text=${text}%20${encoded}`),
    },
    {
      label: "LinkedIn",
      icon: <LinkedInIcon />,
      action: () => open(`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`),
    },
    {
      label: "Messenger",
      icon: <MessengerIcon />,
      action: () => open(`https://www.facebook.com/dialog/send?link=${encoded}&redirect_uri=${encoded}`),
    },
    {
      label: "Email",
      icon: <EmailIcon />,
      action: () => open(`mailto:?subject=${encodeURIComponent("Check out " + APP_NAME)}&body=${text}%20${encoded}`),
    },
  ];
}

function open(url: string) {
  window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
}

export function ShareButton() {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = APP_URL;


  // Close on Escape
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === "Escape") setShowModal(false);
    }
    if (showModal) document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [showModal]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  }

  const options = buildOptions(shareUrl);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-[#666] transition-colors hover:bg-white/5 hover:text-white"
        aria-label="Share TrustRefer"
      >
        <Share2 size={15} />
      </button>

      {showModal && (
        <div
          onMouseDown={() => setShowModal(false)}
          className="fixed inset-x-0 bottom-0 top-14 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-start sm:pt-4"
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-y-auto rounded-t-2xl border border-white/10 bg-[#0f0f0f] pb-6 pt-5 sm:rounded-2xl sm:rounded-t-2xl"
            style={{ maxHeight: "calc(100dvh - 3rem)" }}
          >
            {/* Floating close button */}
            <button
              onClick={() => setShowModal(false)}
              aria-label="Close"
              className="absolute right-1 top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X size={12} />
            </button>

            {/* Share icons */}
            <div className="px-5">
              <div className="grid grid-cols-6 gap-2">
                {options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => { opt.action(shareUrl); setShowModal(false); }}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-110">
                      {opt.icon}
                    </div>
                    <span className="text-[10px] text-[#666] group-hover:text-white leading-tight text-center">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Copy link */}
            <div className="mx-5 mt-5">
              <button
                onClick={copyLink}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#141414] px-4 py-3 transition-colors hover:border-white/20"
              >
                <span className="truncate text-sm text-[#888]">{shareUrl}</span>
                <span className="ml-3 flex shrink-0 items-center gap-1.5 text-xs font-medium text-white">
                  {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Brand SVG icons ──────────────────────────────────────────────────────────

function XIcon() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </div>
  );
}

function FacebookIcon() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2]">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </div>
  );
}

function LinkedInIcon() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0A66C2]">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    </div>
  );
}

function MessengerIcon() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0084FF]">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.1l3.131 3.259L19.752 8.1l-6.561 6.863z" />
      </svg>
    </div>
  );
}

function EmailIcon() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f1f1f] border border-white/10">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 7 10 7 10-7" />
      </svg>
    </div>
  );
}
