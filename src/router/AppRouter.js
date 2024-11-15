import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../components/Home';
import MemberCreate from '../components/MemberCreate';
import LoginPage from '../components/LoginPage';
import ProductList from '../components/ProductList';
import OrderPage from '../components/OrderPage';
import MyPage from '../components/MyPage';
import ProductCreate from '../components/ProductCreate';
import PrivateRouter from './PrivateRouter';

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/member/create' element={<MemberCreate />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/product/list' element={<ProductList />} />
      <Route path='/order/cart' element={<OrderPage />} />
      <Route path='/mypage' element={<PrivateRouter element={<MyPage />} />} />
      <Route
        path='/product/manage'
        element={
          <PrivateRouter element={<ProductCreate />} requiredRole='ADMIN' />
        }
      />
    </Routes>
  );
};

export default AppRouter;
