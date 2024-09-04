from server.bo.BusinessObject import BusinessObject


class Task(BusinessObject):

    def __init__(self):
        super().__init__()
        self._capacity = ""  # Festlegen der Personenkapazität
        self._project = 0  # Festlegen des zueghörigen Projektes zur task
        self._user = ""  # Festlegen des Useres der die Task ausführt
        self._description = ""  # Festlegen der taskbeschreibung
        # self._task_time = 0.0 # Festlegen der tatsächlichen Taskzeit

    def get_capacity(self):
        return self._capacity

    def set_capacity(self, capacity):
        self._capacity = capacity

    def get_project(self):
        return self._project

    def set_project(self, project):
        self._project = project

    def get_user(self):
        return self._user

    def set_user(self, user):
        self._user = user

    def get_description(self):
        return self._description

    def set_description(self, description):
        self._description = description

    @staticmethod
    def from_dict(object_dict=dict()):
        """Umwandeln eines Python dict() in eine Task()."""
        obj = Task()
        obj.set_modification_date()
        obj.set_capacity(object_dict["capacity"])
        obj.set_project(object_dict["project"])
        obj.set_user(object_dict["user"])
        obj.set_description(object_dict["description"])
        return obj

    def attributes_to_dict(self):
        return {"modification_date": self.set_modification_date,
                "capacity": self._capacity,
                "project": self._project,
                "user": self._user,
                "description": self._description}
