const roleConfig = require("./permissionConfig.json");

const permissionMiddleware = (entityName) => (req, res, next) => {
    const { method, user = {} }  = req;
    const { role } = user;
    const currentUserPermission = Object.entries(roleConfig).filter(([roleName, ]) => roleName === role)[0][1];
    const currentUserPermissionByEntity = currentUserPermission[entityName] || currentUserPermission["*"] || [];
    const haveCurrentUserFullRightOnCurrentEntity = currentUserPermissionByEntity.includes("*");
    if ( haveCurrentUserFullRightOnCurrentEntity
    || (method === "POST" && currentUserPermissionByEntity.includes("create"))
    || (method === "GET" && currentUserPermissionByEntity.includes("read"))
    || (method === "PUT" && currentUserPermissionByEntity.includes("update"))
    || (method === "DELETE" && currentUserPermissionByEntity.includes("delete"))
    ) {
        req.permission = (requestedPermission) => {
            return currentUserPermissionByEntity.includes(requestedPermission) || haveCurrentUserFullRightOnCurrentEntity;
        }
        next();
    } else {
        // Log error here
        res.status(401).json("Unauthorized")
    }
}

module.exports = permissionMiddleware;