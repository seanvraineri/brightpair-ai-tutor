import { getPersonalizedAchievements } from "../gamificationUtils";

describe("gamificationUtils", () => {
    describe("getPersonalizedAchievements", () => {
        it("should return base achievements", () => {
            const achievements = getPersonalizedAchievements([], "visual");

            expect(achievements.length).toBeGreaterThanOrEqual(3);
            expect(achievements.some((a) => a.title === "First Day")).toBe(
                true,
            );
            expect(achievements.some((a) => a.title === "Weekly Warrior")).toBe(
                true,
            );
        });

        it("should return achievements for math interest", () => {
            const achievements = getPersonalizedAchievements(
                ["math"],
                "visual",
            );

            expect(achievements.some((a) => a.title === "Math Master")).toBe(
                true,
            );
        });

        it("should return achievements for science interest", () => {
            const achievements = getPersonalizedAchievements(
                ["science"],
                "visual",
            );

            expect(achievements.some((a) => a.title === "Science Explorer"))
                .toBe(true);
        });

        it("should return achievements for reading interest", () => {
            const achievements = getPersonalizedAchievements(
                ["reading"],
                "visual",
            );

            expect(achievements.some((a) => a.title === "Bookworm")).toBe(true);
        });

        it("should return achievements for visual learning style", () => {
            const achievements = getPersonalizedAchievements(
                ["math"],
                "visual",
            );

            expect(achievements.some((a) => a.title === "Visual Virtuoso"))
                .toBe(true);
        });

        it("should return achievements for auditory learning style", () => {
            const achievements = getPersonalizedAchievements(
                ["math"],
                "auditory",
            );

            expect(achievements.some((a) => a.title === "Auditory Ace")).toBe(
                true,
            );
        });

        it("should unlock first achievement", () => {
            const achievements = getPersonalizedAchievements(
                ["math"],
                "visual",
            );
            const firstDay = achievements.find((a) => a.id === "first-login");

            expect(firstDay?.isUnlocked).toBe(true);
        });

        it("should not unlock all achievements", () => {
            const achievements = getPersonalizedAchievements(
                ["math"],
                "visual",
            );
            const unlockedCount =
                achievements.filter((a) => a.isUnlocked).length;

            expect(unlockedCount).toBe(1);
            expect(achievements.length).toBeGreaterThan(unlockedCount);
        });

        it("should include multiple interest-based achievements", () => {
            const achievements = getPersonalizedAchievements([
                "math",
                "science",
                "reading",
            ], "visual");

            expect(achievements.some((a) => a.title === "Math Master")).toBe(
                true,
            );
            expect(achievements.some((a) => a.title === "Science Explorer"))
                .toBe(true);
            expect(achievements.some((a) => a.title === "Bookworm")).toBe(true);
        });
    });
});
