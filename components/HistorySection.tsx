"use client";

import {
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import { useStore } from "@/store/useStore";
import { History } from "@/types/History";

const resultLabels: Record<History["result"], string> = {
  paid: "Pagou",
  "not-paid": "Nao pagou",
  "no-coke": "Nao houve Coca",
};

const participantTypeLabels: Record<History["participantType"], string> = {
  fixed: "Fixo",
  sporadic: "Esporádico",
  none: "Sem participante",
};

export default function HistorySection() {
  const history = useStore((state) => state.history);

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5">
            Historico
          </Typography>

          <Divider />

          {history.length === 0 ? (
            <Typography color="text.secondary">
              Nenhum encontro registrado.
            </Typography>
          ) : (
            <List disablePadding>
              {history.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    px: 0,
                  }}
                >
                  <ListItemText
                    primary={`${item.participantName} - ${resultLabels[item.result]}`}
                    secondary={`${new Date(item.date).toLocaleString("pt-BR")} - ${
                      participantTypeLabels[item.participantType]
                    }`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
