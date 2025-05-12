import { useQuery } from "@tanstack/react-query";

export const useTutorReports = (tutorId: string) =>
  useQuery({
    queryKey: ['reports', tutorId],
    queryFn: async () => {
      const r = await fetch('/functions/v1/reports-tutor-overview', {
        method: 'POST',
        body: JSON.stringify({ tutor_id: tutorId })
      });
      return r.json();
    }
  }); 