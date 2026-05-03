module.exports = {
    openapi: "3.0.0",
    info: {
        title: "IP Project API",
        version: "1.0.0",
        description: "Swagger/OpenAPI documentation for the existing Express endpoints."
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local server"
        }
    ],
    components: {
        securitySchemes: {
            cookieAuth: {
                type: "apiKey",
                in: "cookie",
                name: "Authorization",
                description: "JWT cookie value in the format: Bearer <token>"
            }
        },
        schemas: {
            Product: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    sellerId: { type: "string" },
                    name: { type: "string" },
                    description: { type: "string" },
                    price: { type: "number" },
                    category: {
                        type: "string",
                        enum: ["PC", "Electronics", "Health", "Games", "Tools"]
                    },
                    stock: { type: "number" },
                    deliveryTimeEstimate: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            ProductInput: {
                type: "object",
                required: ["name", "description", "price", "category", "deliveryTimeEstimate"],
                properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    price: { type: "number", minimum: 1 },
                    category: {
                        type: "string",
                        enum: ["PC", "Electronics", "Health", "Games", "Tools"]
                    },
                    deliveryTimeEstimate: { type: "string" }
                }
            },
            OrderItem: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {
                    productId: { type: "string" },
                    quantity: { type: "number", default: 1 }
                }
            },
            OrderInput: {
                type: "object",
                required: ["itemList", "shippingAddress"],
                properties: {
                    itemList: {
                        type: "array",
                        items: { $ref: "#/components/schemas/OrderItem" }
                    },
                    shippingAddress: { type: "string" }
                }
            },
            AuthSignupInput: {
                type: "object",
                required: ["email", "password", "username", "type"],
                properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                    username: { type: "string" },
                    type: {
                        type: "string",
                        enum: ["buyerAccount", "sellerAccount"]
                    }
                }
            },
            AuthSigninInput: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" }
                }
            },
            SuccessResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    message: { type: "string" }
                }
            }
        }
    },
    tags: [
        { name: "Auth" },
        { name: "Products" },
        { name: "Orders" },
        { name: "Reviews" },
        { name: "Cart" },
        { name: "Buyer" },
        { name: "Seller" }
    ],
    paths: {
        "/auth/createAccount": {
            post: {
                tags: ["Auth"],
                summary: "Create a buyer or seller account",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/AuthSignupInput" }
                        }
                    }
                },
                responses: {
                    200: { description: "Account created" },
                    401: { description: "Validation failed or user already exists" }
                }
            }
        },
        "/auth/signin": {
            post: {
                tags: ["Auth"],
                summary: "Sign in and set the Authorization cookie",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/AuthSigninInput" }
                        }
                    }
                },
                responses: {
                    200: { description: "Signed in successfully" },
                    401: { description: "Invalid credentials" }
                }
            }
        },
        "/auth/sginin": {
            post: {
                tags: ["Auth"],
                summary: "Sign in and set the Authorization cookie",
                description: "Legacy misspelled route kept for compatibility. Prefer /auth/signin.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/AuthSigninInput" }
                        }
                    }
                },
                responses: {
                    200: { description: "Signed in successfully" },
                    401: { description: "Invalid credentials" }
                }
            }
        },
        "/auth/activateAccount": {
            patch: {
                tags: ["Auth"],
                summary: "Activate account",
                description: "Endpoint exists, but the controller is currently empty.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/auth/changePasword": {
            patch: {
                tags: ["Auth"],
                summary: "Change password",
                description: "Endpoint exists, but the controller is currently empty. The route name is currently spelled /changePasword.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/auth/updateEmail": {
            patch: {
                tags: ["Auth"],
                summary: "Update email",
                description: "Endpoint exists, but the controller is currently empty.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/auth/deleteAccount": {
            delete: {
                tags: ["Auth"],
                summary: "Delete account",
                description: "Endpoint exists, but the controller is currently empty.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/products": {
            get: {
                tags: ["Products"],
                summary: "Get products with optional filters",
                parameters: [
                    { name: "category", in: "query", schema: { type: "string", enum: ["PC", "Electronics", "Health", "Games", "Tools"] } },
                    { name: "seller", in: "query", schema: { type: "string" } },
                    { name: "search", in: "query", schema: { type: "string" } },
                    { name: "priceFrom", in: "query", schema: { type: "number", minimum: 0 } },
                    { name: "priceUpTo", in: "query", schema: { type: "number", minimum: 0 } }
                ],
                responses: {
                    200: { description: "Filtered products" },
                    400: { description: "Invalid filter value" }
                }
            }
        },
        "/products/addProduct/": {
            post: {
                tags: ["Products"],
                summary: "Add a new product",
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ProductInput" }
                        }
                    }
                },
                responses: {
                    201: { description: "Product added" },
                    401: { description: "Unauthorized, invalid fields, or buyer account" }
                }
            }
        },
        "/products/getProduct/{id}": {
            get: {
                tags: ["Products"],
                summary: "Get one product by id",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: { 200: { description: "Product found" } }
            }
        },
        "/products/updateProduct/{id}": {
            put: {
                tags: ["Products"],
                summary: "Update a product owned by the logged-in seller",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ProductInput" }
                        }
                    }
                },
                responses: {
                    200: { description: "Product updated" },
                    401: { description: "Unauthorized or not product owner" },
                    404: { description: "Product not found" }
                }
            }
        },
        "/products/removeProduct/{id}": {
            delete: {
                tags: ["Products"],
                summary: "Delete a product owned by the logged-in seller",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    201: { description: "Product deleted" },
                    401: { description: "Unauthorized or not product owner" }
                }
            }
        },
        "/products/search": {
            get: {
                tags: ["Products"],
                summary: "Search products",
                description: "Endpoint exists, but the controller is currently empty.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/products/catalog": {
            get: {
                tags: ["Products"],
                summary: "Browse product catalog",
                description: "Returns product _id, name, price, and category.",
                responses: { 200: { description: "Product catalog" } }
            }
        },
        "/products/categories": {
            get: {
                tags: ["Products"],
                summary: "Get all product categories",
                responses: { 200: { description: "Categories list" } }
            }
        },
        "/products/categories/{cat_name}": {
            get: {
                tags: ["Products"],
                summary: "Get products by category",
                parameters: [
                    { name: "cat_name", in: "path", required: true, schema: { type: "string", enum: ["PC", "Electronics", "Health", "Games", "Tools"] } }
                ],
                responses: { 200: { description: "Products in category" } }
            }
        },
        "/products/my-products/": {
            get: {
                tags: ["Products"],
                summary: "Get products owned by logged-in seller",
                security: [{ cookieAuth: [] }],
                responses: {
                    200: { description: "Seller products" },
                    401: { description: "User is not a seller" }
                }
            }
        },
        "/products/getSellerProducts/{id}": {
            get: {
                tags: ["Products"],
                summary: "Get all products for a seller",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: { 200: { description: "Seller products" } }
            }
        },
        "/orders/getOrder/{id}": {
            get: {
                tags: ["Orders"],
                summary: "Get one order for the logged-in buyer",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    200: { description: "Order found" },
                    403: { description: "Not a buyer or not order owner" }
                }
            }
        },
        "/orders/addOrder/": {
            post: {
                tags: ["Orders"],
                summary: "Create a new order",
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/OrderInput" }
                        }
                    }
                },
                responses: {
                    201: { description: "Order added" },
                    400: { description: "Insufficient stock" },
                    403: { description: "User must be a buyer" },
                    404: { description: "Product not found" }
                }
            }
        },
        "/orders/updateOrder/{id}": {
            put: {
                tags: ["Orders"],
                summary: "Update a pending order",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/OrderInput" }
                        }
                    }
                },
                responses: {
                    200: { description: "Order updated" },
                    400: { description: "Order already processed or insufficient stock" },
                    403: { description: "Unauthorized" },
                    404: { description: "Order or product not found" }
                }
            }
        },
        "/orders/removeOrder/{id}": {
            delete: {
                tags: ["Orders"],
                summary: "Delete an order owned by the logged-in buyer",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    201: { description: "Order deleted" },
                    403: { description: "Not a buyer or not order owner" }
                }
            }
        },
        "/orders/traceOrder/{id}": {
            get: {
                tags: ["Orders"],
                summary: "Trace order status and details",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    200: { description: "Order trace details" },
                    403: { description: "Unauthorized" },
                    404: { description: "Order not found" }
                }
            }
        },
        "/orders/myOrders/": {
            get: {
                tags: ["Orders"],
                summary: "Get all orders for the logged-in buyer",
                security: [{ cookieAuth: [] }],
                responses: {
                    200: { description: "Buyer orders" },
                    403: { description: "User must be a buyer" }
                }
            }
        },
        "/orders/myOrders/{status}/": {
            get: {
                tags: ["Orders"],
                summary: "Get buyer orders by status",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "status", in: "path", required: true, schema: { type: "string", enum: ["Pending", "Shipped", "Delivered", "Cancelled"] } }
                ],
                responses: {
                    200: { description: "Orders filtered by status" },
                    403: { description: "User must be a buyer" }
                }
            }
        },
        "/orders/getComment/{id}": {
            get: {
                tags: ["Reviews"],
                summary: "Get comment/review",
                description: "Endpoint exists, but the controller is currently empty.",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/orders/addComment/": {
            post: {
                tags: ["Reviews"],
                summary: "Add comment/review",
                description: "Endpoint exists, but the controller is currently empty.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/orders/updateComment/": {
            put: {
                tags: ["Reviews"],
                summary: "Update comment/review",
                description: "Endpoint exists, but the controller is currently empty.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/orders/removeComment/": {
            delete: {
                tags: ["Reviews"],
                summary: "Remove comment/review",
                description: "Endpoint exists, but the controller is currently empty.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/cart/getCart/": {
            get: {
                tags: ["Cart"],
                summary: "Get cart",
                description: "Endpoint exists, but the controller is currently empty.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/cart/createCart/": {
            post: {
                tags: ["Cart"],
                summary: "Create cart",
                description: "Endpoint exists, but the controller is currently empty.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/cart/clearCart/": {
            delete: {
                tags: ["Cart"],
                summary: "Clear cart",
                description: "Endpoint exists, but the controller is currently empty.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/buyer/getProfile/": {
            get: {
                tags: ["Buyer"],
                summary: "Get buyer profile",
                description: "Endpoint exists, but the controller is currently empty.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/buyer/getPurchaseHistroy": {
            get: {
                tags: ["Buyer"],
                summary: "Get buyer purchase history",
                description: "Endpoint exists, but the controller is currently empty. The route name is currently spelled /getPurchaseHistroy.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/buyer/flagSeller/": {
            patch: {
                tags: ["Buyer"],
                summary: "Flag a seller",
                description: "Endpoint exists, but the controller is currently empty.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/seller/getProfile/": {
            get: {
                tags: ["Seller"],
                summary: "Get seller profile",
                description: "Endpoint exists, but the controller is currently empty.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/seller/getSellerStore": {
            get: {
                tags: ["Seller"],
                summary: "Get seller store",
                description: "Endpoint exists, but the controller is currently empty.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/seller/flagBuyer/": {
            patch: {
                tags: ["Seller"],
                summary: "Flag a buyer",
                description: "Endpoint exists, but the controller is currently empty.",
                responses: { 501: { description: "Not implemented" } }
            }
        },
        "/seller/{id}/status": {
            patch: {
                tags: ["Seller"],
                summary: "Change product status",
                description: "Endpoint exists, but the controller is currently empty.",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: { 501: { description: "Not implemented" } }
            }
        }
    }
};
