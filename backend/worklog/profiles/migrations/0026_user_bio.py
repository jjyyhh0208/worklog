# Generated by Django 5.0.6 on 2024-08-10 02:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0025_alter_user_gpt_summarized_personality'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='bio',
            field=models.TextField(blank=True, max_length=500),
        ),
    ]