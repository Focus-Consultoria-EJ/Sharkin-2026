import blue_shark from "@/assets/focus/blue_shark.png";

export function WelcomeHeader() {
  return (
    <div className="flex flex-col items-center relative text-white my-6">
      <h1
        className="text-montserrat font-[900] text-[140px]
      "
      >
        SHARK-IN
      </h1>
      <img src={blue_shark} alt="" className="h-[198px] w-[198px] blue_shark" />
      <div className="w-[1002px] h-[5px] medium-blue-bg"></div>
      <h2 className="text-poppins font-[500] text-[48px]">Bem-vindo, Shark!</h2>
    </div>
  );
}
