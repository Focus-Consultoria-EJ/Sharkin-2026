import "@/styles/login_styles.css";

import { sharkinApi } from "@/api/api";
import semi_circle from "@/assets/focus/90_degrees_circle.png";
import blue_shark from "@/assets/focus/blue_shark.png";
import { ActiveDutyCard } from "@/components/cards/ActiveDutyCard";
import { LoginCard } from "@/components/cards/LoginCard";
import { WelcomeHeader } from "@/components/headers/WelcomeHeader";
import { formatActiveDutyDate } from "@/functions/formatActiveDutyDate";
import type { ActiveDutyCardData, OpenDutyResponseType } from "@/types/uiTypes";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

export function LoginPage() {
  const [openDuties, setOpenDuties] = useState<ActiveDutyCardData[] | null>(
    null,
  );

  const getOpenDuties = async () => {
    try {
      const { data } = await sharkinApi.get("/duty/open");

      const formated: ActiveDutyCardData[] = data.map(
        (duty: OpenDutyResponseType) => {
          return {
            name: duty.user.name,
            timeIn: formatActiveDutyDate(duty.dateTime_in).time,
          };
        },
      );
      setOpenDuties(formated);
    } catch (err) {
      console.log("Erro ao buscar plantões abertos para a página de usuário");
      if (err instanceof AxiosError) {
        console.log(err.response?.data);
      }
    }
  };

  useEffect(() => {
    getOpenDuties();
  }, []);

  return (
    <div className="page_layout">
      <header className="relative">
        <img
          src={blue_shark}
          alt=""
          className="h-[198px] w-[198px] blue_shark"
        />
        <WelcomeHeader />
      </header>
      <div className="grid grid-cols-[50vw_50vw]">
        <aside className="mx-[137px] mt-[3vh] flex flex-col gap-4 self-start">
          {openDuties?.map((openDuty, index) => {
            return (
              <ActiveDutyCard
                key={index}
                in_time={openDuty.timeIn}
                name={openDuty.name}
              />
            );
          })}
        </aside>
        <main className="flex justify-center items-start">
          <img
            src={semi_circle}
            alt=""
            className="w-[90px] h-[90px] semi_circle"
          />
          <LoginCard />
        </main>
      </div>
    </div>
  );
}
