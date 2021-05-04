import React, { useEffect, useState, useContext } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import authContext from './contexts/index.js';

const ValidatedLoginForm = ({ auth, loginError, setLoginError }) => (
  <Formik
    initialValues={{ username: "", password: "" }}
    onSubmit={(values, { setSubmitting }) => {
      axios.post('/api/v1/login', values)
      .then((data) => {
        localStorage.setItem('userId', JSON.stringify(data.data));
        auth.logIn();
      })
      .catch((err) => {
        console.log('err', err)
        setLoginError(err.response.data.message || err.message);
        setSubmitting(false);
      })
    }}
    validationSchema={yup.object().shape({
      username: yup.string()
        .required("Required")
        .min(3, 'min 3')
        .max(20, 'max 20'),
      password: yup.string()
        .required("No password provided.")
        .min(4, "Password is too short - should be 4 chars minimum.")
    })}
  >
    {props => {
      const {
        values,
        touched,
        errors,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit
      } = props;
      return (
        <form className="p-3" onSubmit={handleSubmit}>
          <div className="form-group">
          <label className="form-label" htmlFor="username">User Name</label>
          <input
            name="username"
            type="text"
            placeholder="Enter your username"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-control ${(loginError || (errors.password && touched.password)) && "is-invalid"}`}
          />
          {errors.username && touched.username && (
            <div className="invalid-feedback">{errors.username}</div>
          )}
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-control ${(loginError || (errors.password && touched.password)) && "is-invalid"}`}
          />
          {(loginError || (errors.password && touched.password)) && (
            <div className="invalid-feedback">{errors.password || loginError}</div>
          )}
          <button type="submit" className="w-100 mb-3 btn btn-outline-primary" disabled={isSubmitting}>
                  Войти
                  </button>
                  <div className="d-flex flex-column align-items-center">
                    <span className="small mb-2">Нет аккаунта?</span>
                    <a href="/signup">Регистрация</a>
                  </div>
          </div>
        </form>
      );
    }}
  </Formik>
);

const Login = () => {
  const auth = useContext(authContext);
  const userId = JSON.parse(localStorage.getItem('userId'));

  useEffect(() => {
    if (userId && userId.token) {
      auth.logIn();
    }
  });

  const [loginError, setLoginError] = useState('');

  if (loginError) {
    console.log('ERROR', loginError); //TODO
  }

  if (auth.loggedIn) {
    return <Redirect to="/" /> //TODO
  }
  
  console.log(auth)
  return (
      <div className="container-fluid">
        <div className="row justify-content-center pt-5">
          <div className="col-sm-4">
            <ValidatedLoginForm auth={auth} loginError={loginError} setLoginError={setLoginError} />
          </div>
        </div>
      </div>
  )
};

export default Login;