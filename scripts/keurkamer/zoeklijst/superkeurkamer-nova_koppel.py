# -*- coding: utf-8 -*-
"""NOVA koppelen (28-11-2026): je eigen OpenAI-sleutel in de Windows-kluis zetten, zodat Nova in de Superkeurkamer kan meekijken.
De sleutel wordt nergens getoond of opgeslagen in een bestand. Weghalen: start dit opnieuw en druk alleen op Enter."""
import getpass, sys
try:
    import keyring
except ImportError:
    print('Het onderdeel keyring ontbreekt. Typ eerst: py -m pip install keyring'); input('Enter om te sluiten'); sys.exit(1)
DIENST, NAAM = 'LeukeKeuze NOVA', 'openai'
print('NOVA koppelen aan de Superkeurkamer')
print('Plak je OpenAI-sleutel (begint met sk-) en druk op Enter. Je ziet niets als je plakt; dat is goed.')
print('Leeg laten en Enter = de sleutel weghalen.')
s = getpass.getpass('Sleutel: ').strip()
if not s:
    try:
        keyring.delete_password(DIENST, NAAM); print('De sleutel is weggehaald.')
    except Exception:
        print('Er stond geen sleutel.')
elif not s.startswith('sk-'):
    print('Dat lijkt geen OpenAI-sleutel (die beginnen met sk-). Niets bewaard.')
else:
    keyring.set_password(DIENST, NAAM, s); s = None
    print('Bewaard in de Windows-kluis. Herstart de Superkeurkamer niet nodig: druk in de keurkamer op Nova.')
input('Enter om te sluiten')
