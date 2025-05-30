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
        fields = ['id', 'username', 'email']
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)  # for confirm password

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        return user