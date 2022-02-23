import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import Nav from './Nav';
import UserContext from '../../Context/UserContext';

function Home() {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const path = useLocation().pathname;
  useEffect(() => {
    if (userCtx.authStatus) {
      if (userCtx.type === 'Organizations') {
        navigate('/company/overview', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  });

  return (
    <>
      <Nav />
      <div className="container">
        <Outlet />
      </div>
    </>
  );
}

export default Home;
