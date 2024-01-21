from django.urls import path
from .views import  *

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [

  path('user/register/', UserRegisterAPI.as_view()),
  # path('user/login/', UserLoginAPI.as_view()),
  path('user/', UserViewAPI.as_view()),
  path('admin/', AdminViewAPI.as_view()),
  # path('user/logout/', UserLogoutAPI.as_view()),
  # path('admin/logout/', AdminLogoutAPI.as_view()),
  path('organizer/register/', OrganizerRegisterAPI.as_view()),
  # path('organizer/login/', OrganizerLoginAPI.as_view()),
  path('organizer/', OrganizerViewAPI.as_view()),
  # path('organizer/logout/', UserLogoutAPI.as_view()),
  # path('admin/login/', AdminLoginAPI.as_view()),
  path('verify-otp/', VerifyOTP.as_view()),
  path('forgot-password/', ResetPasswordView.as_view()),
  path('password-reset/<uidb64>/<token>/', PasswordTokenCheckAPI.as_view(), name='password-reset-confirm'),
  path('set-password/', SetNewPasswordAPIView.as_view()),
  path('user-list/', UserListAPI.as_view()),
  path('organizer-list/', OrganizerListAPI.as_view()),
  path('user-organizer-block/<int:user_id>/', UserOrganizerBlockAPI.as_view()),


  path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
  path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]