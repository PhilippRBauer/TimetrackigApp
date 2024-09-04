from server.mapper.Mapper import Mapper
from server.bo.Event import Event


class EventMapper(Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):

        """Auslesen aller Events """

        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from event")
        tuples = cursor.fetchall()

        for (id, modification_date, user, time, typ) in tuples:
            event = Event()
            event.set_id(id)
            event.set_modification_date()
            event.set_user(user)
            event.set_time(time)
            event.set_typ(typ)

            result.append(event)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_key(self, key):

        """Auslesen eines spezifischen Events das der übergebenen ID entspricht """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, modification_date, user, time, typ FROM event WHERE id='{}'".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, modification_date, user, time, typ) = tuples[0]
            event = Event()
            event.set_id(id)
            event.set_modification_date()
            event.set_time(time)
            event.set_typ(typ)
            result = event

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, event):

        """Anlegen eines spezifischen Events  """

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM event ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """id wird um 1 hochgezählt"""
                event.set_id(maxid[0] + 1)
            else:
                """Wenn es keine maximale ID gibt, ist die Tabelle vmtl. leer und wir beginnen mit 1"""
                event.set_id(1)

        command = "INSERT INTO event (id,  modification_date, user, time, typ) VALUES (%s,%s,%s,%s,%s)"
        data = (event.get_id(),
                event.get_modification_date(),
                event.get_user(),
                event.get_time(),
                event.get_typ())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return event

    def update(self, event):

        """Verändern eines spezifischen Events, das der übergebenen ID entspricht        
        """

        cursor = self._cnx.cursor()

        command = "UPDATE event " + "SET modification_date=%s, user=%s, time=%s, typ=%s WHERE id=%s "
        data = (event.get_modification_date(),
                event.get_user(),
                event.get_time(),
                event.get_typ(),
                event.get_id())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, event):

        """Löschen eines spezifischen Events, das der übergebenen ID entspricht        
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM event WHERE id='{}'".format(event.get_id())
        cursor.execute(command)

        self._cnx.commit()
