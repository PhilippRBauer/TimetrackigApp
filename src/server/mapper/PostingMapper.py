from server.mapper.Mapper import Mapper
from server.bo.Posting import Posting


class PostingMapper(Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):

        """Auslesen aller Buchungen """

        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from posting")
        tuples = cursor.fetchall()

        for (id, modification_date, user, project_id, task_id, intervall) in tuples:
            posting = Posting()
            posting.set_id(id)
            posting.set_modification_date()
            posting.set_user(user)
            posting.set_project_id(project_id)
            posting.set_task_id(task_id)
            posting.set_intervall(intervall)

            result.append(posting)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_key(self, key):

        """Auslesen einer spezifischen Buchung das der übergebenen ID entspricht """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, modification_date, user, project_id, task_id, intervall FROM posting " \
                  "WHERE id='{}'".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, modification_date, user, project_id, task_id) = tuples[0]
            posting = Posting()
            posting.set_id(id)
            posting.set_modification_date()
            posting.set_user(user)
            posting.set_project_id(project_id)
            posting.set_task_id(task_id)
            posting.set_intervall(intervall)
            result = posting

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_user(self, key):

        """Auslesen einer spezifischen Buchung das dem User entspricht """

        result = []

        cursor = self._cnx.cursor()
        command = "SELECT id, modification_date, user, project_id, task_id FROM posting WHERE user='{}'".format(
            key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, modification_date, user, project_id, task_id) in tuples:
            posting = Posting()
            posting.set_id(id)
            posting.set_modification_date()
            posting.set_user(user)
            posting.set_project_id(project_id)
            posting.set_task_id(task_id)

            result.append(posting)

        self._cnx.commit()
        cursor.close()
        return result

    def insert(self, posting):

        """Anlegen einer spezifischen Buchung """

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM posting ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """id wird um 1 hochgezählt"""
                posting.set_id(maxid[0] + 1)
            else:
                """Wenn es keine maximale ID gibt, ist die Tabelle vmtl. leer und wir beginnen mit 1"""
                posting.set_id(1)

        command = "INSERT INTO posting (id,  modification_date, user, project_id, task_id, intervall) VALUES (%s,%s,%s)"
        data = (posting.get_id(),
                posting.get_modification_date(),
                posting.get_user(),
                posting.set_project_id(),
                posting.set_task_id(),
                posting.set_intervall(),
                )
        cursor.execute(command, data)
        cursor.execute("INSERT INTO timeaccount_posting_reference (posting_id) SELECT id FROM posting")

        self._cnx.commit()
        cursor.close()
        return posting

    def update(self, posting):

        """Verändern einer spezifischen Buchung, das der übergebenen ID entspricht        
        """

        cursor = self._cnx.cursor()

        command = "UPDATE posting " + "SET modification_date=%s, user=%s WHERE id=%s"
        data = (posting.get_modification_date(),
                posting.get_user(),
                posting.get_id(),
                posting.set_project_id(),
                posting.set_task_id(),
                posting.set_intervall(),)

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, posting):

        """Löschen einer spezifischen Buchung, das der übergebenen ID entspricht        
        """

        cursor = self._cnx.cursor()

        command = "DELETE FROM posting WHERE id='{}'".format(posting.get_id())
        cursor.execute(command)

        self._cnx.commit()

    def find_all_timeaccount_by_posting(self, posting):

        """Auslesen aller Arbeitszeitkonten, die einer spezifischen Buchung entsprechen
            Hier wird die Posting_id als Schlüssel übergeben. Die Arbeitszeitkonto_id und die Buchungs_id 
            sind einer spezifischen Referenztabelle hinterlegt.        
        """

        result = []

        cursor = self._cnx.cursor()

        query = "SELECT timeaccount_id " \
                "FROM timeaccount_posting_reference " \
                "WHERE posting_id='{}'".format(posting)

        cursor.execute(query)

        cursor_result = cursor.fetchall()
        for (timeaccount_id) in cursor_result:
            result.append(timeaccount_id[0])
        cursor.close()

        return result

    def find_all_postings_by_user(self, user):

        """Auslesen aller Buchungen, die einem spezifischen Benutzer entsprechen.
           Hier wird die Benutzer_id als Key übergeben. Die Buchungs_id und die User_id sind in einer 
           spezifischen Referenztabelle hinterlegt.         
        """

        result = []

        cursor = self._cnx.cursor()

        query = "SELECT posting_id " \
                "FROM user_posting_reference " \
                "WHERE user_id='{}'".format(user)

        cursor.execute(query)

        cursor_result = cursor.fetchall()
        for (timeaccount_id) in cursor_result:
            result.append(timeaccount_id[0])
        cursor.close()

        return result

    def find_all_users_by_posting(self, posting):

        """Auslesen aller Benutzer, die einer spezifischen Buchung entsprechen.
           Hier wird die Buchungs_id als Key übergeben. Die Buchungs_id und die User_id sind in einer 
           spezifischen Referenztabelle hinterlegt.         
        """

        result = []

        cursor = self._cnx.cursor()

        query = "SELECT user_id " \
                "FROM user_posting_reference " \
                "WHERE posting_id='{}'".format(posting)

        cursor.execute(query)

        cursor_result = cursor.fetchall()
        for (user_id) in cursor_result:
            result.append(user_id[0])
        cursor.close()

        return result

    def find_all_postings_by_project(self, project):

        """Auslesen aller Buchungen, die einem spezifischen Benutzer entsprechen.
           Hier wird die Benutzer_id als Key übergeben. Die Buchungs_id und die User_id sind in einer
           spezifischen Referenztabelle hinterlegt.
        """

        result = []

        cursor = self._cnx.cursor()

        query = "SELECT id " \
                "FROM posting " \
                "WHERE project_id='{}'".format(project)

        cursor.execute(query)

        cursor_result = cursor.fetchall()
        for (project_id) in cursor_result:
            result.append(project_id[0])
        cursor.close()

        return result
