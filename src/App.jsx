import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import ChatRoomPage from './pages/AllChatRoomPage';
import MyChatRoomPage from './pages/MyChatRoomPage';
import ChatPage from './pages/ChatPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route element={<Layout />}>
          <Route path='/' element={<ChatRoomPage />} />
          <Route path='/my-chats' element={<MyChatRoomPage />} />
          <Route path='/chat/:roomId' element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
