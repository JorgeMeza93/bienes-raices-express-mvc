import express from "express";

const router = express.Router();

router.get("/login", function(req, res){
    res.render("auth/login")
})
router.get("/nosotros", function(req, res){
    res.send("Texto plano")
})


export default router;