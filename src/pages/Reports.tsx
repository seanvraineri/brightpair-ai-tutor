import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BarChart,
  BookOpen,
  Calendar,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Download,
  FileText,
  LineChart,
  PieChart,
  Printer,
  Search,
  Share,
  Share2,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, Filter, Minus } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { KpiTiles } from "@/components/reports/KpiTiles";
import { MasteryHeat } from "@/components/reports/MasteryHeat";
import { useLowMasteryAlert } from "@/hooks/useLowMasteryAlert";
import { useTutorReports } from "@/hooks/useTutorReports";
import { exportCsv, exportPdf } from "@/utils/export";
import { useReferralTracker } from "@/hooks/useReferralTracker";

// Mock data for reports
const studentProgressData = [
  {
    name: "Alex",
    score: 85,
    ageGroupAverage: 76,
    subject: "Mathematics",
    grade: "10th",
  },
  {
    name: "Jamie",
    score: 92,
    ageGroupAverage: 81,
    subject: "English",
    grade: "11th",
  },
  {
    name: "Taylor",
    score: 78,
    ageGroupAverage: 74,
    subject: "Science",
    grade: "9th",
  },
  {
    name: "Jordan",
    score: 90,
    ageGroupAverage: 83,
    subject: "Physics",
    grade: "12th",
  },
];

const weeklySessionsData = [
  { day: "Mon", hours: 2 },
  { day: "Tue", hours: 4 },
  { day: "Wed", hours: 3 },
  { day: "Thu", hours: 5 },
  { day: "Fri", hours: 4 },
  { day: "Sat", hours: 6 },
  { day: "Sun", hours: 1 },
];

