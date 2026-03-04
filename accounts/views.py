from rest_framework import generics, permissions, status
from rest_framework.response import Response
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
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)