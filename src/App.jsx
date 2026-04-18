import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { api } from './api';
import {
  Trophy, Activity, Edit3, X, Save, RefreshCw, Star, ClipboardList,
  Medal, Calendar, Zap, CheckCircle2, AlertCircle, Clock, Lock, Unlock,
  Hash, Calculator, Users, ShieldCheck, ListChecks, Settings, Flag, Check, LogOut, KeyRound, Eye, Search, DatabaseBackup, History, TrendingUp, Target, Award
} from 'lucide-react';
import { Analytics } from "@vercel/analytics/react"

// --- CONSTANTS ---
const INITIAL_SYSTEM_TIME = new Date();
const MATCH_DURATION_HOURS = 3.0;
const LOCAL_STORAGE_KEY_ROSTER = 'fantasy_roster_data';

// ---------------------------------------------------------
// DATABASE 1: SQUADS (Admin Scoring)
// ---------------------------------------------------------
const Squads = {
  "CSK": [
    { name: "MS Dhoni", role: "WK", isOverseas: false }, { name: "Sanju Samson", role: "WK", isOverseas: false }, { name: "Kartik Sharma", role: "WK", isOverseas: false }, { name: "Urvil Patel", role: "WK", isOverseas: false },
    { name: "Jamie Overton", role: "BOWL", isOverseas: true }, { name: "Khaleel Ahmed", role: "BOWL", isOverseas: false }, { name: "Noor Ahmad", role: "BOWL", isOverseas: true }, { name: "Mukesh Choudhary", role: "BOWL", isOverseas: false }, { name: "Spencer Johnson", role: "BOWL", isOverseas: true }, { name: "Shreyas Gopal", role: "BOWL", isOverseas: false }, { name: "Gurjapneet Singh", role: "BOWL", isOverseas: false }, { name: "Akeal Hosein", role: "BOWL", isOverseas: true }, { name: "Matt Henry", role: "BOWL", isOverseas: true }, { name: "Rahul Chahar", role: "BOWL", isOverseas: false },
    { name: "Ruturaj Gaikwad", role: "BAT", isOverseas: false }, { name: "Dewald Brevis", role: "BAT", isOverseas: true }, { name: "Ayush Mhatre", role: "BAT", isOverseas: false }, { name: "Sarfaraz Khan", role: "BAT", isOverseas: false },
    { name: "Shivam Dube", role: "BOWL", isOverseas: false }, { name: "Anshul Kamboj", role: "AR", isOverseas: false }, { name: "Ramakrishna Ghosh", role: "AR", isOverseas: false }, { name: "Prashant Veer", role: "AR", isOverseas: false }, { name: "Matthew Short", role: "AR", isOverseas: true }, { name: "Aman Khan", role: "AR", isOverseas: false }, { name: "Zak Foulkes", role: "AR", isOverseas: true }
  ],
  "DC": [
    { name: "KL Rahul", role: "WK", isOverseas: false }, { name: "Ben Duckett", role: "WK", isOverseas: true }, { name: "Abhishek Porel", role: "WK", isOverseas: false }, { name: "Tristan Stubbs", role: "WK", isOverseas: true },
    { name: "Mitchell Starc", role: "BOWL", isOverseas: true }, { name: "Natarajan", role: "BOWL", isOverseas: false }, { name: "Mukesh Kumar", role: "BOWL", isOverseas: false }, { name: "Dushmantha Chameera", role: "BOWL", isOverseas: true }, { name: "Lungi Ngidi", role: "BOWL", isOverseas: true }, { name: "Kyle Jamieson", role: "BOWL", isOverseas: true }, { name: "Kuldeep Yadav", role: "BOWL", isOverseas: false },
    { name: "Karun Nair", role: "BAT", isOverseas: false }, { name: "David Miller", role: "BAT", isOverseas: true }, { name: "Pathum Nissanka", role: "BAT", isOverseas: true }, { name: "Sahil Parakh", role: "BAT", isOverseas: false }, { name: "Prithvi Shaw", role: "BAT", isOverseas: false },
    { name: "Axar Patel", role: "AR", isOverseas: false }, { name: "Sameer Rizvi", role: "AR", isOverseas: false }, { name: "Ashutosh Sharma", role: "AR", isOverseas: false }, { name: "Vipraj Nigam", role: "AR", isOverseas: false }, { name: "Ajay Mandal", role: "AR", isOverseas: false }, { name: "Tripurana Vijay", role: "AR", isOverseas: false }, { name: "Madhav Tiwari", role: "AR", isOverseas: false }, { name: "Auqib Dar", role: "AR", isOverseas: false }, { name: "Nitish Rana", role: "AR", isOverseas: false }
  ],
  "GT": [
    { name: "Jos Buttler", role: "WK", isOverseas: true }, { name: "Kumar Kushagra", role: "WK", isOverseas: false }, { name: "Anuj Rawat", role: "WK", isOverseas: false }, { name: "Connor Esterhuizen", role: "WK", isOverseas: true },
    { name: "Kagiso Rabada", role: "BOWL", isOverseas: true }, { name: "Mohammed Siraj", role: "BOWL", isOverseas: false }, { name: "Prasidh Krishna", role: "BOWL", isOverseas: false }, { name: "Manav Suthar", role: "BOWL", isOverseas: false }, { name: "Gurnoor Singh Brar", role: "BOWL", isOverseas: false }, { name: "Ishant Sharma", role: "BOWL", isOverseas: false }, { name: "Ashok Sharma", role: "BOWL", isOverseas: false }, { name: "Kulwant Khejroliya", role: "BOWL", isOverseas: false }, { name: "Luke Wood", role: "BOWL", isOverseas: true }, { name: "Rahul Tewatia", role: "BOWL", isOverseas: false }, { name: "Rashid Khan", role: "BOWL", isOverseas: true },
    { name: "Shubman Gill", role: "BAT", isOverseas: false }, { name: "Glenn Phillips", role: "BAT", isOverseas: true },
    { name: "Nishant Sindhu", role: "AR", isOverseas: false }, { name: "Washington Sundar", role: "AR", isOverseas: false }, { name: "Mohd. Arshad Khan", role: "AR", isOverseas: false }, { name: "Sai Kishore", role: "AR", isOverseas: false }, { name: "Jayant Yadav", role: "AR", isOverseas: false }, { name: "Jason Holder", role: "AR", isOverseas: true }, { name: "Sai Sudharsan", role: "BAT", isOverseas: false }, { name: "Shahrukh Khan", role: "AR", isOverseas: false }
  ],
  "KKR": [
    { name: "Finn Allen", role: "WK", isOverseas: true }, { name: "Tejasvi Singh", role: "WK", isOverseas: false }, { name: "Tim Seifert", role: "WK", isOverseas: true },
    { name: "Vaibhav Arora", role: "BOWL", isOverseas: false }, { name: "Matheesha Pathirana", role: "BOWL", isOverseas: true }, { name: "Kartik Tyagi", role: "BOWL", isOverseas: false }, { name: "Prashant Solanki", role: "BOWL", isOverseas: false }, { name: "Saurabh Dubey", role: "BOWL", isOverseas: false }, { name: "Navdeep Saini", role: "BOWL", isOverseas: false }, { name: "Umran Malik", role: "BOWL", isOverseas: false }, { name: "Sunil Narine", role: "BOWL", isOverseas: true }, { name: "Varun Chakravarthy", role: "BOWL", isOverseas: false }, { name: "Blessing Muzarabani", role: "BOWL", isOverseas: true },
    { name: "Ajinkya Rahane", role: "BAT", isOverseas: false }, { name: "Rinku Singh", role: "BAT", isOverseas: false }, { name: "Angkrish Raghuvanshi", role: "BAT", isOverseas: false }, { name: "Manish Pandey", role: "BAT", isOverseas: false }, { name: "Cameron Green", role: "BAT", isOverseas: true }, { name: "Rahul Tripathi", role: "BAT", isOverseas: false }, { name: "Rovman Powell", role: "BAT", isOverseas: true },
    { name: "Anukul Roy", role: "AR", isOverseas: false }, { name: "Sarthak Ranjan", role: "AR", isOverseas: false }, { name: "Daksh Kamra", role: "AR", isOverseas: false }, { name: "Rachin Ravindra", role: "AR", isOverseas: true }, { name: "Ramandeep Singh", role: "AR", isOverseas: false }
  ],
  "LSG": [
    { name: "Nicholas Pooran", role: "WK", isOverseas: true }, { name: "Rishabh Pant", role: "WK", isOverseas: false }, { name: "Josh Inglis", role: "WK", isOverseas: true }, { name: "Mukul Choudhary", role: "WK", isOverseas: false },
    { name: "Mohammad Shami", role: "BOWL", isOverseas: false }, { name: "Avesh Khan", role: "BOWL", isOverseas: false }, { name: "Mayank Yadav", role: "BOWL", isOverseas: false }, { name: "Anrich Nortje", role: "BOWL", isOverseas: true }, { name: "M. Siddharth", role: "BOWL", isOverseas: false }, { name: "Digvesh Singh", role: "BOWL", isOverseas: false }, { name: "Akash Singh", role: "BOWL", isOverseas: false }, { name: "Prince Yadav", role: "BOWL", isOverseas: false }, { name: "Arjun Tendulkar", role: "BOWL", isOverseas: false }, { name: "Naman Tiwari", role: "BOWL", isOverseas: false }, { name: "Mohsin Khan", role: "BOWL", isOverseas: false },
    { name: "Aiden Markram", role: "BAT", isOverseas: true }, { name: "Matthew Breetzke", role: "BAT", isOverseas: true }, { name: "Himmat Singh", role: "BAT", isOverseas: false }, { name: "Akshat Raghuwanshi", role: "BAT", isOverseas: false },
    { name: "Mitchell Marsh", role: "AR", isOverseas: true }, { name: "George Linde", role: "AR", isOverseas: true }, { name: "Abdul Samad", role: "AR", isOverseas: false }, { name: "Shahbaz Ahamad", role: "AR", isOverseas: false }, { name: "Arshin Kulkarni", role: "AR", isOverseas: false }, { name: "Ayush Badoni", role: "AR", isOverseas: false }
  ],
  "MI": [
    { name: "Quinton de Kock", role: "WK", isOverseas: true }, { name: "Ryan Rickelton", role: "WK", isOverseas: true }, { name: "Robin Minz", role: "WK", isOverseas: false },
    { name: "Jasprit Bumrah", role: "BOWL", isOverseas: false }, { name: "Trent Boult", role: "BOWL", isOverseas: true }, { name: "Deepak Chahar", role: "BOWL", isOverseas: false }, { name: "Mayank Markande", role: "BOWL", isOverseas: false }, { name: "Allah Ghazanfar", role: "BOWL", isOverseas: true }, { name: "Ashwani Kumar", role: "BOWL", isOverseas: false }, { name: "Raghu Sharma", role: "BOWL", isOverseas: false }, { name: "Mohammad Izhar", role: "BOWL", isOverseas: false },
    { name: "Rohit Sharma", role: "BAT", isOverseas: false }, { name: "Surya Kumar Yadav", role: "BAT", isOverseas: false }, { name: "Tilak Varma", role: "BAT", isOverseas: false }, { name: "Sherfane Rutherford", role: "BAT", isOverseas: true }, { name: "Danish Malewar", role: "BAT", isOverseas: false },
    { name: "Hardik Pandya", role: "AR", isOverseas: false }, { name: "Will Jacks", role: "AR", isOverseas: true }, { name: "Mitchell Santner", role: "AR", isOverseas: true }, { name: "Shardul Thakur", role: "AR", isOverseas: false }, { name: "Naman Dhir", role: "AR", isOverseas: false }, { name: "Corbin Bosch", role: "AR", isOverseas: true }, { name: "Raj Angad Bawa", role: "AR", isOverseas: false }, { name: "Krish Bhagat", role: "BOWL", isOverseas: false }, { name: "Mayank Rawat", role: "AR", isOverseas: false }
  ],
  "PBKS": [
    { name: "Prabhsimran Singh", role: "WK", isOverseas: false }, { name: "Vishnu Vinod", role: "WK", isOverseas: false },
    { name: "Arshdeep Singh", role: "BOWL", isOverseas: false }, { name: "Yuzvendra Chahal", role: "BOWL", isOverseas: false }, { name: "Vyshak Vijaykumar", role: "BOWL", isOverseas: false }, { name: "Yash Thakur", role: "BOWL", isOverseas: false }, { name: "Lockie Ferguson", role: "BOWL", isOverseas: true }, { name: "Xavier Bartlett", role: "BOWL", isOverseas: true }, { name: "Pravin Dubey", role: "BOWL", isOverseas: false }, { name: "Vishal Nishad", role: "BOWL", isOverseas: false },
    { name: "Shreyas Iyer", role: "BAT", isOverseas: false }, { name: "Shashank Singh", role: "BAT", isOverseas: false }, { name: "Nehal Wadhera", role: "BAT", isOverseas: false }, { name: "Harnoor Pannu", role: "BAT", isOverseas: false }, { name: "Pyla Avinash", role: "BAT", isOverseas: false }, { name: "Mitch Owen", role: "BAT", isOverseas: true },
    { name: "Marcus Stoinis", role: "AR", isOverseas: true }, { name: "Marco Jansen", role: "AR", isOverseas: true }, { name: "Azmatullah Omarzai", role: "AR", isOverseas: true }, { name: "Harpreet Brar", role: "AR", isOverseas: false }, { name: "Priyansh Arya", role: "AR", isOverseas: false }, { name: "Musheer Khan", role: "AR", isOverseas: false }, { name: "Suryansh Shedge", role: "AR", isOverseas: false }, { name: "Cooper Connolly", role: "AR", isOverseas: true }, { name: "Ben Dwarshuis", role: "AR", isOverseas: true }
  ],
  "RR": [
    { name: "Dhruv Jurel", role: "WK", isOverseas: false }, { name: "Donovan Ferreira", role: "WK", isOverseas: true }, { name: "Ravi Singh", role: "WK", isOverseas: false },
    { name: "Jofra Archer", role: "BOWL", isOverseas: true }, { name: "Tushar Deshpande", role: "BOWL", isOverseas: false }, { name: "Kwena Maphaka", role: "BOWL", isOverseas: true }, { name: "Ravi Bishnoi", role: "BOWL", isOverseas: false }, { name: "Sushant Mishra", role: "BOWL", isOverseas: false }, { name: "Sandeep Sharma", role: "BOWL", isOverseas: false }, { name: "Nandre Burger", role: "BOWL", isOverseas: true }, { name: "Adam Milne", role: "BOWL", isOverseas: true }, { name: "Kuldeep Sen", role: "BOWL", isOverseas: false }, { name: "Yash Raj Punja", role: "BOWL", isOverseas: false }, { name: "Vignesh Puthur", role: "BOWL", isOverseas: false }, { name: "Brijesh Sharma", role: "BOWL", isOverseas: false },
    { name: "Yashasvi Jaiswal", role: "BAT", isOverseas: false }, { name: "Shimron Hetmyer", role: "BAT", isOverseas: true }, { name: "Riyan Parag", role: "BAT", isOverseas: false }, { name: "Shubham Dubey", role: "BAT", isOverseas: false }, { name: "Vaibhav Suryavanshi", role: "BAT", isOverseas: false }, { name: "Lhuan-dre Pretorius", role: "BAT", isOverseas: true }, { name: "Aman Rao Perala", role: "BAT", isOverseas: false },
    { name: "Ravindra Jadeja", role: "AR", isOverseas: false }, { name: "Dasun Shanaka", role: "AR", isOverseas: true }, { name: "Yudhvir Singh Charak", role: "AR", isOverseas: false }
  ],
  "RCB": [
    { name: "Phil Salt", role: "WK", isOverseas: true }, { name: "Jitesh Sharma", role: "WK", isOverseas: false }, { name: "Jordan Cox", role: "WK", isOverseas: true },
    { name: "Josh Hazlewood", role: "BOWL", isOverseas: true }, { name: "Bhuvneshwar Kumar", role: "BOWL", isOverseas: false }, { name: "Yash Dayal", role: "BOWL", isOverseas: false }, { name: "Nuwan Tushara", role: "BOWL", isOverseas: true }, { name: "Rasikh Dar", role: "BOWL", isOverseas: false }, { name: "Suyash Sharma", role: "BOWL", isOverseas: false }, { name: "Jacob Duffy", role: "BOWL", isOverseas: true }, { name: "Abhinandan Singh", role: "BOWL", isOverseas: false },
    { name: "Virat Kohli", role: "BAT", isOverseas: false }, { name: "Rajat Patidar", role: "BAT", isOverseas: false }, { name: "Devdutt Padikkal", role: "BAT", isOverseas: false },
    { name: "Krunal Pandya", role: "BOWL", isOverseas: false }, { name: "Venkatesh Iyer", role: "AR", isOverseas: false }, { name: "Tim David", role: "AR", isOverseas: true }, { name: "Romario Shepherd", role: "AR", isOverseas: true }, { name: "Jacob Bethell", role: "AR", isOverseas: true }, { name: "Swapnil Singh", role: "AR", isOverseas: false }, { name: "Mangesh Yadav", role: "AR", isOverseas: false }, { name: "Vihaan Malhotra", role: "AR", isOverseas: false }, { name: "Satvik Deswal", role: "AR", isOverseas: false }, { name: "Vicky Ostwal", role: "AR", isOverseas: false }, { name: "Kanishk Chouhan", role: "AR", isOverseas: false }
  ],
  "SRH": [
    { name: "Heinrich Klaasen", role: "WK", isOverseas: true }, { name: "Ishan Kishan", role: "BAT", isOverseas: false }, { name: "Salil Arora", role: "WK", isOverseas: false },
    { name: "Pat Cummins", role: "BOWL", isOverseas: true }, { name: "Shivam Mavi", role: "BOWL", isOverseas: false }, { name: "Jaydev Unadkat", role: "BOWL", isOverseas: false }, { name: "Eshan Malinga", role: "BOWL", isOverseas: true }, { name: "Zeeshan Ansari", role: "BOWL", isOverseas: false }, { name: "Sakib Hussain", role: "BOWL", isOverseas: false }, { name: "Onkar Tarmale", role: "BOWL", isOverseas: false }, { name: "Amit Kumar", role: "BOWL", isOverseas: false }, { name: "Praful Hinge", role: "BOWL", isOverseas: false },
    { name: "Travis Head", role: "BAT", isOverseas: true }, { name: "Aniket Verma", role: "BAT", isOverseas: false }, { name: "Smaran Ravichandran", role: "BAT", isOverseas: false },
    { name: "Abhishek Sharma", role: "BAT", isOverseas: false }, { name: "Nitish Kumar Reddy", role: "BAT", isOverseas: false }, { name: "Harshal Patel", role: "AR", isOverseas: false }, { name: "Liam Livingstone", role: "AR", isOverseas: true }, { name: "Kamindu Mendis", role: "AR", isOverseas: true }, { name: "Dilshan Madushanka", role: "BOWL", isOverseas: true }, { name: "Gerald Coetzee", role: "BOWL", isOverseas: true }, { name: "Harsh Dubey", role: "AR", isOverseas: false }, { name: "Shivang Kumar", role: "AR", isOverseas: false }, { name: "Krains Fuletra", role: "AR", isOverseas: false }
  ]
};


