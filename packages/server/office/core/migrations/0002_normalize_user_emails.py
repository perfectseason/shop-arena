from django.db import migrations


def normalize_user_emails(apps, schema_editor):
    User = apps.get_model("core", "User")
    database = schema_editor.connection.alias

    for user in User.objects.using(database).all().iterator():
        email = (user.email or "").strip().rstrip("?").strip()
        if email == user.email:
            continue

        duplicate = (
            User.objects.using(database)
            .filter(email__iexact=email)
            .exclude(pk=user.pk)
            .exists()
        )
        if not duplicate:
            User.objects.using(database).filter(pk=user.pk).update(email=email)


class Migration(migrations.Migration):
    dependencies = [("core", "0001_initial")]

    operations = [
        migrations.RunPython(
            normalize_user_emails,
            migrations.RunPython.noop,
        ),
    ]
