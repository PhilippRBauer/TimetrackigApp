from server.bo.BusinessObject import BusinessObject


class Project(BusinessObject):
    def __init__(self):
        super().__init__()
        self._description = ""  # Festlegen der Projektbeschreibung
        self._client = ""  # Festlegen des Kundes des Projektes
        self._duration = ""  # Festlegen der geplanten Projektdauer
        self._project_time = 0.0  # festlegen der tatsächlichen Projektlaufzeit
        self._connection = []

    def get_description(self):
        return self._description

    def set_description(self, description):
        self._description = description

    def get_client(self):
        return self._client

    def set_client(self, client):
        self._client = client

    def get_duration(self):
        return self._duration

    def set_duration(self, duration):
        self._duration = duration

    def get_connection(self):
        return self._connection

    def set_connection(self, connection):
        self._connection = connection

    @staticmethod
    def from_dict(object_dict=dict()):
        """Umwandeln eines Python dict() in ein Projekt(). Umfasst auch die mögliche Übergabe
        von Usern als Connection"""
        obj = Project()
        obj.set_modification_date()
        obj.set_description(object_dict["description"])
        obj.set_client(object_dict["client"])
        obj.set_duration(object_dict["duration"])
        obj.set_connection(object_dict["connection"])
        return obj

    def attributes_to_dict(self):
        return {"modification_date": self.set_modification_date,
                "description": self._description,
                "client": self._client,
                "duration": self._duration}
