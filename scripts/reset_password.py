"""
Standalone script to list users and reset a user's password in a sqlite DB used by the app.
Usage:
    python scripts/reset_password.py --list
    python scripts/reset_password.py --username minhha --password NewPass123

Default DB path: instance/scheduler.db
"""
import argparse
import sqlite3
from pathlib import Path
from werkzeug.security import generate_password_hash

DEFAULT_DB = Path(__file__).resolve().parents[1] / 'instance' / 'scheduler.db'

parser = argparse.ArgumentParser(description='List users or reset a user password in the scheduler DB')
parser.add_argument('--db', help='Path to sqlite DB', default=str(DEFAULT_DB))
parser.add_argument('--list', action='store_true', help='List users')
parser.add_argument('--username', help='Username to reset')
parser.add_argument('--password', help='New password')
args = parser.parse_args()

db_path = Path(args.db)
if not db_path.exists():
    print(f"DB not found at {db_path}")
    raise SystemExit(1)

conn = sqlite3.connect(str(db_path))
cur = conn.cursor()

if args.list:
    cur.execute("SELECT id, username, email, role, created_at FROM user ORDER BY id;")
    rows = cur.fetchall()
    if not rows:
        print('No users found')
    else:
        print('Users:')
        for r in rows:
            print(f'id={r[0]} username={r[1]} email={r[2]} role={r[3]} created_at={r[4]}')
    conn.close()
    raise SystemExit(0)

if args.username and args.password:
    username = args.username
    new_password = args.password
    cur.execute("SELECT id, username FROM user WHERE username=?", (username,))
    row = cur.fetchone()
    if not row:
        print(f"User '{username}' not found in DB {db_path}")
        conn.close()
        raise SystemExit(1)

    new_hash = generate_password_hash(new_password)
    cur.execute("UPDATE user SET password_hash=? WHERE username=?", (new_hash, username))
    conn.commit()
    print(f"Password for user '{username}' has been updated.")
    conn.close()
    raise SystemExit(0)

parser.print_help()
conn.close()