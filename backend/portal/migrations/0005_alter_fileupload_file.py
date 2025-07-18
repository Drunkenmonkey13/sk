# Generated by Django 5.2 on 2025-06-07 07:02

import portal.models
import portal.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0004_alter_fileupload_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fileupload',
            name='file',
            field=models.FileField(storage=portal.storage.UserFileSystemStorage(), upload_to=portal.models.UploadToUserFolderWithConflictResolution()),
        ),
    ]