// ---------------------------------------------------------
// DATABASE 2: FANTASY ROSTERS (User Teams)
// ---------------------------------------------------------
const FANTASY_ROSTERS = {
  "Group 1": ["Cameron Green", "Sai Sudharsan", "Shubman Gill", "Varun Chakravarthy", "KL Rahul", "Heinrich Klaasen", "Navdeep Saini", "Venkatesh Iyer", "Romario Shepherd", "Auqib Dar", "Prashant Veer", "Rahul Tewatia", "Naman Dhir", "Rasikh Dar", "Sandeep Sharma", "Suyash Sharma", "Anshul Kamboj", "Ashwani Kumar", "Rahul Tripathi", "Xavier Bartlett", "Rachin Ravindra", "David Miller"],
  "Group 2": ["Virat Kohli", "Surya Kumar Yadav", "Ishan Kishan", "Jasprit Bumrah", "Phil Salt", "Priyansh Arya", "Abhishek Porel", "Ayush Mhatre", "Dasun Shanaka", "Mayank Yadav", "Mukesh Kumar", "Digvesh Singh", "Aniket Verma", "Kagiso Rabada", "Nuwan Tushara", "Mangesh Yadav", "Kartik Sharma", "Glenn Phillips", "Vyshak Vijaykumar", "Liam Livingstone", "Cooper Connolly", "Finn Allen"],
  "Group 3": ["Tilak Varma", "Ruturaj Gaikwad", "Abhishek Sharma", "Rishabh Pant", "Axar Patel", "Kuldeep Yadav", "Noor Ahmad", "Washington Sundar", "Jacob Bethell", "Shashank Singh", "George Linde", "Spencer Johnson", "Matheesha Pathirana", "Shardul Thakur", "Marcus Stoinis", "Ramandeep Singh", "Deepak Chahar", "Aman Rao Perala", "Sherfane Rutherford", "Prince Yadav", "Tim David", "MS Dhoni"],
  "Group 4": ["Yashasvi Jaiswal", "Shreyas Iyer", "Sunil Narine", "Vaibhav Arora", "Rajat Patidar", "Shivam Dube", "Nehal Wadhera", "Mitchell Starc", "Sai Kishore", "Nitish Rana", "Jitesh Sharma", "Dhruv Jurel", "Tushar Deshpande", "Vipraj Nigam", "Pat Cummins", "Ayush Badoni", "Zeeshan Ansari", "Mayank Markande", "Zak Foulkes", "Donovan Ferreira", "Connor Esterhuizen", "Jason Holder"],
  "Group 5": ["Devdutt Padikkal", "Mohammad Shami", "Hardik Pandya", "Travis Head", "Jos Buttler", "Prabhsimran Singh", "Yuzvendra Chahal", "Quinton de Kock", "Ravi Bishnoi", "Angkrish Raghuvanshi", "Ryan Rickelton", "Rinku Singh", "Ashutosh Sharma", "Sameer Rizvi", "Harshal Patel", "Shahbaz Ahamad", "Mitchell Marsh", "Jayant Yadav", "Anrich Nortje", "Shreyas Gopal", "Josh Hazlewood", "Shimron Hetmyer"],
  "Group 6": ["Dewald Brevis", "Vaibhav Suryavanshi", "Krunal Pandya", "Trent Boult", "Marco Jansen", "Prasidh Krishna", "Sanju Samson", "Ravindra Jadeja", "Rashid Khan", "Riyan Parag", "Josh Inglis", "Karun Nair", "Vignesh Puthur", "Eshan Malinga", "Lungi Ngidi", "Kwena Maphaka", "Urvil Patel", "Akash Singh", "Arjun Tendulkar", "Sarfaraz Khan", "Abdul Samad", "Natarajan"],
  "Group 7": ["Aiden Markram", "Tristan Stubbs", "Nicholas Pooran", "Rohit Sharma", "Bhuvneshwar Kumar", "Arshdeep Singh", "Khaleel Ahmed", "Ajinkya Rahane", "Mohammed Siraj", "Lockie Ferguson", "Tim Seifert", "Mitchell Santner", "Jacob Duffy", "Nitish Kumar Reddy", "Avesh Khan", "Corbin Bosch", "Harpreet Brar", "Shahrukh Khan", "Vicky Ostwal", "Anuj Rawat", "Jaydev Unadkat", "Harsh Dubey"]
};

