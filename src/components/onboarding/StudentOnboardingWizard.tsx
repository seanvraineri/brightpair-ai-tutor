import React, { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
    Accessibility,
    AlertTriangle,
    BookOpen,
    Check,
    Hand,
    Headphones,
    Image,
    Smile,
    Trophy,
    UploadCloud,
    UsersRound,
} from "lucide-react";

// Modern, pill-shaped Learning Modality Step (no Kinesthetic)
function LearningModalityStep({ value, onChange, canProceed, setCanProceed }: {
    value: any;
    onChange: (field: string, value: any) => void;
    canProceed: boolean;
    setCanProceed: (v: boolean) => void;
}) {
    const [selected, setSelected] = useState(value.modality || "");
    const [otherText, setOtherText] = useState(value.modalityOther || "");
    const options = [
        {
            value: "visual",
            label: "Visual",
            description: "I learn best with diagrams, images, and videos.",
            icon: <Image className="h-5 w-5" />,
        },
        {
            value: "auditory",
            label: "Auditory",
            description: "I learn best by listening and discussing.",
            icon: <Headphones className="h-5 w-5" />,
        },
        {
            value: "reading/writing",
            label: "Reading/Writing",
            description: "I learn best by reading and taking notes.",
            icon: <BookOpen className="h-5 w-5" />,
        },
    ];

    useEffect(() => {
        setCanProceed(!!selected);
    }, [selected, setCanProceed]);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4 text-brightpair-700">
                How do you learn best?
            </h3>
            <p className="mb-4 text-gray-600 text-sm">
                If you're not sure, just pick your best guess. Our AI will adapt
                as you use BrightPair.
            </p>
            <div className="flex flex-col gap-4">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        className={`flex items-center w-full px-5 py-4 rounded-full border transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brightpair/70 text-left
                            ${
                            selected === opt.value
                                ? "border-brightpair bg-brightpair-50 ring-2 ring-brightpair"
                                : "border-gray-200 hover:border-brightpair/50 hover:bg-brightpair/10"
                        }
                        `}
                        onClick={() => {
                            setSelected(opt.value);
                            onChange("modality", opt.value);
                        }}
                        tabIndex={0}
                    >
                        <span
                            className={`flex items-center justify-center h-8 w-8 rounded-full mr-4 ${
                                selected === opt.value
                                    ? "bg-brightpair text-white"
                                    : "bg-gray-100 text-brightpair"
                            }`}
                        >
                            {selected === opt.value
                                ? <Check className="h-5 w-5" />
                                : opt.icon}
                        </span>
                        <div className="flex flex-col flex-1">
                            <span className="font-medium text-base mb-0.5">
                                {opt.label}
                            </span>
                            <span className="text-gray-500 text-sm">
                                {opt.description}
                            </span>
                            {selected === opt.value && (
                                <div className="mt-4 w-full mb-4">
                                    <input
                                        type="text"
                                        className="border rounded px-4 py-3 text-base w-full focus:ring-2 focus:ring-brightpair bg-white shadow-sm"
                                        placeholder={`Describe your learning style (optional)`}
                                        value={otherText}
                                        onChange={(e) => {
                                            setOtherText(e.target.value);
                                            onChange(
                                                "modalityOther",
                                                e.target.value,
                                            );
                                        }}
                                        maxLength={200}
                                    />
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

// New Tutoring Focus Step
function TutoringFocusStep({ value, onChange, canProceed, setCanProceed }: {
    value: any;
    onChange: (field: string, value: any) => void;
    canProceed: boolean;
    setCanProceed: (v: boolean) => void;
}) {
    const [focus, setFocus] = useState(value.tutoringFocus || "");
    const [file, setFile] = useState<File | null>(
        value.tutoringFocusFile || null,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setCanProceed(!!focus);
    }, [focus, setCanProceed]);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4 text-brightpair-700">
                What do you want to be tutored on?
            </h3>
            <input
                type="text"
                className="w-full border rounded px-4 py-3 text-base mb-4 focus:ring-2 focus:ring-brightpair bg-white shadow-sm"
                placeholder="E.g., Algebra, Reading comprehension, SAT prep, etc."
                value={focus}
                onChange={(e) => {
                    setFocus(e.target.value);
                    onChange("tutoringFocus", e.target.value);
                }}
                maxLength={100}
            />
            <div className="mb-2">
                <label className="block mb-1 font-medium">
                    Upload any content (syllabus, textbook, notes, etc.)
                </label>
                <div
                    className="flex items-center gap-2 border-dashed border-2 border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            setFile(e.dataTransfer.files[0]);
                            onChange(
                                "tutoringFocusFile",
                                e.dataTransfer.files[0],
                            );
                        }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <UploadCloud className="h-6 w-6 text-brightpair" />
                    <span className="text-sm text-gray-600">
                        {file ? file.name : "Click to upload or drag & drop"}
                    </span>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setFile(e.target.files[0]);
                            onChange("tutoringFocusFile", e.target.files[0]);
                        }
                    }}
                />
            </div>
            {file && (
                <div className="mt-2 text-xs text-gray-500">
                    Uploaded: {file.name}{" "}
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
            )}
        </div>
    );
}

