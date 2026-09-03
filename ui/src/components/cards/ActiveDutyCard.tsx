type ActiveDutyCardProps = {
  name: string;
  in_time: string;
};

export function ActiveDutyCard({ name, in_time }: ActiveDutyCardProps) {
  return (
    <>
      <div className="flex flex-col white-bg w-[647px] h-[101px] rounded-[36.62px] justify-center items-center login_card">
        <h3 className="text-poppins font-[700] text-[36.44px] header-text-color">
          {name}
        </h3>
        <p className="text-poppins font-[500] text-[28.46px] subtext-color">
          {in_time}
        </p>
      </div>
    </>
  );
}
