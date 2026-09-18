export const formatDutyDate = (dateTime: string) => {
  const date = new Date(dateTime);

  const day = date.getDay();
  const month = date.getMonth();
  const year = date.getFullYear();

  const hour = date.getHours();
  const minutes = date.getMinutes();

  return {
    date: `${day}/${month}/${year}`,
    time: `${hour}:${minutes}`,
  };
};
