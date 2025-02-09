from django.apps import AppConfig


class GoogleConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mygoogle'

    def ready(self):
        import mygoogle.signals  # Ensures the signals are registered