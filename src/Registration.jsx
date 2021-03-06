/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import useAuth from './hooks/index.js';
import Header from './Header.jsx';

const ValidatedRegistrationForm = ({ auth }) => {
  const [msgError, setMsgError] = useState('');
  const [regError, setRegError] = useState(null);
  const history = useHistory();
  console.log(regError);
  if (regError) {
    // err.response.data.message || err.message
    console.log(regError.response.data);
    const { statusCode } = regError.response.data.statusCode;
    if (statusCode === 409) {
      setMsgError('User is already');
      setRegError(null);
    }
  }
  return (
    <Formik
      initialValues={{ username: '', password: '', confirmPassword: '' }}
      onSubmit={({ username, password }, { setSubmitting }) => {
        axios.post('/api/v1/signup', { username, password })
          .then((response) => {
            console.log('User Reg In DATA', response.data);
            auth.logIn(JSON.stringify(response.data));
            console.log('REG USER COMPLITED');
            history.replace('/');
          })
          .catch((err) => {
            console.log('User Log In FAILED');
            console.log('err', err);
            setRegError(err);
            setSubmitting(false);
          });
      }}
      validationSchema={yup.object().shape({
        username: yup.string()
          .required('Обязательное поле')
          .min(3, 'От 3 до 20 символов')
          .max(20, 'От 3 до 20 символов'),
        password: yup.string()
          .required('Обязательное поле.')
          .min(6, 'Не менее 6 символов'),
        confirmPassword: yup.string()
          .required('Пароли должны совпадать')
          .oneOf([yup.ref('password'), null], 'Пароли должны совпадать'),
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
        console.log(errors);
        return (
          <form className="p-3" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                Имя пользователя
                <input
                  name="username"
                  type="text"
                  id="username"
                  placeholder="От 3 до 20 символов"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${(msgError || (errors.password && touched.password)) && 'is-invalid'}`}
                />
                {errors.username && touched.username && (
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
                  placeholder="Не менее 6 символов"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${(msgError || (errors.password && touched.password)) && 'is-invalid'}`}
                />
                {(msgError || (errors.password && touched.password)) && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </label>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Подтвердите пароль
                <input
                  name="confirmPassword"
                  type="password"
                  id="confirmPassword"
                  placeholder="Пароли должны совпадать"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${(msgError || (errors.confirmPassword && touched.confirmPassword)) && 'is-invalid'}`}
                />
                {(msgError || (errors.confirmPassword && touched.confirmPassword)) && (
                  <div className="invalid-feedback">{errors.confirmPassword || msgError}</div>
                )}
              </label>
            </div>
            <button type="submit" className="w-100 mb-3 btn btn-outline-primary" disabled={isSubmitting}>
              Зарегистрироваться
            </button>
          </form>
        );
      }}
    </Formik>
  );
};

const Registration = () => {
  console.log('Path', window.location.href);
  const auth = useAuth();

  return (
    <>
      <Header />
      <div className="row justify-content-center pt-5">
        <div className="col-sm-4">
          <ValidatedRegistrationForm auth={auth} />
        </div>
      </div>
    </>
  );
};

export default Registration;
