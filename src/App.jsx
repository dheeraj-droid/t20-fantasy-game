import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { api } from './api';
import {
  Trophy, Activity, Edit3, X, Save, RefreshCw, Star, ClipboardList,
  Medal, Calendar, Zap, CheckCircle2, AlertCircle, Clock, Lock, Unlock,
  Hash, Calculator, Users, ShieldCheck, ListChecks, Settings, Flag, Check, LogOut, KeyRound, Eye, Search, DatabaseBackup
} from 'lucide-react';
import { Analytics } from "@vercel/analytics/react"

// --- CONSTANTS ---
const INITIAL_SYSTEM_TIME = new Date();
const MATCH_DURATION_HOURS = 4;
const LOCAL_STORAGE_KEY_ROSTER = 'fantasy_roster_data';

// ---------------------------------------------------------
// DATABASE 1: NATIONAL SQUADS (Admin Scoring)
// ---------------------------------------------------------
const NATIONAL_SQUADS = {
  "IND": [
    { name: "Suryakumar Yadav", role: "BAT" }, { name: "Abhishek Sharma", role: "BAT" }, { name: "Tilak Varma", role: "BAT" },
    { name: "Sanju Samson", role: "WK" }, { name: "Shivam Dube", role: "AR" }, { name: "Ishan Kishan", role: "WK" },
    { name: "Hardik Pandya", role: "AR" }, { name: "Arshdeep Singh", role: "BOWL" }, { name: "Jasprit Bumrah", role: "BOWL" },
    { name: "Mohd Siraj", role: "BOWL" }, { name: "Varun Chakaravarthy", role: "BOWL" }, { name: "Kuldeep Yadav", role: "BOWL" },
    { name: "Axar Patel", role: "AR" }, { name: "Washington Sundar", role: "AR" }, { name: "Rinku Singh", role: "BAT" }
  ],
  "PAK": [
    { name: "Salman Agha", role: "AR" }, { name: "Abrar Ahmed", role: "BOWL" }, { name: "Babar Azam", role: "BAT" },
    { name: "Faheem Ashraf", role: "AR" }, { name: "Fakhar Zaman", role: "BAT" }, { name: "Khawaja Nafay", role: "BAT" },
    { name: "Mohammad Nawaz", role: "AR" }, { name: "Salman Mirza", role: "BOWL" }, { name: "Naseem Shah", role: "BOWL" },
    { name: "Sahibzada Farhan", role: "WK" }, { name: "Saim Ayub", role: "AR" }, { name: "Shaheen Afridi", role: "BOWL" },
    { name: "Shadab Khan", role: "AR" }, { name: "Usman Khan", role: "WK" }, { name: "Usman Tariq", role: "BOWL" }
  ],
  "AUS": [
    { name: "Mitchell Marsh", role: "AR" }, { name: "Xavier Bartlett", role: "BOWL" }, { name: "Cooper Connolly", role: "AR" },
    { name: "Tim David", role: "BAT" }, { name: "Ben Dwarshuis", role: "BOWL" }, { name: "Cameron Green", role: "AR" },
    { name: "Nathan Ellis", role: "BOWL" }, { name: "Josh Hazlewood", role: "BOWL" }, { name: "Travis Head", role: "BAT" },
    { name: "Josh Inglis", role: "WK" }, { name: "Matthew Kuhnemann", role: "BOWL" }, { name: "Glenn Maxwell", role: "AR" },
    { name: "Matt Renshaw", role: "BAT" }, { name: "Marcus Stoinis", role: "AR" }, { name: "Adam Zampa", role: "BOWL" }
  ],
  "SL": [
    { name: "Dasun Shanaka", role: "AR" }, { name: "Pathum Nissanka", role: "BAT" }, { name: "Kamil Mishara", role: "BAT" },
    { name: "Kusal Mendis", role: "WK" }, { name: "Kamindu Mendis", role: "AR" }, { name: "Kusal Janith Perera", role: "WK" },
    { name: "Charith Asalanka", role: "BAT" }, { name: "Janith Liyanage", role: "BAT" }, { name: "Pavan Rathnayake", role: "BAT" },
    { name: "Dushan Hemantha", role: "AR" }, { name: "Dunith Wellalage", role: "BOWL" }, { name: "Maheesh Theekshana", role: "BOWL" },
    { name: "Dushmantha Chameera", role: "BOWL" }, { name: "Matheesha Pathirana", role: "BOWL" }, { name: "Eshan Malinga", role: "BOWL" }
  ],
  "ENG": [
    { name: "Harry Brook", role: "BAT" }, { name: "Rehan Ahmed", role: "AR" }, { name: "Jofra Archer", role: "BOWL" },
    { name: "Tom Banton", role: "WK" }, { name: "Jacob Bethell", role: "AR" }, { name: "Jos Buttler", role: "WK" },
    { name: "Sam Curran", role: "AR" }, { name: "Liam Dawson", role: "AR" }, { name: "Ben Duckett", role: "BAT" },
    { name: "Will Jacks", role: "AR" }, { name: "Jamie Overton", role: "AR" }, { name: "Adil Rashid", role: "BOWL" },
    { name: "Philip Salt", role: "WK" }, { name: "Josh Tongue", role: "BOWL" }, { name: "Luke Wood", role: "BOWL" }
  ],
  "WI": [
    { name: "Shai Hope", role: "WK" }, { name: "Shimron Hetmyer", role: "BAT" }, { name: "Johnson Charles", role: "WK" },
    { name: "Roston Chase", role: "AR" }, { name: "Matthew Forde", role: "BOWL" }, { name: "Jason Holder", role: "AR" },
    { name: "Akeal Hosein", role: "BOWL" }, { name: "Shamar Joseph", role: "BOWL" }, { name: "Brandon King", role: "BAT" },
    { name: "Gudakesh Motie", role: "AR" }, { name: "Rovman Powell", role: "BAT" }, { name: "Sherfane Rutherford", role: "BAT" },
    { name: "Quentin Sampson", role: "AR" }, { name: "Jayden Seales", role: "BOWL" }, { name: "Romario Shepherd", role: "AR" }
  ],
  "SA": [
    { name: "Aiden Markram", role: "AR" }, { name: "Corbin Bosch", role: "AR" }, { name: "Dewald Brevis", role: "BAT" },
    { name: "Quinton de Kock", role: "WK" }, { name: "Marco Jansen", role: "AR" }, { name: "George Linde", role: "AR" },
    { name: "Keshav Maharaj", role: "BOWL" }, { name: "Kwena Maphaka", role: "BOWL" }, { name: "David Miller", role: "BAT" },
    { name: "Lungi Ngidi", role: "BOWL" }, { name: "Anrich Nortje", role: "BOWL" }, { name: "Kagiso Rabada", role: "BOWL" },
    { name: "Ryan Rickelton", role: "WK" }, { name: "Jason Smith", role: "BAT" }, { name: "Tristan Stubbs", role: "WK" }
  ],
  "NZ": [
    { name: "Mitchell Santner", role: "AR" }, { name: "Finn Allen", role: "BAT" }, { name: "Michael Bracewell", role: "AR" },
    { name: "Mark Chapman", role: "BAT" }, { name: "Devon Conway", role: "WK" }, { name: "Jacob Duffy", role: "BOWL" },
    { name: "Lockie Ferguson", role: "BOWL" }, { name: "Matt Henry", role: "BOWL" }, { name: "Kyle Jamieson", role: "BOWL" },
    { name: "Daryl Mitchell", role: "AR" }, { name: "James Neesham", role: "AR" }, { name: "Glenn Phillips", role: "AR" },
    { name: "Rachin Ravindra", role: "AR" }, { name: "Tim Seifert", role: "WK" }, { name: "Ish Sodhi", role: "BOWL" }
  ],
  "AFG": [
    { name: "Rashid Khan", role: "BOWL" }, { name: "Noor Ahmad", role: "BOWL" }, { name: "Abdullah Ahmadzai", role: "BOWL" },
    { name: "Sediqullah Atal", role: "BAT" }, { name: "Fazalhaq Farooqi", role: "BOWL" }, { name: "Rahmanullah Gurbaz", role: "WK" },
    { name: "Mohammad Ishaq", role: "WK" }, { name: "Shahidullah Kamal", role: "AR" }, { name: "Mohammad Nabi", role: "AR" },
    { name: "Gulbadin Naib", role: "AR" }, { name: "Azmatullah Omarzai", role: "AR" }, { name: "Mujeeb Ur Rahman", role: "BOWL" },
    { name: "Darwish Rasooli", role: "BAT" }, { name: "Ibrahim Zadran", role: "BAT" }, { name: "Naveen Ul Haq", role: "BOWL" }
  ],

};

