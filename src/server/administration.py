from datetime import *

from server.mapper.UserMapper import UserMapper
from server.mapper.TimeAccountMapper import TimeAccountMapper
from server.mapper.TaskMapper import TaskMapper
from server.mapper.PostingMapper import PostingMapper
from server.mapper.ProjectMapper import ProjectMapper
from server.mapper.IntervalsMapper import IntervalsMapper
from server.mapper.EventMapper import EventMapper
from server.mapper.ConnectionMapper import ConnectionMapper
from server.mapper.ProjectUserReferenceMapper import ProjectUserReferenceMapper


class Administration(object):

    def __init__(self):
        pass

    # User
    def create_user(self, proposal):
        """Einen Benutzer anlegen"""
        with UserMapper() as mapper:
            return mapper.insert(proposal)

    def get_user_by_username(self, username):
        """Alle Benutzer mit Namen name auslesen."""
        with UserMapper() as mapper:
            return mapper.find_by_username(username)

    def get_user_by_id(self, number):
        """Den Benutzer mit der gegebenen ID auslesen."""
        with UserMapper() as mapper:
            return mapper.find_by_key(number)

    def get_user_by_guid(self, guid):
        """Den Benutzer mit der gegebenen Google ID auslesen."""
        with UserMapper() as mapper:
            return mapper.find_by_guid(guid)

    def get_user_by_email(self, email):
        """Alle Benutzer mit gegebener E-Mail-Adresse auslesen."""
        with UserMapper() as mapper:
            return mapper.find_by_email(email)

    def get_all_users(self):
        """Alle Benutzer auslesen."""
        with UserMapper() as mapper:
            return mapper.find_all()

    def save_user(self, user):
        """Den gegebenen Benutzer speichern."""
        with UserMapper() as mapper:
            mapper.update(user)

    def delete_user(self, user):
        """Den gegebenen Benutzer aus unserem System löschen."""
        with UserMapper() as mapper:
            mapper.delete(user)

    # Posting
    def create_posting(self, proposal):
        """Eine Buchung anlegen"""
        with PostingMapper() as mapper:
            return mapper.insert(proposal)

    def get_posting_by_id(self, number):
        """Die Buchung mit der gegebenen ID auslesen."""
        with PostingMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_postings(self):
        """Alle Buchungen auslesen."""
        with PostingMapper() as mapper:
            return mapper.find_all()

    def get_postings_by_userID(self, number):
        with PostingMapper() as mapper:
            return mapper.find_by_user(number)

    def save_posting(self, posting):
        """Die Buchung speichern."""
        with PostingMapper() as mapper:
            mapper.update(posting)

    def delete_posting(self, posting):
        """Die Buchung aus unserem System löschen."""
        with PostingMapper() as mapper:
            mapper.delete(posting)

    # project
    def create_project(self, proposal):
        """Ein Projekt anlegen"""
        with ProjectMapper() as mapper:
            # Übergebe Attribute mit Werten - inkl. Connection-List der User
            created_project = mapper.insert(proposal)
            # rufe insert methode aus dem Connection Mapper für die Verbindungstabelle auf
            self.create_connection(created_project)
            return created_project

    def get_project_by_id(self, number):
        """Das Projekt mit der gegebenen ID auslesen."""
        with ProjectMapper() as mapper:
            return mapper.find_by_key(number)

    def save_project(self, proposal):
        with ConnectionMapper() as mapper:
            existing_connections = mapper.find_by_key(proposal)
            if len(existing_connections) > 0:
                self.delete_connection(proposal)

        with ProjectMapper() as mapper:
            mapper.update(proposal)
            self.create_connection(proposal)

    def delete_project(self, project):
        """Das Projekt aus unserem System löschen."""
        with ProjectMapper() as mapper:
            task = self.get_task_by_project(project.get_id())

            if not (task is None):
                for t in task:
                    self.delete_task(t)

            mapper.delete(project)

    def get_project_by_description(self, description):
        """Alle Aktivitäten mit gegebenem Benutzer auslesen."""
        with ProjectMapper() as mapper:
            return mapper.find_by_description(description)

    # Task

    def create_task(self, proposal):
        """Eine Buchung anlegen"""
        with TaskMapper() as mapper:
            return mapper.insert(proposal)

    def get_task_by_user(self, user):
        """Alle Aktivitäten mit gegebenem Benutzer auslesen."""
        with TaskMapper() as mapper:
            return mapper.find_by_user(user)

    def get_task_by_id(self, number):
        """Die Aktivität mit der gegebenen ID auslesen."""
        with TaskMapper() as mapper:
            return mapper.find_by_key(number)

    def get_task_by_project(self, project):
        """Alle Aktivitäten mit gegebenem Projekt auslesen."""
        with ProjectMapper() as mapper:
            return mapper.find_by_project(project)

    def get_all_tasks(self):
        """Alle Aktivitäten auslesen."""
        with TaskMapper() as mapper:
            return mapper.find_all()

    def save_task(self, task):
        """Den gegebenen Benutzer speichern."""
        with TaskMapper() as mapper:
            mapper.update(task)

    def delete_task(self, task):
        """Die Aktivität aus unserem System löschen."""
        with TaskMapper() as mapper:
            mapper.delete(task)

    # TimeAccount

    def create_timeaccount(self, proposal):
        """Ein Arbeitszeitkonto anlegen"""
        with TimeAccountMapper() as mapper:
            return mapper.insert(proposal)

    def get_timeaccount_by_id(self, number):
        """Das Arbeitszeitkonto mit der gegebenen ID auslesen."""
        with TimeAccountMapper() as mapper:
            return mapper.find_by_key(number)

    def get_timeaccount_by_user(self, user):
        """Alle Arbeitszeitkonten mit gegebenem Benutzer auslesen."""
        with TimeAccountMapper() as mapper:
            return mapper.find_by_user(user)

    def get_all_timeaccounts(self):
        """Alle Arbeitszeitkonten auslesen."""
        with TimeAccountMapper() as mapper:
            return mapper.find_all()

    def save_timeaccount(self, timeaccount):
        """Das Arbeitszeitkonto speichern."""
        with TimeAccountMapper() as mapper:
            mapper.update(timeaccount)

    def delete_timeaccount(self, timeaccount):
        """Das Arbeitszeitkonto aus unserem System löschen."""
        with TimeAccountMapper() as mapper:
            mapper.delete(timeaccount)

    # Interval

    def create_intervals(self, proposal):
        """Ein Zeitintervall anlegen"""
        with IntervalsMapper() as mapper:
            return mapper.insert(proposal)

    def get_intervals_by_id(self, number):
        """Interval mit der gegebenen ID auslesen."""
        with IntervalsMapper() as mapper:
            return mapper.find_by_key(number)

    def get_all_intervalss(self):
        """Alle Zeitintervalle auslesen."""
        with IntervalsMapper() as mapper:
            return mapper.find_all()

    def save_intervals(self, intervals):
        """Zeitintervall speichern."""
        with IntervalsMapper() as mapper:
            mapper.update(intervals)

    def delete_intervals(self, intervals):
        """ein Zeitintervall aus unserem System löschen."""
        with IntervalsMapper() as mapper:
            mapper.delete(intervals)

    # Event
    def get_all_events(self):
        """Alle Events auslesen."""
        with EventMapper() as mapper:
            return mapper.find_all()

    def create_event(self, proposal):
        """Ein Event anlegen"""
        with EventMapper() as mapper:
            return mapper.insert(proposal)

    def get_event_by_id(self, number):
        """Event mit der gegebenen ID auslesen."""
        with EventMapper() as mapper:
            return mapper.find_by_key(number)

    def save_event(self, event):
        """Den gegebenen Benutzer speichern."""
        with EventMapper() as mapper:
            mapper.update(event)

    def delete_event(self, event):
        """Die Aktivität aus unserem System löschen."""
        with EventMapper() as mapper:
            mapper.delete(event)

    # Projekte

    def get_all_projects(self):
        """Alle Projekte aus unserem System auslesen."""
        with ProjectMapper() as mapper:
            return mapper.find_all()

    def get_all_projects_by_user(self, user_id):
        """Alle Projekte, die einem bestimmten user mit der übergebenen ID zugeordnet wurden, aus unserem
        System auslesen."""
        with ProjectUserReferenceMapper() as mapper:
            project_ids = mapper.find_all_projects_by_user(user_id)

        result = []
        for project_id in project_ids:
            project = self.get_project_by_id(project_id)
            result.append(project)
        return result

    def get_all_intervals_by_project(self, project_id):
        """Alle gebuchten Zeitintervalle, die einem bestimmten Projekt mit der übergebenen ID zugeordnet wurden,
        aus unserem System auslesen."""
        with IntervalsMapper() as mapper:
            interval_ids = mapper.find_all_intervals_by_project(project_id)

        result = []
        for interval_id in interval_ids:
            intervall = self.get_intervals_by_id(interval_id)
            result.append(intervall)
        return result

    def get_all_intervals_by_task(self, task_id):
        """Alle gebuchten Zeitintervalle, die einem bestimmten Task mit der übergebenen ID zugeordnet wurden,
                aus unserem System auslesen."""
        with IntervalsMapper() as mapper:
            # hole alle Intervalle mit der spezifizierten task_id
            interval_ids = mapper.find_all_intervals_by_task(task_id)

        result = []
        for interval_id in interval_ids:
            intervall = self.get_intervals_by_id(interval_id)
            result.append(intervall)
        return result

    # Formatting time-series
    def period(self, delta, pattern):
        # Übernimmt 1 day, 20:00 timedelta und überführt sie als Key:Value pair (Dictionary)
        d = {}
        # divmod methode übernimmt 2 zahlen als argumente und returned deren quotienten und rest als tuple
        d['h'], rem = divmod(delta.total_seconds(), 3600)
        d['m'], d['s'] = divmod(rem, 60)
        # (**d) = arguments sind schon als tuple gespeichert und müssen unpacked werden (siehe Unpacking Argument Lists)
        return pattern.format(**d)

    def sum_intervals_by_project(self, project_id):
        # hole alle Intervalle mit der definierten projekt_id
        intervals = self.get_all_intervals_by_project(project_id)

        # setze für den Loop die Intervallzeit auf 0
        sumIntervall = timedelta(0)

        # iteriere durch die Liste von zurückgegebenen Intervallen
        for tasks in intervals:
            sumIntervall += tasks.get_intervall()

        # Setze die Summe des Loops = tSum (debugging purpose)
        tSum = sumIntervall

        # Return von tSum welches durch formatting funktion von (1 day, 04:00) zu (28:00) umgewandelt wird
        return self.period(tSum, '{h:>02.0f}:{m:>02.0f}')

    def sum_intervals_by_user(self, user_id):
        intervals = self.get_all_intervals_by_user(user_id)

        sumIntervall = timedelta(0)

        for tasks in intervals:
            sumIntervall += tasks.get_intervall()

        tSum = sumIntervall

        return self.period(tSum, '{h:>02.0f}:{m:>02.0f}')

    def sum_intervals_by_task(self, task_id):
        # Übergebe Task ID, finde alle Intervals der zugehörigen Task ID und returne Array der Intervals
        intervals = self.get_all_intervals_by_task(task_id)

        # Caste sumIntervall als timedelta 0
        sumIntervall = timedelta(0)

        # Iteriere durch jedes Intervals welches der Task_ID entspricht, frage Intervall ab und summiere
        for tasks in intervals:
            sumIntervall += tasks.get_intervall()

        # Speichere Summe der Intervalle als tSum
        tSum = sumIntervall

        # Rückgabewert kann 1 day, 20:00 entsprechen, daher rufe Methode period auf Ergebnis auf, um 44:00 zu returnen
        return self.period(tSum, '{h:>02.0f}:{m:>02.0f}')

    def calculate_remaining_duration_by_project(self, duration, intervals):
        # Splitte Intervall (44:20 -> 44 und 20) und konvertiere zu timedelta (hours=44, minutes=20)
        hours, minutes = map(float, intervals.split(':'))
        t_delta = timedelta(hours=hours, minutes=minutes)

        # Gleiches für die Duration, da wir diese als String übergeben
        hours, minutes = map(float, duration.split(':'))
        duration = timedelta(hours=hours, minutes=minutes)

        # Berechne Differenz
        t_delta_difference = duration - t_delta

        extension = ""

        if t_delta_difference < timedelta(0):
            extension = " overbooked "

        return self.period(t_delta_difference, '{h:>02.0f}:{m:>02.0f}' + extension)

    def calculate_remaining_capacity_by_task(self, capacity, intervals):
        # Splitte Intervall (44:20 -> 44 und 20) und konvertiere zu timedelta (hours=44, minutes=20)
        hours, minutes = map(float, intervals.split(':'))
        t_delta = timedelta(hours=hours, minutes=minutes)

        # Berechne Differenz
        t_delta_difference = capacity - t_delta

        extension = ""

        if t_delta_difference < timedelta(0):
            extension = " overbooked "

        return self.period(t_delta_difference, '{h:>02.0f}:{m:>02.0f}' + extension)

    def morph_capacity(self, capacity):
        # Takes Float (20.5) and turns it into timedelta (20:30:00)
        morphedcapacity = timedelta(hours=capacity)
        return morphedcapacity

    # timeaccounts
    def get_all_timeaccounts_by_posting(self, posting):
        """Alle Zeitkonten bezüglich einer Buchung das der übergebenen ID entspricht, auslesen"""
        with PostingMapper() as mapper:
            posting_ids = mapper.find_all_timeaccount_by_posting(posting)

        result = []
        for posting_id in posting_ids:
            posting = self.get_posting_by_id(posting_id)
            result.append(posting)
        return result

    def get_all_postings_by_timeaccount(self, timeaccount):
        """Alle Buchungen bezüglich eines Zeitkontos, das der übergebenen ID entspricht, auslesen"""
        with TimeAccountMapper() as mapper:
            timeaccount_ids = mapper.find_all_postings_by_timeaccount(timeaccount)

        result = []
        for timeaccount_id in timeaccount_ids:
            timeaccount = self.get_timeaccount_by_id(timeaccount_id)
            result.append(timeaccount)
        return result

    def get_all_users_by_posting(self, posting):
        """Alle Nutzer bezüglich einer Buchung, die der übergebenen ID entspricht, auslesen"""
        with UserMapper() as mapper:
            posting_ids = mapper.find_all_users_by_posting(posting)

        result = []
        for posting_id in posting_ids:
            posting = self.get_posting_by_id(posting_id)
            result.append(posting)
        return result

    def get_all_postings_by_user(self, user):
        """Alle Buchungen bezüglich eines Nutzers, der der übergebenen ID entspricht, auslesen"""
        with PostingMapper() as mapper:
            user_ids = mapper.find_all_postings_by_user(user)

        result = []
        for user_id in user_ids:
            user = self.get_user_by_id(user_id)
            result.append(user)
        return result

    def get_all_timeaccounts_by_user(self, user):
        """Alle Arbeitszeitkonton bezüglich eines Nutzers, der der übergebenen ID entspricht, auslesen"""
        with TimeAccountMapper() as mapper:
            user_ids = mapper.find_all_timeaccounts_by_user(user)

        result = []
        for user_id in user_ids:
            user = self.get_user_by_id(user_id)
            result.append(user)
        return result

    def get_all_users_by_timeaccount(self, timeaccount):
        """Den Nutzer bezüglich eines Arbeitskontos, das der übergebenen ID entspricht, auslesen"""
        with UserMapper() as mapper:
            timeaccount_ids = mapper.find_all_users_by_timeaccount(timeaccount)

        result = []
        for timeaccount_id in timeaccount_ids:
            timeaccount = self.get_timeaccount_by_id(timeaccount_id)
            result.append(timeaccount)
        return result

    # ProjectUserReference
    def get_all_users_by_project(self, project_id):
        """Alle Nutzer bezüglich eines Projektes, das der übergebenen ID entspricht, auslesen"""
        with ProjectUserReferenceMapper() as mapper:
            user_ids = mapper.get_user_by_project_id(project_id)

        result = []
        for user_id in user_ids:
            user = self.get_user_by_id(user_id)
            result.append(user)
        return result

    def create_project_user_reference(self, proposal):
        """Eine Project User Reference anlegen"""
        with ProjectUserReferenceMapper() as mapper:
            return mapper.insert(proposal)

    # UserTimeAccountReference
    def get_all_timeaccount_by_user(self, user_id):
        with ProjectUserReferenceMapper() as mapper:
            timeaccount_ids = mapper.get_user_by_user_id(user_id)

        result = []
        for timeaccount_id in timeaccount_ids:
            timeaccount = self.get_timeaccount_by_id(timeaccount_id)
            result.append(timeaccount)
        return result

    def create_connection(self, proposal):
        """Eine verbindung anlegen in der Projekt - User Referenztabelle"""
        with ConnectionMapper() as mapper:
            return mapper.insert(proposal)

    def delete_connection(self, proposal):
        """Eine verbindung löschen in der Projekt - User Referenztabelle"""
        with ConnectionMapper() as mapper:
            return mapper.delete(proposal)

    def get_all_intervals_by_user(self, user):
        """Interval mit der gegebenen ID auslesen anhand der ID eines Nutzers."""
        with IntervalsMapper() as mapper:
            ids = mapper.find_all_intervals_by_user(user)

        result = []
        for id in ids:
            id = self.get_intervals_by_id(id)
            result.append(id)
        return result

    def get_all_tasks_by_project(self, project):
        """Interval mit der gegebenen ID auslesen anhand der ID eines Projektes."""
        with TaskMapper() as mapper:
            ids = mapper.find_all_tasks_by_project(project)

        result = []
        for id in ids:
            id = self.get_task_by_id(id)
            result.append(id)
        return result
