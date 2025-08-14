# accounts/views.py
from rest_framework import generics, permissions
from .serializers import SignupSerializer

class SignupView(generics.CreateAPIView):
    authentication_classes = []
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # <- 여기서 어떤 필드가 문제인지 확인
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)