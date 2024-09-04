from server.mapper.Mapper import Mapper


class ProjectUserReferenceMapper(Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):
        pass

    def find_by_key(self, key):
        pass

    def get_user_by_project_id(self, key):
        result = []

        cursor = self._cnx.cursor()

        query = "SELECT user_id " \
                "FROM project_user_reference " \
                "WHERE project_id='{}'".format(key)

        cursor.execute(query)

        cursor_result = cursor.fetchall()
        for (user_id) in cursor_result:
            result.append(user_id[0])
        cursor.close()

        return result

    def insert(self, project_user_reference):

        cursor = self._cnx.cursor()
        command = "INSERT INTO  project_user_reference (project_id, user_id) VALUES " \
                  "(%s,%s)"
        data = (project_user_reference.get_project_id(),
                project_user_reference.get_user_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return project_user_reference

    def update(self, project):
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

    def delete(self, object):
        pass

    def find_all_projects_by_user(self, key):
        result = []

        cursor = self._cnx.cursor()

        query = "SELECT project_id " \
                "FROM project_user_reference " \
                "WHERE user_id='{}'".format(key)

        cursor.execute(query)

        cursor_result = cursor.fetchall()
        for (project_id) in cursor_result:
            result.append(project_id[0])
        cursor.close()

        return result
