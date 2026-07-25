// const express=require("express");
const router=require("express").Router();
const prisma = require("../database/prisma");
const { generateTestCases, generatePreviewTestCase } = require("../services/testCaseGenerator");

router.post("/add", async (req, res) => {
    const {
        title, desc, statement, input, output, constraints, testcase, createdBy,
        inputSpec, correctSolution, solutionLanguage
    } = req.body;

    // Basic validation
    if (!title || !statement || !input || !output || !constraints || !testcase || !createdBy) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    try {
        // Prepare data object - only include new fields if columns exist
        const data = {
            title,
            desc,
            statement,
            input,
            output,
            constraints,
            createdBy,
            testcases: {
                create: testcase.map(tc => ({
                    input: tc.input,
                    output: tc.output,
                    sample: tc.sample || false,
                    explanation: tc.explanation
                }))
            }
        };

        // Only add new fields if they are provided (for backward compatibility)
        if (inputSpec !== undefined) data.inputSpec = inputSpec;
        if (correctSolution !== undefined) data.correctSolution = correctSolution;
        if (solutionLanguage !== undefined) data.solutionLanguage = solutionLanguage;

        const savedProblem = await prisma.problem.create({
            data,
            include: {
                testcases: true
            }
        });
        res.status(201).json(savedProblem);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error adding problem", error: err });
    }
});


router.put("/edit/:id", async (req, res) => {
    const { testcase, detail } = req.body;
    const id = parseInt(req.params.id);

    if (!testcase || !detail || !id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      // Delete existing testcases and update problem with new data
      const saved = await prisma.problem.update({
        where: { id },
        data: {
          ...detail,
          testcases: {
            deleteMany: {},
            create: testcase.map(tc => ({
              input: tc.input,
              output: tc.output,
              sample: tc.sample || false,
              explanation: tc.explanation
            }))
          }
        },
        include: {
          testcases: true
        }
      });

      return res.status(201).json(saved);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  });

router.delete("/delete",async(req,res)=>{
    const id = parseInt(req.query.id);

    if(!id){
        return res.status(400).json({message: "missing req feilds"});
    }

    try{
        await prisma.problem.delete({
            where: { id }
        });

        return res.status(201).json({message:"successfully deleted"});
    }
    catch(err){
        return res.status(500).json(err);
    }

})

router.get("/",async(req,res)=>{
    try{
        const problems = await prisma.problem.findMany({
            include: {
                testcases: true
            }
        });
        return res.status(200).json(problems);
    }
    catch(err){
        return res.status(500).json(err);
    }
})

router.get("/:id",async(req,res)=>{
    try{
        const problem = await prisma.problem.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                testcases: true
            }
        });
        console.log(problem)
        return res.status(200).json(problem);
    }
    catch(err){
        return res.status(500).json(err);
    }
})

// Generate test cases for a problem
router.post("/generate-tests", async (req, res) => {
    const { inputSpec, correctSolution, language = 'cpp', numTests = 5, numEdgeCases = 2 } = req.body;

    if (!inputSpec || !correctSolution) {
        return res.status(400).json({
            success: false,
            message: "Input specification and correct solution are required"
        });
    }

    try {
        const testCases = await generateTestCases({
            inputSpec,
            correctSolution,
            language,
            numTests,
            numEdgeCases
        });

        return res.status(200).json({
            success: true,
            testCases
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// Preview a single test case (for testing during problem creation)
router.post("/preview-test", async (req, res) => {
    const { inputSpec, correctSolution, language = 'cpp', isEdgeCase = false } = req.body;

    if (!inputSpec) {
        return res.status(400).json({
            success: false,
            message: "Input specification is required"
        });
    }

    try {
        const testCase = await generatePreviewTestCase({
            inputSpec,
            correctSolution,
            language,
            isEdgeCase
        });

        return res.status(200).json({
            success: true,
            testCase
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;