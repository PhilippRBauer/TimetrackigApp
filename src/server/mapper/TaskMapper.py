from server.mapper.Mapper import Mapper
from server.bo.Task import Task


class TaskMapper(Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Aktivitäten
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from task")
        tuples = cursor.fetchall()

        for (id, modification_date, capacity, project, user, description) in tuples:
            task = Task()
            task.set_id(id)
            task.set_modification_date()
            task.set_capacity(capacity)
            task.set_project(project)
            task.set_user(user)
            task.set_description(description)
            result.append(task)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_user(self, user):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, modification_date, capacity, project, user, description FROM task WHERE user='{}'".format(
            user)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, modification_date, capacity, project, user, description) = tuples[0]
            task = Task()
            task.set_id(id)
            task.set_modification_date()
            task.set_capacity(capacity)
            task.set_project(project)
            task.set_user(user)
            task.set_description(description)
            result = task

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):

        """Auslesen einer spezifischen Aktivität das der übergebenen ID entspricht
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, modification_date, capacity, project, user, description FROM task WHERE id='{}'".format(
            key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, modification_date, capacity, project, user, description) = tuples[0]
            task = Task()
            task.set_id(id)
            task.set_modification_date()
            task.set_capacity(capacity)
            task.set_project(project)
            task.set_user(user)
            task.set_description(description)
            result = task

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, task):

        """Anlegen einer spezifischen Aktivität """

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM task ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """id wird um 1 hochgezählt"""
                task.set_id(maxid[0] + 1)
            else:
                """Wenn es keine maximale ID gibt, ist die Tabelle vmtl. leer und wir beginnen mit 1"""
                task.set_id(1)

        command = "INSERT INTO task (id, modification_date, capacity, project, user, description) VALUES " \
                  "(%s,%s,%s,%s,%s,%s)"

        data = (task.get_id(),
                task.get_modification_date(),
                task.get_capacity(),
                task.get_project(),
                task.get_user(),
                task.get_description())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return task

    def update(self, task):

        """Verändern einer spezifischen Aktivität, das der übergebenen ID entspricht        
        """

        cursor = self._cnx.cursor()

        command = "UPDATE task " + "SET modification_date=%s, capacity=%s, project=%s, user=%s, description=%s " \
                                   " WHERE id=%s "
        data = (task.get_modification_date(),
                task.get_capacity(),
                task.get_project(),
                task.get_user(),
                task.get_description(),
                task.get_id())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, task):
        cursor = self._cnx.cursor()

        command = "DELETE FROM task WHERE id='{}'".format(task.get_id())
        cursor.execute(command)

        self._cnx.commit()

    def find_all_tasks_by_project(self, project):

        result = []

        cursor = self._cnx.cursor()

        query = "SELECT id " \
                "FROM task " \
                "WHERE project='{}'".format(project)

        cursor.execute(query)

        cursor_result = cursor.fetchall()
        for (task_id) in cursor_result:
            result.append(task_id[0])
        cursor.close()

        return result
