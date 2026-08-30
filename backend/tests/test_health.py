import unittest

from app import create_app


class HealthcheckTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(
            {
                "TESTING": True,
                "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
                "CORS_ORIGINS": ["http://localhost:5173"],
            }
        )
        self.client = self.app.test_client()

    def test_healthcheck_returns_ok(self):
        response = self.client.get("/api/v1/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"status": "ok"})

    def test_database_healthcheck_returns_connected(self):
        response = self.client.get("/api/v1/health/db")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.get_json(),
            {"status": "ok", "database": "connected"},
        )


if __name__ == "__main__":
    unittest.main()
