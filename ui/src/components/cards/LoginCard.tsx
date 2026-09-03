import { LoginButton } from "../buttons/LoginButton";
import { LoginInput } from "../inputs/LoginInput";
import mail from "@/assets/symbols/mail.png";
import lock from "@/assets/symbols/lock.png";
import "@/styles/login_styles.css";

export function LoginCard() {
  return (
    <div
      className="flex flex-col gap-3 items-center 
    w-[430px] h-[521px] rounded-[32px] login_card"
    >
      <h2 className="login_title font-[400] text-[56.53px] p-10">Login</h2>
      <div className="flex flex-col gap-4">
        <LoginInput type="email" img={mail} />
        <LoginInput type="password" img={lock} />
        {/* Colocar link para a página de redefinir senha, posteriormente
            Por hora esse trecho tem fins exclusivamente estéticos
        */}
        <p className="font-[400] text-[19.23px] text-montserrat">
          Esqueceu a senha?
        </p>
      </div>
      <div className="mt-13">
        <LoginButton />
      </div>
    </div>
  );
}
