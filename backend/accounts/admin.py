from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Institution, User


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'contact_email', 'is_active', 'created_at')
    search_fields = ('name', 'code', 'contact_email')
    list_filter = ('is_active', 'created_at')
    ordering = ('name',)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        'username',
        'email',
        'role',
        'institution',
        'trainee_id_number',
        'is_active',
        'is_deleted',
        'is_staff',
    )
    list_filter = ('role', 'is_active', 'is_deleted', 'is_staff', 'institution')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'trainee_id_number')
    ordering = ('-date_joined',)
    fieldsets = BaseUserAdmin.fieldsets + (
        (
            'Vocational Trainer Details',
            {
                'fields': (
                    'role',
                    'institution',
                    'phone_number',
                    'trainee_id_number',
                    'is_deleted',
                    'deleted_at',
                )
            },
        ),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        (
            'Vocational Trainer Details',
            {
                'fields': (
                    'role',
                    'institution',
                    'phone_number',
                    'trainee_id_number',
                    'email',
                )
            },
        ),
    )
