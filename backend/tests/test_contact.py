import unittest

from app import create_app
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


if __name__ == "__main__":
    unittest.main()
