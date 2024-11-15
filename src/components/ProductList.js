import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/UserContext';
import CartContext from '../context/CartContext';
import axios from 'axios';
import { throttle } from 'lodash';

const ProductList = ({ pageTitle }) => {
  const [searchType, setSearchType] = useState('optional');
  const [searchValue, setSearchValue] = useState('');
  const [productList, setProductList] = useState([]);
  const [selected, setSelected] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [isLastPage, setLastPage] = useState(false);
  // 현재 로딩중이냐? -> 백엔드로부터 상품 목록 요청을 보내서 데이터를 받아오는 중인가?
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 25;

  const { userRole } = useContext(AuthContext);
  const { addCart } = useContext(CartContext);
  const isAdmin = userRole === 'ADMIN';

  useEffect(() => {
    loadProduct(); // 처음 화면에 진입하면 1페이지 내용을 불러오자
    // 쓰로틀링: 짧은 시간동안 연속해서 발생한 이벤트들을 일정 시간으로 그룹화 하여
    // 마지막 이벤트 핸들러만 호출하게 하는 기능. -> 스크롤 페이징
    // 디바운싱: 짧은 시간동안 연속해서 발생한 이벤트를 호출하지 않다가 마지막 이벤트로부터
    // 일정 시간 이후에 한번만 호출하게 하는 기능. -> 입력값 검증
    const throttledScroll = throttle(scrollPagination, 1000);
    window.addEventListener('scroll', throttledScroll);

    // 클린업 함수: 다른 컴포넌트가 렌더링 될 때 이벤트 해제.
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  // useEffect는 하나의 컴포넌트에서 여러 개 선언이 가능합니다.
  // 스크롤 이벤트에서 다음 페이지 번호를 준비했고,
  // 상태가 바뀌면 그 때 백엔드로 요청을 보낼 수 있게 로직을 나누었습니다.
  useEffect(() => {
    if (currentPage > 0) loadProduct();
  }, [currentPage]);

  // 상품 목록을 백엔드에 요청하는 함수
  const loadProduct = async () => {
    // 아직 로딩 중이라면 or 이미 마지막 페이지라면 더이상 진행하지 말아라.
    if (isLoading || isLastPage) return;

    let params = {
      size: pageSize,
      page: currentPage,
    };

    // 사용자가 조건을 선택했고, 검색어를 입력했다면 프로퍼티를 추가하자.
    if (searchType !== 'optional' && searchValue) {
      params.category = searchType;
      params.searchName = searchValue;
    }

    setIsLoading(true);

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/product/list`,
        { params },
      );
      const data = res.data;
      console.log(data.result);

      const additionalData = data.result.content.map((p) => ({
        ...p,
        quantity: 0,
      }));

      if (additionalData.length === 0) {
        setLastPage(true);
      } else {
        setProductList((prevList) => [...prevList, ...additionalData]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollPagination = () => {
    // 브라우저 창의 높이 + 현재 페이지에서 스크롤 된 픽셀 값
    //>= (스크롤이 필요 없는)페이지 전체 높이에서 100px 이내에 도달했는가?
    const isBottom =
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.scrollHeight - 100;
    if (isBottom && !isLastPage && !isLoading) {
      // 스크롤이 특정 구간에 도달하면 바로 요청 보내는 게 아니라 다음 페이지 번호를 준비하겠다.
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // 장바구니 클릭 이벤트 핸들러
  const handleAddToCart = () => {
    // 특정 객체에서 key값만 뽑아서 문자열 배열로 리턴해주는 메서드
    const selectedProduct = Object.keys(selected);
    // key값만 뽑아서 selected에 들어있는 상품들 중에 false인 거 빼고 true인 것만 담겠다.
    const filtered = selectedProduct.filter((key) => selected[key]);
    const finalSelected = filtered.map((key) => {
      const product = productList.find((p) => p.id === parseInt(key));
      return {
        id: product.id,
        name: product.name,
        quantity: product.quantity,
      };
    });

    console.log('최종 선택: ', finalSelected);

    if (finalSelected.length < 1) {
      alert('장바구니에 추가할 상품을 선택해 주세요!');
      return;
    }

    for (let p of finalSelected) {
      if (!p.quantity) {
        alert('수량이 0개인 상품은 담을 수 없습니다.');
        return;
      }
    }

    if (confirm('상품을 장바구니에 추가하시겠습니까?')) {
      // 카트로 상품을 보내주자.
      finalSelected.forEach((product) => addCart(product));
      alert('선택한 상품이 장바구니에 추가되었습니다.');
    }
  };

  // 체크박스 클릭 이벤트 핸들러
  const handleCheckboxChange = (productId, checked) => {
    // 사용자가 특정 상품을 선택했는지에 대한 상태를 관리 {상품 아이디, 체크 여부}
    setSelected((prevSelected) => ({
      ...prevSelected,
      [productId]: checked,
    }));
  };

  // 검색 버튼 클릭 이벤트 핸들러 (form submit)
  const searchBtnHandler = (e) => {
    e.preventDefault();
    setProductList([]);
    setCurrentPage(0);
    setIsLoading(false);
    setLastPage(false);
    loadProduct();
  };

  return (
    <Container>
      <Grid
        container
        justifyContent='space-between'
        spacing={2}
        className='mt-5'
      >
        <Grid item>
          <form onSubmit={searchBtnHandler}>
            <Grid container spacing={2}>
              <Grid item>
                <Select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value='optional'>선택</MenuItem>
                  <MenuItem value='name'>상품명</MenuItem>
                  <MenuItem value='category'>카테고리</MenuItem>
                </Select>
              </Grid>
              <Grid item>
                <TextField
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  label='Search'
                />
              </Grid>
              <Grid item>
                <Button type='submit'>검색</Button>
              </Grid>
            </Grid>
          </form>
        </Grid>

        {!isAdmin && (
          <Grid item>
            <Button onClick={handleAddToCart} color='secondary'>
              장바구니
            </Button>
          </Grid>
        )}

        {isAdmin && (
          <Grid item>
            <Button href='/product/create' color='success'>
              상품등록
            </Button>
          </Grid>
        )}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant='h6' align='center'>
            {pageTitle}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>제품사진</TableCell>
                <TableCell>제품명</TableCell>
                <TableCell>가격</TableCell>
                <TableCell>재고수량</TableCell>
                {!isAdmin && <TableCell>주문수량</TableCell>}
                {!isAdmin && <TableCell>주문선택</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.imagePath}
                      alt={product.name}
                      style={{ height: '100px', width: 'auto' }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.stockQuantity}</TableCell>
                  {!isAdmin && (
                    <TableCell>
                      <TextField
                        type='number'
                        value={product.quantity || 0}
                        onChange={(e) =>
                          // 사용자가 주문 수량을 올릴 때마다
                          // 상품 객체에 quantity라는 프로퍼티를 추가해서
                          // 추후에 장바구니에 담을 때 꺼내서 활용할 예정.
                          setProductList((prevList) =>
                            prevList.map((p) =>
                              p.id === product.id
                                ? { ...p, quantity: parseInt(e.target.value) }
                                : p,
                            ),
                          )
                        }
                        style={{ width: '70px' }}
                        InputProps={{
                          inputProps: {
                            min: 0,
                            max: product.stockQuantity,
                          },
                        }}
                      />
                    </TableCell>
                  )}
                  {!isAdmin && (
                    <TableCell>
                      <Checkbox
                        checked={!!selected[product.id]}
                        onChange={(e) =>
                          handleCheckboxChange(product.id, e.target.checked)
                        }
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductList;