// Placeholder step components (replace with real ones as you build)
function WelcomeStep({ value, onChange }) {
    return (
        <div>
            <p>Welcome! Who are we onboarding?</p>
            {/* Add student selection/creation UI here */}
        </div>
    );
}
function PriorKnowledgeStep({ value, onChange, canProceed, setCanProceed }: {
    value: any;
    onChange: (field: string, value: any) => void;
    canProceed: boolean;
    setCanProceed: (v: boolean) => void;
}) {
    const [selected, setSelected] = useState(value.priorKnowledge || "");
    const options = [
        {
            value: "beginner",
            label: "Beginner",
            description: "I'm new to this subject.",
        },
        {
            value: "some",
            label: "Some Experience",
            description: "I've learned a bit, but need more practice.",
        },
        {
            value: "confident",
            label: "Confident",
            description: "I know this well and want to go deeper.",
        },
    ];
    useEffect(() => {
        setCanProceed(!!selected);
    }, [selected, setCanProceed]);
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4 text-brightpair-700">
                How much do you already know about your main subject?
            </h3>
            <div className="flex flex-col gap-4">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        className={`flex items-center w-full px-5 py-4 rounded-full border transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brightpair/70 text-left
                            ${
                            selected === opt.value
                                ? "border-brightpair bg-brightpair-50 ring-2 ring-brightpair"
                                : "border-gray-200 hover:border-brightpair/50 hover:bg-brightpair/10"
                        }
                        `}
                        onClick={() => {
                            setSelected(opt.value);
                            onChange("priorKnowledge", opt.value);
                        }}
                        tabIndex={0}
                    >
                        <span
                            className={`flex items-center justify-center h-8 w-8 rounded-full mr-4 ${
                                selected === opt.value
                                    ? "bg-brightpair text-white"
                                    : "bg-gray-100 text-brightpair"
                            }`}
                        >
                            {selected === opt.value
                                ? <Check className="h-5 w-5" />
                                : null}
                        </span>
                        <div className="flex flex-col flex-1">
                            <span className="font-medium text-base mb-0.5">
                                {opt.label}
                            </span>
                            <span className="text-gray-500 text-sm">
                                {opt.description}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
function MotivationGoalsStep({ value, onChange, canProceed, setCanProceed }: {
    value: any;
    onChange: (field: string, value: any) => void;
    canProceed: boolean;
    setCanProceed: (v: boolean) => void;
}) {
    const [text, setText] = useState(value.learningGoals || "");

    useEffect(() => {
        setCanProceed(text.trim().length > 0);
    }, [text, setCanProceed]);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4 text-brightpair-700">
                What are your learning goals and motivation?
            </h3>
            <textarea
                className="w-full border rounded px-4 py-3 text-base h-32 focus:ring-2 focus:ring-brightpair bg-white shadow-sm resize-none"
                placeholder="Describe why you want to learn this subject and what you hope to achieve..."
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                    onChange("learningGoals", e.target.value);
                }}
                maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-2">Up to 500 characters</p>
        </div>
    );
}
function TimePaceStep({ value, onChange, canProceed, setCanProceed }: {
    value: any;
    onChange: (field: string, value: any) => void;
    canProceed: boolean;
    setCanProceed: (v: boolean) => void;
}) {
    const [weeklyTime, setWeeklyTime] = useState(value.weeklyTime || "");
    const [lessonLength, setLessonLength] = useState(value.lessonLength || "");
    const [otherText, setOtherText] = useState(value.timePaceOther || "");

    const timeOptions = [
        "<1 hour",
        "1-3 hours",
        "3-5 hours",
        "5+ hours",
    ];

    const lengthOptions = [
        "30 minutes",
        "45 minutes",
        "60 minutes",
        "90 minutes",
    ];

    useEffect(() => {
        setCanProceed(!!weeklyTime && !!lessonLength);
    }, [weeklyTime, lessonLength, setCanProceed]);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4 text-brightpair-700">
                How much time can you spend per week?
            </h3>
            <div className="flex flex-wrap gap-3 mb-6">
                {timeOptions.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        className={`px-4 py-2 rounded-full border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brightpair/70
                            ${
                            weeklyTime === opt
                                ? "border-brightpair bg-brightpair-50 ring-2 ring-brightpair"
                                : "border-gray-200 hover:border-brightpair/50 hover:bg-brightpair/10"
                        }`}
                        onClick={() => {
                            setWeeklyTime(opt);
                            onChange("weeklyTime", opt);
                        }}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            <h3 className="text-lg font-semibold mb-4 text-brightpair-700">
                Preferred lesson length?
            </h3>
            <div className="flex flex-wrap gap-3 mb-6">
                {lengthOptions.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        className={`px-4 py-2 rounded-full border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brightpair/70
                            ${
                            lessonLength === opt
                                ? "border-brightpair bg-brightpair-50 ring-2 ring-brightpair"
                                : "border-gray-200 hover:border-brightpair/50 hover:bg-brightpair/10"
                        }`}
                        onClick={() => {
                            setLessonLength(opt);
                            onChange("lessonLength", opt);
                        }}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {(weeklyTime || lessonLength) && (
                <div className="mt-4">
                    <label className="block mb-2 font-medium text-sm">
                        Additional details (optional)
                    </label>
                    <textarea
                        className="w-full border rounded px-4 py-3 text-base h-24 focus:ring-2 focus:ring-brightpair bg-white shadow-sm resize-none"
                        placeholder="Tell us more about your availability or pace preferences..."
                        value={otherText}
                        onChange={(e) => {
                            setOtherText(e.target.value);
                            onChange("timePaceOther", e.target.value);
                        }}
                        maxLength={300}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Up to 300 characters
                    </p>
                </div>
            )}
        </div>
    );
}
function FeedbackPreferencesStep(
    { value, onChange, canProceed, setCanProceed }: {
        value: any;
        onChange: (field: string, value: any) => void;
        canProceed: boolean;
        setCanProceed: (v: boolean) => void;
    },
) {
    const [preference, setPreference] = useState(
        value.feedbackPreference || "",
    );
    const [otherText, setOtherText] = useState(value.feedbackOther || "");

    const options = [
        "Immediate during sessions",
        "End-of-lesson summary",
        "Weekly summary report",
        "Detailed written feedback",
        "Concise bullet points",
    ];

    useEffect(() => {
        setCanProceed(!!preference);
    }, [preference, setCanProceed]);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4 text-brightpair-700">
                How do you like to get feedback?
            </h3>
            <div className="flex flex-col gap-3">
                {options.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        className={`flex items-center w-full px-5 py-3 rounded-full border transition-all shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-brightpair/70
                            ${
                            preference === opt
                                ? "border-brightpair bg-brightpair-50 ring-2 ring-brightpair"
                                : "border-gray-200 hover:border-brightpair/50 hover:bg-brightpair/10"
                        }`}
                        onClick={() => {
                            setPreference(opt);
                            onChange("feedbackPreference", opt);
                        }}
                    >
                        <span className="font-medium text-sm">{opt}</span>
                    </button>
                ))}
            </div>

            {preference && (
                <div className="mt-4">
                    <label className="block mb-2 font-medium text-sm">
                        Additional details (optional)
                    </label>
                    <textarea
                        className="w-full border rounded px-4 py-3 text-base h-24 focus:ring-2 focus:ring-brightpair bg-white shadow-sm resize-none"
                        placeholder="Tell us more about the type of feedback you prefer..."
                        value={otherText}
                        onChange={(e) => {
                            setOtherText(e.target.value);
                            onChange("feedbackOther", e.target.value);
                        }}
                        maxLength={300}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Up to 300 characters
                    </p>
                </div>
            )}
        </div>
    );
}

