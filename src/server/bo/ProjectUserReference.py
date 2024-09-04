class ProjectUserReference():
    def __init__(self):
        super().__init__()
        self._project_id = ""  # string
        self._user_id = ""

    def get_project_id(self):
        return self._project_id

    def set_project_id(self, project_id):
        self._project_id = project_id

    def get_user_id(self):
        return self._user_id

    def set_user_id(self, user_id):
        self._user_id = user_id

    @staticmethod
    def from_dict(object_dict=dict()):
        """Umwandeln eines Python dict() in eine Reference."""
        obj = ProjectUserReference()
        obj.set_project_id(object_dict["id"])
        obj.set_user_id(object_dict["id"])
        return obj

    def attributes_to_dict(self):
        return {"project_id": self._project_id,
                "user_id": self._user_id}
