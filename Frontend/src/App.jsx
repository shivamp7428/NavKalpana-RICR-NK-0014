import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./Pages/Login";
import PublicRoute from './Routes/PublicRoute';
import PrivateRoute from './Routes/PrivateRoute';
import NotFound from './Component/NotFound';
import Loader from "./Component/Loader";
import Courses from './Pages/Courses';
import CourseDetail from './Pages/CourseDetail';
import NotesDetail from "./Pages/NotesDetails";
import Quiz from "./Pages/Quize";
import Notes from "./Pages/Notes";
import AssignmentsPage from "./Pages/Assignment";
import SubmitAssignment from "./Pages/SubAssignment";
import AttendancePage from "./Pages/AttendancePage";
import StudentChat from "./Pages/StudentChat";
import AdminPublicRoute from './Routes/AdminPublic';
import AdminLogin from './Pages/adminLogin';
import AdminProtected from './Routes/AdminProtect';
import AdminChat from './Pages/adminChat';
import Internship from "./Pages/Internship";
import ApplyInternship from "./Pages/ApplyInternship";

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
          <Route path="/noteDetail" element={
          <PrivateRoute>
            <NotesDetail />
          </PrivateRoute>
        } />
        <Route path="/note" element={
          <PrivateRoute>
            <Notes />
          </PrivateRoute>
        } />
          <Route path="/quizzes" element={
          <PrivateRoute>
            <Quiz />
          </PrivateRoute>
        } />
        <Route path="/assignments" element={
          <PrivateRoute>
            <AssignmentsPage/>
          </PrivateRoute>
        }/>

        <Route path="/submit/:assignmentId" element={
          <PrivateRoute>
            <SubmitAssignment/>
          </PrivateRoute>
        }/>
         <Route path="/attendance" element={
          <PrivateRoute>
            <AttendancePage/>
          </PrivateRoute>
        }/>
        <Route path="/studentChat" element={
          <PrivateRoute>
            <StudentChat/>
          </PrivateRoute>
        }/>

        <Route path="/jobs" element={
          <PrivateRoute>
            <Internship/>
          </PrivateRoute>
        }/>
       <Route path="/apply/:id" element={
        <PrivateRoute>
          <ApplyInternship />
        </PrivateRoute>
       } />
        <Route path="/admin/login" element={
          <AdminPublicRoute>
            <AdminLogin/>
          </AdminPublicRoute>
        }/>
<Route path="/admin/chat" element={
          <AdminProtected>
            <AdminChat/>
          </AdminProtected>
        }/>

      </Routes>
    </Router>
  );
}

export default App;