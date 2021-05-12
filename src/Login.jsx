/* eslint-disable react/prop-types */
import React, { useEffect, useState, useContext } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import authContext from './contexts/index.js';

const ValidatedLoginForm = ({ auth }) => {
  const [loginError, setLoginError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  if (loginError) {
    console.log('Login Error', loginError);
    const { statusCode } = loginError.response.data;
    if (statusCode === 401) {
      setErrorMessage('Неверные имя пользователя или пароль');
      setLoginError('');
    }
  }
  console.log('Error Message', errorMessage);
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={(values, { setSubmitting }) => {
        axios.post('/api/v1/login', values)
          .then((data) => {
            localStorage.setItem('userId', JSON.stringify(data.data));
            auth.logIn();
          })
          .catch((err) => {
            console.log('err', err);
            setLoginError(err);
            setSubmitting(false);
          });
      }}
      validationSchema={yup.object().shape({
        username: yup.string()
          .required('Required')
          .min(3, 'min 3')
          .max(20, 'max 20'),
        password: yup.string()
          .required('No password provided.')
          .min(4, 'Password is too short - should be 4 chars minimum.'),
      })}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;
        return (
          <form className="p-3" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Ваш ник</label>
              <input
                name="username"
                type="text"
                id="username"
                placeholder="Enter your username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-control ${(errorMessage || (errors.username && touched.username)) && 'is-invalid'}`}
              />
              {(errorMessage || (errors.username && touched.username)) && (
                <div className="invalid-feedback">{errors.username || errorMessage}</div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Пароль</label>
              <input
                name="password"
                type="password"
                id="password"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-control ${(errorMessage || (errors.password && touched.password)) && 'is-invalid'}`}
              />
              {(errorMessage || (errors.password && touched.password)) && (
                <div className="invalid-feedback">{errors.password || errorMessage}</div>
              )}
            </div>
            <button type="submit" className="w-100 mb-3 btn btn-outline-primary" disabled={isSubmitting}>
              Войти
            </button>
            <div className="d-flex flex-column align-items-center">
              <span className="small mb-2">Нет аккаунта?</span>
              <a href="/signup">Регистрация</a>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

const Login = () => {
  const auth = useContext(authContext);
  const userId = JSON.parse(localStorage.getItem('userId'));

  useEffect(() => {
    if (userId && userId.token) {
      auth.logIn();
    }
  });

  if (auth.loggedIn) {
    return <Redirect to="/" />; // TODO
  }

  console.log(auth);
  return (
    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
        <div className="col-sm-4">
          <ValidatedLoginForm auth={auth} />
        </div>
      </div>
    </div>
  );
};

export default Login;

ValidatedLoginForm.propTypes = {
  auth: PropTypes.object,
};
