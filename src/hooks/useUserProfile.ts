import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OnboardingStatus, User, UserRole } from "@/contexts/UserTypes";
import { getPersonalizedAchievements } from "@/utils/gamificationUtils";
import { Session } from "@supabase/supabase-js";
import { logger } from "@/services/logger";

export const useUserProfile = () => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // If profile doesn't exist, create a default one
        if (error.code === "PGRST116") {
          logger.debug(
            "No profile found, creating default profile for user:",
            userId,
          );

          // Get user email from auth
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            const { data: newProfile, error: createError } = await supabase
              .from("profiles")
              .insert({
                id: userId,
                email: user.email,
                name: user.email?.split("@")[0] || "User",
                role: "student",
                onboarding_status: "pending",
              })
              .select()
              .single();

            if (createError) {
              logger.error("Error creating profile:", createError);
              throw createError;
            }

            data = newProfile;
          }
        } else {
          throw error;
        }
      }

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role as UserRole,
          onboardingStatus: data.onboarding_status as OnboardingStatus,
          nextConsultationDate: data.next_consultation_date,
          learning_style: (data.learning_preferences as any)?.style || "visual",
          gamification: {
            level: 3,
            xp: 750,
            xpToNextLevel: 1000,
            streak: 7,
            interests: ["math", "science", "art"],
            learningStyle: "visual",
            favoriteSubjects: ["Algebra", "Biology"],
            achievements: getPersonalizedAchievements([
              "math",
              "science",
              "art",
            ], "visual"),
            badges: [
              {
                id: "math-1",
                name: "Math Enthusiast",
                description: "Completed your first math assignment",
                icon: "badge-plus",
                level: 1,
                isUnlocked: true,
              },
              {
                id: "streak-3",
                name: "Consistency",
                description: "Maintained a 3-day study streak",
                icon: "trophy",
                level: 2,
                isUnlocked: true,
              },
            ],
          },
        });
      }
    } catch (error) {
      logger.debug("Caught error:", error);
    }
  };

  const updateUser = async (
    session: Session | null | undefined,
    data: Partial<User>,
  ) => {
    setUser((prev) => prev ? { ...prev, ...data } : null);

    // If there's a session, update the profile in Supabase
    if (session?.user) {
      try {
        const updateData: Record<string, unknown> = {};

        if (data.name) updateData.name = data.name;
        if (data.email) updateData.email = data.email;
        if (data.role) updateData.role = data.role;
        if (data.onboardingStatus) {
          updateData.onboarding_status = data.onboardingStatus;
        }
        if (data.nextConsultationDate) {
          updateData.next_consultation_date = data.nextConsultationDate;
        }

        if (Object.keys(updateData).length > 0) {
          const { error } = await supabase
            .from("profiles")
            .update(updateData)
            .eq("id", session.user.id);

          if (error) throw error;
        }
      } catch (error) {
        logger.debug("Caught error:", error);
      }
    }
  };

  const updateOnboardingStatus = async (
    session: Session | null | undefined,
    status: OnboardingStatus,
  ) => {
    setUser((prev) => prev ? { ...prev, onboardingStatus: status } : null);

    // Update onboarding status in Supabase
    if (session?.user) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ onboarding_status: status })
          .eq("id", session.user.id);

        if (error) throw error;
      } catch (error) {
        logger.debug("Caught error:", error);
      }
    }
  };

  const setConsultationDate = async (
    session: Session | null | undefined,
    date: string,
  ) => {
    setUser((prev) =>
      prev
        ? {
          ...prev,
          nextConsultationDate: date,
          onboardingStatus: "consultation-scheduled" as OnboardingStatus,
        }
        : null
    );

    // Update consultation date in Supabase
    if (session?.user) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({
            next_consultation_date: date,
            onboarding_status: "consultation-scheduled",
          })
          .eq("id", session.user.id);

        if (error) throw error;
      } catch (error) {
        logger.debug("Caught error:", error);
      }
    }
  };

  const updateRole = async (
    session: Session | null | undefined,
    role: UserRole,
  ) => {
    setUser((prev) => prev ? { ...prev, role } : null);

    // Update role in Supabase if session exists
    if (session?.user) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ role })
          .eq("id", session.user.id);

        if (error) throw error;
      } catch (error) {
        logger.debug("Caught error:", error);
      }
    }
  };

  return {
    user,
    setUser,
    fetchUserProfile,
    updateUser,
    updateOnboardingStatus,
    setConsultationDate,
    updateRole,
  };
};