const subjectDistributionData = [
  { name: "Mathematics", value: 35 },
  { name: "Science", value: 25 },
  { name: "English", value: 20 },
  { name: "History", value: 10 },
  { name: "Other", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// Add more detailed student data
const studentDetailedData = [
  {
    id: "s1",
    name: "Alex Smith",
    grade: "10th",
    subjects: ["Mathematics", "Physics"],
    initialAssessment: 72,
    currentScore: 85,
    improvement: 13,
    attendanceRate: 95,
    homeworkCompletion: 88,
    quizAverage: 84,
    lastSession: "2023-06-15",
    strengthAreas: ["Algebra", "Geometry"],
    improvementAreas: ["Calculus", "Statistics"],
    learningStyle: "Visual",
    engagementScore: 4.2,
  },
  {
    id: "s2",
    name: "Jamie Johnson",
    grade: "11th",
    subjects: ["English", "History"],
    initialAssessment: 68,
    currentScore: 92,
    improvement: 24,
    attendanceRate: 100,
    homeworkCompletion: 95,
    quizAverage: 90,
    lastSession: "2023-06-16",
    strengthAreas: ["Essay Writing", "Literary Analysis"],
    improvementAreas: ["Grammar", "Vocabulary"],
    learningStyle: "Reading/Writing",
    engagementScore: 4.8,
  },
  {
    id: "s3",
    name: "Taylor Brown",
    grade: "9th",
    subjects: ["Science", "Mathematics"],
    initialAssessment: 65,
    currentScore: 78,
    improvement: 13,
    attendanceRate: 85,
    homeworkCompletion: 75,
    quizAverage: 76,
    lastSession: "2023-06-14",
    strengthAreas: ["Biology", "Chemistry"],
    improvementAreas: ["Physics", "Algebra"],
    learningStyle: "Kinesthetic",
    engagementScore: 3.9,
  },
  {
    id: "s4",
    name: "Jordan Lee",
    grade: "12th",
    subjects: ["Physics", "Chemistry"],
    initialAssessment: 81,
    currentScore: 90,
    improvement: 9,
    attendanceRate: 92,
    homeworkCompletion: 90,
    quizAverage: 87,
    lastSession: "2023-06-16",
    strengthAreas: ["Mechanics", "Thermodynamics"],
    improvementAreas: ["Optics", "Electromagnetism"],
    learningStyle: "Auditory",
    engagementScore: 4.5,
  },
];

// Learning outcomes data
const learningOutcomesData = [
  { skill: "Critical Thinking", beforeScore: 65, afterScore: 82 },
  { skill: "Problem Solving", beforeScore: 70, afterScore: 88 },
  { skill: "Communication", beforeScore: 75, afterScore: 85 },
  { skill: "Research Skills", beforeScore: 60, afterScore: 78 },
  { skill: "Time Management", beforeScore: 50, afterScore: 72 },
];

// Add session analytics data
const sessionAnalyticsData = [
  {
    id: "sess1",
    date: "2023-06-16",
    student: "Alex Smith",
    subject: "Mathematics",
    duration: 60,
    topicsCovered: ["Algebra", "Equations", "Functions"],
    objectives: ["Master linear equations", "Understand function notation"],
    objectivesAchieved: 2,
    studentEngagement: 4,
    studentComprehension: 3,
    followupRequired: true,
    notes:
      "Alex showed good progress with linear equations but needs more practice with function notation.",
  },
  {
    id: "sess2",
    date: "2023-06-16",
    student: "Jamie Johnson",
    subject: "English",
    duration: 45,
    topicsCovered: ["Essay Structure", "Thesis Statements", "Citations"],
    objectives: [
      "Develop strong thesis statements",
      "Properly format citations",
    ],
    objectivesAchieved: 2,
    studentEngagement: 5,
    studentComprehension: 4,
    followupRequired: false,
    notes:
      "Jamie has shown excellent progress in developing strong thesis statements and properly formatting citations.",
  },
  {
    id: "sess3",
    date: "2023-06-15",
    student: "Taylor Brown",
    subject: "Science",
    duration: 60,
    topicsCovered: ["Cell Biology", "Organelles", "Cell Division"],
    objectives: ["Identify cell structures", "Understand mitosis vs meiosis"],
    objectivesAchieved: 1,
    studentEngagement: 3,
    studentComprehension: 2,
    followupRequired: true,
    notes:
      "Taylor struggles with distinguishing between mitosis and meiosis. Needs additional visual aids and practice.",
  },
  {
    id: "sess4",
    date: "2023-06-15",
    student: "Jordan Lee",
    subject: "Physics",
    duration: 75,
    topicsCovered: ["Kinematics", "Projectile Motion", "Vectors"],
    objectives: [
      "Solve projectile motion problems",
      "Calculate vector components",
    ],
    objectivesAchieved: 2,
    studentEngagement: 4,
    studentComprehension: 4,
    followupRequired: false,
    notes:
      "Jordan demonstrated strong understanding of vectors and projectile motion. Ready to move on to forces.",
  },
  {
    id: "sess5",
    date: "2023-06-14",
    student: "Alex Smith",
    subject: "Mathematics",
    duration: 60,
    topicsCovered: ["Geometry", "Triangles", "Pythagorean Theorem"],
    objectives: ["Apply Pythagorean theorem", "Solve triangle problems"],
    objectivesAchieved: 2,
    studentEngagement: 4,
    studentComprehension: 4,
    followupRequired: false,
    notes:
      "Alex has mastered the Pythagorean theorem and can confidently solve triangle problems.",
  },
];

// Hours by subject data
const hoursBySubjectData = [
  { subject: "Mathematics", hours: 12 },
  { subject: "English", hours: 8 },
  { subject: "Science", hours: 7 },
  { subject: "Physics", hours: 6 },
  { subject: "History", hours: 4 },
];

// Session effectiveness data
const sessionEffectivenessData = [
  { category: "High Engagement", value: 65 },
  { category: "Medium Engagement", value: 25 },
  { category: "Low Engagement", value: 10 },
];

// Assignment data
const assignmentsData = [
  {
    id: "a1",
    title: "Algebra Equations Worksheet",
    subject: "Mathematics",
    student: "Alex Smith",
    assignedDate: "2023-06-10",
    dueDate: "2023-06-12",
    submittedDate: "2023-06-12",
    status: "completed",
    score: 85,
    feedback:
      "Good work on solving equations. Keep practicing with the more complex examples.",
    topics: ["Algebra", "Equations", "Variables"],
    skillsAssessed: [
      { skill: "Equation Solving", score: 4 },
      { skill: "Variable Manipulation", score: 3 },
      { skill: "Problem Analysis", score: 4 },
    ],
  },
  {
    id: "a2",
    title: "Essay on American Literature",
    subject: "English",
    student: "Jamie Johnson",
    assignedDate: "2023-06-08",
    dueDate: "2023-06-15",
    submittedDate: "2023-06-14",
    status: "completed",
    score: 92,
    feedback:
      "Excellent analysis of the themes. Your writing style has improved significantly.",
    topics: ["Essay Writing", "Literary Analysis", "American Literature"],
    skillsAssessed: [
      { skill: "Thesis Development", score: 5 },
      { skill: "Evidence Usage", score: 4 },
      { skill: "Writing Structure", score: 5 },
    ],
  },
  {
    id: "a3",
    title: "Cell Biology Quiz",
    subject: "Science",
    student: "Taylor Brown",
    assignedDate: "2023-06-12",
    dueDate: "2023-06-14",
    submittedDate: "2023-06-14",
    status: "completed",
    score: 76,
    feedback:
      "You understood the basic concepts but struggled with cell division. Review mitosis and meiosis.",
    topics: ["Cell Biology", "Organelles", "Cell Division"],
    skillsAssessed: [
      { skill: "Biology Knowledge", score: 3 },
      { skill: "Scientific Terminology", score: 4 },
      { skill: "Conceptual Understanding", score: 3 },
    ],
  },
  {
    id: "a4",
    title: "Physics Problem Set",
    subject: "Physics",
    student: "Jordan Lee",
    assignedDate: "2023-06-11",
    dueDate: "2023-06-13",
    submittedDate: null,
    status: "overdue",
    score: null,
    feedback: null,
    topics: ["Kinematics", "Projectile Motion", "Vectors"],
    skillsAssessed: [],
  },
  {
    id: "a5",
    title: "Geometry Assessment",
    subject: "Mathematics",
    student: "Alex Smith",
    assignedDate: "2023-06-14",
    dueDate: "2023-06-17",
    submittedDate: null,
    status: "pending",
    score: null,
    feedback: null,
    topics: ["Geometry", "Triangles", "Pythagorean Theorem"],
    skillsAssessed: [],
  },
];

// Completion rate by subject
const completionRateBySubject = [
  { subject: "Mathematics", completionRate: 85 },
  { subject: "English", completionRate: 95 },
  { subject: "Science", completionRate: 78 },
  { subject: "Physics", completionRate: 70 },
  { subject: "History", completionRate: 88 },
];

// Assignment score distribution
const scoreDistribution = [
  { range: "90-100", count: 5 },
  { range: "80-89", count: 8 },
  { range: "70-79", count: 4 },
  { range: "60-69", count: 2 },
  { range: "Below 60", count: 1 },
];

// Add referral tracker data
const referralData = [
  {
    id: "r1",
    clientName: "Sophie Williams",
    referralDate: "2023-04-15",
    status: "active",
    plan: "Premium",
    planValue: 249,
    commission: 37.35,
    lastPayment: "2023-06-10",
    totalEarned: 74.70,
    subjects: ["Mathematics", "Science"],
  },
  {
    id: "r2",
    clientName: "Michael Chen",
    referralDate: "2023-05-03",
    status: "active",
    plan: "Standard",
    planValue: 149,
    commission: 22.35,
    lastPayment: "2023-06-08",
    totalEarned: 44.70,
    subjects: ["English", "History"],
  },
  {
    id: "r3",
    clientName: "Emma Rodriguez",
    referralDate: "2023-05-22",
    status: "active",
    plan: "Premium",
    planValue: 249,
    commission: 37.35,
    lastPayment: "2023-06-05",
    totalEarned: 37.35,
    subjects: ["Physics", "Chemistry"],
  },
  {
    id: "r4",
    clientName: "Noah Thompson",
    referralDate: "2023-03-12",
    status: "inactive",
    plan: "Standard",
    planValue: 149,
    commission: 22.35,
    lastPayment: "2023-05-10",
    totalEarned: 67.05,
    subjects: ["Computer Science"],
  },
  {
    id: "r5",
    clientName: "Olivia Parker",
    referralDate: "2023-06-01",
    status: "pending",
    plan: "Basic",
    planValue: 99,
    commission: 14.85,
    lastPayment: null,
    totalEarned: 0,
    subjects: ["Mathematics"],
  },
];

// Monthly commission data
const monthlyCommissionData = [
  { month: "Jan", commission: 45.00 },
  { month: "Feb", commission: 67.50 },
  { month: "Mar", commission: 89.70 },
  { month: "Apr", commission: 112.05 },
  { month: "May", commission: 134.40 },
  { month: "Jun", commission: 171.75 },
];

// Referral status distribution
const referralStatusData = [
  { status: "Active", count: 3 },
  { status: "Inactive", count: 1 },
  { status: "Pending", count: 1 },
];

const Reports: React.FC = () => {
  const userId = "current-user-id"; // This should come from your auth context
  const { data: reportData, isLoading } = useTutorReports(userId);

  // Mock mastery matrix data - this would come from backend
  const masteryMatrix = [
    [0.2, 0.5, 0.8, 0.3],
    [0.4, 0.6, 0.7, 0.5],
    [0.9, 0.2, 0.5, 0.7],
    [0.3, 0.8, 0.4, 0.6],
  ];
  const studentNames = ["Alex", "Jamie", "Taylor", "Jordan"];

  // Set up low mastery alerts for active students
  useLowMasteryAlert("student-id-1"); // In production, loop through active students

  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("month");

  // Quick stats data
  const quickStats = {
    studentProgress: {
      value: "+12%",
      trend: "up",
      description: "Average student improvement",
    },
    sessionHours: {
      value: "28h",
      trend: "up",
      description: "Total tutoring hours",
    },
    completionRate: {
      value: "85%",
      trend: "down",
      description: "Assignment completion rate",
    },
    activeStudents: {
      value: "10",
      trend: "up",
      description: "Students with activity this week",
    },
  };

  // Add new state variables for student progress tab
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState({
    academicProgress: true,
    attendance: true,
    homeworkCompletion: true,
    quizScores: true,
    learningOutcomes: true,
  });
  const [timeComparisonRange, setTimeComparisonRange] = useState("3months");

  // Add state for session analytics
  const [sessionsDateRange, setSessionsDateRange] = useState("week");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  // Add assignment state
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(
    null,
  );
  const [assignmentFilter, setAssignmentFilter] = useState("all");

  // Add state for referrals tab
  const [referralTimeRange, setReferralTimeRange] = useState("all");
  const [selectedReferral, setSelectedReferral] = useState<string | null>(null);

  // Initialize referral tracker hook
  const {
    metrics: hookReferralMetrics,
    toggleReferralSelection,
    handleTimeRangeChange,
    generateReferralLink,
    filteredReferrals,
  } = useReferralTracker(referralData);

  // Helper function to render trend indicator
  const renderTrendIndicator = (value: number) => {
    if (value > 0) {
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    } else if (value < 0) {
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  // Helper function to get student by ID
  const getStudentById = (id: string) => {
    return studentDetailedData.find((student) => student.id === id);
  };

  // Helper function to get session by ID
  const getSessionById = (id: string) => {
    return sessionAnalyticsData.find((session) => session.id === id);
  };

  // Helper function to get assignment by ID
  const getAssignmentById = (id: string) => {
    return assignmentsData.find((assignment) => assignment.id === id);
  };

  // Calculate session metrics
  const calculateSessionMetrics = () => {
    const totalSessions = sessionAnalyticsData.length;
    const totalHours =
      sessionAnalyticsData.reduce((acc, session) => acc + session.duration, 0) /
      60;
    const averageDuration = totalHours / totalSessions;
    const objectivesAchieved = sessionAnalyticsData.reduce(
      (acc, session) => acc + session.objectivesAchieved,
      0,
    );
    const totalObjectives = sessionAnalyticsData.reduce(
      (acc, session) => acc + session.objectives.length,
      0,
    );
    const objectivesAchievedRate = Math.round(
      (objectivesAchieved / totalObjectives) * 100,
    );

    const averageEngagement = sessionAnalyticsData.reduce(
      (acc, session) => acc + session.studentEngagement,
      0,
    ) / totalSessions;
    const averageComprehension = sessionAnalyticsData.reduce(
      (acc, session) => acc + session.studentComprehension,
      0,
    ) / totalSessions;

    return {
      totalSessions,
      totalHours: totalHours.toFixed(1),
      averageDuration: averageDuration.toFixed(1),
      objectivesAchievedRate,
      averageEngagement: averageEngagement.toFixed(1),
      averageComprehension: averageComprehension.toFixed(1),
    };
  };

  const sessionMetrics = calculateSessionMetrics();

  // Calculate assignment metrics
  const calculateAssignmentMetrics = () => {
    const total = assignmentsData.length;
    const completed =
      assignmentsData.filter((a) => a.status === "completed").length;
    const completionRate = Math.round((completed / total) * 100);

    const scores = assignmentsData.filter((a) => a.score !== null).map((a) =>
      a.score as number
    );
    const averageScore = scores.length > 0
      ? Math.round(
        scores.reduce((acc, score) => acc + score, 0) / scores.length,
      )
      : 0;

    const onTimeSubmissions =
      assignmentsData.filter((a) =>
        a.submittedDate && a.dueDate &&
        new Date(a.submittedDate) <= new Date(a.dueDate)
      ).length;
    const onTimeRate = Math.round((onTimeSubmissions / total) * 100);

    return {
      total,
      completed,
      completionRate,
      averageScore,
      onTimeRate,
    };
  };

  const assignmentMetrics = calculateAssignmentMetrics();

  // Calculate referral metrics
  const calculateReferralMetrics = () => {
    const totalReferrals = referralData.length;
    const activeReferrals =
      referralData.filter((r) => r.status === "active").length;
    const activeRate = Math.round((activeReferrals / totalReferrals) * 100);

    const totalCommission = referralData.reduce(
      (acc, referral) => acc + referral.totalEarned,
      0,
    );
    const monthlyCommission =
      monthlyCommissionData[monthlyCommissionData.length - 1].commission;

    const pendingReferrals =
      referralData.filter((r) => r.status === "pending").length;

    return {
      totalReferrals,
      activeReferrals,
      activeRate,
      totalCommission: totalCommission.toFixed(2),
      monthlyCommission: monthlyCommission.toFixed(2),
      pendingReferrals,
    };
  };

  const referralMetrics = calculateReferralMetrics();

  return (
    <div className="p-6 md:p-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
            <p className="text-gray-600">
              Monitor student progress and teaching effectiveness
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                const validData = reportData && !("error" in reportData)
                  ? reportData
                  : {
                    active_students: undefined,
                    hours: undefined,
                    avg_score: undefined,
                    low_mastery: undefined,
                  };
                exportPdf(validData);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const validData = reportData && !("error" in reportData)
                  ? reportData
                  : null;
                exportCsv([
                  [
                    "Active Students",
                    validData?.active_students?.toString() || "N/A",
                  ],
                  [
                    "Hours",
                    validData?.hours
                      ? Math.round(validData.hours / 3600).toString()
                      : "N/A",
                  ],
                  [
                    "Avg Score",
                    validData?.avg_score
                      ? Math.round(validData.avg_score).toString()
                      : "N/A",
                  ],
                ]);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>

        {/* Add KPI Tiles from API Data */}
        {reportData && !("error" in reportData) && (
          <KpiTiles data={reportData} />
        )}

        {/* Heat map - moved to its own section with proper width constraints */}
        <div className="my-6">
          <div className="max-w-full">
            <MasteryHeat matrix={masteryMatrix} labels={studentNames} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="student-progress">Student Progress</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-primary" />
                    Student Score vs. Age Group Average
                  </CardTitle>
                  <CardDescription>
                    How each student performs compared to their age group in the
                    same subject
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={studentProgressData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={75} />
                        <Tooltip
                          formatter={(value, name) => [
                            `${value}%`,
                            name === "score"
                              ? "Student Score"
                              : "Age Group Average",
                          ]}
                          labelFormatter={(name) => {
                            const student = studentProgressData.find((s) =>
                              s.name === name
                            );
                            return `${student?.subject} (${student?.grade})`;
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="score"
                          name="Student Score"
                          fill="#4D8BF9"
                        />
                        <Bar
                          dataKey="ageGroupAverage"
                          name="Age Group Average"
                          fill="#82ca9d"
                        />
                        <ReferenceLine
                          x={75}
                          stroke="#ff7300"
                          label="Minimum Target"
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    Weekly Sessions
                  </CardTitle>
                  <CardDescription>
                    Distribution of tutoring hours this week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={weeklySessionsData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="hours"
                          name="Hours"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Subject Distribution
                  </CardTitle>
                  <CardDescription>
                    Breakdown of tutoring hours by subject
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={subjectDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {subjectDistributionData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest events and student interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-2 border-blue-500 pl-4 pb-4">
                      <p className="text-sm text-gray-500">Today, 11:30 AM</p>
                      <p className="font-medium">Session with Alex Smith</p>
                      <p className="text-sm">Mathematics - Algebra Practice</p>
                    </div>

                    <div className="border-l-2 border-green-500 pl-4 pb-4">
                      <p className="text-sm text-gray-500">Today, 9:15 AM</p>
                      <p className="font-medium">
                        Jamie Johnson submitted homework
                      </p>
                      <p className="text-sm">English - Essay Analysis</p>
                    </div>

                    <div className="border-l-2 border-orange-500 pl-4 pb-4">
                      <p className="text-sm text-gray-500">
                        Yesterday, 4:00 PM
                      </p>
                      <p className="font-medium">
                        New student assigned: Jordan Lee
                      </p>
                      <p className="text-sm">Chemistry, Physics</p>
                    </div>

                    <div className="border-l-2 border-purple-500 pl-4">
                      <p className="text-sm text-gray-500">
                        Yesterday, 2:30 PM
                      </p>
                      <p className="font-medium">Taylor Brown completed quiz</p>
                      <p className="text-sm">Computer Science - 92% score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="student-progress">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Student Selection</CardTitle>
                  <CardDescription>
                    Select a student to view detailed progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search students..."
                        className="pl-8"
                      />
                    </div>

                    <div className="space-y-1 mt-4">
                      {studentDetailedData.map((student) => (
                        <div
                          key={student.id}
                          className={`cursor-pointer p-3 rounded-md border ${
                            student.id === selectedStudent
                              ? "bg-brightpair/5 border-brightpair"
                              : "hover:bg-gray-50 border-gray-200"
                          }`}
                          onClick={() => setSelectedStudent(student.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{student.name}</h3>
                              <p className="text-sm text-gray-500">
                                {student.grade} • {student.subjects.join(", ")}
                              </p>
                            </div>
                            <Badge
                              className={student.improvement > 15
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"}
                            >
                              {student.improvement > 0
                                ? `+${student.improvement}%`
                                : `${student.improvement}%`}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-2">
                {selectedStudent
                  ? (
                    <>
                      <Card className="mb-6">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>
                                {getStudentById(selectedStudent)?.name}{" "}
                                - Progress Summary
                              </CardTitle>
                              <CardDescription>
                                Overall academic performance and engagement
                                metrics
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Printer className="h-4 w-4 mr-1" />
                                Print
                              </Button>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                Export PDF
                              </Button>
                              <Button variant="outline" size="sm">
                                <Share className="h-4 w-4 mr-1" />
                                Share
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded">
                              <p className="text-sm text-gray-500">
                                Academic Improvement
                              </p>
                              <div className="flex items-center mt-1">
                                <p className="text-2xl font-bold mr-1">
                                  +{getStudentById(selectedStudent)
                                    ?.improvement}%
                                </p>
                                {renderTrendIndicator(
                                  getStudentById(selectedStudent)
                                    ?.improvement || 0,
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Since first assessment
                              </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded">
                              <p className="text-sm text-gray-500">
                                Attendance Rate
                              </p>
                              <div className="flex items-center mt-1">
                                <p className="text-2xl font-bold mr-1">
                                  {getStudentById(selectedStudent)
                                    ?.attendanceRate}%
                                </p>
                                {renderTrendIndicator(
                                  getStudentById(selectedStudent)
                                    ?.attendanceRate || 0 - 90,
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Sessions attended
                              </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded">
                              <p className="text-sm text-gray-500">
                                Homework Completion
                              </p>
                              <div className="flex items-center mt-1">
                                <p className="text-2xl font-bold mr-1">
                                  {getStudentById(selectedStudent)
                                    ?.homeworkCompletion}%
                                </p>
                                {renderTrendIndicator(
                                  getStudentById(selectedStudent)
                                    ?.homeworkCompletion || 0 - 80,
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Assignments completed
                              </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded">
                              <p className="text-sm text-gray-500">
                                Engagement Score
                              </p>
                              <div className="flex items-center mt-1">
                                <p className="text-2xl font-bold mr-1">
                                  {getStudentById(selectedStudent)
                                    ?.engagementScore}/5
                                </p>
                                {renderTrendIndicator(
                                  (getStudentById(selectedStudent)
                                    ?.engagementScore || 0) - 3.5,
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Class participation
                              </p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h3 className="text-md font-medium mb-3">
                              Academic Progress Timeline
                            </h3>
                            <div className="h-[250px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <RechartsLineChart
                                  data={[
                                    {
                                      month: "Jan",
                                      score: getStudentById(selectedStudent)
                                        ?.initialAssessment || 0,
                                    },
                                    {
                                      month: "Feb",
                                      score: getStudentById(selectedStudent)
                                          ?.initialAssessment
                                        ? getStudentById(selectedStudent)
                                          ?.initialAssessment + 5
                                        : 0,
                                    },
                                    {
                                      month: "Mar",
                                      score: getStudentById(selectedStudent)
                                          ?.initialAssessment
                                        ? getStudentById(selectedStudent)
                                          ?.initialAssessment + 7
                                        : 0,
                                    },
                                    {
                                      month: "Apr",
                                      score: getStudentById(selectedStudent)
                                          ?.initialAssessment
                                        ? getStudentById(selectedStudent)
                                          ?.initialAssessment + 10
                                        : 0,
                                    },
                                    {
                                      month: "May",
                                      score: getStudentById(selectedStudent)
                                          ?.initialAssessment
                                        ? getStudentById(selectedStudent)
                                          ?.initialAssessment + 11
                                        : 0,
                                    },
                                    {
                                      month: "Jun",
                                      score: getStudentById(selectedStudent)
                                        ?.currentScore || 0,
                                    },
                                  ]}
                                  margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                  }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="month" />
                                  <YAxis domain={[0, 100]} />
                                  <Tooltip />
                                  <Line
                                    type="monotone"
                                    dataKey="score"
                                    name="Score"
                                    stroke="#4D8BF9"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 8 }}
                                  />
                                </RechartsLineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Strength & Improvement Areas</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                                  Areas of Strength
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {getStudentById(selectedStudent)
                                    ?.strengthAreas.map((area) => (
                                      <Badge
                                        key={area}
                                        className="bg-green-100 text-green-800"
                                      >
                                        {area}
                                      </Badge>
                                    ))}
                                </div>
                              </div>

                              <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                                  Areas for Improvement
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {getStudentById(selectedStudent)
                                    ?.improvementAreas.map((area) => (
                                      <Badge
                                        key={area}
                                        className="bg-orange-100 text-orange-800"
                                      >
                                        {area}
                                      </Badge>
                                    ))}
                                </div>
                              </div>

                              <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                                  Learning Style
                                </h3>
                                <Badge className="bg-blue-100 text-blue-800">
                                  {getStudentById(selectedStudent)
                                    ?.learningStyle}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Core Skills Development</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[250px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart
                                  data={learningOutcomesData}
                                  layout="vertical"
                                  margin={{
                                    top: 20,
                                    right: 30,
                                    left: 80,
                                    bottom: 5,
                                  }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis type="number" domain={[0, 100]} />
                                  <YAxis
                                    dataKey="skill"
                                    type="category"
                                    width={80}
                                  />
                                  <Tooltip />
                                  <Legend />
                                  <Bar
                                    dataKey="beforeScore"
                                    name="Initial Assessment"
                                    fill="#8884d8"
                                  />
                                  <Bar
                                    dataKey="afterScore"
                                    name="Current Level"
                                    fill="#4D8BF9"
                                  />
                                </RechartsBarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )
                  : (
                    <Card className="h-full flex items-center justify-center">
                      <CardContent className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No Student Selected
                        </h3>
                        <p className="text-gray-500 mb-4 max-w-md mx-auto">
                          Select a student from the list to view their detailed
                          progress metrics and academic growth.
                        </p>
                      </CardContent>
                    </Card>
                  )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Session Metrics</CardTitle>
                    <CardDescription>
                      Analysis of teaching effectiveness
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">
                          Total Sessions
                        </p>
                        <p className="text-2xl font-bold">
                          {sessionMetrics.totalSessions}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">
                          Total Hours
                        </p>
                        <p className="text-2xl font-bold">
                          {sessionMetrics.totalHours}h
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">
                          Average Session Length
                        </p>
                        <p className="text-2xl font-bold">
                          {sessionMetrics.averageDuration}h
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">
                          Objectives Achieved
                        </p>
                        <p className="text-2xl font-bold">
                          {sessionMetrics.objectivesAchievedRate}%
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">
                          Average Engagement Score
                        </p>
                        <p className="text-2xl font-bold">
                          {sessionMetrics.averageEngagement}/5
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">
                          Average Comprehension Score
                        </p>
                        <p className="text-2xl font-bold">
                          {sessionMetrics.averageComprehension}/5
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hours by Subject</CardTitle>
                      <CardDescription>
                        Distribution of teaching hours across subjects
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={hoursBySubjectData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subject" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="hours" name="Hours" fill="#4D8BF9" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Session Effectiveness</CardTitle>
                        <CardDescription>
                          Based on engagement and objectives achieved
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={sessionEffectivenessData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) =>
                                  `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {sessionEffectivenessData.map((
                                  entry,
                                  index,
                                ) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={index === 0
                                      ? "#4D8BF9"
                                      : index === 1
                                      ? "#82ca9d"
                                      : "#ff8042"}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Daily Session Hours</CardTitle>
                        <CardDescription>
                          Hours taught each day
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsLineChart
                              data={weeklySessionsData}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" />
                              <YAxis />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="hours"
                                name="Hours"
                                stroke="#4D8BF9"
                                strokeWidth={2}
                              />
                            </RechartsLineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Recent Sessions</CardTitle>
                        <CardDescription>
                          Detailed log of your recent teaching sessions
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          defaultValue={sessionsDateRange}
                          onValueChange={setSessionsDateRange}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Date range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-1" />
                          Filter
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Engagement</TableHead>
                          <TableHead>Comprehension</TableHead>
                          <TableHead>Follow-up</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessionAnalyticsData.map((session) => (
                          <span
                            key={session.id}
                            style={{ display: "contents" }}
                          >
                            <TableRow>
                              <TableCell>{session.date}</TableCell>
                              <TableCell>{session.student}</TableCell>
                              <TableCell>{session.subject}</TableCell>
                              <TableCell>{session.duration} min</TableCell>
                              <TableCell>
                                <div className="flex">
                                  {Array(5).fill(0).map((_, i) => (
                                    <div
                                      key={i}
                                      className={`h-2 w-2 rounded-md mx-0.5 ${
                                        i < session.studentEngagement
                                          ? "bg-green-500"
                                          : "bg-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex">
                                  {Array(5).fill(0).map((_, i) => (
                                    <div
                                      key={i}
                                      className={`h-2 w-2 rounded-md mx-0.5 ${
                                        i < session.studentComprehension
                                          ? "bg-blue-500"
                                          : "bg-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                {session.followupRequired
                                  ? (
                                    <Badge className="bg-amber-100 text-amber-800">
                                      Needed
                                    </Badge>
                                  )
                                  : (
                                    <Badge className="bg-green-100 text-green-800">
                                      Complete
                                    </Badge>
                                  )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() =>
                                    setSelectedSession(
                                      session.id === selectedSession
                                        ? null
                                        : session.id,
                                    )}
                                >
                                  {session.id === selectedSession
                                    ? <ArrowUp className="h-4 w-4" />
                                    : <ArrowDown className="h-4 w-4" />}
                                </Button>
                              </TableCell>
                            </TableRow>
                            {session.id === selectedSession && (
                              <TableRow>
                                <TableCell colSpan={8} className="bg-gray-50">
                                  <div className="p-2">
                                    <div className="mb-3">
                                      <h4 className="text-sm font-semibold mb-1">
                                        Topics Covered
                                      </h4>
                                      <div className="flex flex-wrap gap-1">
                                        {session.topicsCovered.map((topic) => (
                                          <Badge
                                            key={topic}
                                            className="bg-blue-100 text-blue-800"
                                          >
                                            {topic}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="mb-3">
                                      <h4 className="text-sm font-semibold mb-1">
                                        Objectives
                                      </h4>
                                      <ul className="list-disc pl-5 text-sm">
                                        {session.objectives.map((
                                          objective,
                                          index,
                                        ) => (
                                          <li
                                            key={index}
                                            className={`${
                                              index < session.objectivesAchieved
                                                ? "text-green-700"
                                                : "text-gray-500"
                                            }`}
                                          >
                                            {objective} {index <
                                                session.objectivesAchieved &&
                                              "✓"}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-semibold mb-1">
                                        Session Notes
                                      </h4>
                                      <p className="text-sm text-gray-700">
                                        {session.notes}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </span>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Assignment Metrics</CardTitle>
                    <CardDescription>
                      Overall assignment performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">
                          Total Assignments
                        </p>
                        <p className="text-2xl font-bold">
                          {assignmentMetrics.total}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">
                          Completion Rate
                        </p>
                        <p className="text-2xl font-bold">
                          {assignmentMetrics.completionRate}%
                        </p>
                        <div className="w-full bg-gray-200 h-2 mt-2 rounded-md overflow-hidden">
                          <div
                            className="bg-brightpair h-2 rounded"
                            style={{
                              width: `${assignmentMetrics.completionRate}%`,
                            }}
                          >
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">
                          Average Score
                        </p>
                        <p className="text-2xl font-bold">
                          {assignmentMetrics.averageScore}%
                        </p>
                        <div className="w-full bg-gray-200 h-2 mt-2 rounded-md overflow-hidden">
                          <div
                            className={`h-2 rounded-md ${
                              assignmentMetrics.averageScore >= 90
                                ? "bg-green-500"
                                : assignmentMetrics.averageScore >= 80
                                ? "bg-blue-500"
                                : assignmentMetrics.averageScore >= 70
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${assignmentMetrics.averageScore}%`,
                            }}
                          >
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">
                          On-Time Submission Rate
                        </p>
                        <p className="text-2xl font-bold">
                          {assignmentMetrics.onTimeRate}%
                        </p>
                        <div className="w-full bg-gray-200 h-2 mt-2 rounded-md overflow-hidden">
                          <div
                            className="bg-green-500 h-2 rounded"
                            style={{
                              width: `${assignmentMetrics.onTimeRate}%`,
                            }}
                          >
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Completion Rate by Subject</CardTitle>
                      <CardDescription>
                        How students are performing across different subjects
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={completionRateBySubject}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subject" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar
                              dataKey="completionRate"
                              name="Completion Rate %"
                              fill="#4D8BF9"
                            />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Score Distribution</CardTitle>
                        <CardDescription>
                          Distribution of scores across all assignments
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={scoreDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="range"
                                label={({ name, percent }) =>
                                  `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {scoreDistribution.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      index === 0
                                        ? "#10b981" // 90-100
                                        : index === 1
                                        ? "#3b82f6" // 80-89
                                        : index === 2
                                        ? "#f59e0b" // 70-79
                                        : index === 3
                                        ? "#f97316" // 60-69
                                        : "#ef4444" // Below 60
                                    }
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Assignment Status</CardTitle>
                        <CardDescription>
                          Current status of all assignments
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px] flex flex-col justify-center">
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Completed</span>
                                <span>
                                  {assignmentMetrics.completed} of{" "}
                                  {assignmentMetrics.total}
                                </span>
                              </div>
                              <div className="h-3 bg-gray-200 rounded">
                                <div
                                  className="h-3 bg-green-500 rounded"
                                  style={{
                                    width: `${
                                      (assignmentMetrics.completed /
                                        assignmentMetrics.total) * 100
                                    }%`,
                                  }}
                                >
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Pending</span>
                                <span>
                                  {assignmentsData.filter((a) =>
                                    a.status === "pending"
                                  ).length} of {assignmentMetrics.total}
                                </span>
                              </div>
                              <div className="h-3 bg-gray-200 rounded">
                                <div
                                  className="h-3 bg-blue-500 rounded"
                                  style={{
                                    width: `${
                                      (assignmentsData.filter((a) =>
                                        a.status === "pending"
                                      ).length / assignmentMetrics.total) * 100
                                    }%`,
                                  }}
                                >
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Overdue</span>
                                <span>
                                  {assignmentsData.filter((a) =>
                                    a.status === "overdue"
                                  ).length} of {assignmentMetrics.total}
                                </span>
                              </div>
                              <div className="h-3 bg-gray-200 rounded">
                                <div
                                  className="h-3 bg-red-500 rounded"
                                  style={{
                                    width: `${
                                      (assignmentsData.filter((a) =>
                                        a.status === "overdue"
                                      ).length / assignmentMetrics.total) * 100
                                    }%`,
                                  }}
                                >
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Assignment Tracking</CardTitle>
                        <CardDescription>
                          Track assignments and student performance
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          defaultValue={assignmentFilter}
                          onValueChange={setAssignmentFilter}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Assignments</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assignment</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Assigned</TableHead>
                          <TableHead>Due</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignmentsData
                          .filter((a) => assignmentFilter === "all" ||
                            a.status === assignmentFilter
                          )
                          .map((assignment) => (
                            <span
                              key={assignment.id}
                              style={{ display: "contents" }}
                            >
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">
                                    {assignment.title}
                                  </div>
                                </TableCell>
                                <TableCell>{assignment.subject}</TableCell>
                                <TableCell>{assignment.student}</TableCell>
                                <TableCell>{assignment.assignedDate}</TableCell>
                                <TableCell>{assignment.dueDate}</TableCell>
                                <TableCell>
                                  <Badge
                                    className={assignment.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : assignment.status === "pending"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"}
                                  >
                                    {assignment.status.charAt(0).toUpperCase() +
                                      assignment.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {assignment.score !== null
                                    ? `${assignment.score}%`
                                    : "-"}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() =>
                                      setSelectedAssignment(
                                        assignment.id === selectedAssignment
                                          ? null
                                          : assignment.id,
                                      )}
                                  >
                                    {assignment.id === selectedAssignment
                                      ? <ArrowUp className="h-4 w-4" />
                                      : <ArrowDown className="h-4 w-4" />}
                                  </Button>
                                </TableCell>
                              </TableRow>
                              {assignment.id === selectedAssignment && (
                                <TableRow>
                                  <TableCell colSpan={8} className="bg-gray-50">
                                    <div className="p-2 space-y-4">
                                      {assignment.status === "completed" && (
                                        <>
                                          <div>
                                            <h4 className="text-sm font-semibold mb-2">
                                              Skills Assessment
                                            </h4>
                                            <div className="space-y-2">
                                              {assignment.skillsAssessed.map(
                                                (skill) => (
                                                  <div key={skill.skill}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                      <span>{skill.skill}</span>
                                                      <span>
                                                        {skill.score}/5
                                                      </span>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded">
                                                      <div
                                                        className="h-2 bg-brightpair rounded"
                                                        style={{
                                                          width: `${
                                                            (skill.score / 5) *
                                                            100
                                                          }%`,
                                                        }}
                                                      >
                                                      </div>
                                                    </div>
                                                  </div>
                                                ),
                                              )}
                                            </div>
                                          </div>

                                          <div>
                                            <h4 className="text-sm font-semibold mb-1">
                                              Teacher's Feedback
                                            </h4>
                                            <p className="text-sm text-gray-700">
                                              {assignment.feedback}
                                            </p>
                                          </div>
                                        </>
                                      )}

                                      <div>
                                        <h4 className="text-sm font-semibold mb-1">
                                          Topics Covered
                                        </h4>
                                        <div className="flex flex-wrap gap-1">
                                          {assignment.topics.map((topic) => (
                                            <Badge
                                              key={topic}
                                              variant="outline"
                                            >
                                              {topic}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>

                                      {assignment.status !== "completed" && (
                                        <div className="flex justify-end">
                                          <Button size="sm" variant="outline">
                                            Send Reminder
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </span>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="referrals">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Referral Earnings
                    </CardTitle>
                    <CardDescription>
                      Track your commission from referrals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">
                          This Month's Commission
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          ${referralMetrics.monthlyCommission}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">
                          Total Earnings (All Time)
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          ${referralMetrics.totalCommission}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">
                          Active Referrals
                        </p>
                        <div className="flex items-center">
                          <p className="text-2xl font-bold">
                            {referralMetrics.activeReferrals}/{referralMetrics
                              .totalReferrals}
                          </p>
                          <Badge className="ml-2 bg-green-100 text-green-800">
                            {referralMetrics.activeRate}%
                          </Badge>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">
                          Pending Activations
                        </p>
                        <p className="text-2xl font-bold">
                          {referralMetrics.pendingReferrals}
                        </p>
                      </div>

                      <Button className="w-full" onClick={generateReferralLink}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Refer New Client
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Commission</CardTitle>
                      <CardDescription>
                        Your commission earnings over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart
                            data={monthlyCommissionData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                              formatter={(value) => [`$${value}`, "Commission"]}
                            />
                            <Line
                              type="monotone"
                              dataKey="commission"
                              name="Commission"
                              stroke="#10b981"
                              strokeWidth={2}
                              activeDot={{ r: 8 }}
                            />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Referral Status</CardTitle>
                        <CardDescription>
                          Distribution of your referrals by status
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={referralStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="status"
                                label={({ name, percent }) =>
                                  `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                <Cell key="cell-active" fill="#10b981" />
                                <Cell key="cell-inactive" fill="#6b7280" />
                                <Cell key="cell-pending" fill="#f59e0b" />
                              </Pie>
                              <Tooltip />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Commission Breakdown</CardTitle>
                        <CardDescription>
                          How your commission is calculated
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 p-4">
                          <div>
                            <h3 className="font-medium mb-2">
                              Referral Commission Structure
                            </h3>
                            <ul className="space-y-2 text-sm">
                              <li className="flex justify-between">
                                <span>Basic Plan ($99/month)</span>
                                <span className="font-medium">
                                  15% = $14.85
                                </span>
                              </li>
                              <li className="flex justify-between">
                                <span>Standard Plan ($149/month)</span>
                                <span className="font-medium">
                                  15% = $22.35
                                </span>
                              </li>
                              <li className="flex justify-between">
                                <span>Premium Plan ($249/month)</span>
                                <span className="font-medium">
                                  15% = $37.35
                                </span>
                              </li>
                            </ul>
                          </div>

                          <div className="pt-4 border-t border-gray-200">
                            <h3 className="font-medium mb-2">
                              Payment Schedule
                            </h3>
                            <p className="text-sm text-gray-600">
                              Commissions are paid on the 15th of each month for
                              the previous month's active referrals. Payments
                              are made via direct deposit to your registered
                              bank account.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Referral Tracking</CardTitle>
                        <CardDescription>
                          Track all your client referrals and earnings
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          defaultValue={referralTimeRange}
                          onValueChange={(value) => {
                            setReferralTimeRange(value);
                            handleTimeRangeChange(value);
                          }}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Time range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">
                              This Quarter
                            </SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client Name</TableHead>
                          <TableHead>Referral Date</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Monthly Commission</TableHead>
                          <TableHead>Total Earned</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Payment</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referralData.map((referral) => (
                          <span
                            key={referral.id}
                            style={{ display: "contents" }}
                          >
                            <TableRow>
                              <TableCell>{referral.clientName}</TableCell>
                              <TableCell>{referral.referralDate}</TableCell>
                              <TableCell>
                                {referral.plan} (${referral.planValue}/mo)
                              </TableCell>
                              <TableCell className="text-green-600">
                                ${referral.commission}
                              </TableCell>
                              <TableCell className="text-green-600">
                                ${referral.totalEarned}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={referral.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : referral.status === "pending"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-gray-100 text-gray-800"}
                                >
                                  {referral.status.charAt(0).toUpperCase() +
                                    referral.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {referral.lastPayment || "N/A"}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    setSelectedReferral(
                                      referral.id === selectedReferral
                                        ? null
                                        : referral.id,
                                    );
                                    toggleReferralSelection(referral.id);
                                  }}
                                >
                                  {referral.id === selectedReferral
                                    ? <ArrowUp className="h-4 w-4" />
                                    : <ArrowDown className="h-4 w-4" />}
                                </Button>
                              </TableCell>
                            </TableRow>
                            {referral.id === selectedReferral && (
                              <TableRow>
                                <TableCell colSpan={8} className="bg-gray-50">
                                  <div className="p-4 space-y-4">
                                    <div>
                                      <h4 className="text-sm font-semibold mb-2">
                                        Subjects
                                      </h4>
                                      <div className="flex flex-wrap gap-1">
                                        {referral.subjects.map((subject) => (
                                          <Badge
                                            key={subject}
                                            variant="outline"
                                          >
                                            {subject}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-semibold mb-2">
                                          Commission History
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                          <div className="flex justify-between">
                                            <span>June 2023</span>
                                            <span className="text-green-600">
                                              ${referral.commission}
                                            </span>
                                          </div>
                                          {referral.totalEarned >
                                              referral.commission && (
                                            <div className="flex justify-between">
                                              <span>May 2023</span>
                                              <span className="text-green-600">
                                                ${referral.commission}
                                              </span>
                                            </div>
                                          )}
                                          {referral.totalEarned >
                                              referral.commission * 2 && (
                                            <div className="flex justify-between">
                                              <span>April 2023</span>
                                              <span className="text-green-600">
                                                ${referral.commission}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div>
                                        <h4 className="text-sm font-semibold mb-2">
                                          Actions
                                        </h4>
                                        <div className="space-x-2">
                                          <Button size="sm" variant="outline">
                                            <Share2 className="h-4 w-4 mr-1" />
                                            Share Progress
                                          </Button>

                                          {referral.status === "pending" && (
                                            <Button size="sm" variant="outline">
                                              <Activity className="h-4 w-4 mr-1" />
                                              Check Status
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {referral.status === "active" && (
                                      <div className="pt-2 border-t border-gray-200">
                                        <h4 className="text-sm font-semibold mb-2">
                                          Client Satisfaction
                                        </h4>
                                        <div className="flex">
                                          {Array(5).fill(0).map((_, i) => (
                                            <Award
                                              key={i}
                                              className={`h-5 w-5 ${
                                                i < 4
                                                  ? "text-yellow-500"
                                                  : "text-gray-300"
                                              }`}
                                            />
                                          ))}
                                          <span className="ml-2 text-sm">
                                            4.0/5.0
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </span>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
