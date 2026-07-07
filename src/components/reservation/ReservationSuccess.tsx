export function ReservationSuccess() {
  return (
    <div className="rounded-2xl border border-calmo-burnt-brown/10 bg-calmo-beige/60 p-8 text-center sm:p-10">
      <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
        Request received
      </p>
      <h2 className="mt-4 font-title text-3xl font-bold text-calmo-burnt-brown">
        We&apos;ll confirm your booking shortly
      </h2>
      <p className="mt-4 font-body text-sm leading-relaxed text-calmo-burnt-brown/70">
        Thanks for requesting a table at Calmo. We&apos;ve got your details and will email you once
        your reservation is confirmed.
      </p>
      <p className="mt-6 font-accent text-sm italic text-calmo-burnt-brown/50">
        Need to cancel later? Use the link in your confirmation email.
      </p>
    </div>
  );
}
