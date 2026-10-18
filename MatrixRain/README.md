# Matrix Rain — Expo SDK 57

Versão preparada para Expo SDK 57 e React Native 0.86, mantendo a interface e a animação do projeto original.

## Como executar no Windows

1. Extraia esta pasta.
2. Abra o CMD dentro da pasta `MatrixRain` (a pasta que contém `package.json`).
3. Execute:

```cmd
npm install
npx expo install --fix
npx expo start --tunnel
```

4. Quando o QR Code aparecer, abra o Expo Go no Android e leia o código.

O comando `npx expo install --fix` confere e ajusta as versões das dependências para o SDK instalado no projeto. O primeiro `npm install` pode levar alguns minutos.

## Observações

- É necessário que o Expo Go instalado no celular ofereça suporte ao SDK 57.
- Se o Expo Go mostrar incompatibilidade de SDK, atualize o Expo Go pela loja oficial do Android, se houver atualização disponível.
- Não execute `npm audit fix --force`: ele pode alterar versões de forma incompatível.
- A animação é desenhada com componentes `Text` do React Native; não depende de vídeo nem de downloads de recursos externos.
