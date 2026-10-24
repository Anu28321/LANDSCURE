from decimal import Decimal

from sqlalchemy import DECIMAL, ForeignKey, String, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker


DATABASE_URL = "mysql+pymysql://root:password@localhost:3306/land_store"

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


class LandProperty(Base):
    __tablename__ = "land_properties"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    price: Mapped[Decimal] = mapped_column(DECIMAL(12, 2), nullable=False)


class CartItem(Base):
    __tablename__ = "cart_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    property_id: Mapped[int] = mapped_column(ForeignKey("land_properties.id"), unique=True, nullable=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_properties(db: Session) -> None:
    if db.query(LandProperty).first():
        return

    db.add_all(
        [
            LandProperty(title="Green Valley Plot", location="Coimbatore", price=Decimal("2500000.00")),
            LandProperty(title="Sunrise Acres", location="Chennai", price=Decimal("4800000.00")),
            LandProperty(title="River Edge Land", location="Madurai", price=Decimal("3200000.00")),
        ]
    )
    db.commit()


def init_db() -> None:
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        seed_properties(db)
