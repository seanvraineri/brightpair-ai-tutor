import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
export type AppointmentInsert =
    Database["public"]["Tables"]["appointments"]["Insert"];
export type AppointmentUpdate =
    Database["public"]["Tables"]["appointments"]["Update"];

/**
 * Fetch upcoming appointments for a user (student or tutor) between now and a future date.
 * @param userId The ID of the current user
 * @param role   The role of the user (student | tutor)
 * @param daysAhead How many days ahead to look for upcoming sessions (default 30)
 */
export const getUpcomingAppointments = async (
    userId: string,
    role: "student" | "tutor",
    daysAhead = 30,
): Promise<Appointment[]> => {
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + daysAhead);

    let query = supabase
        .from("appointments")
        .select("*")
        .gte("starts_at", now.toISOString())
        .lte("starts_at", future.toISOString())
        .order("starts_at", { ascending: true });

    if (role === "student") {
        query = query.eq("student_id", userId);
    } else {
        query = query.eq("tutor_id", userId);
    }

    const { data, error } = await query;
    if (error) {
        console.error("getUpcomingAppointments", error);
        return [];
    }

    return data ?? [];
};

/**
 * Schedule a new appointment.
 * Responsibility for conflict checking should happen upstream (edge function) or via DB contraints.
 */
export const createAppointment = async (
    payload: AppointmentInsert,
): Promise<{ data: Appointment | null; error: string | null }> => {
    const { data, error } = await supabase
        .from("appointments")
        .insert(payload)
        .select()
        .single();

    return {
        data: data as Appointment | null,
        error: error?.message ?? null,
    };
};

/**
 * Cancel (update status) an appointment by ID.
 */
export const cancelAppointment = async (
    appointmentId: string,
): Promise<{ success: boolean; error: string | null }> => {
    const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId);

    return {
        success: !error,
        error: error?.message ?? null,
    };
};
