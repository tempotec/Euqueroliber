"""Fluxo editorial de Publicacoes (Ticket 8).

Cobre a separacao entre VERSAO PUBLICA e VERSAO EM EDICAO:
editar uma publicacao publicada nao pode alterar o site ate que o
administrador acione explicitamente /publish.
"""

import unittest
from datetime import UTC

from app import create_app
from app.extensions import db
from app.models import (
    PUBLICATION_STATUS_DRAFT,
    PUBLICATION_STATUS_PUBLISHED,
    AdminUser,
    Publication,
)


class PublicationEditorialTestCase(unittest.TestCase):
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
            "title": "Artigo Base",
            "slug": None,
            "summary": "Resumo base",
            "content": "Conteudo base",
            "cover_image": None,
            "status": PUBLICATION_STATUS_PUBLISHED,
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

    def save_editorial_draft(self, publication_id, **overrides):
        payload = {
            "title": "Artigo Base",
            "summary": "Resumo base",
            "content": "Conteudo base",
        }
        payload.update(overrides)
        return self.client.put(f"/api/v1/admin/publications/{publication_id}", json=payload)

    # ------------------------------------------------------------------
    # 1 + 2 + 11 — edicao de publicada nao altera o site
    # ------------------------------------------------------------------

    def test_editing_published_publication_does_not_change_public_version(self):
        publication_id = self.create_publication(title="Artigo Base")
        self.login_admin()

        response = self.save_editorial_draft(
            publication_id,
            title="Titulo Editado",
            content="Conteudo editado",
        )

        self.assertEqual(response.status_code, 200)

        public = self.client.get("/api/v1/publications/artigo-base")
        self.assertEqual(public.status_code, 200)
        self.assertEqual(public.get_json()["title"], "Artigo Base")
        self.assertEqual(public.get_json()["content"], "Conteudo base")

    def test_saving_draft_preserves_public_columns(self):
        publication_id = self.create_publication(title="Artigo Base")
        self.login_admin()

        self.save_editorial_draft(publication_id, title="Titulo Editado")

        with self.app.app_context():
            publication = db.session.get(Publication, publication_id)
            self.assertEqual(publication.title, "Artigo Base")
            self.assertEqual(publication.slug, "artigo-base")
            self.assertIsNotNone(publication.draft_data)
            self.assertEqual(publication.draft_data["title"], "Titulo Editado")

    def test_draft_never_leaks_in_public_endpoints(self):
        publication_id = self.create_publication(title="Artigo Base")
        self.login_admin()
        self.save_editorial_draft(
            publication_id,
            title="Segredo Editorial",
            content="Conteudo secreto nao publicado",
        )

        self.client.post("/api/v1/auth/logout")

        listing = self.client.get("/api/v1/publications").get_json()
        detail = self.client.get("/api/v1/publications/artigo-base").get_json()

        serialized_listing = str(listing)
        serialized_detail = str(detail)

        self.assertNotIn("Segredo Editorial", serialized_listing)
        self.assertNotIn("Segredo Editorial", serialized_detail)
        self.assertNotIn("Conteudo secreto nao publicado", serialized_detail)
        self.assertNotIn("draft_data", serialized_detail)
        self.assertNotIn("draft_data", serialized_listing)

    # ------------------------------------------------------------------
    # 3 — a API admin entrega o rascunho ao editor
    # ------------------------------------------------------------------

    def test_admin_detail_exposes_draft_and_pending_flag(self):
        publication_id = self.create_publication(title="Artigo Base")
        self.login_admin()
        self.save_editorial_draft(publication_id, title="Titulo Editado")

        response = self.client.get(f"/api/v1/admin/publications/{publication_id}")
        payload = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertTrue(payload["has_unpublished_changes"])
        self.assertEqual(payload["draft_data"]["title"], "Titulo Editado")
        self.assertEqual(payload["editor_data"]["title"], "Titulo Editado")
        # a versao publica continua acessivel no mesmo payload
        self.assertEqual(payload["title"], "Artigo Base")

    def test_admin_detail_without_pending_changes(self):
        publication_id = self.create_publication(title="Artigo Base")
        self.login_admin()

        payload = self.client.get(f"/api/v1/admin/publications/{publication_id}").get_json()

        self.assertFalse(payload["has_unpublished_changes"])
        self.assertIsNone(payload["draft_data"])
        self.assertEqual(payload["editor_data"]["title"], "Artigo Base")

    def test_admin_list_flags_pending_changes_without_leaking_content(self):
        publication_id = self.create_publication(title="Artigo Base")
        self.login_admin()
        self.save_editorial_draft(publication_id, title="Titulo Editado")

        items = self.client.get("/api/v1/admin/publications").get_json()["items"]

        self.assertEqual(len(items), 1)
        self.assertTrue(items[0]["has_unpublished_changes"])
        self.assertNotIn("content", items[0])
        self.assertNotIn("draft_data", items[0])

    # ------------------------------------------------------------------
    # 4 + 5 — publicar alteracoes
    # ------------------------------------------------------------------

    def test_publishing_changes_updates_public_version(self):
        publication_id = self.create_publication(title="Artigo Base")
        self.login_admin()
        self.save_editorial_draft(
            publication_id,
            title="Titulo Editado",
            content="Conteudo editado",
        )

        response = self.client.post(f"/api/v1/admin/publications/{publication_id}/publish")

        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.get_json()["has_unpublished_changes"])
        self.assertIsNone(response.get_json()["draft_data"])

        public = self.client.get("/api/v1/publications/titulo-editado")
        self.assertEqual(public.status_code, 200)
        self.assertEqual(public.get_json()["content"], "Conteudo editado")

        self.assertEqual(
            self.client.get("/api/v1/publications/artigo-base").status_code,
            404,
        )

    def test_publishing_preserves_original_published_at(self):
        publication_id = self.create_publication(title="Artigo Base")

        with self.app.app_context():
            original = db.session.get(Publication, publication_id).published_at

        self.login_admin()
        self.save_editorial_draft(publication_id, title="Titulo Editado")
        response = self.client.post(f"/api/v1/admin/publications/{publication_id}/publish")

        with self.app.app_context():
            after = db.session.get(Publication, publication_id).published_at

        self.assertEqual(after, original)
        self.assertEqual(
            response.get_json()["published_at"],
            Publication.serialize_datetime(original),
        )

    def test_editing_word_does_not_reorder_public_listing(self):
        first_id = self.create_publication(title="Primeiro Artigo")
        second_id = self.create_publication(title="Segundo Artigo")

        self.login_admin()
        self.save_editorial_draft(first_id, title="Primeiro Artigo")
        self.client.post(f"/api/v1/admin/publications/{first_id}/publish")

        self.client.post("/api/v1/auth/logout")
        items = self.client.get("/api/v1/publications").get_json()["items"]

        with self.app.app_context():
            first_published_at = db.session.get(Publication, first_id).published_at
            second_published_at = db.session.get(Publication, second_id).published_at

        # a republicacao nao deve ter empurrado o primeiro artigo para o topo
        self.assertEqual(len(items), 2)
        self.assertLess(first_published_at, second_published_at)
        self.assertEqual(items[0]["slug"], "segundo-artigo")

    # ------------------------------------------------------------------
    # 6 + 8 + 9 — primeira publicacao
    # ------------------------------------------------------------------

    def test_first_publication_sets_published_at(self):
        self.login_admin()
        created = self.client.post(
            "/api/v1/admin/publications",
            json={"title": "Nunca Publicado", "content": "Conteudo", "status": "draft"},
        ).get_json()

        self.assertIsNone(created["published_at"])

        response = self.client.post(f"/api/v1/admin/publications/{created['id']}/publish")

        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.get_json()["published_at"])
        self.assertEqual(response.get_json()["status"], PUBLICATION_STATUS_PUBLISHED)

    def test_new_draft_is_not_public(self):
        self.login_admin()
        created = self.client.post(
            "/api/v1/admin/publications",
            json={"title": "Nunca Publicado", "content": "Conteudo", "status": "draft"},
        ).get_json()

        self.client.post("/api/v1/auth/logout")

        self.assertEqual(self.client.get("/api/v1/publications").get_json()["items"], [])
        self.assertEqual(
            self.client.get("/api/v1/publications/nunca-publicado").status_code,
            404,
        )

        self.login_admin()
        self.client.post(f"/api/v1/admin/publications/{created['id']}/publish")
        self.client.post("/api/v1/auth/logout")

        self.assertEqual(len(self.client.get("/api/v1/publications").get_json()["items"]), 1)

    def test_editing_never_published_draft_writes_columns(self):
        """Sem versao publica a proteger, o rascunho edita as colunas direto."""
        self.login_admin()
        created = self.client.post(
            "/api/v1/admin/publications",
            json={"title": "Nunca Publicado", "content": "Conteudo", "status": "draft"},
        ).get_json()

        response = self.save_editorial_draft(
            created["id"],
            title="Titulo Ajustado",
            content="Conteudo ajustado",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["title"], "Titulo Ajustado")
        self.assertIsNone(response.get_json()["draft_data"])
        self.assertFalse(response.get_json()["has_unpublished_changes"])

        self.client.post(f"/api/v1/admin/publications/{created['id']}/publish")
        self.client.post("/api/v1/auth/logout")

        public = self.client.get("/api/v1/publications/titulo-ajustado")
        self.assertEqual(public.status_code, 200)
        self.assertEqual(public.get_json()["content"], "Conteudo ajustado")

    # ------------------------------------------------------------------
    # 7 — descartar
    # ------------------------------------------------------------------

    def test_discard_restores_public_version_and_keeps_site_untouched(self):
        publication_id = self.create_publication(title="Artigo Base")
        self.login_admin()
        self.save_editorial_draft(publication_id, title="Titulo Editado", content="Editado")

        response = self.client.post(f"/api/v1/admin/publications/{publication_id}/revert")

        self.assertEqual(response.status_code, 200)
        self.assertIsNone(response.get_json()["draft_data"])
        self.assertFalse(response.get_json()["has_unpublished_changes"])
        self.assertEqual(response.get_json()["editor_data"]["title"], "Artigo Base")

        self.client.post("/api/v1/auth/logout")
        public = self.client.get("/api/v1/publications/artigo-base")
        self.assertEqual(public.status_code, 200)
        self.assertEqual(public.get_json()["title"], "Artigo Base")

    # ------------------------------------------------------------------
    # 10 + 11 — slug
    # ------------------------------------------------------------------

    def test_slug_change_in_draft_keeps_public_url(self):
        publication_id = self.create_publication(title="Artigo Base")
        self.login_admin()

        self.save_editorial_draft(publication_id, title="Artigo Base", slug="endereco-novo")

        self.assertEqual(self.client.get("/api/v1/publications/artigo-base").status_code, 200)
        self.assertEqual(self.client.get("/api/v1/publications/endereco-novo").status_code, 404)

    def test_slug_change_applies_only_after_publish(self):
        publication_id = self.create_publication(title="Artigo Base")
        self.login_admin()
        self.save_editorial_draft(publication_id, title="Artigo Base", slug="endereco-novo")

        self.client.post(f"/api/v1/admin/publications/{publication_id}/publish")

        self.assertEqual(self.client.get("/api/v1/publications/endereco-novo").status_code, 200)
        self.assertEqual(self.client.get("/api/v1/publications/artigo-base").status_code, 404)

    def test_draft_slug_conflicting_with_published_is_rejected(self):
        self.create_publication(title="Artigo Base")
        other_id = self.create_publication(title="Outro Artigo")
        self.login_admin()

        response = self.save_editorial_draft(other_id, title="Outro Artigo", slug="artigo-base")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "slug_already_exists")

    def test_draft_slug_conflicting_with_other_draft_is_rejected(self):
        """Dois rascunhos pendentes nao podem reivindicar o mesmo slug."""
        first_id = self.create_publication(title="Primeiro")
        second_id = self.create_publication(title="Segundo")
        self.login_admin()

        first = self.save_editorial_draft(first_id, title="Primeiro", slug="disputado")
        self.assertEqual(first.status_code, 200)

        second = self.save_editorial_draft(second_id, title="Segundo", slug="disputado")

        self.assertEqual(second.status_code, 400)
        self.assertEqual(second.get_json()["error"], "slug_already_exists")

    def test_publish_blocks_slug_conflict_that_appeared_later(self):
        """Se outra publicacao tomou o slug depois, o publish precisa falhar."""
        target_id = self.create_publication(title="Alvo")
        self.login_admin()
        self.save_editorial_draft(target_id, title="Alvo", slug="livre")

        # outra publicacao assume o slug antes do publish do alvo
        with self.app.app_context():
            intruder = Publication(
                title="Invasor",
                slug="livre",
                summary="",
                content="Conteudo",
            )
            intruder.apply_status(PUBLICATION_STATUS_PUBLISHED)
            db.session.add(intruder)
            db.session.commit()

        response = self.client.post(f"/api/v1/admin/publications/{target_id}/publish")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "slug_already_exists")

    # ------------------------------------------------------------------
    # 14 — despublicar
    # ------------------------------------------------------------------

    def test_unpublish_keeps_pending_edits_as_draft_content(self):
        publication_id = self.create_publication(title="Artigo Base")
        self.login_admin()
        self.save_editorial_draft(publication_id, title="Titulo Editado", content="Editado")

        response = self.client.post(f"/api/v1/admin/publications/{publication_id}/unpublish")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["status"], PUBLICATION_STATUS_DRAFT)
        self.assertIsNone(response.get_json()["draft_data"])
        # o trabalho do editor nao pode ser perdido
        self.assertEqual(response.get_json()["title"], "Titulo Editado")

        self.client.post("/api/v1/auth/logout")
        self.assertEqual(self.client.get("/api/v1/publications").get_json()["items"], [])

    # ------------------------------------------------------------------
    # 15 — autorizacao
    # ------------------------------------------------------------------

    def test_mutating_endpoints_require_admin(self):
        publication_id = self.create_publication(title="Artigo Base")

        endpoints = [
            ("post", f"/api/v1/admin/publications/{publication_id}/publish"),
            ("post", f"/api/v1/admin/publications/{publication_id}/unpublish"),
            ("post", f"/api/v1/admin/publications/{publication_id}/revert"),
            ("put", f"/api/v1/admin/publications/{publication_id}"),
            ("delete", f"/api/v1/admin/publications/{publication_id}"),
            ("get", f"/api/v1/admin/publications/{publication_id}"),
        ]

        for method, url in endpoints:
            with self.subTest(endpoint=url):
                response = getattr(self.client, method)(url, json={"title": "x", "content": "y"})
                self.assertEqual(response.status_code, 401)

    def test_editorial_endpoints_return_404_for_unknown_publication(self):
        self.login_admin()

        for url in (
            "/api/v1/admin/publications/999/publish",
            "/api/v1/admin/publications/999/unpublish",
            "/api/v1/admin/publications/999/revert",
        ):
            with self.subTest(endpoint=url):
                response = self.client.post(url)
                self.assertEqual(response.status_code, 404)
                self.assertEqual(response.get_json(), {"error": "not_found"})