const MATCH_SCHEDULE = [
  { id: 1, teams: "RCB vs SRH", countries: ["RCB", "SRH"], start: "2026-03-28T19:30:00" },
  { id: 2, teams: "MI vs KKR", countries: ["MI", "KKR"], start: "2026-03-29T19:30:00" },
  { id: 3, teams: "RR vs CSK", countries: ["RR", "CSK"], start: "2026-03-30T19:30:00" },
  { id: 4, teams: "PBKS vs GT", countries: ["PBKS", "GT"], start: "2026-03-31T19:30:00" },
  { id: 5, teams: "LSG vs DC", countries: ["LSG", "DC"], start: "2026-04-01T19:30:00" },
  { id: 6, teams: "KKR vs SRH", countries: ["KKR", "SRH"], start: "2026-04-02T19:30:00" },
  { id: 7, teams: "CSK vs PBKS", countries: ["CSK", "PBKS"], start: "2026-04-03T19:30:00" },
  { id: 8, teams: "DC vs MI", countries: ["DC", "MI"], start: "2026-04-04T15:30:00" },
  { id: 9, teams: "GT vs RR", countries: ["GT", "RR"], start: "2026-04-04T19:30:00" },
  { id: 10, teams: "SRH vs LSG", countries: ["SRH", "LSG"], start: "2026-04-05T15:30:00" },
  { id: 11, teams: "RCB vs CSK", countries: ["RCB", "CSK"], start: "2026-04-05T19:30:00" },
  { id: 12, teams: "KKR vs PBKS", countries: ["KKR", "PBKS"], start: "2026-04-06T19:30:00" },
  { id: 13, teams: "RR vs MI", countries: ["RR", "MI"], start: "2026-04-07T19:30:00" },
  { id: 14, teams: "DC vs GT", countries: ["DC", "GT"], start: "2026-04-08T19:30:00" },
  { id: 15, teams: "KKR vs LSG", countries: ["KKR", "LSG"], start: "2026-04-09T19:30:00" },
  { id: 16, teams: "RR vs RCB", countries: ["RR", "RCB"], start: "2026-04-10T19:30:00" },
  { id: 17, teams: "PBKS vs SRH", countries: ["PBKS", "SRH"], start: "2026-04-11T15:30:00" },
  { id: 18, teams: "CSK vs DC", countries: ["CSK", "DC"], start: "2026-04-11T19:30:00" },
  { id: 19, teams: "LSG vs GT", countries: ["LSG", "GT"], start: "2026-04-12T15:30:00" },
  { id: 20, teams: "MI vs RCB", countries: ["MI", "RCB"], start: "2026-04-12T19:30:00" },
  { id: 21, teams: "RR vs SRH", countries: ["RR", "SRH"], start: "2026-04-13T19:30:00" },
  { id: 22, teams: "KKR vs CSK", countries: ["KKR", "CSK"], start: "2026-04-14T19:30:00" },
  { id: 23, teams: "LSG vs RCB", countries: ["LSG", "RCB"], start: "2026-04-15T19:30:00" },
  { id: 24, teams: "PBKS vs MI", countries: ["PBKS", "MI"], start: "2026-04-16T19:30:00" },
  { id: 25, teams: "KKR vs GT", countries: ["KKR", "GT"], start: "2026-04-17T19:30:00" },
  { id: 26, teams: "DC vs RCB", countries: ["DC", "RCB"], start: "2026-04-18T15:30:00" },
  { id: 27, teams: "CSK vs SRH", countries: ["CSK", "SRH"], start: "2026-04-18T19:30:00" },
  { id: 28, teams: "RR vs KKR", countries: ["RR", "KKR"], start: "2026-04-19T15:30:00" },
  { id: 29, teams: "LSG vs PBKS", countries: ["LSG", "PBKS"], start: "2026-04-19T19:30:00" },
  { id: 30, teams: "MI vs GT", countries: ["MI", "GT"], start: "2026-04-20T19:30:00" },
  { id: 31, teams: "DC vs SRH", countries: ["DC", "SRH"], start: "2026-04-21T19:30:00" },
  { id: 32, teams: "RR vs LSG", countries: ["RR", "LSG"], start: "2026-04-22T19:30:00" },
  { id: 33, teams: "CSK vs MI", countries: ["CSK", "MI"], start: "2026-04-23T19:30:00" },
  { id: 34, teams: "GT vs RCB", countries: ["GT", "RCB"], start: "2026-04-24T19:30:00" },
  { id: 35, teams: "PBKS vs DC", countries: ["PBKS", "DC"], start: "2026-04-25T15:30:00" },
  { id: 36, teams: "SRH vs RR", countries: ["SRH", "RR"], start: "2026-04-25T19:30:00" },
  { id: 37, teams: "CSK vs GT", countries: ["CSK", "GT"], start: "2026-04-26T15:30:00" },
  { id: 38, teams: "KKR vs LSG", countries: ["KKR", "LSG"], start: "2026-04-26T19:30:00" },
  { id: 39, teams: "RCB vs DC", countries: ["RCB", "DC"], start: "2026-04-27T19:30:00" },
  { id: 40, teams: "RR vs PBKS", countries: ["RR", "PBKS"], start: "2026-04-28T19:30:00" },
  { id: 41, teams: "SRH vs MI", countries: ["SRH", "MI"], start: "2026-04-29T19:30:00" },
  { id: 42, teams: "RCB vs GT", countries: ["RCB", "GT"], start: "2026-04-30T19:30:00" },
  { id: 43, teams: "DC vs RR", countries: ["DC", "RR"], start: "2026-05-01T19:30:00" },
  { id: 44, teams: "MI vs CSK", countries: ["MI", "CSK"], start: "2026-05-02T19:30:00" },
  { id: 45, teams: "KKR vs SRH", countries: ["KKR", "SRH"], start: "2026-05-03T15:30:00" },
  { id: 46, teams: "PBKS vs GT", countries: ["PBKS", "GT"], start: "2026-05-03T19:30:00" },
  { id: 47, teams: "LSG vs MI", countries: ["LSG", "MI"], start: "2026-05-04T19:30:00" },
  { id: 48, teams: "CSK vs DC", countries: ["CSK", "DC"], start: "2026-05-05T19:30:00" },
  { id: 49, teams: "PBKS vs SRH", countries: ["PBKS", "SRH"], start: "2026-05-06T19:30:00" },
  { id: 50, teams: "RCB vs LSG", countries: ["RCB", "LSG"], start: "2026-05-07T19:30:00" },
  { id: 51, teams: "KKR vs DC", countries: ["KKR", "DC"], start: "2026-05-08T19:30:00" },
  { id: 52, teams: "GT vs RR", countries: ["GT", "RR"], start: "2026-05-09T19:30:00" },
  { id: 53, teams: "LSG vs CSK", countries: ["LSG", "CSK"], start: "2026-05-10T15:30:00" },
  { id: 54, teams: "MI vs RCB", countries: ["MI", "RCB"], start: "2026-05-10T19:30:00" },
  { id: 55, teams: "DC vs PBKS", countries: ["DC", "PBKS"], start: "2026-05-11T19:30:00" },
  { id: 56, teams: "SRH vs GT", countries: ["SRH", "GT"], start: "2026-05-12T19:30:00" },
  { id: 57, teams: "KKR vs RCB", countries: ["KKR", "RCB"], start: "2026-05-13T19:30:00" },
  { id: 58, teams: "MI vs PBKS", countries: ["MI", "PBKS"], start: "2026-05-14T19:30:00" },
  { id: 59, teams: "CSK vs LSG", countries: ["CSK", "LSG"], start: "2026-05-15T19:30:00" },
  { id: 60, teams: "GT vs KKR", countries: ["GT", "KKR"], start: "2026-05-16T19:30:00" },
  { id: 61, teams: "RCB vs PBKS", countries: ["RCB", "PBKS"], start: "2026-05-17T15:30:00" },
  { id: 62, teams: "RR vs DC", countries: ["RR", "DC"], start: "2026-05-17T19:30:00" },
  { id: 63, teams: "SRH vs CSK", countries: ["SRH", "CSK"], start: "2026-05-18T19:30:00" },
  { id: 64, teams: "LSG vs RR", countries: ["LSG", "RR"], start: "2026-05-19T19:30:00" },
  { id: 65, teams: "MI vs KKR", countries: ["MI", "KKR"], start: "2026-05-20T19:30:00" },
  { id: 66, teams: "GT vs CSK", countries: ["GT", "CSK"], start: "2026-05-21T19:30:00" },
  { id: 67, teams: "RCB vs SRH", countries: ["RCB", "SRH"], start: "2026-05-22T19:30:00" },
  { id: 68, teams: "PBKS vs LSG", countries: ["PBKS", "LSG"], start: "2026-05-23T19:30:00" },
  { id: 69, teams: "RR vs MI", countries: ["RR", "MI"], start: "2026-05-24T15:30:00" },
  { id: 70, teams: "DC vs KKR", countries: ["DC", "KKR"], start: "2026-05-24T19:30:00" }
];

// Helper: Get Role
const getRole = (playerName) => {
  for (const country in Squads) {
    const player = Squads[country].find(p => p.name === playerName);
    if (player) return player.role;
  }
  return "AR";
};

const isOverseasPlayer = (playerName) => {
  for (const country in Squads) {
    const player = Squads[country].find(p => p.name === playerName);
    if (player) return !!player.isOverseas;
  }
  return false;
};

// --- SHARED SCORING HELPER ---
const calculateRoundScore = (roundMatchIds, lineup, activeChip, chipNomination, team, matchResults, matchDetails, matchSubmissionTimes, playerRegistry = {}) => {
  const playerStats = {};

  roundMatchIds.forEach(mId => {
    const mPoints = matchResults[mId] || {};
    const mPom = matchDetails[mId]?.pom;

    team.players.forEach(p => {
      const pName = p.name;
      const isInXI = lineup.playingXINames.includes(pName);
      if (isInXI || activeChip === 'best11') {
        const rawPoints = Number(mPoints[pName] || 0);
        if (!playerStats[pName]) playerStats[pName] = { points: 0, matches: 0, wonPom: false, role: getRole(pName), maxSingleMatchPoints: 0 };
        playerStats[pName].points += rawPoints;
        if (rawPoints > playerStats[pName].maxSingleMatchPoints) playerStats[pName].maxSingleMatchPoints = rawPoints;

        if (matchSubmissionTimes[mId]) playerStats[pName].matches += 1;
        if (mPom === pName) playerStats[pName].wonPom = true;
      }
    });
  });

  // Determine Multipliers
  let captain = lineup.captainName;
  let viceCaptain = lineup.viceCaptainName;

  if (activeChip === 'flexi' || activeChip === 'best11') {
    const sortedPlayers = Object.keys(playerStats).sort((a, b) => {
      const diff = playerStats[b].points - playerStats[a].points;
      if (diff !== 0) return diff;
      return (playerRegistry[b]?.points || 0) - (playerRegistry[a]?.points || 0);
    });

    if (activeChip === 'best11') {
      const top11 = sortedPlayers.slice(0, 11);
      Object.keys(playerStats).forEach(p => {
        if (!top11.includes(p)) delete playerStats[p];
      });
      if (top11.length > 0) captain = top11[0];
      if (top11.length > 1) viceCaptain = top11[1];
    } else {
      if (sortedPlayers.length > 0) captain = sortedPlayers[0];
      if (sortedPlayers.length > 1) viceCaptain = sortedPlayers[1];
    }
  }

  let totalRoundPoints = 0;
  const finalContributions = {};
  Object.keys(playerStats).forEach(pName => {
    const stats = playerStats[pName];
    let capMult = 0;
    if (activeChip !== 'double') {
      if (pName === captain) capMult = 2;
      else if (pName === viceCaptain) {
        if (activeChip === 'vcv') {
          const cBase = playerStats[captain]?.points || 0;
          const vcBase = playerStats[viceCaptain]?.points || 0;
          capMult = vcBase > cBase ? 2.5 : 1.5;
        } else {
          capMult = 1.5;
        }
      }
    }

    let chipMult = 0;
    if ((activeChip === 'bat' && stats.role === 'BAT') ||
      (activeChip === 'bowl' && stats.role === 'BOWL')) {
      if (stats.maxSingleMatchPoints >= 100) chipMult = 2;
    }
    if (activeChip === 'pom' && chipNomination === pName && stats.wonPom) chipMult = 3;
    if (activeChip === 'double') chipMult = 1.5;

    const totalMult = capMult + chipMult;
    let playerTotal = 0;
    if (totalMult === 0) {
      playerTotal = stats.points;
    } else {
      playerTotal = (stats.points * totalMult);
    }
    totalRoundPoints += playerTotal;
    finalContributions[pName] = playerTotal;
  });
  let replacedPlayer = null;

  if (activeChip === 'supersub' && chipNomination) {
    if (!lineup.playingXINames.includes(chipNomination)) {
      let starterNames = Object.keys(finalContributions);
      const overseasStartersCount = lineup.playingXINames.filter(name => isOverseasPlayer(name)).length;
      
      if (isOverseasPlayer(chipNomination) && overseasStartersCount >= 4) {
        starterNames = starterNames.filter(name => isOverseasPlayer(name));
      }

      if (starterNames.length > 0) {
        const lowestScorerName = starterNames.reduce((a, b) =>
          finalContributions[a] < finalContributions[b] ? a : b
        );
        let subPoints = 0;
        roundMatchIds.forEach(mId => {
          subPoints += Number(matchResults[mId]?.[chipNomination] || 0);
        });
        if (subPoints > finalContributions[lowestScorerName]) {
          totalRoundPoints += subPoints - finalContributions[lowestScorerName];
          replacedPlayer = lowestScorerName;
        }
      }
    }
  }

  if (activeChip === 'prophecy' && chipNomination) {
    const target = Number(chipNomination);
    if (!isNaN(target)) {
      let basePoints = 0;
      Object.keys(playerStats).forEach(pName => {
        if (lineup.playingXINames.includes(pName)) {
          basePoints += playerStats[pName].points;
        }
      });
      if (basePoints >= target - 50 && basePoints <= target + 50) {
        totalRoundPoints += 150;
      } else {
        totalRoundPoints -= 150;
      }
    }
  }

  return { score: totalRoundPoints, replacedPlayer };
};

