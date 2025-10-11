import { useContext } from "react";
import { AuthContext } from "@/components/SignupLogin/context/AuthContext";
import ProfileCard from "@/components/Account/ProfileCard";
import TwoFASetupCard from "@/components/Account/TwoFASetupCard";
import SecurityActions from "@/components/Account/SecurityActions";

export default function Account(): JSX.Element {
  const { token, username } = useContext(AuthContext);

  if (!token) {
    return (
      <div style={{ padding: "2rem" }}>
        Please log in to view your account settings.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Account</h1>
      <p style={{ marginTop: "-0.5rem", color: "#bbb" }}>
        Welcome{username ? `, ${username}` : ""} 👋
      </p>
      <ProfileCard />
      <TwoFASetupCard />
      <SecurityActions />
    </div>
  );
}