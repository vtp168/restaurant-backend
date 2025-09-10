import { checkSchema } from "express-validator";

export const createMenuValidator = checkSchema({
    name: {
        matches: {
            options: [/^[A-Za-z\s]+$/]
        },
        errorMessage: "Only letters and space allowed"
    },
    name_kh: {
        matches: {
            options: [/^[\u1780-\u17FF\s]+$/]
        },
        errorMessage: "Only Khmer letters and space allowed"
    },
    category: {
        isIn: {
            options: [["food", "drink"]]
        },
        errorMessage: "Category must be among food, drink"
    },
    subcategory: {
        isIn: {
            options: [["stew", "roast", "food-other","fast-food", "beer", "non-alcohol", "wine", null]]
        },
        errorMessage: "Subcategory must be among stew, roast, food-other, fast-food, beer, non-alcohol, wine"
    },
    price: {
        optional: true,
        isFloat: {
            options: { min: 0 }
        },
        errorMessage: "Price must be a positive number"
    },
    sizes: {
        optional: true,
        isArray: true,
        errorMessage: "Sizes must be an array"
    },
    "sizes.*.label": {
        isIn: {
            options: [["Small","Medium","Large"]]
        },
        errorMessage: "Size label must be among Small, Medium, Large"
    },
    "sizes.*.price": {
        isFloat: {
            options: { min: 0 }
        },
        errorMessage: "Size price must be a positive number"
    },
    available: {
        optional: true,
        isBoolean: true,
        errorMessage: "Available must be a boolean"
    }
})