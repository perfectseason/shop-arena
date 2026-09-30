from uuid import uuid4

from django.conf import settings
from django.contrib import admin
from django.core.validators import MinValueValidator
from django.db import models

from api.validators import validate_file_size


class Promotion(models.Model):
    description = models.CharField(max_length=255)
    discount = models.FloatField()
    last_update = models.DateTimeField(auto_now=True)


class Collection(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    last_update = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    featured_product = models.ForeignKey(
        "Product",
        on_delete=models.SET_NULL,
        null=True,
        related_name="+",
    )

    def __str__(self) -> str:
        return str(self.title)

    class Meta:
        ordering = ["title"]


class Product(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(default="-")
    description = models.TextField()
    unit_price = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(1)],
    )
    inventory_count = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
    )
    last_update = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    collection = models.ForeignKey(
        Collection,
        on_delete=models.PROTECT,
        related_name="products",
    )
    promotions = models.ManyToManyField(
        Promotion,
        blank=True,
    )

    def __str__(self) -> str:
        return str(self.title)

    class Meta:
        ordering = ["title"]



class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='api/images', 
                              validators=[validate_file_size])




class Customer(models.Model):
    MEMBERSHIP_BRONZE = "B"
    MEMBERSHIP_SILVER = "S"
    MEMBERSHIP_GOLD = "G"

    MEMBERSHIP_CHOICES = [
        (MEMBERSHIP_BRONZE, "Bronze"),
        (MEMBERSHIP_SILVER, "Silver"),
        (MEMBERSHIP_GOLD, "Gold"),
    ]

    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    last_update = models.DateTimeField(auto_now=True)
    membership = models.CharField(
        max_length=1,
        choices=MEMBERSHIP_CHOICES,
        default=MEMBERSHIP_BRONZE,
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    def __str__(self) -> str:
        return f"{getattr(self.user, 'first_name', '')} {getattr(self.user, 'last_name', '')}"

    @admin.display(ordering="user__first_name")
    def first_name(self):
        return getattr(self.user, "first_name", "")

    @admin.display(ordering="user__last_name")
    def last_name(self):
        return getattr(self.user, "last_name", "")

    class Meta:
        ordering = [
            "user__first_name",
            "user__last_name",
        ]
        permissions = [
            ("view_history", "Can view history"),
        ]


class Order(models.Model):
    PAYMENT_STATUS_PENDING = "P"
    PAYMENT_STATUS_COMPLETE = "C"
    PAYMENT_STATUS_FAILED = "F"

    PAYMENT_STATUS_CHOICES = [
        (PAYMENT_STATUS_PENDING, "Pending"),
        (PAYMENT_STATUS_COMPLETE, "Complete"),
        (PAYMENT_STATUS_FAILED, "Failed"),
    ]

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="orders",
    )
    placed_at = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(
        max_length=1,
        choices=PAYMENT_STATUS_CHOICES,
        default=PAYMENT_STATUS_PENDING,
    )

    class Meta:
        permissions = [
            ("cancel_order", "Can cancel order"),
        ]


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.PROTECT,
        related_name="items",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="order_items",
    )
    quantity = models.PositiveSmallIntegerField()
    unit_price = models.DecimalField(
        max_digits=6,
        decimal_places=2,
    )


class Address(models.Model):
    customer = models.OneToOneField(
        Customer,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="addresses",
    )
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)


class ChatbotClient(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name = "Chatbot Client"
        verbose_name_plural = "Chatbot Clients"


class ChatBotForm(models.Model):
    client = models.ForeignKey(
        ChatbotClient,
        on_delete=models.CASCADE,
        related_name="forms",
    )
    form_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            f"Form for {self.client.name} - "
            f"{self.created_at:%Y-%m-%d %H:%M:%S}"
        )


class Cart(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid4,
    )
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="carts",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="cart_items",
    )
    quantity = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1)],
    )
    unit_price = models.DecimalField(
        max_digits=6,
        decimal_places=2,
    )

    class Meta:
        unique_together = [
            ["cart", "product"],
        ]


class Review(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField(auto_now_add=True)

