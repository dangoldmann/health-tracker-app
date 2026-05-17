import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createClient,
  processLock,
  type Session,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";

import { readNativeEnv } from "./env";

let supabaseClient: SupabaseClient | null = null;
let autoRefreshListenerRegistered = false;

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const env = readNativeEnv();

  supabaseClient = createClient(env.supabaseUrl, env.supabasePublishableKey, {
    auth: {
      ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  });

  if (Platform.OS !== "web" && !autoRefreshListenerRegistered) {
    autoRefreshListenerRegistered = true;
    AppState.addEventListener("change", (state) => {
      const client = getSupabaseClient();

      if (state === "active") {
        client.auth.startAutoRefresh();
      } else {
        client.auth.stopAutoRefresh();
      }
    });
  }

  return supabaseClient;
}

export async function getCurrentSession(): Promise<Session | null> {
  const {
    data: { session },
    error,
  } = await getSupabaseClient().auth.getSession();

  if (error) {
    throw error;
  }

  return session;
}
