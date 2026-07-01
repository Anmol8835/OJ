/**
 * Test Case Generation Service
 * Orchestrates the generation and execution of test cases
 */

const { generateTestInput } = require('./testGenerators');
const { formatInput, validateInputSpec } = require('./inputFormatter');
const { generateFile } = require('../generatefile');
const { generateInput } = require('../generateInput');
const executecpp = require('../executecpp');

/**
 * Generate multiple test cases for a problem
 * @param {Object} options
 * @param {Object} options.inputSpec - Input specification
 * @param {string} options.correctSolution - Correct solution code
 * @param {string} options.language - Programming language (cpp, python, etc.)
 * @param {number} options.numTests - Number of test cases to generate
 * @param {number} options.numEdgeCases - Number of edge cases to generate
 * @returns {Promise<Array>} - Array of test cases with input and output
 */
async function generateTestCases(options) {
    const {
        inputSpec,
        correctSolution,
        language = 'cpp',
        numTests = 5,
        numEdgeCases = 2
    } = options;

    // Validate input specification
    if (!validateInputSpec(inputSpec)) {
        throw new Error('Invalid input specification');
    }

    if (!correctSolution) {
        throw new Error('Correct solution code is required');
    }

    const testCases = [];

    try {
        // Generate regular test cases
        for (let i = 0; i < numTests; i++) {
            const generatedValues = generateTestInput(inputSpec, false);
            const formattedInput = formatInput(generatedValues, inputSpec);

            // Run correct solution to get expected output
            const output = await runSolution(correctSolution, formattedInput, language);

            testCases.push({
                input: formattedInput,
                output: output.trim(),
                sample: false,
                explanation: `Test case ${i + 1}`
            });
        }

        // Generate edge cases
        for (let i = 0; i < numEdgeCases; i++) {
            const generatedValues = generateTestInput(inputSpec, true);
            const formattedInput = formatInput(generatedValues, inputSpec);

            // Run correct solution to get expected output
            const output = await runSolution(correctSolution, formattedInput, language);

            testCases.push({
                input: formattedInput,
                output: output.trim(),
                sample: false,
                explanation: `Edge case ${i + 1}`
            });
        }

        return testCases;
    } catch (error) {
        throw new Error(`Test case generation failed: ${error.message}`);
    }
}

/**
 * Run solution code with given input
 * @param {string} code - Solution code
 * @param {string} input - Input text
 * @param {string} language - Programming language
 * @returns {Promise<string>} - Output from the solution
 */
async function runSolution(code, input, language) {
    try {
        // Generate code file
        const codeFilePath = await generateFile(language, code);

        // Generate input file
        const inputFilePath = await generateInput(input);

        // Execute the code
        const output = await executecpp(codeFilePath, inputFilePath);

        return output;
    } catch (error) {
        throw new Error(`Failed to run solution: ${error.message}`);
    }
}

/**
 * Generate a single test case preview (for testing during problem creation)
 * @param {Object} options
 * @returns {Promise<Object>} - Single test case
 */
async function generatePreviewTestCase(options) {
    const {
        inputSpec,
        correctSolution,
        language = 'cpp',
        isEdgeCase = false
    } = options;

    // Validate input specification
    if (!validateInputSpec(inputSpec)) {
        throw new Error('Invalid input specification');
    }

    const generatedValues = generateTestInput(inputSpec, isEdgeCase);
    const formattedInput = formatInput(generatedValues, inputSpec);

    let output = null;
    if (correctSolution) {
        try {
            output = await runSolution(correctSolution, formattedInput, language);
            output = output.trim();
        } catch (error) {
            // If solution fails, return just the input
            output = `Error: ${error.message}`;
        }
    }

    return {
        input: formattedInput,
        output,
        generatedValues // Include raw values for debugging
    };
}

module.exports = {
    generateTestCases,
    generatePreviewTestCase,
    runSolution
};
