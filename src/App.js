import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import { Route, Routes } from 'react-router-dom';
import MemberCreate from './components/MemberCreate';
import LoginPage from './components/LoginPage';
import { AuthContextProvider } from './context/UserContext';
import ProductList from './components/ProductList';
import { CartContextProvider } from './context/CartContext';
import OrderPage from './components/OrderPage';
import MyPage from './components/MyPage';

function App() {
  return (
    <AuthContextProvider>
      <CartContextProvider>
        <div className='App'>
          <Header />
          <div className='content-wrapper'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/member/create' element={<MemberCreate />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/product/list' element={<ProductList />} />
              <Route path='/order/cart' element={<OrderPage />} />
              <Route path='/mypage' element={<MyPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </CartContextProvider>
    </AuthContextProvider>
  );
}

export default App;
