import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  Grid,
  TextField,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const { onLogin } = useContext(AuthContext);

  const doLogin = async () => {
    const loginData = {
      email,
      password,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/user/doLogin`,
        loginData,
      );
      console.log('axios로 로그인 요청 결과: ', res);

      alert('로그인 성공!');
      const token = res.data.result.token;
      const id = res.data.result.id;
      const role = jwtDecode(token).role;

      onLogin(token, id, role);
      navigate('/');
    } catch (e) {
      console.log(e);
      // 옵셔널 체이닝 (optional chaining)
      // 특정 객체나 속성이 null 또는 undefined인지 확인하고 안전하게 접근할 수 있게 도와줌.
      // 논리 연산자와 연계하여 옵셔널 체이닝이 falsy 한 값일 경우 대체할 수 있는 값을 지정.
      const errorMessage = e.response?.data?.statusMessage || '로그인 실패!';
      alert(errorMessage);
    }

    /*
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/user/doLogin`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(loginData),
      },
    );

    if (res.status === 200) {
      alert('로그인 성공!');
      const data = await res.json();
      const token = data.result.token;
      const id = data.result.id;
      const role = jwtDecode(token).role;

      onLogin(token, id, role);
      navigate('/');
    } else {
      const data = await res.json();
      alert(data.statusMessage);
    }

    */
  };

  return (
    <Grid container justifyContent='center'>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardHeader title='로그인' style={{ textAlign: 'center' }} />
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                doLogin();
              }}
            >
              <TextField
                label='Email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin='normal'
                required
              />
              <TextField
                label='Password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin='normal'
                required
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button color='secondary' fullWidth>
                    비밀번호 변경
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    type='submit'
                    color='primary'
                    variant='contained'
                    fullWidth
                  >
                    로그인
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>

      {/* 비밀번호 변경 모달 */}
      {/* <Dialog open={resetPassword} onClose={() => setResetPassword(false)}>
        <ResetPasswordModal handleClose={() => setResetPassword(false)} />
      </Dialog> */}
    </Grid>
  );
};

export default LoginPage;
