import TopNav from '@/components/ui/TopNav';
import DataSync from '@/components/ui/DataSync';
import Hero from '@/components/sections/Hero';
import Introduction from '@/components/sections/Introduction';
import MasterPlan from '@/components/sections/MasterPlan';
import Highlights from '@/components/sections/Highlights';
import AmenitiesLifestyle from '@/components/sections/AmenitiesLifestyle';
import AvailablePlots from '@/components/sections/AvailablePlots';
import LocationConnectivity from '@/components/sections/LocationConnectivity';
import MasterPlanDetails from '@/components/sections/MasterPlanDetails';
import WhyOwn from '@/components/sections/WhyOwn';
import Gallery from '@/components/sections/Gallery';
import Faq from '@/components/sections/Faq';
import Contact from '@/components/sections/Contact';
import SiteFooter from '@/components/sections/Footer';

export default function Page() {
  return (
    <>
      <DataSync />
      <TopNav />
      <main id="top">
        <Hero />
        <Introduction />
        <Highlights />
        <MasterPlan />
        <AmenitiesLifestyle />
        <AvailablePlots />
        <LocationConnectivity />
        <MasterPlanDetails />
        <WhyOwn />
        <Gallery />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
