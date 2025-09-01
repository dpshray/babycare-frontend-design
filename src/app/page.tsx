import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import FaqComponent from '@/components/FaqQuestion';
import { Card, cardData } from '@/components/Card';
import { CircleCheck, } from 'lucide-react';
import { AppleLogo, GooglePlayLogo, StoreButton } from '@/StoreButton';

export default function HomePage() {
    return (
        <section className="w-full" id="home">
            <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
                <video autoPlay muted loop playsInline className="object-cover w-full h-full">
                    <source src="https://res.cloudinary.com/dbvhtgbne/video/upload/v1750329414/baby_n5i8zt.mov" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/50 z-10" aria-hidden="true" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
                    <h1 className="text-white font-openSans font-bold text-3xl sm:text-5xl md:text-6xl max-w-2xl">
                        Welcome to <span className="text-[#F5888E]">BabyCare</span> – Your Smart Parenting Companion
                    </h1>
                    <p className="mt-4 text-white text-base sm:text-lg max-w-2xl font-mulish">
                        Raising a baby is a beautiful journey—and BabyCare is here to make it easier for you. Trusted by new parents
                        across Nepal, BabyCare helps track vaccinations, find healthcare, and answer your questions.
                    </p>
                    <Button
                        variant="default"
                        className={cn("mt-6 rounded-full bg-[#31ADEC] hover:bg-[#31ADEC]/90")}
                        aria-label="See all features"
                    >
                        See All
                    </Button>
                </div>
            </div>

            <div className="container mx-auto my-16 px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                    {cardData.map((card, index) => (
                        <Card
                            key={index}
                            title={card.title}
                            description={card.description}
                            icon={card.icon}
                        />
                    ))}
                </div>
            </div>

            <section className="w-full px-4 md:px-12" id="services">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <div className="relative w-full md:w-[30%] h-64 sm:h-80 md:h-[300px]">
                        <div
                            className="absolute -z-10 -top-4 -left-4 -right-4 bottom-4 bg-pink-50 rounded-md border border-dashed border-pink-200" />
                        <Image
                            src="/baby-mom.png"
                            alt="Smiling baby photo"
                            width={400}
                            height={300}
                            className="h-full w-full object-fill "
                        />
                    </div>
                    <div className="w-full md:w-[70%] space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black font-openSans">
                            Automated Vaccine Schedules as per Nepal Government Guidelines
                        </h2>
                        <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600 font-mulish">
                            Never miss an important vaccine again. BabyCare automatically generates your baby’s
                            vaccination
                            schedule based on the official Immunization Schedule of the Government of Nepal.
                        </p>
                        <ul className="mt-4 space-y-3 text-gray-700 font-mulish">
                            <li className="flex items-center gap-2 font-openSans font-semibold">
                                <CircleCheck size={20} fill="white" className="text-[#F5888E]" />
                                Auto Reminders & Notifications
                            </li>
                            <li className="flex items-center gap-2 font-openSans font-semibold">
                                <CircleCheck size={20} fill="white" className="text-[#F5888E]" />
                                Based on National Guidelines
                            </li>
                            <li className="flex items-center gap-2 font-openSans font-semibold">
                                <CircleCheck size={20} fill="white" className="text-[#F5888E]" />
                                Smart Rescheduling
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section aria-labelledby="nearby-hospitals-title" className="relative w-full mt-20 ">
                <div className="absolute top-8 right-8 w-28 h-28 md:w-36 md:h-36">
                    <Image
                        src="/baby.png"
                        alt="Decorative baby graphic"
                        width={160}
                        height={160}
                        className="object-cover"
                    />
                </div>
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <h2 id="nearby-hospitals-title"
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-muted-foreground font-openSans">
                        Find Nearby Hospitals & Health Centers
                    </h2>
                    <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600 font-mulish max-w-2xl mx-auto">
                        Quickly locate government-approved hospitals, clinics, and health posts near you for baby care
                        and
                        vaccinations.
                    </p>

                </div>
                <div
                    className="relative mt-12 w-full h-64 sm:h-80 md:h-[300px] overflow-hidden ">
                    <Image
                        src="/map.png"
                        alt="Doctors illustration for hospital map"
                        fill
                        className="object-cover "
                        priority
                    />
                </div>
            </section>

            <div className="w-full bg-[#F5888E] py-12 px-4 sm:px-6 lg:px-8 mt-20">
                <div
                    className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-openSans">
                            Download BabyCare App Today
                        </h2>
                        <p className="mt-2 text-sm sm:text-base md:text-lg text-white font-mulish max-w-md">
                            Join thousands of smart parents across Nepal who rely on BabyCare to track their child’s
                            health, growth, and care.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
                        {/* <StoreButton
                            href={`${process.env.NEXT_PUBLIC_APP_STORE_LINK}`}
                            logo={<AppleLogo />}
                            label="Download on the"
                            storeName="App Store"
                        /> */}
                        <StoreButton href={`${process.env.NEXT_PUBLIC_PLAY_STORE_LINK}`}
                            logo={<GooglePlayLogo />}
                            label={'Download on the'} storeName={'Google Play Store'} />
                    </div>
                </div>
            </div>

            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-20 text-center" id={'faq'}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-muted-foreground font-openSans">
                    Baby Health FAQs
                </h2>
                <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600 font-mulish max-w-2xl mx-auto">
                    Some of the most common questions answered for you. If you need more help, feel free to reach out.
                </p>
                <div className="max-w-3xl mx-auto mt-8">
                    <FaqComponent />
                </div>
            </section>
        </section>
    );
}
