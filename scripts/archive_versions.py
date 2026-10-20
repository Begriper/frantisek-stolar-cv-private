"""Preserve existing CV versions for a private archive; never generates new CVs."""
from pathlib import Path
from zipfile import ZipFile
from io import BytesIO
from hashlib import sha256
import json
import shutil
import subprocess

ROOT = Path(__file__).resolve().parent.parent
ARCHIVE = ROOT / 'archive'
LANGUAGES = ['sk', 'cs', 'pl', 'de', 'en']
ORIGINAL = '72eab9efbb32d62ec0a738c94e604af0512b3d83'
SNAPSHOTS = [
    ('02-before-compact', 'local-before-compact-2026-09-22.zip', 'complete-source'),
    ('03-before-grouping', 'before-grouped-five-languages-2026-09-22.zip', 'complete-source'),
    ('04-before-balanced-layout', 'before-balanced-layout-2026-09-22.zip', 'complete-source'),
    ('05-before-typography', 'before-typography-20260922-205802.zip', 'partial-source'),
    ('06-before-inter', 'before-inter-20260922-211940.zip', 'partial-source'),
]


def copy_verified(source, destination):
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        assert source.read_bytes() == destination.read_bytes(), f'Archive conflict: {destination}'
    else:
        shutil.copy2(source, destination)
    assert sha256(source.read_bytes()).digest() == sha256(destination.read_bytes()).digest()


def extract_verified(archive, destination):
    for member in archive.infolist():
        name = Path(member.filename.replace('\\', '/'))
        assert not name.is_absolute() and '..' not in name.parts, member.filename
        target = destination / name
        assert target.resolve().is_relative_to(destination.resolve()), member.filename
        if member.is_dir():
            target.mkdir(parents=True, exist_ok=True)
            continue
        content = archive.read(member)
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists():
            assert target.read_bytes() == content, f'Archive conflict: {target}'
        else:
            target.write_bytes(content)
        assert target.read_bytes() == content


ARCHIVE.mkdir(exist_ok=True)
original_bytes = subprocess.run(['git', 'archive', '--format=zip', ORIGINAL],
                                cwd=ROOT, check=True, capture_output=True).stdout
original_path = ARCHIVE / 'backups/original-published-72eab9e.zip'
original_path.parent.mkdir(parents=True, exist_ok=True)
if not original_path.exists():
    original_path.write_bytes(original_bytes)
with ZipFile(BytesIO(original_bytes)) as source:
    extract_verified(source, ARCHIVE / 'snapshots/01-original-published')

versions = [{'id': '01-original-published', 'kind': 'complete-published-source',
             'commit': ORIGINAL, 'languages': LANGUAGES}]
for name, filename, kind in SNAPSHOTS:
    source = ROOT / '.review/backups' / filename
    copy_verified(source, ARCHIVE / 'backups' / filename)
    with ZipFile(source) as snapshot:
        extract_verified(snapshot, ARCHIVE / 'snapshots' / name)
    versions.append({'id': name, 'kind': kind, 'source': filename,
                     'languages': LANGUAGES,
                     'note': 'Files and original paths preserved; partial snapshots are not standalone sites.'})
for source in sorted((ROOT / '.review/backups').iterdir()):
    if source.is_file() and source.suffix in {'.json', '.bundle'}:
        copy_verified(source, ARCHIVE / 'backups' / source.name)

for source in sorted((ROOT / 'dist/downloads').glob('*.pdf')):
    copy_verified(source, ARCHIVE / 'pdfs/downloads' / source.name)
for source in sorted((ROOT / '.review').glob('*.pdf')):
    copy_verified(source, ARCHIVE / 'pdfs/saved-reviews' / source.name)

# Preserve the exact already-built website without re-rendering historical content.
preview = ARCHIVE / 'snapshots/07-current-generated-web'
for folder in LANGUAGES + ['css', 'js', 'img', 'fonts']:
    for source in sorted((ROOT / 'dist' / folder).rglob('*')):
        if source.is_file():
            copy_verified(source, preview / source.relative_to(ROOT / 'dist'))
for filename in ['index.html', 'CNAME', 'robots.txt']:
    source = ROOT / 'dist' / filename
    if source.exists():
        copy_verified(source, preview / filename)
versions.append({'id': '07-current-generated-web', 'kind': 'generated-web-preview',
                 'languages': LANGUAGES, 'note': 'Shared Inter design; final appearance approval pending.'})

files = []
for file in sorted(ARCHIVE.rglob('*')):
    if file.is_file() and file.name not in {'manifest.json', 'README.md'}:
        content = file.read_bytes()
        files.append({'path': file.relative_to(ARCHIVE).as_posix(), 'bytes': len(content),
                      'sha256': sha256(content).hexdigest()})
manifest = {'archivedOn': '2026-10-20', 'originalPublishedCommit': ORIGINAL,
            'firstGitCommit': 'ca6f4c2d1897a439302ca0559b892f94696a6a4b',
            'versions': versions, 'files': files,
            'pdfStatus': {'SK': 'Latest saved Inter design; verified two A4 pages.',
                          'CS/PL/DE/EN': 'Earlier saved design; not final Inter exports.'}}
(ARCHIVE / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(f'Preserved {len(versions)} source versions, {len(files)} files, '
      f'{len(list((ARCHIVE / "pdfs").rglob("*.pdf")))} saved PDFs.')
