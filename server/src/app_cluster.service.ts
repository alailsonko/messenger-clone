import { Injectable } from '@nestjs/common';
import cluster from 'node:cluster';
import * as os from 'node:os';

const numCPUs = os.cpus().length;

@Injectable()
export class AppClusterService {
  constructor() {}
  // eslint-disable-next-line @typescript-eslint/ban-types
  static clusterize(callback: Function): void {
    if (cluster.isPrimary) {
      console.log(`Master server started on ${process.pid}`);
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        console.log(
          `Worker ${worker.process.pid} died, ${code} ${signal}. Restarting`,
        );
        cluster.fork();
      });
    } else {
      console.log(`Cluster server started on ${process.pid}`);
      callback();
    }
  }
}
