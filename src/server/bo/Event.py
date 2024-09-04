from server.bo.Posting import Posting


class Event(Posting):

    def __init__(self):
        super().__init__()
        self._time = ""  # Festlegen der Person, welche die Zeit im System erfasst
        self._typ = ""  # Festlegen des Typs des Events

    def get_time(self):
        return self._time

    def set_time(self, time):
        self._time = time

    def get_typ(self):
        return self._typ

    def set_typ(self, typ):
        self._typ = typ

    @staticmethod
    def from_dict(object_dict=dict()):
        """Umwandeln eines Python dict() in ein Event()."""
        obj = Event()
        obj.set_modification_date()
        obj.set_user(object_dict["user"])
        obj.set_time(object_dict["time"])
        obj.set_typ(object_dict["typ"])
        return obj

    def attributes_to_dict(self):
        return {"modification_date": self.set_modification_date,
                "user": self.set_user,
                "time": self._time,
                "typ": self._typ}
