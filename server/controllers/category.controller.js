import { Category } from "../models/Category.js";
import { ObjectId } from 'mongodb';
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { categorySchema } from "../schemas/index.js";

export const getCategories = async(req, res) => {  
    try {
        const categories = await Category.find()
        .sort({ createdAt: 'desc' });
        if(!categories){
            return res.status(400).json({
                success: false, message: "Categories not found"
            });
        }

        res.status(200).json({
            success: true, message: "Found category", data: categories
        });
    } catch (error) {
        return res.status(400).json({
            success: false, message: error.message
        });
    }
}

export const createCategory = async(req, res) => {
    const { name, description } = req.body;
    //validate with schema
    const { error } = categorySchema.validate({ name, description });
    
    if(error){
        return res.status(400).json({
            success: false, message: error.details[0].message
        });
    }

    try {
        const categoryExist = await Category.findOne({name});
        if(categoryExist){
            res.status(400).json({
                success: false, message: 'Category already exist'
            });
        }

        const category = new Category({ name, description });
        await category.save();

        res.status(201).json({
            success: true, message: `${name} category created successfully`, 
            data: category
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getCategory = async(req, res) => {
    const category_id = new ObjectId(req.params.category_id);
    try {
        if(!category_id){
            throw new Error('Category ID required');
        }

        const category = await Category.findById({_id: category_id});
        if(!category){
            return res.status(400).json({
                success: false, message: `No category record found`
            });
        }
        res.status(200).json({
            success: true, message: `${category?.name} category found`,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false, message: error.message
        });
    }
}

export const updateCategory = async(req, res) => {
    const category_id = new ObjectId(req.params.category_id);
    if(!category_id){
        throw new Error('Category ID required');
    }
    const { name, description } = req.body;
    //validate with schema
    const { error } = categorySchema.validate({ name, description });
    
    if(error){
        return res.status(400).json({
            success: false, message: error.details[0].message
        });
    } 
    
    try {

        const category = await Category.findOneAndUpdate({_id: category_id},
            {name, description}, { new: true }
        );
        if(!category){
            return res.status(400).json({
                success: false, message: `fail to update category record`
            });
        }
        await category.save();
        res.status(200).json({
            success: true, message: `Category updated successfully`,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false, message: error.message
        });
    }
}

export const deleteCategory = async(req, res) => {
    const category_id = new ObjectId(req.params.category_id);
    if(!category_id){
        throw new Error('Category ID required');
    }

    try {
        const category = await Category.findOneAndDelete({_id: category_id});
        if(!category){
            return res.status(400).json({
                success: false, message: `fail to delete category record`
            });
        }
        
        res.status(200).json({
            success: true, message: `Category delete successfully`,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false, message: error.message
        });
    }
}


export const getCategoryPosts = async(req, res) => {
    const category_id = new ObjectId(req.params.category_id);
    try {
        if(!category_id){
            throw new Error('Category ID required');
        }

        const posts = await Post.find({categories: category_id})
        .populate({
            path: "categories",
            model: Category,
            select: '_id name description'
        })
        .populate({
            path: "author",
            model: User,
            select: '_id name email photo'
        })


        if(!posts){
            return res.status(400).json({
                success: false, message: `No posts found`
            });
        }
        res.status(200).json({
            success: true, message: `Post category found`,
            data: posts
        });
    } catch (error) {
        res.status(400).json({
            success: false, message: error.message
        });
    }
}




