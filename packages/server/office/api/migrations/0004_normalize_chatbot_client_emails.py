from django.db import migrations


def normalize_chatbot_client_emails(apps, schema_editor):
    ChatbotClient = apps.get_model("api", "ChatbotClient")
    database = schema_editor.connection.alias

    for client in ChatbotClient.objects.using(database).all().iterator():
        email = (client.email or "").strip().rstrip("?").strip()
        if email == client.email:
            continue

        duplicate = (
            ChatbotClient.objects.using(database)
            .filter(email__iexact=email)
            .exclude(pk=client.pk)
            .exists()
        )
        if not duplicate:
            ChatbotClient.objects.using(database).filter(pk=client.pk).update(
                email=email
            )


class Migration(migrations.Migration):
    dependencies = [("api", "0003_productimage")]

    operations = [
        migrations.RunPython(
            normalize_chatbot_client_emails,
            migrations.RunPython.noop,
        ),
    ]
