import { join } from 'path';

export enum ProtobufServiceNames {
  ORCHESTRATOR = 'OrchestratorService',
}

export enum OrchestratorMethods {
  SIGN_UP = 'signUp',
}

export const protobufPackages = {
  orchestrator: {
    name: 'orchestrator',
    filePath: join(__dirname, `./../../../../rpc/proto/orchestrator/orchestrator.proto`),
    service: ProtobufServiceNames.ORCHESTRATOR,
    methods: {
      signUp: OrchestratorMethods.SIGN_UP,
    },
  },
};
