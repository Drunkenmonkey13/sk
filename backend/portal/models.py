from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class FileUpload(models.Model):
    CATEGORY_CHOICES = [
        ('image', 'Image'),
        ('document', 'Document'),
        ('video', 'Video'),
        ('other', 'Other'),
    ]

    uploaded_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    file = models.FileField(upload_to='uploads/')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    upload_date = models.DateTimeField(auto_now_add=True)

    @property
    def filename(self):
        return self.file.name.split('/')[-1]

    @property
    def file_type(self):
        return self.filename.split('.')[-1].lower()

    @property
    def file_size(self):
        return self.file.size  # size in bytes
