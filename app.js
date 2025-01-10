var express = require("express")
const app = express()
app.use(express.json()) //middleware

const mongoose = require("mongoose")
const {v4:uuidv4}=require("uuid")

mongoose.connect("mongodb://localhost:27017/expense")  //Connection
.then(()=>{
    console.log("mangoDB connected")
})

const expenseSchema=new mongoose.Schema({    ///Schema
    Id:{type:String,required:true,unique:true},  //unique can check in mangoDB
    Title:{type:String,required:true},
    Amount:{type:Number,required:true}
})

const Expenses=mongoose.model("Expenses",expenseSchema)  //This is for create read write

app.post("/api/expenses",async(req,res)=>{
    const{Title,Amount}=req.body
    try{
    const newExpense=new Expenses({
        Id:uuidv4(), //automatically generate unique id
        Title:Title,
        Amount:Amount
    })
    const saveExpense=await newExpense.save()
    res.status(200).json(saveExpense)}
    catch(err){
        res.status(500).json({message:"Error in creating expense"})
    }
})



app.get("/api/expenses",async(req,res)=>{
    try{
    const expenses=await Expenses.find()
    res.status(200).json({expenses})
    }catch(err){
        res.status(500).json({message:"Failed to fetch expense"})
    }
})
app.get("/api/expenses/:Id",async(req,res)=>{
    try{
        const{Id}=req.params
        const expense=await Expenses.findOne({Id})
        if(!expense){
            return res.status(404).json({message:"Expense not found"})
        }
        res.status(200).json(expense)
    }catch(err){
        res.status(500).json({message:"Failed to fetch expense"})
    }
})
app.put("/api/expenses/:Id",async(req,res)=>{
    try{
        const{Id}=req.params
        const{Title,Amount}=req.body
        const expense=await Expenses.findOne({Id})
        if(!expense){
            return res.status(404).json({message:"Expense not found"})
        }
        expense.Title=Title
        expense.Amount=Amount
        const updateExpense=await expense.save()
        res.status(200).json(updateExpense)
    }catch(err){
        res.status(500).json({message:"Failed to update expense"})
    }
})
app.delete("/api/expenses/:Id", async (req, res) => {
    try {
      const { Id } = req.params;
      const deletedExpense = await Expenses.findOneAndDelete({ Id });
      if (!deletedExpense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.status(200).json(deletedExpense); 
    } catch (err) {
      res.status(500).json({ message: "Failed to delete expense",});
    }
  });
app.listen(3000,()=>{
    console.log("Server is running")
})//it specifies the certain port

