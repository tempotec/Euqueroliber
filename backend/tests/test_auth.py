import unittest

from app import create_app
from app.extensions import db
from app.models import AdminUser


class AuthTestCase(unittest.TestCase):
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
        self.runner = self.app.test_cli_runner()

        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def create_user(self, email="admin@example.com", password="StrongPass123!", is_active=True):
        with self.app.app_context():
            user = AdminUser(email=email, is_active=is_active)
            user.set_password(password)
            db.session.add(user)
            db.session.commit()
            return user

    def test_password_is_hashed(self):
        self.create_user()

        with self.app.app_context():
            user = AdminUser.query.filter_by(email="admin@example.com").first()
            self.assertIsNotNone(user)
            self.assertNotEqual(user.password_hash, "StrongPass123!")
            self.assertTrue(user.check_password("StrongPass123!"))

    def test_login_with_valid_credentials(self):
        self.create_user()

        response = self.client.post(
            "/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "StrongPass123!"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.get_json()["authenticated"])

    def test_login_with_wrong_password(self):
        self.create_user()

        response = self.client.post(
            "/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "wrong-password"},
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.get_json(),
            {"authenticated": False, "error": "invalid_credentials"},
        )

    def test_login_with_unknown_email(self):
        response = self.client.post(
            "/api/v1/auth/login",
            json={"email": "missing@example.com", "password": "StrongPass123!"},
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.get_json(),
            {"authenticated": False, "error": "invalid_credentials"},
        )

    def test_inactive_user_cannot_log_in(self):
        self.create_user(is_active=False)

        response = self.client.post(
            "/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "StrongPass123!"},
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.get_json(),
            {"authenticated": False, "error": "invalid_credentials"},
        )

    def test_auth_me_when_authenticated(self):
        self.create_user()
        self.client.post(
            "/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "StrongPass123!"},
        )

        response = self.client.get("/api/v1/auth/me")

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.get_json()["authenticated"])
        self.assertEqual(response.get_json()["user"]["email"], "admin@example.com")

    def test_auth_me_when_not_authenticated(self):
        response = self.client.get("/api/v1/auth/me")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.get_json(), {"authenticated": False})

    def test_logout_clears_session(self):
        self.create_user()
        self.client.post(
            "/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "StrongPass123!"},
        )

        logout_response = self.client.post("/api/v1/auth/logout")
        me_response = self.client.get("/api/v1/auth/me")

        self.assertEqual(logout_response.status_code, 200)
        self.assertEqual(logout_response.get_json(), {"authenticated": False})
        self.assertEqual(me_response.status_code, 401)

    def test_protected_admin_route_requires_session(self):
        response = self.client.get("/api/v1/admin/session")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.get_json(), {"authenticated": False})

    def test_protected_admin_route_with_session(self):
        self.create_user()
        self.client.post(
            "/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "StrongPass123!"},
        )

        response = self.client.get("/api/v1/admin/session")

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.get_json()["authenticated"])
        self.assertEqual(response.get_json()["user"]["email"], "admin@example.com")

    def test_create_admin_cli_creates_user(self):
        result = self.runner.invoke(
            args=["create-admin"],
            input="admin@example.com\nStrongPass123!\nStrongPass123!\n",
        )

        self.assertEqual(result.exit_code, 0)
        self.assertIn("Admin user created: admin@example.com", result.output)

        with self.app.app_context():
            user = AdminUser.query.filter_by(email="admin@example.com").first()
            self.assertIsNotNone(user)
            self.assertTrue(user.check_password("StrongPass123!"))

    def test_create_admin_cli_rejects_duplicate_email(self):
        self.create_user()

        result = self.runner.invoke(
            args=["create-admin"],
            input="admin@example.com\nStrongPass123!\nStrongPass123!\n",
        )

        self.assertNotEqual(result.exit_code, 0)
        self.assertIn("Admin user already exists for this email.", result.output)


if __name__ == "__main__":
    unittest.main()
