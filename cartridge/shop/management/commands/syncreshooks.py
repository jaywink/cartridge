from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from mezzanine.conf import settings

from cartridge.shop.models import *

class Command(BaseCommand):
    help = 'Sync reservations from external hook'

    def handle(self, *args, **options):
        p = ReservableProduct.objects.all()[0]
        p.update_from_hook()

