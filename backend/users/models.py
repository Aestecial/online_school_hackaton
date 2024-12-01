from django.contrib.auth.models import User
from django.db import models

# Добавление пользовательских ролей
class Role(models.TextChoices):
    STUDENT = 'Student', 'Student'
    TEACHER = 'Teacher', 'Teacher'

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    middle_name = models.CharField(max_length=150, blank=True, null=True)
    avatar = models.ImageField(
        upload_to='avatars/', 
        blank=True, 
        null=True, 
        default='avatars/default_avatar.jpg'
    )
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.STUDENT
    )
    referral_code = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return self.user.username

class ReferralCode(models.Model):
    code = models.CharField(max_length=10, unique=True)  # Уникальный реферальный код
    teacher = models.OneToOneField(User, on_delete=models.CASCADE, related_name='referral_code')  # Учитель

    def __str__(self):
        return f"Referral Code: {self.code} by {self.teacher.username}"

class ReferralEnrollment(models.Model):
    referred_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='referred_students')  # Учитель
    student = models.OneToOneField(User, on_delete=models.CASCADE, related_name='referred_by_teacher')  # Ученик
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} referred by {self.referred_by.username}"

class Course(models.Model):
    title = models.CharField(max_length=255)
    short_description = models.TextField()
    description = models.TextField()
    image = models.ImageField(upload_to='course_images/', blank=True, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_courses')

    def __str__(self):
        return self.title

class Step(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()  # Содержимое этапа (Markdown/HTML)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='steps')
    order = models.PositiveIntegerField()  # Порядок этапов

    class Meta:
        ordering = ['order']  # Этапы сортируются по порядку

    def __str__(self):
        return f"{self.order}. {self.title}"

class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    completed_steps = models.ManyToManyField(Step, blank=True, related_name="completed_by_users")
    enrolled_at = models.DateTimeField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)  # Завершён ли курс

    def __str__(self):
        return f"{self.user.first_name} записан на курс {self.course.title}"

class Achievement(models.Model):
    title = models.CharField(max_length=255)  # Name of the achievement
    description = models.TextField()  # Description of the achievement
    image = models.ImageField(upload_to='achievement_images/', null=True, blank=True)  # Achievement icon

    def __str__(self):
        return self.title

class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="achievements")
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name="users")
    unlocked_at = models.DateTimeField(auto_now_add=True)  # When the achievement was unlocked

    class Meta:
        unique_together = ('user', 'achievement')  # Prevent duplicate achievements for a user

    def __str__(self):
        return f"{self.user.username} unlocked {self.achievement.title}"
