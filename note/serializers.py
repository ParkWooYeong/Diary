# note/serializers.py
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
            'id', 'title', 'content', 'created_at', 'author','created_at',
            'author_username', 'is_owner', 'can_edit', 'can_delete'
        ]
        read_only_fields = ['author', 'author_username', 'is_owner', 'can_edit', 'can_delete']

    def _get_user(self):
        request = self.context.get('request')
        return getattr(request, 'user', None)

    def get_is_owner(self, obj):
        user = self._get_user()
        return bool(user and user.is_authenticated and obj.author_id == user.id)

    def get_can_edit(self, obj):
        """
        작성자거나 슈퍼유저/스태프면 수정 가능
        (권한 정책에 맞게 is_staff 포함 여부 조정 가능)
        """
        user = self._get_user()
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser or user.is_staff:
            return True
        return obj.author_id == user.id

    def get_can_delete(self, obj):
        """
        삭제 권한: 기본은 수정과 동일하게 설정
        필요 시 '삭제는 슈퍼만' 등으로 분리 가능
        """
        user = self._get_user()
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser or user.is_staff:
            return True
        return obj.author_id == user.id
