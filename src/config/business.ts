export const business = {
  name: "Shaleen Makeup Studio",
  fullName: "Shaleen Makeup Studio and Beauty Salon",
  tagline: "Beauty • Care • Confidence",
  description:
    "A welcoming ladies' beauty parlour in the heart of Durga Colony, Rohtak — offering makeup, hair, skin care and grooming with personal attention for every occasion.",
  phoneDisplay: "092538 72499",
  phone: "+919253872499",
  whatsapp: "919253872499",
  address: {
    line1: "1073/20, Sonipat Stand Rd",
    line2: "Opposite Durga Girls Hostel, Durga Colony",
    city: "Rohtak",
    state: "Haryana",
    pincode: "124001",
  },
  hours: { days: "Monday – Sunday", time: "10:00 AM – 8:00 PM" },
  rating: { value: 4.7, count: 573 },
  mapsUrl: "https://maps.app.goo.gl/sdvsyhb7w4VaDtb17",
  mapsEmbed:
    "https://www.google.com/maps?q=Shaleen+Makeup+Studio+and+beauty+salon,+Sonipat+Stand+Rd,+Durga+Colony,+Rohtak,+Haryana+124001&output=embed",
  // Add the real profile URLs here when ready — icons appear automatically.
  instagram: "",
  facebook: "",
  seo: {
    title: "Shaleen Makeup Studio | Beauty Parlour in Durga Colony, Rohtak",
    description:
      "Shaleen Makeup Studio — a trusted ladies' beauty parlour on Sonipat Stand Road, Durga Colony, Rohtak. Makeup, hair, skin care, threading & more. Open daily 10 AM – 8 PM. Book your appointment today.",
  },
};

export const links = {
  call: `tel:${business.phone}`,
  whatsapp: (service?: string) =>
    `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
      service
        ? `Hi, I'd like to book an appointment at ${business.name}. I would like to enquire about ${service}.`
        : `Hi, I'd like to book an appointment at ${business.name}.`,
    )}`,
  whatsappBooking: (details: {
    service: string;
    date: string;
    time: string;
    name: string;
    phone: string;
    notes?: string;
  }) =>
    `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
      [
        `Hi, I'd like to book an appointment at ${business.name}.`,
        ``,
        `Service: ${details.service}`,
        `Preferred date: ${details.date}`,
        `Preferred time: ${details.time}`,
        `Name: ${details.name}`,
        `Phone: ${details.phone}`,
        details.notes ? `Notes: ${details.notes}` : ``,
        ``,
        `Please confirm my appointment. Thank you!`,
      ]
        .filter((l) => l !== undefined)
        .join("\n"),
    )}`,
  directions: business.mapsUrl,
};

export interface Service {
  name: string;
  category: string;
  blurb: string;
  image: string;
}

export const serviceCategories = [
  {
    category: "Threading & Grooming",
    items: ["Eyebrow Shaping", "Upper Lip", "Full Face Threading", "Forehead & Chin"],
  },
  {
    category: "Waxing",
    items: ["Facial Wax", "Arms & Legs", "Full Body Wax", "Underarms"],
  },
  {
    category: "Facials & Clean-ups",
    items: ["Express Clean-up", "Glow Facial", "De-tan Treatment", "Bleach"],
  },
  {
    category: "Hair Care & Styling",
    items: ["Haircut & Styling", "Blow-dry & Ironing", "Hair Spa", "Colour & Highlights"],
  },
  {
    category: "Makeup",
    items: ["Party Makeup", "Engagement Look", "HD Makeup", "Saree Draping"],
  },
  {
    category: "Bridal",
    items: ["Bridal Makeup", "Bridal Hairstyling", "Pre-Bridal Care", "Mehndi & Sangeet Looks"],
  },
];

export const packages: { name: string; includes: string[] }[] = [];
export const packagesEnabled = packages.length > 0;

// PLACEHOLDER testimonials — replace each quote/name with a real Google review
// before treating this section as live customer feedback.
export interface Testimonial {
  quote: string;
  name: string;
  service: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "A lovely experience from start to finish — gentle, patient and attentive. I left feeling completely refreshed.",
    name: "Priya S.",
    service: "Glow Facial",
  },
  {
    quote:
      "The styling was exactly what I had in mind. Everything was explained nicely and done with real care.",
    name: "Neha K.",
    service: "Haircut & Styling",
  },
  {
    quote:
      "Such a calm, comfortable place. The threading was neat and quick, and the staff were very kind.",
    name: "Simran R.",
    service: "Threading",
  },
  {
    quote:
      "I felt looked after the whole time. Soft, natural makeup that stayed beautiful all evening.",
    name: "Anjali M.",
    service: "Party Makeup",
  },
  {
    quote:
      "Warm, welcoming and professional. Booking was easy and the appointment ran right on time.",
    name: "Ritika D.",
    service: "Hair Spa",
  },
];
