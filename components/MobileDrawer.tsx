"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Logo from "./Logo";

import { useStore } from "@/store/useStore";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: <DashboardRoundedIcon />,
  },
  {
    href: "/historico",
    label: "Histórico",
    icon: <HistoryRoundedIcon />,
  },
  {
    href: "/dados",
    label: "Dados",
    icon: <SaveRoundedIcon />,
  },
];

export default function MobileDrawer({
  open,
  onClose,
}: MobileDrawerProps) {
  const pathname = usePathname();

  const currentPath =
    pathname === "/"
      ? "/"
      : pathname.replace(/\/+$/, "");

  const fixedParticipants = useStore(
    (state) => state.fixedParticipants
  );

  const sporadicParticipants = useStore(
    (state) => state.sporadicParticipants
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="left"
      sx={{
        display: {
          xs: "block",
          md: "none",
        },
        "& .MuiDrawer-paper": {
          width: 280,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
        }}
      >
        <Logo />

        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <Divider />

      <List
        sx={{
          p: 2,
        }}
      >
        {navigationItems.map((item) => {
          const selected = currentPath === item.href;

          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={selected}
              onClick={onClose}
              sx={{
                mb: 1,
                borderRadius: 2,

                "&.Mui-selected": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "light"
                      ? "rgba(198,40,40,.08)"
                      : "rgba(198,40,40,.20)",

                  color: "primary.main",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 42,
                  color: selected
                    ? "primary.main"
                    : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontWeight: selected ? 700 : 500,
                    }}
                  >
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      <Stack
        spacing={2}
        sx={{
          p: 3,
        }}
      >
        <Typography
          variant="subtitle2"
          color="text.secondary"
        >
          Participantes
        </Typography>

        <Chip
          icon={<GroupsRoundedIcon />}
          color="primary"
          variant="outlined"
          label={`${fixedParticipants.length} participantes fixos`}
        />

        <Chip
          color="secondary"
          variant="outlined"
          label={`${sporadicParticipants.length} participantes esporádicos`}
        />
      </Stack>
    </Drawer>
  );
}