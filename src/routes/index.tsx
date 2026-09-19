import { createFileRoute } from "@tanstack/react-router";
import { business } from "@/config/business";
import { BookingProvider } from "@/lib/booking";
import { useRevealRoot } from "@/lib/reveal";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/Gallery";
import { InstagramSection } from "@/components/InstagramSection";
import { Reviews } from "@/components/Reviews";
import { VisitUs } from "@/components/VisitUs";
import { ContactStrip } from "@/components/ContactStrip";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { BookingDialog } from "@/components/BookingDialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: business.seo.title },
      { name: "description", content: business.seo.description },
      { property: "og:title", content: business.seo.title },
      { property: "og:description", content: business.seo.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BeautySalon",
          name: business.fullName,
          telephone: business.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: `${business.address.line1}, ${business.address.line2}`,
            addressLocality: business.address.city,
            addressRegion: business.address.state,
            postalCode: business.address.pincode,
            addressCountry: "IN",
          },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "10:00",
            closes: "20:00",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: business.rating.value,
            reviewCount: business.rating.count,
          },
          hasMap: business.mapsUrl,
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const ref = useRevealRoot<HTMLDivElement>();

  return (
    <BookingProvider>
      <div ref={ref} className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main>
          <Hero />
          <TrustStrip />
          <About />
          <Services />
          <Gallery />
          <InstagramSection />
          <Reviews />
          <VisitUs />
          <ContactStrip />
        </main>
        <Footer />
        <MobileActionBar />
        <BookingDialog />
      </div>
    </BookingProvider>
  );
}
