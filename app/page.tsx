import AboutSection from "@/components/AboutSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import GymFooter from "@/components/GymFooter";
import GymGallery from "@/components/GymGallery";
import GymNavbar from "@/components/GymNavbar";
import HeroSection from "@/components/HeroSection";
import IntroAnimation from "@/components/IntroAnimation";
import JoinForm from "@/components/JoinForm";
import MembershipPlans from "@/components/MembershipPlans";
import MembershipCTA from "@/components/MembershipCTA";
import SmoothScroll from "@/components/SmoothScroll";
import ThreeFloorExperience from "@/components/ThreeFloorExperience";
import TrainersSection from "@/components/TrainersSection";
import VideoExperience from "@/components/VideoExperience";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <IntroAnimation />
      <GymNavbar />
      <main>
        <HeroSection />
        <AboutSection />
        <FacilitiesSection />
        <ThreeFloorExperience />
        <VideoExperience />
        <GymGallery />
        <TrainersSection />
        <MembershipPlans />
        <MembershipCTA />
      </main>
      <GymFooter />
      <WhatsAppButton />
      <JoinForm />
    </>
  );
}
