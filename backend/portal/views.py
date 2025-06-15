from urllib.parse import urlparse
from rest_framework import generics, permissions,status
from .models import FileUpload, CustomUser
from .serializers import FileUploadSerializer, CustomUserSerializer, UserProfileSerializer, UserProfileUpdateSerializer
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from django.conf import settings


class FileUploadView(generics.CreateAPIView):
    serializer_class = FileUploadSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(uploaded_by=request.user)
            return Response({'message': 'File uploaded successfully', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FileDeleteView(APIView):
    def delete(self, request, pk):
        try:
            file = FileUpload.objects.get(pk=pk)
            file.delete()
            return Response({"message": "File deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except FileUpload.DoesNotExist:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
class FileListView(generics.ListAPIView):
    queryset = FileUpload.objects.all()
    serializer_class = FileUploadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(uploaded_by=self.request.user)

class FileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FileUpload.objects.all()
    serializer_class = FileUploadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(uploaded_by=self.request.user)
    
class PortalDetailsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        all_files = FileUpload.objects.all()

        total_files = all_files.count()
        type_counts = all_files.values('file').annotate(count=Count('file'))
        user_files = FileUpload.objects.filter(uploaded_by=request.user).count()

        return Response({
            'total_files': total_files,
            'file_types': type_counts,
            'files_uploaded_by_you': user_files,
        })

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    def put(self, request):
        serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Profile updated successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RegisterView(APIView):
     def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "success": True,
                "message": "Registration successful",
                "user_id": user.id
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "Registration failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
class RenameUserFileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        file_url = request.data.get("file_url")
        new_name = request.data.get("new_name")

        if not file_url or not new_name:
            return Response({
                "success": False,
                "message": "Missing 'file_url' or 'new_name'."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            parsed_path = urlparse(file_url).path
            relative_path = parsed_path.replace(settings.MEDIA_URL, "")
            file_path = os.path.join(settings.MEDIA_ROOT, relative_path)

            file_obj = FileUpload.objects.get(file=relative_path, uploaded_by=request.user)

            directory = os.path.dirname(file_path)
            ext = os.path.splitext(file_obj.filename)[1]
            new_filename = new_name if new_name.endswith(ext) else new_name + ext
            new_path = os.path.join(directory, new_filename)

            # ❗ Check if a file with the new name already exists
            if os.path.exists(new_path):
                return Response({
                    "success": False,
                    "message": f"A file named '{new_filename}' already exists."
                }, status=status.HTTP_409_CONFLICT)

            os.rename(file_path, new_path)

            new_relative_path = os.path.relpath(new_path, settings.MEDIA_ROOT).replace("\\", "/")
            file_obj.file.name = new_relative_path
            file_obj.save()

            new_url = request.build_absolute_uri(settings.MEDIA_URL + new_relative_path)

            return Response({
                "success": True,
                "message": "File renamed successfully.",
                "new_url": new_url,
                "old_url": file_url
            }, status=status.HTTP_200_OK)

        except FileUpload.DoesNotExist:
            return Response({
                "success": False,
                "message": "File not found or permission denied."
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                "success": False,
                "message": "Rename failed.",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)