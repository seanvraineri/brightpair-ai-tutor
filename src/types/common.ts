/**
 * Common type definitions to replace any types across the codebase
 */

// JSON types
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[];

// Learning preferences type
export interface LearningPreferences {
    grade?: string;
    subject?: string;
    subjects?: string[];
    style?: string;
    interests?: string[];
    goals?: string[];
    pace?: string;
    [key: string]: unknown; // Allow additional properties
}

// Profile type
export interface Profile {
    id: string;
    email: string;
    name?: string | null;
    full_name?: string | null;
    role: "student" | "teacher" | "tutor" | "parent";
    created_at: string;
    updated_at?: string;
    learning_preferences?: LearningPreferences | null;
    phone?: string | null;
    avatar_url?: string | null;
}

// Session type
export interface TutoringSession {
    id: string;
    student_id: string;
    tutor_id: string;
    subject: string;
    date: string;
    time: string;
    duration: number;
    status: "scheduled" | "completed" | "cancelled";
    notes?: string;
    created_at: string;
    updated_at?: string;
}

// Homework type
export interface Homework {
    id: string;
    title: string;
    description?: string;
    subject: string;
    student_id: string;
    tutor_id: string;
    due_date: string;
    status: "assigned" | "in_progress" | "completed" | "overdue";
    questions?: HomeworkQuestion[];
    created_at: string;
    updated_at?: string;
}

export interface HomeworkQuestion {
    id: string;
    question: string;
    type: "multiple-choice" | "short-answer" | "essay" | "true-false";
    options?: string[];
    correct_answer?: string;
    points?: number;
    order_index: number;
}

// Quiz types
export interface Quiz {
    id: string;
    title: string;
    subject: string;
    questions: QuizQuestion[];
    total_points: number;
    time_limit?: number;
    created_at: string;
    created_by: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    type: "multiple-choice" | "true-false" | "short-answer";
    options?: string[];
    correct_answer: string;
    points: number;
    explanation?: string;
}

// Calendar event type
export interface CalendarEvent {
    id: string;
    title: string;
    start: Date | string;
    end: Date | string;
    type: "session" | "homework" | "quiz" | "other";
    resource?: {
        student_id?: string;
        tutor_id?: string;
        subject?: string;
        description?: string;
    };
}

// Form field types
export type FormFieldValue =
    | string
    | number
    | boolean
    | Date
    | string[]
    | undefined;

// API Response types
export interface ApiResponse<T = unknown> {
    data?: T;
    error?: ApiError;
    status: number;
}

export interface ApiError {
    message: string;
    code?: string;
    details?: unknown;
}

// React event handler types
export type ChangeHandler<T = HTMLInputElement> = React.ChangeEvent<T>;
export type SubmitHandler = React.FormEvent<HTMLFormElement>;
export type ClickHandler = React.MouseEvent<HTMLButtonElement>;

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncFunction<T = void> = () => Promise<T>;

// Database row types
export interface DatabaseRow {
    id: string;
    created_at: string;
    updated_at?: string;
    [key: string]: unknown;
}
