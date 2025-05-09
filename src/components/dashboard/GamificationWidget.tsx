
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Achievement, Badge as UserBadge } from "@/contexts/UserTypes";
import { Award, Trophy, BadgeCheck, BadgePlus, BadgeInfo, BadgeHelp } from "lucide-react";

const GamificationWidget = () => {
  const { user, unlockAchievement, earnXP } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("achievements");
  
  if (!user?.gamification) return null;
  
  const { level, xp, xpToNextLevel, streak, achievements, badges } = user.gamification;
  
  // Helper function to select the appropriate icon component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'award': return <Award className="h-5 w-5" />;
      case 'trophy': return <Trophy className="h-5 w-5" />;
      case 'badge-check': return <BadgeCheck className="h-5 w-5" />;
      case 'badge-plus': return <BadgePlus className="h-5 w-5" />;
      case 'badge-info': return <BadgeInfo className="h-5 w-5" />;
      case 'badge-help': return <BadgeHelp className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };
  
  const getLevelColor = (level: number) => {
    if (level <= 2) return 'bg-orange-100 text-orange-800';
    if (level <= 5) return 'bg-blue-100 text-blue-800';
    if (level <= 10) return 'bg-purple-100 text-purple-800';
    return 'bg-green-100 text-green-800';
  };
  
  const getBadgeColor = (badgeLevel: number) => {
    if (badgeLevel === 1) return 'bg-amber-600'; // Bronze
    if (badgeLevel === 2) return 'bg-gray-300'; // Silver
    if (badgeLevel === 3) return 'bg-yellow-500'; // Gold
    return 'bg-purple-500';
  };
  
  // For demo purposes - simulate earning XP
  const handleEarnXP = () => {
    const xpAmount = Math.floor(Math.random() * 50) + 10; // Random XP between 10-60
    earnXP(xpAmount);
    toast({
      title: "XP Earned!",
      description: `You earned ${xpAmount} XP for your activity.`,
    });
  };
  
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);
  const unlockedBadges = badges.filter(b => b.isUnlocked);
  
  // Calculate personalization score based on achievements and badges
  const personalizedScore = Math.min(
    100, 
    Math.round(
      (unlockedAchievements.length / achievements.length * 50) +
      (unlockedBadges.length / badges.length * 30) +
      (streak * 2)
    )
  );

  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your Learning Journey</CardTitle>
            <CardDescription>Track your progress and achievements</CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <Badge className={`${getLevelColor(level)} mb-1`}>Level {level}</Badge>
            <div className="text-xs text-gray-500">{streak} Day Streak 🔥</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* XP Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Experience Points</span>
            <span className="text-sm font-medium">{xp} / {xpToNextLevel} XP</span>
          </div>
          <Progress value={(xp / xpToNextLevel) * 100} className="h-2.5" />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Current Level</span>
            <span className="text-xs text-gray-500">Next Level</span>
          </div>
        </div>
        
        {/* Personalization Score */}
        <div className="bg-brightpair-50 p-3 rounded-md mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Personalization Score</span>
            <span className="text-sm font-medium">{personalizedScore}%</span>
          </div>
          <Progress value={personalizedScore} className="h-2 bg-gray-200" />
          <p className="text-xs text-gray-600 mt-2">
            Based on your {user.gamification.learningStyle} learning style and interests in {user.gamification.interests.join(", ")}
          </p>
        </div>
        
        {/* Achievements and Badges */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid grid-cols-2">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="achievements" className="space-y-4">
            {unlockedAchievements.length > 0 ? (
              unlockedAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center p-3 bg-green-50 border border-green-100 rounded-md animate-fade-in">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    {getIconComponent(achievement.icon)}
                  </div>
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-3">Complete activities to unlock achievements</p>
            )}
            
            {lockedAchievements.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Next Achievements:</h4>
                {lockedAchievements.slice(0, 2).map((achievement) => (
                  <div key={achievement.id} className="flex items-center p-3 bg-gray-50 border border-gray-100 rounded-md mb-2 opacity-70">
                    <div className="bg-gray-200 p-2 rounded-full mr-3">
                      {getIconComponent(achievement.icon)}
                    </div>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="badges">
            <div className="grid grid-cols-2 gap-3">
              {unlockedBadges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center p-3 bg-white border rounded-md shadow-sm hover:shadow-md transition-all">
                  <div className={`p-3 rounded-full mb-2 ${getBadgeColor(badge.level)} text-white`}>
                    {getIconComponent(badge.icon)}
                  </div>
                  <p className="font-medium text-center">{badge.name}</p>
                  <p className="text-xs text-gray-500 text-center">{badge.description}</p>
                </div>
              ))}
            </div>
            
            {unlockedBadges.length === 0 && (
              <p className="text-gray-500 text-center py-8">Complete activities to earn badges</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-brightpair hover:bg-brightpair-600 transition-all"
          onClick={handleEarnXP}
        >
          Complete an Activity (+XP)
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GamificationWidget;
