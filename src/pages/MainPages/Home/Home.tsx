import Header from "@/components/Shared/HeaderFooter/Header";
import PageTab from "@/components/Shared/Navigation/PageTab";
import ImageCarousel from "@/components/HomePage/ImageCarousel";
import Carousel from "@components/HomePage/ImagesForCarousel";
import GameInfo from "@components/HomePage/GameInfo";
import '@/scss/PageAndHome/Home.scss';

export default function Home() {
  return (
    <div>
      <PageTab title="Home">
        <Header text="Asphalt Legends Unite Tracker" className="homeHeader"/>
        <GameInfo />
        <ImageCarousel project={Carousel} />
      </PageTab>
    </div>
  );
}