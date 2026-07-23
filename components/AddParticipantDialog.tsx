"use client";

import { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { useStore } from "@/store/useStore";

interface AddParticipantDialogProps {
  open: boolean;
  onClose: () => void;
}

type ParticipantType = "fixed" | "sporadic";

export default function AddParticipantDialog({
  open,
  onClose,
}: AddParticipantDialogProps) {
  const addFixedParticipant = useStore(
    (state) => state.addFixedParticipant
  );
  const addSporadicParticipant = useStore(
    (state) => state.addSporadicParticipant
  );

  const [name, setName] = useState("");
  const [type, setType] = useState<ParticipantType>("fixed");

  const handleClose = () => {
    setName("");
    setType("fixed");
    onClose();
  };

  const handleSave = () => {
    const participantName = name.trim();

    if (participantName.length === 0) return;

    if (type === "fixed") {
      addFixedParticipant(participantName);
    } else {
      addSporadicParticipant(participantName);
    }

    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Adicionar participante
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="normal"
          label="Nome"
          fullWidth
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>
            Tipo
          </InputLabel>

          <Select
            label="Tipo"
            value={type}
            onChange={(event) => (
              setType(event.target.value as ParticipantType)
            )}
          >
            <MenuItem value="fixed">
              Participante fixo
            </MenuItem>

            <MenuItem value="sporadic">
              Participante esporádico
            </MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancelar
        </Button>

        <Button variant="contained" onClick={handleSave}>
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
