from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.orm import Session

from db import CartItem, LandProperty, get_db


router = APIRouter()


class PropertyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    location: str
    price: Decimal


class AddToCartRequest(BaseModel):
    property_id: int


class CartItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    property_id: int


class CartPropertyResponse(BaseModel):
    id: int
    property_id: int
    property: PropertyResponse


@router.get("/properties", response_model=list[PropertyResponse])
def get_properties(db: Session = Depends(get_db)):
    return db.query(LandProperty).all()


@router.get("/properties/{property_id}", response_model=PropertyResponse)
def get_property_by_id(property_id: int, db: Session = Depends(get_db)):
    property_record = db.get(LandProperty, property_id)
    if property_record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")

    return property_record


@router.post("/cart", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
def add_property_to_cart(payload: AddToCartRequest, db: Session = Depends(get_db)):
    property_record = db.get(LandProperty, payload.property_id)
    if property_record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")

    existing_cart_item = db.query(CartItem).filter(CartItem.property_id == payload.property_id).first()
    if existing_cart_item is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Property already in cart")

    cart_item = CartItem(property_id=payload.property_id)
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return cart_item


@router.get("/cart", response_model=list[CartPropertyResponse])
def get_cart_items(db: Session = Depends(get_db)):
    rows = db.execute(
        select(CartItem, LandProperty).join(LandProperty, LandProperty.id == CartItem.property_id)
    ).all()

    return [
        CartPropertyResponse(
            id=cart_item.id,
            property_id=cart_item.property_id,
            property=PropertyResponse.model_validate(property_record),
        )
        for cart_item, property_record in rows
    ]


@router.delete("/cart/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_property_from_cart(property_id: int, db: Session = Depends(get_db)):
    cart_item = db.query(CartItem).filter(CartItem.property_id == property_id).first()
    if cart_item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found in cart")

    db.delete(cart_item)
    db.commit()
