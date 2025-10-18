import {tableModel} from "../models/table.model.js";
import asyncHandler from 'express-async-handler'


export const getTables = asyncHandler(async (req, res) => {
  const tables = await tableModel.find();
  res.json(tables);
});

//get all free tables
export const getTablesByStatus = asyncHandler(async (req, res) => {
  const status = req.params.status;
  
  if(status!=="free" && status!=="occupied" && status!=="booking"){
    
    res.status(400);
    throw new Error("Status must be free, occupied or booking");
  }
  const tables = await tableModel.find({status: status});
  res.status(200).json(tables);
});

export const createTable = asyncHandler(async (req, res) => {
  const table = await tableModel.create(req.body);
  res.status(200).json(table);
});

export const getTableById = asyncHandler(async (req, res) => {
  const table = await tableModel.findById(req.params.id);
  res.json(table);
});

export const deleteTable = asyncHandler(async (req, res) => {
  await tableModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Table deleted" });
});

export const updateTable = asyncHandler(async (req, res) => {
  const table = await tableModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(table);
});
