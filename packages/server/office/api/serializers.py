from decimal import Decimal

from django.db import transaction

from rest_framework import serializers

from .signals import order_created

from chatbot.models import ChatConversation, ChatMessage

from .models import (
    Product,
    Collection,
    Promotion,
    Customer,
    Order,
    OrderItem,
    Cart,
    CartItem,
    Review,
)


# ============================================================
# CHATBOT SERIALIZERS
# ============================================================

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = [
            "id",
            "role",
            "content",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
        ]


class ChatConversationSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = ChatConversation
        fields = [
            "id",
            "conversation_id",
            "messages",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "conversation_id",
            "messages",
            "created_at",
            "updated_at",
        ]


# ============================================================
# COLLECTION SERIALIZER
# ============================================================

class CollectionSerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(
        read_only=True
    )

    class Meta:
        model = Collection
        fields = [
            "id",
            "title",
            "description",
            "products_count",
            "last_update",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "products_count",
            "last_update",
            "created_at",
        ]


# ============================================================
# PRODUCT SERIALIZERS
# ============================================================

class ProductSerializer(serializers.ModelSerializer):
    price_with_tax = serializers.SerializerMethodField(
        method_name="calculate_tax"
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "description",
            "slug",
            "inventory_count",
            "unit_price",
            "price_with_tax",
            "collection",
            "last_update",
        ]
        read_only_fields = [
            "id",
            "price_with_tax",
            "last_update",
        ]

    def calculate_tax(self, product: Product):
        return product.unit_price * Decimal("1.1")


class SimpleProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "unit_price",
        ]


# ============================================================
# PROMOTION SERIALIZER
# ============================================================

class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = [
            "id",
            "description",
            "discount",
            "last_update",
        ]
        read_only_fields = [
            "id",
            "last_update",
        ]


# ============================================================
# CUSTOMER SERIALIZER
# ============================================================

class CustomerSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(
        read_only=True
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    class Meta:
        model = Customer
        fields = [
            "id",
            "user_id",
            "email",
            "phone",
            "created_at",
            "last_update",
            "membership",
        ]
        read_only_fields = [
            "id",
            "user_id",
            "email",
            "created_at",
            "last_update",
        ]


# ============================================================
# ORDER ITEM SERIALIZER
# ============================================================

class OrderItemSerializer(serializers.ModelSerializer):
    product = SimpleProductSerializer(
        read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "order",
            "product",
            "quantity",
            "unit_price",
        ]
        read_only_fields = [
            "id",
            "product",
            "unit_price",
        ]


# ============================================================
# ORDER SERIALIZER
# ============================================================

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "customer",
            "items",
            "placed_at",
            "payment_status",
        ]
        read_only_fields = [
            "id",
            "customer",
            "items",
            "placed_at",
        ]


class UpdateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "payment_status",
        ]


# ============================================================
# CREATE ORDER SERIALIZER
# ============================================================

class CreateOrderSerializer(serializers.Serializer):
    cart_id = serializers.UUIDField()

    def validate_cart_id(self, cart_id):
        if not Cart.objects.filter(
            pk=cart_id
        ).exists():
            raise serializers.ValidationError(
                "No cart with the given ID was found."
            )

        if not CartItem.objects.filter(
            cart_id=cart_id
        ).exists():
            raise serializers.ValidationError(
                "The cart is empty."
            )

        return cart_id

    def save(self, **kwargs):
        with transaction.atomic():

            cart_id = self.validated_data["cart_id"]

            customer = Customer.objects.get(
                user_id=self.context["user_id"]
            )

            order = Order.objects.create(
                customer=customer
            )

            cart_items = CartItem.objects.filter(
                cart_id=cart_id
            ).select_related("product")

            order_items = [
                OrderItem(
                    order=order,
                    product=item.product,
                    unit_price=item.product.unit_price,
                    quantity=item.quantity,
                )
                for item in cart_items
            ]

            OrderItem.objects.bulk_create(
                order_items
            )

            Cart.objects.filter(
                pk=cart_id
            ).delete()

            order_created.send_robust(
                self.__class__,
                order=order,
            )

            return order


# ============================================================
# CART ITEM SERIALIZER
# ============================================================

class CartItemSerializer(serializers.ModelSerializer):
    product = SimpleProductSerializer(
        read_only=True
    )

    total_price = serializers.SerializerMethodField()

    def get_total_price(
        self,
        cart_item: CartItem,
    ):
        return (
            cart_item.quantity
            * cart_item.product.unit_price
        )

    class Meta:
        model = CartItem
        fields = [
            "id",
            "cart",
            "product",
            "quantity",
            "unit_price",
            "total_price",
        ]
        read_only_fields = [
            "id",
            "product",
            "unit_price",
            "total_price",
        ]


# ============================================================
# ADD CART ITEM SERIALIZER
# ============================================================

class AddCartitemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField()

    def validate_product_id(self, value):
        if not Product.objects.filter(
            pk=value
        ).exists():
            raise serializers.ValidationError(
                "No product with the given ID was found."
            )

        return value

    def save(self, **kwargs):
        cart_id = self.context["cart_id"]

        validated_data = self.validated_data

        product_id = validated_data["product_id"]
        quantity = validated_data["quantity"]

        product = Product.objects.get(
            pk=product_id
        )

        try:
            cart_item = CartItem.objects.get(
                cart_id=cart_id,
                product_id=product_id,
            )

            cart_item.quantity += quantity
            cart_item.save(
                update_fields=["quantity"]
            )

            self.instance = cart_item

        except CartItem.DoesNotExist:
            self.instance = CartItem.objects.create(
                cart_id=cart_id,
                product_id=product_id,
                quantity=quantity,
                unit_price=product.unit_price,
            )

        return self.instance

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product_id",
            "quantity",
        ]
        read_only_fields = [
            "id",
        ]


# ============================================================
# CART SERIALIZER
# ============================================================

class CartSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(
        read_only=True
    )

    items = CartItemSerializer(
        many=True,
        read_only=True,
    )

    total_price = serializers.SerializerMethodField()

    def get_total_price(self, cart):
        return sum(
            item.quantity * item.product.unit_price
            for item in cart.items.all()
        )

    class Meta:
        model = Cart
        fields = [
            "id",
            "items",
            "customer",
            "total_price",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "items",
            "total_price",
            "created_at",
            "updated_at",
        ]


# ============================================================
# UPDATE CART ITEM SERIALIZER
# ============================================================

class UpdateCartItemSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = CartItem
        fields = [
            "quantity",
        ]


# ============================================================
# REVIEW SERIALIZER
# ============================================================

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "id",
            "date",
            "name",
            "description",
        ]
        read_only_fields = [
            "id",
            "date",
        ]

    def create(self, validated_data):
        product_id = self.context["product_id"]

        return Review.objects.create(
            product_id=product_id,
            **validated_data,
        )


































# from decimal import Decimal
# from django.db import transaction
# from rest_framework import serializers
# from .signals import order_created
# from chatbot.models import ChatConversation, ChatMessage
# from .models import (
#     Product,
#     Collection,
#     Promotion,
#     Customer,
#     Order,
#     OrderItem,
#     Cart,
#     CartItem,
#     Review,
# )


# # =========================================================
# # CHATBOT SERIALIZERS
# # =========================================================

# class ChatMessageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ChatMessage
#         fields = [
#             "id",
#             "role",
#             "content",
#             "created_at",
#         ]
#         read_only_fields = [
#             "id",
#             "created_at",
#         ]


# class ChatConversationSerializer(serializers.ModelSerializer):
#     messages = ChatMessageSerializer(
#         many=True,
#         read_only=True,
#     )

#     class Meta:
#         model = ChatConversation
#         fields = [
#             "id",
#             "conversation_id",
#             "messages",
#             "created_at",
#             "updated_at",
#         ]
#         read_only_fields = [
#             "id",
#             "conversation_id",
#             "messages",
#             "created_at",
#             "updated_at",
#         ]


# # =========================================================
# # COLLECTION SERIALIZER
# # =========================================================

# class CollectionSerializer(serializers.ModelSerializer):
#     products_count = serializers.IntegerField(
#         read_only=True,
#     )

#     class Meta:
#         model = Collection
#         fields = [
#             "id",
#             "title",
#             "description",
#             "products_count",
#             "last_update",
#             "created_at",
#         ]
#         read_only_fields = [
#             "id",
#             "products_count",
#             "last_update",
#             "created_at",
#         ]


# # =========================================================
# # PRODUCT SERIALIZER
# # =========================================================

# class ProductSerializer(serializers.ModelSerializer):
#     price_with_tax = serializers.SerializerMethodField(
#         method_name="calculate_tax",
#     )

#     class Meta:
#         model = Product
#         fields = [
#             "id",
#             "title",
#             "description",
#             "slug",
#             "inventory",
#             "unit_price",
#             "price_with_tax",
#             "collection",
#             "last_update",
#         ]
#         read_only_fields = [
#             "id",
#             "price_with_tax",
#             "last_update",
#         ]

#     def calculate_tax(self, product: Product):
#         return product.unit_price * Decimal("1.1")




# #===============================================================================
# # simple model serializer to filter what product to appear in cartitem serializer
# #=================================================================================
# class SimpleProductSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Product
#         fields = [ 'id', 'title', 'unit_price' ]


    


# # =========================================================
# # PROMOTION SERIALIZER
# # =========================================================

# class PromotionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Promotion
#         fields = [
#             "id",
#             "description",
#             "discount",
#             "last_update",
#         ]
#         read_only_fields = [
#             "id",
#             "last_update",
#         ]


# # =========================================================
# # CUSTOMER SERIALIZER
# # =========================================================

# class CustomerSerializer(serializers.ModelSerializer):

#     user_id = serializers.IntegerField(read_only=True)
#     class Meta:
#         model = Customer
#         fields = [
#             "id",
#             "user_id",
#             "email",
#             "phone",
#             'birth_date',
#             "created_at",
#             "last_update",
#             "membership",
#         ]
#         read_only_fields = [
#             "id",
#             "created_at",
#             "last_update",
#         ]




