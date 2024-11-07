import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from '../configs/axios-config';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/UserContext';

const MyPage = () => {
  const [memberInfoList, setMemberInfoList] = useState([]);
  const { onLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // 회원 정보를 불러오기
    const fetchMemberInfo = async () => {
      try {
        const res = await axiosInstance.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/myinfo`,
        );
        /*
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/myinfo`,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('ACCESS_TOKEN'),
            },
          },
        );
        */
        setMemberInfoList([
          { key: '이름', value: res.data.result.name },
          { key: '이메일', value: res.data.result.email },
          { key: '도시', value: res.data.result.address?.city || '등록 전' },
          {
            key: '상세주소',
            value: res.data.result.address?.street || '등록 전',
          },
          {
            key: '우편번호',
            value: res.data.result.address?.zipCode || '등록 전',
          },
        ]);
      } catch (e) {
        console.log('mypage의 catch문!');
        if (e.response.data.statusMessage === 'EXPIRED_RT') {
          alert('시간이 경과하여 재로그인이 필욜합니다.');
          onLogout();
          navigate('/');
        } else if (e.response.data.message === 'NO_LOGIN') {
          alert('까꿍');
          navigate('/');
        }
      }
    };

    fetchMemberInfo();
  }, []);

  return (
    <Container>
      <Grid container justifyContent='center'>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title='회원정보' style={{ textAlign: 'center' }} />
            <CardContent>
              <Table>
                <TableBody>
                  {memberInfoList.map((element, index) => (
                    <TableRow key={index}>
                      <TableCell>{element.key}</TableCell>
                      <TableCell>{element.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* OrderListComponent */}
      {/* <OrderListComponent isAdmin={userRole === 'ADMIN'} /> */}
    </Container>
  );
};

export default MyPage;
