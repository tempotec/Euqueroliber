from pathlib import Path

from flask import Flask

from .cli import register_commands
from .config import Config
from .extensions import cors, db, migrate
from . import models
from .routes import api_v1_bp


def create_app(config_overrides: dict | None = None) -> Flask:
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)

    if config_overrides:
        app.config.update(config_overrides)

    Path(app.instance_path).mkdir(parents=True, exist_ok=True)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": app.config["CORS_ORIGINS"],
                "supports_credentials": True,
            }
        },
    )
    app.register_blueprint(api_v1_bp)
    register_commands(app)

    return app
