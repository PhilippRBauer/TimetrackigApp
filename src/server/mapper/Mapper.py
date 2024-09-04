import mysql.connector as connector
import os
from abc import ABC, abstractmethod
from contextlib import AbstractContextManager


class Mapper(AbstractContextManager, ABC):

    def __init__(self):
        self._cnx = None

    def __enter__(self):

        if os.getenv('GAE_ENV', '').startswith('standard'):

            self._cnx = connector.connect(user='root', password='timetracker22',
                                          unix_socket='/cloudsql/timetrackersopra2022:europe-west3:time-db-team5',
                                          database='time_tracking')

        else:

            self._cnx = connector.connect(user='demo', password='demo',
                                          host='localhost', port='8889',
                                          database='time_tracking')

        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._cnx.close()

    @abstractmethod
    def find_all(self):
        pass

    @abstractmethod
    def find_by_key(self, key):
        pass

    @abstractmethod
    def insert(self, object):
        pass

    @abstractmethod
    def update(self, object):
        pass

    @abstractmethod
    def delete(self, object):
        pass
