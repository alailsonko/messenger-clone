import {
  Box,
  Container,
  Link,
  Stack,
  TextField,
  FormGroup,
  Button,
} from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { teal } from '@mui/material/colors';
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { AppContext } from '../../contexts/app-context';
import { CloudUpload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

type RegisterInputs = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar: File[];
};

export const Register = () => {
  const navigate = useNavigate();
  const appContext = React.useContext(AppContext);

  const mutation = useMutation({
    mutationFn: async (data: RegisterInputs) => {
      const response = await appContext.api.users.usersControllerCreateUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      });

      await appContext.login({
        email: data.email,
        password: data.password,
      });

      return response.data;
    },
    onSuccess(data, variables, context) {
      navigate('/');

      console.log('Success', data);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInputs>();
  const onSubmit: SubmitHandler<RegisterInputs> = (data) =>
    mutation.mutate(data);

  return (
    <React.Fragment>
      <Container maxWidth="sm">
        <Box
          sx={{
            borderRadius: 2,
            borderWidth: 3,
            borderStyle: 'solid',
            borderColor: teal[200],
            padding: 2,
          }}
        >
          <Stack>
            <h1>Register</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <TextField
                  required
                  id="username"
                  type="text"
                  label="Username"
                  autoComplete="username"
                  variant="standard"
                  {...register('username', {
                    required: true,
                    maxLength: 20,
                    validate: (value) => {
                      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
                      return slugRegex.test(value);
                    },
                  })}
                />
                <TextField
                  required
                  id="firstName"
                  type="text"
                  label="First Name"
                  autoComplete="firstname"
                  variant="standard"
                  {...register('firstName', {
                    required: true,
                  })}
                />
                <TextField
                  required
                  id="lastName"
                  type="text"
                  label="Last Name"
                  autoComplete="lastname"
                  variant="standard"
                  {...register('lastName', {
                    required: true,
                  })}
                />
                <TextField
                  required
                  id="email"
                  type="email"
                  label="Email"
                  autoComplete="email"
                  variant="standard"
                  {...register('email', {
                    required: true,
                  })}
                />
                <TextField
                  required
                  id="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  variant="standard"
                  {...register('password', {
                    required: true,
                  })}
                />
                <TextField
                  required
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  autoComplete="current-password"
                  variant="standard"
                  {...register('confirmPassword', {
                    required: true,
                    validate: (value) => value === watch('password'),
                  })}
                />
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </FormGroup>
            </form>
            <Link href="/login" underline="hover">
              Already have an account?
            </Link>
          </Stack>
        </Box>
      </Container>
    </React.Fragment>
  );
};
