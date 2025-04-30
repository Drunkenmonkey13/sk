from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class FileUpload(models.Model):
    objects = models.Manager()
    uploaded_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    file = models.FileField(upload_to='uploads/')
    upload_date = models.DateTimeField(auto_now_add=True)
    @property
    def filename(self):
        return self.file.name.split('/')[-1]

    @property
    def file_type(self):
        ext = self.filename.split('.')[-1]
        return ext.lower()
