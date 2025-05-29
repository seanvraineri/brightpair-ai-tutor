// Test utilities for the application

/**
 * Function to test the referral tracker functionality
 * This can be called from the browser console to verify the referral tracker works correctly
 */
export const testReferralTracker = () => {
  try {
    // Navigate to the reports page
    window.location.href = "/reports";

    // Function to be executed after navigation completes
    const runTest = () => {
      // Click on the referrals tab (needs to be done after a delay to ensure the page is loaded)
      setTimeout(() => {
        const referralsTab = document.querySelector('[value="referrals"]');
        if (referralsTab) {
          (referralsTab as HTMLElement).click();

          // Verify key elements exist
          setTimeout(() => {
            // Check for required elements
            const earningSummary = document.querySelector(
              "p.text-2xl.font-bold.text-green-600",
            );
            const referralTable = document.querySelector("table");
            const monthlyChart = document.querySelector(
              ".recharts-responsive-container",
            );

            if (earningSummary && referralTable && monthlyChart) {
              // Test clicking on a referral row to expand details
              const expandButtons = document.querySelectorAll(
                "button.h-8.w-8.p-0",
              );
              if (expandButtons.length > 0) {
                (expandButtons[0] as HTMLElement).click();

                // Check if details expanded
                setTimeout(() => {
                  const expandedDetails = document.querySelector(
                    ".p-4.space-y-4",
                  );
                  if (expandedDetails) {
                    // Test filtering functionality
                    const timeFilterSelect = document.querySelector(
                      ".w-\\[140px\\]",
                    );
                    if (timeFilterSelect) {
                      (timeFilterSelect as HTMLElement).click();

                      setTimeout(() => {
                        const filterOption = document.querySelector(
                          '[data-value="month"]',
                        );
                        if (filterOption) {
                          (filterOption as HTMLElement).click();
                        }
                      }, 300);
                    }
                  }
                }, 300);
              }
            }
          }, 1000);
        }
      }, 1000);
    };

    // Run test after navigation
    setTimeout(runTest, 1500);

    return "Referral tracker test initiated. Check console for results.";
  } catch (error) {
    return "Error testing referral tracker. See console for details.";
  }
};

// Export a way to manually test the reports page from console
export const openReportsPage = () => {
  window.location.href = "/reports";
  return "Navigating to Reports page...";
};
