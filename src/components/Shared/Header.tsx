import Navigation from "@/components/Shared/Navigation";
import AuthButtons from "@/components/SignupLogin/UI/AuthButtons";

interface Header {
  text: string;
}

export default function Header({ text }: Header) {
  return (
    <div className="Header">
      <div>
        <h1 className="PageHeader">{text}</h1>
      </div>
      <div>
        <Navigation />
      </div>
      <div>
        <AuthButtons />
      </div>
    </div>
  );
}
