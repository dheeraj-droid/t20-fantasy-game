import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore, doc, setDoc, collection, onSnapshot, updateDoc
} from 'firebase/firestore';
import {
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged
} from 'firebase/auth';
import {
  Trophy, Activity, Edit3, X, Save, RefreshCw, Star, ClipboardList,
  Medal, Calendar, Zap, CheckCircle2, AlertCircle, Clock, Lock, Unlock,
  Hash, Calculator, Users, ShieldCheck, ListChecks, Settings, Flag, Check, LogOut, KeyRound
} from 'lucide-react';
import { Analytics } from "@vercel/analytics/react"
const LOCAL_CONFIG = {
  apiKey: "AIzaSyCHxfdfQArKPjr7WW0B8bnv0zW8aAKU27w",
  authDomain: "rrrr-a9f95.firebaseapp.com",
  projectId: "rrrr-a9f95",
  storageBucket: "rrrr-a9f95.firebasestorage.app",
  messagingSenderId: "1061845664907",
  appId: "1:1061845664907:web:a035a069a98b783743808e",
  measurementId: "G-FWNSCFY023"
};
// const LOCAL_CONFIG = null; // Forces local mode unless ENV vars are set
let firebaseApp, auth, db, appId;
let firebaseAvailable = false;

try {
  const configSource = LOCAL_CONFIG || (typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null);
  if (configSource) {
    if (!getApps().length) firebaseApp = initializeApp(configSource);
    else firebaseApp = getApps()[0];
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
    firebaseAvailable = true;
  }
  appId = typeof __app_id !== 'undefined' ? __app_id : 't20-wc-2026-mvp-feature-v2';
} catch (e) {
  console.warn("Cloud features disabled. Running in local-only mode.");
  firebaseAvailable = false;
}

// --- CONSTANTS ---
// const INITIAL_SYSTEM_TIME = new Date("2026-02-20T19:02:00");
const INITIAL_SYSTEM_TIME = new Date();
const MATCH_DURATION_HOURS = 4;

