"use client";

import { ChangeEvent, useRef, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import { ExportedData, useStore } from "@/store/useStore";
import { FixedParticipant } from "@/types/FixedParticipant";
import { History } from "@/types/History";
import { SporadicParticipant } from "@/types/SporadicParticipant";

type ImportStatus = "idle" | "success" | "error";

const isObject = (value: unknown): value is Record<string, unknown> => (
  typeof value === "object" && value !== null && !Array.isArray(value)
);

const isFixedParticipant = (value: unknown): value is FixedParticipant => {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.name === "string"
  );
};

const isSporadicParticipant = (
  value: unknown
): value is SporadicParticipant => {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.participations === "number" &&
    typeof value.pendingPayment === "boolean" &&
    (
      typeof value.pendingSince === "number" ||
      value.pendingSince === null
    )
  );
};

const isHistory = (value: unknown): value is History => {
  if (!isObject(value)) return false;

  const validParticipantType = (
    value.participantType === "fixed" ||
    value.participantType === "sporadic" ||
    value.participantType === "none"
  );
  const validResult = (
    value.result === "paid" ||
    value.result === "not-paid" ||
    value.result === "no-coke"
  );

  return (
    typeof value.id === "string" &&
    typeof value.date === "string" &&
    (
      typeof value.participantId === "string" ||
      value.participantId === null
    ) &&
    typeof value.participantName === "string" &&
    validParticipantType &&
    validResult
  );
};

const isExportedData = (value: unknown): value is ExportedData => {
  if (!isObject(value)) return false;

  return (
    Array.isArray(value.fixedParticipants) &&
    Array.isArray(value.sporadicParticipants) &&
    Array.isArray(value.history) &&
    value.fixedParticipants.every(isFixedParticipant) &&
    value.sporadicParticipants.every(isSporadicParticipant) &&
    value.history.every(isHistory)
  );
};

export default function DataSection() {
  const [importStatus, setImportStatus] = useState<ImportStatus>("idle");
  const [importMessage, setImportMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const exportData = useStore((state) => state.exportData);
  const importData = useStore((state) => state.importData);

  const handleExport = () => {
    const data = JSON.stringify(exportData(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "quem-vai-pagar-a-coca.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsedData: unknown = JSON.parse(String(reader.result));

        if (!isExportedData(parsedData)) {
          throw new Error("Formato invalido.");
        }

        importData(parsedData);
        setImportStatus("success");
        setImportMessage("Dados importados com sucesso.");
      } catch {
        setImportStatus("error");
        setImportMessage("Nao foi possivel importar este arquivo JSON.");
      }
    };

    reader.readAsText(file);
  };

  return (
    <Stack spacing={3}>
      {importStatus !== "idle" && (
        <Alert severity={importStatus}>
          {importMessage}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h5">
                  Dados
                </Typography>

                <Typography color="text.secondary">
                  Exporte um backup ou restaure dados salvos anteriormente.
                </Typography>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button variant="outlined" onClick={handleExport}>
                  Exportar JSON
                </Button>

                <Button
                  variant="contained"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Importar JSON
                </Button>
              </Stack>
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              hidden
              onChange={handleImportFile}
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
