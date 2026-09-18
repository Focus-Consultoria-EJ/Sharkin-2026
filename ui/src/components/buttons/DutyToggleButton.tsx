import { sharkinApi } from "@/api/api";
import type { JwtPayload } from "@/types/uiTypes";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

export function DutyToggleButton() {
  const [isSharkOut, setIsSharkOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);

    const token = localStorage.getItem("token");
    const { sub } = jwtDecode<JwtPayload>(token!);
    console.log(sub);
    try {
      isSharkOut
        ? await sharkinApi.patch(`/duty/${sub}`, {})
        : await sharkinApi.post(`/duty/${sub}`, {});
      setIsSharkOut((currentState) => !currentState);
      setIsLoading(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log("Erro ao fazer sharkin ou sharkout");
        console.log(err.response?.data);
      }
    }
  }

  return (
    <button
      type="button"
      className={`duty-toggle ${
        isSharkOut ? "duty-toggle--out" : "duty-toggle--in"
      }`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isSharkOut ? "Shark-out" : "Shark-in"}
    </button>
  );
}
