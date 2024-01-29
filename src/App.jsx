import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import AuthProvider from './context/auth/authProvider';
import ProtectedRoute from './context/auth/protectedRoute';
import LandingPage from './pages/landingPage';
import LogIn from './pages/loginPage';
import SignUp from './pages/signupPage';
import Workspace from './pages/workspacePage';

function App() {

  return (
      <Router>
        <AuthProvider>
          <Routes>
            <Route exact path='/' element={<LandingPage/>}/>
            <Route exact path='/login' element={<LogIn/>}/>
            <Route exact path='/signup' element={<SignUp/>}/>
            <Route element={<ProtectedRoute/>}>
              <Route exact path='/workspace' element={<Workspace/>}/>
              <Route exact path='/survey'/>
              <Route exact path='/share'/>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
  )
}

export default App
