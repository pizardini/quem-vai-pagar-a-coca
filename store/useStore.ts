"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";

import { FixedParticipant } from "@/types/FixedParticipant";
import { SporadicParticipant } from "@/types/SporadicParticipant";
import { History } from "@/types/History";

type ParticipantKind = "fixed" | "sporadic" | "none";
type MeetingResult = "paid" | "not-paid" | "no-coke";

export interface Payer {
  id: string | null;
  name: string;
  type: ParticipantKind;
}

export interface ExportedData {
  fixedParticipants: FixedParticipant[];
  sporadicParticipants: SporadicParticipant[];
  history: History[];
}

interface Store {
  fixedParticipants: FixedParticipant[];
  sporadicParticipants: SporadicParticipant[];
  history: History[];

  addFixedParticipant: (name: string) => void;
  removeFixedParticipant: (id: string) => void;
  reorderFixedParticipants: (participants: FixedParticipant[]) => void;

  addSporadicParticipant: (name: string) => void;
  removeSporadicParticipant: (id: string) => void;

  registerMeetingPresence: (presentSporadicIds: string[]) => Payer;
  finishMeeting: (payer: Payer, result: MeetingResult) => void;
  exportData: () => ExportedData;
  importData: (data: ExportedData) => void;
  clearAll: () => void;
}

const createEmptyPayer = (): Payer => ({
  id: null,
  name: "Nenhum participante cadastrado",
  type: "none",
});

const getNextPayer = (
  fixedParticipants: FixedParticipant[],
  sporadicParticipants: SporadicParticipant[],
  presentSporadicIds: string[]
): Payer => {
  const presentIds = new Set(presentSporadicIds);
  const pendingSporadic = sporadicParticipants
    .filter((participant) => (
      participant.pendingPayment && presentIds.has(participant.id)
    ))
    .sort((first, second) => (
      (first.pendingSince ?? Number.MAX_SAFE_INTEGER) -
      (second.pendingSince ?? Number.MAX_SAFE_INTEGER)
    ))[0];

  if (pendingSporadic) {
    return {
      id: pendingSporadic.id,
      name: pendingSporadic.name,
      type: "sporadic",
    };
  }

  const nextFixed = fixedParticipants[0];

  if (nextFixed) {
    return {
      id: nextFixed.id,
      name: nextFixed.name,
      type: "fixed",
    };
  }

  return createEmptyPayer();
};

const getLimit = (fixedParticipants: FixedParticipant[]) => (
  Math.max(fixedParticipants.length, 1)
);

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      fixedParticipants: [],
      sporadicParticipants: [],
      history: [],

      addFixedParticipant: (name) => {
        const participant: FixedParticipant = {
          id: uuid(),
          name,
        };

        set({
          fixedParticipants: [...get().fixedParticipants, participant],
        });
      },

      removeFixedParticipant: (id) => {
        set({
          fixedParticipants: get().fixedParticipants.filter(
            (participant) => participant.id !== id
          ),
        });
      },

      reorderFixedParticipants: (participants) => {
        set({
          fixedParticipants: participants,
        });
      },

      addSporadicParticipant: (name) => {
        const participant: SporadicParticipant = {
          id: uuid(),
          name,
          participations: 0,
          pendingPayment: false,
          pendingSince: null,
        };

        set({
          sporadicParticipants: [
            ...get().sporadicParticipants,
            participant,
          ],
        });
      },

      removeSporadicParticipant: (id) => {
        set({
          sporadicParticipants:
            get().sporadicParticipants.filter(
              (p) => p.id !== id
            ),
        });
      },

      registerMeetingPresence: (presentSporadicIds) => {
        const now = Date.now();
        const presentIds = new Set(presentSporadicIds);
        const limit = getLimit(get().fixedParticipants);
        const updatedSporadicParticipants = get().sporadicParticipants.map(
          (participant) => {
            if (!presentIds.has(participant.id) || participant.pendingPayment) {
              return participant;
            }

            const participations = participant.participations + 1;
            const becamePending = participations >= limit;

            return {
              ...participant,
              participations,
              pendingPayment: becamePending,
              pendingSince: becamePending ? now : participant.pendingSince,
            };
          }
        );

        set({
          sporadicParticipants: updatedSporadicParticipants,
        });

        return getNextPayer(
          get().fixedParticipants,
          updatedSporadicParticipants,
          presentSporadicIds
        );
      },

      finishMeeting: (payer, result) => {
        const history: History = {
          id: uuid(),
          date: new Date().toISOString(),
          participantId: payer.id,
          participantName: payer.name,
          participantType: payer.type,
          result,
        };

        const shouldAdvance = result === "paid";

        set((state) => {
          const nextFixedParticipants =
            shouldAdvance && payer.type === "fixed" && payer.id
              ? [
                ...state.fixedParticipants.filter(
                  (participant) => participant.id !== payer.id
                ),
                ...state.fixedParticipants.filter(
                  (participant) => participant.id === payer.id
                ),
              ]
              : state.fixedParticipants;

          const nextSporadicParticipants =
            shouldAdvance && payer.type === "sporadic" && payer.id
              ? state.sporadicParticipants.map((participant) => (
                participant.id === payer.id
                  ? {
                    ...participant,
                    participations: 0,
                    pendingPayment: false,
                    pendingSince: null,
                  }
                  : participant
              ))
              : state.sporadicParticipants;

          return {
            fixedParticipants: nextFixedParticipants,
            sporadicParticipants: nextSporadicParticipants,
            history: [history, ...state.history],
          };
        });
      },

      exportData: () => ({
        fixedParticipants: get().fixedParticipants,
        sporadicParticipants: get().sporadicParticipants,
        history: get().history,
      }),

      importData: (data) => {
        set({
          fixedParticipants: data.fixedParticipants,
          sporadicParticipants: data.sporadicParticipants,
          history: data.history,
        });
      },

      clearAll: () => {
        set({
          fixedParticipants: [],
          sporadicParticipants: [],
          history: [],
        });
      },
    }),

    {
      name: "quem-vai-pagar-a-coca",
    }
  )
);
