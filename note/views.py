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

# 모델 명칭 시도 (models/ 를 떼고 시도합니다)
model = genai.GenerativeModel('gemini-1.5-flash')

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        content = self.request.data.get('content')
        
        # --- 기본값 설정 (AI 분석 실패 시 대비) ---
        sentiment = "평온"
        summary = content[:30] + "..." if content else "요약 없음"
        ai_reply = "일기가 소중히 저장되었습니다."
        image_url = ""

        try:
            # 2. AI 분석 요청
            prompt = f"""
            다음 일기 내용을 분석해서 반드시 JSON 형식으로만 응답해줘.
            JSON 키는 'sentiment', 'summary', 'reply'야.
            - sentiment: '행복', '슬픔', '화남', '평온' 중 하나.
            - summary: 일기 내용을 한 줄로 요약.
            - reply: 일기 작성자에게 해주는 따뜻한 위로의 말.
            
            일기 내용: {content}
            """
            
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            
            ai_data = json.loads(response.text)
            sentiment = ai_data.get('sentiment', sentiment)
            summary = ai_data.get('summary', summary)
            ai_reply = ai_data.get('reply', ai_reply)
            
            # 3. 이미지 생성 (무료 도구)
            encoded_prompt = summary.replace(" ", "%20")
            image_url = f"https://pollinations.ai/p/{encoded_prompt}?width=1024&height=1024&seed=42"

        except Exception as e:
            # AI 분석 중 에러가 나면 터미널에 로그만 찍고 넘어갑니다.
            print(f"--- AI 분석 오류 발생: {e} ---")

        # 4. DB 저장 (AI가 실패해도 본문은 저장됨)
        serializer.save(
            author=self.request.user,
            sentiment=sentiment,
            summary=summary,
            ai_reply=ai_reply,
            image_url=image_url
        )