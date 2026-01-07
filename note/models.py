from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    sentiment = models.CharField(max_length=20, blank=True, null=True)  # 감정 (행복, 우울 등)
    summary = models.TextField(blank=True, null=True)                 # 한 줄 요약
    ai_reply = models.TextField(blank=True, null=True)                # AI의 위로 답장
    image_url = models.URLField(max_length=500, blank=True, null=True) # DALL-E 이미지 경로

    def __str__(self):
        return self.title