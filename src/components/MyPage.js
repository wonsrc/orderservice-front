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
import AuthContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import OrderListComponent from './OrderListComponent';
import { handleAxiosError } from '../configs/HandleAxiosError';

const MyPage = () => {
  const [memberInfoList, setMemberInfoList] = useState([]);
  const { onLogout, userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // 회원 정보를 불러오기
    const fetchMemberInfo = async () => {
      /*
        이름, 이메일, 도시, 상세주소 우편번호를 노출해야 합니다.
        위 5가지 정보를 객체로 포장해서 memberInfoList에 넣어주세요.
        */
      try {
        const url =
          userRole === 'ADMIN'
            ? `${process.env.REACT_APP_API_BASE_URL}/user/list`
            : `${process.env.REACT_APP_API_BASE_URL}/user/myinfo`;

        const res = await axiosInstance.get(url);
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
        console.log(res.data);
        console.log(userRole);

        const data = userRole === 'ADMIN' ? res.data.result : [res.data.result];
        console.log(data);

        setMemberInfoList((prevList) => {
          return data.map((user) => [
            { key: '이름', value: user.name },
            { key: '이메일', value: user.email },
            { key: '도시', value: user.address?.city || '등록 전' },
            {
              key: '상세주소',
              value: user.address?.street || '등록 전',
            },
            {
              key: '우편번호',
              value: user.address?.zipCode || '등록 전',
            },
          ]);
        });
      } catch (e) {
        handleAxiosError(e, onLogout, navigate);
      }
    };

    fetchMemberInfo();
  }, []);

  console.log(memberInfoList);

  return (
    <Container>
      <Grid container justifyContent='center'>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title='회원정보' style={{ textAlign: 'center' }} />
            <CardContent>
              <Table>
                {memberInfoList.map((element, index) => (
                  <TableBody>
                    {element.map((info, index) => (
                      <TableRow key={index}>
                        <TableCell>{info.key}</TableCell>
                        <TableCell>{info.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ))}
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* OrderListComponent */}
      <OrderListComponent isAdmin={userRole === 'ADMIN'} />
    </Container>
  );
};

export default MyPage;
