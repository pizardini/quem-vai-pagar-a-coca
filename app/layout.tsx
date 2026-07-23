import Providers from "./providers";

export const metadata = {
  title: "Quem vai pagar a Coca?",
  description: "Controle da fila da Coca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}