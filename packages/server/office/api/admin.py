from typing import Any

from django.contrib import admin, messages
from django.contrib.contenttypes.admin import GenericTabularInline
from django.db.models import Count
from django.db.models.query import QuerySet
from django.urls import reverse
from django.utils.html import format_html
from django.utils.http import urlencode

from Tags.models import TaggedItem

from . import models
from .models import ChatbotClient


class InventoryFilter(admin.SimpleListFilter):
    title = 'inventory'
    parameter_name = 'inventory'

    def lookups(self, request: Any, model_admin):
        return [
            ('<10', 'LOW'),
        ]

    def queryset(self, request, queryset: QuerySet):
        if self.value() == '<10':
            return queryset.filter(inventory_count__lt=10)

        return queryset


@admin.register(ChatbotClient)
class ChatbotClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('created_at',)
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')


class ProductImageInline(admin.TabularInline):
    model = models.ProductImage
    readonly_fields = ['thumbnail']

    def thumbnail(self, instance):
        if instance.image.name != '':
            return format_html(f'<img src="{instance.image.url}" /> class="thumbnail')
        return ''


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    autocomplete_fields = ['collection']

    # Required because Product is used by
    # OrderItemInline.autocomplete_fields.
    search_fields = [
        'title',
        'description',
        'collection__title',
    ]

    prepopulated_fields = {'slug': ['title']}
    actions = ['clear_inventory']
    inlines = [ProductImageInline]
    list_display = [
        'title',
        'unit_price',
        'inventory_status',
        'collection_title',
    ]

    list_editable = ['unit_price']
    list_filter = ['collection', 'last_update', InventoryFilter]
    list_per_page = 10
    list_select_related = ['collection']

    @admin.display(ordering='inventory_count')
    def inventory_status(self, product):
        if product.inventory_count < 10:
            return 'Low'
        return 'OK'

    @admin.action(description='Clear inventory')
    def clear_inventory(self, request, queryset):
        updated_count = queryset.update(inventory_count=0)

        self.message_user(
            request,
            f'{updated_count} products were successfully updated.',
            messages.ERROR,
        )

        class Media:
            css = {
                'all': ['api/styles.css']
            }

    @admin.display(ordering='collection')
    def collection_title(self, product):
        return product.collection.title


@admin.register(models.ChatBotForm)
class ChatBotFormAdmin(admin.ModelAdmin):
    list_display = [
        'client',
        'created_at',
        'updated_at',
    ]

    list_per_page = 10


@admin.register(models.OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = [
        'order',
        'product',
        'quantity',
        'unit_price',
    ]

    list_per_page = 10


@admin.register(models.Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'products_count',
    ]

    search_fields = ['title']
    list_filter = ['products']
    list_per_page = 10

    @admin.display(ordering='products_count')
    def products_count(self, collection):
        url = (
            reverse('admin:api_product_changelist')
            + '?'
            + urlencode({
                'collection__id': str(collection.id),
            })
        )

        return format_html(
            '<a href="{}">{} </a>',
            url,
            collection.products_count,
        )

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .annotate(products_count=Count('products'))
        )


@admin.register(models.Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'email',
        'phone',
        'membership',
    ]

    list_editable = ['membership']
    ordering = ['user__first_name', 'user__last_name']
    list_filter = ['membership']
    list_per_page = 10
    list_select_related = ['user']

    # Customer does not have direct name/email fields.
    # They belong to the related User model.
    search_fields = [
        'user__first_name__istartswith',
        'user__last_name__istartswith',
        'user__email__istartswith',
        'phone__istartswith',
    ]

    @admin.display(
        ordering='user__first_name',
        description='Name',
    )
    def name(self, customer):
        return (
            f'{customer.user.first_name} '
            f'{customer.user.last_name}'
        ).strip()

    @admin.display(
        ordering='user__email',
        description='Email',
    )
    def email(self, customer):
        return customer.user.email

    @admin.display(ordering='orders_count')
    def order(self, customer):
        url = (
            reverse('admin:api_order_changelist')
            + '?'
            + urlencode({
                'customer_id': str(customer.id),
            })
        )

        return format_html(
            '<a href="{}">View Orders</a>',
            url,
        )


class OrderItemInline(admin.TabularInline):
    autocomplete_fields = ['product']
    min_num = 1
    max_num = 10
    model = models.OrderItem
    extra = 0


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    autocomplete_fields = ['customer']
    inlines = [OrderItemInline]
    list_display = [
        'id',
        'placed_at',
        'customer',
        'payment_status',
    ]

    list_per_page = 10


