import unittest

from app import create_app
from app.contents import create_section, get_section, publish_content
from app.extensions import db
from app.models import ContactMessage


class ContactTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(
            {
                "TESTING": True,
                "SECRET_KEY": "test-secret-key",
                "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
                "CORS_ORIGINS": ["http://localhost:5173"],
                "SESSION_COOKIE_SECURE": False,
            }
        )
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def valid_payload(self, **overrides):
        payload = {
            "name": "Maria Silva",
            "email": "maria@example.com",
            "organization": "Escola Municipal",
            "phone": "(21) 99999-9999",
            "subject": "Educação Ambiental",
            "message": "Queremos levar uma oficina para a nossa escola.",
        }
        payload.update(overrides)
        return payload

    def test_valid_submission(self):
        response = self.client.post("/api/v1/contact", json=self.valid_payload())
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json()["sent"], True)

        with self.app.app_context():
            count = ContactMessage.query.count()
            self.assertEqual(count, 1)

            message = ContactMessage.query.first()
            self.assertEqual(message.name, "Maria Silva")
            self.assertEqual(message.email, "maria@example.com")
            self.assertEqual(message.organization, "Escola Municipal")

    def test_optional_fields_can_be_omitted(self):
        response = self.client.post(
            "/api/v1/contact",
            json=self.valid_payload(organization=None, phone=None),
        )
        self.assertEqual(response.status_code, 201)

    def test_missing_name(self):
        response = self.client.post("/api/v1/contact", json=self.valid_payload(name=""))
        self.assertEqual(response.status_code, 400)

    def test_missing_email(self):
        response = self.client.post("/api/v1/contact", json=self.valid_payload(email=""))
        self.assertEqual(response.status_code, 400)

    def test_invalid_email(self):
        response = self.client.post(
            "/api/v1/contact", json=self.valid_payload(email="nao-e-email")
        )
        self.assertEqual(response.status_code, 400)

    def test_missing_subject(self):
        response = self.client.post("/api/v1/contact", json=self.valid_payload(subject=""))
        self.assertEqual(response.status_code, 400)

    def test_invalid_subject_value(self):
        response = self.client.post(
            "/api/v1/contact", json=self.valid_payload(subject="Assunto Não Permitido")
        )
        self.assertEqual(response.status_code, 400)

    def test_missing_message(self):
        response = self.client.post("/api/v1/contact", json=self.valid_payload(message=""))
        self.assertEqual(response.status_code, 400)

    def test_message_too_long(self):
        response = self.client.post(
            "/api/v1/contact", json=self.valid_payload(message="x" * 5001)
        )
        self.assertEqual(response.status_code, 400)

    def test_honeypot_ignored(self):
        response = self.client.post(
            "/api/v1/contact",
            json=self.valid_payload(website="http://spam.example.com"),
        )
        self.assertEqual(response.status_code, 201)

        with self.app.app_context():
            self.assertEqual(ContactMessage.query.count(), 0)

    def test_no_public_list_endpoint(self):
        response = self.client.get("/api/v1/contact")
        self.assertEqual(response.status_code, 405)