// New Areas of Struggle Step – open-ended text input
function StruggleAreasStep({ value, onChange, canProceed, setCanProceed }: {
    value: any;
    onChange: (field: string, value: any) => void;
    canProceed: boolean;
    setCanProceed: (v: boolean) => void;
}) {
    const [text, setText] = useState(value.struggleAreas || "");

    useEffect(() => {
        setCanProceed(text.trim().length > 0);
    }, [text, setCanProceed]);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4 text-brightpair-700">
                What are you struggling with that you want to improve on your
                subject?
            </h3>
            <textarea
                className="w-full border rounded px-4 py-3 text-base h-32 focus:ring-2 focus:ring-brightpair bg-white shadow-sm resize-none"
                placeholder="Describe the concepts or areas you find challenging..."
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                    onChange("struggleAreas", e.target.value);
                }}
                maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-2">Up to 500 characters</p>
        </div>
    );
}

// Accessibility / Neurodiversity Needs Step
function AccessibilityNeedsStep(
    { value, onChange, canProceed, setCanProceed }: {
        value: any;
        onChange: (field: string, value: any) => void;
        canProceed: boolean;
        setCanProceed: (v: boolean) => void;
    },
) {
    const initial: string[] = value.accessibilityNeeds || [];
    const [selected, setSelected] = useState<string[]>(initial);
    const [otherText, setOtherText] = useState(value.accessibilityOther || "");

    const options = [
        { value: "captions", label: "Captions / transcripts" },
        { value: "dyslexia_font", label: "Dyslexia-friendly font" },
        { value: "extra_time", label: "Extra processing time" },
        { value: "high_contrast", label: "High-contrast mode" },
        { value: "none", label: "N/A" },
    ];

    useEffect(() => {
        setCanProceed(selected.length > 0 || otherText.trim().length > 0);
    }, [selected, otherText, setCanProceed]);

    const toggle = (val: string) => {
        setSelected((prev) => {
            let next: string[];
            if (val === "none") {
                next = prev.includes("none") ? [] : ["none"];
            } else {
                const filtered = prev.filter((v) => v !== "none");
                const exists = filtered.includes(val);
                next = exists
                    ? filtered.filter((v) => v !== val)
                    : [...filtered, val];
            }
            onChange("accessibilityNeeds", next);
            return next;
        });
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4 text-brightpair-700">
                Accessibility or neurodiversity needs
            </h3>
            <div className="flex flex-wrap gap-3 mb-6">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        className={`px-4 py-2 rounded-full border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brightpair/70
                            ${
                            selected.includes(opt.value)
                                ? "border-brightpair bg-brightpair-50 ring-2 ring-brightpair"
                                : "border-gray-200 hover:border-brightpair/50 hover:bg-brightpair/10"
                        }`}
                        onClick={() => toggle(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
            <label className="block mb-2 font-medium text-sm">
                Other needs (optional)
            </label>
            <textarea
                className="w-full border rounded px-4 py-3 text-base h-24 focus:ring-2 focus:ring-brightpair bg-white shadow-sm resize-none"
                placeholder="Please describe any additional accommodations you need..."
                value={otherText}
                onChange={(e) => {
                    setOtherText(e.target.value);
                    onChange("accessibilityOther", e.target.value);
                }}
                maxLength={300}
            />
        </div>
    );
}

// Gamification Style Step
function GamificationStyleStep({ value, onChange, canProceed, setCanProceed }: {
    value: any;
    onChange: (field: string, value: any) => void;
    canProceed: boolean;
    setCanProceed: (v: boolean) => void;
}) {
    const [style, setStyle] = useState(value.gamificationStyle || "");
    const [otherText, setOtherText] = useState(value.gamificationOther || "");

    const options = [
        { value: "xp_levels", label: "XP & levels" },
        { value: "badges", label: "Badges" },
        { value: "streaks", label: "Streaks" },
        { value: "none", label: "No gamification" },
    ];

    useEffect(() => {
        setCanProceed(!!style);
    }, [style, setCanProceed]);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4 text-brightpair-700">
                What reward & gamification style motivates you?
            </h3>
            <div className="flex flex-wrap gap-3 mb-6">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        className={`px-4 py-2 rounded-full border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brightpair/70
                            ${
                            style === opt.value
                                ? "border-brightpair bg-brightpair-50 ring-2 ring-brightpair"
                                : "border-gray-200 hover:border-brightpair/50 hover:bg-brightpair/10"
                        }`}
                        onClick={() => {
                            setStyle(opt.value);
                            onChange("gamificationStyle", opt.value);
                        }}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
            {style && (
                <div>
                    <label className="block mb-2 font-medium text-sm">
                        Additional details (optional)
                    </label>
                    <textarea
                        className="w-full border rounded px-4 py-3 text-base h-24 focus:ring-2 focus:ring-brightpair bg-white shadow-sm resize-none"
                        placeholder="Tell us more about what motivates you..."
                        value={otherText}
                        onChange={(e) => {
                            setOtherText(e.target.value);
                            onChange("gamificationOther", e.target.value);
                        }}
                        maxLength={300}
                    />
                </div>
            )}
        </div>
    );
}

// Mindset & Confidence Step
function MindsetConfidenceStep({ value, onChange, canProceed, setCanProceed }: {
    value: any;
    onChange: (field: string, value: any) => void;
    canProceed: boolean;
    setCanProceed: (v: boolean) => void;
}) {
    const [mindset, setMindset] = useState(value.mindsetConfidence || "");
    const [otherText, setOtherText] = useState(value.mindsetOther || "");

    const options = [
        { value: "growth", label: "Growth mindset" },
        { value: "fixed", label: "Fixed mindset" },
        { value: "confident", label: "Confident in subject" },
        { value: "need_encouragement", label: "Need encouragement" },
    ];

    useEffect(() => {
        setCanProceed(!!mindset);
    }, [mindset, setCanProceed]);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4 text-brightpair-700">
                How would you describe your mindset or confidence level?
            </h3>
            <div className="flex flex-wrap gap-3 mb-6">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        className={`px-4 py-2 rounded-full border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brightpair/70
                            ${
                            mindset === opt.value
                                ? "border-brightpair bg-brightpair-50 ring-2 ring-brightpair"
                                : "border-gray-200 hover:border-brightpair/50 hover:bg-brightpair/10"
                        }`}
                        onClick={() => {
                            setMindset(opt.value);
                            onChange("mindsetConfidence", opt.value);
                        }}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
            {mindset && (
                <div>
                    <label className="block mb-2 font-medium text-sm">
                        Additional details (optional)
                    </label>
                    <textarea
                        className="w-full border rounded px-4 py-3 text-base h-24 focus:ring-2 focus:ring-brightpair bg-white shadow-sm resize-none"
                        placeholder="Tell us more about your mindset or confidence..."
                        value={otherText}
                        onChange={(e) => {
                            setOtherText(e.target.value);
                            onChange("mindsetOther", e.target.value);
                        }}
                        maxLength={300}
                    />
                </div>
            )}
        </div>
    );
}

