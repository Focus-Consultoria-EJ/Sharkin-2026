import userSeal from "@/assets/focus/blue_seal.png";

export function UserHeader() {
  return (
    <header className="user-header">
      <div className="user-brand">
        <h1>Sharkins de Jonathan</h1>
      </div>

      <button
        type="button"
        className="logout-button"
      >
        Logout
      </button>

      <img
        className="user-seal"
        src={userSeal}
        alt=""
      />
    </header>
  );
}