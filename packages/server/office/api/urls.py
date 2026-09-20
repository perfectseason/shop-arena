from django.contrib import admin

from rest_framework_nested import routers

from . import views


# ============================================================
# ADMIN
# ============================================================

admin.site.site_header = "Shop Arena Admin Portal"
admin.site.site_title = "Admin Portal"


# ============================================================
# MAIN ROUTER
# ============================================================

router = routers.DefaultRouter()

router.register(
    "products",
    views.ProductViewSet,
    basename="products",
)

router.register(
    "collections",
    views.CollectionViewSet,
)

router.register(
    "carts",
    views.CartViewSet,
)

router.register(
    "customer",
    views.CustomerViewSet,
)

router.register(
    "orders",
    views.OrderViewSet,
    basename="orders",
)


# ============================================================
# CART NESTED ROUTER
# ============================================================

carts_router = routers.NestedDefaultRouter(
    router,
    "carts",
    lookup="cart",
)

carts_router.register(
    "items",
    views.CartItemViewSet,
    basename="cart-items",
)


# ============================================================
# PRODUCT NESTED ROUTER
# ============================================================

products_router = routers.NestedDefaultRouter(
    router,
    "products",
    lookup="product",
)

products_router.register(
    "reviews",
    views.ReviewViewSet,
    basename="product-reviews",
)


# ============================================================
# URL PATTERNS
# ============================================================

urlpatterns = (
    router.urls
    + products_router.urls
    + carts_router.urls
)

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path( 'clients/', ChatbotClientCreateView.as_view(),
#         name='chatbot-client-create',),
#     path('products/', views.ProductList.as_view()),
#     path('products/<int:pk/>', views.ProductDetail.as_view()),
#     path('collections/', views.CollectionList.as_view()),
#     path('collections/<int:pk>/', views.CollectionDetail, name='collection-deatail'),
# ]
