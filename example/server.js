const PORT = 3001;

const express = require("express");
const compression = require("compression");
const server = express();
const permissionMiddleware = require("../permission-middleware");

server.use(compression());
server.use(express.json());

const actionUser = ( req, res ) => {
    const { permission, user } = req;
    res.send({ role: user.role, permission });
}
const actionArticle = ( req, res ) => {
    const { permission, user } = req;
    res.send({ 
        role: user.role, 
        canComment: permission("comment"),
        canPublish: permission("publish") 
    });
}

const userMiddleWare = (req, res, next) => {
    req.user = req.params;
    next();
}

const userRouter = express.Router();
const articleRouter = express.Router();

userRouter.post("/", actionUser);
userRouter.get("/", actionUser);
userRouter.put("/", actionUser);
userRouter.delete("/", actionUser);

articleRouter.post("/", actionArticle);
articleRouter.get("/", actionArticle);
articleRouter.put("/", actionArticle);
articleRouter.delete("/", actionArticle);

server.use("/user/:role", userMiddleWare, permissionMiddleware("user"), userRouter);
server.use("/article/:role", userMiddleWare, permissionMiddleware("article"), articleRouter);

server.listen(PORT, () => {
    console.log(`Server sucessfully running on port ${PORT}`);
});
