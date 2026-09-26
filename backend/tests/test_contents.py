import unittest

from app import create_app
from app.extensions import db
from app.models import CONTENT_SECTION_KEYS, AdminUser, ContentSection


class ContentTestCase(unittest.TestCase):
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
            admin = AdminUser(email="admin@example.com", is_active=True)
            admin.set_password("StrongPass123!")
            db.session.add(admin)
            db.session.commit()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def login_admin(self):
        response = self.client.post(
            "/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "StrongPass123!"},
        )
        self.assertEqual(response.status_code, 200)

    def create_section(self, key="home", draft=None, published=None):
        with self.app.app_context():
            section = ContentSection(
                key=key,
                draft_data={"value": "draft"} if draft is None else draft,
                published_data={"value": "published"} if published is None else published,
            )
            db.session.add(section)
            db.session.commit()
            return section.id

    # ------------------------------------------------------------------
    # Publico
    # ------------------------------------------------------------------

    def test_public_list_returns_sections(self):
        self.create_section(key="home")

        response = self.client.get("/api/v1/content")
        self.assertEqual(response.status_code, 200)

        payload = response.get_json()
        self.assertIn("sections", payload)
        self.assertEqual(len(payload["sections"]), 1)
        self.assertEqual(payload["sections"][0]["key"], "home")

    def test_public_detail_uses_published_data(self):
        self.create_section(
            key="home",
            draft={"value": "rascunho"},
            published={"value": "publicado"},
        )

        response = self.client.get("/api/v1/content/home")
        self.assertEqual(response.status_code, 200)

        payload = response.get_json()
        self.assertEqual(payload["key"], "home")
        self.assertEqual(payload["data"], {"value": "publicado"})

    def test_public_never_exposes_draft_data(self):
        self.create_section(
            key="home",
            draft={"segredo": "nao-pode-vazar"},
            published={"value": "publicado"},
        )

        detail = self.client.get("/api/v1/content/home")
        self.assertEqual(detail.status_code, 200)

        body = detail.get_data(as_text=True)
        self.assertNotIn("segredo", body)
        self.assertNotIn("nao-pode-vazar", body)
        self.assertNotIn("draft_data", body)

        listing = self.client.get("/api/v1/content")
        listing_body = listing.get_data(as_text=True)
        self.assertNotIn("segredo", listing_body)
        self.assertNotIn("nao-pode-vazar", listing_body)
        self.assertNotIn("draft_data", listing_body)

    def test_public_invalid_key_returns_invalid_content_key(self):
        for key in ("proposito", "diferenciais", "impacto", "clientes", "publicacoes", "hero"):
            response = self.client.get(f"/api/v1/content/{key}")
            self.assertEqual(response.status_code, 404)
            self.assertEqual(response.get_json()["error"], "invalid_content_key")

    def test_public_valid_key_without_record_returns_404(self):
        response = self.client.get("/api/v1/content/home")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json()["error"], "not_found")

    # ------------------------------------------------------------------
    # Admin - autenticacao
    # ------------------------------------------------------------------

    def test_admin_endpoints_require_authentication(self):
        self.create_section(key="home")

        self.assertEqual(self.client.get("/api/v1/admin/content").status_code, 401)
        self.assertEqual(self.client.get("/api/v1/admin/content/home").status_code, 401)
        self.assertEqual(
            self.client.put("/api/v1/admin/content/home", json={"data": {}}).status_code,
            401,
        )
        self.assertEqual(
            self.client.post("/api/v1/admin/content/home/publish").status_code,
            401,
        )
        self.assertEqual(
            self.client.post("/api/v1/admin/content/home/revert").status_code,
            401,
        )

    def test_admin_list_sections(self):
        self.create_section(key="home")
        self.create_section(key="contato")
        self.login_admin()

        response = self.client.get("/api/v1/admin/content")
        self.assertEqual(response.status_code, 200)

        payload = response.get_json()
        keys = [section["key"] for section in payload["sections"]]
        self.assertEqual(keys, ["contato", "home"])

    def test_admin_get_section_returns_draft_and_published(self):
        self.create_section(key="home")
        self.login_admin()

        response = self.client.get("/api/v1/admin/content/home")
        self.assertEqual(response.status_code, 200)

        payload = response.get_json()
        self.assertEqual(payload["key"], "home")
        self.assertEqual(payload["draft_data"], {"value": "draft"})
        self.assertEqual(payload["published_data"], {"value": "published"})

    def test_admin_unknown_section_returns_404(self):
        self.login_admin()

        response = self.client.get("/api/v1/admin/content/home")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json()["error"], "not_found")

    # ------------------------------------------------------------------
    # Admin - draft
    # ------------------------------------------------------------------

    def test_admin_update_only_changes_draft(self):
        self.create_section(
            key="home",
            draft={"value": "draft"},
            published={"value": "published"},
        )
        self.login_admin()

        response = self.client.put(
            "/api/v1/admin/content/home",
            json={"data": {"titulo": "Novo titulo"}},
        )
        self.assertEqual(response.status_code, 200)

        payload = response.get_json()
        self.assertEqual(payload["draft_data"], {"titulo": "Novo titulo"})
        self.assertEqual(payload["published_data"], {"value": "published"})

        with self.app.app_context():
            section = ContentSection.query.filter_by(key="home").first()
            self.assertEqual(section.draft_data, {"titulo": "Novo titulo"})
            self.assertEqual(section.published_data, {"value": "published"})

    def test_admin_update_draft_does_not_change_public_site(self):
        self.create_section(
            key="home",
            draft={"value": "draft"},
            published={"value": "publicado"},
        )
        self.login_admin()

        self.client.put(
            "/api/v1/admin/content/home",
            json={"data": {"value": "rascunho-novo"}},
        )

        public = self.client.get("/api/v1/content/home")
        self.assertEqual(public.get_json()["data"], {"value": "publicado"})

    def test_admin_update_with_invalid_payload_returns_400(self):
        self.create_section(key="home")
        self.login_admin()

        invalid_payloads = [
            {},
            {"data": None},
            {"data": "texto"},
            {"data": ["lista"]},
            {"data": 10},
            {"data": True},
        ]

        for payload in invalid_payloads:
            response = self.client.put("/api/v1/admin/content/home", json=payload)
            self.assertEqual(response.status_code, 400, msg=f"payload={payload}")
            self.assertEqual(response.get_json()["error"], "validation_error")

        with self.app.app_context():
            section = ContentSection.query.filter_by(key="home").first()
            self.assertEqual(section.draft_data, {"value": "draft"})

    def test_admin_update_invalid_key_does_not_create_record(self):
        self.login_admin()

        response = self.client.put(
            "/api/v1/admin/content/proposito",
            json={"data": {"value": "x"}},
        )
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json()["error"], "invalid_content_key")

        with self.app.app_context():
            self.assertEqual(ContentSection.query.count(), 0)

    # ------------------------------------------------------------------
    # Admin - publish
    # ------------------------------------------------------------------

    def test_admin_publish_snapshots_draft(self):
        self.create_section(
            key="home",
            draft={"value": "rascunho"},
            published={"value": "publicado"},
        )
        self.login_admin()

        self.client.put(
            "/api/v1/admin/content/home",
            json={"data": {"value": "novo-rascunho"}},
        )

        response = self.client.post("/api/v1/admin/content/home/publish")
        self.assertEqual(response.status_code, 200)

        payload = response.get_json()
        self.assertEqual(payload["published_data"], {"value": "novo-rascunho"})
        self.assertIsNotNone(payload["published_at"])

    def test_public_changes_after_publish(self):
        self.create_section(
            key="home",
            draft={"value": "rascunho"},
            published={"value": "publicado"},
        )
        self.login_admin()

        self.client.put(
            "/api/v1/admin/content/home",
            json={"data": {"value": "versao-final"}},
        )

        before = self.client.get("/api/v1/content/home")
        self.assertEqual(before.get_json()["data"], {"value": "publicado"})

        self.client.post("/api/v1/admin/content/home/publish")

        after = self.client.get("/api/v1/content/home")
        self.assertEqual(after.get_json()["data"], {"value": "versao-final"})

    def test_publish_is_a_copy_not_a_reference(self):
        self.create_section(key="home", draft={"value": "origem"}, published={"value": "antigo"})
        self.login_admin()

        self.client.post("/api/v1/admin/content/home/publish")

        self.client.put(
            "/api/v1/admin/content/home",
            json={"data": {"value": "alterado-depois"}},
        )

        public = self.client.get("/api/v1/content/home")
        self.assertEqual(public.get_json()["data"], {"value": "origem"})

    # ------------------------------------------------------------------
    # Admin - revert
    # ------------------------------------------------------------------

    def test_admin_revert_restores_draft_from_published(self):
        self.create_section(
            key="home",
            draft={"value": "rascunho"},
            published={"value": "publicado"},
        )
        self.login_admin()

        self.client.put(
            "/api/v1/admin/content/home",
            json={"data": {"value": "alteracao"}},
        )

        response = self.client.post("/api/v1/admin/content/home/revert")
        self.assertEqual(response.status_code, 200)

        payload = response.get_json()
        self.assertEqual(payload["draft_data"], {"value": "publicado"})
        self.assertEqual(payload["published_data"], {"value": "publicado"})

    def test_admin_revert_does_not_change_published(self):
        self.create_section(
            key="home",
            draft={"value": "rascunho"},
            published={"value": "publicado"},
        )
        self.login_admin()

        self.client.put(
            "/api/v1/admin/content/home",
            json={"data": {"value": "alteracao"}},
        )
        self.client.post("/api/v1/admin/content/home/revert")

        public = self.client.get("/api/v1/content/home")
        self.assertEqual(public.get_json()["data"], {"value": "publicado"})

        with self.app.app_context():
            section = ContentSection.query.filter_by(key="home").first()
            self.assertEqual(section.published_data, {"value": "publicado"})

    # ------------------------------------------------------------------
    # Seed
    # ------------------------------------------------------------------

    def test_seed_creates_missing_sections(self):
        runner = self.app.test_cli_runner()
        result = runner.invoke(args=["seed-content"])
        self.assertEqual(result.exit_code, 0, msg=result.output)

        with self.app.app_context():
            sections = ContentSection.query.all()
            keys = {section.key for section in sections}
            self.assertEqual(keys, set(CONTENT_SECTION_KEYS))

            for section in sections:
                self.assertNotEqual(section.published_data, {})
                self.assertIsNotNone(section.published_at)

    def test_seed_does_not_overwrite_existing_sections(self):
        with self.app.app_context():
            db.session.add(
                ContentSection(
                    key="home",
                    draft_data={"custom": True},
                    published_data={"custom": True},
                )
            )
            db.session.commit()

        runner = self.app.test_cli_runner()
        result = runner.invoke(args=["seed-content"])
        self.assertEqual(result.exit_code, 0, msg=result.output)

        with self.app.app_context():
            section = ContentSection.query.filter_by(key="home").first()
            self.assertEqual(section.draft_data, {"custom": True})
            self.assertEqual(section.published_data, {"custom": True})
            self.assertEqual(ContentSection.query.count(), len(CONTENT_SECTION_KEYS))


if __name__ == "__main__":
    unittest.main()
