# Generated by Django 4.2.7 on 2024-01-23 10:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('organizer', '0008_alter_events_latitude_alter_events_longitude'),
        ('payment', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('numTickets', models.PositiveIntegerField()),
                ('totalPrice', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('visitor_names', models.JSONField()),
                ('is_paid', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=False)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='organizer.events')),
            ],
        ),
        migrations.DeleteModel(
            name='Booking',
        ),
    ]