class ContactSubjectsFromCmsTestCase(unittest.TestCase):
    """Assuntos do formulario vindos do `published_data` da secao `contato`.

    Regra: publicar no CMS muda quais assuntos o visitante pode escolher.
    O rascunho NUNCA influencia a validacao. Sem secao valida, a lista padrao
    anterior continua valendo (compatibilidade).
    """

    def setUp(self):
        self.app = create_app(
            {
                "TESTING": True,
                "SECRET_KEY": "test-secret-key",
                "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
                "CORS_ORIGINS": ["http://localhost:5173"],
                "SESSION_COOKIE_SECURE": False,
            }
        )
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def valid_payload(self, **overrides):
        payload = {
            "name": "Maria Silva",
            "email": "maria@example.com",
            "organization": "Escola Municipal",
            "phone": "(21) 99999-9999",
            "subject": "Educação Ambiental",
            "message": "Queremos levar uma oficina para a nossa escola.",
        }
        payload.update(overrides)
        return payload

    def _create_contact_section(self, published_subjects, draft_subjects=None):
        """Cria a secao `contato` com assuntos publicados (e rascunho opcional)."""
        with self.app.app_context():
            section = create_section(
                "contato",
                {"title": "Contato", "subjects": list(published_subjects)},
            )

            if draft_subjects is not None:
                # Atribuicao de um NOVO dict (nao mutacao) para o SQLAlchemy
                # detectar a mudanca no campo JSON.
                section.draft_data = {
                    "title": "Contato",
                    "subjects": list(draft_subjects),
                }
                db.session.commit()

    def test_subject_published_in_cms_is_accepted(self):
        self._create_contact_section(["Oficinas de Reciclagem", "Doações"])

        response = self.client.post(
            "/api/v1/contact", json=self.valid_payload(subject="Oficinas de Reciclagem")
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json()["sent"], True)

        with self.app.app_context():
            stored = ContactMessage.query.one()
            self.assertEqual(stored.subject, "Oficinas de Reciclagem")

    def test_subject_absent_from_published_content_is_rejected(self):
        self._create_contact_section(["Oficinas de Reciclagem"])

        # "Educação Ambiental" esta na lista padrao antiga, mas nao foi publicada.
        response = self.client.post(
            "/api/v1/contact", json=self.valid_payload(subject="Educação Ambiental")
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "validation_error")

        with self.app.app_context():
            self.assertEqual(ContactMessage.query.count(), 0)

    def test_draft_subjects_do_not_affect_validation(self):
        self._create_contact_section(
            ["Educação Ambiental"],
            draft_subjects=["Assunto Só No Rascunho"],
        )

        # Assunto que existe apenas no rascunho: rejeitado.
        rejected = self.client.post(
            "/api/v1/contact", json=self.valid_payload(subject="Assunto Só No Rascunho")
        )
        self.assertEqual(rejected.status_code, 400)

        # Assunto efetivamente publicado: aceito.
        accepted = self.client.post(
            "/api/v1/contact", json=self.valid_payload(subject="Educação Ambiental")
        )
        self.assertEqual(accepted.status_code, 201)

    def test_default_subjects_used_when_section_is_missing(self):
        response = self.client.post(
            "/api/v1/contact", json=self.valid_payload(subject="Educação Ambiental")
        )
        self.assertEqual(response.status_code, 201)

        rejected = self.client.post(
            "/api/v1/contact", json=self.valid_payload(subject="Assunto Não Permitido")
        )
        self.assertEqual(rejected.status_code, 400)

    def test_default_subjects_used_when_published_subjects_is_empty(self):
        self._create_contact_section([])

        response = self.client.post(
            "/api/v1/contact", json=self.valid_payload(subject="Educação Ambiental")
        )
        self.assertEqual(response.status_code, 201)

    def test_default_subjects_used_when_published_shape_is_invalid(self):
        with self.app.app_context():
            create_section("contato", {"title": "Contato", "subjects": "não é lista"})

        response = self.client.post(
            "/api/v1/contact", json=self.valid_payload(subject="Educação Ambiental")
        )
        self.assertEqual(response.status_code, 201)

    def test_publishing_new_subjects_replaces_previous_set(self):
        self._create_contact_section(["Assunto Antigo"])

        with self.app.app_context():
            section = get_section("contato")
            self.assertIsNotNone(section)
            section.draft_data = {
                "title": "Contato",
                "subjects": ["Assunto Novo"],
            }
            publish_content(section)

        old_subject = self.client.post(
            "/api/v1/contact", json=self.valid_payload(subject="Assunto Antigo")
        )
        self.assertEqual(old_subject.status_code, 400)

        new_subject = self.client.post(
            "/api/v1/contact", json=self.valid_payload(subject="Assunto Novo")
        )
        self.assertEqual(new_subject.status_code, 201)

    def test_rest_of_contact_behavior_is_unchanged(self):
        self._create_contact_section(["Oficinas de Reciclagem"])

        missing_name = self.client.post(
            "/api/v1/contact",
            json=self.valid_payload(name="", subject="Oficinas de Reciclagem"),
        )
        self.assertEqual(missing_name.status_code, 400)

        invalid_email = self.client.post(
            "/api/v1/contact",
            json=self.valid_payload(email="nao-e-email", subject="Oficinas de Reciclagem"),
        )
        self.assertEqual(invalid_email.status_code, 400)

        honeypot = self.client.post(
            "/api/v1/contact",
            json=self.valid_payload(
                subject="Oficinas de Reciclagem", website="http://spam.example.com"
            ),
        )
        self.assertEqual(honeypot.status_code, 201)

        with self.app.app_context():
            self.assertEqual(ContactMessage.query.count(), 0)


if __name__ == "__main__":
    unittest.main()
