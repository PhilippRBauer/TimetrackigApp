from abc import ABC
from datetime import datetime


class BusinessObject(ABC):

    # BusinessObject ist die gemeinsame Superklasse, welche die Attribute Letzte Änderung und ID an alles
    # Subklassen vererbt

    def __init__(self):
        self._modification_date = datetime.now()  # Ausgabe des aktuellen Datums und Uhrzeit
        self._id = 0  # Jedes BusinessObject wird mit einer eindeutigen ID versehen

    def get_modification_date(self):
        return self._modification_date

    def set_modification_date(self):
        self._modification_date = datetime.fromtimestamp(datetime.timestamp(datetime.now()))

    def get_id(self):
        return self._id

    def set_id(self, value):
        self._id = value
