import db from '../models/index.js'
import { s3SharpImageUpload, deleteMultipleImage, s3ImageUpload } from './aws.js'
import { facetStage } from './userService.js'
import { getUserIdFromToken } from '../utilities/authentication.js'
import ExcelJs from 'exceljs'

import dotenv from 'dotenv'
dotenv.config()
import Stripe from 'stripe'
import moment from 'moment-timezone'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const createProductGood = async (req) => {
    const { name, price, is_donation, is_trade, images, quantity, is_organic, category_id, trade_with, discount, chemical_id, unit, available_from, available_to, allow_to_0rder, is_delivery, is_pickUp, advance_order_day, advance_order_in_weeks, distance, caption, allow_to_0rder_advance, none, allow_per_person, isUnlimitted } = req.body
    const u_id = await getUserIdFromToken(req)

    let user = await db.User.findOne({
        where: {
            id: u_id,
            [db.Op.or]: [{ disable: true }, { is_block: true }]
        }
    })

    if (user) {
        return {
            status: false,
            message: user?.is_block ? `You'r blocked by admin` : `Your account is disabled by admin`
        }
    }

    const formattedDate_available_to = moment.tz(available_to, process.env.TIME_ZONE).format('MM/DD/YY')
    const formattedDate_available_from = moment.tz(available_from, process.env.TIME_ZONE).format('MM/DD/YY')

    // // for app serialization issue
    const imagess = typeof images == 'string' ? JSON.parse(images) : images
    const trade_withh = typeof trade_with == 'string' ? JSON.parse(trade_with) : trade_with

    let productImage = []

    if (imagess?.length) {
        for (let i = 0; i < imagess?.length; i++) {
            const startStr = imagess[i].toString().startsWith('data:image/')
            if (startStr) {
                productImage.push(await s3ImageUpload(imagess[i]))
            }
        }
    }

    let _createPoste
    if (is_donation) {
        _createPoste = await db.UserProducts.create({
            name: name,
            price: '0',
            is_donation: is_donation,
            is_trade: is_trade,
            u_id: u_id,
            images: productImage,
            quantity: quantity,
            is_organic: is_organic,
            category_id: category_id,
            unit: unit,
            discount: discount,
            is_block: false,
            available_from: formattedDate_available_from,
            available_to: formattedDate_available_to,
            // allow_to_0rder,
            is_delivery,
            is_pickUp,
            // advance_order_day,
            // advance_order_in_weeks,
            distance,
            caption,
            none,
            allow_per_person,
            isUnlimitted
        })
    } else if (is_trade) {
        _createPoste = await db.UserProducts.create({
            name: name,
            price: '0',
            is_donation: is_donation,
            is_trade: is_trade,
            u_id: u_id,
            images: productImage,
            quantity: quantity,
            is_organic: is_organic,
            category_id: category_id,
            unit: unit,
            discount: discount,
            is_block: false,
            available_from: formattedDate_available_from,
            available_to: formattedDate_available_to,
            allow_to_0rder,
            allow_to_0rder_advance,
            is_delivery,
            is_pickUp,
            // advance_order_day,
            // advance_order_in_weeks,
            distance,
            caption,
            none,
            isUnlimitted
        })
        let tradeproduct = [...trade_withh]
        const result = trade_with.map((trade) => `${trade.trade_title},${trade.trade_quantity}`).join(', ')
        await db.userTrades.create({ product_id: _createPoste.id, title: trade_with })
        // })
    } else {
        _createPoste = await db.UserProducts.create({
            name: name,
            price: price,
            is_donation: is_donation,
            is_trade: is_trade,
            u_id: u_id,
            images: productImage,
            quantity: quantity,
            is_organic: is_organic,
            category_id: category_id,
            discount: discount,
            unit: unit,
            is_block: false,
            available_from: formattedDate_available_from,
            available_to: formattedDate_available_to,
            allow_to_0rder,
            allow_to_0rder_advance,
            is_delivery,
            is_pickUp,
            // advance_order_day,
            // advance_order_in_weeks,
            distance,
            caption,
            none,
            isUnlimitted
        })
        // if (is_organic !== true) {
        //     let _chemical = await db.UserProducts.update(
        //         {
        //             chemical_id: chemical_id
        //         },
        //         {
        //             where: {id: _createPoste.id}
        //         }
        //     )
        // }
    }
    let chemical
    if (is_organic == false) {
        for (const info of chemical_id) {
            chemical = await db.ChemicalDetail.create({
                chemical_id: info,
                product_id: _createPoste.id
            })
        }
    }

    return {
        data: { post: _createPoste },
        status: true,
        message: `Product created successfully`
    }
}

