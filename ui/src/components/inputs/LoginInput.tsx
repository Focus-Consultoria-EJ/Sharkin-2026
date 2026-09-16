type LoginInput = {
  type: string;
  img: string;
};

export function LoginInput({ type, img, ...props }: LoginInput) {
  return (
    <>
      <div className="relative">
        <img
          className={`absolute w-[${type === "password" ? "16" : "30"}px] h-[30px] ml-3 mt-2`}
          src={img}
          alt=""
        />
        <label htmlFor={`${type}`} hidden>
          {type === "email" ? "email" : "senha"}
        </label>

        <input
          className="w-[351px] h-[47] login_input pl-12"
          id={`${type}`}
          type={`${type}`}
          {...props}
        />
      </div>
    </>
  );
}
