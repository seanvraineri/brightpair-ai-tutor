import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/logger";
import { authRateLimiter } from "@/middleware/rateLimiter";
import { sessionManager } from "@/utils/sessionManager";
import { toast } from "@/components/ui/use-toast";
import { clearSentryUser, setSentryUser } from "@/services/sentry";

interface AuthState {
    user: any | null;
    loading: boolean;
    error: string | null;
}

export function useAuth() {
    // Try to get navigate, but don't fail if we're outside Router context
    let navigate: ReturnType<typeof useNavigate> | null = null;
    try {
        navigate = useNavigate();
    } catch {
        // We're outside router context, that's okay
    }

    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null,
    });

    // Initialize auth state
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    setAuthState({
                        user: session.user,
                        loading: false,
                        error: null,
                    });
                    if (session.user.email) {
                        setSentryUser({
                            id: session.user.id,
                            email: session.user.email,
                            role: session.user.user_metadata?.role,
                        });
                    }
                    await sessionManager.initialize();
                } else {
                    setAuthState({ user: null, loading: false, error: null });
                }
            } catch (error) {
                logger.error("Failed to initialize auth", error);
                setAuthState({
                    user: null,
                    loading: false,
                    error: "Failed to load session",
                });
            }
        };

        initializeAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                logger.info("Auth state changed", { event });

                if (session?.user) {
                    setAuthState({
                        user: session.user,
                        loading: false,
                        error: null,
                    });
                    if (session.user.email) {
                        setSentryUser({
                            id: session.user.id,
                            email: session.user.email,
                            role: session.user.user_metadata?.role,
                        });
                    }

                    if (event === "SIGNED_IN") {
                        await sessionManager.initialize();
                    }
                } else {
                    setAuthState({ user: null, loading: false, error: null });
                    clearSentryUser();
                    sessionManager.stopMonitoring();
                }
            },
        );

        return () => {
            subscription.unsubscribe();
            sessionManager.stopMonitoring();
        };
    }, []);

    // Sign in with email
    const signInWithEmail = useCallback(
        async (email: string, password: string) => {
            // Check rate limit
            const rateLimitCheck = authRateLimiter.checkLimit(email);
            if (!rateLimitCheck.allowed) {
                const error =
                    "Too many login attempts. Please try again later.";
                logger.warn("Auth rate limit exceeded", { email });
                toast({
                    title: "Rate Limit Exceeded",
                    description: error,
                    variant: "destructive",
                });
                throw new Error(error);
            }

            try {
                setAuthState((prev) => ({
                    ...prev,
                    loading: true,
                    error: null,
                }));

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                logger.info("User signed in successfully", { email });

                // Reset rate limit on successful login
                authRateLimiter.reset(email);

                return data;
            } catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : "Failed to sign in";
                setAuthState((prev) => ({
                    ...prev,
                    loading: false,
                    error: message,
                }));
                logger.error("Sign in failed", { email, error });
                throw error;
            }
        },
        [],
    );

    // Sign up with email
    const signUpWithEmail = useCallback(
        async (email: string, password: string, metadata?: any) => {
            // Check rate limit
            const rateLimitCheck = authRateLimiter.checkLimit(email);
            if (!rateLimitCheck.allowed) {
                const error =
                    "Too many signup attempts. Please try again later.";
                logger.warn("Auth rate limit exceeded", { email });
                toast({
                    title: "Rate Limit Exceeded",
                    description: error,
                    variant: "destructive",
                });
                throw new Error(error);
            }

            try {
                setAuthState((prev) => ({
                    ...prev,
                    loading: true,
                    error: null,
                }));

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: metadata,
                    },
                });

                if (error) throw error;

                logger.info("User signed up successfully", { email });

                // Reset rate limit on successful signup
                authRateLimiter.reset(email);

                return data;
            } catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : "Failed to sign up";
                setAuthState((prev) => ({
                    ...prev,
                    loading: false,
                    error: message,
                }));
                logger.error("Sign up failed", { email, error });
                throw error;
            }
        },
        [],
    );

    // Sign out
    const signOut = useCallback(async () => {
        try {
            await sessionManager.signOut();
            if (navigate) {
                navigate("/login");
            } else {
                // Fallback if we're outside router context
                window.location.href = "/login";
            }
        } catch (error) {
            logger.error("Sign out failed", error);
            toast({
                title: "Error",
                description: "Failed to sign out. Please try again.",
                variant: "destructive",
            });
        }
    }, [navigate]);

    // Reset password
    const resetPassword = useCallback(async (email: string) => {
        // Check rate limit
        const rateLimitCheck = authRateLimiter.checkLimit(`reset-${email}`);
        if (!rateLimitCheck.allowed) {
            const error =
                "Too many password reset attempts. Please try again later.";
            logger.warn("Password reset rate limit exceeded", { email });
            toast({
                title: "Rate Limit Exceeded",
                description: error,
                variant: "destructive",
            });
            throw new Error(error);
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            logger.info("Password reset email sent", { email });

            toast({
                title: "Success",
                description:
                    "Password reset email sent. Please check your inbox.",
            });
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Failed to send reset email";
            logger.error("Password reset failed", { email, error });
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
            throw error;
        }
    }, []);

    // Update password
    const updatePassword = useCallback(async (newPassword: string) => {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) throw error;

            logger.info("Password updated successfully");

            toast({
                title: "Success",
                description: "Your password has been updated.",
            });
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Failed to update password";
            logger.error("Password update failed", error);
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
            throw error;
        }
    }, []);

    // Check if user has a specific role
    const hasRole = useCallback((role: string) => {
        return authState.user?.user_metadata?.role === role;
    }, [authState.user]);

    // Get session info
    const getSessionInfo = useCallback(async () => {
        return sessionManager.getSessionInfo();
    }, []);

    return {
        user: authState.user,
        loading: authState.loading,
        error: authState.error,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        resetPassword,
        updatePassword,
        hasRole,
        getSessionInfo,
        isAuthenticated: !!authState.user,
    };
}
