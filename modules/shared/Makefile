.PHONY: proto proto-local clean

proto-builder:
	docker build -t protoc-builder -f Dockerfile.protoc .

proto-generate:
	docker run --rm -v $(PWD):/proto protoc-builder --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative protobuf/*.proto

tidy:
	go mod tidy

# Generate protobuf files using Docker
proto: clean proto-builder proto-generate tidy
	@echo "Protobuf files generated successfully."

# Generate protobuf files locally (requires tools to be installed)
proto-local:
	protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative modules/shared/protobuf/*.proto

# Clean generated files
clean:
	rm -f protobuf/*.pb.go