export const formatActiveDutyDate = (dateTime: string) => {
  const date = new Date(dateTime);

  const hour = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return {
    time: `${hour}:${minutes}:${seconds}`,
  };
};
