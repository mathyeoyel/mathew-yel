"use client";

import { useCallback, useEffect, useState } from "react";

type ShareButtonsProps = {
  title: string;
  url: string;
  description?: string;
  variant?: "light" | "dark";
  className?: string;
};

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true as const
};

function ShareIcon() {
  return (
    <svg {...iconProps}>
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a3.27 3.27 0 0 0 0-1.39l7.05-4.11A2.99 2.99 0 1 0 15 5.5l-7.05 4.11a3 3 0 1 0 0 4.78l7.05 4.11a3 3 0 1 0 .95 1.59 3 3 0 0 0-.95-2.01Z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg {...iconProps}>
      <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v16h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 18H8V7h11v16Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg {...iconProps}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg {...iconProps}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.018 4.388 11.01 10.125 11.91v-8.42H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796v8.42C19.612 23.083 24 18.091 24 12.073Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg {...iconProps}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export function ShareButtons({
  title,
  url,
  description,
  variant = "light",
  className = ""
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const whatsAppText = encodeURIComponent(description ? `${title} — ${description}\n${url}` : `${title}\n${url}`);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [url]);

  const handleNativeShare = useCallback(async () => {
    if (!canNativeShare) {
      await handleCopy();
      return;
    }

    try {
      await navigator.share({
        title,
        text: description,
        url
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
  }, [canNativeShare, description, handleCopy, title, url]);

  const variantClass = variant === "dark" ? "share-buttons--dark" : "share-buttons--light";

  return (
    <div className={`share-buttons ${variantClass} ${className}`.trim()} aria-label="Share this page">
      <p className="share-buttons-label">Share</p>
      <div className="share-buttons-row">
        <button
          type="button"
          className="share-buttons-action"
          onClick={handleNativeShare}
          aria-label={canNativeShare ? "Share this page" : "Copy link to share"}
        >
          <ShareIcon />
          <span>{canNativeShare ? "Share" : "Copy"}</span>
        </button>

        <button
          type="button"
          className="share-buttons-action"
          onClick={handleCopy}
          aria-label="Copy link"
        >
          <CopyIcon />
          <span>{copied ? "Copied" : "Copy link"}</span>
        </button>

        <a
          href={`https://wa.me/?text=${whatsAppText}`}
          className="share-buttons-action"
          target="_blank"
          rel="noreferrer"
          aria-label="Share on WhatsApp"
        >
          <WhatsAppIcon />
          <span className="sr-only">WhatsApp</span>
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          className="share-buttons-action"
          target="_blank"
          rel="noreferrer"
          aria-label="Share on Facebook"
        >
          <FacebookIcon />
          <span className="sr-only">Facebook</span>
        </a>

        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          className="share-buttons-action"
          target="_blank"
          rel="noreferrer"
          aria-label="Share on LinkedIn"
        >
          <LinkedInIcon />
          <span className="sr-only">LinkedIn</span>
        </a>

        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          className="share-buttons-action"
          target="_blank"
          rel="noreferrer"
          aria-label="Share on X"
        >
          <XIcon />
          <span className="sr-only">X</span>
        </a>
      </div>
    </div>
  );
}
