import { v2 as cloudinary } from "cloudinary";
import Product from "../models/productModel.js";


const addProduct = async (req, res) => {
    try {
        const {name, price, description, category, subcategory, sizes, bestseller} = req.body;
        const image1 = req.files.image1 && req.files.image1[0].path;
        const image2 = req.files.image2 && req.files.image2[0].path;
        const image3 = req.files.image3 && req.files.image3[0].path;
        const image4 = req.files.image4 && req.files.image4[0].path;

        const images = [image1, image2, image3, image4].filter(item => item != undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item, {
                    resource_type: "image",
                });
                return result.secure_url;
            })
        );

        const productData = {
            name,
            price: Number(price),
            description,
            category,
            subcategory, // lowercase
            sizes,
            bestseller: bestseller === "true" ? true : false,
            image: imagesUrl,
            date: Date.now()
        };
        const product = await Product.create(productData);
        res.status(200).json({message: "Product added successfully", product});
    } catch (error) {
        res.status(500).json({message: "Product not added", error: error.message});
    }
};

const listProducts = async (req, res) => {
   try {
     const products = await Product.find({})
     res.status(200).json({products})
   } catch (error) {
    res.status(500).json({message: "Product not found", error: error.message});
   }

}

const removeProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        res.status(200).json({message: "Product deleted successfully", product});
    } catch (error) {
        res.status(500).json({message: "Product not deleted", error: error.message});
    }

}

const singleProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json({product});
    } catch (error) {
        res.status(500).json({message: "Product not found", error: error.message});
    }

}


export {addProduct, listProducts, removeProduct, singleProduct}
