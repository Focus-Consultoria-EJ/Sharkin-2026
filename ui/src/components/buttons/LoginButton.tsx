import { useState } from "react";

export function LoginButton() {
  return (
    <button
      className="login_button rounded-[56px] w-[196px] h-[62px] cursor-pointer "
      type="submit"
    >
      <p className="text-[2rem] text-montserrat font-[900]">Entrar</p>
    </button>
  );
}
