from server.bo.BusinessObject import BusinessObject


class Posting(BusinessObject):

    def __init__(self):
        super().__init__()
        self._user = ""  # Festlegen der Person, welche die Zeit im System erfasst
        self._project_id = ""  # Festlegen der Projekt_id
        self._task_id = ""  # Festlegen des Tasks
        self.intervall = ""

    def get_user(self):
        return self._user

    def set_user(self, user):
        self._user = user

    def get_project_id(self):
        return self._project_id

    def set_project_id(self, project_id):
        self._project_id = project_id

    def get_task_id(self):
        return self._task_id

    def set_task_id(self, task_id):
        self._task_id = task_id

    def get_intervall(self):
        return self._intervall

    def set_intervall(self, intervall):
        self._intervall = intervall

    @staticmethod
    def from_dict(object_dict=dict()):
        """Umwandeln eines Python dict() in eine Buchung()."""
        obj = Posting()
        obj.set_modification_date()
        obj.set_user(object_dict["user"])
        obj.set_project_id(object_dict["project_id"])
        obj.set_task_id(object_dict["task_id"])
        obj.set_intervall(object_dict["intervall"])
        return obj

    def attributes_to_dict(self):
        return {"modification_date": self.set_modification_date,
                "user": self._user,
                "project_id": self._project_id,
                "task_id": self._task_id,
                "intervall": self._intervall}
