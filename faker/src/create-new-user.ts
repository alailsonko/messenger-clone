import axios, { AxiosError } from 'axios';
import { faker } from '@faker-js/faker';
import https from 'https';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const createUser = async () => {
  try {
    const uuid = crypto.randomUUID();

    const user = {
      email: uuid + faker.internet.email(),
      username: faker.internet.userName() + uuid,
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };

    await axios.post('https://localhost:4000/users', user, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });


  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      fs.writeFileSync(path.join(__dirname, `${Date.now()}.txt`), JSON.stringify({
        message: axiosError.message,
        response: axiosError.response?.data,
      }));
    }
  }
};


  (async function createUsersIndefinitely() {
    while (true) {
      const object = Array.from({ length: 275 }, () => createUser());
      const startTime = Date.now(); // Start time
      await Promise.all(object);
      const endTime = Date.now(); // End time
      const timeDiff = (endTime - startTime) / 275; // Time difference in seconds
      console.log(`Sent ${275} requests in ${timeDiff} seconds. Requests per second: ${275 / timeDiff}`);
    }
  })();