@admin.register(models.Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = [
        'customer',
        'street',
        'city',
        'state',
        'postal_code',
        'country',
    ]

    list_per_page = 10


# from typing import Any

# from django.contrib import admin, messages
# from django.contrib.contenttypes.admin import GenericTabularInline
# from django.db.models import Count
# from django.db.models.query import QuerySet
# from django.urls import reverse
# from django.utils.html import format_html
# from django.utils.http import urlencode

# from Tags.models import TaggedItem

# from . import models
# from .models import ChatbotClient


# class InventoryFilter(admin.SimpleListFilter):
#     title = 'inventory'
#     parameter_name = 'inventory'

#     def lookups(self, request: Any, model_admin):
#         return [
#             ('<10', 'LOW'),
#         ]

#     def queryset(self, request, queryset: QuerySet):
#         if self.value() == '<10':
#             return queryset.filter(inventory_count__lt=10)

#         return queryset


# @admin.register(ChatbotClient)
# class ChatbotClientAdmin(admin.ModelAdmin):
#     list_display = ('name', 'email', 'phone', 'created_at')
#     search_fields = ('name', 'email', 'phone')
#     list_filter = ('created_at',)
#     ordering = ('-created_at',)
#     readonly_fields = ('created_at', 'updated_at')


# @admin.register(models.Product)
# class ProductAdmin(admin.ModelAdmin):
#     autocomplete_fields = ['collection']
#     prepopulated_fields = {'slug': ['title']}
#     actions = ['clear_inventory']

#     list_display = [
#         'title',
#         'unit_price',
#         'inventory_status',
#         'collection_title',
#     ]

#     list_editable = ['unit_price']
#     list_filter = ['collection', 'last_update', InventoryFilter]
#     list_per_page = 10
#     list_select_related = ['collection']

#     @admin.display(ordering='inventory_count')
#     def inventory_status(self, product):
#         if product.inventory_count < 10:
#             return 'Low'
#         return 'OK'

#     @admin.action(description='Clear inventory')
#     def clear_inventory(self, request, queryset):
#         updated_count = queryset.update(inventory_count=0)

#         self.message_user(
#             request,
#             f'{updated_count} products were successfully updated.',
#             messages.ERROR,
#         )

#     @admin.display(ordering='collection')
#     def collection_title(self, product):
#         return product.collection.title


# @admin.register(models.ChatBotForm)
# class ChatBotFormAdmin(admin.ModelAdmin):
#     list_display = [
#         'client',
#         'created_at',
#         'updated_at',
#     ]

#     list_per_page = 10


# @admin.register(models.OrderItem)
# class OrderItemAdmin(admin.ModelAdmin):
#     list_display = [
#         'order',
#         'product',
#         'quantity',
#         'unit_price',
#     ]

#     list_per_page = 10


# @admin.register(models.Collection)
# class CollectionAdmin(admin.ModelAdmin):
#     list_display = [
#         'title',
#         'products_count',
#     ]

#     search_fields = ['title']
#     list_filter = ['products']
#     list_per_page = 10

#     @admin.display(ordering='products_count')
#     def products_count(self, collection):
#         url = (
#             reverse('admin:api_product_changelist')
#             + '?'
#             + urlencode({
#                 'collection__id': str(collection.id),
#             })
#         )

#         return format_html(
#             '<a href="{}">{} </a>',
#             url,
#             collection.products_count,
#         )

#     def get_queryset(self, request):
#         return (
#             super()
#             .get_queryset(request)
#             .annotate(products_count=Count('products'))
#         )


# @admin.register(models.Customer)
# class CustomerAdmin(admin.ModelAdmin):
#     list_display = [
#         'name',
#         'email',
#         'phone',
#         'membership',
#     ]

#     list_editable = ['membership']
#     ordering = ['user__first_name', 'user__last_name']
#     list_filter = ['membership']
#     list_per_page = 10
#     list_select_related = ['user']
#     search_fields = [
#         'name__istartswith',
#         'email__istartswith',
#         'phone__istartswith',
#     ]

#     @admin.display(ordering='orders_count')
#     def order(self, customer):
#         url = (
#             reverse('admin:api_order_changelist')
#             + '?'
#             + urlencode({
#                 'customer_id': str(customer.id),
#             })
#         )

#         return format_html(
#             '<a href="{}">View Orders</a>',
#             url,
#         )


# class OrderItemInline(admin.TabularInline):
#     autocomplete_fields = ['product']
#     min_num = 1
#     max_num = 10
#     model = models.OrderItem
#     extra = 0


# @admin.register(models.Order)
# class OrderAdmin(admin.ModelAdmin):
#     autocomplete_fields = ['customer']
#     inlines = [OrderItemInline]
#     list_display = [
#         'id',
#         'placed_at',
#         'customer',
#         'payment_status',
#     ]

#     list_per_page = 10


# @admin.register(models.Address)
# class AddressAdmin(admin.ModelAdmin):
#     list_display = [
#         'customer',
#         'street',
#         'city',
#         'state',
#         'country',
#     ]

#     list_per_page = 10
