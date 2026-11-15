# Landschap-keurkamer LeukeKeuze (15-11-2026)
# Kleine server op deze laptop: toont app/index.html en bewaart de keuzes in 'mijn keuzes/weg-landschap.json'.
# Alleen standaard-Python. Starten: python programma\server.py   (--geen-browser = geen nieuw venster openen)
import os, sys, json, socket, threading, webbrowser, datetime, shutil
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

POORT = 8790
HIER = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(HIER, 'app')
KEUZES = os.path.join(HIER, 'mijn keuzes')
BESTAND = os.path.join(KEUZES, 'weg-landschap.json')
RESERVE = os.path.join(KEUZES, 'reservekopie')


class Hand(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=APP, **k)

    def log_message(self, *a):
        pass

    def stuur(self, data, code=200):
        b = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def end_headers(self):
        if self.path.endswith('.html') or self.path == '/':
            self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_GET(self):
        if self.path.startswith('/api/keuzes'):
            try:
                with open(BESTAND, encoding='utf-8') as f:
                    return self.stuur(json.load(f))
            except FileNotFoundError:
                return self.stuur({'weg': []})
            except Exception as e:
                return self.stuur({'fout': str(e), 'weg': []}, 500)
        return super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/bewaar'):
            try:
                n = int(self.headers.get('Content-Length') or 0)
                data = json.loads(self.rfile.read(n).decode('utf-8'))
                if not isinstance(data, dict) or not isinstance(data.get('weg'), list):
                    return self.stuur({'fout': 'vorm klopt niet'}, 400)
                os.makedirs(RESERVE, exist_ok=True)
                tmp = BESTAND + '.tmp'
                with open(tmp, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=1)
                os.replace(tmp, BESTAND)
                dag = datetime.date.today().strftime('%Y-%m-%d')
                shutil.copyfile(BESTAND, os.path.join(RESERVE, 'weg-landschap-' + dag + '.json'))
                return self.stuur({'ok': True, 'aantal': len(data['weg'])})
            except Exception as e:
                return self.stuur({'fout': str(e)}, 500)
        self.stuur({'fout': 'onbekend'}, 404)


def draait_al():
    s = socket.socket()
    s.settimeout(0.5)
    try:
        return s.connect_ex(('127.0.0.1', POORT)) == 0
    finally:
        s.close()


if __name__ == '__main__':
    url = 'http://localhost:%d/' % POORT
    if draait_al():
        if '--geen-browser' not in sys.argv:
            webbrowser.open(url)
        sys.exit(0)
    os.makedirs(KEUZES, exist_ok=True)
    srv = ThreadingHTTPServer(('127.0.0.1', POORT), Hand)
    print('Landschap-keurkamer draait op', url, '(dit venster open laten; sluiten = keurkamer uit)')
    if '--geen-browser' not in sys.argv:
        threading.Timer(1.0, lambda: webbrowser.open(url)).start()
    srv.serve_forever()
