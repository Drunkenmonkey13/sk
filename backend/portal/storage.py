from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os

class UserFileSystemStorage(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        """
        Override to use (n) style suffix for duplicate filenames.
        """
        dir_name, file_name = os.path.split(name)
        file_root, file_ext = os.path.splitext(file_name)

        # Full path to check
        full_path = os.path.join(settings.MEDIA_ROOT, name)

        counter = 1
        candidate = file_name
        while self.exists(os.path.join(dir_name, candidate)):
            candidate = f"{file_root}({counter}){file_ext}"
            counter += 1

        return os.path.join(dir_name, candidate)
