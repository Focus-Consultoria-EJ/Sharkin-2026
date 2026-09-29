import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

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
  @IsString()
  @IsNotEmpty()
  userId!: string;
}

export class VerifyCodeDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @Length(6, 6)
  token!: string;
}
