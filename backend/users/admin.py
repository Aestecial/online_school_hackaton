from django.contrib import admin
from .models import Profile, Course, Enrollment, Step, Achievement, UserAchievement, ReferralCode, ReferralEnrollment

# Register your models here.
admin.site.register(Profile)
admin.site.register(Course)
admin.site.register(Enrollment)
admin.site.register(Step)
admin.site.register(Achievement)
admin.site.register(UserAchievement)
admin.site.register(ReferralCode)
admin.site.register(ReferralEnrollment)