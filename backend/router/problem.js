const router=require("express").Router();
const prisma = require("../database/prisma");

router.post("/add", async (req, res) => {
    const { title, desc, statement, input, output, constraints, testcase, createdBy } = req.body;

    // Basic validation
    if (!title || !statement || !input || !output || !constraints || !testcase || !createdBy) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    try {
        const savedProblem = await prisma.problem.create({
            data: {
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
            },
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
        return res.status(200).json(problem);
    }
    catch(err){
        return res.status(500).json(err);
    }
})

module.exports = router;