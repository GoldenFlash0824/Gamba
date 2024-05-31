import db from '../models/index.js'
import {getUserIdFromToken} from '../utilities/authentication.js'

const createCart = async (req) => {
    const {product_id, quantity, price} = req.body
    const u_id = await getUserIdFromToken(req)

    let _createCart = await db.AddToCart.create({
        u_id: u_id,
        product_id: product_id,
        quantity: quantity,
        price: price
    })
    if (_createCart) {
        return {
            data: {cart: _createCart},
            status: true,
            message: `Item added into cart successfully`
        }
    } else {
        return {
            status: false,
            message: `Failed to add item into cart`
        }
    }
}

const updateCart = async (req) => {
    const {cart_id} = req.params

    const {product_id, quantity, price} = req.body
    const u_id = await getUserIdFromToken(req)

    await db.AddToCart.findOne({
        where: {id: cart_id, u_id: u_id}
    })

    let _updateCart = await db.AddToCart.update(
        {
            product_id: product_id,
            quantity: quantity,
            price: price
        },
        {
            where: {
                id: cart_id,
                u_id: u_id
            }
        }
    )
    if (_updateCart) {
        return {
            data: {cartUpdated: _updateCart},
            status: true,
            message: `Cart updated successfully `
        }
    } else {
        return {
            status: false,
            message: `error`
        }
    }
}

const deleteCart = async (req) => {
    const {cart_id} = req.params
    const u_id = await getUserIdFromToken(req)

    const post = await db.AddToCart.findOne({
        where: {id: cart_id, u_id: u_id}
    })

    if (post) {
        const _deletedCart = await db.AddToCart.destroy({
            where: {
                id: cart_id,
                u_id: u_id
            }
        })

        if (_deletedCart) {
            return {
                data: {cartDeleted: true},
                status: true,
                message: `Cart deleted successfully `
            }
        } else {
            return {
                status: false,
                message: `Failed to delete cart`
            }
        }
    } else {
        return {
            status: false,
            message: `Cart Not Found `
        }
    }
}

const getAllCartProduct = async (req) => {
    let allCarts = await db.AddToCart.findAll({})

    if (allCarts) {
        return {
            data: {allCarts: allCarts},
            status: true,
            message: `All cart product`
        }
    } else {
        return {
            status: false,
            message: `Failed to get all products`
        }
    }
}

export {createCart, updateCart, deleteCart, getAllCartProduct}
