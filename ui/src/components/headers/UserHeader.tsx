import userSeal from "@/assets/focus/blue_seal.png";
import { useState } from "react";
import { useNavigate } from "react-router";

type userHeaderProps = {
  name: string;
};

export function UserHeader({ name }: userHeaderProps) {
  const [logout, setLogout] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="user-header">
      <div className="user-brand">
        <h1>Sharkins de {name}</h1>
      </div>

      <button
        type="button"
        className="logout-button"
        onClick={() => handleLogout()}
      >
        Logout
      </button>

      <img className="user-seal" src={userSeal} alt="" />
    </header>
  );
}
