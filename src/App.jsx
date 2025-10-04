// App.jsx
import { Outlet } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