// Learning Disabilities Disclosure Step
function LearningDisabilitiesStep(
    { value, onChange, canProceed, setCanProceed }: {
        value: any;
        onChange: (field: string, value: any) => void;
        canProceed: boolean;
        setCanProceed: (v: boolean) => void;
    },
) {
    const initial: string[] = value.learningDisabilities || [];
    const [selected, setSelected] = useState<string[]>(initial);
    const [otherText, setOtherText] = useState(
        value.learningDisabilitiesOther || "",
    );

    const options = [
        { value: "adhd", label: "ADHD" },
        { value: "dyslexia", label: "Dyslexia" },
        { value: "dyscalculia", label: "Dyscalculia" },
        { value: "autism", label: "Autism" },
        { value: "none", label: "None" },
        { value: "prefer_not", label: "Prefer not to say" },
    ];

    useEffect(() => {
        setCanProceed(selected.length > 0 || otherText.trim().length > 0);
    }, [selected, otherText, setCanProceed]);

    const toggle = (val: string) => {
        setSelected((prev) => {
            const exists = prev.includes(val);
            const next = exists
                ? prev.filter((v) => v !== val)
                : [...prev, val];
            onChange("learningDisabilities", next);
            return next;
        });
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4 text-brightpair-700">
                Do you wish to disclose any learning disabilities?
            </h3>
            <div className="flex flex-wrap gap-3 mb-6">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        className={`px-4 py-2 rounded-full border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brightpair/70
                            ${
                            selected.includes(opt.value)
                                ? "border-brightpair bg-brightpair-50 ring-2 ring-brightpair"
                                : "border-gray-200 hover:border-brightpair/50 hover:bg-brightpair/10"
                        }`}
                        onClick={() => toggle(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
            <label className="block mb-2 font-medium text-sm">
                Additional details (optional)
            </label>
            <textarea
                className="w-full border rounded px-4 py-3 text-base h-24 focus:ring-2 focus:ring-brightpair bg-white shadow-sm resize-none"
                placeholder="Share anything else you feel comfortable disclosing..."
                value={otherText}
                onChange={(e) => {
                    setOtherText(e.target.value);
                    onChange("learningDisabilitiesOther", e.target.value);
                }}
                maxLength={300}
            />
        </div>
    );
}

const steps = [
    "Welcome",
    "Learning Modality",
    "Tutoring Focus",
    "Learning Goals & Motivation",
    "Prior Knowledge",
    "Areas of Struggle",
    "Time & Pace",
    "Feedback Preferences",
    "Accessibility Needs",
    "Gamification Style",
    "Mindset & Confidence",
    "Learning Disabilities",
];

const stepComponents = [
    WelcomeStep,
    (props) => (
        <LearningModalityStep
            {...props}
            canProceed={props.canProceed}
            setCanProceed={props.setCanProceed}
        />
    ),
    (props) => (
        <TutoringFocusStep
            {...props}
            canProceed={props.canProceed}
            setCanProceed={props.setCanProceed}
        />
    ),
    (props) => (
        <MotivationGoalsStep
            {...props}
            canProceed={props.canProceed}
            setCanProceed={props.setCanProceed}
        />
    ),
    (props) => (
        <PriorKnowledgeStep
            {...props}
            canProceed={props.canProceed}
            setCanProceed={props.setCanProceed}
        />
    ),
    (props) => (
        <StruggleAreasStep
            {...props}
            canProceed={props.canProceed}
            setCanProceed={props.setCanProceed}
        />
    ),
    (props) => (
        <TimePaceStep
            {...props}
            canProceed={props.canProceed}
            setCanProceed={props.setCanProceed}
        />
    ),
    (props) => (
        <FeedbackPreferencesStep
            {...props}
            canProceed={props.canProceed}
            setCanProceed={props.setCanProceed}
        />
    ),
    (props) => (
        <AccessibilityNeedsStep
            {...props}
            canProceed={props.canProceed}
            setCanProceed={props.setCanProceed}
        />
    ),
    (props) => (
        <GamificationStyleStep
            {...props}
            canProceed={props.canProceed}
            setCanProceed={props.setCanProceed}
        />
    ),
    (props) => (
        <MindsetConfidenceStep
            {...props}
            canProceed={props.canProceed}
            setCanProceed={props.setCanProceed}
        />
    ),
    (props) => (
        <LearningDisabilitiesStep
            {...props}
            canProceed={props.canProceed}
            setCanProceed={props.setCanProceed}
        />
    ),
];

export default function StudentOnboardingWizard({ studentId, onComplete }) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        modality: "",
        priorKnowledge: "",
        learningGoals: "",
        weeklyTime: "",
        lessonLength: "",
        timePaceOther: "",
        feedbackPreference: "",
        feedbackOther: "",
        struggleAreas: "",
        accessibilityNeeds: [],
        accessibilityOther: "",
        gamificationStyle: "",
        gamificationOther: "",
        mindsetConfidence: "",
        mindsetOther: "",
        learningDisabilities: [],
        learningDisabilitiesOther: "",
        // ...add more as needed
    });
    const [loading, setLoading] = useState(false);
    const [canProceed, setCanProceed] = useState(false);

    // Reset canProceed whenever the step changes so each step can manage it independently.
    useEffect(() => {
        setCanProceed(false);
    }, [step]);

    // Load existing onboarding data for this student
    useEffect(() => {
        if (!studentId) return;
        setLoading(true);
        supabase
            .from("profiles")
            .select("*")
            .eq("id", studentId)
            .single()
            .then(({ data, error }) => {
                if (error) {
                    // The column may not exist yet on some environments. Ignore for now.
                    console.warn(
                        "Could not load learning preferences:",
                        error.message,
                    );
                }
                if (
                    data && typeof data === "object" &&
                    data !== null && (data as any).learning_preferences
                ) {
                    setFormData((prev) => ({
                        ...prev,
                        ...(data as any).learning_preferences,
                    }));
                }
                setLoading(false);
            });
    }, [studentId]);

    // Save onboarding data to Supabase after each step
    const saveOnboardingStep = async (data) => {
        if (!studentId) return;
        let prefsToSave = { ...data };

        // If the user attached a tutoring focus file, upload it to Storage and replace the File object with a public URL
        if (data.tutoringFocusFile instanceof File && studentId) {
            const file = data.tutoringFocusFile as File;
            const path =
                `tutoring_focus/${studentId}/${Date.now()}_${file.name}`;
            const { error: uploadErr } = await supabase.storage
                .from("tutoring_files")
                .upload(path, file, {
                    cacheControl: "3600",
                    upsert: false,
                });
            if (!uploadErr) {
                const {
                    data: { publicUrl },
                } = supabase.storage.from("tutoring_files").getPublicUrl(path);
                prefsToSave.tutoringFocusFileUrl = publicUrl;
            } else {
                console.error(
                    "Failed to upload tutoring focus file",
                    uploadErr,
                );
            }

            // Replace the File object with basic metadata for reference
            prefsToSave.tutoringFocusFile = {
                name: file.name,
                size: file.size,
                type: file.type,
            };
        }

        // Convert any remaining non-serialisable values.
        const sanitized = JSON.parse(
            JSON.stringify(prefsToSave),
        );

        const { error } = await supabase
            .from("profiles")
            .update({ learning_preferences: sanitized as any } as any)
            .eq("id", studentId);

        if (error) {
            // Ignore "column does not exist" errors when the migration hasn't run yet.
            // These have code "42703" in Postgres.
            if (error.code !== "42703") {
                console.error("Failed to save onboarding data", error);
            }
        }
    };

    const handleNext = async () => {
        await saveOnboardingStep(formData);
        setStep((s) => Math.min(s + 1, steps.length - 1));
    };
    const handleBack = () => setStep((s) => Math.max(s - 1, 0));
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Pass canProceed/setCanProceed to every step component. Components that don't
    // use them will simply ignore these props.
    const StepComponent = stepComponents[step];
    const stepProps = {
        value: formData,
        onChange: handleChange,
        canProceed,
        setCanProceed,
    } as any;

    if (loading) {
        return <div className="text-center py-12">Loading onboarding...</div>;
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
            <Progress
                value={((step + 1) / steps.length) * 100}
                className="mb-6"
            />
            <h2 className="text-xl font-bold mb-4">{steps[step]}</h2>

            <StepComponent {...stepProps} />

            <div className="flex justify-between mt-8">
                <Button
                    onClick={handleBack}
                    disabled={step === 0}
                    variant="outline"
                >
                    Back
                </Button>
                {step < steps.length - 1
                    ? (
                        <Button
                            onClick={handleNext}
                            disabled={StepComponent !== stepComponents[0] &&
                                !canProceed}
                        >
                            Next
                        </Button>
                    )
                    : (
                        <Button
                            onClick={async () => {
                                await saveOnboardingStep(formData);
                                onComplete(formData);
                            }}
                            disabled={StepComponent !== stepComponents[0] &&
                                !canProceed}
                        >
                            Finish
                        </Button>
                    )}
            </div>
        </div>
    );
}
