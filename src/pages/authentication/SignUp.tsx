import { useState, ChangeEvent, FormEvent } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  [key: string]: string;
}
const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL, // hoặc URL mà bạn đang truy cập
  timeout: 5000,
});
const SignUp = () => {
  const [user, setUser] = useState<User>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '', // Thêm confirmPassword
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user.password !== user.confirm_password) {
      setError('Passwords do not match!');
    } else {
      try {
        await axiosInstance.post('auth/register', user);
        navigate('/authentication/sign-in', { replace: true });
      } catch (error) {
        setError(error.response.data.message);
        console.log(`🚀 ~ res:`, error);
      }
    }
  };

  return (
    <Stack
      mx="auto"
      width={410}
      height="auto"
      minHeight={800}
      direction="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box width={1}>
        <Button
          variant="text"
          component={Link}
          href="/"
          sx={{ ml: -1.75, pl: 1, pr: 2 }}
          startIcon={
            <IconifyIcon
              icon="ic:round-keyboard-arrow-left"
              sx={(theme) => ({ fontSize: `${theme.typography.h3.fontSize} !important` })}
            />
          }
        >
          Back to dashboard
        </Button>
      </Box>

      <Box width={1}>
        <Typography variant="h3">Sign Up</Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            id="first_name"
            name="first_name"
            type="text"
            label="First Name"
            value={user.first_name}
            onChange={handleInputChange}
            variant="filled"
            placeholder="First Name"
            autoComplete="first_name"
            sx={{ mt: 6 }}
            fullWidth
            autoFocus
            required
          />
          <TextField
            id="last_name"
            name="last_name"
            type="text"
            label="Last Name"
            value={user.last_name}
            onChange={handleInputChange}
            variant="filled"
            placeholder="Last Name"
            autoComplete="last_name"
            sx={{ mt: 6 }}
            fullWidth
            autoFocus
            required
          />
          <TextField
            id="phone"
            name="phone"
            type="text"
            label="Phone"
            value={user.phone}
            onChange={handleInputChange}
            variant="filled"
            placeholder="Phone"
            autoComplete="phone"
            sx={{ mt: 6 }}
            fullWidth
            autoFocus
            required
          />
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            value={user.email}
            onChange={handleInputChange}
            variant="filled"
            placeholder="mail@example.com"
            autoComplete="email"
            sx={{ mt: 6 }}
            fullWidth
            required
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={user.password}
            onChange={handleInputChange}
            variant="filled"
            placeholder="Min. 8 characters"
            autoComplete="current-password"
            sx={{ mt: 6 }}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    opacity: user.password ? 1 : 0,
                    pointerEvents: user.password ? 'auto' : 'none',
                  }}
                >
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ border: 'none', bgcolor: 'transparent !important' }}
                    edge="end"
                  >
                    <IconifyIcon
                      icon={showPassword ? 'ic:outline-visibility' : 'ic:outline-visibility-off'}
                      color="neutral.main"
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="confirm_password"
            name="confirm_password"
            label="Re-Password"
            type={showPassword ? 'text' : 'confirm_password'}
            value={user.confirm_password}
            onChange={handleInputChange}
            variant="filled"
            placeholder="Min. 8 characters"
            autoComplete="confirm_password"
            sx={{ mt: 6 }}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    opacity: user.password ? 1 : 0,
                    pointerEvents: user.password ? 'auto' : 'none',
                  }}
                >
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ border: 'none', bgcolor: 'transparent !important' }}
                    edge="end"
                  >
                    <IconifyIcon
                      icon={showPassword ? 'ic:outline-visibility' : 'ic:outline-visibility-off'}
                      color="neutral.main"
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" size="large" sx={{ mt: 3 }} fullWidth>
            Sign Up
          </Button>
        </Box>

        <Typography
          mt={3}
          variant="body2"
          textAlign={{ xs: 'center', md: 'left' }}
          letterSpacing={0.25}
        >
          Already have an account?{' '}
          <Link href={paths.signin} color="primary.main" fontWeight={600}>
            Let's Sign in
          </Link>
        </Typography>
      </Box>

      <Typography variant="body2" color="text.disabled" fontWeight={500}></Typography>
    </Stack>
  );
};

export default SignUp;
