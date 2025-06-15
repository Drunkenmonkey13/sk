from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import FileDetailView, FileUploadView, FileListView, PortalDetailsView, RenameUserFileView, UserProfileView
from .views import RegisterView
from .views import FileDeleteView

urlpatterns = [
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/upload/', FileUploadView.as_view(), name='file-upload'),
    path('api/files/', FileListView.as_view(), name='file-list'),
    path('api/rename-file/', RenameUserFileView.as_view(), name='rename-file'),
    path('api/portal-details/', PortalDetailsView.as_view(), name='portal-details'),
    path('api/profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/signup/', RegisterView.as_view(), name='register'),
    path('api/files/<int:pk>/delete/', FileDeleteView.as_view(), name='file-delete'),

]