// ---------------------------------------------------------
// DATABASE 1: NATIONAL SQUADS (Admin Scoring)
// ---------------------------------------------------------
const NATIONAL_SQUADS = {
  "IND": [
    { name: "Suryakumar Yadav", role: "BAT" }, { name: "Abhishek Sharma", role: "BAT" }, { name: "Tilak Varma", role: "BAT" },
    { name: "Sanju Samson", role: "WK" }, { name: "Shivam Dube", role: "AR" }, { name: "Ishan Kishan", role: "WK" },
    { name: "Hardik Pandya", role: "AR" }, { name: "Arshdeep Singh", role: "BOWL" }, { name: "Jasprit Bumrah", role: "BOWL" },
    { name: "Harshit Rana", role: "BOWL" }, { name: "Varun Chakaravarthy", role: "BOWL" }, { name: "Kuldeep Yadav", role: "BOWL" },
    { name: "Axar Patel", role: "AR" }, { name: "Washington Sundar", role: "AR" }, { name: "Rinku Singh", role: "BAT" }
  ],
  "PAK": [
    { name: "Salman Agha", role: "AR" }, { name: "Abrar Ahmed", role: "BOWL" }, { name: "Babar Azam", role: "BAT" },
    { name: "Faheem Ashraf", role: "AR" }, { name: "Fakhar Zaman", role: "BAT" }, { name: "Khawaja Nafay", role: "BAT" },
    { name: "Mohammad Nawaz", role: "AR" }, { name: "Mohammad Salman Mirza", role: "BOWL" }, { name: "Naseem Shah", role: "BOWL" },
    { name: "Sahibzada Farhan", role: "WK" }, { name: "Saim Ayub", role: "BAT" }, { name: "Shaheen Afridi", role: "BOWL" },
    { name: "Shadab Khan", role: "AR" }, { name: "Usman Khan", role: "WK" }, { name: "Usman Tariq", role: "BOWL" }
  ],
  "AUS": [
    { name: "Mitchell Marsh", role: "AR" }, { name: "Xavier Bartlett", role: "BOWL" }, { name: "Cooper Connolly", role: "AR" },
    { name: "Tim David", role: "BAT" }, { name: "Ben Dwarshuis", role: "BOWL" }, { name: "Cameron Green", role: "AR" },
    { name: "Nathan Ellis", role: "BOWL" }, { name: "Josh Hazlewood", role: "BOWL" }, { name: "Travis Head", role: "BAT" },
    { name: "Josh Inglis", role: "WK" }, { name: "Matthew Kuhnemann", role: "BOWL" }, { name: "Glenn Maxwell", role: "AR" },
    { name: "Matthew Renshaw", role: "BAT" }, { name: "Marcus Stoinis", role: "AR" }, { name: "Adam Zampa", role: "BOWL" }
  ],
  "SL": [
    { name: "Dasun Shanaka", role: "AR" }, { name: "Pathum Nissanka", role: "BAT" }, { name: "Kamil Mishara", role: "BAT" },
    { name: "Kusal Mendis", role: "WK" }, { name: "Kamindu Mendis", role: "AR" }, { name: "Kusal Janith Perera", role: "BAT" },
    { name: "Charith Asalanka", role: "BAT" }, { name: "Janith Liyanage", role: "AR" }, { name: "Pavan Rathnayake", role: "BAT" },
    { name: "Wanindu Hasaranga", role: "AR" }, { name: "Dunith Wellalage", role: "AR" }, { name: "Maheesh Theekshana", role: "BOWL" },
    { name: "Dushmantha Chameera", role: "BOWL" }, { name: "Matheesha Pathirana", role: "BOWL" }, { name: "Eshan Malinga", role: "BOWL" }
  ],
  "ENG": [
    { name: "Harry Brook", role: "BAT" }, { name: "Rehan Ahmed", role: "BOWL" }, { name: "Jofra Archer", role: "BOWL" },
    { name: "Tom Banton", role: "WK" }, { name: "Jacob Bethell", role: "BAT" }, { name: "Jos Buttler", role: "WK" },
    { name: "Sam Curran", role: "AR" }, { name: "Liam Dawson", role: "AR" }, { name: "Ben Duckett", role: "BAT" },
    { name: "Will Jacks", role: "BAT" }, { name: "Jamie Overton", role: "AR" }, { name: "Adil Rashid", role: "BOWL" },
    { name: "Philip Salt", role: "WK" }, { name: "Josh Tongue", role: "BOWL" }, { name: "Luke Wood", role: "BOWL" }
  ],
  "WI": [
    { name: "Shai Hope", role: "WK" }, { name: "Shimron Hetmyer", role: "BAT" }, { name: "Johnson Charles", role: "BAT" },
    { name: "Roston Chase", role: "AR" }, { name: "Matthew Forde", role: "BOWL" }, { name: "Jason Holder", role: "AR" },
    { name: "Akeal Hosein", role: "BOWL" }, { name: "Shamar Joseph", role: "BOWL" }, { name: "Brandon King", role: "BAT" },
    { name: "Gudakesh Motie", role: "BOWL" }, { name: "Rovman Powell", role: "BAT" }, { name: "Sherfane Rutherford", role: "BAT" },
    { name: "Quentin Sampson", role: "BAT" }, { name: "Jayden Seales", role: "BOWL" }, { name: "Romario Shepherd", role: "AR" }
  ],
  "SA": [
    { name: "Aiden Markram", role: "BAT" }, { name: "Corbin Bosch", role: "AR" }, { name: "Dewald Brevis", role: "BAT" },
    { name: "Quinton de Kock", role: "WK" }, { name: "Marco Jansen", role: "AR" }, { name: "George Linde", role: "AR" },
    { name: "Keshav Maharaj", role: "BOWL" }, { name: "Kwena Maphaka", role: "BOWL" }, { name: "David Miller", role: "BAT" },
    { name: "Lungi Ngidi", role: "BOWL" }, { name: "Anrich Nortje", role: "BOWL" }, { name: "Kagiso Rabada", role: "BOWL" },
    { name: "Ryan Rickelton", role: "WK" }, { name: "Jason Smith", role: "AR" }, { name: "Tristan Stubbs", role: "BAT" }
  ],
  "NZ": [
    { name: "Mitchell Santner", role: "AR" }, { name: "Finn Allen", role: "BAT" }, { name: "Michael Bracewell", role: "AR" },
    { name: "Mark Chapman", role: "BAT" }, { name: "Devon Conway", role: "WK" }, { name: "Jacob Duffy", role: "BOWL" },
    { name: "Lockie Ferguson", role: "BOWL" }, { name: "Matt Henry", role: "BOWL" }, { name: "Kyle Jamieson", role: "BOWL" },
    { name: "Daryl Mitchell", role: "AR" }, { name: "James Neesham", role: "AR" }, { name: "Glenn Phillips", role: "BAT" },
    { name: "Rachin Ravindra", role: "AR" }, { name: "Tim Seifert", role: "WK" }, { name: "Ish Sodhi", role: "BOWL" }
  ],
  "AFG": [
    { name: "Rashid Khan", role: "BOWL" }, { name: "Noor Ahmad", role: "BOWL" }, { name: "Abdullah Ahmadzai", role: "BOWL" },
    { name: "Sediqullah Atal", role: "BAT" }, { name: "Fazalhaq Farooqi", role: "BOWL" }, { name: "Rahmanullah Gurbaz", role: "WK" },
    { name: "Mohammad Ishaq Rahimi", role: "WK" }, { name: "Shahidullah Kamal", role: "BAT" }, { name: "Mohammad Nabi", role: "AR" },
    { name: "Gulbadin Naib", role: "AR" }, { name: "Azmatullah Omarzai", role: "AR" }, { name: "Mujeeb Ur Rahman", role: "BOWL" },
    { name: "Darwish Rasooli", role: "BAT" }, { name: "Ibrahim Zadran", role: "BAT" }, { name: "Zia Ur Rahman Sharifi", role: "BOWL" }
  ],
  "NED": [{ name: "Scott Edwards", role: "WK" }, { name: "Bas de Leede", role: "AR" }, { name: "Max O'Dowd", role: "BAT" }, { name: "Logan van Beek", role: "BOWL" }],
  "SCO": [{ name: "Richie Berrington", role: "BAT" }, { name: "George Munsey", role: "BAT" }, { name: "Mark Watt", role: "BOWL" }],
  "USA": [{ name: "Monank Patel", role: "WK" }, { name: "Aaron Jones", role: "BAT" }, { name: "Corey Anderson", role: "AR" }, { name: "Ali Khan", role: "BOWL" }]
};

