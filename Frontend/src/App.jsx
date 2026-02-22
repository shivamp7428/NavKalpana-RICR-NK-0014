import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./Pages/Login";
import PublicRoute from './Routes/PublicRoute';
import PrivateRoute from './Routes/PrivateRoute';
import NotFound from './Component/NotFound';
import Loader from "./Component/Loader";
import Courses from './Pages/Courses';
import CourseDetail from './Pages/CourseDetail';

function App() {
  return (
    <Router>
      <Loader/>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="*" element={
            <NotFound/>
        } />


        <Route path="/courses" element={
           <PrivateRoute>
            <Courses/>
          </PrivateRoute>
        } />
        <Route path="/course/:courseId" element={
          <PrivateRoute>
            <CourseDetail />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;