export default function App() {
  // const [user, setUser] = useState(null); // REMOVED

  const [fantasyTeams, setFantasyTeams] = useState([]);
  const [playerRegistry, setPlayerRegistry] = useState({});
  const [processedMatchIds, setProcessedMatchIds] = useState([]);
  const [matchResults, setMatchResults] = useState({}); // { matchId: { playerName: points } }
  const [teamMatchRewards, setTeamMatchRewards] = useState({}); // { matchId: { teamId: points } }
  const [matchDetails, setMatchDetails] = useState({}); // { matchId: { pom: "Player Name" } }

  // --- AUTH STATE ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLineupLocked, setIsLineupLocked] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [loginError, setLoginError] = useState(false);

  // --- GROUP AUTH ---
  const [authorizedGroupIds, setAuthorizedGroupIds] = useState(() => {
    const saved = localStorage.getItem('authorized_groups');
    return saved ? JSON.parse(saved) : [];
  });
  const [groupAuthPending, setGroupAuthPending] = useState(null); // { team, pin, error }

  useEffect(() => {
    localStorage.setItem('authorized_groups', JSON.stringify(authorizedGroupIds));
  }, [authorizedGroupIds]);

  const [activeTab, setActiveTab] = useState('leaderboard');
  const [editingTeam, setEditingTeam] = useState(null);
  const [mvpSearch, setMvpSearch] = useState("");
  const [lineupHistory, setLineupHistory] = useState([]); // Array of { type: 'LOCK'|'UNLOCK', timestamp, lineups?}
  const [rounds, setRounds] = useState([]); // Array of { id, matchIds, lineups, timestamp }
  const [matchSubmissionTimes, setMatchSubmissionTimes] = useState({}); // { matchId: ISOString }
  const [resolvingMatch, setResolvingMatch] = useState(null);
  const [manualPoints, setManualPoints] = useState({});
  const [manualPom, setManualPom] = useState("");
  const [matchPlayerSearch, setMatchPlayerSearch] = useState("");
  const [systemTime, setSystemTime] = useState(INITIAL_SYSTEM_TIME);
  const [loading, setLoading] = useState(true);

  /* 0. SYSTEM CLOCK */
  const [lastSynced, setLastSynced] = useState(null);
  const [cloudStatus, setCloudStatus] = useState("connecting"); // connecting, connected, disconnected, empty

  // FIX: Race Condition - Block sync while saving
  const [isSaving, setIsSaving] = useState(false);


  const initializeLocalData = () => {
    const initTeams = Object.keys(FANTASY_ROSTERS).map((groupName, i) => ({
      id: `g${i + 1}`,
      name: groupName,
      points: 0,
      captainName: "", // INITIALIZE EMPTY
      viceCaptainName: "", // INITIALIZE EMPTY
      playingXINames: [], // INITIALIZE EMPTY
      players: FANTASY_ROSTERS[groupName].map(name => ({ name })),
      chips: {
        flexi: { used: false },
        bat: { used: false },
        bowl: { used: false },
        pom: { used: false },
        supersub: { used: false },
        vcv: { used: false },
        double: { used: false },
        prophecy: { used: false },
        best11: { used: false }
      },
      activeChip: null, // 'flexi', 'bat', 'bowl', 'pom', or null
      chipNomination: null // name of player for POM chip
    }));
    setFantasyTeams(initTeams);
  };

  useEffect(() => {
    const startRealTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startRealTime;
      setSystemTime(new Date(INITIAL_SYSTEM_TIME.getTime() + elapsed));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Data Sync (Polling)
  useEffect(() => {
    const fetchSync = async () => {
      // If we are currently saving local changes, DO NOT fetch from cloud
      // This prevents overwriting our just-made local changes with stale cloud data
      if (isSaving) return;

      try {
        const data = await api.sync();
        if (data) {
          // If teams exist, update state
          if (data.teams && data.teams.length > 0) {
            setFantasyTeams(data.teams);
          } else if (fantasyTeams.length === 0) {
            // If cloud is empty and local is empty, init defaults
            initializeLocalData();
          }

          if (data.playerRegistry) setPlayerRegistry(data.playerRegistry);

          if (data.metadata) {
            setProcessedMatchIds(data.metadata.processedMatchIds || []);
            setIsLineupLocked(data.metadata.isLineupLocked || false);
            setMatchResults(data.metadata.matchResults || {});
            setTeamMatchRewards(data.metadata.teamMatchRewards || {});
            setLineupHistory(data.metadata.lineupHistory || []);
            setRounds(data.metadata.rounds || []);
            setMatchSubmissionTimes(data.metadata.matchSubmissionTimes || {});
            setMatchDetails(data.metadata.matchDetails || {});
          }
          setCloudStatus("connected");
          setLastSynced(new Date());
        }
      } catch (e) {
        console.error("Sync Failed:", e);
        setCloudStatus("disconnected");
      } finally {
        setLoading(false);
      }
    };

    fetchSync(); // Initial fetch
    const interval = setInterval(fetchSync, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, [isSaving]); // dependency on isSaving ensures we re-evaluate if it changes? No, interval is set once.
  // Actually, interval callback closes over `isSaving`. 
  // Wait, if `fetchSync` is defined inside `useEffect`, it closes over the initial `isSaving` (false).
  // So `if (isSaving) return` will ALWAYS see false.
  // I must add `isSaving` to dependency array, but then it clears interval on change.
  // Better: Use a ref for `isSaving` OR remove `fetchSync` from `useEffect`.
  //
  // Ref approach is cleanest for intervals.

  // RE-PLAN:
  // Using a ref for isSaving check inside interval.


  // Pre-fill Modal for Updates
  useEffect(() => {
    if (resolvingMatch) {
      if (matchResults[resolvingMatch.id]) {
        setManualPoints(matchResults[resolvingMatch.id]);
      } else {
        setManualPoints({});
      }
      if (matchDetails[resolvingMatch.id]?.pom) {
        setManualPom(matchDetails[resolvingMatch.id].pom);
      } else {
        setManualPom("");
      }
      setMatchPlayerSearch("");
    } else {
      setManualPoints({});
      setManualPom("");
      setMatchPlayerSearch("");
    }
  }, [resolvingMatch]);

  // --- AUTO-SAVE LOCAL BACKUP ---
  useEffect(() => {
    if (fantasyTeams.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY_ROSTER, JSON.stringify(fantasyTeams));
    }
  }, [fantasyTeams]);


  // --- MEMOIZED DATA ---
  const calculateTentativeScore = (team) => {
    let totalScore = 0;
    const assignedMatchIds = rounds.flatMap(r => r.matchIds);

    // 1. Past Rounds
    rounds.forEach(round => {
      const lineup = round.lineups[team.id];
      if (lineup) {
        totalScore += calculateRoundScore(round.matchIds, lineup, lineup.activeChip, lineup.chipNomination, team, matchResults, matchDetails, matchSubmissionTimes, playerRegistry).score;
      }
    });

    // 2. Pending Matches (Live Projection)
    const pendingMatchIds = processedMatchIds.filter(id => !assignedMatchIds.includes(id));
    if (pendingMatchIds.length > 0) {
      let lineup = team;
      if (isLineupLocked) {
        const lastLock = [...lineupHistory].reverse().find(e => e.type === 'LOCK');
        if (lastLock?.lineups?.[team.id]) lineup = lastLock.lineups[team.id];
      }
      totalScore += calculateRoundScore(pendingMatchIds, lineup, lineup.activeChip, lineup.chipNomination, team, matchResults, matchDetails, matchSubmissionTimes, playerRegistry).score;
    }

    return totalScore;
  };

  const sortedTeams = useMemo(() =>
    [...fantasyTeams].sort((a, b) => calculateTentativeScore(b) - calculateTentativeScore(a)),
    [fantasyTeams, matchResults, rounds, processedMatchIds, lineupHistory, isLineupLocked, matchDetails, matchSubmissionTimes]
  );

  const mvpList = useMemo(() => {
    // 1. Get all players from  Squads to ensure everyone is listed
    const allPlayers = Object.values(Squads).flat();

    // 2. Merge with registry data (points)
    return allPlayers.map(p => {
      const regData = playerRegistry[p.name] || { points: 0 };

      const country = Object.keys(Squads).find(c =>
        Squads[c].some(np => np.name === p.name)
      ) || "UNK";

      const group = fantasyTeams.find(t =>
        t.players.some(fp => fp.name === p.name)
      )?.name || "-";

      // Dynamically calculate matches played from matchResults
      const matchesPlayed = Object.values(matchResults).filter(m => m[p.name] !== undefined && m[p.name] !== null).length;

      return {
        name: p.name,
        points: regData.points,
        matchesPlayed: matchesPlayed,
        role: p.role,
        country,
        isOverseas: !!p.isOverseas,
        group
      };
    })
      .filter(p => p.name.toLowerCase().includes(mvpSearch.toLowerCase()))
      .sort((a, b) => b.points - a.points);
  }, [playerRegistry, mvpSearch, fantasyTeams, matchResults]);

  // --- ACTIONS ---

  const handleAdminLogin = async () => {
    try {
      const result = await api.verifyAdminPin(adminPin);
      if (result.success) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        setAdminPin("");
        setLoginError(false);
      } else {
        setLoginError(true);
      }
    } catch (e) {
      console.error(e);
      setLoginError(true);
    }
  };

  const handleGroupLogin = async () => {
    if (!groupAuthPending) return;
    try {
      const result = await api.verifyGroupPin(groupAuthPending.team.id, adminPin);
      if (result.success) {
        setAuthorizedGroupIds(prev => [...prev, groupAuthPending.team.id]);
        setEditingTeam(JSON.parse(JSON.stringify(groupAuthPending.team)));
        setGroupAuthPending(null);
        setAdminPin("");
        setLoginError(false);
      } else {
        setLoginError(true);
      }
    } catch (e) {
      console.error(e);
      setLoginError(true);
    }
  };

  /* --- ROUND MANAGEMENT --- */

  const handleStartRound = async () => {
    if (isLineupLocked) return;

    // Archive the event
    const event = {
      type: 'LOCK',
      timestamp: new Date().toISOString()
    };

    // LOCKING: Capture snapshot for the upcoming round
    event.lineups = {};
    fantasyTeams.forEach(team => {
      event.lineups[team.id] = {
        playingXINames: team.playingXINames,
        captainName: team.captainName,
        viceCaptainName: team.viceCaptainName,
        activeChip: team.activeChip,
        chipNomination: team.chipNomination
      };
    });

    const newLineupHistory = [...lineupHistory, event];

    try {
      await api.updateMetadata({
        isLineupLocked: true,
        processedMatchIds,
        matchResults,
        teamMatchRewards,
        lineupHistory: newLineupHistory,
        rounds,
        matchSubmissionTimes,
        matchDetails
      });
      setIsLineupLocked(true);
      setLineupHistory(newLineupHistory);
    } catch (e) { console.error(e); }
  };

  const handleEndRound = async () => {
    if (!isLineupLocked) return;

    if (!window.confirm("Are you sure you want to END the round? This will calculate points, update the leaderboard, and unlock lineups.")) return;

    // 1. Find the last LOCK event to see when this round started
    const reversedHistory = [...lineupHistory].reverse();
    const lastLock = reversedHistory.find(e => e.type === 'LOCK');
    const flexiUpdates = {};

    // Archive the unlock event
    const unlockEvent = {
      type: 'UNLOCK',
      timestamp: new Date().toISOString()
    };

    let updatedRounds = [...rounds];
    // matchesInRound will be calculated to associate with this round
    let matchesInRound = [];

    if (lastLock && lastLock.lineups) {
      const roundStart = new Date(lastLock.timestamp);
      const roundEnd = new Date();

      // 2. Find matches that STARTED in this window OR were FIRST SCORED in this window
      // IMPROVED LOGIC: We also check if the match result exists and hasn't been assigned to a previous round
      // This handles cases where time boundaries might be tight or strictly sequential
      const previouslyAssignedMatchIds = rounds.flatMap(r => r.matchIds);

      matchesInRound = MATCH_SCHEDULE.filter(m => {
        // If already processed in a previous round, skip
        if (previouslyAssignedMatchIds.includes(m.id)) return false;

        // Must be processed (have a result) to be included in round calculations
        // If not processed, it stays pending for the next round (or never if finished without score)
        // Exception: If it started in this window, we might want to include it as a 0-point match? 
        // Better to only include processed matches to avoid low-score confusion.
        // USER INTENT: "End Round" calculates points. Points come from processed matches.
        if (!processedMatchIds.includes(m.id)) return false;

        // OR simply: If it's processed and not in a previous round, it belongs to this active round.
        // This is the most robust logic for a sequential "Start -> Match -> End" workflow.
        // If the user forgot to end a round for a week, all matches in that week should count.
        // So, simply: Is it processed? Yes. Was it in a previous round? No. -> It's in this round.
        return true;
      }).map(m => m.id);


      if (matchesInRound.length > 0) {
        // --- 3. FLEXI CAP PRE-PROCESSING ---
        // Iterate through lastLock lineups to auto-assign C/VC for Flexi Cap users
        // BEFORE creating the round snapshot
        Object.keys(lastLock.lineups).forEach(tId => {
          const lineup = lastLock.lineups[tId];
          if (lineup.activeChip === 'flexi') {
            const pStats = {};
            matchesInRound.forEach(mId => {
              const mPoints = matchResults[mId] || {};
              lineup.playingXINames.forEach(pName => {
                const pts = Number(mPoints[pName] || 0);
                pStats[pName] = (pStats[pName] || 0) + pts;
              });
            });

            // Sort by points desc with tie-breaker
            const sorted = Object.keys(pStats).sort((a, b) => {
              const diff = pStats[b] - pStats[a];
              if (diff !== 0) return diff;
              return (playerRegistry[b]?.points || 0) - (playerRegistry[a]?.points || 0);
            });

            if (sorted.length > 0) {
              lineup.captainName = sorted[0];
              lineup.viceCaptainName = sorted.length > 1 ? sorted[1] : "";

              flexiUpdates[tId] = {
                captainName: lineup.captainName,
                viceCaptainName: lineup.viceCaptainName
              };
            }
          }
        });

        const newRound = {
          id: `round_${Date.now()}`,
          timestamp: new Date().toISOString(),
          matchIds: matchesInRound,
          lineups: lastLock.lineups // The lineups that we potentially just modified above
        };
        updatedRounds.push(newRound);
      }
    }

    // Reuse Scoring Logic from (old) handleScoreSubmit-ish logic but adapted for EndRound
    // We need to recalculate ALL scores for ALL teams based on the rounds history + current round (if any matches just happened)
    // Actually, simply iterating through 'updatedRounds' is enough because we just added the new round to it.

    // Help calculate score for a specific round/lineup
    // (Function now moved to component level: calculateRoundScore)

    // Calculate Total Points for each team
    const updatedFantasyTeams = fantasyTeams.map(team => {
      let totalScore = 0;

      // Sum from all rounds
      updatedRounds.forEach(round => {
        const lineup = round.lineups[team.id];
        if (lineup) {
          totalScore += calculateRoundScore(round.matchIds, lineup, lineup.activeChip, lineup.chipNomination, team, matchResults, matchDetails, matchSubmissionTimes, playerRegistry).score;
        }
      });

      // Handle Chips Burning
      let newChips = { ...team.chips };
      let newActiveChip = team.activeChip;
      let newChipNomination = team.chipNomination;

      // If a round was processed and the team had an active chip, burn it.
      // Logic: matchesInRound > 0 implies a valid round occurred.
      // We look at the 'lastLock' snapshot to see if chip was active *for this round*.
      // But we must update the *current* team state to show it as used.
      if (matchesInRound.length > 0 && lastLock?.lineups[team.id]?.activeChip) {
        const usedChipId = lastLock.lineups[team.id].activeChip;
        // Ensure we handle deep copy structure if needed, but strict replacement works for shallow maps
        newChips = {
          ...newChips,
          [usedChipId]: { used: true }
        };

        // Reset active chip if it was the one used
        // IMPORTANT: We check against the CURRENT active chip in state, not the snapshot one
        // If user is Admin and changed it mid-round, it might be different, but for standard flow it matches.
        if (newActiveChip === usedChipId) {
          newActiveChip = null;
          newChipNomination = null;
        }
      }

      return {
        ...team,
        points: totalScore,
        captainName: flexiUpdates[team.id]?.captainName || team.captainName,
        viceCaptainName: flexiUpdates[team.id]?.viceCaptainName || team.viceCaptainName,
        chips: newChips,
        activeChip: newActiveChip,
        chipNomination: newChipNomination
      };
    });

    const newLineupHistory = [...lineupHistory, unlockEvent];

    try {
      setIsSaving(true);
      await api.updateTeams(updatedFantasyTeams);
      await api.updateMetadata({
        isLineupLocked: false,
        processedMatchIds,
        matchResults,
        teamMatchRewards,
        lineupHistory: newLineupHistory,
        rounds: updatedRounds,
        matchSubmissionTimes,
        matchDetails
      });

      setFantasyTeams(updatedFantasyTeams);
      setRounds(updatedRounds);
      setIsLineupLocked(false);
      setLineupHistory(newLineupHistory);

    } catch (e) {
      console.error(e);
      alert("Failed to End Round");
    } finally {
      setIsSaving(false);
    }
  };



  // --- SAFE SYNC ACTIONS ---

  const handleSeedDatabase = async () => {
    if (!window.confirm("WARNING: This will RESET the Cloud Database with initial rosters. Are you sure?")) return;

    try {
      setIsSaving(true);
      setLoading(true);
      console.log("Starting Database Seed...");

      const teams = Object.keys(FANTASY_ROSTERS).map((groupName, i) => ({
        id: `g${i + 1}`,
        name: groupName,
        points: 0,
        captainName: "",
        viceCaptainName: "",
        playingXINames: [],
        players: FANTASY_ROSTERS[groupName].map(name => ({ name })),
        chips: {
          flexi: { used: false },
          bat: { used: false },
          bowl: { used: false },
          pom: { used: false },
          converter: { used: false },
          supersub: { used: false },
          vcv: { used: false },
          double: { used: false },
          prophecy: { used: false },
          best11: { used: false }
        },
        activeChip: null,
        chipNomination: null
      }));

      const metadata = {
        isLineupLocked: false,
        processedMatchIds: [],
        matchResults: {},
        teamMatchRewards: {},
        lineupHistory: [],
        rounds: [],
        matchSubmissionTimes: {},
        matchDetails: {}
      };

      await api.seed(teams, metadata);

      console.log("Seed Complete!");
      setLoading(false);
      alert("Database Seeded Successfully! All devices will sync now.");
      // Force immediate re-sync
      window.location.reload();
    } catch (error) {
      console.error("SEEDING ERROR:", error);
      setLoading(false);
      alert(`Error Seeding Database: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleScoreSubmit = async () => {
    if (!resolvingMatch) return;

    // --- 1. PREPARE DATA ---
    const existingMatchPoints = matchResults[resolvingMatch.id] || {};
    const mergedMatchPoints = { ...existingMatchPoints };
    Object.keys(manualPoints).forEach(pName => {
      const val = manualPoints[pName];
      if (val !== undefined && val !== null && val.toString().trim() !== "") {
        mergedMatchPoints[pName] = val;
      }
    });
    const newMatchResults = { ...matchResults, [resolvingMatch.id]: mergedMatchPoints };

    const newMatchDetails = {
      ...matchDetails,
      [resolvingMatch.id]: { ...(matchDetails[resolvingMatch.id] || {}), pom: manualPom }
    };

    const newSubmissionTimes = { ...matchSubmissionTimes };
    if (!newSubmissionTimes[resolvingMatch.id]) {
      newSubmissionTimes[resolvingMatch.id] = new Date().toISOString();
    }


    // --- 2. PLAYER REGISTRY ONLY (For MVP Table) ---
    // User wants Leaderboard frozen, but MVP table usually reflects live stats.
    // We will update Registry but NOT Fantasy Teams.
    const newRegistry = {};
    Object.keys(newMatchResults).forEach(mId => {
      const mPoints = newMatchResults[mId];
      Object.keys(mPoints).forEach(pName => {
        if (!newRegistry[pName]) newRegistry[pName] = { points: 0, matchesPlayed: 0 };
        newRegistry[pName].points += Number(mPoints[pName]);
        newRegistry[pName].matchesPlayed += 1;
      });
    });

    const newProcessedIds = processedMatchIds.includes(resolvingMatch.id)
      ? processedMatchIds
      : [...processedMatchIds, resolvingMatch.id];

    try {
      setIsSaving(true);
      // Update Registry (Live MVP)
      await api.updateRegistry(newRegistry);

      // Update Metadata Only (Matches, Details, Times) - NO Round/Team Update
      await api.updateMetadata({
        processedMatchIds: newProcessedIds,
        isLineupLocked,
        matchResults: newMatchResults,
        teamMatchRewards: {},
        lineupHistory,
        rounds,
        matchSubmissionTimes: newSubmissionTimes,
        matchDetails: newMatchDetails
      });

      // Update Local State
      setPlayerRegistry(newRegistry);
      setProcessedMatchIds(newProcessedIds);
      setMatchResults(newMatchResults);
      setMatchSubmissionTimes(newSubmissionTimes);
      setMatchDetails(newMatchDetails);
      // setFantasyTeams() is explicitly OMITTED to keep leaderboard frozen.

    } catch (e) {
      console.error(e);
      alert("Failed to save score");
    } finally {
      setIsSaving(false);
    }

    setResolvingMatch(null);
    setManualPoints({});
    setManualPom("");
  };


  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950" />
      <RefreshCw className="animate-spin text-indigo-400 mb-6 relative z-10" size={64} />
      <p className="font-bold text-sm tracking-[0.3em] uppercase text-indigo-300 animate-pulse relative z-10">Syncing Tournament Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 relative selection:bg-indigo-500/30">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
      </div>

      {/* GLOBAL STATUS BAR */}
      <div className={`fixed top-0 left-0 right-0 h-1 z-50 transition-colors duration-500 ${isLineupLocked ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]'}`} />

      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-8 relative z-10">
        <div className="text-center md:text-left">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 italic tracking-tighter uppercase leading-[0.9] drop-shadow-2xl">
              IPL <span className="text-white drop-shadow-none">2026</span>
            </h1>
            <p className="text-xs font-bold text-slate-500 tracking-[0.4em] uppercase pl-1">Official Fantasy League</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6 justify-center md:justify-start">
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 border backdrop-blur-md transition-all ${isLineupLocked ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]'}`}>
              {isLineupLocked ? <Lock size={12} /> : <Unlock size={12} />}
              {isLineupLocked ? "Lineups Locked" : "Market Open"}
            </div>

            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 border backdrop-blur-md transition-all ${cloudStatus === 'connected' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
              <Activity size={12} />
              {cloudStatus === 'connected' ? "Live Sync" : "Reconnecting..."}
              {lastSynced && <span className="opacity-50 ml-1 font-mono">| {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
            </div>
          </div>
        </div>

        <nav className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl">
          {['leaderboard', 'matches', 'mvp'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${activeTab === tab ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {isAdmin && (
          <div className="flex items-center gap-4">
            <div className="bg-purple-900/20 border border-purple-500/20 px-4 py-2 rounded-2xl flex items-center gap-3 backdrop-blur-md">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex gap-2 items-center"><ShieldCheck size={14} /> Admin Mode</span>
              <div className="w-px h-4 bg-purple-500/20"></div>
              {!isLineupLocked ? (
                <button onClick={handleStartRound} className="text-[10px] font-black uppercase flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-all">
                  <Lock size={12} /> Start Round
                </button>
              ) : (
                <button onClick={handleEndRound} className="text-[10px] font-black uppercase flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-all">
                  <Unlock size={12} /> End Round
                </button>
              )}
              <div className="w-px h-4 bg-purple-500/20"></div>
              <button onClick={handleSeedDatabase} className="text-[10px] font-black uppercase flex items-center gap-2 text-indigo-400 hover:text-white transition-all">
                <RefreshCw size={12} /> Seed
              </button>
            </div>
            <button onClick={() => setIsAdmin(false)} className="p-3 bg-slate-800/80 hover:bg-rose-600/80 rounded-xl text-slate-400 hover:text-white transition-all backdrop-blur-md border border-white/5"><LogOut size={16} /></button>
          </div>
        )}
      </header >

      {/* --- MAIN CONTENT --- */}
      < main className="max-w-7xl mx-auto" >

        {/* VIEW 1: LEADERBOARD */}
        {
          activeTab === 'leaderboard' && (
            <div className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-md">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-[10px] font-black uppercase bg-black/20">
                    <th className="px-8 py-5">Rank</th>
                    <th className="px-8 py-5">Group</th>
                    <th className="px-8 py-5 text-right">Tentative </th>
                    <th className="px-8 py-5 text-right">Points</th>
                    <th className="px-8 py-5 text-center">My Team</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sortedTeams.map((team, index) => {
                    const isAuthorized = isAdmin || authorizedGroupIds.includes(team.id);
                    const canEdit = !isLineupLocked || isAdmin;

                    return (
                      <tr key={team.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6 font-black text-lg">#{index + 1}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <p className="font-black text-2xl text-white uppercase italic group-hover:text-blue-400 transition-colors">{team.name}</p>
                            {team.activeChip && (
                              <div className="flex items-center gap-1 bg-indigo-500/20 px-2 py-1 rounded-lg border border-indigo-500/30">
                                {team.activeChip === 'flexi' && <Medal size={12} className="text-yellow-400" />}
                                {team.activeChip === 'bat' && <Activity size={12} className="text-blue-400" />}
                                {team.activeChip === 'bowl' && <Zap size={12} className="text-purple-400" />}
                                {team.activeChip === 'pom' && <Star size={12} className="text-orange-400" />}
                                {team.activeChip === 'supersub' && <Users size={12} className="text-indigo-400" />}
                                {team.activeChip === 'vcv' && <TrendingUp size={12} className="text-teal-400" />}
                                {team.activeChip === 'double' && <ShieldCheck size={12} className="text-fuchsia-400" />}
                                {team.activeChip === 'prophecy' && <Target size={12} className="text-rose-400" />}
                                {team.activeChip === 'best11' && <Award size={12} className="text-amber-500" />}
                                <span className="text-[9px] font-black uppercase text-indigo-200 tracking-wider">
                                  {team.activeChip === 'pom' ? `POTM (${team.chipNomination})` : team.activeChip === 'supersub' ? `SUB (${team.chipNomination})` : team.activeChip === 'prophecy' ? `TARGET (${team.chipNomination})` : team.activeChip === 'vcv' ? 'VC Vanguard' : team.activeChip === 'double' ? 'Double Trouble' : team.activeChip === 'best11' ? 'Best 11' : team.activeChip}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-4 mt-2 text-[10px] text-slate-500 uppercase font-bold">
                            <span className="flex items-center gap-1"><Star size={10} className="text-yellow-500" /> {team.captainName || 'Not Set'}</span>
                            <span className="flex items-center gap-1"><Zap size={10} className="text-indigo-500" /> {team.viceCaptainName || 'Not Set'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right"><span className="text-xl font-bold font-mono text-slate-400">{calculateTentativeScore(team)}</span></td>
                        <td className="px-8 py-6 text-right"><span className="text-4xl font-black font-mono text-green-400">{team.points}</span></td>
                        <td className="px-8 py-6 text-center">
                          <button
                            onClick={() => {
                              if (canEdit && !isAuthorized) {
                                setGroupAuthPending({ team });
                              } else {
                                setEditingTeam(JSON.parse(JSON.stringify(team)));
                              }
                            }}
                            className={`px-6 py-3 rounded-xl transition-all shadow-lg text-white font-black text-[10px] uppercase flex items-center justify-center gap-2 mx-auto w-40 ${canEdit ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                          >
                            {canEdit ? (isAuthorized ? <><ListChecks size={16} /> Edit Lineup</> : <><Lock size={16} /> Unlock & Edit</>) : <><Eye size={16} /> View Team</>}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        }

        {/* VIEW 2: MATCHES */}
        {
          activeTab === 'matches' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MATCH_SCHEDULE.map(m => {
                const startTime = new Date(m.start);
                const endTime = new Date(startTime.getTime() + (MATCH_DURATION_HOURS * 60 * 60 * 1000));
                const isProcessed = processedMatchIds.includes(m.id);
                let status = systemTime > endTime ? "FINISHED" : systemTime >= startTime ? "LIVE" : "UPCOMING";

                return (
                  <div key={m.id} className={`p-6 rounded-[2rem] border transition-all hover:scale-[1.02] duration-300 group ${isProcessed
                    ? 'bg-emerald-500/5 border-emerald-500/20 opacity-75'
                    : 'bg-slate-900/40 border-white/5 shadow-2xl backdrop-blur-sm'
                    } ${status === 'LIVE' ? 'shadow-[0_0_30px_rgba(244,63,94,0.3)] border-rose-500/30' : ''}`}>

                    <div className="flex justify-between mb-6 items-start">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${status === 'LIVE' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                        : status === 'FINISHED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>{status}</span>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{startTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                        <p className="text-sm font-black text-white">{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-black uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-8 leading-[0.9]">{m.teams}</h3>

                    {status === 'FINISHED' ? (
                      isAdmin ? (
                        <button
                          onClick={() => setResolvingMatch(m)}
                          className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg ${isProcessed
                            ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20'
                            }`}
                        >
                          {isProcessed ? "Update Score" : "Input Score"}
                        </button>
                      ) : (
                        <button
                          onClick={() => setResolvingMatch(m)}
                          className={`w-full py-4 rounded-xl text-[10px] font-black text-center uppercase tracking-[0.2em] border flex items-center justify-center gap-2 transition-all ${isProcessed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' : 'bg-slate-800/50 border-white/5 text-slate-500 cursor-not-allowed'}`}
                        >
                          {isProcessed ? "View Scorecard" : <><Lock size={12} /> Pending</>}
                        </button>
                      )
                    ) : (
                      <div className="w-full py-4 bg-white/5 rounded-xl text-[10px] font-black text-center text-slate-500 uppercase tracking-[0.2em] border border-white/5 group-hover:bg-white/10 transition-colors">
                        {status === 'LIVE' ? <span className="text-rose-400 animate-pulse">Match Live</span> : "Scheduled"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        }

        {/* VIEW 3: MVP */}
        {
          activeTab === 'mvp' && (
            <div className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="p-8 border-b border-white/5 bg-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-black flex items-center gap-3 italic uppercase"><Medal className="text-orange-500" size={28} /> MVP Standings</h2>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Player Rankings</div>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="text"
                    placeholder="Search Player..."
                    value={mvpSearch}
                    onChange={(e) => setMvpSearch(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm font-bold text-white placeholder-slate-600 focus:border-blue-500 outline-none uppercase tracking-wider"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-500 text-[10px] font-black uppercase bg-black/20">
                      <th className="px-8 py-5">Rank</th>
                      <th className="px-8 py-5">Player</th>
                      <th className="px-8 py-5 text-center">Role</th>
                      <th className="px-8 py-5 text-center">Country</th>
                      <th className="px-8 py-5 text-center">Group</th>
                      <th className="px-8 py-5 text-center">Played</th>
                      <th className="px-8 py-5 text-right">Total Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {mvpList.map((player, index) => {
                      let rankStyle = "text-slate-500";
                      if (index === 0) rankStyle = "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]";
                      if (index === 1) rankStyle = "text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.5)]";
                      if (index === 2) rankStyle = "text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]";

                      return (
                        <tr key={player.name} className="hover:bg-white/[0.02] transition-colors group">
                          <td className={`px-8 py-6 font-black text-2xl ${rankStyle}`}>#{index + 1}</td>
                          <td className="px-8 py-6 font-bold text-white uppercase text-xl group-hover:text-blue-400 transition-colors">
                            {player.name} {player.isOverseas && <span className="text-sm" title="Overseas Player">✈️</span>}
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className="text-[9px] font-black uppercase px-3 py-1 rounded-lg bg-slate-800 text-slate-400 border border-white/5 group-hover:border-white/10">{player.role}</span>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-slate-300 transition-colors">{player.country}</span>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className={`text-[10px] font-black uppercase transition-colors px-2 py-1 rounded ${player.group !== '-' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-600'}`}>{player.group}</span>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className="text-xl font-black text-slate-400 group-hover:text-white transition-colors">{player.matchesPlayed}</span>
                          </td>
                          <td className="px-8 py-6 text-right font-mono text-3xl font-black text-white group-hover:scale-110 transition-transform origin-right leading-none tracking-tighter shadow-black">{player.points}</td>
                        </tr>
                      );
                    })}
                    {mvpList.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-8 py-12 text-center text-slate-500 italic">No points recorded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        }

      </main >

      {/* --- ADMIN LOGIN MODAL --- */}
      {
        showAdminLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-sm p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <button onClick={() => setShowAdminLogin(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
              </div>
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2">
                  <KeyRound size={32} />
                </div>
                <h3 className="text-xl font-black uppercase text-white">Admin Access</h3>
                <p className="text-xs text-slate-500 text-center">Enter security PIN to verify access.</p>
              </div>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-center text-white font-mono text-xl tracking-[0.5em] focus:border-blue-500 outline-none mb-4"
                placeholder="••••"
                autoFocus
              />
              {loginError && <p className="text-red-500 text-[10px] font-bold text-center mb-4 uppercase">Incorrect PIN</p>}
              <button onClick={handleAdminLogin} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase rounded-xl tracking-widest shadow-lg transition-all">
                Unlock System
              </button>
            </div>
          </div>
        )
      }

      {/* --- GROUP PIN MODAL --- */}
      {
        groupAuthPending && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
            <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-sm p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <button onClick={() => { setGroupAuthPending(null); setAdminPin(""); setLoginError(false); }} className="text-slate-500 hover:text-white"><X size={20} /></button>
              </div>
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-2">
                  <Lock size={32} />
                </div>
                <h3 className="text-xl font-black uppercase text-white">Unlock Group</h3>
                <p className="text-xs text-slate-500 text-center uppercase tracking-widest font-bold">
                  Group: <span className="text-indigo-400">{groupAuthPending.team.name}</span>
                </p>
                <p className="text-[10px] text-slate-600 text-center leading-relaxed">Enter the PIN assigned to this group to authorize edits on this device.</p>
              </div>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGroupLogin()}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-center text-white font-mono text-xl tracking-[0.5em] focus:border-indigo-500 outline-none mb-4"
                placeholder="••••"
                autoFocus
              />
              {loginError && <p className="text-red-500 text-[10px] font-bold text-center mb-4 uppercase">Incorrect Group PIN</p>}
              <button onClick={handleGroupLogin} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase rounded-xl tracking-widest shadow-lg transition-all flex items-center justify-center gap-2">
                <Unlock size={16} /> Authorize Edits
              </button>
            </div>
          </div>
        )
      }

      {/* --- MATCH SCORING MODAL --- */}
      {
        resolvingMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
            <div className="bg-[#0f1420] border border-white/10 rounded-[2.5rem] w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-900/20 to-purple-900/20 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black italic uppercase text-white">Score: {resolvingMatch.teams}</h3>
                  <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mt-1">{isAdmin ? "Admin Mode: Points are added to Team Totals" : "Read Only Mode: Match Points"}</p>
                </div>
                <button onClick={() => setResolvingMatch(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400"><X size={28} /></button>
              </div>
              
              <div className="px-8 pt-6 pb-2">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    placeholder="Search player to score..."
                    value={matchPlayerSearch}
                    onChange={(e) => setMatchPlayerSearch(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-white placeholder-slate-600 focus:border-blue-500 outline-none uppercase tracking-wider"
                  />
                </div>
              </div>

              <div className="flex-grow overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {resolvingMatch.countries.map(countryCode => (
                    <div key={countryCode}>
                      <div className="flex items-center gap-2 mb-4">
                        <Flag className="text-slate-500" size={16} />
                        <h4 className="text-lg font-black text-white uppercase">{countryCode} Squad</h4>
                      </div>
                      <div className="space-y-2">
                        {(Squads[countryCode] || [])
                          .filter(p => !matchPlayerSearch || p.name.toLowerCase().includes(matchPlayerSearch.toLowerCase()))
                          .map(p => (
                          <div key={p.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <div>
                              <p className="font-bold text-white text-sm">{p.name} {p.isOverseas && <span className="text-[10px]" title="Overseas Player">✈️</span>}</p>
                              <p className="text-[8px] text-slate-500 font-black uppercase">{p.role} • Hist: {playerRegistry[p.name]?.points || 0}</p>
                            </div>
                            <input
                              type="number"
                              disabled={!isAdmin}
                              onWheel={(e) => e.target.blur()}
                              className={`w-16 bg-black/40 border border-white/10 rounded-lg p-2 text-right text-white font-mono text-sm font-bold focus:border-blue-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${!isAdmin ? 'opacity-50 cursor-default' : ''}`}
                              placeholder="-"
                              value={manualPoints[p.name] || ""}
                              onChange={(e) => isAdmin && setManualPoints({ ...manualPoints, [p.name]: e.target.value })}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {isAdmin ? (
                <div className="p-8 border-t border-white/5 bg-slate-950/50">
                  <div className="mb-6">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Player of the Match</h4>
                    <select
                      value={manualPom}
                      onChange={(e) => setManualPom(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all uppercase"
                    >
                      <option value="">Select Player...</option>
                      {resolvingMatch.countries.flatMap(c => Squads[c] || []).map(p => (
                        <option key={p.name} value={p.name}>{p.name} ({p.role})</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={handleScoreSubmit} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all">Confirm & Add Points</button>
                </div>
              ) : (
                <div className="p-8 border-t border-white/5 bg-slate-950/50">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Player of the Match</h4>
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                    <Star size={20} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-lg font-black text-white uppercase">{matchDetails[resolvingMatch.id]?.pom || "None"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      }

      {/* --- EDIT LINEUP MODAL --- */}
      {
        editingTeam && (() => {
          // --- Validation Logic ---
          const xi = editingTeam.playingXINames;
          const roles = xi.map(n => getRole(n));
          const overseasCount = xi.filter(n => isOverseasPlayer(n)).length;
          const counts = {
            WK: roles.filter(r => r === 'WK').length,
            AR: roles.filter(r => r === 'AR').length,
            BAT: roles.filter(r => r === 'BAT').length,
            BOWL: roles.filter(r => r === 'BOWL').length,
          };
          const totalCounts = { WK: 0, AR: 0, BAT: 0, BOWL: 0 };
          editingTeam.players.forEach(p => {
            const r = getRole(p.name);
            if (totalCounts[r] !== undefined) totalCounts[r]++;
          });
          const errors = [];
          if (editingTeam.activeChip !== 'best11') {
            if (xi.length !== 11) errors.push(`Select 11 (${xi.length}/11)`);
            if (counts.WK < 1) errors.push("Min 1 WK");
            if (counts.AR < 1) errors.push("Min 1 AR");
            if (counts.BAT < 2) errors.push("Min 2 BAT");
            if (counts.BOWL < 2) errors.push("Min 2 BOWL");
            if (overseasCount > 4) errors.push(`Max 4 Overseas (${overseasCount}/4)`);
          }
          const isFlexiOrDoubleOrBest = editingTeam.activeChip === 'flexi' || editingTeam.activeChip === 'double' || editingTeam.activeChip === 'best11';
          if (!isFlexiOrDoubleOrBest && !editingTeam.captainName) errors.push("Select Captain");
          if (!isFlexiOrDoubleOrBest && !editingTeam.viceCaptainName) errors.push("Select VC");
          if (editingTeam.activeChip === 'prophecy' && (!editingTeam.chipNomination || isNaN(Number(editingTeam.chipNomination)))) errors.push("Enter Valid Target Score");
          const isValid = errors.length === 0;

          // --- Save Function ---
          const handleSave = async () => {
            if (!isValid) return;
            setIsSaving(true);
            const updatedTeams = fantasyTeams.map(t =>
              t.id === editingTeam.id ? editingTeam : t
            );
            setFantasyTeams(updatedTeams);
            setEditingTeam(null);
            try {
              await api.updateTeams(updatedTeams);
            } catch (e) {
              console.error(e);
              alert("Failed to save changes");
            } finally {
              setIsSaving(false);
            }
          };

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
              <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-slate-900 to-indigo-950">
                  <div>
                    <h3 className="text-2xl font-black italic uppercase text-white flex gap-3 items-center">
                      {isLineupLocked && !isAdmin ? <Eye size={24} className="text-blue-400" /> : <ListChecks size={24} className="text-blue-400" />}
                      {isLineupLocked && !isAdmin ? "View Playing 11" : "Edit Playing 11"}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                        {editingTeam.name}
                        {isLineupLocked && !isAdmin ? " - Read Only Mode" : " - Changes apply to NEXT match"}
                      </p>
                      {editingTeam.activeChip === 'flexi' && (
                        <span className="text-[10px] font-black uppercase text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">Flexi Cap Active: Auto-Assign C/VC</span>
                      )}
                      <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                        <p className="text-[10px] font-black uppercase text-blue-300 tracking-wider">
                          Total Team Points: <span className="text-white text-sm">{calculateTentativeScore(editingTeam)}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* SAVE BUTTON */}
                    {(!isLineupLocked || isAdmin) && (
                      <button
                        disabled={!isValid}
                        onClick={handleSave}
                        className="px-6 py-2 bg-white text-black rounded-lg text-xs font-black uppercase tracking-widest shadow-lg disabled:opacity-20 disabled:cursor-not-allowed hover:bg-indigo-50 transition-all flex items-center gap-2"
                      >
                        <Check size={14} /> Save
                      </button>
                    )}
                    <button onClick={() => setEditingTeam(null)} className="text-slate-400 hover:text-white p-2 bg-white/5 rounded-full"><X size={24} /></button>
                  </div>
                </div>

                <div className="flex-grow overflow-hidden flex flex-col md:flex-row">
                  <div className="w-full md:w-2/3 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(() => {
                        const assignedMatchIds = rounds.flatMap(r => r.matchIds);
                        const currentRoundMatchIds = processedMatchIds.filter(id => !assignedMatchIds.includes(id));

                        const currentRoundData = calculateRoundScore(currentRoundMatchIds, editingTeam, editingTeam.activeChip, editingTeam.chipNomination, editingTeam, matchResults, matchDetails, matchSubmissionTimes, playerRegistry);
                        const replacedPlayer = currentRoundData.replacedPlayer;

                        // Calculate Round Stats for each player for Chip Indicators
                        const playerRoundStats = {};
                        editingTeam.players.forEach(p => {
                          playerRoundStats[p.name] = { points: 0, maxSingle: 0, wonPom: false };
                          currentRoundMatchIds.forEach(mId => {
                            const pts = Number(matchResults[mId]?.[p.name] || 0);
                            playerRoundStats[p.name].points += pts;
                            if (pts > playerRoundStats[p.name].maxSingle) playerRoundStats[p.name].maxSingle = pts;
                            if (matchDetails[mId]?.pom === p.name) playerRoundStats[p.name].wonPom = true;
                          });
                        });

                        // Determine Flexi C/VC
                        let flexiC = null;
                        let flexiVC = null;
                        if (editingTeam.activeChip === 'flexi') {
                          const sorted = [...editingTeam.playingXINames]
                            .sort((a, b) => {
                              const diff = (playerRoundStats[b]?.points || 0) - (playerRoundStats[a]?.points || 0);
                              if (diff !== 0) return diff;
                              return (playerRegistry[b]?.points || 0) - (playerRegistry[a]?.points || 0);
                            });
                          if (sorted.length > 0) flexiC = sorted[0];
                          if (sorted.length > 1) flexiVC = sorted[1];
                        }

                        let best11Names = [];
                        if (editingTeam.activeChip === 'best11') {
                          const sortedSquad = [...editingTeam.players].sort((a, b) => {
                            const diff = (playerRoundStats[b.name]?.points || 0) - (playerRoundStats[a.name]?.points || 0);
                            if (diff !== 0) return diff;
                            return (playerRegistry[b.name]?.points || 0) - (playerRegistry[a.name]?.points || 0);
                          });
                          best11Names = sortedSquad.slice(0, 11).map(p => p.name);
                        }

                        return editingTeam.players.map((p, idx) => {

                          const isInXI = editingTeam.activeChip === 'best11' ? best11Names.includes(p.name) : editingTeam.playingXINames.includes(p.name);
                          const role = getRole(p.name);
                          const isCap = editingTeam.captainName === p.name;
                          const isVC = editingTeam.viceCaptainName === p.name;

                          const playerTeam = Object.keys(Squads).find(t =>
                            Squads[t].some(pl => pl.name === p.name)
                          ) || "UNK";

                          const playerPoints = playerRegistry[p.name]?.points || 0;
                          // const effectivePoints ... (used for display logic if needed, but not in current snippet)

                          // Calculate High/Low Score within this team based on CURRENT ROUND points
                          const teamRoundScores = editingTeam.players.map(tp => playerRoundStats[tp.name]?.points || 0);
                          const maxRoundScore = Math.max(...teamRoundScores);
                          const minRoundScore = Math.min(...teamRoundScores);

                          const currentRoundPoints = playerRoundStats[p.name]?.points || 0;
                          const isHighest = currentRoundPoints === maxRoundScore && maxRoundScore !== 0;
                          const isLowest = currentRoundPoints === minRoundScore && minRoundScore !== maxRoundScore;

                          return (
                            <div key={idx}
                              onClick={() => {
                                if (isLineupLocked && !isAdmin) return;
                                if (editingTeam.activeChip === 'best11') return;
                                const current = [...editingTeam.playingXINames];
                                if (isInXI) {
                                  const filtered = current.filter(n => n !== p.name);
                                  setEditingTeam({
                                    ...editingTeam,
                                    playingXINames: filtered,
                                    captainName: isCap ? "" : editingTeam.captainName,
                                    viceCaptainName: isVC ? "" : editingTeam.viceCaptainName
                                  });
                                } else {
                                  if (current.length < 11) {
                                    setEditingTeam({ ...editingTeam, playingXINames: [...current, p.name] });
                                  }
                                }
                              }}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center
                          ${isInXI ? 'bg-blue-600/10' : 'bg-white/5 opacity-60 hover:opacity-80'}
                          ${isHighest ? 'border-green-500 ring-1 ring-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' :
                                  isLowest ? 'border-red-500 ring-1 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' :
                                    isInXI ? 'border-blue-500/40 ring-1 ring-blue-500/20' : 'border-white/5'}
                        `}>

                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded flex items-center justify-center border ${isInXI ? 'bg-blue-500 border-blue-500' : 'border-slate-600'}`}>
                                  {isInXI && <Check size={12} className="text-white" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold text-white text-sm uppercase">{p.name} {isOverseasPlayer(p.name) && <span className="text-[10px]" title="Overseas Player">✈️</span>}</p>
                                    {isCap && editingTeam.activeChip !== 'double' && editingTeam.activeChip !== 'best11' && <span className="bg-yellow-500 text-black text-[8px] font-black px-1.5 rounded">C (2x)</span>}
                                    {isVC && editingTeam.activeChip !== 'double' && editingTeam.activeChip !== 'best11' && <span className="bg-indigo-500 text-white text-[8px] font-black px-1.5 rounded">VC (1.5x)</span>}

                                    {/* Chip Indicators */}
                                    {editingTeam.activeChip === 'flexi' && p.name === flexiC && (
                                      <span className="bg-amber-500 text-black text-[8px] font-black px-1.5 rounded flex items-center gap-1">
                                        <Medal size={8} /> FLEXI C (2x)
                                      </span>
                                    )}
                                    {editingTeam.activeChip === 'flexi' && p.name === flexiVC && (
                                      <span className="bg-slate-400 text-black text-[8px] font-black px-1.5 rounded flex items-center gap-1">
                                        <Medal size={8} /> FLEXI VC (1.5x)
                                      </span>
                                    )}
                                    {editingTeam.activeChip === 'best11' && p.name === best11Names[0] && (
                                      <span className="bg-amber-500 text-black text-[8px] font-black px-1.5 rounded flex items-center gap-1">
                                        <Award size={8} /> BEST C (2x)
                                      </span>
                                    )}
                                    {editingTeam.activeChip === 'best11' && p.name === best11Names[1] && (
                                      <span className="bg-slate-400 text-black text-[8px] font-black px-1.5 rounded flex items-center gap-1">
                                        <Award size={8} /> BEST VC (1.5x)
                                      </span>
                                    )}
                                    {editingTeam.activeChip === 'bat' && role === 'BAT' && playerRoundStats[p.name].maxSingle >= 100 && (
                                      <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 rounded flex items-center gap-1">
                                        <Activity size={8} /> BOOST (2x)
                                      </span>
                                    )}
                                    {editingTeam.activeChip === 'vcv' && isVC && (
                                      <span className="bg-teal-500 text-white text-[8px] font-black px-1.5 rounded flex items-center gap-1">
                                        <TrendingUp size={8} /> VCV BOOST
                                      </span>
                                    )}
                                    {editingTeam.activeChip === 'double' && isInXI && (
                                      <span className="bg-fuchsia-600 text-white text-[8px] font-black px-1.5 rounded flex items-center gap-1">
                                        <ShieldCheck size={8} /> DOUBLE (1.5x)
                                      </span>
                                    )}
                                    {editingTeam.activeChip === 'prophecy' && isInXI && (
                                      <span className="bg-rose-600 text-white text-[8px] font-black px-1.5 rounded flex items-center gap-1">
                                        <Target size={8} /> PROPHECY ACTIVE
                                      </span>
                                    )}
                                    {editingTeam.activeChip === 'bowl' && role === 'BOWL' && playerRoundStats[p.name].maxSingle >= 100 && (
                                      <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 rounded flex items-center gap-1">
                                        <Zap size={8} /> BOOST (2x)
                                      </span>
                                    )}
                                    {editingTeam.activeChip === 'pom' && editingTeam.chipNomination === p.name && playerRoundStats[p.name].wonPom && (
                                      <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 rounded flex items-center gap-1">
                                        <Star size={8} /> POM (3x)
                                      </span>
                                    )}
                                    {editingTeam.activeChip === 'supersub' && editingTeam.chipNomination === p.name && (
                                      <span className="bg-indigo-500 text-white text-[8px] font-black px-1.5 rounded flex items-center gap-1">
                                        <Users size={8} /> SUB NOMINEE
                                      </span>
                                    )}
                                    {editingTeam.activeChip === 'supersub' && p.name === replacedPlayer && (
                                      <span className="bg-red-500 text-white text-[8px] font-black px-1.5 rounded flex items-center gap-1">
                                        <Users size={8} /> WILL BE REPLACED
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-[8px] text-slate-400 font-black uppercase">
                                    <span>{role}</span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-white">{playerTeam}</span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-blue-400">
                                      Round: {playerRoundStats[p.name].points} | Total: {playerPoints}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {isInXI && (!isLineupLocked || isAdmin) && editingTeam.activeChip !== 'flexi' && editingTeam.activeChip !== 'double' && editingTeam.activeChip !== 'best11' && (
                                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                  <button onClick={() => setEditingTeam({ ...editingTeam, captainName: p.name, viceCaptainName: isVC ? "" : editingTeam.viceCaptainName })} className={`w-6 h-6 rounded text-[8px] font-black ${isCap ? 'bg-yellow-500 text-black' : 'bg-black/30 text-slate-500'}`}>C</button>
                                  <button onClick={() => setEditingTeam({ ...editingTeam, viceCaptainName: p.name, captainName: isCap ? "" : editingTeam.captainName })} className={`w-6 h-6 rounded text-[8px] font-black ${isVC ? 'bg-indigo-500 text-white' : 'bg-black/30 text-slate-500'}`}>VC</button>
                                </div>
                              )}
                            </div>
                          );
                        })
                      })()}
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 bg-black/40 border-l border-white/5 p-8 flex flex-col gap-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Power Chips</h4>
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {[
                          { id: 'flexi', label: 'Flexi Cap', icon: <Medal size={14} /> },
                          { id: 'bat', label: 'Bat Boost', icon: <Activity size={14} /> },
                          { id: 'bowl', label: 'Bowl Boost', icon: <Zap size={14} /> },
                          { id: 'pom', label: 'POTM Boost', icon: <Star size={14} /> },
                          { id: 'supersub', label: 'Super Sub', icon: <Users size={14} /> },
                          { id: 'vcv', label: 'VC Vanguard', icon: <TrendingUp size={14} /> },
                          { id: 'double', label: 'Double', icon: <ShieldCheck size={14} /> },
                          { id: 'prophecy', label: 'The Prophecy', icon: <Target size={14} /> },
                          { id: 'best11', label: 'Best 11', icon: <Award size={14} /> },
                          { id: 'converter', label: 'Converter', icon: <RefreshCw size={14} /> }
                        ].map(chip => {
                          const isUsed = editingTeam.chips[chip.id]?.used;
                          const isActive = editingTeam.activeChip === chip.id;

                          return (
                            <button
                              key={chip.id}
                              disabled={isUsed || (isLineupLocked && !isAdmin)}
                              onClick={() => {
                                if (isActive) {
                                  setEditingTeam({ ...editingTeam, activeChip: null, chipNomination: null });
                                } else {
                                  setEditingTeam({
                                    ...editingTeam,
                                    activeChip: chip.id,
                                    chipNomination: null,
                                    captainName: (chip.id === 'flexi' || chip.id === 'double' || chip.id === 'best11') ? "" : editingTeam.captainName,
                                    viceCaptainName: (chip.id === 'flexi' || chip.id === 'double' || chip.id === 'best11') ? "" : editingTeam.viceCaptainName
                                  });
                                }
                              }}
                              className={`p-3 rounded-xl border transition-all flex items-center justify-between group/chip ${isActive
                                ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
                                : isUsed
                                  ? 'bg-slate-800/50 text-slate-600 border-white/5 cursor-not-allowed'
                                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                              <div className="flex items-center gap-2">
                                {chip.icon}
                                <span className="text-[10px] font-black uppercase">{chip.label}</span>
                              </div>
                              {isUsed && <span className="text-[8px] font-black uppercase text-slate-600">Used</span>}
                              {isActive && <CheckCircle2 size={14} />}
                            </button>
                          );
                        })}
                      </div>

                      {(editingTeam.activeChip === 'pom' || editingTeam.activeChip === 'supersub' || editingTeam.activeChip === 'prophecy') && (
                        <div className="mb-6 animate-in slide-in-from-top-2 fade-in duration-300">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
                            {editingTeam.activeChip === 'supersub' ? 'Nominate Bench Player' : editingTeam.activeChip === 'prophecy' ? 'Target Score Prediction' : 'Nominate Player'}
                          </h4>
                          {editingTeam.activeChip === 'prophecy' ? (
                            <div className="space-y-2">
                              <input
                                type="number"
                                value={editingTeam.chipNomination || ""}
                                onChange={(e) => setEditingTeam({ ...editingTeam, chipNomination: e.target.value })}
                                disabled={isLineupLocked && !isAdmin}
                                placeholder="e.g. 450"
                                className="w-full bg-slate-800 border border-white/10 rounded-xl p-4 text-center text-xl font-black font-mono text-rose-400 outline-none focus:border-rose-500 transition-all"
                              />
                              <p className="text-[9px] text-slate-500 font-bold uppercase text-center focus:text-rose-400">Must land within ±50 points of base score</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <select
                                value={editingTeam.chipNomination || ""}
                                onChange={(e) => setEditingTeam({ ...editingTeam, chipNomination: e.target.value })}
                                disabled={isLineupLocked && !isAdmin}
                                className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all uppercase"
                              >
                                <option value="">Select a Player...</option>
                                {editingTeam.players
                                  .filter(p => editingTeam.activeChip === 'supersub' ? !editingTeam.playingXINames.includes(p.name) : true)
                                  .map(p => (
                                    <option key={p.name} value={p.name}>{p.name}</option>
                                  ))}
                              </select>
                              {editingTeam.activeChip === 'supersub' && isOverseasPlayer(editingTeam.chipNomination) && editingTeam.playingXINames.filter(n => isOverseasPlayer(n)).length === 4 && (
                                <p className="text-[9px] text-indigo-400 font-bold uppercase text-center">Overseas sub will only replace an overseas starter (max 4 overseas limit)</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 text-center border-y border-white/5 py-2">Verification</h4>

                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Roles Selected</h4>
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {['WK', 'BAT', 'AR', 'BOWL'].map(r => {
                          const min = (r === 'WK' || r === 'AR') ? 1 : 2;
                          const val = counts[r];
                          const total = totalCounts[r];
                          const ok = val >= min;
                          return (
                            <div key={r} className={`p-3 rounded-xl border ${ok ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black uppercase text-slate-400">{r}</span>
                                {ok ? <Check size={12} className="text-green-400" /> : <AlertCircle size={12} className="text-red-400" />}
                              </div>
                              <span className={`text-xl font-mono font-bold ${ok ? 'text-green-400' : 'text-red-400'}`}>{val}<span className="text-xs text-slate-500">/{total}</span></span>
                            </div>
                          )
                        })}
                      </div>

                      <div className="mb-6">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Team Balance</h4>
                        <div className="space-y-2">
                          {errors.map((e, i) => (
                            <div key={i} className="text-[10px] text-red-300 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20 flex gap-2 items-center"><X size={12} /> {e}</div>
                          ))}
                          {isValid && <div className="text-[10px] text-green-300 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20 flex gap-2 items-center"><Check size={12} /> Squad Valid</div>}
                        </div>
                      </div>

                      {/* Round History Breakdown */}
                      <div className="mt-4 pt-6 border-t border-white/10">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <History size={12} /> Round History
                        </h4>
                        <div className="space-y-2 pr-2">
                          {rounds.length === 0 ? (
                            <div className="text-[10px] text-slate-600 italic px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                              No completed rounds yet.
                            </div>
                          ) : (
                            rounds.map((round, rIdx) => {
                              const lineup = round.lineups[editingTeam.id];
                              if (!lineup) return null;

                              const roundResult = calculateRoundScore(
                                round.matchIds,
                                lineup,
                                lineup.activeChip,
                                lineup.chipNomination,
                                editingTeam,
                                matchResults,
                                matchDetails,
                                matchSubmissionTimes,
                                playerRegistry
                              );
                              const roundScore = roundResult.score;
                              const substitutedPlayer = roundResult.replacedPlayer;

                              const chipIcons = {
                                flexi: <Medal size={10} />,
                                bat: <Activity size={10} />,
                                bowl: <Zap size={10} />,
                                pom: <Star size={10} />,
                                converter: <RefreshCw size={10} />
                              };

                              return (
                                <div key={rIdx} className="bg-white/5 border border-white/5 rounded-xl p-3 flex justify-between items-center group/round hover:bg-white/10 transition-all">
                                  <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Round {rIdx + 1}</span>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      {lineup.activeChip ? (
                                        <>
                                          <span className="text-indigo-400">{chipIcons[lineup.activeChip]}</span>
                                          <span className="text-[10px] font-bold text-slate-300 uppercase">{lineup.activeChip}</span>
                                          {lineup.activeChip === 'supersub' && substitutedPlayer && (
                                            <span className="text-[8px] font-bold text-slate-400 uppercase italic ml-2">
                                              (Subbed: {substitutedPlayer})
                                            </span>
                                          )}
                                        </>
                                      ) : (
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Standard</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm font-mono font-black text-white">{roundScore}</span>
                                    <span className="text-[8px] font-black text-slate-500 uppercase block leading-none">Pts Earned</span>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>


                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      }

      {/* FLOATERS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        {!isAdmin && (
          <button onClick={() => setShowAdminLogin(true)} className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-400 hover:bg-indigo-600 hover:text-white border border-white/5 backdrop-blur-md shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 group">
            <ShieldCheck size={20} className="group-hover:rotate-12 transition-transform duration-500" />
          </button>
        )}
      </div>

      <Analytics />
    </div>
  );
}
