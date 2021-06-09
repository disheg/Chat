/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import useAuth from './hooks/index.js';
import Header from './Header.jsx';

const ValidatedLoginForm = () => {
  const [isAuthFailed, setIsAuthFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const auth = useAuth();
  const history = useHistory();
  if (isAuthFailed) {
    setErrorMessage('Неверные имя пользователя или пароль');
    setIsAuthFailed('');
  }
  console.log('Error Message', errorMessage);
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={(values, { setSubmitting }) => {
        axios.post('/api/v1/login', values)
          .then((data) => {
            console.log('User Log In DATA', data);
            auth.logIn(JSON.stringify(data.data));
            history.replace('/');
          })
          .catch((err) => {
            console.log('User Log In FAILED');
            console.log('err', err);
            setIsAuthFailed(true);
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
              <label className="form-label" htmlFor="username">
                Ваш ник
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
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </label>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Пароль
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
              </label>
            </div>
            <button type="submit" className="w-100 mb-3 btn btn-outline-primary" disabled={isSubmitting}>
              Войти
            </button>
            <div className="d-flex flex-column align-items-center">
              <span className="small mb-2">Нет аккаунта?</span>
              <Link to="/signup">Регистрация</Link>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

const Login = () => (
  <>
    <Header />
    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
        <div className="col-sm-4">
          <ValidatedLoginForm />
        </div>
      </div>
    </div>
  </>
);

export default Login;
