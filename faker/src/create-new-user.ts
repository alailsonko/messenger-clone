import axios, { AxiosError } from 'axios';
import { faker } from '@faker-js/faker';
import cluster from 'cluster';
import os from 'os';
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
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
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

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  (async function createUsersIndefinitely() {
    while (true) {
      const promises = [];
      for (let i = 0; i < 250; i++) {
        promises.push(createUser());
      }
      await Promise.all(promises);
    }
  })();
}
