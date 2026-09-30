from django.shortcuts import get_object_or_404
from django.db.models import Count

from rest_framework import generics, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    RetrieveModelMixin,
)
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from django_filters.rest_framework import DjangoFilterBackend

from .permissions import IsAdminOnReadOnly, ViewCustomerHistoryPermission
from .filters import ProductFilter
from .models import (
    Product,
    Collection,
    ProductImage,
    Promotion,
    Customer,
    Order,
    OrderItem,
    Cart,
    CartItem,
    Review,
)
from .serializers import (
    AddCartitemSerializer,
    CollectionSerializer,
    CreateOrderSerializer,
    ProductImageSerializer,
    ProductSerializer,
    ChatConversationSerializer,
    PromotionSerializer,
    CustomerSerializer,
    OrderSerializer,
    OrderItemSerializer,
    CartSerializer,
    CartItemSerializer,
    ReviewSerializer,
    UpdateCartItemSerializer,
    UpdateOrderSerializer,
)

from chatbot.models import ChatConversation
from chatbot.services.chat_service import process_chat_message


class ChatbotClientCreateView(generics.CreateAPIView):
    queryset = ChatConversation.objects.all()
    serializer_class = ChatConversationSerializer


class ChatView(APIView):

    def post(self, request):
        prompt = str(request.data.get("prompt", "")).strip()

        if not prompt:
            return Response(
                {
                    "message": "Please enter a message."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        conversation_id = request.data.get("conversation_id")

        if conversation_id:
            conversation = get_object_or_404(
                ChatConversation,
                pk=conversation_id,
            )
        else:
            conversation = ChatConversation.objects.create()

        answer = process_chat_message(
            prompt=prompt,
            conversation=conversation,
        )

        return Response(
            {
                "message": answer
            },
            status=status.HTTP_200_OK,
        )


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.prefetch_related('images').all()
    serializer_class = ProductSerializer

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = ProductFilter
    pagination_class = PageNumberPagination
    permission_classes = [IsAdminOnReadOnly]

    search_fields = [
        "title",
        "description",
        "collection__title",
    ]

    ordering_fields = [
        "unit_price",
        "last_update",
    ]

    def get_serializer_context(self):
        return {
            "request": self.request,
        }

    def destroy(self, request, *args, **kwargs):
        product = self.get_object()

        if product.order_items.count() > 0:
            return Response(
                {
                    "error": (
                        "Product cannot be deleted, "
                        "it is associated with another item."
                    )
                },
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

        product.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )


class CollectionViewSet(ModelViewSet):
    queryset = Collection.objects.annotate(
        products_count=Count("products")
    ).all()

    serializer_class = CollectionSerializer
    permission_classes = [IsAdminOnReadOnly]

    def destroy(self, request, *args, **kwargs):
        collection = self.get_object()

        if collection.products.count() > 0:
            return Response(
                {
                    "error": "Collection cannot be deleted"
                },
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

        collection.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )


class PromotionViewSet(ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer


class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAdminUser]

    @action(
        detail=True,
        methods=["GET"],
        permission_classes=[ViewCustomerHistoryPermission],
    )
    def history(self, request, pk=None):
        customer = self.get_object()

        orders = customer.orders.all()

        serializer = OrderSerializer(
            orders,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=False,
        methods=["GET", "PUT"],
        permission_classes=[IsAuthenticated],
    )
    def me(self, request):
        customer = get_object_or_404(
            Customer,
            user_id=request.user.id,
        )

        if request.method == "GET":
            serializer = CustomerSerializer(customer)

            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )

        serializer = CustomerSerializer(
            customer,
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class OrderViewSet(ModelViewSet):
    http_method_names = [
        "get",
        "patch",
        "post",
        "delete",
        "head",
        "options",
    ]

    def get_permissions(self):
        if self.request.method in ["PATCH", "DELETE"]:
            return [IsAdminUser()]

        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = CreateOrderSerializer(
            data=request.data,
            context={
                "user_id": self.request.user.id,
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        order = serializer.save()

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateOrderSerializer

        if self.request.method == "PATCH":
            return UpdateOrderSerializer

        return OrderSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Order.objects.all()

        customer_id = Customer.objects.only(
            "id"
        ).get(
            user_id=user.id
        ).id

        return Order.objects.filter(
            customer_id=customer_id,
        )


class OrderItemViewSet(ModelViewSet):
    queryset = OrderItem.objects.select_related(
        "order",
        "product",
    ).all()

    serializer_class = OrderItemSerializer


class CartViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    DestroyModelMixin,
    GenericViewSet,
):
    queryset = Cart.objects.prefetch_related(
        "items__product"
    ).all()

    serializer_class = CartSerializer


class CartItemViewSet(ModelViewSet):
    http_method_names = [
        "get",
        "post",
        "patch",
        "delete",
    ]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return AddCartitemSerializer

        if self.request.method == "PATCH":
            return UpdateCartItemSerializer

        return CartItemSerializer

    def get_serializer_context(self):
        return {
            "cart_id": self.kwargs["cart_pk"],
        }

    def get_queryset(self):
        return (
            CartItem.objects
            .filter(
                cart_id=self.kwargs["cart_pk"]
            )
            .select_related("product")
        )


class ReviewViewSet(ModelViewSet):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        return Review.objects.filter(
            product_id=self.kwargs["product_pk"]
        )

    def get_serializer_context(self):
        return {
            "product_id": self.kwargs["product_pk"],
        }


class ProductImageViewSet(ModelViewSet):
    serializer_class = ProductImageSerializer

    def get_serializer_context(self):
        return {'product_id': self.kwargs['product_pk']}

    def get_queryset(self):
        return ProductImage.objects.filter(product_id=self.kwargs['product_pk'])
