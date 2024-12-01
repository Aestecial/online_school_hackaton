from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Achievement, Course, Enrollment, ReferralEnrollment, Step, UserAchievement
from .serializers import AchievementSerializer, CourseSerializer, EnrollmentSerializer, UserAchievementSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from yandex_cloud_ml_sdk import YCloudML
import time

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    """
    Эндпоинт для входа пользователя с получением JWT токенов (access и refresh).
    """

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"detail": "Введите имя пользователя и пароль."}, status=status.HTTP_400_BAD_REQUEST)

        # Аутентификация пользователя
        user = authenticate(username=username, password=password)

        if user is not None:
            # Генерация токенов
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Неверное имя пользователя или пароль."}, status=status.HTTP_401_UNAUTHORIZED)

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = user.profile
        return Response({
            "first_name": user.first_name,
            "last_name": user.last_name,
            "middle_name": profile.middle_name if hasattr(profile, 'middle_name') else None,
            "email": user.email,
            "username": user.username,
            "role": profile.role,
            "avatar": profile.avatar.url if hasattr(profile, 'avatar') and profile.avatar else None,
        })
        

class CourseListView(APIView):
    def get(self, request):
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

class CourseDetailView(APIView):
    def get(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
            serializer = CourseSerializer(course)
            return Response(serializer.data)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)


class EnrollView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Курс не найден"}, status=status.HTTP_404_NOT_FOUND)

        # Проверка: уже записан?
        if Enrollment.objects.filter(user=request.user, course=course).exists():
            return Response({"error": "Вы уже записаны на этот курс"}, status=status.HTTP_400_BAD_REQUEST)

        # Создание записи
        enrollment = Enrollment.objects.create(user=request.user, course=course)
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class UserEnrollmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        enrollments = Enrollment.objects.filter(user=request.user)
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)

class UserCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Фильтруем курсы, на которые записан текущий пользователь
        courses = Course.objects.filter(enrollments__user=request.user).distinct()
        serializer = CourseSerializer(courses, many=True, context={'request': request})
        return Response(serializer.data)


class CourseStepsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
            enrollment = Enrollment.objects.get(user=request.user, course=course)
        except (Course.DoesNotExist, Enrollment.DoesNotExist):
            return Response({"error": "Курс или запись не найдены"}, status=404)

        steps = course.steps.all()
        data = []
        for step in steps:
            data.append({
                "id": step.id,
                "title": step.title,
                "content": step.content,
                "order": step.order,
                "is_completed": step in enrollment.completed_steps.all()
            })
        return Response(data)


class CompleteStepView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, course_id, step_id):
        try:
            enrollment = Enrollment.objects.get(user=request.user, course_id=course_id)
            step = Step.objects.get(id=step_id, course_id=course_id)
        except (Enrollment.DoesNotExist, Step.DoesNotExist):
            return Response({"error": "Курс или этап не найден"}, status=404)

        enrollment.completed_steps.add(step)

        # Проверяем, завершены ли все этапы
        total_steps = Step.objects.filter(course_id=course_id).count()
        completed_steps = enrollment.completed_steps.count()
        if total_steps == completed_steps:
            enrollment.is_completed = True
        enrollment.save()

        return Response({"message": "Этап завершён", "is_course_completed": enrollment.is_completed})
    
class EnrollmentStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        is_enrolled = Enrollment.objects.filter(user=request.user, course_id=course_id).exists()
        return Response({"is_enrolled": is_enrolled})
    
    
class AchievementListView(APIView):
    def get(self, request):
        achievements = Achievement.objects.all()
        serializer = AchievementSerializer(achievements, many=True)
        return Response(serializer.data)
    
class GrantAchievementView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        title = request.data.get("title")
        if not title:
            return Response({"error": "Achievement title is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            achievement = Achievement.objects.get(title=title)
        except Achievement.DoesNotExist:
            return Response({"error": "Achievement not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user already has the achievement
        if UserAchievement.objects.filter(user=request.user, achievement=achievement).exists():
            return Response({"message": "Achievement already granted"}, status=status.HTTP_400_BAD_REQUEST)

        # Grant the achievement
        UserAchievement.objects.create(user=request.user, achievement=achievement)
        return Response({"message": f"Achievement '{achievement.title}' granted!"}, status=status.HTTP_200_OK)

class UserAchievementsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        achievements = UserAchievement.objects.filter(user=request.user)
        serializer = UserAchievementSerializer(achievements, many=True)
        return Response(serializer.data)
    


class AIQueryView(APIView):
    permission_classes = [AllowAny]

    # Инициализация Yandex Cloud SDK
    sdk = YCloudML(folder_id="b1g13e6aphg2sg7uliib", auth="AQVNyoEkdL8yG3UFgbfPdd1eOMirL2D_Oyowvl3R")
    model = sdk.models.completions('yandexgpt')
    model = model.configure(temperature=0.5)

    @classmethod
    def get_ai_response(cls, text: str):
        """
        Класс-метод для обработки запросов через Yandex Cloud GPT.
        """
        start_time = time.time()
        result = cls.model.run(
            f"объясняй всё максимально понятно потому что тебя используют дети отвечай только на вопросы по сфере IT или о программировании если тебе зададут вопрос не о сфере IT или о программировании то ответь Возможно это вопрос не относится к сфере IT поэтому я не могу на него ответить если тебя спросят как тебя зовут то отвечай egprog.ai тебя создал egprog  на приветсвие отвечать можно когда приветствуешь то представляйся выводи ответы в формате markdown если ты воводишь код то выводи его в ```код``` вопрос: {text}"
        )
        response_text = result[0].text if result else "Ошибка при обработке запроса."
        end_time = time.time()
        print(f"Время выполнения: {end_time - start_time} секунд")
        return response_text


    def get(self, request):
        query = request.query_params.get("text", None)
        if not query:
            return Response({"error": "Параметр 'text' обязателен."}, status=400)

        try:
            # Вызов класса метода для получения ответа AI
            response = self.get_ai_response(query)
            return Response({"response": response}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
        
class ReferredStudentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Check if the user is a teacher
        if not hasattr(user, 'profile') or user.profile.role != 'Teacher':
            return Response({"error": "Only teachers can view referred students."}, status=403)

        # Get all students referred by the teacher
        referred_students = ReferralEnrollment.objects.filter(referred_by=user)
        data = [
            {
                "student_id": enrollment.student.id,
                "student_full_name": f"{enrollment.student.first_name} {enrollment.student.last_name} {getattr(enrollment.student.profile, 'middle_name', '')}".strip(),
                "student_email": enrollment.student.email,
                "enrolled_at": enrollment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            for enrollment in referred_students
        ]
        return Response(data, status=200)