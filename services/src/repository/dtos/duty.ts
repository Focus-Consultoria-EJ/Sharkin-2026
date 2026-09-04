export type DutyDto = {
  duty_id: string;
  user_id: string;
  date: Date;
  in_time: Date;
  out_time: Date | null;
};
