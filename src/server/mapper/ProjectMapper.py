from server.mapper.Mapper import Mapper
from server.bo.Project import Project
from server.bo.Task import Task


class ProjectMapper(Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Projekte
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT id, modification_date, description, client, TIME_FORMAT(duration, '%H:%i')" 
                       " AS duration FROM project")
        tuples = cursor.fetchall()

        for (id, modification_date, description, client, duration) in tuples:
            project = Project()
            project.set_id(id)
            project.set_modification_date()
            project.set_description(description)
            project.set_client(client)
            project.set_duration(duration)
            result.append(project)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_key(self, key):
        """Auslesen eines spezifischen Projekts das der übergebenen ID entspricht
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, modification_date, description, client, TIME_FORMAT(duration, '%H:%i')" \
                  " AS duration FROM project WHERE id='{}'".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, modification_date, description, client, duration) = tuples[0]
            project = Project()
            project.set_id(id)
            project.set_modification_date()
            project.set_description(description)
            project.set_client(client)
            project.set_duration(duration)
            result = project

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, project):

        """Anlegen eines spezifischen Projektes """

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM project ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """id wird um 1 hochgezählt"""
                project.set_id(maxid[0] + 1)
            else:
                """Wenn es keine maximale ID gibt, ist die Tabelle vmtl. leer und wir beginnen mit 1"""
                project.set_id(1)

        command = "INSERT INTO project (id, modification_date, description, client, duration) VALUES " \
                  "(%s,%s,%s,%s,%s)"
        data = (project.get_id(),
                project.get_modification_date(),
                project.get_description(),
                project.get_client(),
                project.get_duration())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return project

    def update(self, project):

        """Verändern einer spezifischen Projektes, das der übergebenen ID entspricht        
        """

        cursor = self._cnx.cursor()

        command = "UPDATE project " + "SET modification_date=%s, description=%s, client=%s, duration=%s WHERE id=%s "
        data = (project.get_modification_date(),
                project.get_description(),
                project.get_client(),
                project.get_duration(),
                project.get_id())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, project):

        """Löschen eines spezifischen Projektes, das der übergebenen ID entspricht        
        """

        cursor = self._cnx.cursor()

        command = "DELETE FROM project WHERE id='{}'".format(project.get_id())
        cursor.execute(command)

        self._cnx.commit()

    def find_by_project(self, project):

        result = []

        cursor = self._cnx.cursor()

        command = "SELECT * FROM task WHERE project='{}'".format(project)

        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, modification_date, capacity, user, project, description) in tuples:
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
