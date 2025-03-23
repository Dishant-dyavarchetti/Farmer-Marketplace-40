from django.urls import path
from .views import (
    RegisterFarmerView, RegisterConsumerView,
    LoginView, LogoutView, UserInfoView
)

urlpatterns = [
    path('register/farmer/', RegisterFarmerView.as_view(), name='register-farmer'),
    path('register/consumer/', RegisterConsumerView.as_view(), name='register-consumer'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user-info/', UserInfoView.as_view(), name='user-info'),
] 