import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Signup } from './components/Signup';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/send' element={<Send />} />
      </Routes>
    </BrowserRouter>
  )
}


function Signin () {
  return (<p>Sign in</p>);
}
function Dashboard () {
  return (<p>Dashboard</p>);
}
function Send () {
  return (<p>Send</p>);
}

export default App