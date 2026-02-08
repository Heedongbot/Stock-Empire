'use client';

import React, { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { AuthProvider } from "@/lib/AuthContext";
import TickerTape from "@/components/TickerTape";
import SiteFooter from "@/components/SiteFooter";
import BreakingNewsToast from "./components/BreakingNewsToast";

// ... (rest) ...

<ClerkProvider publishableKey={publishableKey} localization={koKR}>
  <AuthProvider>
    <TickerTape />
    {children}
    <SiteFooter />
    <BreakingNewsToast />
  </AuthProvider>
</ClerkProvider>
        )}
      </body >
    </html >
  );
}
