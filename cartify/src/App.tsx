import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LoginPage, RegisterPage, HomePage, ChatMessagesLayout } from './pages';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/admin/*' element={<h1>Admin Panel</h1>} />
        <Route path='/store/*' element={<h1>Store</h1>} />
        <Route path='/chat/*' element={<ChatMessagesLayout />} />
        <Route path='/ai/*' element={<h1>AI Generate</h1>} />
        <Route path='*' element={<h1>Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
