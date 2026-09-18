import { sharkinApi } from "@/api/api";
import type { JwtPayload } from "@/types/uiTypes";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

type DutyToggleProps = {
  onToggleSuccess: () => void;
  hasOpenDuty: boolean;
};

export function DutyToggleButton({
  onToggleSuccess,
  hasOpenDuty,
}: DutyToggleProps) {
  const [isSharkOut, setIsSharkOut] = useState(hasOpenDuty);
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
      onToggleSuccess();
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log("Erro ao fazer sharkin ou sharkout");
        console.log(err.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsSharkOut(hasOpenDuty);
  }, [hasOpenDuty]);

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
