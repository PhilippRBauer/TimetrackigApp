from server.mapper.Mapper import Mapper
from server.bo.TimeAccount import TimeAccount


class TimeAccountMapper(Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Arbeitszeitkonten
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from timeaccount")
        tuples = cursor.fetchall()

        for (id, modification_date, user, project, working_time, task) in tuples:
            timeaccount = TimeAccount()
            timeaccount.set_id(id)
            timeaccount.set_modification_date()
            timeaccount.set_user(user)
            timeaccount.set_project(project)
            timeaccount.set_working_time(working_time)
            timeaccount.set_task(task)
            result.append(timeaccount)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_user(self, user):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, modification_date, user, project, working_time, task FROM timeaccount WHERE user='{}'" \
            .format(user)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, modification_date, user, project, working_time, task) = tuples[0]
            timeaccount = TimeAccount()
            timeaccount.set_id(id)
            timeaccount.set_modification_date()
            timeaccount.set_user(user)
            timeaccount.set_project(project)
            timeaccount.set_working_time(working_time)
            timeaccount.set_task(task)
            result = timeaccount

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Auslesen eines spezifischen Arbeitszeitkontos das der übergebenen ID entspricht
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, modification_date, user, project, working_time, task FROM timeaccount WHERE id='{}'" \
            .format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, modification_date, user, project, working_time, task) = tuples[0]
            timeaccount = TimeAccount()
            timeaccount.set_id(id)
            timeaccount.set_modification_date()
            timeaccount.set_user(user)
            timeaccount.set_project(project)
            timeaccount.set_working_time(working_time)
            timeaccount.set_task(task)
            result = timeaccount

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, timeaccount):

        """Anlegen einer spezifischen Arbeitszeitkontos """

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM timeaccount")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """id wird um 1 hochgezählt"""
                timeaccount.set_id(maxid[0] + 1)
            else:
                """Wenn es keine maximale ID gibt, ist die Tabelle vmtl. leer und wir beginnen mit 1"""
                timeaccount.set_id(1)

        command = "INSERT INTO timeaccount (id,  modification_date, user, project, working_time, task) VALUES (%s,%s," \
                  "%s,%s,%s, %s) "
        data = (timeaccount.get_id(),
                timeaccount.get_modification_date(),
                timeaccount.get_user(),
                timeaccount.get_project(),
                timeaccount.get_working_time(),
                timeaccount.get_task())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return timeaccount

    def update(self, timeaccount):

        """Verändern einer spezifischen Arbeitszeitkontos, das der übergebenen ID entspricht        
        """

        cursor = self._cnx.cursor()

        command = "UPDATE timeaccount " + "SET modification_date=%s, user=%s, project=%s, working_time=%s, task=%s " \
                                          "WHERE id=%s "
        data = (timeaccount.get_modification_date(),
                timeaccount.get_user(),
                timeaccount.get_project(),
                timeaccount.get_working_time(),
                timeaccount.get_task(),
                timeaccount.get_id())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, timeaccount):
        cursor = self._cnx.cursor()

        command = "DELETE FROM timeaccount WHERE id='{}'".format(timeaccount.get_id())
        cursor.execute(command)

        self._cnx.commit()

    def find_all_postings_by_timeaccount(self, timeaccount):
        result = []

        cursor = self._cnx.cursor()

        query = "SELECT posting_id " \
                "FROM timeaccount_posting_reference " \
                "WHERE timeaccount_id='{}'".format(timeaccount)

        cursor.execute(query)

        cursor_result = cursor.fetchall()
        for (posting_id) in cursor_result:
            result.append(posting_id[0])
        cursor.close()

        return result

    def find_all_timeaccounts_by_user(self, timeaccount):
        result = []

        cursor = self._cnx.cursor()

        query = "SELECT user_id " \
                "FROM user_timeaccount_reference " \
                "WHERE timeaccount_id='{}'".format(timeaccount)

        cursor.execute(query)

        cursor_result = cursor.fetchall()
        for (user_id) in cursor_result:
            result.append(user_id[0])
        cursor.close()

        return result
