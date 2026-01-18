import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full h-[170px] sm:h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px]">
        <Image
          src="/banner.jpg"
          alt="Mother holding baby"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/10" />
      </div>
    </section>
  );
}
