from rest_framework import generics, permissions
from .models import FileUpload, CustomUser
from .serializers import FileUploadSerializer, CustomUserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count

class FileUploadView(generics.CreateAPIView):
    serializer_class = FileUploadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)



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
    

class siguupview(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if serializer.is_valid():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, email=email)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)


