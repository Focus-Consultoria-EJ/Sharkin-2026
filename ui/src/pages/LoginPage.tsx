import { WelcomeHeader } from "@/components/headers/WelcomeHeader";
import { LoginCard } from "@/components/cards/LoginCard";
import { ActiveDutyCard } from "@/components/cards/ActiveDutyCard";
import semi_circle from "@/assets/focus/90_degrees_circle.png";
import blue_shark from "@/assets/focus/blue_shark.png";
import "@/styles/login_styles.css";

export function LoginPage() {
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
          <ActiveDutyCard name="Enzo magaldi" in_time="12:21:20" />
          <ActiveDutyCard name="Enzo magaldi" in_time="12:21:20" />
          <ActiveDutyCard name="Enzo magaldi" in_time="12:21:20" />
          <ActiveDutyCard name="Enzo magaldi" in_time="12:21:20" />
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
