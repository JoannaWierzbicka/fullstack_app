import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { registerUser, loginUser } from '../../api/auth.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLocale } from '../../context/LocaleContext.jsx';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLocale();
  const registrationSuccessFlash = useMemo(
    () => ({
      message: t('auth.registerSuccessAutoLogin'),
      severity: 'success',
    }),
    [t],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const registrationResult = await registerUser({ email, password });
      if (registrationResult?.error) {
        throw new Error(registrationResult.error);
      }

      let session = registrationResult?.session;
      let user = registrationResult?.user;

      if (!session || !user) {
        const loginResult = await loginUser({ email, password });
        if (loginResult?.error) {
          throw new Error(loginResult.error);
        }
        session = loginResult?.session;
        user = loginResult?.user;
      }

      if (!session || !user) {
        throw new Error(t('auth.registerErrorGeneric'));
      }

      login({ user, session });
      navigate('/dashboard', {
        replace: true,
        state: { flash: registrationSuccessFlash },
      });
    } catch (err) {
      const message = err.message || t('auth.registerErrorGeneric');
      if (message.toLowerCase().includes('already')) {
        setError(t('auth.registerErrorExisting'));
      } else {
        setError(message || t('auth.registerErrorGeneric'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto">
      <Typography variant="h5" gutterBottom>{t('auth.registerTitle')}</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label={t('auth.email')}
          fullWidth
          required
          margin="normal"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          label={t('auth.password')}
          fullWidth
          required
          type="password"
          autoComplete="new-password"
          margin="normal"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? t('auth.registerSubmitting') : t('auth.registerButton')}
        </Button>
      </form>
    </Box>
  );
}

export default Register;
