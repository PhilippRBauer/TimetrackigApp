# Flask importieren
from flask import Flask, redirect, url_for
# CORS importieren
from flask_cors import CORS
# RestX importieren
from flask_restx import Api, Resource, fields

"""Funktionen die in Administration.py definiert sind"""
from server.administration import Administration

# Import Applikationslogik inkl. BusinessObject-Klassen
from server.bo.User import User
from server.bo.TimeAccount import TimeAccount
from server.bo.Task import Task
from server.bo.Posting import Posting
from server.bo.Project import Project
from server.bo.Intervals import Intervals
from server.bo.Event import Event
from server.bo.ProjectUserReference import ProjectUserReference

"""Der SecurityDecorator ist für die Authentifikation zuständig"""

from SecurityDecorator import secured

__copyright__ = "Copyright 2022, Team 05, Software Praktikum"
__version__ = "1.0.0"
__email__ = "pb079@hdm-stuttgart.de"
__status__ = "Presentation"

# Flask instanzieren
app = Flask(__name__, static_folder='./static/build', static_url_path='/')

CORS(app, resources=r'/time/*')


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.errorhandler(404)
def handle_exeption(err):
    return redirect(url_for("index"))


""" API Basis URL"""
api = Api(app, version='1.0', title='Time-Tracking API',
          description='Eine rudimentäre Demo-API für die Projekt-Zeiterfassung')

api = api.namespace('time', description='Funktionen des Time-Tracking-SoPra')

"""BusinessObject dient als Basisklasse, auf der die weiteren Strukturen aufsetzen."""
# Modification Date wird in der Datenbank dargestellt und wird im Frontend nicht benötigt
bo = api.model('BusinessObject', {
    'id': fields.Integer(attribute='_id', description='Der Unique Identifier eines Business Object')
})

"""Aktivitäten sind BusinessObjects..."""
task = api.inherit('Task', bo, {
    'capacity': fields.Integer(attribute='_capacity', description='Kapazität der Aktivität'),
    'project': fields.Integer(attribute='_project', description='Projekt, welchem die Aktivität angehört'),
    'user': fields.Integer(attribute='_user', description='Benutzer, welche Aktivität bearbeitet'),
    'description': fields.String(attribute='_description', description='Beschreibung einer Aktivität'),
})

"""Arbeitszeitkonten sind BusinessObjects..."""
timeaccount = api.inherit('TimeAccount', bo, {
    'user': fields.Integer(attribute='_user', description='Benutzer des Arbeitszeitkontos'),
    'project': fields.Integer(attribute='_project', description='Projekt, an dem gearbeitet wurde'),
    'working_time': fields.Float(attribute='_working_time', description='Geleistete Arbeitszeit'),
    'task': fields.Integer(attribute='_task', description='Zuordnung einer Aktivität'),
})

"""User sind BusinessObjects..."""
user = api.inherit('User', bo, {
    'firstname': fields.String(attribute='_firstname', description='Vorname eines Benutzers'),
    'lastname': fields.String(attribute='_lastname', description='Nachname eines Benutzers'),
    'email': fields.String(attribute='_email', description='E-Mail-Adresse eines Benutzers'),
    'username': fields.String(attribute='_username', description='Username eines Benutzers'),
    'guid': fields.String(attribute='_guid', description='Google User ID eines Benutzers'),
})

"""Project sind BusinessObjects..."""
project = api.inherit('Project', bo, {
    'description': fields.String(attribute='_description', description='Vorname eines Benutzers'),
    'client': fields.String(attribute='_client', description='Nachname eines Benutzers'),
    'duration': fields.String(attribute='_duration', description='E-Mail-Adresse eines Benutzers'),
    'connection': fields.Raw(attribute="_connection", default=[], description="Verbindungsobjekt")
})

"""Buchungen sind BusinessObjects..."""
posting = api.inherit('Posting', bo, {
    'user': fields.Integer(attribute='_user', description='Person die etwas bucht'),
    'project_id': fields.Integer(attribute='_project_id', description='Gebuchtes Project'),
    'task_id': fields.Integer(attribute='_task_id', description='Gebuchte Task'),

})

"""Zeitintervalle sind BusinessObjects..."""
intervals = api.inherit('Intervals', posting, {
    'von': fields.DateTime(attribute='_von', description='Anfang eines Zeitintervalls'),
    'bis': fields.DateTime(attribute='_bis', description='Ende einer Zeitintervalls'),
    'intervall': fields.String(attribute='_intervall', description='Person die etwas bucht'),
})

