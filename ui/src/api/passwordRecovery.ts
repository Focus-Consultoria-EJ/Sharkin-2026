import { isAxiosError } from 'axios';
import { sharkinApi } from './api';

type MessageResponse = {
  message: string;
};

type VerifyResponse = {
  valid: boolean;
};

type ApiErrorResponse = {
  message?: string | string[];
};

export async function requestRecoveryCode(email: string) {
  const { data } = await sharkinApi.post<MessageResponse>(
    '/auth/change-password/generate',
    { email },
  );

  return data;
}

export async function verifyRecoveryCode(
  email: string,
  token: string,
) {
  const { data } = await sharkinApi.post<VerifyResponse>(
    '/auth/change-password/verify',
    { email, token },
  );

  return data;
}

export async function resetRecoveredPassword(
  email: string,
  token: string,
  password: string,
) {
  const { data } = await sharkinApi.post<MessageResponse>(
    '/auth/change-password/reset',
    { email, token, password },
  );

  return data;
}

export function recoveryErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    if (!error.response) {
      return 'Não foi possível conectar ao servidor. Tente novamente.';
    }

    if (error.response.status >= 500) {
      return 'Não foi possível concluir a solicitação. Tente novamente.';
    }

    const message = error.response.data?.message;

    if (Array.isArray(message)) {
      return message.join(' ');
    }

    if (typeof message === 'string') {
      return message;
    }
  }

  return 'Não foi possível concluir a solicitação.';
}