// ---------------------------------------------------------
// DATABASE 2: FANTASY ROSTERS (User Teams)
// ---------------------------------------------------------
const FANTASY_ROSTERS = {
  "Group 1": ["Kamindu Mendis", "Kuldeep Yadav", "Johnson Charles", "Suryakumar Yadav", "Wanindu Hasaranga", "Keshav Maharaj", "Mark Chapman", "Rachin Ravindra", "Axar Patel", "Quinton de Kock", "Rinku Singh", "Azmatullah Omarzai", "Rahmanullah Gurbaz", "Jofra Archer", "Jasprit Bumrah", "Josh Inglis", "Cooper Connolly"],
  "Group 2": ["Harry Brook", "Mohammad Nawaz", "Sam Curran", "Dushmantha Chameera", "Naseem Shah", "George Linde", "Arshdeep Singh", "Ishan Kishan", "Tim Seifert", "Nathan Ellis", "Tilak Varma", "Ryan Rickelton", "Mitchell Santner", "Kyle Jamieson", "Ibrahim Zadran", "Saim Ayub", "Adil Rashid"],
  "Group 3": ["Mitchell Marsh", "Dewald Brevis", "Varun Chakaravarthy", "Travis Head", "Brandon King", "Abrar Ahmed", "Usman Tariq", "Akeal Hosein", "Jason Smith", "Ben Dwarshuis", "Glenn Phillips", "Matt Henry", "Jason Holder", "Jos Buttler", "Luke Wood", "Usman Khan", "Liam Dawson"],
  "Group 4": ["Matthew Kuhnemann", "Ben Duckett", "Tom Banton", "Adam Zampa", "Philip Salt", "Shadab Khan", "Lungi Ngidi", "Glenn Maxwell", "Marcus Stoinis", "David Miller", "Jacob Bethell", "Aiden Markram", "Romario Shepherd", "Gudakesh Motie", "Marco Jansen", "Noor Ahmad", "Dasun Shanaka"],
  "Group 5": ["Matheesha Pathirana", "Cameron Green", "Roston Chase", "Rashid Khan", "Salman Agha", "Ish Sodhi", "Michael Bracewell", "Sherfane Rutherford", "Shivam Dube", "Abhishek Sharma", "Pathum Nissanka", "Devon Conway", "Mohd Siraj", "Xavier Bartlett", "Jacob Duffy", "Corbin Bosch", "Shai Hope"],
  "Group 6": ["Hardik Pandya", "Kusal Mendis", "James Neesham", "Rovman Powell", "Lockie Ferguson", "Babar Azam", "Shaheen Afridi", "Daryl Mitchell", "Finn Allen", "Sediqullah Atal", "Tristan Stubbs", "Maheesh Theekshana", "Fakhar Zaman", "Will Jacks", "Jamie Overton", "Shimron Hetmyer", "Tim David"]
};

