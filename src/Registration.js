import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import useAuth from './hooks/index.js';
import { Redirect } from 'react-router';

const ValidatedRegistrationForm = ({ auth }) => {
  const [loginError, setLoginError] = useState('');
  const [regError, setRegError] = useState('');
  console.log(loginError)
  if (auth.loggedIn) {
    return <Redirect to="/" />;
  }
  if (loginError) {
    //err.response.data.message || err.message
    console.log(loginError.response.data)
    const statusCode = loginError.response.data.statusCode;
    if (statusCode === 409) {
      setRegError('User is already');
      setLoginError('');
    }
  }
return (
  <Formik
    initialValues={{ username: "", password: "", confirmPassword: "" }}
    onSubmit={({ username, password }, { setSubmitting }) => {
      axios.post('/api/v1/signup', { username, password })
      .then((response) => {
        console.log(response)
        localStorage.setItem('userId', JSON.stringify(response.data));
        auth.logIn();
      })
      .catch((err) => {
        console.log('err', err)
        setLoginError(err);
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
        .min(4, "Password is too short - should be 4 chars minimum."),
      confirmPassword: yup.string()
        .required("required")
        .oneOf([yup.ref('password'), null], 'Passwords must match')
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
              className={`form-control ${(regError || (errors.password && touched.password)) && "is-invalid"}`}
            />
            {errors.username && touched.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>
          <div className="form-group">
            <label className='form-label' htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${(regError || (errors.password && touched.password)) && "is-invalid"}`}
            />
            {(loginError || (errors.password && touched.password)) && (
              <div className="invalid-feedback">{errors.password || loginError}</div>
            )}
          </div>
          <div className="form-group">
            <label className='form-label' htmlFor="confirmPassword">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${(regError || (errors.confirmPassword && touched.confirmPassword)) && "is-invalid"}`}
            />
            {(regError || (errors.confirmPassword && touched.confirmPassword)) && (
              <div className="invalid-feedback">{errors.confirmPassword || regError}</div>
            )}
          </div>
          <button type="submit" className="w-100 mb-3 btn btn-outline-primary" disabled={isSubmitting}>
                  Войти
          </button>
        </form>
      );
    }}
  </Formik>
)};

const Registration = () => {
  const auth = useAuth();
  return (
    <div className="row justify-content-center pt-5">
      <div className="col-sm-4">
        <ValidatedRegistrationForm auth={auth} />
      </div>
    </div>
  )
};

export default Registration;