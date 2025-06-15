from rest_framework import serializers
from .models import FileUpload, CustomUser
from django.contrib.auth.password_validation import validate_password
class FileUploadSerializer(serializers.ModelSerializer):
    filename = serializers.ReadOnlyField()
    file_type = serializers.ReadOnlyField()
    file_size = serializers.ReadOnlyField()
    upload_date = serializers.ReadOnlyField()
    class Meta:
        model = FileUpload
        fields = ['id', 'file', 'category', 'filename', 'file_type', 'file_size', 'upload_date']
        read_only_fields = ['upload_date', 'uploaded_by']

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email'],

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password','phone']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email','username', 'phone'] 

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'phone']  # No username or password here
