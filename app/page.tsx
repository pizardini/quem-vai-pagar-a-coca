"use client";

import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import AddParticipantDialog from "@/components/AddParticipantDialog";
import Layout from "@/components/Layout";
import { useStore, Payer } from "@/store/useStore";
import { FixedParticipant } from "@/types/FixedParticipant";
import { History } from "@/types/History";

interface SortableFixedItemProps {
  participant: FixedParticipant;
  index: number;
  onRemove: (id: string) => void;
}

const createNoParticipantPayer = (): Payer => ({
  id: null,
  name: "Nenhum participante cadastrado",
  type: "none",
});

function SortableFixedItem({
  participant,
  index,
  onRemove,
}: SortableFixedItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: participant.id });

  return (
    <ListItem
      ref={setNodeRef}
      disablePadding
      secondaryAction={
        <Button
          color="error"
          size="small"
          onClick={() => onRemove(participant.id)}
        >
          Excluir
        </Button>
      }
      sx={{
        mb: 1,
        opacity: isDragging ? 0.6 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <ListItemButton
        {...attributes}
        {...listeners}
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          cursor: "grab",
          pr: 12,
        }}
      >
        <ListItemText
          primary={`${index + 1}. ${participant.name}`}
          secondary={index === 0 ? "Proximo da fila fixa" : undefined}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default function HomePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSporadicIds, setSelectedSporadicIds] = useState<string[]>([]);
  const [confirmedPayer, setConfirmedPayer] = useState<Payer | null>(null);

  const fixedParticipants = useStore((state) => state.fixedParticipants);
  const sporadicParticipants = useStore((state) => state.sporadicParticipants);
  const removeFixedParticipant = useStore((state) => state.removeFixedParticipant);
  const removeSporadicParticipant = useStore(
    (state) => state.removeSporadicParticipant
  );
  const reorderFixedParticipants = useStore(
    (state) => state.reorderFixedParticipants
  );
  const registerMeetingPresence = useStore(
    (state) => state.registerMeetingPresence
  );
  const finishMeeting = useStore((state) => state.finishMeeting);

  const sensors = useSensors(useSensor(PointerSensor));
  const fixedLimit = Math.max(fixedParticipants.length, 1);
  const currentPayer = confirmedPayer ?? (
    fixedParticipants[0]
      ? {
        id: fixedParticipants[0].id,
        name: fixedParticipants[0].name,
        type: "fixed" as const,
      }
      : createNoParticipantPayer()
  );

  const pendingPresentCount = useMemo(() => (
    sporadicParticipants.filter((participant) => (
      participant.pendingPayment &&
      selectedSporadicIds.includes(participant.id)
    )).length
  ), [selectedSporadicIds, sporadicParticipants]);

  const toggleSporadicPresence = (id: string) => {
    setConfirmedPayer(null);
    setSelectedSporadicIds((current) => (
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    ));
  };

  const handleConfirmPresence = () => {
    const payer = registerMeetingPresence(selectedSporadicIds);
    setConfirmedPayer(payer);
  };

  const handleFinishMeeting = (result: History["result"]) => {
    finishMeeting(confirmedPayer ?? currentPayer, result);
    setConfirmedPayer(null);
    setSelectedSporadicIds([]);
  };

  const handleNoCoke = () => {
    const payer = confirmedPayer ?? registerMeetingPresence(selectedSporadicIds);

    finishMeeting(payer, "no-coke");
    setConfirmedPayer(null);
    setSelectedSporadicIds([]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = fixedParticipants.findIndex(
      (participant) => participant.id === active.id
    );
    const newIndex = fixedParticipants.findIndex(
      (participant) => participant.id === over.id
    );

    if (oldIndex < 0 || newIndex < 0) return;

    reorderFixedParticipants(
      arrayMove(fixedParticipants, oldIndex, newIndex)
    );
  };

  return (
    <Layout>
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">
                Quem vai pagar hoje?
              </Typography>

              <Box>
                <Typography variant="h3" component="p">
                  {currentPayer.name}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}
                >
                  <Chip
                    label={
                      currentPayer.type === "sporadic"
                        ? "Esporadico pendente"
                        : currentPayer.type === "fixed"
                          ? "Fila fixa"
                          : "Sem pagador"
                    }
                    color={
                      currentPayer.type === "sporadic"
                        ? "secondary"
                        : "primary"
                    }
                  />

                  {confirmedPayer ? (
                    <Chip label="Presencas confirmadas" />
                  ) : (
                    <Chip label="Confirme as presencas do encontro" />
                  )}
                </Stack>
              </Box>

              <Divider />

              <Typography variant="h6">
                Participantes esporadicos presentes
              </Typography>

              {sporadicParticipants.length === 0 ? (
                <Typography color="text.secondary">
                  Nenhum participante esporadico cadastrado.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {sporadicParticipants.map((participant) => (
                    <FormControlLabel
                      key={participant.id}
                      control={
                        <Checkbox
                          checked={selectedSporadicIds.includes(participant.id)}
                          onChange={() => toggleSporadicPresence(participant.id)}
                        />
                      }
                      label={`${participant.name} (${participant.participations}/${fixedLimit})${
                        participant.pendingPayment ? " - pendente" : ""
                      }`}
                    />
                  ))}
                </Stack>
              )}

              {pendingPresentCount > 0 && !confirmedPayer && (
                <Alert severity="info">
                  Ha esporadico pendente presente; ele tera prioridade ao
                  confirmar.
                </Alert>
              )}

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button
                  variant="contained"
                  onClick={handleConfirmPresence}
                >
                  Confirmar presencas
                </Button>

                <Button
                  variant="outlined"
                  color="success"
                  disabled={!confirmedPayer || confirmedPayer.type === "none"}
                  onClick={() => handleFinishMeeting("paid")}
                >
                  Pagou
                </Button>

                <Button
                  variant="outlined"
                  color="warning"
                  disabled={!confirmedPayer || confirmedPayer.type === "none"}
                  onClick={() => handleFinishMeeting("not-paid")}
                >
                  Nao pagou
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleNoCoke}
                >
                  Nao houve Coca hoje
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack spacing={2}>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    gap: 2,
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h6">
                      Fila fixa
                    </Typography>
                    <Typography color="text.secondary">
                      Total: {fixedParticipants.length}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => setDialogOpen(true)}
                  >
                    Adicionar
                  </Button>
                </Box>

                <Divider />

                {fixedParticipants.length === 0 ? (
                  <Typography color="text.secondary">
                    Nenhum participante fixo cadastrado.
                  </Typography>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={fixedParticipants.map((participant) => participant.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <List disablePadding>
                        {fixedParticipants.map((participant, index) => (
                          <SortableFixedItem
                            key={participant.id}
                            participant={participant}
                            index={index}
                            onRemove={removeFixedParticipant}
                          />
                        ))}
                      </List>
                    </SortableContext>
                  </DndContext>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">
                  Esporadicos
                </Typography>

                <Typography color="text.secondary">
                  Limite para pagar: {fixedLimit} participacoes.
                </Typography>

                <Divider />

                {sporadicParticipants.length === 0 ? (
                  <Typography color="text.secondary">
                    Nenhum participante esporadico cadastrado.
                  </Typography>
                ) : (
                  <List disablePadding>
                    {sporadicParticipants.map((participant) => (
                      <ListItem
                        key={participant.id}
                        disablePadding
                        secondaryAction={
                          <Button
                            color="error"
                            size="small"
                            onClick={() => removeSporadicParticipant(participant.id)}
                          >
                            Excluir
                          </Button>
                        }
                        sx={{ mb: 1 }}
                      >
                        <ListItemText
                          primary={participant.name}
                          secondary={`${participant.participations}/${fixedLimit} participacoes`}
                          sx={{ pr: 12 }}
                        />
                        {participant.pendingPayment && (
                          <Chip
                            label="Pendente"
                            color="secondary"
                            size="small"
                            sx={{ mr: 9 }}
                          />
                        )}
                      </ListItem>
                    ))}
                  </List>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>

      </Stack>

      <AddParticipantDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </Layout>
  );
}
