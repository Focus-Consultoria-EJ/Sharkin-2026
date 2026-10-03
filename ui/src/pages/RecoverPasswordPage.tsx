import { flushSync } from 'react-dom';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { AuthButton } from '@/components/auth/AuthButton';
import { AuthField } from '@/components/auth/AuthField';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { usePasswordRecovery } from '@/contexts/PasswordRecoveryContext';

import {
  requestRecoveryCode,
  recoveryErrorMessage,
} from '@/api/passwordRecovery';

import mailIcon from '@/assets/symbols/mail.png';

type RecoveryFormData = {
  email: string;
};

export function RecoverPasswordPage() {
  const navigate = useNavigate();
  const { email, goToCode } = usePasswordRecovery();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RecoveryFormData>({
    mode: 'onBlur',
    defaultValues: {
      email,
    },
  });

  async function onSubmit(data: RecoveryFormData) {
    clearErrors('root');

    const normalizedEmail = data.email.trim().toLowerCase();

    try {
      await requestRecoveryCode(normalizedEmail);

      flushSync(() => goToCode(normalizedEmail));
      navigate('/verificar-codigo');
    } catch (error) {
      setError('root', {
        type: 'server',
        message: recoveryErrorMessage(error),
      });
    }
  }

  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle="Informe seu e-mail. Se ele estiver cadastrado, enviaremos um código para recuperação."
      accent="forward"
    >
      <form
        className="auth-form auth-form--recover"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <AuthField
          id="recovery-email"
          type="email"
          icon={mailIcon}
          placeholder="e-mail para recuperação"
          autoComplete="email"
          registration={register('email', {
            required: 'Informe o e-mail.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Informe um e-mail válido.',
            },
          })}
          error={errors.email?.message}
        />

        {errors.root?.message && (
          <p className="auth-field__error" role="alert">
            {errors.root.message}
          </p>
        )}

        <AuthButton disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </AuthButton>
      </form>
    </AuthLayout>
  );
}