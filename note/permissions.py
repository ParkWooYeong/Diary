# note/permissions.py
from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    message = "이 게시물은 작성자만 수정할 수 있습니다."

    """
    작성자만 수정/삭제 가능, 나머지는 읽기만 가능
    (단, 슈퍼유저나 스태프는 예외적으로 허용)
    """
    def has_object_permission(self, request, view, obj):
        # 읽기(GET, HEAD, OPTIONS)는 모두 허용
        if request.method in permissions.SAFE_METHODS:
            return True

        user = request.user

        # 슈퍼유저나 스태프는 항상 허용
        if getattr(user, "is_superuser", False):
            return True

        # 작성자만 허용
        return obj.author == user
