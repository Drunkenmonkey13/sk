from django.contrib.auth.models import AbstractUser
from django.db import models
import os
from django.utils.deconstruct import deconstructible
from .storage import UserFileSystemStorage
from django.conf import settings

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True) 
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

@deconstructible
class UploadToUserFolderWithConflictResolution:
    def __init__(self, base_path='uploads'):
        self.base_path = base_path

    def __call__(self, instance, filename):
        import re

        def strip_trailing_number(name):
            return re.sub(r'(\(\d+\)|\d+)$', '', name)

        original_name, ext = os.path.splitext(filename)
        base_name = strip_trailing_number(original_name)

        user_folder = f'{self.base_path}/user_{instance.uploaded_by.id}'
        existing_files = instance.__class__.objects.filter(uploaded_by=instance.uploaded_by)

        existing_names = {
            os.path.basename(obj.file.name)
            for obj in existing_files
            if obj.file.name.startswith(user_folder)
        }

        candidate = f"{base_name}{ext}"
        counter = 1

        while candidate in existing_names:
            candidate = f"{base_name}({counter}){ext}"
            counter += 1

        return f"{user_folder}/{candidate}"

user_storage = UserFileSystemStorage()
class FileUpload(models.Model):
    CATEGORY_CHOICES = [
        ('image', 'Image'),
        ('document', 'Document'),
        ('video', 'Video'),
        ('other', 'Other'),
    ]

    uploaded_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    file = models.FileField(
        upload_to=UploadToUserFolderWithConflictResolution(),
        storage=user_storage
    )
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    upload_date = models.DateTimeField(auto_now_add=True)

    @property
    def filename(self):
        return os.path.basename(self.file.name)

    @property
    def file_type(self):
        return self.filename.split('.')[-1].lower()

    @property
    def file_size(self):
        return self.file.size
