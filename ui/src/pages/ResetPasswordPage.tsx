import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';

import { AuthButton } from '@/components/auth/AuthButton';
import { AuthField } from '@/components/auth/AuthField';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { usePasswordRecovery } from '@/contexts/PasswordRecoveryContext';

import {
  resetRecoveredPassword,
  recoveryErrorMessage,
} from '@/api/passwordRecovery';

import eyeIcon from '@/assets/symbols/eye.png';
import eyeOffIcon from '@/assets/symbols/eye_off.png';
import lockIcon from '@/assets/symbols/lock.png';

type ResetFormData = {
  password: string;
  confirmPassword: string;
};

export function ResetPasswordPage() {
  const navigate = useNavigate();

  const {
    email,
    code,
    finishRecovery,
    returnToEmail,
  } = usePasswordRecovery();

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    mode: 'onBlur',
  });

  async function onSubmit({ password }: ResetFormData) {
    clearErrors('root');

    if (!email || !code) {
      setError('root', {
        type: 'server',
        message: 'Reinicie a recuperação para solicitar outro código.',
      });
      return;
    }

    try {
      const { message } = await resetRecoveredPassword(
        email,
        code,
        password,
      );

      localStorage.removeItem('token');

      window.alert(`${message} Entre com sua nova senha.`);

      finishRecovery();
      navigate('/', { replace: true });
    } catch (error) {
      setError('root', {
        type: 'server',
        message: recoveryErrorMessage(error),
      });
    }
  }

  return (
    <AuthLayout
      title="Redefinir senha"
      subtitle="Digite sua nova senha."
      accent="forward"
    >
      <form
        className="auth-form auth-form--reset"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <AuthField
          id="new-password"
          type="password"
          icon={lockIcon}
          showPasswordIcon={eyeIcon}
          hidePasswordIcon={eyeOffIcon}
          placeholder="senha"
          autoComplete="new-password"
          registration={register('password', {
            required: 'Informe a nova senha.',
            minLength: {
              value: 8,
              message: 'Use pelo menos 8 caracteres.',
            },
            maxLength: {
              value: 128,
              message: 'Use no máximo 128 caracteres.',
            },
          })}
          error={errors.password?.message}
        />

        <AuthField
          id="confirm-new-password"
          type="password"
          icon={lockIcon}
          showPasswordIcon={eyeIcon}
          hidePasswordIcon={eyeOffIcon}
          placeholder="confirmar senha"
          autoComplete="new-password"
          registration={register('confirmPassword', {
            required: 'Confirme a nova senha.',
            validate: (value) =>
              value === getValues('password') ||
              'As senhas não coincidem.',
          })}
          error={errors.confirmPassword?.message}
        />

        {errors.root?.message && (
          <p className="auth-field__error" role="alert">
            {errors.root.message}
          </p>
        )}

        <AuthButton disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Redefinir'}
        </AuthButton>

        <Link
          to="/recuperar-senha"
          onClick={returnToEmail}
        >
          Reiniciar recuperação
        </Link>
      </form>
    </AuthLayout>
  );
}