const updateProductGood = async (req) => {
    const { product_good_id } = req.params
    const { name, price, is_donation, is_trade, images, quantity, trade_with, discount, category_id, chemical_id, is_organic, unit, available_from, available_to, allow_to_0rder, is_delivery, is_pickUp, advance_order_day, advance_order_in_weeks, distance, caption, allow_to_0rder_advance, none, allow_per_person, isUnlimitted } = req.body
    const u_id = await getUserIdFromToken(req)

    let user = await db.User.findOne({
        where: {
            id: u_id,
            [db.Op.or]: [{ disable: true }, { is_block: true }]
        }
    })

    if (user) {
        return {
            status: false,
            message: user?.is_block ? `You'r blocked by admin` : `Your account is disabled by admin`
        }
    }

    let formattedDate_available_to = moment(available_to).format('MM/DD/YY')
    const _available_from = moment(available_from).format('MM/DD/YY')

    const imagess = typeof images == 'string' ? JSON.parse(images) : images
    const trade_withh = typeof trade_with == 'string' ? JSON.parse(trade_with) : trade_with

    const product = await db.UserProducts.findOne({
        where: { id: product_good_id, u_id: u_id }
    })

    if (product) {
        let prevImageData = typeof product?.images == 'string' ? JSON.parse(product?.images) : product?.images
        let removedImages = prevImageData?.filter((e) => !imagess?.includes(e))
        removedImages?.length ? await deleteMultipleImage(removedImages) : ''

        let productImage = []

        if (imagess?.length) {
            for (let i = 0; i < imagess?.length; i++) {
                const startStr = imagess[i].toString().startsWith('data:image/')
                if (startStr) {
                    const uploadedImage = await s3ImageUpload(imagess[i])
                    productImage.push(uploadedImage)
                } else {
                    productImage.push(imagess[i])
                }
            }
        }
        let _check = await db.UserProducts.findOne({ where: { id: product_good_id } })
        await db.userTrades.destroy({ where: { product_id: _check.id } })
        let _updateProduct
        if (is_donation) {
            _updateProduct = await db.UserProducts.update(
                {
                    name: name,
                    price: '0',
                    is_donation: is_donation,
                    is_trade: is_trade,
                    images: productImage,
                    quantity: quantity,
                    discount: discount,
                    unit: unit,
                    available_from: _available_from,
                    available_to: formattedDate_available_to,
                    is_delivery,
                    is_pickUp,
                    distance,
                    caption,
                    none,
                    allow_per_person,
                    category_id: category_id,
                    isUnlimitted: isUnlimitted
                },
                {
                    where: {
                        id: product_good_id,
                        u_id: u_id
                    }
                }
            )
        } else if (is_trade) {
            _updateProduct = await db.UserProducts.update(
                {
                    name: name,
                    price: price,
                    is_donation: is_donation,
                    is_trade: is_trade,
                    images: productImage,
                    quantity: quantity,
                    discount: discount,
                    unit: unit,
                    available_from: _available_from,
                    available_to: formattedDate_available_to,
                    allow_to_0rder,
                    allow_to_0rder_advance,
                    is_delivery,
                    is_pickUp,
                    distance,
                    caption,
                    none,
                    category_id: category_id,
                    isUnlimitted: isUnlimitted
                },
                {
                    where: {
                        id: product_good_id,
                        u_id: u_id
                    }
                }
            )

            let product = await db.UserProducts.findOne({ where: { id: product_good_id } })
            let data = await db.userTrades.findOne({ where: { product_id: product.id } })
            if (!data) {
                await db.userTrades.create({ product_id: product_good_id, title: trade_with })
            } else {
                await db.userTrades.update({ title: trade_with }, { where: { product_id: product_good_id } })
            }
        } else {
            _updateProduct = await db.UserProducts.update(
                {
                    name: name,
                    price: price,
                    is_donation: is_donation,
                    is_trade: is_trade,
                    images: productImage,
                    quantity: quantity,
                    discount: discount,
                    unit: unit,
                    available_from: _available_from,
                    available_to: formattedDate_available_to,
                    allow_to_0rder,
                    allow_to_0rder_advance,
                    is_delivery,
                    is_pickUp,
                    // advance_order_day,
                    // advance_order_in_weeks,
                    distance,
                    caption,
                    none,
                    category_id: category_id,
                    isUnlimitted: isUnlimitted
                },
                {
                    where: {
                        id: product_good_id,
                        u_id: u_id
                    }
                }
            )
        }

        if (is_organic == false) {
            await db.UserProducts.update(
                {
                    is_organic: false
                },
                {
                    where: {
                        id: product_good_id
                    }
                }
            )
            let check = await db.ChemicalDetail.findAll({
                where: {
                    product_id: product_good_id
                }
            })
            if (check) {
                await db.ChemicalDetail.destroy({
                    where: {
                        product_id: product_good_id
                    }
                })
            }
            for (const info of chemical_id) {
                let chemical = await db.ChemicalDetail.create({
                    chemical_id: info,
                    product_id: product_good_id
                })
            }
        } else {
            await db.UserProducts.update(
                {
                    is_organic: true
                },
                {
                    where: {
                        id: product_good_id
                    }
                }
            )
            await db.ChemicalDetail.destroy({
                where: {
                    product_id: product_good_id
                }
            })
        }

        if (_updateProduct[0]) {
            return {
                data: { productUpdated: _updateProduct },
                status: true,
                message: `Product updated successfully`
            }
        } else {
            return {
                status: false,
                message: `error`
            }
        }
    } else {
        return {
            status: false,
            message: `error`
        }
    }
}

const deleteProductGood = async (req) => {
    const { product_good_id } = req.params
    const u_id = await getUserIdFromToken(req)

    let user = await db.User.findOne({
        where: {
            id: u_id,
            [db.Op.or]: [{ disable: true }, { is_block: true }]
        }
    })

    if (user) {
        return {
            status: false,
            message: user?.is_block ? `You'r blocked by admin` : `Your account is disabled by admin`
        }
    }

    const product = await db.UserProducts.findOne({
        where: { id: product_good_id, u_id: u_id }
    })

    if (product) {
        let _delete_product = await db.UserProducts.destroy({
            where: { id: product_good_id, u_id: u_id }
        })

        let _delete_trade = await db.userTrades.destroy({
            where: { product_id: product_good_id }
        })

        if (_delete_product) {
            return {
                data: { deleteProduct: true },
                status: true,
                message: `Product deleted successfully`
            }
        } else {
            return {
                status: false,
                message: `Failed to delete product `
            }
        }
    } else {
        return {
            status: false,
            message: `Product not found`
        }
    }
}

