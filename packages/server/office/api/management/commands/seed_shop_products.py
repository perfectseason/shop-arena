from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from api.models import Collection, Product


class Command(BaseCommand):
    help = "Seed Shop-Arena with collections and 15 demo products."

    COLLECTIONS = {
        "Featured Products": {
            "description": "Featured watches and popular products.",
            "featured_slug": "smart-watch",
        },
        "Electronics": {
            "description": "Smartphones, tablets, and electronic devices.",
            "featured_slug": "iphone",
        },
        "Fashion": {
            "description": "Ladies shoes and fashionable footwear.",
            "featured_slug": "ladies-shoes",
        },
        "Home Collection": {
            "description": "Bags, travel accessories, and lifestyle products.",
            "featured_slug": "leather-bag",
        },
    }

    PRODUCTS = [
        # FEATURED PRODUCTS
        {
            "title": "Smart Watch",
            "slug": "smart-watch",
            "price": "120.00",
            "collection": "Featured Products",
            "description": "A stylish smart watch for everyday use.",
        },
        {
            "title": "Classic Watch",
            "slug": "classic-watch",
            "price": "85.00",
            "collection": "Featured Products",
            "description": "A classic watch with an elegant design.",
        },
        {
            "title": "Premium Watch",
            "slug": "premium-watch",
            "price": "450.00",
            "collection": "Featured Products",
            "description": "A premium watch for a sophisticated look.",
        },

        # ELECTRONICS
        {
            "title": "iPhone",
            "slug": "iphone",
            "price": "850.00",
            "collection": "Electronics",
            "description": "A modern smartphone for communication and entertainment.",
        },
        {
            "title": "iPhone Pro",
            "slug": "iphone-pro",
            "price": "920.00",
            "collection": "Electronics",
            "description": "A premium smartphone with advanced features.",
        },
        {
            "title": "iPhone Mini",
            "slug": "iphone-mini",
            "price": "550.00",
            "collection": "Electronics",
            "description": "A compact smartphone for everyday use.",
        },
        {
            "title": "Tablet",
            "slug": "tablet",
            "price": "320.00",
            "collection": "Electronics",
            "description": "A versatile tablet for work, learning, and entertainment.",
        },

        # FASHION
        {
            "title": "Ladies Shoes",
            "slug": "ladies-shoes",
            "price": "95.00",
            "collection": "Fashion",
            "description": "Stylish ladies shoes for different occasions.",
        },
        {
            "title": "Casual Shoes",
            "slug": "casual-shoes",
            "price": "130.00",
            "collection": "Fashion",
            "description": "Comfortable casual shoes for everyday wear.",
        },
        {
            "title": "Elegant Shoes",
            "slug": "elegant-shoes",
            "price": "180.00",
            "collection": "Fashion",
            "description": "Elegant footwear for formal and special occasions.",
        },
        {
            "title": "Everyday Shoes",
            "slug": "everyday-shoes",
            "price": "110.00",
            "collection": "Fashion",
            "description": "Practical shoes designed for daily activities.",
        },
        {
            "title": "Comfort Shoes",
            "slug": "comfort-shoes",
            "price": "65.00",
            "collection": "Fashion",
            "description": "Comfortable footwear for everyday use.",
        },

        # HOME COLLECTION
        {
            "title": "Leather Bag",
            "slug": "leather-bag",
            "price": "440.00",
            "collection": "Home Collection",
            "description": "A stylish leather bag for everyday essentials.",
        },
        {
            "title": "Traveller Bag",
            "slug": "traveller-bag",
            "price": "570.00",
            "collection": "Home Collection",
            "description": "A spacious bag for travel and personal belongings.",
        },
        {
            "title": "Ladies Bag",
            "slug": "ladies-bag",
            "price": "320.00",
            "collection": "Home Collection",
            "description": "A fashionable bag for everyday use and outings.",
        },
    ]

    @transaction.atomic
    def handle(self, *args, **options):
        collections = {}

        # Step 1: Create or update the four collections.
        for title, data in self.COLLECTIONS.items():
            collection, created = Collection.objects.update_or_create(
                title=title,
                defaults={
                    "description": data["description"],
                },
            )

            collections[title] = collection

            action = "Created" if created else "Updated"
            self.stdout.write(f"{action} collection: {title}")

        # Step 2: Create or update all 15 products.
        products = {}

        for item in self.PRODUCTS:
            collection = collections[item["collection"]]

            product, created = Product.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "title": item["title"],
                    "description": item["description"],
                    "unit_price": Decimal(item["price"]),
                    "inventory_count": 10,
                    "collection": collection,
                },
            )

            products[item["slug"]] = product

            action = "Created" if created else "Updated"
            self.stdout.write(
                f"{action} product: {product.title} "
                f"(ID: {product.id}, price: ${product.unit_price})"
            )

        # Step 3: Set a featured product for each collection.
        for title, data in self.COLLECTIONS.items():
            collection = collections[title]
            featured_product = products[data["featured_slug"]]

            if collection.featured_product_id != featured_product.id:
                collection.featured_product = featured_product
                collection.save(update_fields=["featured_product"])

        self.stdout.write(
            self.style.SUCCESS(
                "\nShop-Arena seeding completed successfully. "
                f"{len(collections)} collections and "
                f"{len(products)} products are ready."
            )
        )