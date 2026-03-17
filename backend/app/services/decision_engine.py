from backend.app.core.state import ConversationState
from backend.app.services.models import ChatMessage, SessionContext


class DecisionEngine:
    def route(self, session: SessionContext, user_text: str) -> tuple[ConversationState, str, list[str]]:
        normalized = user_text.strip().lower()

        if session.state == ConversationState.DISCOVERY:
            if any(token in normalized for token in ["عندي", "idea", "فكرة", "niche"]):
                session.state = ConversationState.IDEA_ANALYSIS
                session.user_idea = user_text
                return (
                    session.state,
                    "ممتاز! فكرتك بداية قوية 👌 سأحللها من حيث الجمهور والمنافسة وخيارات الربح، ثم أعطيك تحسينات مباشرة.",
                    ["تحليل الفكرة الآن", "توضيح الجمهور المستهدف", "اقتراح تحسين سريع"],
                )
            session.state = ConversationState.IDEA_GENERATION
            return (
                session.state,
                "رائع، خلّينا نبتكر أفكار مناسبة لك 🎯 أخبرني: ما المجالات التي تحبها أو لديك خبرة فيها؟",
                ["تقنية", "صحة", "تعليم", "أعمال", "لا أعرف بعد"],
            )

        if session.state == ConversationState.IDEA_GENERATION:
            session.user_idea = user_text
            session.state = ConversationState.IDEA_ANALYSIS
            return (
                session.state,
                "جميل! بناءً على ما ذكرت، أقدر أبني لك 3 مسارات محتوى مربحة ونختار الأنسب لك.",
                ["مسار سريع النمو", "مسار أرباح طويلة المدى", "مسار يعتمد على الخدمات"],
            )

        if session.state == ConversationState.IDEA_ANALYSIS:
            session.state = ConversationState.NICHE_REFINEMENT
            return (
                session.state,
                "التحليل المبدئي: الفكرة جيدة، لكن تحتاج تضييق النيتش لتمييزك عن المنافسين. خلّينا نحدد شريحة جمهور واحدة كبداية.",
                ["تضييق النيتش", "تحديد المشكلة الأساسية", "صياغة وعد المحتوى"],
            )

        if session.state == ConversationState.NICHE_REFINEMENT:
            session.niche = user_text
            session.state = ConversationState.MONETIZATION_STRATEGY
            return (
                session.state,
                "ممتاز ✅ الآن نختار أفضل نموذج ربح. سأقارن لك بين: الإعلانات، الأفلييت، المنتجات الرقمية، الخدمات، والرعايات.",
                ["مقارنة نماذج الربح", "اختيار نموذج أساسي", "نموذج ثانوي داعم"],
            )

        if session.state == ConversationState.MONETIZATION_STRATEGY:
            session.state = ConversationState.CONTENT_PLANNING
            return (
                session.state,
                "ممتاز، الآن نترجم الخطة لأفكار محتوى عملية لأول 30 يوم.",
                ["10 أفكار مقالات", "تقويم نشر أسبوعي", "CTA لكل نوع محتوى"],
            )

        if session.state == ConversationState.CONTENT_PLANNING:
            session.state = ConversationState.READINESS_EVALUATION
            session.readiness_score = 78
            return (
                session.state,
                "جاهز للتقييم النهائي. حالياً درجة الجاهزية المتوقعة 78/100 مع خطوات واضحة للوصول إلى 90+.",
                ["عرض فجوات الجاهزية", "خطة 14 يوم", "مؤشرات النجاح"],
            )

        if session.state == ConversationState.READINESS_EVALUATION:
            session.state = ConversationState.SOFT_CONVERSION
            return (
                session.state,
                "أنت قريب جداً من الإطلاق 🚀 إذا رغبت، أقدر أساعدك بخطة احترافية مخصصة (اختياري بالكامل).",
                ["أكمل بنفسي", "أريد دعماً احترافياً", "اشرح الخطة أكثر"],
            )

        return (
            ConversationState.SOFT_CONVERSION,
            "أنا معك خطوة بخطوة. هل تريد أن نواصل تحسين الخطة الحالية أم نبدأ فكرة جديدة؟",
            ["تحسين الخطة", "بدء فكرة جديدة"],
        )

    def append_history(self, session: SessionContext, role: str, text: str) -> None:
        session.history.append(ChatMessage(role=role, text=text))
