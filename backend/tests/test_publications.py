from datetime import UTC, datetime
import unittest

from app import create_app
from app.extensions import db
from app.models import (
    PUBLICATION_STATUS_DRAFT,
    PUBLICATION_STATUS_PUBLISHED,
    AdminUser,
    Publication,
    slugify,
)


class PublicationTestCase(unittest.TestCase):
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

    def create_publication(self, **overrides):
        defaults = {
            "title": "Educacao Ambiental na Rocinha",
            "summary": "Resumo",
            "content": "Conteudo completo",
            "cover_image": None,
            "status": PUBLICATION_STATUS_DRAFT,
        }
        defaults.update(overrides)

        with self.app.app_context():
            publication = Publication(
                title=defaults["title"],
                slug=Publication.normalize_slug(defaults.get("slug") or defaults["title"]),
                summary=defaults["summary"],
                content=defaults["content"],
                cover_image=defaults["cover_image"],
            )
            publication.apply_status(defaults["status"])
            db.session.add(publication)
            db.session.commit()
            return publication.id

    def test_slugify_normalizes_accents(self):
        self.assertEqual(
            slugify("Educacao Ambiental na Rocinha"),
            "educacao-ambiental-na-rocinha",
        )
        self.assertEqual(
            slugify("Educação Ambiental na Rocinha"),
            "educacao-ambiental-na-rocinha",
        )

    def test_publication_default_status_is_draft(self):
        with self.app.app_context():
            publication = Publication(
                title="Teste",
                slug="teste",
                summary="",
                content="Conteudo",
            )
            self.assertEqual(publication.status, PUBLICATION_STATUS_DRAFT)

    def test_admin_access_requires_login(self):
        response = self.client.get("/api/v1/admin/publications")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.get_json(), {"authenticated": False})

    def test_create_draft_publication(self):
        self.login_admin()
        response = self.client.post(
            "/api/v1/admin/publications",
            json={
                "title": "Publicacao de Teste",
                "content": "Conteudo",
                "summary": "Resumo",
            },
        )

        payload = response.get_json()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(payload["status"], PUBLICATION_STATUS_DRAFT)
        self.assertIsNone(payload["published_at"])
        self.assertEqual(payload["slug"], "publicacao-de-teste")

    def test_create_published_publication(self):
        self.login_admin()
        response = self.client.post(
            "/api/v1/admin/publications",
            json={
                "title": "Publicado Agora",
                "content": "Conteudo",
                "status": PUBLICATION_STATUS_PUBLISHED,
            },
        )

        payload = response.get_json()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(payload["status"], PUBLICATION_STATUS_PUBLISHED)
        self.assertIsNotNone(payload["published_at"])

    def test_admin_list_returns_drafts_and_published(self):
        self.create_publication(title="Primeira", status=PUBLICATION_STATUS_DRAFT)
        self.create_publication(title="Segunda", status=PUBLICATION_STATUS_PUBLISHED)
        self.login_admin()

        response = self.client.get("/api/v1/admin/publications")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.get_json()["items"]), 2)

    def test_get_admin_publication_by_id(self):
        publication_id = self.create_publication()
        self.login_admin()

        response = self.client.get(f"/api/v1/admin/publications/{publication_id}")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["id"], publication_id)

    def test_update_admin_publication(self):
        publication_id = self.create_publication()
        self.login_admin()

        response = self.client.put(
            f"/api/v1/admin/publications/{publication_id}",
            json={
                "title": "Novo titulo",
                "content": "Novo conteudo",
                "summary": "Novo resumo",
                "cover_image": "/uploads/publications/capa.jpg",
            },
        )

        payload = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(payload["title"], "Novo titulo")
        self.assertEqual(payload["slug"], "novo-titulo")
        self.assertEqual(payload["cover_image"], "/uploads/publications/capa.jpg")

    def test_transition_draft_to_published_sets_timestamp(self):
        publication_id = self.create_publication(status=PUBLICATION_STATUS_DRAFT)
        self.login_admin()

        response = self.client.put(
            f"/api/v1/admin/publications/{publication_id}",
            json={
                "title": "Educacao Ambiental na Rocinha",
                "content": "Conteudo completo",
                "status": PUBLICATION_STATUS_PUBLISHED,
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["status"], PUBLICATION_STATUS_PUBLISHED)
        self.assertIsNotNone(response.get_json()["published_at"])

    def test_transition_published_to_draft_clears_timestamp(self):
        publication_id = self.create_publication(status=PUBLICATION_STATUS_PUBLISHED)
        self.login_admin()

        response = self.client.put(
            f"/api/v1/admin/publications/{publication_id}",
            json={
                "title": "Educacao Ambiental na Rocinha",
                "content": "Conteudo completo",
                "status": PUBLICATION_STATUS_DRAFT,
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["status"], PUBLICATION_STATUS_DRAFT)
        self.assertIsNone(response.get_json()["published_at"])

    def test_delete_publication(self):
        publication_id = self.create_publication()
        self.login_admin()

        response = self.client.delete(f"/api/v1/admin/publications/{publication_id}")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"deleted": True})

    def test_duplicate_slug_returns_validation_error(self):
        self.create_publication(title="Mesmo Slug")
        self.login_admin()

        response = self.client.post(
            "/api/v1/admin/publications",
            json={
                "title": "Mesmo Slug",
                "content": "Outro conteudo",
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "slug_already_exists")

    def test_empty_title_is_rejected(self):
        self.login_admin()
        response = self.client.post(
            "/api/v1/admin/publications",
            json={"title": "  ", "content": "Conteudo"},
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "validation_error")

    def test_empty_content_is_rejected(self):
        self.login_admin()
        response = self.client.post(
            "/api/v1/admin/publications",
            json={"title": "Titulo", "content": " "},
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "validation_error")

    def test_invalid_status_is_rejected(self):
        self.login_admin()
        response = self.client.post(
            "/api/v1/admin/publications",
            json={"title": "Titulo", "content": "Conteudo", "status": "archived"},
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "validation_error")

    def test_missing_publication_id_returns_404(self):
        self.login_admin()
        response = self.client.get("/api/v1/admin/publications/999")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"error": "not_found"})

    def test_public_list_returns_only_published(self):
        self.create_publication(title="Draft", status=PUBLICATION_STATUS_DRAFT)
        self.create_publication(title="Publicado", status=PUBLICATION_STATUS_PUBLISHED)

        response = self.client.get("/api/v1/publications")

        self.assertEqual(response.status_code, 200)
        items = response.get_json()["items"]
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["slug"], "publicado")
        self.assertNotIn("content", items[0])

    def test_public_detail_returns_published_publication(self):
        self.create_publication(title="Publicado", status=PUBLICATION_STATUS_PUBLISHED)

        response = self.client.get("/api/v1/publications/publicado")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["status"], PUBLICATION_STATUS_PUBLISHED)

    def test_public_detail_hides_draft(self):
        self.create_publication(title="Rascunho", status=PUBLICATION_STATUS_DRAFT)

        response = self.client.get("/api/v1/publications/rascunho")

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"error": "not_found"})

    def test_public_detail_returns_404_for_unknown_slug(self):
        response = self.client.get("/api/v1/publications/inexistente")

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"error": "not_found"})

    def test_public_list_orders_by_published_at_desc(self):
        first_id = self.create_publication(title="Primeira", status=PUBLICATION_STATUS_PUBLISHED)
        second_id = self.create_publication(title="Segunda", status=PUBLICATION_STATUS_PUBLISHED)

        with self.app.app_context():
            first = db.session.get(Publication, first_id)
            second = db.session.get(Publication, second_id)
            first.published_at = datetime(2026, 8, 30, 18, 0, tzinfo=UTC)
            second.published_at = datetime(2026, 8, 30, 19, 0, tzinfo=UTC)
            db.session.commit()

        response = self.client.get("/api/v1/publications")

        items = response.get_json()["items"]
        self.assertEqual(items[0]["slug"], "segunda")
        self.assertEqual(items[1]["slug"], "primeira")
