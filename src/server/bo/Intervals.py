from server.bo.Posting import Posting
import json


class Intervals(Posting):

    def __init__(self):
        super().__init__()
        self._von = ''  # Start Datum und Uhrzeit des Intervals
        self._bis = ''  # Start Datum und Uhrzeit des Intervals
        self._intervall = ''  # time

    def get_von(self):
        return self._von

    def set_von(self, von):
        self._von = von

    def get_bis(self):
        return self._bis

    def set_bis(self, bis):
        self._bis = bis

    def get_intervall(self):
        return self._intervall

    def set_intervall(self, intervall):
        self._intervall = intervall

    def intervalling(self):
        intervalling = json.dumps(self.attributes_to_dict())
        return self._bis.datetime.strptime("%Y-%m-%d %H:%M") - self._von.datetime.strptime("%Y-%m-%d %H:%M")

    @staticmethod
    def from_dict(object_dict=dict()):
        """Umwandeln eines Python dict() in ein Interval()."""
        obj = Intervals()
        obj.set_modification_date()
        obj.set_user(object_dict["user"])
        obj.set_project_id(object_dict["project_id"])
        obj.set_task_id(object_dict["task_id"])
        obj.set_von(object_dict["von"])
        obj.set_bis(object_dict["bis"])
        return obj

    def attributes_to_dict(self):
        return {"modification_date": self.set_modification_date,
                "user": self.set_user,
                "project_id": self.set_project_id,
                "user_id": self.set_user(),
                "von": self._von,
                "bis": self._bis,
                "intervall": self._intervall}
