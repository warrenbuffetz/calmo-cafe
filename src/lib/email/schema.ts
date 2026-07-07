import "server-only";

import type { Reservation } from "@/lib/reservations/types";
import { venue } from "@/lib/venue";
import { getReservationStartIso } from "@/lib/email/datetime";
import { getAppBaseUrl } from "@/lib/email/resend";
import { getCancelUrl, getManageUrl, getModifyUrl } from "@/lib/email/urls";

/**
 * Gmail rich reservation cards require Google Email Markup registration
 * and sender domain whitelisting. JSON-LD is included now so cards can
 * appear once Google approves the sending domain.
 */
export function buildReservationJsonLd(reservation: Reservation): string {
  const payload = {
    "@context": "http://schema.org",
    "@type": "FoodEstablishmentReservation",
    reservationNumber: reservation.id,
    reservationStatus: "http://schema.org/Confirmed",
    underName: {
      "@type": "Person",
      name: reservation.customer_name,
      email: reservation.customer_email,
    },
    reservationFor: {
      "@type": "FoodEstablishment",
      name: "Calmo",
      telephone: "+14165550127",
      url: getAppBaseUrl(),
      address: {
        "@type": "PostalAddress",
        streetAddress: venue.address.line1,
        addressLocality: "Toronto",
        addressRegion: "ON",
        postalCode: "M6J 1X6",
        addressCountry: "CA",
      },
    },
    startTime: getReservationStartIso(reservation),
    partySize: reservation.party_size,
    url: getManageUrl(reservation),
    modifyReservationUrl: getModifyUrl(reservation),
    cancelReservationUrl: getCancelUrl(reservation),
    modifiedTime: reservation.updated_at,
    bookingTime: reservation.confirmed_at ?? reservation.created_at,
  };

  return JSON.stringify(payload);
}
