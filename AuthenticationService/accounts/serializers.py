from .models import MyUser
from rest_framework import serializers

#User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ('id', 'username', 'email')

#Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = MyUser.objects.create_user(validated_data['username'], 
        validated_data['email'], validated_data['password'])
        
        user.first_name = validated_data['first_name']
        user.last_name = validated_data['last_name']

        return user