import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength} from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export type AccessTokenDto = {
  accessToken: string;
};

export class CreateCodeDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  email!: string;
}

export class VerifyCodeDto extends CreateCodeDto {
  @IsString()
  @Matches(/^\d{6}$/, {
    message: 'Informe um código de 6 dígitos.',
  })
  token!: string;
}

export class ResetPasswordDto extends VerifyCodeDto {
  @IsString()
  @MinLength(8, {
    message: 'A senha deve ter pelo menos 8 caracteres.',
  })
  @MaxLength(128, {
    message: 'A senha deve ter no máximo 128 caracteres.',
  })
  password!: string;
}