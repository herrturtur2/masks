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

    # prevent duplicate entries
    ringcheck = c.execute("""select id, name from ring where name=?""", 
                          (ringname, ))
    if ringcheck.rowcount > 0:
        c.close()
        return

    c.execute("""insert into ring (id, name) values (NULL, ?)""", (ringname, ))
    conn.commit()
    c.close()


def getPersons(req):
    conn = sqlite3.connect(_DB_PATH)
    c = conn.cursor()
    persons = c.execute("""select id, name from person""")

    sendstring = """{"persons": ["""
    first = True
    for person in persons:
        if not first:
            sendstring += ','
        sendstring += '{"id": "' + str(person[0]) + '",'
        sendstring += '"name": "' + person[1] + '"}'
        first = False
    
    sendstring += """]}"""
    c.close()
    return sendstring


def deletePersonFromRing(req):
    f = req.form
    ringid = int(f['ringid'])
    personid = int(f['personid'])
    conn = sqlite3.connect(_DB_PATH)
    c = conn.cursor()
    
    c.execute("""delete from linkRingPerson where ringid=? and personid=?""", 
              (ringid, personid))
    conn.commit()
    c.close()


def addPersonToRing(req):
    f = req.form
    conn = sqlite3.connect(_DB_PATH)
    c = conn.cursor()
    
    personname = f['personname']
    ringid = f['ringid']

    # prevent duplicate entries in person table
    personcheck = c.execute("""select id from person where name=?""",
                            (personname, ))
    personid = None
    if not personcheck.rowcount:
        personid = personcheck[0][0]
    else:
        persons = c.execute("""insert into person values (NULL, ?)""", (personname, ))

        personid = None
        persons = c.execute("""select id from person where name=?""", (personname, ))
        for person in persons:
            personid = int(person[0])
    # prevent duplicate entries in linkRingPerson table
    linkcheck = c.execute("""select ringid, personid from linkRingPerson where ringid=? and personid=?""", (ringid, personid))
    if not linkcheck.rowcount:
        c.execute("""insert into linkRingPerson (ringid, personid) values (?, ?)""", (ringid, personid))
