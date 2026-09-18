import userSeal from "@/assets/focus/blue_seal.png";

type userHeaderProps = {
  name: string;
};

export function UserHeader({ name }: userHeaderProps) {
  return (
    <header className="user-header">
      <div className="user-brand">
        <h1>Sharkins de {name}</h1>
      </div>

      <button type="button" className="logout-button">
        Logout
      </button>

      <img className="user-seal" src={userSeal} alt="" />
    </header>
  );
}
