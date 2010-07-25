# masks.py
# Joshua Marshall Moore
# 7/24/2010

import sqlite3
_DB_PATH = "C:\hope\www\masks\masks.db"
_conn = sqlite3.connect(_DB_PATH)
_c = _conn.cursor()
_c.execute("""create table if not exists ring (id int primary key, name text)""")
_c.execute("""create table if not exists person (id int primary key, name text)""")
_c.execute("""create table if not exists linkRingPerson(ringid int, personid int)""")
_conn.commit()
_c.close()


def getRings(req):
    conn = sqlite3.connect(_DB_PATH)
    c = conn.cursor()
    rings = c.execute("""select id, name from ring""")

    sendstring = """{"rings": ["""

    first = True
    for ring in rings:
        if not first:
            sendstring += ','
        sendstring += '{"id": "' + str(ring[0]) + '",'
        sendstring += '"name": "' + ring[1] + '"}'
        first = False

    sendstring += """]}"""
    c.close()
    return sendstring


def deleteRing(req):
    f = req.form
    ringid = int(f['ringid'])
    
    conn = sqlite3.connect(_DB_PATH)
    c = conn.cursor()
    c.execute("""delete from ring where id=?""", (ringid, ))
    conn.commit()
    c.close()

def addRing(req):
    f = req.form
    ringname = f['ringname']

    conn = sqlite3.connect(_DB_PATH)
    c = conn.cursor()
    c.execute("""insert into ring (id, name) values (NULL, ?)""", (ringname, ))
    conn.commit()
    c.close()
