# Generated by Django 4.2.7 on 2024-02-07 10:11

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('organizer', '0008_alter_events_latitude_alter_events_longitude'),
        ('chat', '0004_pendingchat'),
    ]

    operations = [
        migrations.AddField(
            model_name='pendingchat',
            name='event',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='organizer.events'),
        ),
        migrations.AddField(
            model_name='pendingchat',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_chats', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='pendingchat',
            name='organizer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='organizer_chats', to=settings.AUTH_USER_MODEL),
        ),
    ]