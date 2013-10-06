from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from mezzanine.conf import settings

from cartridge.shop.models import *

from datetime import timedelta

class Command(BaseCommand):
    help = 'Expire carts'

    def handle(self, *args, **options):
        old_carts = Cart.objects.filter(last_updated__lt=now()-timedelta(minutes=settings.SHOP_CART_EXPIRY_MINUTES))
        for old_cart in old_carts:
            for item in old_cart.items.all():
                item.delete()
            old_cart.delete()
