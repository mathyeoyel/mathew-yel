import Link from "next/link";
import type { Profile, SiteSettings } from "@/types/content";
import { fallbackSettings } from "@/lib/fallbacks";
import { getFooterSocialLinks } from "@/lib/footerLinks";
import { filterPublicNavLinks } from "@/lib/navigation";
import { SocialIcon } from "@/components/SocialIcon";

type Props = {
  settings?: SiteSettings | null;
  profile?: Pick<Profile, "name" | "socialLinks"> | null;
};

export function Footer({ settings, profile }: Props) {
  const navLinks = filterPublicNavLinks(
    settings?.navigationLinks?.length ? settings.navigationLinks : fallbackSettings.navigationLinks
  );
  const socialLinks = getFooterSocialLinks(settings, profile);

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <span className="site-footer-accent" aria-hidden="true" />
          <p className="site-footer-eyebrow">Creative technology from South Sudan</p>
          <h2 className="site-footer-title">
            Mathew<span className="text-brand-accent"> Yel</span>
          </h2>
          <p className="site-footer-description">
            {settings?.siteDescription ||
              "Creative technologist, UI/UX designer, and founder of VikraHub."}
          </p>
        </div>

        <div className="site-footer-column">
          <p className="site-footer-label">Explore</p>
          <nav className="site-footer-nav" aria-label="Footer navigation">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} className="site-footer-link">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {socialLinks.length ? (
          <div className="site-footer-column">
            <p className="site-footer-label">Connect</p>
            <div className="site-footer-social" aria-label="Social links">
              {socialLinks.map((link) => (
                <a
                  key={`${link.platform}-${link.href}`}
                  href={link.href}
                  className="site-footer-social-link"
                  aria-label={link.ariaLabel}
                  {...(link.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  <SocialIcon platform={link.platform} />
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="site-footer-bottom">
        <p>© {new Date().getFullYear()} Mathew Yel. Built with Next.js + Sanity.</p>
      </div>
    </footer>
  );
}
