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

type RegisterInputs = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const Register = () => {
  const mutation = useMutation({
    mutationFn: async (data: RegisterInputs) => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL!}/users`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
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
