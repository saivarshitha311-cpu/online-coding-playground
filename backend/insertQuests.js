import mongoose from "mongoose";
import dotenv from "dotenv";
import Quest from "./models/Quest.js"; // Import the Quest model
dotenv.config();


mongoose.connect(process.env.MONGO_URI);

const quests = [
    {
      title: "Two Sum",
      description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
      difficulty: "Beginner",
      test_cases: [{ "input": "nums = [2, 7, 11, 15], target = 9", "expected_output": "Indices: [0, 1]" }]
    },
    {
      title: "Two Sum II - Input Sorted Array",
      description: "Given a sorted array of integers and a target sum, return the indices of two numbers such that they add up to the target.",
      difficulty: "Beginner",
      test_cases: [{ "input": "nums = [1, 2, 3, 4, 5], target = 6", "expected_output": "Indices: [1, 4]" }]
    },
    {
      title: "Palindrome Number",
      description: "Determine whether an integer is a palindrome. An integer is a palindrome if it reads the same forward and backward.",
      difficulty: "Beginner",
      test_cases: [{ "input": "x = 121", "expected_output": "True" }]
    },
    {
      title: "Reverse Integer",
      description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes overflow, return 0.",
      difficulty: "Beginner",
      test_cases: [{ "input": "x = 123", "expected_output": "321" }]
    },
    {
      title: "Valid Parentheses",
      description: "Given a string containing only '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      difficulty: "Beginner",
      test_cases: [{ "input": "s = '()[]{}'", "expected_output": "True" }]
    },
    {
      title: "Merge Two Sorted Lists",
      description: "Merge two sorted linked lists and return it as a sorted list.",
      difficulty: "Beginner",
      test_cases: [{ "input": "l1 = [1,2,4], l2 = [1,3,4]", "expected_output": "[1,1,2,3,4,4]" }]
    },
    {
      title: "Remove Duplicates from Sorted Array",
      description: "Given a sorted array nums, remove duplicates in-place such that each element appears only once.",
      difficulty: "Beginner",
      test_cases: [{ "input": "nums = [1,1,2]", "expected_output": "2, nums = [1,2]" }]
    },
    {
      title: "Best Time to Buy and Sell Stock",
      description: "Given an array prices where prices[i] is the price of a stock on day i, return the max profit.",
      difficulty: "Beginner",
      test_cases: [{ "input": "prices = [7,1,5,3,6,4]", "expected_output": "5" }]
    },
    {
      title: "Climbing Stairs",
      description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps.",
      difficulty: "Beginner",
      test_cases: [{ "input": "n = 3", "expected_output": "3" }]
    },
    {
      title: "Maximum Subarray",
      description: "Find the contiguous subarray with the largest sum and return its sum.",
      difficulty: "Intermediate",
      test_cases: [{ "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]", "expected_output": "6" }]
    },
    {
      title: "Search in Rotated Sorted Array",
      description: "Given a rotated sorted array, find the target value's index. If not found, return -1.",
      difficulty: "Intermediate",
      test_cases: [{ "input": "nums = [4,5,6,7,0,1,2], target = 0", "expected_output": "4" }]
    },
    {
      title: "Container With Most Water",
      description: "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
      difficulty: "Intermediate",
      test_cases: [{ "input": "height = [1,8,6,2,5,4,8,3,7]", "expected_output": "49" }]
    },
    {
      title: "Longest Substring Without Repeating Characters",
      description: "Given a string s, find the length of the longest substring without repeating characters.",
      difficulty: "Intermediate",
      test_cases: [{ "input": "s = 'abcabcbb'", "expected_output": "3" }]
    },
    {
      title: "Permutations",
      description: "Given an array nums of distinct integers, return all possible permutations in any order.",
      difficulty: "Intermediate",
      test_cases: [{ "input": "nums = [1,2,3]", "expected_output": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" }]
    },
    {
      title: "Word Search",
      description: "Given an m x n grid of characters board and a string word, return true if the word exists in the grid.",
      difficulty: "Intermediate",
      test_cases: [{ "input": "board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCCED'", "expected_output": "True" }]
    },
    {
      title: "Sudoku Solver",
      description: "Write a program to solve a Sudoku puzzle by filling the empty cells.",
      difficulty: "Advanced",
      test_cases: [{ "input": "board = [['5','3','.','.','7','.','.','.','.'],...]", "expected_output": "Solved board" }]
    },
    {
      title: "Merge K Sorted Lists",
      description: "Merge k sorted linked lists into one sorted linked list and return it.",
      difficulty: "Advanced",
      test_cases: [{ "input": "lists = [[1,4,5],[1,3,4],[2,6]]", "expected_output": "[1,1,2,3,4,4,5,6]" }]
    },
    {
      title: "Find Median from Data Stream",
      description: "The median is the middle value in an ordered integer list. Implement a MedianFinder class.",
      difficulty: "Advanced",
      test_cases: [{ "input": "nums = [1,2,3,4,5]", "expected_output": "3" }]
    },
    {
      title: "N-Queens",
      description: "The n-queens puzzle is the problem of placing n queens on an n×n chessboard such that no two queens attack each other.",
      difficulty: "Advanced",
      test_cases: [{ "input": "n = 4", "expected_output": "[['.Q..','...Q','Q...','..Q.'],['..Q.','Q...','...Q','.Q..']]" }]
    },
    {
      title: "Trapping Rain Water",
      description: "Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.",
      difficulty: "Advanced",
      test_cases: [{ "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]", "expected_output": "6" }]
    }
  ]
  ;

// Function to insert data
const insertData = async () => {
  try {
    await Quest.deleteMany({}); // Clears existing quests (optional)
    await Quest.insertMany(quests);
    console.log("Quests inserted successfully!");
    connection.close(); // Close connection after inserting
  } catch (error) {
    console.error("Error inserting quests:", error);
  }
};

insertData();