const getAllProductGood = async (req) => {
    try {
        const { limit, offset } = await facetStage(req.query.page)
        const is_trade = req.query.is_trade
        const is_donation = req.query.is_donation
        const is_discount = req.query.is_discount
        const is_organic = req.query.is_organic
        const u_id = await getUserIdFromToken(req)
        const currentDate = moment().format('MM/DD/YY')

        //block user product

        let block_user_data = await db.User.findAll({
            where: {
                is_block: true
            }
        })

        let block_user_id = []
        block_user_id = block_user_data?.length ? block_user_data.map((n) => n.id) : []

        let all_block_user_product = await db.UserProducts.findAll({
            where: {
                u_id: { [db.Op.in]: block_user_id }
            },
            attributes: ['id', 'u_id']
        })
        all_block_user_product = all_block_user_product.map((product) => product.id)

        //disable user data
        let disable_user_data = await db.User.findAll({
            where: {
                disable: true
            }
        })

        let hideSeller = await db.hideSeller.findAll({
            where: {
                u_id: u_id
            },
            attributes: ['seller_id'],
            raw: true
        })

        hideSeller = hideSeller.map((re) => re.seller_id)

        let disable_user_id = []
        disable_user_id = disable_user_data?.length ? disable_user_data.map((n) => n.id) : []

        let all_disable_user_product = await db.UserProducts.findAll({
            where: {
                u_id: { [db.Op.in]: disable_user_id }
            },
            attributes: ['id', 'u_id']
        })
        all_disable_user_product = all_disable_user_product.map((product) => product.id)

        let where = parseInt(is_trade) == 1 ? { is_trade: true, is_donation: false, discount: 0, is_block: false, is_organic: is_organic == 'true' ? true : false } : parseInt(is_donation) == 1 ? { is_donation: true, is_trade: false, discount: 0, is_block: false, is_organic: is_organic == 'true' ? true : false } : parseInt(is_discount) == 1 ? { is_donation: false, is_trade: false, discount: { [db.Op.gt]: 0 }, is_block: false, is_organic: is_organic == 'true' ? true : false } : is_organic == 'true' ? { is_organic: true } : {}
        const whereClause = {}
        if ('$userProductGood.allow_to_0rder_advance' > 0) {
            whereClause.available_from = {
                [db.Op.lte]: moment().add('$userProductGood.allow_to_0rder_advance', 'days').format('MM/DD/YY')
            }
        } else {
            whereClause.available_from = {
                [db.Op.lte]: currentDate
            }
        }

        let allProducts = await db.UserProducts.findAll({
            where: {
                ...where,
                [db.Op.or]: [
                    {
                        available_to: {
                            [db.Op.gte]: currentDate
                        },
                        isUnlimitted: false
                    },
                    { isUnlimitted: true }
                ],

                available_from: {
                    [db.Op.lte]: db.sequelize.literal(`
                    CASE
                        WHEN userProductGood.id = userProductGood.id AND userProductGood.allow_to_0rder_advance > 0 THEN
                            CASE
                                WHEN userProductGood.allow_to_0rder = 'Hour(s)' THEN
                                    DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProductGood.allow_to_0rder_advance HOUR), '%m/%d/%y')
                                ELSE
                                    DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProductGood.allow_to_0rder_advance DAY), '%m/%d/%y')
                            END
                        ELSE '${currentDate}'
                    END
                `)
                },
                id: { [db.Op.notIn]: [...all_disable_user_product, ...all_block_user_product] },
                u_id: { [db.Op.notIn]: hideSeller },
                is_block: false
            },
            order: [['createdAt', 'DESC']],
            attributes: {
                include: [
                    [db.sequelize.literal(`(SELECT COUNT(*) FROM favorites WHERE product_id = userProductGood.id)`), 'num_favorites'],
                    [db.sequelize.literal(`CASE WHEN EXISTS(SELECT 1 FROM favorites WHERE favorites.product_id = userProductGood.id AND favorites.u_id = ${u_id}) THEN TRUE ELSE FALSE END`), 'isFev'],
                    [db.sequelize.literal(`COALESCE((SELECT SUM(quantity)FROM soldProducts WHERE product_id = userProductGood.id),0)`), 'totalSold']
                ]
            },
            include: [
                {
                    association: 'trade'
                },
                {
                    association: 'category'
                },
                {
                    association: 'chemicall'
                },
                {
                    association: 'fev-product'
                },
                {
                    association: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'chat_id', 'lat', 'log', 'image', 'email', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'stripe_account_id', 'stripe_account_verified']
                },
                {
                    association: 'chemical_data',

                    include: [
                        {
                            association: 'chemical_data_detail'
                        }
                    ]
                }
            ],
            offset: offset,
            limit: limit
        })


        if (allProducts) {
            return {
                data: { allProducts: allProducts },
                status: true,
                message: `All products`
            }
        } else {
            return {
                status: false,
                message: `Failed to get all products`
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error?.message
        }
    }
}

//todo..it is admin

const addCategory = async (req) => {
    const { category_title } = req.body
    let _createCategoiry = await db.Categories.create({ title: category_title })

    return {
        data: { category: _createCategoiry },
        status: true,
        message: `Category created successfully`
    }
}