const MATCH_SCHEDULE = [
  { id: 1, teams: "Pakistan vs Netherlands", countries: ["PAK", "NED"], start: "2026-02-07T11:00:00" },
  { id: 2, teams: "West Indies vs Scotland", countries: ["WI", "SCO"], start: "2026-02-07T15:00:00" },
  { id: 3, teams: "India vs USA", countries: ["IND", "USA"], start: "2026-02-07T19:00:00" },
  { id: 4, teams: "New Zealand vs Afghanistan", countries: ["NZ", "AFG"], start: "2026-02-08T11:00:00" },
  { id: 5, teams: "England vs Nepal", countries: ["ENG", "NEP"], start: "2026-02-08T15:00:00" },
  { id: 6, teams: "Sri Lanka vs Ireland", countries: ["SL", "IRE"], start: "2026-02-08T19:00:00" },
  { id: 7, teams: "Scotland vs Italy", countries: ["SCO", "ITA"], start: "2026-02-09T11:00:00" },
  { id: 8, teams: "Zimbabwe vs Oman", countries: ["ZIM", "OMA"], start: "2026-02-09T15:00:00" },
  { id: 9, teams: "South Africa vs Canada", countries: ["SA", "CAN"], start: "2026-02-09T19:00:00" },
  { id: 10, teams: "Netherlands vs Namibia", countries: ["NED", "NAM"], start: "2026-02-10T11:00:00" },
  { id: 11, teams: "New Zealand vs UAE", countries: ["NZ", "UAE"], start: "2026-02-10T15:00:00" },
  { id: 12, teams: "Pakistan vs USA", countries: ["PAK", "USA"], start: "2026-02-10T19:00:00" },
  { id: 13, teams: "South Africa vs Afghanistan", countries: ["SA", "AFG"], start: "2026-02-11T11:00:00" },
  { id: 14, teams: "Australia vs Ireland", countries: ["AUS", "IRE"], start: "2026-02-11T15:00:00" },
  { id: 15, teams: "England vs West Indies", countries: ["ENG", "WI"], start: "2026-02-11T19:00:00" },
  { id: 16, teams: "Sri Lanka vs Oman", countries: ["SL", "OMA"], start: "2026-02-12T11:00:00" },
  { id: 17, teams: "Nepal vs Italy", countries: ["NEP", "ITA"], start: "2026-02-12T15:00:00" },
  { id: 18, teams: "India vs Namibia", countries: ["IND", "NAM"], start: "2026-02-12T19:00:00" },
  { id: 19, teams: "Australia vs Zimbabwe", countries: ["AUS", "ZIM"], start: "2026-02-13T11:00:00" },
  { id: 20, teams: "Canada vs UAE", countries: ["CAN", "UAE"], start: "2026-02-13T15:00:00" },
  { id: 21, teams: "USA vs Netherlands", countries: ["USA", "NED"], start: "2026-02-13T19:00:00" },
  { id: 22, teams: "Ireland vs Oman", countries: ["IRE", "OMA"], start: "2026-02-14T11:00:00" },
  { id: 23, teams: "England vs Scotland", countries: ["ENG", "SCO"], start: "2026-02-14T15:00:00" },
  { id: 24, teams: "New Zealand vs South Africa", countries: ["NZ", "SA"], start: "2026-02-14T19:00:00" },
  { id: 25, teams: "West Indies vs Nepal", countries: ["WI", "NEP"], start: "2026-02-15T11:00:00" },
  { id: 26, teams: "USA vs Namibia", countries: ["USA", "NAM"], start: "2026-02-15T15:00:00" },
  { id: 27, teams: "India vs Pakistan", countries: ["IND", "PAK"], start: "2026-02-15T19:00:00" },
  { id: 28, teams: "Afghanistan vs UAE", countries: ["AFG", "UAE"], start: "2026-02-16T11:00:00" },
  { id: 29, teams: "England vs Italy", countries: ["ENG", "ITA"], start: "2026-02-16T15:00:00" },
  { id: 30, teams: "Australia vs Sri Lanka", countries: ["AUS", "SL"], start: "2026-02-16T19:00:00" },
  { id: 31, teams: "New Zealand vs Canada", countries: ["NZ", "CAN"], start: "2026-02-17T11:00:00" },
  { id: 32, teams: "Ireland vs Zimbabwe", countries: ["IRE", "ZIM"], start: "2026-02-17T15:00:00" },
  { id: 33, teams: "Scotland vs Nepal", countries: ["SCO", "NEP"], start: "2026-02-17T19:00:00" },
  { id: 34, teams: "South Africa vs UAE", countries: ["SA", "UAE"], start: "2026-02-18T11:00:00" },
  { id: 35, teams: "Pakistan vs Namibia", countries: ["PAK", "NAM"], start: "2026-02-18T15:00:00" },
  { id: 36, teams: "India vs Netherlands", countries: ["IND", "NED"], start: "2026-02-18T19:00:00" },
  { id: 37, teams: "West Indies vs Italy", countries: ["WI", "ITA"], start: "2026-02-19T11:00:00" },
  { id: 38, teams: "Sri Lanka vs Zimbabwe", countries: ["SL", "ZIM"], start: "2026-02-19T15:00:00" },
  { id: 39, teams: "Afghanistan vs Canada", countries: ["AFG", "CAN"], start: "2026-02-19T19:00:00" },
  { id: 40, teams: "Australia vs Oman", countries: ["AUS", "OMA"], start: "2026-02-20T19:00:00" }
];

// Helper: Get Role
const getRole = (playerName) => {
  for (const country in NATIONAL_SQUADS) {
    const player = NATIONAL_SQUADS[country].find(p => p.name === playerName);
    if (player) return player.role;
  }
  return "AR";
};

