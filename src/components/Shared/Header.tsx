import Navigation from "@/components/Shared/Navigation";
import AuthButtons from "@/components/SignupLogin/UI/AuthButtons";

interface HeaderProps {
  text: string;
  className?: string;
}

export default function Header({ text, className }: HeaderProps) {
  return (
    <header className={`Header ${className || ""}`} role="banner">
      <div className="Header__inner">
        {/* center column */}
        <h1 className="PageHeader" title={text}>
          {text}
        </h1>

        {/* right column */}
        <div className="Header__auth">
          <AuthButtons />
        </div>
      </div>

      <div className="Header__navRow" role="presentation">
        <Navigation />
      </div>
    </header>
  );
}