# # =========================================================
# # ORDER ITEM SERIALIZER
# # =========================================================

# class OrderItemSerializer(serializers.ModelSerializer):
#     product = SimpleProductSerializer()
#     class Meta:
#         model = OrderItem
#         fields = [
#             "id",
#             "order",
#             "product",
#             "quantity",
#             "unit_price",
#         ]
#         read_only_fields = [
#             "id",
#         ]





# # =========================================================
# # ORDER SERIALIZER
# # =========================================================

# class OrderSerializer(serializers.ModelSerializer):
#     items = OrderItemSerializer(many=True)
#     class Meta:
#         model = Order
#         fields = [
#             "id",
#             "customer",
#             'items',
#             "placed_at",
#             "payment_status",
#         ]
#         read_only_fields = [
#             "id",
#             "placed_at",
#         ]


# class UpdateOrderSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Order
#         fields = ['payment_status']



# class CreateOrderSerializer(serializers.Serializer):
#     cart_id = serializers.UUIDField()

#     def validate_cart_id(self, cart_id):
#         if not Cart.objects.filter(pk=cart_id).exists():
#             raise serializers.ValidationError('No cart with the given ID was found.')
#         if CartItem.objects.filter(cart_id=cart_id).count() == 0:
#             raise serializers.ValidationError('The cart is empty.')
#         return cart_id

#     def save(self, **kwargs):
#         with transaction.atomic():
#             cart_id = self.validated_data.get('cart_id')


#             customer = Customer.objects.select_related('product').get(user_id=self.context['user_id'])
#             order = Order.objects.create(Customer=customer)

#             cart_items = CartItem.objects.filter(cart_id=cart_id)
#             order_items = [
#                 OrderItem( 
#                     order=order,
#                     product=item.product,
#                     unit_price=item.product.unit_price,
#                     quantity=item.quantity
#                 ) for item in cart_items
#             ]
#             OrderItem.objects.bulk_create(order_items)

#             Cart.objects.filter(pk=cart_id).delete() 

#             order_created.send_robust(self.__class__, order=order)

#             return order






# # =========================================================
# # CART ITEM SERIALIZER
# # =========================================================

# class CartItemSerializer(serializers.ModelSerializer):
#     product = SimpleProductSerializer()
#     total_price = serializers.SerializerMethodField()

#     def get_total_price(self, cart_item:CartItem):
#         return cart_item.quantity * cart_item.product.unit_price
#     class Meta:
#         model = CartItem
#         fields = [
#             "id",
#             "cart",
#             "product",
#             "quantity",
#             "unit_price",
#             "total_price",
#         ]
#         read_only_fields = [
#             "id",
#         ]



# #===========================================================
# # cart to move to cart items
# #===========================================================

# class AddCartitemSerializer(serializers.ModelSerializer):
#     product_id = serializers.IntegerField()

#     def validate_product_id(self, value):
#         if not Product.objects.filter(pk=value).exists():
#              raise serializers.ValidationError('No product wiwth the given ID was found.')
#         return value

#     def save(self, **kwargs):
#         cart_id = self.context['cart_id']
#         validated_data = self.validated_data
#         product_id = validated_data.get('product_id')
#         quantity = validated_data.get('quantity')

#         try:
#             cart_item = CartItem.objects.get(cart_id=cart_id, product_id=product_id)
#             cart_item.quantity += quantity
#             cart_item.save()
#             self.instance = cart_item
#         except CartItem.DoesNotExist:
#             self.instance = CartItem.objects.create(  # pylint: disable=no-member
#                 cart_id=cart_id,
#                 **validated_data,
#             )

#         return self.instance
#     class Meta:
#         model = CartItem
#         fields = ['id', 'product_id', 'quantity']






# # =========================================================
# # CART SERIALIZER
# # =========================================================

# class CartSerializer(serializers.ModelSerializer):
#     id = serializers.UUIDField(read_only=True)
#     items = CartItemSerializer(many=True, read_only=True)
#     total_price = serializers.SerializerMethodField()

#     def get_total_price(self, cart):

#         #[item for item in collection]

#         return sum([item.quantity * item.product.unit_price for item in cart.items.all()])


#     class Meta:
#         model = Cart
#         fields = [
#             "id",
#             "items",
#             "customer",
#             "total_price",
#             "created_at",
#             "updated_at",
#         ]
#         read_only_fields = [
#             "id",
#             "created_at",
#             "updated_at",
#         ]




# class UpdateCartItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CartItem
#         fields = ['quantity']




# # =========================================================
# # REVIEW SERIALIZER
# # =========================================================

# class ReviewSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Review
#         fields = [
#             "id",
#             "date",
#             "name",
#             "description",
#         ]

#     def create(self, validated_data):
#         product_id = self.context["product_id"]

#         return Review.objects.create(  # pylint: disable=no-member
#             product_id=product_id,
#             **validated_data,
#         )

