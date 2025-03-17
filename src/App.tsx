import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import PublicRoute from './components/route/PublicRoute';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/route/PrivateRoute';
import MyChatRoomPage from './pages/MyChatRoomPage';
import ChatPage from './pages/ChatPage';

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
