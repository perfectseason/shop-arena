from rest_framework import permissions


class IsAdminOnReadOnly(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:  # pyright: ignore[reportIncompatibleMethodOverride]
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)



class FullDjangoModelPermissions(permissions.DjangoModelPermissions):
    def __init__(self) -> None:
        self.perms_map['GET'] = ['%(app_label)s.view_%(model_name)s']



class ViewCustomerHistoryPermission(permissions.BasePermission):
    """Allow users with permission to view customer history."""

    # pylint: disable=too-few-public-methods
    def has_permission(self, request, view):
        return request.user.has_perm('store.view_history')

    