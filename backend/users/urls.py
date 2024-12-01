from django.urls import path
from .views import (
    AIQueryView,
    
    LoginView,
    ReferredStudentsView, 
    RegisterView, 
    UserInfoView,
    
    CourseListView,
    CourseDetailView,
    
    EnrollView,
    UserEnrollmentsView,
    
    UserCoursesView,
    CourseStepsView,
    CompleteStepView,
    EnrollmentStatusView,
    
    AchievementListView,
    GrantAchievementView,
    UserAchievementsView,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user-info/', UserInfoView.as_view(), name='user_info'),
    
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    path('courses/', CourseListView.as_view(), name='course_list'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course_detail'),
    path('courses/<int:course_id>/enroll/', EnrollView.as_view(), name='enroll'),
    path('my-enrollments/', UserEnrollmentsView.as_view(), name='user_enrollments'),
    path("user/courses/", UserCoursesView.as_view(), name="user_courses"),
    path('courses/<int:course_id>/steps/', CourseStepsView.as_view(), name='course_steps'),
    path('courses/<int:course_id>/steps/<int:step_id>/complete/', CompleteStepView.as_view(), name='complete_step'),
    path('courses/<int:course_id>/status/', EnrollmentStatusView.as_view(), name='enrollment_status'),
    
    path('achievements/', AchievementListView.as_view(), name='achievement-list'),
    path('achievements/grant/', GrantAchievementView.as_view(), name='grant-achievement'),
    path('achievements/user/', UserAchievementsView.as_view(), name='user-achievements'),
    
    path('ai/', AIQueryView.as_view(), name='ai-query'),
    
    path('referrals/', ReferredStudentsView.as_view(), name='referred-students'),
]