import { useQuery } from "@tanstack/react-query";

// Disabled: reports-tutor-overview Edge Function does not exist
// export const useTutorReports = (tutorId: string) =>
//   useQuery({
//     queryKey: ['reports', tutorId],
//     queryFn: async () => {
//       const r = await fetch('/functions/v1/reports-tutor-overview', {
//         method: 'POST',
//         body: JSON.stringify({ tutor_id: tutorId })
//       });
//       return r.json();
//     }
//   });

// Temporary placeholder to prevent 404 error
export const useTutorReports = (_tutorId: string) =>
  useQuery({
    queryKey: ["reports", _tutorId],
    queryFn: async () => ({
      success: false,
      error: "Tutor reports not available.",
    }),
  });
