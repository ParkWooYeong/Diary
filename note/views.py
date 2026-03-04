import google.generativeai as genai
import json
import os
from dotenv import load_dotenv
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Note
from .serializers import NoteSerializer
from .permissions import IsAuthorOrReadOnly

load_dotenv()

# 1. 제미나이 설정
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# 가장 범용적인 모델 명칭으로 복구
model = genai.GenerativeModel('gemini-pro')

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        content = self.request.data.get('content')
        
        # 기본값 설정
        sentiment = "평온"
        summary = content[:30] + "..." if content else "요약 없음"
        ai_reply = "일기가 소중히 저장되었습니다."
        image_url = ""

        try:
            prompt = f"""
            다음 일기 내용을 분석해서 JSON 형식으로 응답해줘.
            JSON 키: 'sentiment', 'summary', 'reply'
            - sentiment: '행복', '슬픔', '화남', '평온' 중 하나.
            - summary: 한 줄 요약.
            - reply: 따뜻한 위로 한 문장.
            
            일기 내용: {content}
            """
            
            response = model.generate_content(prompt)
            
            # 가장 기본적인 파싱 방식
            ai_data = json.loads(response.text)
            sentiment = ai_data.get('sentiment', sentiment)
            summary = ai_data.get('summary', summary)
            ai_reply = ai_data.get('reply', ai_reply)
            
            encoded_prompt = summary.replace(" ", "%20")
            image_url = f"https://pollinations.ai/p/{encoded_prompt}?width=1024&height=1024&seed=42"

        except:
            # 실패해도 조용히 기본값으로 저장
            pass

        serializer.save(
            author=self.request.user,
            sentiment=sentiment,
            summary=summary,
            ai_reply=ai_reply,
            image_url=image_url
        )