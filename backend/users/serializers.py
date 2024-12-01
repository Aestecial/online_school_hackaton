from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Achievement, Course, Enrollment, Profile, Step, UserAchievement, ReferralCode, ReferralEnrollment


class ProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    referral_code = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Profile
        fields = ['middle_name', 'avatar', 'avatar_url', 'referral_code']  # Добавляем поле avatar

    def get_avatar_url(self, obj):
        if obj.avatar:
            return obj.avatar.url  # Возвращаем полный путь к аватару
        return None


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    referral_code = serializers.CharField(write_only=True, required=False)  # Поле для реферального кода (необязательно)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name', 'profile', 'referral_code']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        # Извлекаем данные профиля и реферального кода
        profile_data = validated_data.pop('profile')
        referral_code = profile_data.pop('referral_code', None).upper()

        # Проверяем реферальный код перед созданием пользователя
        if referral_code:
            try:
                referrer = ReferralCode.objects.get(code=referral_code).teacher
            except ReferralCode.DoesNotExist:
                raise serializers.ValidationError({"profile": {"referral_code": "Invalid referral code"}})
        else:
            referrer = None  # Если реферального кода нет, оставляем None

        # Создаём пользователя
        user = User.objects.create_user(**validated_data)

        # Создаём профиль для пользователя
        Profile.objects.update_or_create(user=user, defaults=profile_data)

        # Если есть валидный реферальный код, создаём запись в `ReferralEnrollment`
        if referrer:
            ReferralEnrollment.objects.create(student=user, referred_by=referrer)

        return user



class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ['id', 'title', 'content', 'order']


class CourseSerializer(serializers.ModelSerializer):
    creator_name = serializers.SerializerMethodField()  # Field for the creator's name
    is_completed = serializers.SerializerMethodField()  # Field to check if the course is completed

    class Meta:
        model = Course
        fields = ['id', 'title', 'short_description', 'description', 'image', 'creator_name', 'is_completed']

    def get_creator_name(self, obj):
        if obj.creator.first_name or obj.creator.last_name:
            return f"{obj.creator.first_name} {obj.creator.last_name}".strip()
        return "Неизвестный"

    def get_is_completed(self, obj):
        # Get the request from the context
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Check if the user has completed the course
            enrollment = obj.enrollments.filter(user=request.user).first()
            if enrollment:
                return enrollment.is_completed
        return False


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer()

    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'completed_steps', 'enrolled_at', 'is_completed']


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'title', 'description', 'image']


class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer()

    class Meta:
        model = UserAchievement
        fields = ['id', 'achievement', 'unlocked_at']
