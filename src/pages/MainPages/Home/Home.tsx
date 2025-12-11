import Header from "@/components/Shared/HeaderFooter/Header";
import PageTab from "@/components/Shared/Navigation/PageTab";
import ImageCarousel from "@/components/HomePage/ImageCarousel";
import Carousel from "@/data/ImagesForCarousel";
import GameInfo from "@components/HomePage/GameInfo";
import "@/scss/PageAndHome/Home.scss";

export default function Home() {
  return (
    <div>
      <PageTab title="Home">
        <Header text="Home" className="homeHeader" />
        <main className="PageBody">
          <GameInfo />
          <ImageCarousel project={Carousel} />
        </main>
      </PageTab>
    </div>
  );
}