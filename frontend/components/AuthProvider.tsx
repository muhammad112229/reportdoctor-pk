"use client";

import type { Session, User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Profile } from "@/lib/accountTypes";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  availableCredits: number;
  loading: boolean;
  error: string | null;
  refreshAccountData: (nextSession?: Session | null) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [availableCredits, setAvailableCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccountData = useCallback(async (nextSession: Session | null) => {
    if (!nextSession) {
      setProfile(null);
      setAvailableCredits(0);
      return;
    }

    const user = nextSession.user;
    const metadata = user.user_metadata || {};
    const fallbackProfile = {
      id: user.id,
      full_name: typeof metadata.full_name === "string" ? metadata.full_name : null,
      email: user.email || null,
      whatsapp: typeof metadata.whatsapp === "string" ? metadata.whatsapp : null,
      role: "user" as const
    };

    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, email, whatsapp, role, created_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      setError(profileError.message);
    }

    if (existingProfile) {
      setProfile(existingProfile as Profile);
    } else {
      const { data: createdProfile, error: upsertError } = await supabase
        .from("profiles")
        .upsert(fallbackProfile, { onConflict: "id" })
        .select("id, full_name, email, whatsapp, role, created_at")
        .single();

      if (upsertError) {
        setError(upsertError.message);
        setProfile(fallbackProfile);
      } else {
        setProfile(createdProfile as Profile);
      }
    }

    const { data: credits, error: creditError } = await supabase
      .from("report_credits")
      .select("credits_total, credits_used, status")
      .eq("user_id", user.id)
      .eq("status", "active");

    if (creditError) {
      setError(creditError.message);
      setAvailableCredits(0);
      return;
    }

    const remaining = (credits || []).reduce((total, credit) => {
      return total + Math.max(0, Number(credit.credits_total || 0) - Number(credit.credits_used || 0));
    }, 0);
    setAvailableCredits(remaining);
  }, []);

  const refreshAccountData = useCallback(async (nextSession: Session | null = session) => {
    if (!isSupabaseConfigured) {
      setError("Supabase is not configured.");
      return;
    }
    setError(null);
    await loadAccountData(nextSession);
  }, [loadAccountData, session]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(async ({ data, error: sessionError }) => {
      if (!mounted) {
        return;
      }
      if (sessionError) {
        setError(sessionError.message);
      }
      setSession(data.session);
      await loadAccountData(data.session);
      if (mounted) {
        setLoading(false);
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      void loadAccountData(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadAccountData]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setAvailableCredits(0);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user || null,
      profile,
      availableCredits,
      loading,
      error,
      refreshAccountData,
      signOut
    }),
    [availableCredits, error, loading, profile, refreshAccountData, session, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return value;
}
