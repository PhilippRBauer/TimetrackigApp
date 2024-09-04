from server.bo.BusinessObject import BusinessObject


class User(BusinessObject):
    def __init__(self):
        super().__init__()
        self._firstname = ""  # Festlegen des Vornames
        self._lastname = ""  # Festlegen des Nachnames
        self._email = ""  # Festlegen der Email
        self._username = ""  # Festlegen des Usernames
        self._guid = ""  # Festlegen der Google-User-id

    def get_firstname(self):
        return self._firstname

    def set_firstname(self, firstname):
        self._firstname = firstname

    def get_lastname(self):
        return self._lastname

    def set_lastname(self, lastname):
        self._lastname = lastname

    def get_email(self):
        return self._email

    def set_email(self, email):
        self._email = email

    def get_username(self):
        return self._username

    def set_username(self, username):
        self._username = username

    def get_guid(self):
        return self._guid

    def set_guid(self, guid):
        self._guid = guid

    @staticmethod
    def from_dict(object_dict=dict()):
        """Umwandeln eines Python dict() in einen User()."""
        obj = User()
        obj.set_modification_date()
        obj.set_firstname(object_dict["firstname"])
        obj.set_lastname(object_dict["lastname"])
        obj.set_email(object_dict["email"])
        obj.set_username(object_dict["username"])
        obj.set_guid(object_dict["guid"])
        return obj

    def attributes_to_dict(self):
        return {"modification_date": self.set_modification_date,
                "firstname": self._firstname,
                "lastname": self._lastname,
                "email": self._email,
                "username": self._username,
                "guid": self._guid}
