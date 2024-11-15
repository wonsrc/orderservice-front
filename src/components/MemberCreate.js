import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MemberCreate = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [zipcode, setZipcode] = useState('');

  const navigate = useNavigate();

  const memberCreate = async (e) => {
    e.preventDefault();

    const registerData = {
      name,
      email,
      password,
      address: {
        city,
        street,
        zipCode: zipcode,
      },
    };

    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/user/create`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(registerData),
      },
    );

    if (res.status === 201) {
      alert('회원 가입 성공! 환영합니다!');
      navigate('/');
    } else {
      const data = await res.json();
      console.log(data);

      alert(data.statusMessage);
    }
  };

  return (
    <Grid container justifyContent='center'>
      <Grid item xs={12} sm={8} md={6}>
        <Card>
          <CardHeader title='회원가입' style={{ textAlign: 'center' }} />
          <CardContent>
            <form onSubmit={memberCreate}>
              <TextField
                label='이름'
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin='normal'
                required
              />
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
              <TextField
                label='도시'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                fullWidth
                margin='normal'
              />
              <TextField
                label='상세주소'
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                fullWidth
                margin='normal'
              />
              <TextField
                label='우편번호'
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                fullWidth
                margin='normal'
              />
              <CardActions>
                <Button
                  type='submit'
                  color='primary'
                  variant='contained'
                  fullWidth
                >
                  등록
                </Button>
              </CardActions>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MemberCreate;
