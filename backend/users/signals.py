from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Achievement, Profile, ReferralCode, ReferralEnrollment, UserAchievement, Enrollment

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:  # Создаём профиль только для новых пользователей
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

@receiver(post_save, sender=User)
def assign_registration_achievement(sender, instance, created, **kwargs):
    """
    Signal to assign the "Registration" achievement when a new user is created.
    """
    if created:
        try:
            # Fetch the existing "Регистрация" achievement
            registration_achievement = Achievement.objects.get(title="Регистрация")
            
            # Assign the achievement to the newly created user
            UserAchievement.objects.create(
                user=instance,
                achievement=registration_achievement
            )
            print(f"Assigned 'Регистрация' achievement to user {instance.username}.")
        except Achievement.DoesNotExist:
            print("The 'Регистрация' achievement does not exist. Please create it in the database.")
        except Exception as e:
            print(f"Error assigning 'Регистрация' achievement: {e}")
            
            
@receiver(post_save, sender=Enrollment)
def assign_course_completion_achievement(sender, instance, created, **kwargs):
    """
    Assign the "Пройти курс" achievement if the user has completed at least one course.
    """
    if instance.is_completed:  # Check if the course was completed
        try:
            # Count completed courses
            completed_courses = Enrollment.objects.filter(user=instance.user, is_completed=True).count()

            # Check if the user has the "Пройти курс" achievement
            course_achievement = Achievement.objects.get(title="Пройти курс")
            user_has_achievement = UserAchievement.objects.filter(user=instance.user, achievement=course_achievement).exists()

            if completed_courses >= 1 and not user_has_achievement:
                UserAchievement.objects.create(user=instance.user, achievement=course_achievement)
                print(f"'Пройти курс' achievement assigned to {instance.user.username}.")
        except Achievement.DoesNotExist:
            print("Achievement 'Пройти курс' does not exist.")
        except Exception as e:
            print(f"Error assigning 'Пройти курс' achievement: {e}")
            
            
@receiver(post_save, sender=User)
def handle_referral_code(sender, instance, created, **kwargs):
    """
    Signal to handle referral code during user registration.
    """
    if created and hasattr(instance, 'referral_code'):  # Проверяем, есть ли у пользователя реферальный код
        try:
            # Получаем реферальный код из профиля или другой логики
            referral_code = ReferralCode.objects.get(code=instance.referral_code)
            
            # Создаем запись о реферальной регистрации
            ReferralEnrollment.objects.create(
                referred_by=referral_code.teacher,  # Учитель, владеющий этим кодом
                student=instance  # Новый пользователь
            )
            print(f"Referral enrollment created for user {instance.username} with code {referral_code.code}.")
        except ReferralCode.DoesNotExist:
            print(f"Referral code {instance.referral_code} does not exist.")
        except Exception as e:
            print(f"Error handling referral code for user {instance.username}: {e}")