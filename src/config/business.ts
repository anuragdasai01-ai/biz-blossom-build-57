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
    notes?: string | undefined;
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

// Real customer reviews — quoted from publicly posted Google reviews of
// Shaleen Makeup Studio (aggregated on public listing pages). Names are the
// reviewers' own public names; quotes are kept as close to the original as
// possible. Add `rating` only when the review's star rating is known.
export interface Testimonial {
  quote: string;
  name: string;
  service: string;
  rating?: number;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Makeup and hairdo was perfectly done on my wedding day.. very happy with their service",
    name: "Maitri Dey",
    service: "Bridal makeup & hairdo",
  },
  {
    quote:
      "I am fully satisfied with my makeup.. supportive staff .. all are good .... Adorable",
    name: "Naina Chandel",
    service: "Makeup",
  },
  {
    quote:
      "They amazed me by their work. Their efforts are seriously appreciable! Thanks for making my big day more special with your creative makeover.",
    name: "Mahima Sharma",
    service: "Bridal makeover",
  },
  {
    quote:
      "All services are excellent, very comfortable environment, friendly nature of all staff. Very much better and lovely experience with parlour",
    name: "Soni Gautam",
    service: "All services",
  },
  {
    quote:
      "I had my bridal makeup in this March, really like the makeup it does wonder and they advise me very good home care products which actually improved my skin. Thanku so much",
    name: "Sunny Layher",
    service: "Bridal makeup & skin care",
  },
];
