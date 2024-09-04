from server.mapper.Mapper import Mapper
from server.bo.User import User


class UserMapper(Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Benutzer
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from user")
        tuples = cursor.fetchall()

        for (id, modification_date, firstname, lastname, email, username, guid) in tuples:
            user = User()
            user.set_id(id)
            user.set_modification_date()
            user.set_firstname(firstname)
            user.set_lastname(lastname)
            user.set_email(email)
            user.set_username(username)
            user.set_guid(guid)
            result.append(user)

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_email(self, email):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, modification_date, firstname, lastname, email, username, guid " \
                  "FROM user WHERE email='{}'".format(email)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, modification_date, firstname, lastname,
             email, username, guid) = tuples[0]
            user = User()
            user.set_id(id)
            user.set_modification_date()
            user.set_firstname(firstname)
            user.set_lastname(lastname)
            user.set_email(email)
            user.set_username(username)
            user.set_guid(guid)
            result = user

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_username(self, username):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, modification_date, firstname, lastname, email, username, guid " \
                  "FROM user WHERE username='{}'".format(username)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, modification_date, firstname, lastname,
             email, username, guid) = tuples[0]
            user = User()
            user.set_id(id)
            user.set_modification_date()
            user.set_firstname(firstname)
            user.set_lastname(lastname)
            user.set_email(email)
            user.set_username(username)
            user.set_guid(guid)
            result = user

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_guid(self, guid):
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, modification_date, firstname, lastname, email, username, guid " \
                  "FROM user WHERE guid='{}'".format(guid)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, modification_date, firstname, lastname,
             email, username, guid) = tuples[0]
            user = User()
            user.set_id(id)
            user.set_modification_date()
            user.set_firstname(firstname)
            user.set_lastname(lastname)
            user.set_email(email)
            user.set_username(username)
            user.set_guid(guid)
            result = user

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):

        """Auslesen eines spezifischen Benutzers das der übergebenen ID entspricht
        """

        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, modification_date, firstname, lastname, email, username, guid FROM " \
                  "user WHERE id='{}'".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, modification_date, firstname, lastname,
             email, username, guid) = tuples[0]
            user = User()
            user.set_id(id)
            user.set_modification_date()
            user.set_firstname(firstname)
            user.set_lastname(lastname)
            user.set_email(email)
            user.set_username(username)
            user.set_guid(guid)
            result = user

        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, user):

        """Anlegen einer spezifischen Benutzers """

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM user ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """id wird um 1 hochgezählt"""
                user.set_id(maxid[0] + 1)
            else:
                """Wenn es keine maximale ID gibt, ist die Tabelle vmtl. leer und wir beginnen mit 1"""
                user.set_id(1)

        command = "INSERT INTO user (id, modification_date, firstname, lastname, email, username, guid) " \
                  "VALUES (%s,%s,%s,%s,%s,%s,%s)"
        data = (user.get_id(),
                user.get_modification_date(),
                user.get_firstname(),
                user.get_lastname(),
                user.get_email(),
                user.get_username(),
                user.get_guid())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return user

    def update(self, user):

        """Verändern einer spezifischen Benutzers, das der übergebenen ID entspricht        
        """

        cursor = self._cnx.cursor()

        command = "UPDATE user " + "SET modification_date=%s, firstname=%s, lastname=%s, email=%s, username=%s, " \
                                   " guid=%s WHERE id=%s "
        data = (user.get_modification_date(),
                user.get_firstname(),
                user.get_lastname(),
                user.get_email(),
                user.get_username(),
                user.get_guid(),
                user.get_id())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, user):
        cursor = self._cnx.cursor()

        command = "UPDATE user SET firstname='Deleted', lastname='User' WHERE id='{}'".format(user.get_id())
        cursor.execute(command)

        self._cnx.commit()

    def find_all_users_by_project(self, project):
        result = []
        cursor = self._cnx.cursor()

        query = "SELECT user_id " \
                "FROM project_user_reference " \
                "WHERE project_id='{}'".format(project)

        cursor.execute(query)

        cursor_result = cursor.fetchall()
        for (user_id) in cursor_result:
            result.append(user_id[0])
        cursor.close()

        return result

    def find_all_users_by_posting(self, user):
        result = []
        cursor = self._cnx.cursor()

        query = "SELECT posting_id " \
                "FROM user_posting_reference " \
                "WHERE user_id='{}'".format(user)

        cursor.execute(query)

        cursor_result = cursor.fetchall()
        for (posting_id) in cursor_result:
            result.append(posting_id[0])
        cursor.close()

        return result

    def find_all_users_by_timeaccount(self, user):
        result = []
        cursor = self._cnx.cursor()

        query = "SELECT timeaccount_id " \
                "FROM user_timeaccount_reference " \
                "WHERE user_id='{}'".format(user)

        cursor.execute(query)

        cursor_result = cursor.fetchall()
        for (timeaccount_id) in cursor_result:
            result.append(timeaccount_id[0])
        cursor.close()

        return result
