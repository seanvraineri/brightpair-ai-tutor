import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TestAuth: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<any[]>([]);

    const addStatus = (message: string, data?: any) => {
        setStatus(
            (prev) => [...prev, {
                time: new Date().toISOString(),
                message,
                data,
            }]
        );
    };

    const testLogin = async () => {
        setStatus([]);
        addStatus("Starting login test...");

        try {
            // Test 1: Check current session
            const { data: sessionData, error: sessionError } = await supabase
                .auth.getSession();
            addStatus("Current session check", {
                session: sessionData.session,
                error: sessionError,
            });

            // Test 2: Try to sign in
            addStatus("Attempting sign in...");
            const { data: authData, error: authError } = await supabase.auth
                .signInWithPassword({
                    email,
                    password,
                });

            if (authError) {
                addStatus("Auth error", authError);
                return;
            }

            addStatus("Sign in successful", { user: authData.user });

            // Test 3: Check if profile exists
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", authData.user.id)
                .single();

            addStatus("Profile query result", { profileData, profileError });

            // Test 4: Try to update profile
            const { data: updateData, error: updateError } = await supabase
                .from("profiles")
                .update({ role: "student" })
                .eq("id", authData.user.id)
                .select();

            addStatus("Profile update result", { updateData, updateError });
        } catch (error) {
            addStatus("Unexpected error", error);
        }
    };

    const testSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        addStatus("Sign out result", { error });
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Test Supabase Auth</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="flex gap-4">
                            <Button onClick={testLogin}>Test Login</Button>
                            <Button onClick={testSignOut} variant="outline">
                                Sign Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {status.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Debug Output</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-xs overflow-auto bg-gray-100 p-4 rounded">
                {JSON.stringify(status, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default TestAuth;
