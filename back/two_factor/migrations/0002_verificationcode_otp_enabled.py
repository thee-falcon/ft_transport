# Generated by Django 5.2b1 on 2025-03-21 23:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('two_factor', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='verificationcode',
            name='otp_enabled',
            field=models.BooleanField(default=False),
        ),
    ]
