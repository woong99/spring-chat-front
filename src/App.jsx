import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import ChatRoomPage from './pages/AllChatRoomPage';
import MyChatRoomPage from './pages/MyChatRoomPage';
import ChatPage from './pages/ChatPage';
import SignUpPage from './pages/SignUpPage';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/login'
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path='/signup'
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />
        <Route element={<Layout />}>
          <Route
            path='/'
            element={
              <PrivateRoute>
                <ChatRoomPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/my-chats'
            element={
              <PrivateRoute>
                <MyChatRoomPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/chat/:roomId'
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
