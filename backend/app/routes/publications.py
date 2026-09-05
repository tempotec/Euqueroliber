from flask import jsonify

from ..models import PUBLICATION_STATUS_PUBLISHED, Publication
from . import api_v1_bp


def not_found_response():
    return jsonify({"error": "not_found"}), 404


@api_v1_bp.get("/publications")
def list_public_publications():
    publications = (
        Publication.query.filter_by(status=PUBLICATION_STATUS_PUBLISHED)
        .order_by(Publication.published_at.desc(), Publication.id.desc())
        .all()
    )
    return jsonify({"items": [publication.to_public_dict() for publication in publications]})


@api_v1_bp.get("/publications/<string:slug>")
def get_public_publication(slug: str):
    normalized_slug = Publication.normalize_slug(slug)
    publication = (
        Publication.query.filter_by(
            slug=normalized_slug,
            status=PUBLICATION_STATUS_PUBLISHED,
        ).first()
    )

    if publication is None:
        return not_found_response()

    return jsonify(publication.to_dict())
