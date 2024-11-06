import {
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useContext } from 'react';
import CartContext from '../context/CartContext';
import axios from 'axios';

const OrderPage = () => {
  const { productsInCart, clearCart } = useContext(CartContext);

  const removeCartItem = () => {
    if (confirm('장바구니를 비웁니다.')) {
      clearCart();
    }
  };

  const orderCreate = async () => {
    console.log('주문 요청 핸들러 호출!');

    // 백엔드가 달라는 형태로 줘야하니까 그에 맞게 객체를 매핑
    const orderProducts = productsInCart.map((p) => ({
      productId: p.id,
      productCount: p.quantity,
    }));

    if (orderProducts.length < 1) {
      alert('주문 대상 물품이 없습니다!');
      return;
    }

    const yesOrNo = confirm(
      `${orderProducts.length}개의 상품을 주문하시겠습니까?`,
    );

    if (!yesOrNo) {
      alert('주문이 취소되었습니다.');
      return;
    }

    // 백엔드로 주문 요청
    /*
      const res = await fetch('요청url', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(orderProducts),
      });
      */

    // axios는 200번대 정상 응답이 아닌 모든 것을 예외로 처리하기 때문에
    // try, catch로 작성합니다. (fetch는 400번대 응답에도 예외가 발생하진 않음)
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/order/create`,
        orderProducts,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('ACCESS_TOKEN'),
          },
        },
      );
      alert('주문이 완료되었습니다.');
      clearCart();
    } catch (e) {
      console.log(e);
      alert('주문 실패!');
    }
  };

  return (
    <Container>
      <Grid container justifyContent='center' style={{ margin: '20px 0' }}>
        <Typography variant='h5'>장바구니 목록</Typography>
      </Grid>
      <Grid
        container
        justifyContent='space-between'
        style={{ marginBottom: '20px' }}
      >
        <Button onClick={removeCartItem} color='secondary' variant='contained'>
          장바구니 비우기
        </Button>
        <Button onClick={orderCreate} color='primary' variant='contained'>
          주문하기
        </Button>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>제품ID</TableCell>
              <TableCell>제품명</TableCell>
              <TableCell>주문수량</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productsInCart.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OrderPage;
