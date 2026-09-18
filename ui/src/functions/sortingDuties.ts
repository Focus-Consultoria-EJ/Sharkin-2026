import type { CardData } from "@/types/uiTypes";

export const sortDuties = (data: any) => {
  data.sort((a: any, b: any) => {
    return (
      new Date(b.dateTime_in).getTime() - new Date(a.dateTime_in).getTime()
    );
  });

  return data;
};
