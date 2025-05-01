from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import FileUploadView, FileListView, PortalDetailsView, UserProfileView,siguupview

urlpatterns = [
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/upload/', FileUploadView.as_view(), name='file-upload'),
    path('api/files/', FileListView.as_view(), name='file-list'),
    path('api/portal-details/', PortalDetailsView.as_view(), name='portal-details'),
    path('api/profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/signup/', siguupview.as_view(), name='user-signup'),
]
