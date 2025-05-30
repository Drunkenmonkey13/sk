from rest_framework import generics, permissions,status
from .models import FileUpload, CustomUser
from .serializers import FileUploadSerializer, CustomUserSerializer
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated
class FileUploadView(generics.CreateAPIView):
 parser_classes = [MultiPartParser, FormParser]
permission_classes = [IsAuthenticated]
def post(self, request, format=None):
    serializer = FileUploadSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(uploaded_by=request.user)
        return Response({'message': 'File uploaded successfully', 'data': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class FileListView(generics.ListAPIView):
    serializer_class = FileUploadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FileUpload.objects.filter(uploaded_by=self.request.user)

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
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = CustomUserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