// ---------------------------------------------------------
// DATABASE 2: FANTASY ROSTERS (User Teams)
// ---------------------------------------------------------
const FANTASY_ROSTERS = {
  "Group 1": ["Kamindu Mendis", "Kuldeep Yadav", "Johnson Charles", "Suryakumar Yadav", "Dushan Hemantha", "Keshav Maharaj", "Mark Chapman", "Rachin Ravindra", "Axar Patel", "Quinton de Kock", "Rinku Singh", "Azmatullah Omarzai", "Rahmanullah Gurbaz", "Jofra Archer", "Jasprit Bumrah", "Josh Inglis", "Cooper Connolly"],
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
  // const [user, setUser] = useState(null); // REMOVED

  const [fantasyTeams, setFantasyTeams] = useState([]);
  const [playerRegistry, setPlayerRegistry] = useState({});
  const [processedMatchIds, setProcessedMatchIds] = useState([]);
  const [matchResults, setMatchResults] = useState({}); // { matchId: { playerName: points } }
  const [teamMatchRewards, setTeamMatchRewards] = useState({}); // { matchId: { teamId: points } }

  // --- AUTH STATE ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLineupLocked, setIsLineupLocked] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [activeTab, setActiveTab] = useState('leaderboard');
  const [editingTeam, setEditingTeam] = useState(null);
  const [mvpSearch, setMvpSearch] = useState("");
  const [lineupHistory, setLineupHistory] = useState([]); // Array of { type: 'LOCK'|'UNLOCK', timestamp, lineups?}
  const [rounds, setRounds] = useState([]); // Array of { id, matchIds, lineups, timestamp }
  const [matchSubmissionTimes, setMatchSubmissionTimes] = useState({}); // { matchId: ISOString }
  const [resolvingMatch, setResolvingMatch] = useState(null);
  const [manualPoints, setManualPoints] = useState({});
  const [systemTime, setSystemTime] = useState(INITIAL_SYSTEM_TIME);
  const [loading, setLoading] = useState(true);

  /* 0. SYSTEM CLOCK */
  const [lastSynced, setLastSynced] = useState(null);
  const [cloudStatus, setCloudStatus] = useState("connecting"); // connecting, connected, disconnected, empty


  const initializeLocalData = () => {
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
  }, []);

  // Pre-fill Modal for Updates
  useEffect(() => {
    if (resolvingMatch && matchResults[resolvingMatch.id]) {
      setManualPoints(matchResults[resolvingMatch.id]);
    } else {
      setManualPoints({});
    }
  }, [resolvingMatch]);

  // --- AUTO-SAVE LOCAL BACKUP ---
  useEffect(() => {
    if (fantasyTeams.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY_ROSTER, JSON.stringify(fantasyTeams));
    }
  }, [fantasyTeams]);


  // --- MEMOIZED DATA ---
  const sortedTeams = useMemo(() => [...fantasyTeams].sort((a, b) => b.points - a.points), [fantasyTeams]);

  const mvpList = useMemo(() => {
    // 1. Get all players from National Squads to ensure everyone is listed
    const allPlayers = Object.values(NATIONAL_SQUADS).flat();

    // 2. Merge with registry data (points)
    return allPlayers.map(p => {
      const regData = playerRegistry[p.name] || { points: 0 };

      const country = Object.keys(NATIONAL_SQUADS).find(c =>
        NATIONAL_SQUADS[c].some(np => np.name === p.name)
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
        group
      };
    })
      .filter(p => p.name.toLowerCase().includes(mvpSearch.toLowerCase()))
      .sort((a, b) => b.points - a.points);
  }, [playerRegistry, mvpSearch, fantasyTeams, matchResults]);

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
    let newLineupHistory = [...lineupHistory];

    // Archive the event
    const event = {
      type: newState ? 'LOCK' : 'UNLOCK',
      timestamp: new Date().toISOString()
    };

    if (newState === true) {
      // LOCKING: Capture snapshot for the upcoming round
      event.lineups = {};
      fantasyTeams.forEach(team => {
        event.lineups[team.id] = {
          playingXINames: team.playingXINames,
          captainName: team.captainName,
          viceCaptainName: team.viceCaptainName
        };
      });
    } else {
      // UNLOCKING: End of a round -> Archive it as a specific "Round" object
      // 1. Find the last LOCK event to see when this round started
      const reversedHistory = [...lineupHistory].reverse();
      const lastLock = reversedHistory.find(e => e.type === 'LOCK');

      if (lastLock && lastLock.lineups) {
        const roundStart = new Date(lastLock.timestamp);
        const roundEnd = new Date();

        // 2. Find matches that STARTED in this window OR were FIRST SCORED in this window
        const matchesInRound = MATCH_SCHEDULE.filter(m => {
          const mStart = new Date(m.start);
          const startedInWindow = mStart >= roundStart && mStart <= roundEnd;

          const firstScoredTime = matchSubmissionTimes[m.id] ? new Date(matchSubmissionTimes[m.id]) : null;
          const scoredInWindow = firstScoredTime && firstScoredTime >= roundStart && firstScoredTime <= roundEnd;

          return startedInWindow || scoredInWindow;
        }).map(m => m.id);

        if (matchesInRound.length > 0) {
          const newRound = {
            id: `round_${Date.now()}`,
            timestamp: new Date().toISOString(),
            matchIds: matchesInRound,
            lineups: lastLock.lineups // The lineups that were locked for this period
          };

          const updatedRounds = [...rounds, newRound];
          setRounds(updatedRounds);

          // Update metadata with new rounds immediately
          await api.updateMetadata({
            isLineupLocked: newState,
            processedMatchIds,
            matchResults,
            teamMatchRewards,
            lineupHistory: [...newLineupHistory, event], // Include the unlock event
            rounds: updatedRounds,
            matchSubmissionTimes
          });
          setIsLineupLocked(newState);
          setLineupHistory([...newLineupHistory, event]);
          return; // Exit early since we did the safe update
        }
      }
    }

    newLineupHistory.push(event);


    try {
      await api.updateMetadata({
        isLineupLocked: newState,
        processedMatchIds,
        matchResults,
        teamMatchRewards,
        lineupHistory: newLineupHistory,
        rounds,
        matchSubmissionTimes
      });
      setIsLineupLocked(newState);
      setLineupHistory(newLineupHistory);
    } catch (e) { console.error(e); }
  };



  // --- SAFE SYNC ACTIONS ---

  const handleSeedDatabase = async () => {
    if (!window.confirm("WARNING: This will RESET the Cloud Database with initial rosters. Are you sure?")) return;

    try {
      setLoading(true);
      console.log("Starting Database Seed...");

      const teams = Object.keys(FANTASY_ROSTERS).map((groupName, i) => ({
        id: `g${i + 1}`,
        name: groupName,
        points: 0,
        captainName: "",
        viceCaptainName: "",
        playingXINames: [],
        players: FANTASY_ROSTERS[groupName].map(name => ({ name }))
      }));

      const metadata = {
        isLineupLocked: false,
        processedMatchIds: [],
        matchResults: {},
        teamMatchRewards: {},
        lineupHistory: [],
        rounds: [],
        matchSubmissionTimes: {}
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
    }
  };

  const handleScoreSubmit = async () => {
    if (!resolvingMatch) return;

    // 1. Merge and find the updated Match Results source of truth
    const existingMatchPoints = matchResults[resolvingMatch.id] || {};
    const mergedMatchPoints = { ...existingMatchPoints };
    Object.keys(manualPoints).forEach(pName => {
      const val = manualPoints[pName];
      if (val !== undefined && val !== null && val.toString().trim() !== "") {
        mergedMatchPoints[pName] = val;
      }
    });

    const newMatchResults = { ...matchResults, [resolvingMatch.id]: mergedMatchPoints };

    // Capture Submission Time if it's the first time
    const newSubmissionTimes = { ...matchSubmissionTimes };
    if (!newSubmissionTimes[resolvingMatch.id]) {
      newSubmissionTimes[resolvingMatch.id] = new Date().toISOString();
    }

    // 2. GLOBAL RECALCULATION: Re-derive EVERYTHING from the logs
    const newTeamRewards = {}; // matchId -> teamId -> points

    // Sort history once for lookup efficiency (Oldest to Newest)
    const sortedHistory = [...lineupHistory].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Iterate over every match that has ANY result recorded
    Object.keys(newMatchResults).forEach(mId => {
      const mPoints = newMatchResults[mId];
      const matchData = MATCH_SCHEDULE.find(m => m.id === Number(mId));
      if (!matchData) return;

      const mStartTime = new Date(matchData.start);

      // Find the historical lineup for this specific match
      let historicalSnapshot = null;
      for (const event of sortedHistory) {
        if (new Date(event.timestamp) > mStartTime) break;
        if (event.type === 'LOCK') historicalSnapshot = event;
        else if (event.type === 'UNLOCK') historicalSnapshot = null;
      }

      const existingMatchReward = teamMatchRewards[mId];
      newTeamRewards[mId] = {};

      fantasyTeams.forEach(team => {
        let playingXI, captain, viceCap;

        // NEW LOGIC: Explicit Round Lookup
        // 1. Is this match part of a completed Round?
        const explicitRound = rounds.find(r => r.matchIds.includes(Number(mId)));

        if (explicitRound) {
          const rData = explicitRound.lineups[team.id];
          if (rData) {
            playingXI = rData.playingXINames;
            captain = rData.captainName;
            viceCap = rData.viceCaptainName;
          }
        } else if (historicalSnapshot) {
          // 2. Fallback to Time-Window Snapshot (if round not yet archived/unlocked)
          const hData = historicalSnapshot.lineups[team.id];
          if (hData) {
            playingXI = hData.playingXINames;
            captain = hData.captainName;
            viceCap = hData.viceCaptainName;
          }
        }

        // 2. PRESERVATION CASE: No snapshot found (e.g., match before first archive), 
        // but we have a result. Reuse it UNLESS it's the match we are currently resolving.
        if (!playingXI && existingMatchReward && existingMatchReward[team.id] !== undefined && mId !== String(resolvingMatch.id)) {
          newTeamRewards[mId][team.id] = existingMatchReward[team.id];
          return;
        }

        // 3. FALLBACK: New match or no snapshot/reward yet. Use current lineup.
        if (!playingXI) {
          playingXI = team.playingXINames;
          captain = team.captainName;
          viceCap = team.viceCaptainName;
        }

        let matchScore = 0;
        playingXI.forEach(pName => {
          const pPoints = Number(mPoints[pName] || 0);
          if (pPoints !== 0) {
            let mult = 1;
            if (pName === captain) mult = 2;
            else if (pName === viceCap) mult = 1.5;
            matchScore += (pPoints * mult);
          }
        });
        newTeamRewards[mId][team.id] = matchScore;
      });
    });

    // 3. Update Fantasy Teams with Total Accumulation
    const updatedFantasyTeams = fantasyTeams.map(team => {
      let totalPoints = 0;
      Object.keys(newTeamRewards).forEach(mId => {
        totalPoints += (newTeamRewards[mId][team.id] || 0);
      });
      return { ...team, points: totalPoints };
    });

    // 4. Update Player Registry (MVP)
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
      await api.updateRegistry(newRegistry);
      await api.updateTeams(updatedFantasyTeams);
      await api.updateMetadata({
        processedMatchIds: newProcessedIds,
        isLineupLocked,
        matchResults: newMatchResults,
        teamMatchRewards: newTeamRewards,
        lineupHistory,
        rounds,
        matchSubmissionTimes: newSubmissionTimes
      });

      setPlayerRegistry(newRegistry);
      setFantasyTeams(updatedFantasyTeams);
      setProcessedMatchIds(newProcessedIds);
      setMatchResults(newMatchResults);
      setTeamMatchRewards(newTeamRewards);
      setMatchSubmissionTimes(newSubmissionTimes);
    } catch (e) { console.error(e); alert("Failed to save score"); }

    setResolvingMatch(null);
    setManualPoints({});
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
              T20 WC <span className="text-white drop-shadow-none">2026</span>
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
              <button onClick={toggleLineupLock} className={`text-[10px] font-black uppercase flex items-center gap-2 hover:text-white transition-all ${isLineupLocked ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isLineupLocked ? "Unlock" : "Lock"}
              </button>
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
                            className={`px-6 py-3 rounded-xl transition-all shadow-lg text-white font-black text-[10px] uppercase flex items-center justify-center gap-2 mx-auto w-40 ${canEdit ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                          >
                            {canEdit ? <><ListChecks size={16} /> Edit Lineup</> : <><Eye size={16} /> View Team</>}
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
                          <td className="px-8 py-6 font-bold text-white uppercase text-xl group-hover:text-blue-400 transition-colors">{player.name}</td>
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
              {isAdmin && (
                <div className="p-8 border-t border-white/5 bg-slate-950/50">
                  <button onClick={handleScoreSubmit} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all">Confirm & Add Points</button>
                </div>
              )}
            </div>
          </div>
        )
      }

      {/* --- EDIT LINEUP MODAL --- */}
      {
        editingTeam && (
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
                    <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                      <p className="text-[10px] font-black uppercase text-blue-300 tracking-wider">
                        Squad Points: <span className="text-white text-sm">
                          {editingTeam.playingXINames.reduce((sum, n) => {
                            let pts = playerRegistry[n]?.points || 0;
                            if (n === editingTeam.captainName) pts *= 2;
                            else if (n === editingTeam.viceCaptainName) pts *= 1.5;
                            return sum + pts;
                          }, 0)}
                        </span>
                      </p>
                    </div>
                  </div>
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

                      const playerTeam = Object.keys(NATIONAL_SQUADS).find(t =>
                        NATIONAL_SQUADS[t].some(pl => pl.name === p.name)
                      ) || "UNK";

                      const playerPoints = playerRegistry[p.name]?.points || 0;
                      const effectivePoints = isCap ? playerPoints * 2 : (isVC ? playerPoints * 1.5 : playerPoints);

                      // Calculate High/Low Score within this team
                      const teamScores = editingTeam.players.map(tp => {
                        const pp = playerRegistry[tp.name]?.points || 0;
                        if (tp.name === editingTeam.captainName) return pp * 2;
                        if (tp.name === editingTeam.viceCaptainName) return pp * 1.5;
                        return pp;
                      });
                      const maxScore = Math.max(...teamScores);
                      const minScore = Math.min(...teamScores);

                      const isHighest = effectivePoints === maxScore && maxScore !== 0; // Don't highlight if everyone is 0
                      const isLowest = effectivePoints === minScore && minScore !== maxScore; // Only highlight if different from max

                      return (
                        <div key={idx}
                          onClick={() => {
                            if (isLineupLocked && !isAdmin) return;
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
                                <p className="font-bold text-white text-sm uppercase">{p.name}</p>
                                {isCap && <span className="bg-yellow-500 text-black text-[8px] font-black px-1.5 rounded">C (2x)</span>}
                                {isVC && <span className="bg-indigo-500 text-white text-[8px] font-black px-1.5 rounded">VC (1.5x)</span>}
                              </div>
                              <div className="flex items-center gap-2 text-[8px] text-slate-400 font-black uppercase">
                                <span>{role}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-white">{playerTeam}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-blue-400">
                                  {effectivePoints} pts
                                </span>
                              </div>
                            </div>
                          </div>
                          {isInXI && (!isLineupLocked || isAdmin) && (
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
                    const { isValid, errors, counts, totalCounts } = (() => {
                      const xi = editingTeam.playingXINames;

                      // Calculate counts for selected Playing XI
                      const roles = xi.map(n => getRole(n));
                      const c = {
                        WK: roles.filter(r => r === 'WK').length,
                        AR: roles.filter(r => r === 'AR').length,
                        BAT: roles.filter(r => r === 'BAT').length,
                        BOWL: roles.filter(r => r === 'BOWL').length,
                      };

                      // Calculate totals available in the squad
                      const totalC = { WK: 0, AR: 0, BAT: 0, BOWL: 0 };
                      editingTeam.players.forEach(p => {
                        const r = getRole(p.name);
                        if (totalC[r] !== undefined) totalC[r]++;
                      });

                      const errs = [];
                      if (xi.length !== 11) errs.push(`Select 11 (${xi.length}/11)`);
                      if (c.WK < 1) errs.push("Min 1 WK");
                      if (c.AR < 1) errs.push("Min 1 AR");
                      if (c.BAT < 2) errs.push("Min 2 BAT");
                      if (c.BOWL < 2) errs.push("Min 2 BOWL");
                      if (!editingTeam.captainName) errs.push("Select Captain");
                      if (!editingTeam.viceCaptainName) errs.push("Select VC");
                      return { isValid: errs.length === 0, errors: errs, counts: c, totalCounts: totalC };
                    })();

                    return (
                      <>
                        <div>
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Roles Selected</h4>
                          <div className="grid grid-cols-2 gap-2">
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

                        {(!isLineupLocked || isAdmin) && (
                          <button
                            disabled={!isValid}
                            onClick={async () => {
                              // Optimistic
                              const newTeams = fantasyTeams.map(t => t.id === editingTeam.id ? editingTeam : t);
                              setFantasyTeams(newTeams);

                              try {
                                await api.updateTeams(newTeams);
                              } catch (e) { console.error(e); }

                              setEditingTeam(null);
                            }}
                            className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest shadow-xl disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                          >
                            Save Lineup
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )
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
    </div >
  );
}
