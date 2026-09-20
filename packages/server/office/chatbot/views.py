import uuid

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ChatConversation, ChatMessage
from .services.chat_service import process_chat_message


# Chatbot


class ChatView(APIView):

    def post(self, request):
        prompt = str(
            request.data.get(
                "prompt",
                "",
            )
        ).strip()

        conversation_id = request.data.get(
            "conversationId"
        )

        if not prompt:
            return Response(
                {
                    "message": "Please enter a message.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not conversation_id:
            return Response(
                {
                    "message": "Conversation ID is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            conversation_uuid = uuid.UUID(
                str(conversation_id)
            )

        except (
            ValueError,
            TypeError,
            AttributeError,
        ):
            return Response(
                {
                    "message": "Invalid conversation ID.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        conversation, _ = (
            ChatConversation.objects.get_or_create(
                conversation_id=conversation_uuid
            )
        )

        ChatMessage.objects.create(
            conversation=conversation,
            role="user",
            content=prompt,
        )

        try:
            bot_message = process_chat_message(
                prompt=prompt,
                conversation=conversation,
            )

        except Exception as error:
            print(
                f"Chatbot AI error: {error}"
            )

            return Response(
                {
                    "message": (
                        "I'm sorry, I couldn't process "
                        "your request right now. "
                        "Please try again."
                    ),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        ChatMessage.objects.create(
            conversation=conversation,
            role="bot",
            content=bot_message,
        )

        return Response(
            {
                "message": bot_message,
            },
            status=status.HTTP_200_OK,
        )


class ChatConversationDetailView(APIView):

    def get(
        self,
        _request,
        conversation_id,
    ):
        try:
            conversation_uuid = uuid.UUID(
                str(conversation_id)
            )

        except (
            ValueError,
            TypeError,
            AttributeError,
        ):
            return Response(
                {
                    "detail": "Invalid conversation ID.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        conversation = (
            ChatConversation.objects.filter(
                conversation_id=conversation_uuid
            ).first()
        )

        if conversation is None:
            return Response(
                {
                    "detail": "Conversation not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        messages = conversation.messages.all()

        return Response(
            {
                "conversationId": str(
                    conversation.conversation_id
                ),
                "messages": [
                    {
                        "id": message.id,
                        "role": message.role,
                        "content": message.content,
                        "created_at": message.created_at,
                    }
                    for message in messages
                ],
            },
            status=status.HTTP_200_OK,
        )



# import uuid

# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.views import APIView

# from .models import ChatConversation, ChatMessage
# from .services.chat_service import process_chat_message

# # chatbot


# class ChatView(APIView):

#     def post(self, request):

#         prompt = str(
#             request.data.get(
#                 "prompt",
#                 "",
#             )
#         ).strip()

#         conversation_id = request.data.get(
#             "conversationId"
#         )

#         if not prompt:
#             return Response(
#                 {
#                     "message": "Please enter a message."
#                 },
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         if not conversation_id:
#             return Response(
#                 {
#                     "message": "Conversation ID is required."
#                 },
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         try:
#             conversation_uuid = uuid.UUID(
#                 str(conversation_id)
#             )

#         except (
#             ValueError,
#             TypeError,
#             AttributeError,
#         ):
#             return Response(
#                 {
#                     "message": "Invalid conversation ID."
#                 },
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         conversation, _ = (
#             ChatConversation.objects.get_or_create(
#                 conversation_id=conversation_uuid
#             )
#         )

#         ChatMessage.objects.create(
#             conversation=conversation,
#             role="user",
#             content=prompt,
#         )

#         try:
#             bot_message = process_chat_message(
#                 prompt=prompt,
#                 conversation=conversation,
#             )

#         except Exception as error:
#             print(
#                 f"Chatbot AI error: {error}"
#             )

#             return Response(
#                 {
#                     "message": (
#                         "I'm sorry, I couldn't process "
#                         "your request right now. "
#                         "Please try again."
#                     )
#                 },
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )

#         ChatMessage.objects.create(
#             conversation=conversation,
#             role="bot",
#             content=bot_message,
#         )

#         return Response(
#             {
#                 "message": bot_message,
#             },
#             status=status.HTTP_200_OK,
#         )


# class ChatConversationDetailView(APIView):

#     def get(
#         self,
#         _request,
#         conversation_id,
#     ):

#         try:
#             conversation_uuid = uuid.UUID(
#                 str(conversation_id)
#             )

#         except (
#             ValueError,
#             TypeError,
#             AttributeError,
#         ):
#             return Response(
#                 {
#                     "detail": "Invalid conversation ID."
#                 },
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         conversation = (
#             ChatConversation.objects.filter(
#                 conversation_id=conversation_uuid
#             ).first()
#         )

#         if conversation is None:
#             return Response(
#                 {
#                     "detail": "Conversation not found."
#                 },
#                 status=status.HTTP_404_NOT_FOUND,
#             )

#         messages = conversation.messages.all()

#         return Response(
#             {
#                 "conversationId": str(
#                     conversation.conversation_id
#                 ),
#                 "messages": [
#                     {
#                         "id": message.id,
#                         "role": message.role,
#                         "content": message.content,
#                         "created_at": message.created_at,
#                     }
#                     for message in messages
#                 ],
#             },
#             status=status.HTTP_200_OK,
#         )
