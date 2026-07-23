"use client";

import Layout from "@/components/Layout";

import Typography from "@mui/material/Typography";

import { useStore } from "@/store/useStore";

export default function HomePage() {

    const fixedParticipants = useStore(
        (state) => state.fixedParticipants
    );

    const sporadicParticipants = useStore(
        (state) => state.sporadicParticipants
    );

    return (

        <Layout>

            <Typography variant="h5">

                Bem-vindo!

            </Typography>

            <Typography>

                Participantes fixos:

                {" "}

                {fixedParticipants.length}

            </Typography>

            <Typography>

                Participantes esporádicos:

                {" "}

                {sporadicParticipants.length}

            </Typography>

        </Layout>

    );

}