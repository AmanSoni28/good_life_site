import ConceptSwitcher from "@/components/ConceptSwitcher";
import { SlotsProvider } from "@/components/Slot";
import SmoothScroll from "@/components/SmoothScroll";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Cursor, Preloader, ScrollBar } from "@/components/fx";
import { readySlots } from "@/lib/slots.server";
import { DayCoaches, DayFooter, DayGallery, DayJoin, DayPlans, DayTraining } from "@/components/daylight/DayRest";
import { DayFloors, DayHero, DayNav, DayStatement } from "@/components/daylight/DayTop";

export default function ConceptDaylight() {
  return (
    <SlotsProvider ready={readySlots()}>
      <SmoothScroll lerp={0.13} />
      <Preloader className="bg-ink text-white" barClassName="bg-brand">
        Good Life Fitness Club
      </Preloader>
      <ScrollBar className="bg-brand" />
      <Cursor className="bg-brand text-white" />
      <DayNav />
      <main>
        <DayHero />
        <DayStatement />
        <DayFloors />
        <DayTraining />
        <DayGallery />
        <DayCoaches />
        <DayPlans />
        <DayJoin />
      </main>
      <DayFooter />
      <WhatsAppButton />
      <ConceptSwitcher current="concept-2" />
    </SlotsProvider>
  );
}
