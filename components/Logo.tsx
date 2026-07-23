import LocalDrinkRoundedIcon from "@mui/icons-material/LocalDrinkRounded";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Logo() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <LocalDrinkRoundedIcon
        color="primary"
        sx={{
          fontSize: 38,
        }}
      />

      <Box>
        <Typography
          sx={{
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          Quem vai pagar
        </Typography>

        <Typography
          color="primary"
          sx={{
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          a Coca?
        </Typography>
      </Box>
    </Box>
  );
}