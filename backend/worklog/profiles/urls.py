from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileView, UserWorkStyleView, UserInterestView, 
    UserGenderNameAgeView, WorkStyleViewSet, InterestViewSet, 
    UniqueIdCheck, ShortQuestionViewSet, LongQuestionViewSet,
    QuestionAnswerViewSet, ScoreViewSet, FeedbackViewSet, 
    UserLongQuestionsView, FeedbackByUserView
    )


router = DefaultRouter()
router.register(r'workstyles', WorkStyleViewSet, basename='workstyle')
router.register(r'interests', InterestViewSet, basename='interest')
router.register(r'short-questions', ShortQuestionViewSet, basename='short-question')
router.register(r'long-questions', LongQuestionViewSet)
router.register(r'feedbacks', FeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    path('user/view/', UserProfileView.as_view(), name='user-profile-view'),
    path('user/view/long-question/<username>/', UserLongQuestionsView.as_view(), name='longquestions-by-user'), # 유저에 맞는 질문을 반환하는 엔드포인트
    path('user/view/feedback/<username>/', FeedbackByUserView.as_view(), name='feedback-by-user'), # 유저에 맞는 피드백을 반환하는 엔드포인트

    path('user/set/work-style/', UserWorkStyleView.as_view(), name='user-work-style-update'),  # 유저의 업무 성향, 관심 직종 설정 엔드포인트
    path('user/set/interest/', UserInterestView.as_view(), name='user-work-interest-update'),  # 유저의 업무 성향, 관심 직종 설정 엔드포인트
    path('user/set/basic-info/', UserGenderNameAgeView.as_view(), name='user-info-update'),  # 유저의 이름, 성별, 나이 설정 엔드포인트
    path('auth/', include('dj_rest_auth.urls')),  # 로그인, 로그아웃, 비밀번호 변경, 비밀번호 초기화 등을 위한 엔드포인트 기본 제공 기능
    path('auth/registration/', include('dj_rest_auth.registration.urls')),  # 회원가입을 위한 엔드포인트 기본 제공 기능
    path('auth/check-username/', UniqueIdCheck.as_view(), name='check-username'), # 유저 이름 중복 검사
]