"""Events sind BusinessObjects..."""
event = api.inherit('Event', bo, {
    'user': fields.Integer(attribute='_user', description='Id des Users'),
    'time': fields.String(attribute='_time', description='Zeit des Events'),
    'typ': fields.String(attribute='_typ', description='Typ des Events'),
})

"""Die Project zu User Referencen sind BusinessObjects..."""
project_user_reference = api.inherit('ProjectUserReference', bo, {
    'project_id': fields.Integer(attribute='_project_id', description='fk project'),
    'user_id': fields.String(attribute='_user_id', description='fk user')
})


# user
@api.route('/user')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class UserListOperations(Resource):
    @api.marshal_list_with(user)
    @secured
    def get(self):
        adm = Administration()
        users = adm.get_all_users()
        return users

    # Einen User anlegen
    @api.marshal_with(user, code=200)
    @api.expect(user)
    @secured
    def post(self):
        adm = Administration()
        proposal = User.from_dict(api.payload)
        if proposal is not None:
            adm.create_user(proposal)
            return '', 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@api.route('/user-by-username/<string:username>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class UserNameOperations(Resource):
    # Einen User anhand seines Namen zurückgeben
    @api.marshal_with(user)
    @secured
    def get(self, username):
        # Auslesen eines bestimmten Users
        adm = Administration()
        user = adm.get_user_by_username(username)
        return user


@api.route('/user-by-guid/<string:guid>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class UserGuidOperations(Resource):
    @api.marshal_list_with(user)
    @secured
    def get(self, guid):
        adm = Administration()
        user = adm.get_user_by_guid(guid)
        return user


@api.route('/user/<int:id>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@api.param('id', 'Die ID des Buchungs-Objektes')
class UserOperations(Resource):

    @api.marshal_with(user)
    @api.expect(user, validate=True)
    @secured
    def put(self, id):
        adm = Administration()
        u = User.from_dict(api.payload)

        if u is not None:
            u.set_id(id)
            adm.save_user(u)
            return '', 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

    @api.marshal_with(user)
    def get(self, id):
        """Auslesen eines bestimmten Users"""
        adm = Administration()
        user = adm.get_user_by_id(id)
        return user

    # Ein User löschen
    @secured
    def delete(self, id):
        adm = Administration()
        users = adm.get_user_by_id(id)

        if users is not None:
            adm.delete_user(users)
            return '', 200
        else:
            return '', 500  # Wenn unter id keine Transaction existiert.


@api.route('/user-by-email/<string:email>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@api.param('email', 'Die Email des Buchungs-Objektes')
class UserListOperations(Resource):
    @api.marshal_list_with(user)
    # @api.expect(user, validate=True)
    def get(self, email):
        adm = Administration()
        users = adm.get_user_by_email(email)
        return users


# Posting
@api.route('/posting')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class PostingListOperations(Resource):
    @api.marshal_list_with(posting)
    @secured
    def get(self):
        adm = Administration()
        postings = adm.get_all_postings()
        return postings

    # Eine Buchung anlegen
    @api.marshal_with(posting, code=200)
    @api.expect(posting)
    @secured
    def post(self):
        adm = Administration()
        proposal = Posting.from_dict(api.payload)
        if proposal is not None:
            adm.create_posting(proposal)
            return '', 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@api.route('/posting/<int:id>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@api.param('id', 'Die ID des Buchungs-Objektes')
class PostingOperations(Resource):

    @api.marshal_with(posting)
    @api.expect(posting, validate=True)
    @secured
    def put(self, id):
        adm = Administration()
        p = Posting.from_dict(api.payload)

        if p is not None:
            p.set_id(id)
            adm.save_posting(p)
            return '', 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

    @api.marshal_with(posting)
    def get(self, id):
        """Auslesen einer bestimmten Buchung"""
        adm = Administration()
        posting = adm.get_posting_by_id(id)
        return posting


# posting nach user suchen
@api.route('/posting-by-user/<int:user>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@api.param('id', 'Die ID des Buchungs-Objektes')
class PostingOperations(Resource):

    @api.marshal_with(posting)
    @api.expect(posting, validate=True)
    @secured
    def put(self, id):
        adm = Administration()
        p = Posting.from_dict(api.payload)

        if p is not None:
            p.set_id(id)
            adm.save_posting(p)
            return '', 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

    @api.marshal_with(posting)
    def get(self, user):
        """Auslesen einer bestimmten Buchung"""
        adm = Administration()
        posting = adm.get_postings_by_userID(user)
        return posting

    # Eine Buchung löschen
    @secured
    def delete(self, id):
        adm = Administration()
        postings = adm.get_posting_by_id(id)

        if postings is not None:
            adm.delete_posting(postings)
            return '', 200
        else:
            return '', 500  # Wenn unter id keine Transaction existiert.


# TimeAccount
@api.route('/timeaccount')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class TimeAccountListOperations(Resource):
    @api.marshal_list_with(timeaccount)
    @secured
    def get(self):
        adm = Administration()
        timeaccounts = adm.get_all_timeaccounts()
        return timeaccounts

    # Ein Arbeitszeitkonto anlegen

    @secured
    @api.marshal_with(timeaccount, code=200)
    @api.expect(timeaccount)
    @secured
    def post(self):
        adm = Administration()
        proposal = TimeAccount.from_dict(api.payload)
        if proposal is not None:
            adm.create_timeaccount(proposal)
            return '', 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@api.route('/timeaccount-by-user/<int:user>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class TimeaccountUserOperations(Resource):
    @api.marshal_list_with(timeaccount)
    @secured
    def get(self, user):
        adm = Administration()
        timeaccounts = adm.get_timeaccount_by_user(user)
        return timeaccounts


@api.route('/timeaccount/<int:id>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@api.param('id', 'Die ID des Timeaccounts-Objektes')
class TimeAccountOperations(Resource):

    @api.marshal_with(timeaccount)
    @api.expect(timeaccount, validate=True)
    @secured
    def put(self, id):
        adm = Administration()
        t = TimeAccount.from_dict(api.payload)

        if t is not None:
            t.set_id(id)
            adm.save_timeaccount(t)
            return '', 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

    @api.marshal_with(timeaccount)
    def get(self, id):
        """Auslesen eines bestimmten Arbeitszeitkontos"""
        adm = Administration()
        timeaccount = adm.get_timeaccount_by_id(id)
        return timeaccount

    # Ein Arbeitszeitkonto löschen
    @secured
    def delete(self, id):
        adm = Administration()
        timeaccounts = adm.get_timeaccount_by_id(id)

        if timeaccounts is not None:
            adm.delete_timeaccount(timeaccounts)
            return '', 200
        else:
            return '', 500  # Wenn unter id keine Transaction existiert.


# Task
@api.route('/task')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class TaskListOperations(Resource):
    @api.marshal_list_with(task)
    @secured
    def get(self):
        adm = Administration()
        tasks = adm.get_all_tasks()
        return tasks

    @api.marshal_with(task, code=200)
    @api.expect(task, validate=True)
    @secured
    def post(self):
        adm = Administration()
        proposal = Task.from_dict(api.payload)
        if proposal is not None:
            adm.create_task(proposal)
            return '', 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@api.route('/task-by-project/<int:project>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class TaskProjectOperations(Resource):
    @api.marshal_list_with(task)
    @secured
    def get(self, project):
        adm = Administration()
        tasks = adm.get_task_by_project(project)
        return tasks


@api.route('/task-by-user/<int:user>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class TaskProjectOperations(Resource):
    @api.marshal_list_with(task)
    @secured
    def get(self, user):
        adm = Administration()
        tasks = adm.get_task_by_user(user)
        return tasks


@api.route('/task/<int:id>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@api.param('id', 'Die ID des Buchungs-Objektes')
class TaskOperations(Resource):

    @api.marshal_with(task)
    @api.expect(task, validate=True)
    @secured
    def put(self, id):
        adm = Administration()
        t = Task.from_dict(api.payload)

        if t is not None:
            t.set_id(id)
            adm.save_task(t)
            return '', 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

    @api.marshal_with(task)
    def get(self, id):
        """Auslesen eines bestimmten Arbeitszeitkontos"""
        adm = Administration()
        task = adm.get_task_by_id(id)
        return task

    # Eine Aktivität löschen
    @secured
    def delete(self, id):
        adm = Administration()
        tasks = adm.get_task_by_id(id)

        if tasks is not None:
            adm.delete_task(tasks)
            return '', 200
        else:
            return '', 500  # Wenn unter id keine Transaction existiert.


# Project
@api.route('/project')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ProjectListOperations(Resource):
    @api.marshal_list_with(project)
    @secured
    def get(self):
        adm = Administration()
        projects = adm.get_all_projects()
        return projects

    # Ein Projekt anlegen - User können als Connection als List mitübergeben werden und werden in die Project-by-user
    # Verbindungstabelle eingefügt
    @api.marshal_with(project, code=200)
    @api.expect(project)
    @secured
    def post(self):
        adm = Administration()
        proposal = Project.from_dict(api.payload)
        if proposal is not None:
            adm.create_project(proposal)
            return '', 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@api.route('/project/<int:id>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@api.param('id', 'Die ID des Buchungs-Objektes')
class ProjectOperations(Resource):

    @api.marshal_with(project)
    @api.expect(project, validate=False)
    @secured
    def put(self, id):
        adm = Administration()
        p = Project.from_dict(api.payload)

        if p is not None:
            p.set_id(id)
            adm.save_project(p)
            return '', 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

    @api.marshal_with(project)
    def get(self, id):
        """Auslesen eines bestimmten Projektes"""
        adm = Administration()
        project = adm.get_project_by_id(id)
        return project

    # Ein Projekt löschen
    @secured
    def delete(self, id):
        adm = Administration()
        projects = adm.get_project_by_id(id)

        if projects is not None:
            adm.delete_project(projects)
            return '', 200
        else:
            return '', 500


@api.route('/project-by-description/<string:description>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@api.param('description', 'Der Name des Projekt-Objekts')
class ProjektDescriptionOperations(Resource):
    @api.marshal_list_with(project)
    @api.expect(project, validate=True)
    @secured
    @secured
    def get(self, description):
        adm = Administration()
        projects = adm.get_project_by_description(description)
        return projects


# Interval
@api.route('/intervals')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class IntervalListOperations(Resource):
    @api.marshal_list_with(intervals)
    @secured
    def get(self):
        adm = Administration()
        intervalss = adm.get_all_intervalss()
        return intervalss

    # Ein Zeitintervall anlegen
    @api.marshal_with(intervals, code=200)
    @api.expect(intervals)
    @secured
    def post(self):
        adm = Administration()
        proposal = Intervals.from_dict(api.payload)
        if proposal is not None:
            adm.create_intervals(proposal)
            return '', 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@api.route('/intervals/<int:id>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@api.param('id', 'Die ID des Buchungs-Objektes')
class IntervalsOperations(Resource):

    @api.marshal_with(intervals)
    @api.expect(intervals, validate=True)
    @secured
    def put(self, id):
        adm = Administration()
        print("Hello Lea")
        i = Intervals.from_dict(api.payload)
        test = api.payload
        print(test)

        if i is not None:
            i.set_id(id)
            adm.save_intervals(i)
            return '', 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

    @api.marshal_with(intervals)
    def get(self, id):
        """Auslesen eines bestimmten Zeitintervalls"""
        adm = Administration()
        intervals = adm.get_intervals_by_id(id)
        return intervals

    # Ein Zeitintervall löschen
    @secured
    def delete(self, id):
        adm = Administration()
        intervalss = adm.get_intervals_by_id(id)

        if intervalss is not None:
            adm.delete_intervals(intervalss)
            return '', 200
        else:
            return '', 500


# Event
@api.route('/event')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class EventListOperations(Resource):
    @api.marshal_list_with(event)
    @secured
    def get(self):
        adm = Administration()
        events = adm.get_all_events()
        return events

    @api.marshal_with(event, code=200)
    @api.expect(event)
    @secured
    def post(self):
        adm = Administration()
        proposal = Event.from_dict(api.payload)
        if proposal is not None:
            adm.create_event(proposal)
            return '', 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@api.route('/event/<int:id>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@api.param('id', 'Die ID des Event-Objektes')
class EventOperations(Resource):

    @api.marshal_with(event)
    @api.expect(event, validate=True)
    @secured
    def put(self, id):
        adm = Administration()
        e = Event.from_dict(api.payload)
        if e is not None:
            e.set_id(id)
            adm.save_event(e)
            return '', 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

    @api.marshal_with(event)
    def get(self, id):
        """Auslesen eines bestimmten Events"""
        adm = Administration()
        event = adm.get_event_by_id(id)
        return event

    def delete(self, id):
        adm = Administration()
        events = adm.get_event_by_id(id)
        if events is not None:
            adm.delete_event(events)
            return '', 200
        else:
            return '', 500  # Wenn unter id keine Transaction existiert.


# Project User Reference - Users zum gegeben Project anlegen
@api.route('/project_user_reference')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ProjectUserListOperations2(Resource):

    @api.marshal_with(project_user_reference, code=200)
    @api.expect(project_user_reference)
    @secured
    def post(self):
        adm = Administration()
        proposal = ProjectUserReference.from_dict(api.payload)
        if proposal is not None:
            adm.create_project_user_reference(proposal)
            return '', 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


# Verbindungstabellen

@api.route('/project/<int:id>/user')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ProjectUserListOperations(Resource):
    @api.marshal_list_with(user)
    def get(self, id):
        adm = Administration()
        users = adm.get_all_users_by_project(id)
        return users


@api.route('/project-id-by-user/<int:id>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class UserProjectListOperations(Resource):
    @api.marshal_list_with(project)
    @secured
    def get(self, id):
        adm = Administration()
        projects = adm.get_all_projects_by_user(id)
        return projects


# TimeAccount

@api.route('/timeaccount/<int:id>/posting')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class TimeAccountPostingListOperations(Resource):
    @api.marshal_list_with(posting)
    @secured
    def get(self, id):
        adm = Administration()
        postings = adm.get_all_timeaccounts_by_posting(id)
        return postings


@api.route('/posting/<int:id>/timeaccount')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class PostingTimeAccountListOperations(Resource):
    @api.marshal_list_with(timeaccount)
    @secured
    def get(self, id):
        adm = Administration()
        timeaccounts = adm.get_all_postings_by_timeaccount(id)
        return timeaccounts


@api.route('/user/<int:id>/posting')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class UserPostingListOperations(Resource):
    @api.marshal_list_with(posting)
    @secured
    def get(self, id):
        adm = Administration()
        postings = adm.get_all_users_by_posting(id)
        return postings


@api.route('/posting/<int:id>/user')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class PostingUserListOperations(Resource):
    @api.marshal_list_with(user)
    @secured
    def get(self, id):
        adm = Administration()
        users = adm.get_all_postings_by_user(id)
        return users


@api.route('/intervals/<int:id>/project')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class IntervalsProjectListOperations(Resource):
    @api.marshal_list_with(intervals)
    @secured
    def get(self, id):
        adm = Administration()
        intervals = adm.get_all_intervals_by_project(id)
        return intervals


@api.route('/intervals/<int:task_id>/task')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class IntervalsTaskListOperations(Resource):
    @api.marshal_list_with(intervals)
    @secured
    def get(self, task_id):
        adm = Administration()
        intervals = adm.get_all_intervals_by_task(task_id)
        return intervals


@api.route('/sumintervals/<int:task_id>/task')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class SumIntervalsTaskListOperations(Resource):
    @secured
    def get(self, task_id):
        adm = Administration()
        sumintervals = adm.sum_intervals_by_task(task_id)
        return sumintervals


@api.route('/sumintervals/<int:project_id>/project')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class SumIntervalsProjectListOperations(Resource):
    @secured
    def get(self, project_id):
        adm = Administration()
        sumintervals = adm.sum_intervals_by_project(project_id)
        return sumintervals


@api.route('/sumintervals/<int:user_id>/user')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class SumIntervalsUserListOperations(Resource):
    @secured
    def get(self, user_id):
        adm = Administration()
        sumintervals = adm.sum_intervals_by_user(user_id)
        return sumintervals


# Berechnen der Restzeit für das Projekt
@api.route('/calculatecapacity/<int:task_id>/task')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class CaluclateDurationProjectListOperations(Resource):
    @secured
    def get(self, task_id):
        adm = Administration()

        # Capacity abfragen
        task = adm.get_task_by_id(task_id)
        capacity = task.get_capacity()

        # Aus Float Capacity timdelta generieren
        morphedcapacity = adm.morph_capacity(capacity)

        # Summe der Intervalle für das Projekt
        sumintervals = adm.sum_intervals_by_task(task_id)

        # Zeit kalkulieren
        diff = adm.calculate_remaining_capacity_by_task(morphedcapacity, sumintervals)

        return diff


@api.route('/calculateduration/<int:project_id>/project')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class CaluclateDurationProjectListOperations(Resource):
    @secured
    def get(self, project_id):
        adm = Administration()

        # Projektzeit abfragen
        project = adm.get_project_by_id(project_id)
        duration = project.get_duration()

        # Summe der Intervalle für das Projekt
        sumintervals = adm.sum_intervals_by_project(project_id)

        # Zeit kalkulieren
        diff = adm.calculate_remaining_duration_by_project(duration, sumintervals)

        return diff


@api.route('/user/<int:id>/timeaccount')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class UserTimeaccountListOperations(Resource):
    @api.marshal_list_with(timeaccount)
    @secured
    def get(self, id):
        adm = Administration()
        timeaccounts = adm.get_all_users_by_timeaccount(id)
        return timeaccounts


@api.route('/timeaccount/<int:id>/user')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class TimeaccountUserListOperations(Resource):
    @api.marshal_list_with(user)
    @secured
    def get(self, id):
        adm = Administration()
        users = adm.get_all_timeaccounts_by_user(id)
        return users


@api.route('/intervals-by-user/<int:user>')
@api.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class IntervalUserListOperations(Resource):
    @api.marshal_list_with(intervals)
    @secured
    def get(self, user):
        adm = Administration()
        users = adm.get_all_intervals_by_user(user)
        return users


if __name__ == '__main__':
    app.run(debug=True)
