from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    is_owner = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()
    can_delete = serializers.SerializerMethodField()
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Note
        fields = [
            'id', 'title', 'content', 'created_at', 'author',
            'author_username', 'is_owner', 'can_edit', 'can_delete',
            # --- AI 관련 필드 추가 ---
            'sentiment', 'summary', 'ai_reply', 'image_url'
        ]
        # AI 필드들은 서버에서 생성하므로 읽기 전용으로 설정합니다.
        read_only_fields = [
            'author', 'author_username', 'is_owner', 
            'can_edit', 'can_delete',
            'sentiment', 'summary', 'ai_reply', 'image_url'
        ]

    def _get_user(self):
        request = self.context.get('request')
        return getattr(request, 'user', None)

    def get_is_owner(self, obj):
        user = self._get_user()
        return bool(user and user.is_authenticated and obj.author_id == user.id)

    def get_can_edit(self, obj):
        user = self._get_user()
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser or user.is_staff:
            return True
        return obj.author_id == user.id

    def get_can_delete(self, obj):
        user = self._get_user()
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser or user.is_staff:
            return True
        return obj.author_id == user.id