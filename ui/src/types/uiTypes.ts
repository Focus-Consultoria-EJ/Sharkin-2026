export type JwtPayload = {
  sub: string;
  username: string;
};

export type CardData = {
  name: string;
  dateTime_in: string;
  dateTime_out: string;
};

export type ActiveDutyCardData = {
  name: string;
  timeIn: string;
};

export type DutyResponseType = {
  duty_id: string;
  user_id: string;
  dateTime_in: string;
  dateTime_out: string;
};

export type OpenDutyResponseType = {
  dateTime_in: string;
  user: {
    name: string;
  };
};
