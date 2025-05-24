// App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NoteList from "./components/NoteList";
import LoginForm from "./components/login";
import RegisterForm from "./components/Register";

function App() {
  const isAuthenticated = !!localStorage.getItem("accessToken");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />} // Halaman utama diarahkan ke login
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/notes"
          element={
            isAuthenticated ? <NoteList /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
