import React, { Suspense } from "react";
import Loading from '@/components/UI/LazyLoading/Loading'
import ContentLayout from "./ContentLayout";
import ThankYou from "@/components/finalPage/ThankYou";

// Lazy loading heavier components

const WhatsNext = React.lazy(() => import("@/components//finalPage/WhatsNext"));
const Footer = React.lazy(()=>import("@/components/Footer/Footer"))

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
