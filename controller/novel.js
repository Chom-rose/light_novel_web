const path = require("path");

exports.read = async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "../views/main.html"));
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.create = async (req, res) => {
    try {
        const {name, category } = req.body;
        data = {
            name: name, 
            category: category
                };
        res.status(201).json({
        message: "Product created successfully",
        data: data,
                            });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/*
exports.create = async (req, res) => {
    try {
        const 
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}; */
