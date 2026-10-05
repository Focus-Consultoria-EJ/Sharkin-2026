import "@/styles/user_styles.css";
import { DutyToggleButton } from "@/components/buttons/DutyToggleButton";
import { DutyCard } from "@/components/cards/DutyCard";
import { UserHeader } from "@/components/headers/UserHeader";
import { useEffect, useState } from "react";
import { sharkinApi } from "@/api/api";
import { jwtDecode } from "jwt-decode";
import { AxiosError } from "axios";
import { formatDutyDate } from "@/functions/formatDutyDate";
import type { JwtPayload, CardData } from "@/types/uiTypes";
import { sortDuties } from "@/functions/sortingDuties";

export function UserPage() {
  const [name, setName] = useState<string>("");
  const [duties, setDuties] = useState<CardData[] | null>(null);
  const [userHasOpenDuty, setUserHasOpenDuty] = useState<boolean>(false);

  const fetchDuties = async () => {
    const token = localStorage.getItem("token");
    const { sub, username } = jwtDecode<JwtPayload>(token!);

    const firstName = username.split(" ")[0];

    setName(firstName!);

    try {
      const { data } = await sharkinApi.get(`/duty/${sub}`);
      const sorted = sortDuties(data);
      const formatted: CardData[] = sorted.map((duty: any) => ({
        name: username,
        dateTime_in: duty.dateTime_in,
        dateTime_out: duty.dateTime_out,
      }));

      const hasOpenDuty = data.some((duty: any) => duty.dateTime_out === null);
      setUserHasOpenDuty(hasOpenDuty);

      setDuties(formatted);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log("Erro ao buscar plantões");
        console.log(err);
      }
    }
  };

  useEffect(() => {
    fetchDuties();
  }, []);

  return (
    <div className="user-page">
      <UserHeader name={name!} />

      <main>
        <section className="user-action">
          <DutyToggleButton
            onToggleSuccess={fetchDuties}
            hasOpenDuty={userHasOpenDuty}
          />
        </section>

        <section className="duties-grid" aria-label="Histórico de plantões">
          {duties?.map((duty, index) => {
            const { date, time } = formatDutyDate(duty.dateTime_in);
            let timeOut = null;
            if (duty.dateTime_out !== null) {
              timeOut = formatDutyDate(duty.dateTime_out);
            }
            return (
              <DutyCard
                key={index}
                date={date}
                time={timeOut ? `${time} — ${timeOut.time}` : `${time} — `}
              />
            );
          })}
        </section>
      </main>
    </div>
  );
}
