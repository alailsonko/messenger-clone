#!/bin/bash

protoc -I=proto --plugin=protoc-gen-ts=$(which protoc-gen-ts) --ts_out=service=grpc-web:gen/ts proto/base/v1/*.proto

mv gen/ts/ src/infra/permify/generated/
