from server.mapper.Mapper import Mapper


class ConnectionMapper(Mapper):
    def insert(self, proposal):
        cursor = self._cnx.cursor()

        user_ids = proposal.get_connection()

        # iteriere durch jeden Listeneintrag des Connection Attributs
        for user in user_ids:
            command = "INSERT INTO project_user_reference (user_id,  project_id) VALUES (%s,%s)"
            data = (user,
                    proposal.get_id())
            cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return proposal

    def find_all(self):
        pass

    def find_by_key(self, proposal):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT project_id, user_id FROM project_user_reference WHERE project_id='{}'".format(
            proposal.get_id())
        cursor.execute(command)
        tuples = cursor.fetchall()
        return tuples

    def update(self, object):
        pass

    def delete(self, proposal):
        cursor = self._cnx.cursor()

        command = "DELETE FROM project_user_reference WHERE project_id ='{}'".format(proposal.get_id())

        cursor.execute(command)

        self._cnx.commit()
        cursor.close()
