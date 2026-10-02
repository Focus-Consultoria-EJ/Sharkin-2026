import "@/styles/login_styles.css";

import { sharkinApi } from "@/api/api";
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
      <header>
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
          <LoginCard />
        </main>
      </div>
    </div>
  );
}