export default function App() {
  const [user, setUser] = useState(null);
  const [fantasyTeams, setFantasyTeams] = useState([]);
  const [playerRegistry, setPlayerRegistry] = useState({});
  const [processedMatchIds, setProcessedMatchIds] = useState([]);

  // --- AUTH STATE ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLineupLocked, setIsLineupLocked] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [activeTab, setActiveTab] = useState('leaderboard');
  const [editingTeam, setEditingTeam] = useState(null);
  const [resolvingMatch, setResolvingMatch] = useState(null);
  const [manualPoints, setManualPoints] = useState({});
  const [systemTime, setSystemTime] = useState(INITIAL_SYSTEM_TIME);
  const [loading, setLoading] = useState(true);

  /* 0. SYSTEM CLOCK */
  const [lastSynced, setLastSynced] = useState(null);
  const [cloudStatus, setCloudStatus] = useState("connecting"); // connecting, connected, disconnected, empty
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Initialization (With Safety Timeout)
  useEffect(() => {
    // Safety timeout: If Firebase hangs, force local mode after 2.5s
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.warn("Firebase took too long. Switching to local mode.");
        setLoading(false);
        if (fantasyTeams.length === 0) initializeLocalData();
      }
    }, 2500);

    const initializeLocalData = () => {
      // Try loading from localStorage first
      const savedTeams = localStorage.getItem('fantasyTeams');
      const savedRegistry = localStorage.getItem('playerRegistry');
      const savedMatchIds = localStorage.getItem('processedMatchIds');
      const savedLock = localStorage.getItem('isLineupLocked');

      if (savedTeams && savedRegistry) {
        setFantasyTeams(JSON.parse(savedTeams));
        setPlayerRegistry(JSON.parse(savedRegistry));
        if (savedMatchIds) setProcessedMatchIds(JSON.parse(savedMatchIds));
        if (savedLock) setIsLineupLocked(JSON.parse(savedLock));
        return;
      }

      const initTeams = Object.keys(FANTASY_ROSTERS).map((groupName, i) => ({
        id: `g${i + 1}`,
        name: groupName,
        points: 0,
        captainName: "", // INITIALIZE EMPTY
        viceCaptainName: "", // INITIALIZE EMPTY
        playingXINames: [], // INITIALIZE EMPTY
        players: FANTASY_ROSTERS[groupName].map(name => ({ name }))
      }));
      setFantasyTeams(initTeams);
    };

    if (!firebaseAvailable) {
      initializeLocalData();
      setLoading(false);
      return () => clearTimeout(safetyTimer);
    }

    const initAuth = async () => {
      try {
        const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        if (token) await signInWithCustomToken(auth, token);
        else await signInAnonymously(auth);
      } catch (e) {
        console.error("Auth failed", e);
        initializeLocalData();
        setLoading(false);
      }
    };
    initAuth();

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        // If auth returns null user, we still want to show the app
        initializeLocalData();
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      clearTimeout(safetyTimer);
    };
  }, []);

  // 1.b Data Persistence (Local Mode)
  useEffect(() => {
    // DANGER: Do not save if still loading, or you will overwrite LS with empty defaults!
    if (loading) return;

    if (!firebaseAvailable || !user) {
      if (fantasyTeams.length > 0) localStorage.setItem('fantasyTeams', JSON.stringify(fantasyTeams));
      if (Object.keys(playerRegistry).length > 0) localStorage.setItem('playerRegistry', JSON.stringify(playerRegistry));
      localStorage.setItem('processedMatchIds', JSON.stringify(processedMatchIds));
      localStorage.setItem('isLineupLocked', JSON.stringify(isLineupLocked));
    }
  }, [fantasyTeams, playerRegistry, processedMatchIds, isLineupLocked, user, loading]);

  // 2. Data Sync (Only if User is Authenticated)
  useEffect(() => {
    if (!firebaseAvailable || !user) return;

    const unsubTeams = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'teams'), async (snap) => {
      setLastSynced(new Date());
      if (snap.empty) {
        setCloudStatus("empty");
        const savedTeams = localStorage.getItem('fantasyTeams');
        if (savedTeams) {
          setShowRestorePrompt(true); // ASK USER instead of auto-uploading
        } else {
          // New Device, Empty Cloud -> Waiting for Admin Seed
          setFantasyTeams([]);
        }
      } else {
        setCloudStatus("connected");
        setShowRestorePrompt(false);
        setFantasyTeams(snap.docs.map(d => d.data()));
      }
      setLoading(false);
    });

    const unsubReg = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'playerRegistry'), async (snap) => {
      if (!snap.empty) {
        const reg = {};
        snap.docs.forEach(d => reg[d.id] = d.data());
        setPlayerRegistry(reg);
      }
    });

    const unsubMeta = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'metadata', 'global'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setProcessedMatchIds(data.processedMatchIds || []);
        setIsLineupLocked(data.isLineupLocked || false);
      } else {
        // Should wait for restore or seed
        setProcessedMatchIds([]);
        setIsLineupLocked(false);
      }
    });

    return () => { unsubTeams(); unsubReg(); unsubMeta(); };
  }, [user]);

  // --- MEMOIZED DATA ---
  const sortedTeams = useMemo(() => [...fantasyTeams].sort((a, b) => b.points - a.points), [fantasyTeams]);

  const mvpList = useMemo(() => {
    return Object.entries(playerRegistry)
      .map(([name, data]) => ({
        name,
        points: data.points || 0,
        role: getRole(name)
      }))
      .filter(p => p.points > 0)
      .sort((a, b) => b.points - a.points);
  }, [playerRegistry]);

  // --- ACTIONS ---

  const handleAdminLogin = () => {
    if (adminPin === "0007") {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPin("");
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const toggleLineupLock = async () => {
    const newState = !isLineupLocked;
    if (firebaseAvailable && user) {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'metadata', 'global'), { isLineupLocked: newState });
    } else {
      setIsLineupLocked(newState);
    }
  };

  // --- SAFE SYNC ACTIONS ---
  const handleSeedDatabase = async () => {
    if (!firebaseAvailable) return;
    if (!window.confirm("WARNING: This will RESET the Cloud Database with initial rosters. Are you sure?")) return;

    setLoading(true);
    // 1. Seed Teams
    const batchTeams = Object.keys(FANTASY_ROSTERS).map((groupName, i) => ({
      id: `g${i + 1}`,
      name: groupName,
      points: 0,
      captainName: "",
      viceCaptainName: "",
      playingXINames: [],
      players: FANTASY_ROSTERS[groupName].map(name => ({ name }))
    }));
    const teamPromises = batchTeams.map(t => setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'teams', t.id), t));

    // 2. Seed Metadata
    const metaPromise = setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'metadata', 'global'), {
      isLineupLocked: false,
      processedMatchIds: []
    });

    await Promise.all([...teamPromises, metaPromise]);
    setLoading(false);
    alert("Database Seeded Successfully! All devices will sync now.");
  };

  const handleRestoreLocal = async () => {
    if (!firebaseAvailable) return;
    setLoading(true);
    const savedTeams = localStorage.getItem('fantasyTeams');
    const savedReg = localStorage.getItem('playerRegistry');
    const savedMatchIds = localStorage.getItem('processedMatchIds');
    const savedLock = localStorage.getItem('isLineupLocked');

    if (savedTeams) {
      const teams = JSON.parse(savedTeams);
      await Promise.all(teams.map(t => setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'teams', t.id), t)));
    }

    if (savedReg) {
      const reg = JSON.parse(savedReg);
      await Promise.all(Object.entries(reg).map(([k, v]) => setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'playerRegistry', k), v)));
    }

    const meta = {
      isLineupLocked: savedLock ? JSON.parse(savedLock) : false,
      processedMatchIds: savedMatchIds ? JSON.parse(savedMatchIds) : []
    };
    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'metadata', 'global'), meta);

    setLoading(false);
    setShowRestorePrompt(false);
    alert("Local Data Restored to Cloud!");
  };



  const handleScoreSubmit = async () => {
    if (!resolvingMatch) return;

    // 1. Calculate points earned IN THIS MATCH for all teams
    const updatedFantasyTeams = fantasyTeams.map(team => {
      let matchScore = 0;
      team.playingXINames.forEach(playerName => {
        const pointsScoredInMatch = Number(manualPoints[playerName] || 0);
        if (pointsScoredInMatch > 0) {
          let multiplier = 1;
          if (playerName === team.captainName) multiplier = 2;
          else if (playerName === team.viceCaptainName) multiplier = 1.5;
          matchScore += (pointsScoredInMatch * multiplier);
        }
      });
      // Accumulate points
      return { ...team, points: (team.points || 0) + Math.floor(matchScore) };
    });

    // 2. Update Registry
    const newRegistry = { ...playerRegistry };
    Object.keys(manualPoints).forEach(playerName => {
      const current = newRegistry[playerName] || { points: 0 };
      newRegistry[playerName] = { points: (current.points || 0) + Number(manualPoints[playerName]) };
    });

    const newProcessedIds = [...processedMatchIds, resolvingMatch.id];

    if (firebaseAvailable && user) {
      Object.keys(manualPoints).forEach(name => {
        setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'playerRegistry', name), newRegistry[name]);
      });
      updatedFantasyTeams.forEach(t => updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'teams', t.id), t));
      setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'metadata', 'global'), { processedMatchIds: newProcessedIds }, { merge: true });
    } else {
      setPlayerRegistry(newRegistry);
      setFantasyTeams(updatedFantasyTeams);
      setProcessedMatchIds(newProcessedIds);
    }
    setResolvingMatch(null);
    setManualPoints({});
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0b0f1a] flex flex-col items-center justify-center text-white">
      <RefreshCw className="animate-spin text-blue-500 mb-4" size={48} />
      <p className="font-black uppercase tracking-widest italic animate-pulse">Connecting to League...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 font-sans p-4 md:p-8">

      {/* GLOBAL STATUS BAR */}
      <div className={`fixed top-0 left-0 right-0 h-1.5 z-50 ${isLineupLocked ? 'bg-red-500' : 'bg-green-500'}`} />

      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-6 relative">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 italic tracking-tighter uppercase leading-none">Pro Fantasy</h1>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-2 border ${isLineupLocked ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
              {isLineupLocked ? <Lock size={12} /> : <Unlock size={12} />}
              {isLineupLocked ? "Lineups Locked" : "Market Open"}
            </div>
            {/* MODE INDICATOR */}
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-2 border ${firebaseAvailable ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
              <Activity size={12} />
              {firebaseAvailable ? (cloudStatus === 'connected' ? "Live Sync" : "Waiting for Cloud") : "Local Mode"}
              {lastSynced && <span className="text-[8px] opacity-60 ml-1">{lastSynced.toLocaleTimeString()}</span>}
            </div>
          </div>

          {showRestorePrompt && (
            <div className="mt-4 p-3 bg-blue-600/20 border border-blue-500/50 rounded-xl flex items-center gap-4 animate-pulse">
              <AlertCircle className="text-blue-400" size={20} />
              <div>
                <p className="text-xs font-bold text-white uppercase">Cloud is Empty, but Local Data Found!</p>
                <button onClick={handleRestoreLocal} className="mt-1 text-[10px] bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg text-white font-black uppercase">Restore to Cloud</button>
              </div>
            </div>
          )}

          <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/5 mt-4 w-fit">
            {['leaderboard', 'matches', 'mvp'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-slate-800 text-blue-400 shadow-lg' : 'text-slate-400 hover:text-white'}`}>{tab}</button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          {isAdmin ? (
            <div className="flex items-center gap-4">
              <div className="bg-purple-900/20 border border-purple-500/20 px-4 py-2 rounded-2xl flex items-center gap-3">
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex gap-2 items-center"><ShieldCheck size={14} /> Admin Mode Active</span>
                <div className="w-px h-4 bg-purple-500/20"></div>
                <button
                  onClick={toggleLineupLock}
                  className={`text-[10px] font-black uppercase flex items-center gap-2 hover:text-white transition-all ${isLineupLocked ? 'text-green-400' : 'text-red-400'}`}
                >
                  {isLineupLocked ? "Unlock Market" : "Lock Market"}
                </button>
                <div className="w-px h-4 bg-purple-500/20"></div>
                <button
                  onClick={handleSeedDatabase}
                  className="text-[10px] font-black uppercase flex items-center gap-2 text-blue-400 hover:text-white transition-all"
                >
                  <RefreshCw size={12} /> Seed DB
                </button>
              </div>
              <button onClick={() => setIsAdmin(false)} className="p-3 bg-slate-800 hover:bg-red-600 rounded-xl text-slate-400 hover:text-white transition-all"><LogOut size={16} /></button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdminLogin(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all text-[10px] font-black uppercase"
            >
              <Settings size={14} /> Admin Access
            </button>
          )}
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto">

        {/* VIEW 1: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-md">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-[10px] font-black uppercase bg-black/20">
                  <th className="px-8 py-5">Rank</th>
                  <th className="px-8 py-5">Group</th>
                  <th className="px-8 py-5 text-right">Points</th>
                  <th className="px-8 py-5 text-center">My Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedTeams.map((team, index) => {
                  // Logic: Users can only edit if UNLOCKED. Admins can ALWAYS edit.
                  const canEdit = !isLineupLocked || isAdmin;
                  return (
                    <tr key={team.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6 font-black text-lg">#{index + 1}</td>
                      <td className="px-8 py-6">
                        <p className="font-black text-2xl text-white uppercase italic group-hover:text-blue-400 transition-colors">{team.name}</p>
                        <div className="flex gap-4 mt-2 text-[10px] text-slate-500 uppercase font-bold">
                          <span className="flex items-center gap-1"><Star size={10} className="text-yellow-500" /> {team.captainName || 'Not Set'}</span>
                          <span className="flex items-center gap-1"><Zap size={10} className="text-indigo-500" /> {team.viceCaptainName || 'Not Set'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right"><span className="text-4xl font-black font-mono text-green-400">{team.points}</span></td>
                      <td className="px-8 py-6 text-center">
                        <button
                          onClick={() => setEditingTeam(JSON.parse(JSON.stringify(team)))}
                          disabled={!canEdit}
                          className={`px-6 py-3 rounded-xl transition-all shadow-lg text-white font-black text-[10px] uppercase flex items-center justify-center gap-2 mx-auto w-40 ${canEdit ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'}`}
                        >
                          {canEdit ? <><ListChecks size={16} /> Edit Lineup</> : <><Lock size={16} /> Locked</>}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW 2: MATCHES */}
        {activeTab === 'matches' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MATCH_SCHEDULE.map(m => {
              const startTime = new Date(m.start);
              const endTime = new Date(startTime.getTime() + (MATCH_DURATION_HOURS * 60 * 60 * 1000));
              const isProcessed = processedMatchIds.includes(m.id);
              let status = systemTime > endTime ? "FINISHED" : systemTime >= startTime ? "LIVE" : "UPCOMING";

              return (
                <div key={m.id} className={`p-6 rounded-[2rem] border transition-all ${isProcessed ? 'bg-green-500/5 border-green-500/20 opacity-60' : 'bg-slate-900/40 border-white/5 shadow-xl'}`}>
                  <div className="flex justify-between mb-4">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full ${status === 'LIVE' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 text-slate-500'}`}>{status}</span>
                    <p className="text-[10px] font-mono font-bold text-slate-500">{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <h3 className="text-xl font-black uppercase italic text-white mb-6">{m.teams}</h3>
                  {status === 'FINISHED' && !isProcessed ? (
                    isAdmin ? (
                      <button onClick={() => setResolvingMatch(m)} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Enter Points</button>
                    ) : (
                      <div className="w-full py-3 bg-slate-800 rounded-xl text-[10px] font-black text-center text-slate-500 uppercase tracking-widest border border-white/5 flex items-center justify-center gap-2"><Lock size={12} /> Admin Only</div>
                    )
                  ) : (
                    <div className="w-full py-3 bg-white/5 rounded-xl text-[10px] font-black text-center text-slate-600 uppercase tracking-widest border border-white/5">
                      {isProcessed ? "Points Synced" : "Match Locked"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 3: MVP */}
        {activeTab === 'mvp' && (
          <div className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black flex items-center gap-3 italic uppercase"><Medal className="text-orange-500" size={28} /> MVP Standings</h2>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Player Rankings</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-[10px] font-black uppercase bg-black/20">
                    <th className="px-8 py-5">Rank</th>
                    <th className="px-8 py-5">Player</th>
                    <th className="px-8 py-5 text-center">Role</th>
                    <th className="px-8 py-5 text-right">Total Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mvpList.map((player, index) => (
                    <tr key={player.name} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6 font-black text-lg text-slate-500">#{index + 1}</td>
                      <td className="px-8 py-6 font-bold text-white uppercase text-xl">{player.name}</td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-[9px] font-black uppercase px-3 py-1 rounded-lg bg-slate-800 text-slate-400 border border-white/5">{player.role}</span>
                      </td>
                      <td className="px-8 py-6 text-right font-mono text-3xl font-black text-orange-400">{player.points}</td>
                    </tr>
                  ))}
                  {mvpList.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-8 py-12 text-center text-slate-500 italic">No points recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* --- ADMIN LOGIN MODAL --- */}
      {showAdminLogin && (
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
      )}

      {/* --- MATCH SCORING MODAL --- */}
      {resolvingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
          <div className="bg-[#0f1420] border border-white/10 rounded-[2.5rem] w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-900/20 to-purple-900/20 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black italic uppercase text-white">Score: {resolvingMatch.teams}</h3>
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mt-1">Admin Mode: Points are added to Team Totals</p>
              </div>
              <button onClick={() => setResolvingMatch(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400"><X size={28} /></button>
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
                      {(NATIONAL_SQUADS[countryCode] || []).map(p => (
                        <div key={p.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                          <div>
                            <p className="font-bold text-white text-sm">{p.name}</p>
                            <p className="text-[8px] text-slate-500 font-black uppercase">{p.role} • Hist: {playerRegistry[p.name]?.points || 0}</p>
                          </div>
                          <input
                            type="number"
                            className="w-16 bg-black/40 border border-white/10 rounded-lg p-2 text-right text-white font-mono text-sm font-bold focus:border-blue-500 outline-none"
                            placeholder="-"
                            onChange={(e) => setManualPoints({ ...manualPoints, [p.name]: e.target.value })}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 border-t border-white/5 bg-slate-950/50">
              <button onClick={handleScoreSubmit} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all">Confirm & Add Points</button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT LINEUP MODAL --- */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-slate-900 to-indigo-950">
              <div>
                <h3 className="text-2xl font-black italic uppercase text-white flex gap-3 items-center"><ListChecks size={24} className="text-blue-400" /> Edit Playing 11</h3>
                <p className="text-xs text-slate-500 font-bold uppercase mt-1 tracking-widest">{editingTeam.name} - Changes apply to NEXT match</p>
              </div>
              <button onClick={() => setEditingTeam(null)} className="text-slate-400 hover:text-white p-2 bg-white/5 rounded-full"><X size={24} /></button>
            </div>

            <div className="flex-grow overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-2/3 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {editingTeam.players.map((p, idx) => {
                    const isInXI = editingTeam.playingXINames.includes(p.name);
                    const role = getRole(p.name);
                    const isCap = editingTeam.captainName === p.name;
                    const isVC = editingTeam.viceCaptainName === p.name;

                    return (
                      <div key={idx}
                        onClick={() => {
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
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${isInXI ? 'bg-blue-600/10 border-blue-500/40 ring-1 ring-blue-500/20' : 'bg-white/5 border-white/5 opacity-60 hover:opacity-80'}`}>

                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded flex items-center justify-center border ${isInXI ? 'bg-blue-500 border-blue-500' : 'border-slate-600'}`}>
                            {isInXI && <Check size={12} className="text-white" />}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm uppercase">{p.name}</p>
                            <p className="text-[8px] text-slate-400 font-black uppercase">{role}</p>
                          </div>
                        </div>
                        {isInXI && (
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setEditingTeam({ ...editingTeam, captainName: p.name, viceCaptainName: isVC ? "" : editingTeam.viceCaptainName })} className={`w-6 h-6 rounded text-[8px] font-black ${isCap ? 'bg-yellow-500 text-black' : 'bg-black/30 text-slate-500'}`}>C</button>
                            <button onClick={() => setEditingTeam({ ...editingTeam, viceCaptainName: p.name, captainName: isCap ? "" : editingTeam.captainName })} className={`w-6 h-6 rounded text-[8px] font-black ${isVC ? 'bg-indigo-500 text-white' : 'bg-black/30 text-slate-500'}`}>VC</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="w-full md:w-1/3 bg-black/40 border-l border-white/5 p-8 flex flex-col gap-6">
                {(() => {
                  const { isValid, errors, counts } = (() => {
                    const xi = editingTeam.playingXINames;
                    const roles = xi.map(n => getRole(n));
                    const c = {
                      WK: roles.filter(r => r === 'WK').length,
                      AR: roles.filter(r => r === 'AR').length,
                      BAT: roles.filter(r => r === 'BAT').length,
                      BOWL: roles.filter(r => r === 'BOWL').length,
                    };
                    const errs = [];
                    if (xi.length !== 11) errs.push(`Select 11 (${xi.length}/11)`);
                    if (c.WK < 1) errs.push("Min 1 WK");
                    if (c.AR < 1) errs.push("Min 1 AR");
                    if (c.BAT < 2) errs.push("Min 2 BAT");
                    if (c.BOWL < 2) errs.push("Min 2 BOWL");
                    if (!editingTeam.captainName) errs.push("Select Captain");
                    if (!editingTeam.viceCaptainName) errs.push("Select VC");
                    return { isValid: errs.length === 0, errors: errs, counts: c };
                  })();

                  return (
                    <>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Roles Selected</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {['WK', 'BAT', 'AR', 'BOWL'].map(r => {
                            const min = (r === 'WK' || r === 'AR') ? 1 : 2;
                            const val = counts[r];
                            const ok = val >= min;
                            return (
                              <div key={r} className={`p-3 rounded-xl border ${ok ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-black uppercase text-slate-400">{r}</span>
                                  {ok ? <Check size={12} className="text-green-400" /> : <AlertCircle size={12} className="text-red-400" />}
                                </div>
                                <span className={`text-xl font-mono font-bold ${ok ? 'text-green-400' : 'text-red-400'}`}>{val}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="flex-grow">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Validation</h4>
                        <div className="space-y-2">
                          {errors.map((e, i) => (
                            <div key={i} className="text-[10px] text-red-300 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20 flex gap-2 items-center"><X size={12} /> {e}</div>
                          ))}
                          {isValid && <div className="text-[10px] text-green-300 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20 flex gap-2 items-center"><Check size={12} /> Squad Valid</div>}
                        </div>
                      </div>

                      <button
                        disabled={!isValid}
                        onClick={async () => {
                          if (firebaseAvailable && user) {
                            await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'teams', editingTeam.id), editingTeam);
                          } else {
                            setFantasyTeams(prev => prev.map(t => t.id === editingTeam.id ? editingTeam : t));
                          }
                          setEditingTeam(null);
                        }}
                        className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest shadow-xl disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                      >
                        Save Lineup
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      <Analytics />
    </div>
  );
}
