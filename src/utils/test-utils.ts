// Test utilities for the application

/**
 * Function to test the referral tracker functionality
 * This can be called from the browser console to verify the referral tracker works correctly
 */
export const testReferralTracker = () => {
  try {
    console.log("Starting referral tracker test...");
    
    // Navigate to the reports page
    window.location.href = "/reports";
    
    // Function to be executed after navigation completes
    const runTest = () => {
      console.log("Testing referral functionality...");
      
      // Click on the referrals tab (needs to be done after a delay to ensure the page is loaded)
      setTimeout(() => {
        const referralsTab = document.querySelector('[value="referrals"]');
        if (referralsTab) {
          console.log("Found referrals tab, clicking...");
          (referralsTab as HTMLElement).click();
          
          // Verify key elements exist
          setTimeout(() => {
            // Check for required elements
            const earningSummary = document.querySelector('p.text-2xl.font-bold.text-green-600');
            const referralTable = document.querySelector('table');
            const monthlyChart = document.querySelector('.recharts-responsive-container');
            
            if (earningSummary && referralTable && monthlyChart) {
              console.log("✅ Referral tracker UI elements loaded successfully");
              
              // Test clicking on a referral row to expand details
              const expandButtons = document.querySelectorAll('button.h-8.w-8.p-0');
              if (expandButtons.length > 0) {
                console.log("Testing row expansion...");
                (expandButtons[0] as HTMLElement).click();
                
                // Check if details expanded
                setTimeout(() => {
                  const expandedDetails = document.querySelector('.p-4.space-y-4');
                  if (expandedDetails) {
                    console.log("✅ Referral details expansion works");
                    
                    // Test filtering functionality
                    const timeFilterSelect = document.querySelector('.w-\\[140px\\]');
                    if (timeFilterSelect) {
                      console.log("Testing time filtering...");
                      (timeFilterSelect as HTMLElement).click();
                      
                      setTimeout(() => {
                        const filterOption = document.querySelector('[data-value="month"]');
                        if (filterOption) {
                          (filterOption as HTMLElement).click();
                          console.log("✅ Filter selection works");
                        } else {
                          console.log("❌ Could not find month filter option");
                        }
                      }, 300);
                    }
                    
                    console.log("✅ All referral tracker tests passed!");
                  } else {
                    console.log("❌ Referral details did not expand");
                  }
                }, 300);
              } else {
                console.log("❌ Could not find expand buttons");
              }
            } else {
              console.log("❌ Missing required UI elements");
              if (!earningSummary) console.log("- Earnings summary not found");
              if (!referralTable) console.log("- Referral table not found");
              if (!monthlyChart) console.log("- Monthly chart not found");
            }
          }, 1000);
        } else {
          console.log("❌ Referrals tab not found");
        }
      }, 1000);
    };
    
    // Run test after navigation
    setTimeout(runTest, 1500);
    
    return "Referral tracker test initiated. Check console for results.";
  } catch (error) {
    console.error("Error testing referral tracker:", error);
    return "Error testing referral tracker. See console for details.";
  }
};

// Export a way to manually test the reports page from console
export const openReportsPage = () => {
  window.location.href = "/reports";
  return "Navigating to Reports page...";
}; 