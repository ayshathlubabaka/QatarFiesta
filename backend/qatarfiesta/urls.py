
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [

    path('auth/', include('drf_social_oauth2.urls', namespace='drf')),
    
    path('dj-admin/', admin.site.urls),
    path('api/v1/admin/', include('myadmin.api.urls')),
    path('api/v1/accounts/', include('accounts.api.urls')),
    path('api/v1/organizer/', include('organizer.api.urls')),
    
] 
urlpatterns+= static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
