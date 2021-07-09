export default {
    auth: {
        couldNotRegisterUser:
            "Sorry, User could not be registered. Please Try Again.",
        userRegistered: "Your Account has been registered.",
        userAlreadyExists:
            "User with the same email already Exists. Please use a different email.",
        loginSuccessful: "Successfully logged in to the account.",
        loginError: "Could not login into the account. Please Try Again.",
        emailPasswordError:
            "Either Email or password is incorrect. Please Try Again.",

        noTokenFound: "No Token Found in header.",
        tokenDidNotMatch: "Token sent did not match.",
        authenticationFailed: "Could not authenticate user.",
        invalidToken: "The token provided is invalid.",
        accessNotGranted: "Access not granted to perform the operation.",

        validation: (field: string) => `${field} is required for Registration`,
    },
    unit: {
        unitsFetched: "Units is Fetched.",
        unitsFetchError: "Couldn't fetch the units.",
        unitsAdded: "Units is Added.",
        unitsAddError: "Couldn't Add the unit.",
        unitsDeleted: "Unit is Deleted.",
        unitsDeleteError: "Couldn't delete the unit.",
        unitNotFound: "Unit Not Found.",
        unitsUpdated: "Unit is Deleted.",
        unitsUpdateError: "Couldn't delete the unit.",
        validation: (field: string) => `${field} is required for Unit.`,
    },
    category: {
        categoryFetched: "Category is Fetched.",
        categoryFetchError: "Couldn't fetch the Category.",
        categoryAdded: "Category is Added.",
        categoryAddError: "Couldn't Add the Category.",
        categoryDeleted: "Category is Deleted.",
        categoryDeleteError: "Couldn't delete the Category.",
        categoryNotFound: "Category Not Found.",
        categoryUpdated: "Category is Deleted.",
        categoryUpdateError: "Couldn't delete the Category.",
        validation: (field: string) => `${field} is required for Category.`,
    },
    product: {
        productFetched: "Product is Fetched.",
        productFetchError: "Couldn't fetch Products.",
        productAdded: "Product is Added.",
        productAddError: "Couldn't Add the Product.",
        productDeleted: "Product is Deleted.",
        productDeleteError: "Couldn't delete the Product.",
        productNotFound: "Product Not Found.",
        productUpdated: "Product is Deleted.",
        productUpdateError: "Couldn't delete the Product.",
        validation: (field: string) => `${field} is required for Product.`,
    },
};
