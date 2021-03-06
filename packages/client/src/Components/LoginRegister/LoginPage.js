import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import UserContext from '../../Context/UserContext';
import loginWallpaper from '../../Assets/Img/loginWallpaper.jpg';

function Login() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const jsonVal = await res.json();
    if (jsonVal.success) {
      userCtx.updateUserStatus({
        authStatus: jsonVal.success,
        id: jsonVal.user.basics.id,
        type: jsonVal.user.basics.type,
      });
    } else {
      setError('loginError', { message: 'Incorrect Username or Password' });
    }
  };

  useEffect(() => {
    if (userCtx.authStatus) {
      if (userCtx.type === 'Users') {
        navigate('/jobseeker/overview', { replace: true });
      } else if (userCtx.type === 'Organizations') {
        navigate('/company/overview', { replace: true });
      }
    }
  });

  if (userCtx.authStatus) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <div className="row justify-content-around my-5">
        <div className="col-lg-7 mt-5 me-5">
          <img className="img img-fluid" src={loginWallpaper} alt="wallpaper" />
        </div>
        <div className="col-lg-4 shadow-lg rounded-3 border border-white px-3 py-4">
          <form className="my-4" onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register('username', {
                required: true,
                onChange: () => clearErrors(),
              })}
              type="text"
              className="form-control form-control-lg my-2"
              placeholder="Email or Username"
            />

            <input
              {...register('password', {
                required: true,
                onChange: () => clearErrors(),
              })}
              type="password"
              className="form-control form-control-lg my-2"
              placeholder="Password"
            ></input>
            {errors.loginError && (
              <div className="alert alert-danger my-2">
                {errors.loginError.message}
              </div>
            )}
            <div className="d-grid gap-2 my-4">
              <button className="btn btn-primary btn-lg" type="submit">
                Log In
              </button>
            </div>
          </form>
          <hr />
          <div className="d-grid gap-2">
            <Link to="/register-jobseeker" className="btn btn-success btn-lg">
              Create a Job Seeker Account
            </Link>
            <Link to="/register-company" className="btn btn-success btn-lg">
              Create a Company Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
