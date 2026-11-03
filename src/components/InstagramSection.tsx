import { Heart, Instagram, MessageCircle } from "lucide-react";
import { business } from "@/config/business";
import bridalImg from "@/assets/insta-bridal.webp";
import flatlayImg from "@/assets/insta-flatlay.webp";
import studioImg from "@/assets/insta-studio.webp";
import hairImg from "@/assets/insta-hair.webp";
import facialImg from "@/assets/insta-facial.webp";
import nailsImg from "@/assets/insta-nails.webp";

const handle = business.name.replace(/\s+/g, "").toLowerCase();

const posts = [
  { src: bridalImg, alt: "Bridal makeup look", caption: "Bridal glow, done right", tag: "Bridal", featured: true },
  { src: flatlayImg, alt: "Makeup brushes and products flatlay", caption: "Studio favourites", tag: "Products" },
  { src: hairImg, alt: "Glossy curled hair styling", caption: "Curls & colour", tag: "Hair" },
  { src: studioImg, alt: "Inside the studio vanity", caption: "Inside the studio", tag: "Studio" },
  { src: facialImg, alt: "Relaxing facial treatment", caption: "Self-care ritual", tag: "Skin" },
  { src: nailsImg, alt: "Nude rose nail art with roses", caption: "Nail diaries", tag: "Nails" },
];

function PostTile({ post }: { post: (typeof posts)[number] }) {
  const inner = (
    <>
      <img
        src={post.src}
        alt={post.alt}
        width={1024}
        height={1024}
        loading="lazy"
        className="aspect-square h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <span className="block font-display text-lg font-semibold text-background sm:text-xl">
          {post.caption}
        </span>
        <span className="mt-1 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-background/80">
          {post.tag}
          <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /></span>
          <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /></span>
        </span>
      </span>
      <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/85 opacity-0 shadow-sm backdrop-blur transition-all duration-500 group-hover:opacity-100">
        <Instagram className="h-4 w-4 text-foreground" />
      </span>
    </>
  );
  const cls =
    "group relative overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:shadow-lg" +
    (post.featured ? " col-span-2 row-span-2" : "");
  return business.instagram ? (
    <a
      key={post.alt}
      href={business.instagram}
      target="_blank"
      rel="noreferrer"
      aria-label={`View on Instagram: ${post.alt}`}
      data-reveal="clip"
      className={cls}
    >
      {inner}
    </a>
  ) : (
    <div key={post.alt} data-reveal="clip" className={cls}>
      {inner}
    </div>
  );
}

export function InstagramSection() {
  const hasProfile = Boolean(business.instagram);

  return (
    <section className="bg-secondary/50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-md">
            <Instagram className="h-6 w-6 text-primary-foreground" />
          </span>
          <p className="eyebrow eyebrow-center mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Stay Connected
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
            Latest on Instagram
          </h2>
          <p className="mt-4 text-muted-foreground">
            {hasProfile
              ? "Fresh looks, offers and behind-the-scenes from the studio — straight from our feed."
              : "A peek at the looks, care and studio moments we share on Instagram. Follow us when we launch to see it all first."}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {posts.map((post) => (
            <PostTile key={post.alt} post={post} />
          ))}
        </div>

        <div className="mt-10 text-center" data-reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary">
            <Instagram className="h-4 w-4" /> Follow @{handle}
          </span>
          <p className="mt-3 text-xs text-muted-foreground">
            {hasProfile
              ? "Tag us in your look — we love reposting."
              : "Our handle is launching soon — stay tuned."}
          </p>
        </div>
      </div>
    </section>
  );
}
