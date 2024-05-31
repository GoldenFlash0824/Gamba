import responseUtil from '../utilities/response.js'
import * as productService from '../services/productService.js'
import multer from 'multer'

const createProductGood = async (req, res) => {
    const response = await productService.createProductGood(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.post)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getAllProductGood = async (req, res) => {
    const response = await productService.getAllProductGood(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.allProducts)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const addCategory = async (req, res) => {
    const response = await productService.addCategory(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.category)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getCategory = async (req, res) => {
    const response = await productService.getCategory(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const updateCategory = async (req, res) => {
    const response = await productService.updateCategory(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const deleteCategory = async (req, res) => {
    const response = await productService.deleteCategory(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getCategorySearch = async (req, res) => {
    const response = await productService.getCategorySearch(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const addChemical = async (req, res) => {
    const response = await productService.addChemical(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.chemical)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getChemical = async (req, res) => {
    const response = await productService.getChemical(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateChemical = async (req, res) => {
    const response = await productService.updateChemical(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deleteChemical = async (req, res) => {
    const response = await productService.deleteChemical(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getChemicalSearch = async (req, res) => {
    const response = await productService.getChemicalSearch(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const search = async (req, res) => {
    const response = await productService.search(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.search)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const markfev = async (req, res) => {
    const response = await productService.markfev(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data?.category)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const verifyCard = async (req, res) => {
    const response = await productService.verifyCreditCard(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.category)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateProductGood = async (req, res) => {
    const response = await productService.updateProductGood(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.productUpdated)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deleteProductGood = async (req, res) => {
    const response = await productService.deleteProductGood(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.user)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const soldProductGood = async (req, res) => {
    const response = await productService.soldProductGood(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.soldProduct)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const addRating = async (req, res) => {
    const response = await productService.addRating(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const getProductRating = async (req, res) => {
    const response = await productService.getProductRating(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const searchProductGood = async (req, res) => {
    const response = await productService.searchProductGood(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.allProducts)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateProductRating = async (req, res) => {
    const response = await productService.updateProductRating(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getUserProductGood = async (req, res) => {
    const response = await productService.getUserProductGood(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data.userProducts)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getProductById = async (req, res) => {
    const response = await productService.getProductById(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const getFevProduct = async (req, res) => {
    const response = await productService.getFevProduct(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const sideBarCountProduct = async (req, res) => {
    const response = await productService.sideBarCountProduct(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const importChemical = async (req, res) => {
    const uploadFile = multer({ limits: { fieldSize: 200000000, fileSize: 200000000 } }).single('file')
    uploadFile(req, res, async (error) => {
        if (error) {
            console.log('error', error.message)
            return responseUtil.validationErrorResponse(res, 'file size too large')
        } else {
            const response = await productService.importChemicals(req)
            if (response.status) {
                return responseUtil.successResponse(res, response.message, response.data)
            } else {
                return responseUtil.validationErrorResponse(res, response.message)
            }
        }
    })
}

export { createProductGood, getAllProductGood, addCategory, updateProductGood, deleteProductGood, soldProductGood, markfev, getCategory, addChemical, getChemical, search, verifyCard, searchProductGood, getUserProductGood, addRating, getProductRating, updateProductRating, updateCategory, deleteCategory, getCategorySearch, updateChemical, deleteChemical, getChemicalSearch, getProductById, getFevProduct, importChemical, sideBarCountProduct }
