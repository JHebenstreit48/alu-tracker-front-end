import Header from "@/components/Shared/HeaderFooter/Header";
import PageTab from "@/components/Shared/Navigation/PageTab";
import AboutContent from "@/components/About/AboutContent";
import "@/scss/MiscellaneousStyle/About.scss";

export default function About() {
  return (
    <div>
      <PageTab title="About">
        <Header text="About" className="aboutHeader" />
        <main className="PageBody">
          <AboutContent />
        </main>
      </PageTab>
    </div>
  );
}