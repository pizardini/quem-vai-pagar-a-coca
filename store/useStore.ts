"use client";

import { create } from "zustand";

import { persist } from "zustand/middleware";

import { FixedParticipant } from "@/types/FixedParticipant";

import { SporadicParticipant } from "@/types/SporadicParticipant";

import { History } from "@/types/History";

interface Store {
    fixedParticipants: FixedParticipant[];

    currentFixedId: string | null;

    sporadicParticipants: SporadicParticipant[];

    history: History[];

    setFixedParticipants: (
        participants: FixedParticipant[]
    ) => void;

    setCurrentFixedId: (
        id: string | null
    ) => void;

    setSporadicParticipants: (
        participants: SporadicParticipant[]
    ) => void;

    setHistory: (
        history: History[]
    ) => void;
}

export const useStore = create<Store>()(

    persist(

        (set) => ({

            fixedParticipants: [],

            currentFixedId: null,

            sporadicParticipants: [],

            history: [],

            setFixedParticipants: (participants) =>
                set({
                    fixedParticipants: participants,
                }),

                setCurrentFixedId: (id) =>
                set({
                    currentFixedId: id,
                }),

            setSporadicParticipants: (participants) =>
                set({
                    sporadicParticipants: participants,
                }),

            setHistory: (history) =>
                set({
                    history,
                }),

        }),

        {

            name: "quem-vai-pagar-coca"

        }

    )

);