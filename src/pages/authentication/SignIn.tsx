import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import IconifyIcon from 'components/base/IconifyIcon';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import callApi from '../../util/axios';
interface User {
  [key: string]: string;
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // hoặc URL mà bạn đang truy cập
  timeout: 5000,
});

const SignIn = () => {
  const [user, setUser] = useState<User>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message before making the request

    try {
      // Gọi API login với thông tin user
      const response = await axiosInstance.post('/auth/login', {
        email: user.email,
        password: user.password,
      });

      // Kiểm tra xem có access_token trong response hay không
      const accessToken = response.data.result.accessToken;
      if (accessToken) {
        // Lưu access_token vào localStorage
        localStorage.setItem('access_token', accessToken);
        try {
          const user = await callApi.get('/users/my-profile');
          localStorage.setItem('user', JSON.stringify(user.data.result));
        } catch (error) {
          console.log(`🚀 ~ error:`, error);
        }

        navigate('/', { replace: true });
      }
    } catch (error) {
      // Xử lý lỗi nếu có (ví dụ: sai tài khoản hoặc mật khẩu)
      if (axios.isAxiosError(error) && error.response) {
        const errorResponse = error.response.data;
        setErrorMessage(errorResponse.message || 'Something went wrong. Please try again!');
      } else {
        setErrorMessage('Network error. Please check your connection.');
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
        <Typography variant="h3">Sign In</Typography>
        <Box component="form" onSubmit={handleSubmit}>
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
            sx={{ mt: 5 }}
            fullWidth
            autoFocus
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

          {errorMessage && (
            <Typography color="error" variant="body2" mt={2} align="center">
              {errorMessage}
            </Typography>
          )}

          <Stack mt={1.5} alignItems="center" justifyContent="space-between">
            <FormControlLabel
              control={<Checkbox id="checkbox" name="checkbox" size="medium" color="primary" />}
              label="Keep me logged in"
              sx={{ ml: -0.75 }}
            />
            <Link href="#!" fontSize="body2.fontSize" fontWeight={600}>
              Forgot password?
            </Link>
          </Stack>

          <Button type="submit" variant="contained" size="large" sx={{ mt: 3 }} fullWidth>
            Sign In
          </Button>
        </Box>

        <Typography
          mt={3}
          variant="body2"
          textAlign={{ xs: 'center', md: 'left' }}
          letterSpacing={0.25}
        >
          Not registered yet?{' '}
        </Typography>
      </Box>

      <Typography variant="body2" color="text.disabled" fontWeight={500}></Typography>
    </Stack>
  );
};

export default SignIn;
