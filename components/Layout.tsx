"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
// import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";

import Logo from "./Logo";
import MobileDrawer from "./MobileDrawer";

import { useStore } from "@/store/useStore";

interface LayoutProps {
  children: React.ReactNode;
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

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

    const currentPath =
    pathname === "/"
      ? "/"
      : pathname.replace(/\/+$/, "");

  const fixedParticipants = useStore((state) => state.fixedParticipants);
  const sporadicParticipants = useStore((state) => state.sporadicParticipants);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
            display:{
                xs:"block",
                md:"none",
            }
        }}
      >
        <Toolbar>

            <IconButton
                edge="start"
                color="inherit"
                onClick={() => setMobileOpen(true)}
            >
                <MenuRoundedIcon/>
            </IconButton>

            <Box
                sx={{
                    ml:2,
                }}
            >
                <Logo/>
            </Box>

        </Toolbar>
        </AppBar>

        <Box
            sx={{
                display:"grid",

                gap:{
                    xs:2,
                    md:3,
                },

                p:{
                    xs:2,
                    md:4,
                },

                gridTemplateColumns:{
                    xs:"1fr",
                    md:"280px 1fr",
                },

                alignItems:"start",
            }}
        >
        <Paper
          elevation={2}
          sx={{
            display:{
                xs:"none",
                md:"block",
            },
            borderRadius: 3,
            overflow: "hidden",
            position: {
              md: "sticky",
            },
            top: 24,
          }}
        >
          <Box
            sx={{
              p: 3,
              py: 4,
              bgcolor: "grey.50",
            }}
          >
            <Logo />
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
                  sx={{
                    mb: 1,
                    borderRadius: 2,

                    "&.Mui-selected": {
                        bgcolor: "primary.50",
                        color: "primary.main",
                        transition: "all .2s",
                    },

                    "&.Mui-selected:hover": {
                      bgcolor: "rgba(198,40,40,.14)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 42,
                      color: selected ? "primary.main" : "text.secondary",
                      transition: "color .2s",
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
        </Paper>

        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            p: {
              xs: 2,
              md: 4,
            },
            minHeight:{
                xs:"calc(100vh - 90px)",
                md:"80vh",
            },
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
}