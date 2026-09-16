import { DutyToggleButton } from "@/components/buttons/DutyToggleButton";
import { DutyCard } from "@/components/cards/DutyCard";
import { UserHeader } from "@/components/headers/UserHeader";

import "@/styles/user_styles.css";

const mockDuties = Array.from(
  { length: 12 },
  (_, index) => ({
    id: index + 1,
    date: "02/09/2026",
    time: "14:30 — 18:45",
  }),
);

export function UserPage() {
  return (
    <div className="user-page">
      <UserHeader />

      <main>
        <section className="user-action">
          <DutyToggleButton />
        </section>

        <section
          className="duties-grid"
          aria-label="Histórico de plantões"
        >
          {mockDuties.map((duty) => (
            <DutyCard
              key={duty.id}
              date={duty.date}
              time={duty.time}
            />
          ))}
        </section>
      </main>
    </div>
  );
}