const getCategory = async (req) => {
    const { limit, offset } = await facetStage(req.query.page)
    let _where = {
        where: {
            ...(req.query?.isWeb && {
                disabled: false
            }),
        }
    }

    let _getCategoiry = await db.Categories.findAndCountAll({
        ..._where,
        attributes: { include: [[db.sequelize.literal(`(SELECT COUNT(*) FROM userProductGoods WHERE category_id = categories.id)`), 'usedInProducts'],] },
        limit: limit,
        offset: offset
    })

    let categoryCount = await db.Categories.count()
    const remainingCount = _getCategoiry?.count - (offset + _getCategoiry?.rows.length)
    return {
        data: { category: _getCategoiry.rows, categoryCount, count: _getCategoiry.count, remaining: remainingCount, page: req.query.page },
        status: true,
        message: `Category data got successfully`
    }
}

const updateCategory = async (req) => {
    try {
        const { title } = req.body
        const { id } = req.params
        await db.Categories.update(
            { title: title },
            {
                where: {
                    id: id
                }
            }
        )

        return {
            status: true,
            message: `Category is updated`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}
const getCategorySearch = async (req) => {
    try {
        const { search } = req.body
        let _getCategoiry = await db.Categories.findAll({
            where: {
                [db.Op.or]: [
                    {
                        id: {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        title: {
                            [db.Op.like]: `%${search}%`
                        }
                    }
                ]
            }
        })

        return {
            data: { category: _getCategoiry },
            status: true,
            message: `your search result is `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const deleteCategory = async (req) => {
    try {
        const { id, isEnable } = req.params
        let getCategory = await db.Categories.findOne({
            where: {
                id: id
            },
            attributes: { include: [[db.sequelize.literal(`(SELECT COUNT(*) FROM userProductGoods WHERE category_id = categories.id)`), 'usedInProducts'],] },
        })

        if (getCategory) {
            if (isEnable == 'true') {
                await db.Categories.update({ disabled: false }, {
                    where: {
                        id: id
                    }
                })

                return {
                    status: true,
                    message: `Category is enabled`
                }
            } else if (getCategory?.dataValues?.usedInProducts != 0) {
                await db.Categories.update({ disabled: true }, {
                    where: {
                        id: id
                    }
                })

                return {
                    status: true,
                    message: `Category is disabled`
                }
            } else {
                await db.Categories.destroy({
                    where: {
                        id: id
                    }
                })

                return {
                    status: true,
                    message: `Category is delete`
                }
            }

        }

    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const addChemical = async (req) => {
    const { chemical_title } = req.body
    let _createChemical = await db.Chemicals.create({ title: chemical_title })

    return {
        data: { chemical: _createChemical },
        status: true,
        message: `Chemical created successfully`
    }
}

//import chemicals from excel file
const importChemicals = async (req) => {
    const fileBuffer = req.file.buffer
    const workbook = new ExcelJs.Workbook()
    await workbook.xlsx.load(fileBuffer)
    const worksheet = workbook.getWorksheet(1)

    if (worksheet?.columns?.length) {
        for (let i = 0; i < worksheet?.columns[0]?.values?.length; i++) {
            let title = worksheet?.columns[0]?.values[i]?.richText[0]?.text
            try {
                let check = await db.Chemicals.findOne({ where: { title: title } })
                if (title && !check) {

                    await db.Chemicals.create({ title: title.charAt(0).toUpperCase() + title.slice(1)?.toLowerCase() })
                }
            } catch (error) {
                console.error(`Error inserting row`, error)
            }
        }
    }

    return {
        data: true,
        status: true,
        message: `Chemical created successfully`
    }
}
const getChemical = async (req) => {
    const { limit, offset } = await facetStage(req.query.page)
    let _getChemical = await db.Chemicals.findAndCountAll({
        // limit: limit,
        // offset: offset
    })
    let chemical_count = await db.Chemicals.count()
    const remainingCount = _getChemical?.count - (offset + _getChemical?.rows.length)
    return {
        data: { chemical: _getChemical.rows, chemical_count, count: _getChemical.count, remaining: remainingCount, page: req.query.page },
        status: true,
        message: `Chemical data got successfully`
    }
}
const updateChemical = async (req) => {
    try {
        const { title } = req.body
        const { id } = req.params
        await db.Chemicals.update(
            { title: title },
            {
                where: {
                    id: id
                }
            }
        )

        return {
            status: true,
            message: `Chemical is updated`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const deleteChemical = async (req) => {
    try {
        const { id } = req.params
        await db.Chemicals.destroy({
            where: {
                id: id
            }
        })

        return {
            status: true,
            message: `Chemical is delete`
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const getChemicalSearch = async (req) => {
    try {
        const { search } = req.body
        let _getChemical = await db.Chemicals.findAll({
            where: {
                [db.Op.or]: [
                    {
                        id: {
                            [db.Op.like]: `%${search}%`
                        }
                    },
                    {
                        title: {
                            [db.Op.like]: `%${search}%`
                        }
                    }
                ]
            }
        })

        return {
            data: { chemical: _getChemical },
            status: true,
            message: `your search result is `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const search = async (req) => {
    let { trade, tradeWith, is_organic } = req.body
    is_organic == 'true' ? true : false
    const u_id = await getUserIdFromToken(req)
    const currentDate = moment().format('MM/DD/YY')

    //disable user data
    let disable_user_data = await db.User.findAll({
        where: {
            disable: true
        }
    })

    let hideSeller = await db.hideSeller.findAll({
        where: {
            u_id: u_id
        },
        attributes: ['seller_id'],
        raw: true
    })

    hideSeller = hideSeller.map((re) => re.seller_id)

    let disable_user_id = []
    disable_user_id = disable_user_data?.length ? disable_user_data.map((n) => n.id) : []

    let all_disable_user_product = await db.UserProducts.findAll({
        where: {
            u_id: { [db.Op.in]: disable_user_id }
        },
        attributes: ['id', 'u_id']
    })
    all_disable_user_product = all_disable_user_product.map((product) => product.id)

    let _getSearchData = await db.UserProducts.findAll({
        attributes: {
            include: [
                [db.sequelize.literal(`(SELECT COUNT(*) FROM favorites WHERE product_id = userProductGood.id)`), 'num_favorites'],
                [db.sequelize.literal(`CASE WHEN EXISTS(SELECT 1 FROM favorites WHERE favorites.product_id = userProductGood.id AND favorites.u_id = ${u_id}) THEN TRUE ELSE FALSE END`), 'isFev']
            ]
        },
        include: [
            {
                association: 'trade'
            },
            {
                association: 'category'
            },
            {
                association: 'chemicall'
            },
            {
                association: 'fev-product'
            },
            {
                association: 'user',
                attributes: ['id', 'first_name', 'last_name', 'chat_id', 'lat', 'log', 'image', 'email', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'stripe_account_id', 'stripe_account_verified']
            },
            {
                association: 'chemical_data',

                include: [
                    {
                        association: 'chemical_data_detail'
                    }
                ]
            }
        ],
        where: {
            name: {
                [db.Op.like]: `%${trade}%`
            },
            '$trade.title$': {
                [db.Op.like]: `%${tradeWith}%`
            },
            '$trade.title$': {
                [db.Op.like]: `%${tradeWith?.toLowerCase()}%`
            },

            [db.Op.or]: [
                {
                    available_to: {
                        [db.Op.gte]: currentDate
                    },
                    isUnlimitted: false
                },
                { isUnlimitted: true }
            ],

            available_from: {
                [db.Op.lte]: db.sequelize.literal(`
            CASE
                WHEN userProductGood.id = userProductGood.id AND userProductGood.allow_to_0rder_advance > 0 THEN
                    CASE
                        WHEN userProductGood.allow_to_0rder = 'Hour(s)' THEN
                            DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProductGood.allow_to_0rder_advance HOUR), '%m/%d/%y')
                        ELSE
                            DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProductGood.allow_to_0rder_advance DAY), '%m/%d/%y')
                    END
                ELSE '${currentDate}'
            END
        `)
            },
            id: { [db.Op.notIn]: all_disable_user_product },
            u_id: { [db.Op.notIn]: hideSeller },
            is_trade: true,
            is_organic: is_organic
        }
    })
    return {
        data: { search: _getSearchData },
        status: true,
        message: `search Result`
    }
}

const markfev = async (req) => {
    const { product_id } = req.body
    const u_id = await getUserIdFromToken(req)

    let getproduct = await db.UserProducts.findOne({ id: product_id })

    if (getproduct) {
        let alreadyFev = await db.favorite.findOne({ where: { u_id: u_id, product_id: product_id } })
        if (alreadyFev) {
            await db.favorite.destroy({
                where: {
                    id: alreadyFev.id
                }
            })
            return {
                status: true,
                message: `Product Remove from favorite`
            }
        } else {
            let favorite = await db.favorite.create({ u_id: u_id, product_id: product_id })

            if (favorite) {
                return {
                    data: { favorite: favorite },
                    status: true,
                    message: `Product added to favourites`
                }
            } else {
                return {
                    status: false,
                    message: `Failed to add as favourite`
                }
            }
        }
    }
}

const verifyCreditCard = async (req) => {
    const { card_number, card_exp_month, card_exp_year, card_cvc } = req.body

    try {
        const token = await stripe.tokens.create({
            card: {
                number: card_number,
                exp_month: card_exp_month,
                exp_year: card_exp_year,
                cvc: card_cvc
            }
        })

        return {
            data: { token: { token } },
            status: true,
            message: `card is verified`
        }
    } catch (error) {
        return {
            status: false,
            message: `Failed to verify card`
        }
    }
}

//todo..add for loop user will share his entire cart/.. it means its order do payment and add data in db

const soldProductGood = async (req) => {
    const { product_array } = req.body
    let update_product
    for (let i = 0; i < product_array.length; i++) {
        const { product_id, u_id, quantity, date } = product_array[i]
        let _soldProduct = await db.Orders.create({
            product_id: product_id,
            u_id: u_id,
            quantity: quantity,
            date: date
        })
        let product = await db.UserProducts.findOne({ where: { id: product_id } })
        let total_quantity = product.quantity
        let new_quantity = total_quantity - quantity
        update_product = await db.UserProducts.update(
            { quantity: new_quantity },
            {
                where: {
                    id: product_id
                }
            }
        )
    }
    if (update_product) {
        return {
            data: {},
            status: true,
            message: `Product purchase successfully`
        }
    } else {
        return {
            status: false,
            message: `Failed to purchase product`
        }
    }
}

const searchProductGood = async (req) => {
    const { limit, offset } = await facetStage(req.query.page)
    const is_trade = req.query.is_trade
    const is_donation = req.query.is_donation
    const is_discount = req.query.is_discount
    const filter = req.query.filter
    const is_organic = req.query.is_organic == 'true' ? true : false
    const currentDate = moment().format('MM/DD/YY')
    const u_id = await getUserIdFromToken(req)

    //disable user data
    let disable_user_data = await db.User.findAll({
        where: {
            disable: true
        }
    })

    let hideSeller = await db.hideSeller.findAll({
        where: {
            u_id: u_id
        },
        attributes: ['seller_id'],
        raw: true
    })

    hideSeller = hideSeller.map((re) => re.seller_id)

    let disable_user_id = []
    disable_user_id = disable_user_data?.length ? disable_user_data.map((n) => n.id) : []

    let all_disable_user_product = await db.UserProducts.findAll({
        where: {
            u_id: { [db.Op.in]: disable_user_id }
        },
        attributes: ['id', 'u_id']
    })
    all_disable_user_product = all_disable_user_product.map((product) => product.id)

    let where = parseInt(is_trade) == 1 ? { is_trade: true, is_donation: false, discount: 0, is_block: false, is_organic: is_organic == 'true' ? true : false } : parseInt(is_donation) == 1 ? { is_donation: true, is_trade: false, discount: 0, is_block: false, is_organic: is_organic == 'true' ? true : false } : parseInt(is_discount) == 1 ? { is_donation: false, is_trade: false, discount: { [db.Op.gt]: 0 }, is_block: false, is_organic: is_organic == 'true' ? true : false } : is_organic == 'true' ? { is_organic: true } : {}
    const categoryIds = await db.Categories.findAll({
        attributes: ['id'],
        where: {
            title: {
                [db.Op.like]: `%${filter}%`,
            },
        },
    });

    const categoryIdsArray = categoryIds.map(category => category.id);

    const userIds = await db.User.findAll({
        attributes: ['id'],
        where: {
            [db.Op.or]: [
                db.sequelize.literal(`CONCAT(first_name,'',last_name) LIKE '%${filter}%'`),
                db.sequelize.literal(`CONCAT(first_name ,' ', last_name) LIKE '%${filter}%'`),
                { first_name: { [db.Op.like]: `%${filter}%` } },
                { last_name: { [db.Op.like]: `%${filter}%` } },

            ],
        },
    });


    const userIdsArray = userIds.map(category => category.id);
    let allProducts = await db.UserProducts.findAll({
        include: [
            {
                association: 'trade'
            },
            {
                model: db.Categories,
                as: 'category',
            },
            {
                association: 'chemicall'
            },
            {
                association: 'fev-product'
            },
            {
                association: 'user',

                attributes: ['id', 'first_name', 'last_name', 'chat_id', 'lat', 'log', 'image', 'email', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'stripe_account_id', 'stripe_account_verified']
            },
            {
                association: 'chemical_data',

                include: [
                    {
                        association: 'chemical_data_detail'
                    }
                ]
            }
            //{model: db.ProductChemical, as: 'productChemicals'}
        ],
        where: {
            ...where,
            [db.Op.or]: [
                {
                    available_to: {
                        [db.Op.gte]: currentDate
                    },
                    isUnlimitted: false
                },
                { isUnlimitted: true }
            ],

            available_from: {
                [db.Op.lte]: db.sequelize.literal(`
            CASE
                WHEN userProductGood.id = userProductGood.id AND userProductGood.allow_to_0rder_advance > 0 THEN
                    CASE
                        WHEN userProductGood.allow_to_0rder = 'Hour(s)' THEN
                            DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProductGood.allow_to_0rder_advance HOUR), '%m/%d/%y')
                        ELSE
                            DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProductGood.allow_to_0rder_advance DAY), '%m/%d/%y')
                    END
                ELSE '${currentDate}'
            END
        `)
            },
            is_block: false,
            id: { [db.Op.notIn]: all_disable_user_product },
            u_id: { [db.Op.notIn]: hideSeller },
            // '$category$': { [db.Op.like]: filter } ,
            // { [db.Op.or]: [{ '$user.first_name$': { [db.Op.like]: '%' + filter + '%' } }, { '$last_name&': { [db.Op.like]: '%' + filter + '%' } }, db.sequelize.literal(`CONCAT(user.first_name, ' ', user.last_name) LIKE '%${filter}%'`),] },
            [db.Op.or]: [{
                category_id: {
                    [db.Op.in]: categoryIdsArray,
                },
            }, {
                u_id: {
                    [db.Op.in]: userIdsArray,
                },
            }, { caption: { [db.Op.like]: '%' + filter + '%' } }, { name: { [db.Op.like]: '%' + filter + '%' } }]
        },

        order: [['createdAt', 'DESC']],
        attributes: {
            include: [
                [db.sequelize.literal(`(SELECT COUNT(*) FROM favorites WHERE product_id = userProductGood.id)`), 'num_favorites'],
                [db.sequelize.literal(`CASE WHEN EXISTS(SELECT 1 FROM favorites WHERE favorites.product_id = userProductGood.id AND favorites.u_id = ${u_id}) THEN TRUE ELSE FALSE END`), 'isFev'],
                [db.sequelize.literal(`COALESCE((SELECT SUM(quantity)FROM soldProducts WHERE product_id = userProductGood.id),0)`), 'totalSold']
            ]
        },

        offset: offset,
        limit: limit
    })

    if (allProducts) {
        return {
            data: { allProducts: allProducts },
            status: true,
            message: `All products`
        }
    } else {
        return {
            status: false,
            message: `Failed to get all products`
        }
    }
}

const addRating = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const { product_id, rating } = req.body
        let seller = await db.UserProducts.findOne({ where: { id: product_id } })
        let seller_id = seller.dataValues.u_id
        let all_ready_rated = await db.rating.findOne({ where: { u_id: u_id, product_id: product_id } })
        if (all_ready_rated) {
            return {
                status: false,
                message: `allready rated product`
            }
        }
        let updated_rating
        if (rating > 5) {
            updated_rating = 5
        } else {
            updated_rating = rating
        }
        let _rating = await db.rating.create({ u_id: u_id, product_id: product_id, rating: updated_rating, seller: seller_id })

        return {
            data: _rating,
            status: true,
            message: `your rating is save`
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getUserProductGood = async (req) => {
    const { limit, offset } = await facetStage(req.query.page)
    const u_id = await getUserIdFromToken(req)

    let userProducts = await db.UserProducts.findAll({
        where: { u_id: u_id },
        order: [['createdAt', 'DESC']],
        attributes: {
            include: [
                [db.sequelize.literal(`(SELECT COUNT(*) FROM favorites WHERE product_id = userProductGood.id)`), 'num_favorites'],

                [db.sequelize.literal(`EXISTS(SELECT * FROM favorites WHERE product_id = userProductGood.id AND u_id = ${u_id})`), 'isFev']
            ]
        },
        include: [
            {
                association: 'trade'
            },
            {
                association: 'category'
            },
            {
                association: 'chemicall'
            },
            {
                association: 'fev-product'
            },
            {
                association: 'chemical_data',

                include: [
                    {
                        association: 'chemical_data_detail'
                    }
                ]
            },
            {
                association: 'user',
                attributes: ['id', 'first_name', 'last_name', 'chat_id', 'lat', 'log', 'image', 'email', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'stripe_account_id', 'stripe_account_verified']
            }
        ],
        offset: offset,
        limit: limit
    })

    if (userProducts) {
        return {
            data: { userProducts: userProducts },
            status: true,
            message: `User products`
        }
    } else {
        return {
            status: false,
            message: `Failed to get user products`
        }
    }
}

const getProductRating = async (req) => {
    try {
        const { id } = req.params
        let ratingCount = await db.rating.count({ where: { seller: id } })
        let sum = await db.rating.sum('rating', { where: { seller: id } })
        let avg = sum / ratingCount
        let average = avg.toFixed(1)

        return {
            data: { avg: average, ratingCount: ratingCount },
            status: true,
            message: `product  rating is`
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const updateProductRating = async (req) => {
    try {
        const { u_id, product_id, rating } = req.body
        let update_rating
        if (rating > 5) {
            update_rating = 5
        } else {
            update_rating = rating
        }
        let check_rating = await db.rating.findOne({ where: { u_id: u_id, product_id: product_id } })
        if (check_rating) {
            let updated_data = await db.rating.update(
                { rating: update_rating },
                {
                    where: {
                        u_id: u_id,
                        product_id: product_id
                    }
                }
            )

            return {
                status: true,
                message: `rating is updated`
            }
        } else {
            return {
                status: false,
                message: `rating record is not found `
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getProductById = async (req) => {
    const { limit, offset } = await facetStage(req.query.page)
    const { product_id } = req.body
    let allProducts = await db.UserProducts.findOne({
        where: { id: product_id },
        attributes: {
            include: [[db.sequelize.literal(`(SELECT COUNT(*) FROM favorites WHERE product_id = userProductGood.id)`), 'num_favorites']]
        },
        include: [
            {
                association: 'trade'
            },
            {
                association: 'category'
            },
            {
                association: 'chemicall'
            },
            {
                association: 'fev-product'
            },
            {
                association: 'chemical_data',

                include: [
                    {
                        association: 'chemical_data_detail'
                    }
                ]
            },
            {
                association: 'user',
                attributes: ['id', 'first_name', 'last_name', 'chat_id', 'lat', 'log', 'image', 'email', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'stripe_account_id', 'stripe_account_verified']
            }
        ]
    })

    if (allProducts) {
        return {
            data: allProducts,
            status: true,
            message: `single Product Details`
        }
    } else {
        return {
            status: false,
            message: `Failed to get all products`
        }
    }
}
const getFevProduct = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let fevProduct = await db.favorite.findAll({
            where: {
                u_id: u_id
            },

            include: [
                {
                    association: 'fevrate_product_detail',
                    attributes: {
                        include: [
                            [db.sequelize.literal(`(SELECT COUNT(*) FROM favorites WHERE product_id = fevrate_product_detail.id)`), 'num_favorites'],
                            [db.sequelize.literal(`EXISTS(SELECT * FROM favorites WHERE product_id = fevrate_product_detail.id AND u_id = ${u_id})`), 'isFev']
                        ]
                    },
                    include: [
                        {
                            association: 'trade'
                        },
                        {
                            association: 'category'
                        },
                        {
                            association: 'chemicall'
                        },
                        {
                            association: 'fev-product'
                        },
                        {
                            association: 'chemical_data',

                            include: [
                                {
                                    association: 'chemical_data_detail'
                                }
                            ]
                        },
                        {
                            association: 'user',
                            attributes: ['id', 'first_name', 'last_name', 'chat_id', 'lat', 'log', 'image', 'email', 'display_phone', 'display_email', 'display_dob', 'display_location', 'display_profile', 'display_dob_full_format', 'stripe_account_id', 'stripe_account_verified']
                        }
                    ]
                }
            ]
        })
        return {
            data: fevProduct,
            status: true,
            message: `User All Fev Product`
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const sideBarCountProduct = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const currentDate = moment().format('MM/DD/YY')

        //disable user data
        let disable_user_data = await db.User.findAll({
            where: {
                disable: true
            }
        })
        let disable_user_id = []
        disable_user_id = disable_user_data?.length ? disable_user_data.map((n) => n.id) : []

        let allProductCount = await db.UserProducts.count({
            attributes: ['u_id', 'available_to', 'available_from'],
            where: {
                [db.Op.or]: [
                    {
                        available_to: {
                            [db.Op.gte]: currentDate
                        },
                        isUnlimitted: false
                    },
                    { isUnlimitted: true }
                ],
                available_from: {
                    [db.Op.lte]: db.sequelize.literal(`
                CASE
                    WHEN userProductGood.id = userProductGood.id AND userProductGood.allow_to_0rder_advance > 0 THEN
                        CASE
                            WHEN userProductGood.allow_to_0rder = 'Hour(s)' THEN
                                DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProductGood.allow_to_0rder_advance HOUR), '%m/%d/%y')
                            ELSE
                                DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProductGood.allow_to_0rder_advance DAY), '%m/%d/%y')
                        END
                    ELSE '${currentDate}'
                END
            `)
                },
                u_id: {
                    [db.Op.notIn]: disable_user_id
                }
            }
        })
        let tradeProductCount = await db.UserProducts.count({
            attributes: ['u_id', 'available_to', 'available_from', 'is_trade'],
            where: {
                is_trade: true,
                [db.Op.or]: [
                    {
                        available_to: {
                            [db.Op.gte]: currentDate
                        },
                        isUnlimitted: false
                    },
                    { isUnlimitted: true }
                ],
                available_from: {
                    [db.Op.lte]: db.sequelize.literal(`
                CASE
                    WHEN userProductGood.id = userProductGood.id AND userProductGood.allow_to_0rder_advance > 0 THEN
                        CASE
                            WHEN userProductGood.allow_to_0rder = 'Hour(s)' THEN
                                DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProductGood.allow_to_0rder_advance HOUR), '%m/%d/%y')
                            ELSE
                                DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProductGood.allow_to_0rder_advance DAY), '%m/%d/%y')
                        END
                    ELSE '${currentDate}'
                END
            `)
                },
                u_id: {
                    [db.Op.notIn]: disable_user_id
                }
            }
        })
        let saleProductCount = await db.UserProducts.count({
            attributes: ['u_id', 'available_to', 'available_from', 'discount'],
            where: {
                discount: {
                    [db.Op.gt]: 0
                },
                [db.Op.or]: [
                    {
                        available_to: {
                            [db.Op.gte]: currentDate
                        },
                        isUnlimitted: false
                    },
                    { isUnlimitted: true }
                ],
                available_from: {
                    [db.Op.lte]: db.sequelize.literal(`
                CASE
                    WHEN userProductGood.id = userProductGood.id AND userProductGood.allow_to_0rder_advance > 0 THEN
                        CASE
                            WHEN userProductGood.allow_to_0rder = 'Hour(s)' THEN
                                DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProductGood.allow_to_0rder_advance HOUR), '%m/%d/%y')
                            ELSE
                                DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProductGood.allow_to_0rder_advance DAY), '%m/%d/%y')
                        END
                    ELSE '${currentDate}'
                END
            `)
                },
                u_id: {
                    [db.Op.notIn]: disable_user_id
                }
            }
        })
        let donationCount = await db.UserProducts.count({
            attributes: ['u_id', 'available_to', 'available_from', 'is_donation'],
            where: {
                is_donation: true,

                [db.Op.or]: [
                    {
                        available_to: {
                            [db.Op.gte]: currentDate
                        },
                        isUnlimitted: false
                    },
                    { isUnlimitted: true }
                ],
                available_from: {
                    [db.Op.lte]: db.sequelize.literal(`
                CASE
                    WHEN userProductGood.id = userProductGood.id AND userProductGood.allow_to_0rder_advance > 0 THEN
                        CASE
                            WHEN userProductGood.allow_to_0rder = 'Hour(s)' THEN
                                DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProductGood.allow_to_0rder_advance HOUR), '%m/%d/%y')
                            ELSE
                                DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProductGood.allow_to_0rder_advance DAY), '%m/%d/%y')
                        END
                    ELSE '${currentDate}'
                END
            `)
                },
                u_id: {
                    [db.Op.notIn]: disable_user_id
                }
            }
        })

        const userProducts = await db.UserProducts.findAll({
            attributes: ['u_id', 'available_to', 'available_from'],
            where: {
                [db.Op.or]: [
                    {
                        available_to: {
                            [db.Op.gte]: currentDate
                        },
                        isUnlimitted: false
                    },
                    { isUnlimitted: true }
                ],
                available_from: {
                    [db.Op.lte]: db.sequelize.literal(`
                CASE
                    WHEN userProductGood.id = userProductGood.id AND userProductGood.allow_to_0rder_advance > 0 THEN
                        CASE
                            WHEN userProductGood.allow_to_0rder = 'Hour(s)' THEN
                                DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProductGood.allow_to_0rder_advance HOUR), '%m/%d/%y')
                            ELSE
                                DATE_FORMAT(DATE_ADD(NOW(), INTERVAL userProductGood.allow_to_0rder_advance DAY), '%m/%d/%y')
                        END
                    ELSE '${currentDate}'
                END
            `)
                },
                u_id: {
                    [db.Op.notIn]: disable_user_id
                }
            }
        })

        const uIds = userProducts.map((userProduct) => userProduct.u_id)
        const uniqueSellerData = [...new Set(uIds)]

        let sellerCount = uniqueSellerData.length

        return {
            data: { allProductCount, tradeProductCount, saleProductCount, donationCount, sellerCount },
            status: true,
            message: `side bar count of Product `
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

export { createProductGood, updateProductGood, verifyCreditCard, deleteProductGood, getAllProductGood, addCategory, markfev, getCategory, addChemical, getChemical, search, soldProductGood, addRating, getProductRating, updateProductRating, searchProductGood, getUserProductGood, updateCategory, deleteCategory, getCategorySearch, updateChemical, deleteChemical, getChemicalSearch, getProductById, getFevProduct, sideBarCountProduct, importChemicals }
