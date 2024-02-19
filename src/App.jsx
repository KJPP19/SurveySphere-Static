import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import AuthProvider from './context/auth/authProvider';
import ProtectedRoute from './context/auth/protectedRoute';
import LandingPage from './pages/landingPage';
import LogIn from './pages/loginPage';
import SignUp from './pages/signupPage';
import Workspace from './pages/workspacePage';
import Survey from './pages/surveyPage';
import Share from './pages/sharePage';
import Results from './pages/resultPage';
import SurveyResponse from './pages/surveyResponsePage';

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
              <Route exact path='/surveys/:surveyId/create' element={<Survey/>}/>
              <Route exact path='/surveys/:surveyId/share' element={<Share/>}/>
              <Route exact path='/surveys/:surveyId/results' element={<Results/>}/>
            </Route>
            <Route exact path='/survey/public/:shareId' element={<SurveyResponse/>}/>
          </Routes>
        </AuthProvider>
      </Router>
  )
}

export default App
