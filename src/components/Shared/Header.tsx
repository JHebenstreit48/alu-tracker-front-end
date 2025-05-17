import AuthButtons from "@/components/SignupLogin/UI/AuthButtons";

interface HeaderProps {
  text: string;
  className?: string;
}

export default function Header({ text, className }: HeaderProps) {
  return (
    <div className={`Header ${className || ""}`}>
      <div>
        <h1 className="PageHeader">{text}</h1>
      </div>
      <div>
        <AuthButtons />
      </div>
    </div>
  );
}
