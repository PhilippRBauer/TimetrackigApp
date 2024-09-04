from server.mapper.Mapper import Mapper
from datetime import *
from server.bo.Intervals import Intervals


class IntervalsMapper(Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):

        """Auslesen aller Intervalle
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute(
            "SELECT id, modification_date, user, project_id, task_id, von, bis, TIME_FORMAT(intervall,"
            " '%H:%i') AS intervall FROM intervals")
        tuples = cursor.fetchall()

        for (id, modification_date, user, project_id, task_id, von, bis, intervall) in tuples:
            intervals = Intervals()
            intervals.set_id(id)
            intervals.set_modification_date()
            intervals.set_user(user)
            intervals.set_project_id(project_id)
            intervals.set_task_id(task_id)
            intervals.set_von(von)
            intervals.set_bis(bis)
            intervals.set_intervall(intervall)

            result.append(intervals)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_key(self, key):

        """Auslesen eines spezifischen Intervals das der übergebenen ID entspricht
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, modification_date, user, project_id, task_id, von, bis, " \
                  "intervall FROM intervals WHERE id='{}'".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, modification_date, user, project_id, task_id, von, bis, intervall) = tuples[0]
            intervals = Intervals()
            intervals.set_id(id)
            intervals.set_modification_date()
            intervals.set_user(user)
            intervals.set_project_id(project_id)
            intervals.set_task_id(task_id)
            intervals.set_von(von)
            intervals.set_bis(bis)
            intervals.set_intervall(intervall)

            result = intervals

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, intervals):

        """Anlegen eines spezifischen Intervals """

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM intervals")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """id wird um 1 hochgezählt"""
                intervals.set_id(maxid[0] + 1)
            else:
                """Wenn es keine maximale ID gibt, ist die Tabelle vmtl. leer und wir beginnen mit 1"""
                intervals.set_id(1)

        # Calculate Intervall for use in getter
        intervals.set_intervall(self.calculate_intervall(intervals))

        command = "INSERT INTO intervals (id, modification_date, user, project_id, task_id, von, bis, intervall) " \
                  "VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"
        data = (intervals.get_id(),
                intervals.get_modification_date(),
                intervals.get_user(),
                intervals.get_project_id(),
                intervals.get_task_id(),
                intervals.get_von(),
                intervals.get_bis(),
                intervals.get_intervall())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return intervals

    def update(self, intervals):

        """Verändern eines spezifischen Intervals, das der übergebenen ID entspricht        
        """
        cursor = self._cnx.cursor()

        # Intetvall bei Update berechnen
        intervals.set_intervall(self.calculate_intervall(intervals))

        command = "UPDATE intervals " + \
                  "SET modification_date=%s, user=%s, project_id=%s, task_id=%s, von=%s, bis=%s, " \
                  "intervall=%s WHERE id=%s "
        data = (intervals.get_id(),
                intervals.get_modification_date(),
                intervals.get_user(),
                intervals.get_project_id(),
                intervals.get_task_id(),
                intervals.get_von(),
                intervals.get_bis(),
                intervals.get_intervall())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, intervals):

        """Löschen eines spezifischen Intervals, das der übergebenen ID entspricht        
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM intervals WHERE id='{}'".format(
            intervals.get_id())
        cursor.execute(command)

        self._cnx.commit()

    def calculate_intervall(self, intervals):
        von = datetime.strptime(intervals.get_von(), "%Y-%m-%dT%H:%M")
        bis = datetime.strptime(intervals.get_bis(), "%Y-%m-%dT%H:%M")
        return bis - von

    def find_all_timeaccount_by_intervals(self, intervals):

        """Auslesen aller Arbeitszeitkonten, die einer spezifischen Buchung entsprechen
            Hier wird die Posting_id als Schlüssel übergeben. Die Arbeitszeitkonto_id und die Buchungs_id
            sind einer spezifischen Referenztabelle hinterlegt.
        """

        result = []

        cursor = self._cnx.cursor()

        query = "SELECT timeaccount_id " \
                "FROM timeaccount_intervals_reference " \
                "WHERE intervals_id='{}'".format(intervals)

        cursor.execute(query)

        cursor_result = cursor.fetchall()
        for (timeaccount_id) in cursor_result:
            result.append(timeaccount_id[0])
        cursor.close()

        return result

    def find_all_intervals_by_user(self, user):

        result = []

        cursor = self._cnx.cursor()

        query = "SELECT id " \
                "FROM intervals " \
                "WHERE user='{}'".format(user)

        cursor.execute(query)

        cursor_result = cursor.fetchall()
        for (intervals_id) in cursor_result:
            result.append(intervals_id[0])
        cursor.close()

        return result

    def find_all_intervals_by_project(self, project_id):
        result = []

        cursor = self._cnx.cursor()

        query = "SELECT id " \
                "FROM intervals " \
                "WHERE project_id='{}'".format(project_id)

        cursor.execute(query)

        cursor_result = cursor.fetchall()
        for (intervals_id) in cursor_result:
            result.append(intervals_id[0])
        cursor.close()

        return result

    def find_all_intervals_by_task(self, task_id):
        result = []

        cursor = self._cnx.cursor()

        query = "SELECT id " \
                "FROM intervals " \
                "WHERE task_id='{}'".format(task_id)

        cursor.execute(query)

        cursor_result = cursor.fetchall()
        for (intervals_id) in cursor_result:
            result.append(intervals_id[0])
        cursor.close()

        return result


if __name__ == "__main__":
    with IntervalsMapper() as mapper:
        result = mapper.find_all()
        for interval in result:
            print(interval)
