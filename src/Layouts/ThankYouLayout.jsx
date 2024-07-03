import React, { Suspense } from "react";
import Loading from '@/components/UI/LazyLoading/Loading'
import ContentLayout from "./ContentLayout";
import ThankYou from "@/components/finalPage/ThankYou";
import Footer from "../components/Footer/Footer";
// Lazy loading heavier components
const PartnerWith =React.lazy(() => import("@/components//UI/Promotional/PartnerWith"));
const WhatsNext = React.lazy(() => import("@/components//finalPage/WhatsNext"));
const BrandsLayout = React.lazy(() =>
  import("@/components/finalPage/BrandsLayout")
);
const HearBack = React.lazy(() => import("@/components//finalPage/HearBack"));

const ThankYouLayout = () => {
  return (
    <>
      <ContentLayout bgColor={"rgba(0, 28, 65, 0.05)"}>
        <ThankYou />
      </ContentLayout>


      <ContentLayout bgColor={"#fff"}>
        <Suspense fallback={<Loading />}>
          <WhatsNext />
        </Suspense>
      </ContentLayout>

      <ContentLayout bgColor={"#F9F7FC"}>
        <Suspense fallback={<Loading />}>
          <Footer />
        </Suspense>
      </ContentLayout>
   
    </>
  );
};

export default ThankYouLayout;
