import { useState } from "react";

export function DutyToggleButton() {
  const [isSharkOut, setIsSharkOut] = useState(false);

  function handleClick() {
    setIsSharkOut((currentState) => !currentState);
  }

  return (
    <button
      type="button"
      className={`duty-toggle ${
        isSharkOut
          ? "duty-toggle--out"
          : "duty-toggle--in"
      }`}
      onClick={handleClick}
    >
      {isSharkOut ? "Shark-out" : "Shark-in"}
    </button>
  );
}