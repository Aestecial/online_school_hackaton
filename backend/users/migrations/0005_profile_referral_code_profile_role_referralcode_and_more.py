# Generated by Django 5.1.3 on 2024-12-01 01:19

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_achievement_userachievement'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='referral_code',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='role',
            field=models.CharField(choices=[('Student', 'Student'), ('Teacher', 'Teacher')], default='Student', max_length=10),
        ),
        migrations.CreateModel(
            name='ReferralCode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=10, unique=True)),
                ('teacher', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='referral_code', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ReferralEnrollment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('referred_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='referred_students', to=settings.AUTH_USER_MODEL)),
                ('student', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='referred_by_teacher', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]