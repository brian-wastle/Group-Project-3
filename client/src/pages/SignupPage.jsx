import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Auth from '../utils/auth';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';


const SignupForm = () => {
  // set initial form state
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  // set state for form validation
  const [validated] = useState(false);
  // set state for alert
  const [showAlert, setShowAlert] = useState(false);
  const [addUser, { error, data }] = useMutation(ADD_USER);

  const [isOrg, setIsOrg] = useState(false);

  const toggleOrg = () => {
    setIsOrg(!isOrg);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      Auth.login(data.addUser.token);


    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <div className='md:container 2xl:w-1/2 xl:w-3/4 p-8 m-8 mx-auto bg-light-2 drop-shadow-sm md:rounded-lg'>
      <label>
        Are you an organization?
        <input
          type="checkbox"
          checked={isOrg}
          onChange={toggleOrg}
        />
      </label>

        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
            Something went wrong with your signup!
          </Alert>

          <Form.Group className='mb-3'>
            <Form.Label htmlFor='username'>Organization Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Your organization'
              name='username'
              onChange={handleInputChange}
              value={userFormData.username}
              required
            />
            <Form.Control.Feedback type='invalid'>Organization Name is required!</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label htmlFor='email'>Email</Form.Label>
            <Form.Control
              type='email'
              placeholder='Your email address'
              name='email'
              onChange={handleInputChange}
              value={userFormData.email}
              required
            />
            <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label htmlFor='password'>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Your password'
              name='password'
              onChange={handleInputChange}
              value={userFormData.password}
              required
            />
            <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
          </Form.Group>
          <Button
            disabled={!(userFormData.username && userFormData.email && userFormData.password)}
            type='submit'
            variant='success'>
            Submit
          </Button>
        </Form>
        <Link to="/login"><h1
          className='text-lg text-gray-400 text-center pt-2'
        >Already have an account?</h1></Link>
      </div>
    </>
  );
};

export default SignupForm;
