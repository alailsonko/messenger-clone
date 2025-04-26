package main

import (
	"log"

	users_pb "github.com/alailsonko/messenger-clone/modules/shared/protobuf"
)

func main() {
	log.Println("Hello, World!")
	req := users_pb.ListUsersRequest{
		Page:     1,
		PageSize: 10,
	}
	log.Printf("Request created: %+v", req)
}
