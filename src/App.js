import { useState, useEffect } from "react";
import './App.css';
import Home from './pages/Home';
import "./style.scss"
import "./media-query.css"
import { Routes, Route,useNavigate, Navigate } from "react-router-dom";
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import Detail from "./pages/Detail";
import AddEditBlog from './pages/AddEditBlog';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Header from './components /Header';
import Auth from "./pages/Auth";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';
import TagBlog from "./components /TagBlog";
import CategoryBlog from "./pages/CategoryBlog";
import ScrollToTop from "./components /ScrollToTop";

function App() {
  const [active, setActive] = useState('home');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
     auth.onAuthStateChanged((authUser)=>{
       if (authUser) {
        setUser(authUser)
       } else {
        setUser(null);
       }
     } 
     )
  }, [])

  const handleLogout = () =>{
    signOut(auth).then(() => {
      setUser(null);
      setActive("login");
      navigate("/auth");
    })
  }
  return (
    <div className='App'>
     
      <Header setActive={setActive} active={active} user ={user} handleLogout = {handleLogout}/>

      <ScrollToTop />
      <ToastContainer position="top-center"/>
      
      <Routes>

        <Route path='/' element={<Home setActive={setActive} active={active} user={user}></Home>}/>
        <Route path='/search' element={<Home setActive={setActive} user={user}></Home>}/>
        <Route path='/detail/:id' element={<Detail setActive={setActive} user={user}/>}/> 
        <Route path='/create' element={user?.uid ? <AddEditBlog user={user} setActive={setActive}/> : <Navigate to = "/auth" />} />
        <Route path='/update/:id' element={user?.uid ? <AddEditBlog user={user}/> : <Navigate to = "/auth" />} />
        <Route path="/tag/:tag" element = {<TagBlog/>}/>
        <Route path="/category/:category" element = {<CategoryBlog/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path="/auth" element ={<Auth setActive ={setActive} setUser={setUser}/>}/>
        <Route path='*' element={<NotFound/>}/>

      </Routes>
    </div>
    
  );
}

export default App;
