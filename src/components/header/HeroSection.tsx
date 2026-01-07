import Image from "next/image";

export function HeroSection() {
    return (
        <section className="relative bg-white overflow-hidden">
            <div className={'w-full h-100'}>
                <Image
                    src="/banner.jpg"
                    alt="Mother holding baby"
                    width={400}
                    height={400}
                    className="  border-white shadow-xl w-full h-100"
                    priority
                />
            </div>
        </section>
    );
}
