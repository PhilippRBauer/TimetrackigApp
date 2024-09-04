from server.bo.BusinessObject import BusinessObject


class TimeAccount(BusinessObject):

    def __init__(self):
        super().__init__()
        self._user = ""  # Festlegen des users dem das Arbeitszeitkonto gehört
        self._project = ""  # Festlegen des Projektes
        self._working_time = 0.0  # festlegen der tatsächlcihen Arbeitszeit
        self._task = 0  # Festlegen der Task

    def get_user(self):
        return self._user

    def set_user(self, user):
        self._user = user

    def get_project(self):
        return self._project

    def set_project(self, project):
        self._project = project

    def get_working_time(self):
        return self._working_time

    def set_working_time(self, working_time):
        self._working_time = working_time

    def get_task(self):
        return self._task

    def set_task(self, task):
        self._task = task

    def sum_arbeitszeiten(self):
        return self.sum_arbeitszeiten

    @staticmethod
    def from_dict(object_dict=dict()):
        """Umwandeln eines Python dict() in ein Arbeitszeitkonto()."""
        obj = TimeAccount()
        obj.set_modification_date()
        obj.set_user(object_dict["user"])
        obj.set_project(object_dict["project"])
        obj.set_working_time(object_dict["working_time"])
        obj.set_task(object_dict["task"])
        return obj

    def attributes_to_dict(self):
        return {"modification_date": self.set_modification_date,
                "user": self._user,
                "project": self._project,
                "working_time": self._working_time,
                "task": self._task}
