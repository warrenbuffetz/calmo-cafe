import "server-only";

import { emailBrand, emailFontImport, emailFonts } from "@/lib/email/brand";
import { getAppBaseUrl } from "@/lib/email/resend";
import { getFooterMapUrl, getLogoUrl } from "@/lib/email/urls";
import { venue } from "@/lib/venue";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type EmailLayoutOptions = {
  preheader?: string;
  jsonLd?: string;
  content: string;
};

export function emailButton(href: string, label: string, variant: "primary" | "secondary" = "primary"): string {
  const isPrimary = variant === "primary";
  return `
    <a href="${href}" style="display:inline-block; margin:4px 6px 4px 0; padding:12px 18px; border-radius:999px; font-family:${emailFonts.body}; font-size:12px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; text-decoration:none; ${
      isPrimary
        ? `background:${emailBrand.brown}; color:${emailBrand.beige};`
        : `background:transparent; color:${emailBrand.brown}; border:1px solid ${emailBrand.border};`
    }">${escapeHtml(label)}</a>
  `;
}

export function emailDetailCard(rows: Array<{ label: string; value: string }>): string {
  const rowHtml = rows
    .map(
      (row) => `
      <tr>
        <td style="padding:8px 0; font-family:${emailFonts.body}; font-size:12px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:${emailBrand.redBrown}; width:110px; vertical-align:top;">${escapeHtml(row.label)}</td>
        <td style="padding:8px 0; font-family:${emailFonts.body}; font-size:15px; color:${emailBrand.brown}; vertical-align:top;">${escapeHtml(row.value)}</td>
      </tr>
    `,
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0; background:${emailBrand.beige}; border-radius:16px; border:1px solid ${emailBrand.border};">
      <tr>
        <td style="padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowHtml}</table>
        </td>
      </tr>
    </table>
  `;
}

export function emailLayout({ preheader, jsonLd, content }: EmailLayoutOptions): string {
  const logoUrl = getLogoUrl();
  const mapUrl = getFooterMapUrl();
  const jsonLdScript = jsonLd
    ? `<script type="application/ld+json">${jsonLd}</script>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Calmo</title>
  <style>${emailFontImport}</style>
  ${jsonLdScript}
</head>
<body style="margin:0; padding:0; background:${emailBrand.beige}; color:${emailBrand.brown};">
  ${preheader ? `<div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(preheader)}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${emailBrand.beige}; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:${emailBrand.white}; border-radius:20px; border:1px solid ${emailBrand.border}; overflow:hidden;">
          <tr>
            <td style="padding:28px 32px 20px; text-align:center; border-bottom:1px solid ${emailBrand.border};">
              <a href="${getAppBaseUrl()}" style="text-decoration:none;">
                <img src="${logoUrl}" alt="Calmo" width="140" style="display:block; margin:0 auto; height:auto; max-width:140px;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${emailBrand.border}; padding-top:24px;">
                <tr>
                  <td style="vertical-align:top; width:45%; padding-right:16px;">
                    <a href="${venue.address.mapsUrl}" style="text-decoration:none;">
                      <img src="${mapUrl}" alt="Map to Calmo" width="200" style="display:block; width:100%; max-width:200px; height:auto; border-radius:12px;" />
                    </a>
                  </td>
                  <td style="vertical-align:top; font-family:${emailFonts.body}; font-size:13px; line-height:1.6; color:${emailBrand.muted};">
                    <p style="margin:0 0 8px; font-family:${emailFonts.title}; font-size:14px; font-weight:700; color:${emailBrand.brown};">Calmo</p>
                    <p style="margin:0 0 4px;">${escapeHtml(venue.address.line1)}</p>
                    <p style="margin:0 0 12px;">${escapeHtml(venue.address.line2)}</p>
                    <p style="margin:0; font-family:${emailFonts.accent}; font-style:italic; font-size:12px; color:rgba(50,27,15,0.45);">${escapeHtml(venue.tagline)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
