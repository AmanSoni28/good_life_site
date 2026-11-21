import ConceptSwitcher from "@/components/ConceptSwitcher";
import { SlotsProvider } from "@/components/Slot";
import SmoothScroll from "@/components/SmoothScroll";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Cursor, Preloader, ScrollBar } from "@/components/fx";
import { readySlots } from "@/lib/slots.server";
import { VoltCoaches, VoltFooter, VoltGallery, VoltJoin, VoltPlans, VoltTraining } from "@/components/voltage/VoltRest";
import { VoltFloors, VoltHero, VoltManifesto, VoltNav } from "@/components/voltage/VoltTop";

export default function ConceptVoltage() {
  return (
    <SlotsProvider ready={readySlots()}>
      <SmoothScroll lerp={0.13} />
      <Preloader className="bg-volt text-night" barClassName="bg-night">
        Good Life Fitness Club
      </Preloader>
      <ScrollBar className="bg-volt" />
      <Cursor className="bg-volt text-night" />
      <VoltNav />
      <main>
        <VoltHero />
        <VoltManifesto />
        <VoltFloors />
        <VoltTraining />
        <VoltGallery />
        <VoltCoaches />
        <VoltPlans />
        <VoltJoin />
      </main>
      <VoltFooter />
      <WhatsAppButton />
      <ConceptSwitcher current="concept-3" />
    </SlotsProvider>
  );
}
