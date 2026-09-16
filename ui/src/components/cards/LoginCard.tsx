import "@/styles/login_styles.css";
import mail from "@/assets/symbols/mail.png";
import lock from "@/assets/symbols/lock.png";
import axios from "axios";
import { LoginButton } from "../buttons/LoginButton";
import { LoginInput } from "../inputs/LoginInput";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { sharkinApi } from "@/api/api";

type LoginFormType = {
  email: string;
  password: string;
};

export function LoginCard() {
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>();

  const onSubmit = async ({ email, password }: LoginFormType) => {
    setLoginError(null);

    try {
      const { data } = await sharkinApi.post("auth/sign-in", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", data.accessToken);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          switch (err.response.status) {
            case 401:
              setLoginError(err.response.data.message);
              break;
            default:
              setLoginError("Erro ao tentar fazer login. Tente novamente");
          }
        } else if (err.request) {
          setLoginError("Não foi possível conectar ao servidor");
        }
      }
    }
  };

  return (
    <div
      className="flex flex-col gap-3 items-center 
    w-[430px] h-[521px] rounded-[32px] login_card"
    >
      <h2 className="login_title font-[400] text-[56.53px] p-10">Login</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <div className="flex flex-col gap-6">
          <LoginInput type="email" img={mail} {...register("email")} />
          <LoginInput type="password" img={lock} {...register("password")} />
          {/* Colocar link para a página de redefinir senha, posteriormente
            Por hora esse trecho tem fins exclusivamente estéticos
        */}
          <div className="flex flex-col gap-2">
            {loginError && (
              <p className="font-[400] text-[17.23px] text-montserrat text-red-600 ">
                {loginError}
              </p>
            )}
            <p className="font-[400] text-[19.23px] text-montserrat">
              Esqueceu a senha?
            </p>
          </div>
        </div>
        <div className="mt-13">
          <LoginButton />
        </div>
      </form>
    </div>
  );
}
