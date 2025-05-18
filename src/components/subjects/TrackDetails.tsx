import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
    getSkillsForTrack,
    getTopicsForTrack,
    Skill,
} from "@/services/curriculumService";
import { CurriculumTopic } from "@/types/curriculum";

interface TrackDetailsProps {
    trackId: string;
    trackName: string;
    open: boolean;
    onClose: () => void;
}

const TrackDetails: React.FC<TrackDetailsProps> = ({
    trackId,
    trackName,
    open,
    onClose,
}) => {
    // Fetch skills
    const {
        data: skills,
        isLoading: loadingSkills,
    } = useQuery({
        queryKey: ["track-skills", trackId],
        enabled: open && !!trackId,
        queryFn: () => getSkillsForTrack(trackId),
    });

    // Fetch topics
    const {
        data: topics,
        isLoading: loadingTopics,
    } = useQuery({
        queryKey: ["track-topics", trackId],
        enabled: open && !!trackId,
        queryFn: () => getTopicsForTrack(trackId),
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{trackName} – Curriculum Details</DialogTitle>
                </DialogHeader>

                {/* Skills Section */}
                <div className="mt-4 space-y-2">
                    <h3 className="font-semibold">Core Skills</h3>
                    {loadingSkills
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-6 w-full" />
                        ))
                        : skills && skills.length > 0
                        ? (
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {skills.map((skill: Skill) => (
                                    <li key={skill.id}>
                                        <span className="font-medium">
                                            {skill.name}
                                        </span>
                                        {skill.description &&
                                            ` – ${skill.description}`}
                                    </li>
                                ))}
                            </ul>
                        )
                        : (
                            <p className="text-sm text-gray-500">
                                No skills defined.
                            </p>
                        )}
                </div>

                {/* Topics Section */}
                <div className="mt-6 space-y-2">
                    <h3 className="font-semibold">Topics</h3>
                    {loadingTopics
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-6 w-full" />
                        ))
                        : topics && topics.length > 0
                        ? (
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {topics.map((topic: CurriculumTopic) => (
                                    <li key={topic.id}>
                                        <span className="font-medium">
                                            {topic.name}
                                        </span>
                                        {topic.description &&
                                            ` – ${topic.description}`}
                                    </li>
                                ))}
                            </ul>
                        )
                        : (
                            <p className="text-sm text-gray-500">
                                No topics defined.
                            </p>
                        )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TrackDetails;
