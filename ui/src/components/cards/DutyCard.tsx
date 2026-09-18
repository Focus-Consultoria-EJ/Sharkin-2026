import cardShark from "@/assets/focus/blue_shark2.png";

type DutyCardProps = {
  date: string;
  time: string;
};

export function DutyCard({ date, time }: DutyCardProps) {
  return (
    <article className="duty-card">
      <p className="duty-card__date">{date}</p>
      <p className="duty-card__time">{time}</p>

      <img
        className="duty-card__shark duty-card__shark--left"
        src={cardShark}
        alt=""
      />

      <img
        className="duty-card__shark duty-card__shark--right"
        src={cardShark}
        alt=""
      />
    </article>
  );
}
