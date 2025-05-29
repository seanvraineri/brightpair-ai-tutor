import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { logger } from "@/services/logger";

// Types
interface Referral {
  id: string;
  clientName: string;
  referralDate: string;
  status: string;
  plan: string;
  planValue: number;
  commission: number;
  lastPayment: string | null;
  totalEarned: number;
  subjects: string[];
}

interface ReferralMetrics {
  totalReferrals: number;
  activeReferrals: number;
  activeRate: number;
  totalCommission: string;
  monthlyCommission: string;
  pendingReferrals: number;
}

/**
 * Custom hook to handle referral tracking functionality
 * This validates the referral calculations and handles interaction with the referral tracker
 */
export function useReferralTracker(referralData: Referral[]) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [metrics, setMetrics] = useState<ReferralMetrics | null>(null);
  const [selectedReferral, setSelectedReferral] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("all");

  // Calculate metrics when data changes
  useEffect(() => {
    if (referralData && referralData.length > 0) {
      const totalReferrals = referralData.length;
      const activeReferrals = referralData.filter((r) =>
        r.status === "active"
      ).length;
      const activeRate = Math.round((activeReferrals / totalReferrals) * 100);

      const totalCommission = referralData.reduce(
        (acc, referral) => acc + referral.totalEarned,
        0,
      );
      // Calculate current month's commission from active referrals
      const monthlyCommission = referralData
        .filter((r) => r.status === "active")
        .reduce((acc, r) => acc + r.commission, 0);

      const pendingReferrals = referralData.filter((r) =>
        r.status === "pending"
      ).length;

      setMetrics({
        totalReferrals,
        activeReferrals,
        activeRate,
        totalCommission: totalCommission.toFixed(2),
        monthlyCommission: monthlyCommission.toFixed(2),
        pendingReferrals,
      });

      setIsLoaded(true);
    }
  }, [referralData]);

  // Toggle selection of a referral
  const toggleReferralSelection = (id: string) => {
    setSelectedReferral((prevId) => prevId === id ? null : id);
  };

  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);

    toast.success(
      `Filtered to show ${value === "all" ? "all time" : value} data`,
    );
  };

  // Filter referrals based on time range
  const getFilteredReferrals = () => {
    if (timeRange === "all") return referralData;

    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return referralData;
    }

    return referralData.filter((referral) => {
      const referralDate = new Date(referral.referralDate);
      return referralDate >= cutoffDate;
    });
  };

  // Generate a new referral link
  const generateReferralLink = () => {
    const referralCode = `REF${
      Math.random().toString(36).substring(2, 8).toUpperCase()
    }`;
    const referralLink = `https://brightpair.edu/signup?ref=${referralCode}`;

    // Copy to clipboard
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        toast.success("Referral link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy referral link");
      });

    return referralLink;
  };

  // Debug validation
  useEffect(() => {
    if (isLoaded) {
      logger.debug("Referral tracker loaded", {
        totalReferrals: metrics?.totalReferrals,
        activeReferrals: metrics?.activeReferrals,
        totalCommission: metrics?.totalCommission,
      });
    }
  }, [isLoaded, metrics]);

  // Validate referral data
  const validateReferralData = (data: Referral[]) => {
    // Check if each referral has the correct commission calculation (15% of plan value)
    const commissionsValid = data.every((referral) => {
      const expectedCommission = referral.planValue * 0.15;
      return Math.abs(referral.commission - expectedCommission) < 0.01; // Allow for small float differences
    });

    return commissionsValid;
  };

  return {
    isLoaded,
    metrics,
    selectedReferral,
    timeRange,
    filteredReferrals: getFilteredReferrals(),
    toggleReferralSelection,
    handleTimeRangeChange,
    generateReferralLink,
    validateReferralData,
  };
}
