import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"

const babyHealthFaqs = [
    {
        id: "1",
        title: "When should I start vaccinations for my baby?",
        content:
            "Vaccinations typically start at birth with the BCG vaccine and continue according to your country's immunization schedule. Consult your pediatrician for a tailored plan.",
    },
    {
        id: "2",
        title: "Is it normal for babies to have mild fever after vaccinations?",
        content:
            "Yes, mild fever, soreness, or fussiness after vaccinations is common and usually goes away within a day or two. Always monitor your baby and consult a doctor if symptoms persist.",
    },
    {
        id: "3",
        title: "How can I soothe my baby after a vaccination?",
        content:
            "You can soothe your baby with gentle cuddling, breastfeeding, and distraction. A cool compress at the injection site can also help with swelling or discomfort.",
    },
    {
        id: "4",
        title: "What should I do if my baby misses a vaccine dose?",
        content:
            "If a vaccine dose is missed, contact your healthcare provider. They can help reschedule and adjust the vaccination timeline without restarting the series.",
    },
];
export default function FaqComponent() {
    return (
        <div className="space-y-4 w-full">
            <Accordion type="single" collapsible className="w-full" defaultValue="3">
                {babyHealthFaqs.map((item) => (
                    <AccordionItem value={item.id} key={item.id} className="py-2">
                        <AccordionTrigger className="py-2  text-base leading-6 hover:no-underline">
                            {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-2 text-sm !px-0">
                            {item.content}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
