from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import UserSerializer, RegisterSerializer


#Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        print(serializer)
        user = serializer
        return Response({
            "user": user
        })