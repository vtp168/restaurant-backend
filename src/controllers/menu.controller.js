import { menuModel } from "../models/menu.model.js";
import asyncHandler from 'express-async-handler';
import { fileModel } from "../models/file.model.js";


export const getMenus = asyncHandler(async (req, res) => {
  const menus = await menuModel.find().populate({
    path: "category", // ✅ populate category
    select: "_id name name_kh image" // select fields to return
  }
  );
  res.json(menus);
});

export const getMenusById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid menu ID" });
  }
  const menu = await menuModel.findById(id);
  if (!menu) {
    return res.status(404).json({ message: "Menu not found" });
  }
  res.json(menu);
});

// export const createMenu = asyncHandler(async (req, res) => {
//   const menu = await menuModel.create(req.body);
//   res.json(menu);
// });

export const createMenu = asyncHandler(async (req, res) => {
const { name, description, category, price, sizes,name_kh } = req.body;

    // Step 1: Create menu first
    const menu = new menuModel({
      name,
      name_kh,
      description,
      category,
      price: price || null, // if price is empty string, set to null
      sizes: sizes ? JSON.parse(sizes) : []
    });

   // console.log(req.image);
    const files = req.file;
   // console.log(files);
   //console.log(req.file);
    if (files) {
      const file = new fileModel({
        filename: req.file.filename,
        url: req.file.location,
        originalname: req.file.originalname,
        encoding: req.file.encoding,
        mimetype: req.file.mimetype,
        path: req.file.path,
        relatedType: "Menu",
        relatedId: menu._id, // Associate file with menu
        uploadedBy: req.user ? req.user._id : null // If user info is available
      });
      const savedFile = await file.save();
      menu.image = savedFile._id; // Associate file with menu
    }
    
   //return res.status(201).json('Menu created successfully');
     const savedMenu = await menu.save();
     res.status(201).json(savedMenu);
});

export const uploadSingleFile = async (req, res) => {
    const file = req.file;
    console.log(file);
    const newFile = new fileModel(file)
    await newFile.save();
    res.json(file);
}

export const updateMenu = asyncHandler(async (req, res) => {
  const menu = await menuModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(menu);
});

export const deleteMenu = asyncHandler(async (req, res) => {
  await menuModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Menu deleted" });
});

export const getMenusByCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;
  if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }
  const menus = await menuModel.find({ category: categoryId }).populate({ path: "category", select: "_id name name_kh" });
  res.json(menus);
});

export const searchMenus = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ message: "Query parameter 'q' is required" });
  }
  const regex = new RegExp(q, 'i'); // case-insensitive
  const menus = await menuModel.find({ name: regex }).populate({ path: "category", select: "_id name name_kh image" });
  res.json(menus);
});

export const toggleMenuAvailability = asyncHandler(async (req, res) => {
  const menu = await menuModel.findById(req.params.id);
  if (!menu) {
    return res.status(404).json({ message: "Menu not found" });
  }
  menu.available = !menu.available;
  await menu.save();
  res.json(menu);
});

export const getAvailableMenus = asyncHandler(async (req, res) => {
  const menus = await menuModel.find({ available: true }).populate({ path: "category", select: "_id name name_kh" });
  res.json(menus);
});

export const getUnavailableMenus = asyncHandler(async (req, res) => {
  const menus = await menuModel.find({ available: false }).populate({ path: "category", select: "_id name name_kh" });
  res.json(menus);
});

export const getMenuCounts = asyncHandler(async (req, res) => {
  const total = await menuModel.countDocuments();
  const available = await menuModel.countDocuments({ available: true });
  const unavailable = await menuModel.countDocuments({ available: false });
  res.json({ total, available, unavailable });
});

export const getMenusWithSizes = asyncHandler(async (req, res) => {
  const menus = await menuModel.find({ sizes: { $exists: true, $not: { $size: 0 } } }).populate({ path: "category", select: "_id name name_kh" });
  res.json(menus);
});

export const getMenusWithoutSizes = asyncHandler(async (req, res) => {
  const menus = await menuModel.find({ $or: [ { sizes: { $exists: false } }, { sizes: { $size: 0 } } ] }).populate({ path: "category", select: "_id name name_kh" });
  res.json(menus);
});

export const getMenuCountsByCategory = asyncHandler(async (req, res) => {
  const counts = await menuModel.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);
  res.json(counts);
});
